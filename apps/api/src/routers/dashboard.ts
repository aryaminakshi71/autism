/**
 * Dashboard Router
 *
 * Dashboard statistics and metrics.
 */

import { getOrCache } from "@autism-legacy-20260205/storage/redis";
import { and, desc, eq, gte, lt, sql } from "drizzle-orm";
import { z } from "zod";
import type { OrgContext } from "../context";
import { isDemoRequest } from "../lib/demo";
import { getDemoDashboardStats } from "../lib/demo-data";
import { getDb, getReadDb, orgAuthed, schema } from "../procedures";

const { contacts, deals, activities } = schema;

// Helper function to format time ago
function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return then.toLocaleDateString();
}

export const dashboardRouter = {
  /**
   * Get dashboard statistics
   */
  stats: orgAuthed
    .route({
      method: "GET",
      path: "/dashboard/stats",
      summary: "Get dashboard statistics",
      tags: ["Dashboard"],
    })
    .input(z.object({}))
    .output(
      z.object({
        totalContacts: z.number(),
        activeDeals: z.number(),
        conversionRate: z.number(),
        revenue: z.number(),
        contactsChange: z.number(),
        dealsChange: z.number(),
        conversionChange: z.number(),
        revenueChange: z.number(),
        pipeline: z.array(
          z.object({
            stage: z.string(),
            value: z.number(),
            count: z.number(),
          }),
        ),
        recentActivities: z.array(
          z.object({
            id: z.string(),
            type: z.string(),
            message: z.string(),
            time: z.string(),
          }),
        ),
      }),
    )
    .handler(async ({ context }: { context: OrgContext }) => {
      if (isDemoRequest(context)) {
        return getDemoDashboardStats();
      }
      const db = getReadDb(context);
      const orgId = context.organization.id;

      // Cache dashboard stats (5 minutes TTL - analytics data)
      return await getOrCache(
        `dashboard:stats:${orgId}`,
        async () => {
          // Get all contacts
          const now = new Date();
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

          // Aggregate in SQL instead of loading every row into memory.
          const [contactStats] = await db
            .select({
              total: sql<number>`count(*)::int`,
              current: sql<number>`count(*) FILTER (WHERE ${contacts.createdAt} >= ${thirtyDaysAgo})::int`,
            })
            .from(contacts)
            .where(eq(contacts.organizationId, orgId));

          const [dealStats] = await db
            .select({
              total: sql<number>`count(*)::int`,
              active: sql<number>`count(*) FILTER (WHERE ${deals.stage} NOT IN ('won','lost'))::int`,
              won: sql<number>`count(*) FILTER (WHERE ${deals.stage} = 'won')::int`,
              revenue: sql<number>`COALESCE(SUM(${deals.value}::numeric) FILTER (WHERE ${deals.stage} = 'won'), 0)::float`,
              current: sql<number>`count(*) FILTER (WHERE ${deals.createdAt} >= ${thirtyDaysAgo})::int`,
              currentWon: sql<number>`count(*) FILTER (WHERE ${deals.stage} = 'won' AND ${deals.createdAt} >= ${thirtyDaysAgo})::int`,
              currentRevenue: sql<number>`COALESCE(SUM(${deals.value}::numeric) FILTER (WHERE ${deals.stage} = 'won' AND ${deals.createdAt} >= ${thirtyDaysAgo}), 0)::float`,
            })
            .from(deals)
            .where(eq(deals.organizationId, orgId));

          const totalContacts = Number(contactStats?.total ?? 0);
          const currentPeriodContacts = Number(contactStats?.current ?? 0);
          const totalDeals = Number(dealStats?.total ?? 0);
          const activeDeals = Number(dealStats?.active ?? 0);
          const wonDeals = Number(dealStats?.won ?? 0);
          const revenue = Number(dealStats?.revenue ?? 0);
          const currentPeriodDeals = Number(dealStats?.current ?? 0);
          const currentPeriodWonDeals = Number(dealStats?.currentWon ?? 0);
          const currentPeriodRevenue = Number(dealStats?.currentRevenue ?? 0);

          const conversionRate =
            totalDeals > 0 ? Math.round((wonDeals / totalDeals) * 100) : 0;

          // Previous-period metrics run in parallel (one round trip).
          const [prevPeriodContacts, prevPeriodDeals, prevPeriodWonDeals] =
            await Promise.all([
              db
                .select({ count: sql<number>`count(*)::int` })
                .from(contacts)
                .where(
                  and(
                    eq(contacts.organizationId, orgId),
                    gte(contacts.createdAt, sixtyDaysAgo),
                    lt(contacts.createdAt, thirtyDaysAgo),
                  ),
                )
                .then((r: { count: number }[]) => r[0]?.count || 0),
              db
                .select({ count: sql<number>`count(*)::int` })
                .from(deals)
                .where(
                  and(
                    eq(deals.organizationId, orgId),
                    gte(deals.createdAt, sixtyDaysAgo),
                    lt(deals.createdAt, thirtyDaysAgo),
                  ),
                )
                .then((r: { count: number }[]) => r[0]?.count || 0),
              db
                .select({
                  count: sql<number>`count(*)::int`,
                  revenue: sql<number>`COALESCE(SUM(${deals.value}::numeric), 0)::numeric`,
                })
                .from(deals)
                .where(
                  and(
                    eq(deals.organizationId, orgId),
                    eq(deals.stage, "won"),
                    gte(deals.createdAt, sixtyDaysAgo),
                    lt(deals.createdAt, thirtyDaysAgo),
                  ),
                )
                .then((r: { count: number; revenue: number }[]) => ({
                  count: r[0]?.count || 0,
                  revenue: Number(r[0]?.revenue || 0),
                })),
            ]);

          // Calculate percentage changes
          const calculateChange = (
            current: number,
            previous: number,
          ): number => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
          };

          const contactsChange = calculateChange(
            currentPeriodContacts,
            prevPeriodContacts,
          );
          const dealsChange = calculateChange(
            currentPeriodDeals,
            prevPeriodDeals,
          );

          const prevConversionRate =
            prevPeriodDeals > 0
              ? Math.round((prevPeriodWonDeals.count / prevPeriodDeals) * 100)
              : 0;
          const currentConversionRate =
            currentPeriodDeals > 0
              ? Math.round((currentPeriodWonDeals / currentPeriodDeals) * 100)
              : 0;
          const conversionChange =
            prevConversionRate === 0
              ? currentConversionRate > 0
                ? 100
                : 0
              : Math.round(
                  ((currentConversionRate - prevConversionRate) /
                    prevConversionRate) *
                    100,
                );

          const revenueChange = calculateChange(
            currentPeriodRevenue,
            prevPeriodWonDeals.revenue,
          );

          // Pipeline stats in SQL.
          const pipelineRows = await db
            .select({
              stage: deals.stage,
              count: sql<number>`count(*)::int`,
              value: sql<number>`COALESCE(SUM(${deals.value}::numeric), 0)::float`,
            })
            .from(deals)
            .where(eq(deals.organizationId, orgId))
            .groupBy(deals.stage);

          const pipeline = [
            { stage: "lead", value: 0, count: 0 },
            { stage: "qualified", value: 0, count: 0 },
            { stage: "proposal", value: 0, count: 0 },
            { stage: "negotiation", value: 0, count: 0 },
            { stage: "won", value: 0, count: 0 },
          ];
          for (const row of pipelineRows) {
            const idx = pipeline.findIndex((p) => p.stage === row.stage);
            if (idx >= 0) {
              pipeline[idx].count = Number(row.count);
              pipeline[idx].value = Number(row.value);
            }
          }

          // Recent activities
          const recentActivities = await db
            .select()
            .from(activities)
            .where(eq(activities.organizationId, orgId))
            .orderBy(desc(activities.createdAt))
            .limit(10)
            .then((rows: Array<typeof activities.$inferSelect>) =>
              rows.map((activity) => ({
                id: activity.id,
                type: activity.type,
                message: `${activity.type}: ${activity.subject}`,
                time: formatTimeAgo(activity.createdAt),
              })),
            );

          return {
            totalContacts,
            activeDeals,
            conversionRate,
            revenue: Math.round(revenue),
            contactsChange,
            dealsChange,
            conversionChange,
            revenueChange,
            pipeline,
            recentActivities,
          };
        },
        300, // 5 minutes TTL for analytics
      );
    }),
};
