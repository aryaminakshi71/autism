/**
 * Dashboard Router
 *
 * Dashboard statistics and metrics.
 */

import { getOrCache } from "@autism-legacy-20260205/storage/redis";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import type { OrgContext } from "../context";
import { isDemoRequest } from "../lib/demo";
import { getDemoDashboardStats } from "../lib/demo-data";
import { getDb, orgAuthed, schema } from "../procedures";

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
      const db = getDb(context);
      const orgId = context.organization.id;

      // Cache dashboard stats (5 minutes TTL - analytics data)
      return await getOrCache(
        `dashboard:stats:${orgId}`,
        async () => {
          // Get all contacts
          const allContacts = await db
            .select()
            .from(contacts)
            .where(eq(contacts.organizationId, orgId));
          const totalContacts = allContacts.length;

          // Get all deals
          const allDeals = await db
            .select()
            .from(deals)
            .where(eq(deals.organizationId, orgId));

          const activeDeals = allDeals.filter(
            (d: any) => d.stage !== "won" && d.stage !== "lost",
          ).length;
          const wonDeals = allDeals.filter(
            (d: any) => d.stage === "won",
          ).length;
          const totalDeals = allDeals.length;

          const conversionRate =
            totalDeals > 0 ? Math.round((wonDeals / totalDeals) * 100) : 0;

          const revenue = allDeals
            .filter((d: any) => d.stage === "won")
            .reduce(
              (sum: number, d: any) => sum + (parseFloat(d.value) || 0),
              0,
            );

          // Calculate changes (simplified - would need previous period data)
          const contactsChange = 0; // TODO: Calculate from previous period
          const dealsChange = 0;
          const conversionChange = 0;
          const revenueChange = 0;

          // Pipeline stats
          const pipeline = [
            { stage: "lead", value: 0, count: 0 },
            { stage: "qualified", value: 0, count: 0 },
            { stage: "proposal", value: 0, count: 0 },
            { stage: "negotiation", value: 0, count: 0 },
            { stage: "won", value: 0, count: 0 },
          ];

          allDeals.forEach((deal: any) => {
            const stageIndex = pipeline.findIndex(
              (p) => p.stage === deal.stage,
            );
            if (stageIndex >= 0) {
              pipeline[stageIndex].count++;
              pipeline[stageIndex].value += parseFloat(deal.value) || 0;
            }
          });

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
