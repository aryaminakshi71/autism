/**
 * Goals Router
 *
 * Goal management operations for autism care.
 */

import {
  getOrCache,
  invalidateCache,
} from "@autism-legacy-20260205/storage/redis";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import type { OrgContext } from "../context";
import { trackQuery } from "../lib/db-performance";
import { isDemoRequest } from "../lib/demo";
import {
  createDemoGoal,
  deleteDemoGoal,
  getDemoGoal,
  getDemoGoals,
  updateDemoGoal,
} from "../lib/demo-data";
import { getDb, orgAuthed, schema } from "../procedures";

const { goals } = schema;

export const goalsRouter = {
  /**
   * List goals
   */
  list: orgAuthed
    .route({
      method: "GET",
      path: "/goals",
      summary: "List goals",
      tags: ["Goals"],
    })
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(200).default(50),
        patientId: z.string().optional(),
        status: z.string().optional(),
      }),
    )
    .output(
      z.object({
        data: z.array(z.any()),
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
      }),
    )
    .handler(
      async ({
        context,
        input,
      }: {
        context: OrgContext;
        input: {
          page: number;
          limit: number;
          patientId?: string;
          status?: string;
        };
      }) => {
        if (isDemoRequest(context)) {
          return getDemoGoals(
            input.page,
            input.limit,
            input.patientId,
            input.status,
          );
        }
        const db = getDb(context);
        const offset = (input.page - 1) * input.limit;

        const conditions = [eq(goals.organizationId, context.organization.id)];
        if (input.patientId) {
          conditions.push(eq(goals.patientId, input.patientId));
        }
        if (input.status) {
          conditions.push(eq(goals.status, input.status));
        }

        const cacheKey = `goals:list:${context.organization.id}:${input.page}:${input.limit}:${input.patientId || "none"}:${input.status || "none"}`;

        return getOrCache(
          cacheKey,
          async () => {
            const allGoals: any[] = await trackQuery("listGoalsCount", () =>
              db
                .select()
                .from(goals)
                .where(and(...conditions)),
            );
            const total = allGoals.length;

            const paginatedGoals: any[] = await trackQuery(
              "listGoalsPaginated",
              () =>
                db
                  .select()
                  .from(goals)
                  .where(and(...conditions))
                  .orderBy(desc((goals as any).createdAt))
                  .limit(input.limit)
                  .offset(offset),
            );

            return {
              data: paginatedGoals as any[],
              total,
              page: input.page,
              limit: input.limit,
              totalPages: Math.ceil(total / input.limit),
            };
          },
          300,
        );
      },
    ),

  /**
   * Get a single goal
   */
  get: orgAuthed
    .route({
      method: "GET",
      path: "/goals/:id",
      summary: "Get goal",
      tags: ["Goals"],
    })
    .input(z.object({ id: z.string() }))
    .output(z.any())
    .handler(
      async ({
        context,
        input,
      }: { context: OrgContext; input: { id: string } }) => {
        if (isDemoRequest(context)) {
          return getDemoGoal(input.id);
        }
        const db = getDb(context);

        const goal = await trackQuery("getGoal", async () => {
          return getOrCache(
            `goal:${input.id}`,
            async () => {
              const [result] = await db
                .select()
                .from(goals)
                .where(eq(goals.id, input.id))
                .limit(1);

              if (!result) {
                throw new Error("Goal not found");
              }

              return result;
            },
            3600,
          );
        });

        return goal;
      },
    ),

  /**
   * Create a new goal
   */
  create: orgAuthed
    .route({
      method: "POST",
      path: "/goals",
      summary: "Create goal",
      tags: ["Goals"],
    })
    .input(
      z.object({
        patientId: z.string(),
        name: z.string().min(1).max(200),
        description: z.string().optional(),
        category: z.string().min(1),
        subcategory: z.string().optional(),
        targetBehavior: z.string().optional(),
        baselineValue: z.number().default(0),
        targetValue: z.number().min(1),
        unit: z.string().default("%"),
        masteryCriteria: z.number().default(80),
        priority: z.string().default("medium"),
        startDate: z.string().optional(),
        targetDate: z.string().optional(),
        domain: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(
      async ({
        context,
        input,
      }: {
        context: OrgContext;
        input: {
          patientId: string;
          name: string;
          description?: string;
          category: string;
          subcategory?: string;
          targetBehavior?: string;
          baselineValue: number;
          targetValue: number;
          unit?: string;
          masteryCriteria?: number;
          priority?: string;
          startDate?: string;
          targetDate?: string;
          domain?: string;
        };
      }) => {
        if (isDemoRequest(context)) {
          return createDemoGoal({
            ...input,
            organizationId: context.organization.id,
            createdBy: context.user.id,
          });
        }
        const db = getDb(context);
        const result = await trackQuery("createGoal", () =>
          db
            .insert(goals)
            .values({
              id: crypto.randomUUID(),
              patientId: input.patientId,
              name: input.name,
              description: input.description || null,
              category: input.category,
              subcategory: input.subcategory || null,
              targetBehavior: input.targetBehavior || null,
              baselineValue: input.baselineValue,
              targetValue: input.targetValue,
              currentValue: input.baselineValue,
              unit: input.unit,
              masteryCriteria: input.masteryCriteria,
              status: "active",
              priority: input.priority,
              startDate: input.startDate ? new Date(input.startDate) : null,
              targetDate: input.targetDate ? new Date(input.targetDate) : null,
              domain: input.domain || null,
              organizationId: context.organization.id,
              createdBy: context.user.id,
            } as any)
            .returning(),
        );
        const goal =
          Array.isArray(result) && result.length > 0 ? result[0] : null;

        await invalidateCache(`goals:list:${context.organization.id}`);

        return goal;
      },
    ),

  /**
   * Update a goal
   */
  update: orgAuthed
    .route({
      method: "PATCH",
      path: "/goals/:id",
      summary: "Update goal",
      tags: ["Goals"],
    })
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(200).optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        subcategory: z.string().optional(),
        targetBehavior: z.string().optional(),
        baselineValue: z.number().optional(),
        targetValue: z.number().optional(),
        currentValue: z.number().optional(),
        unit: z.string().optional(),
        masteryCriteria: z.number().optional(),
        status: z.string().optional(),
        priority: z.string().optional(),
        startDate: z.string().optional(),
        targetDate: z.string().optional(),
        domain: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(
      async ({
        context,
        input,
      }: {
        context: OrgContext;
        input: {
          id: string;
          name?: string;
          description?: string;
          category?: string;
          subcategory?: string;
          targetBehavior?: string;
          baselineValue?: number;
          targetValue?: number;
          currentValue?: number;
          unit?: string;
          masteryCriteria?: number;
          status?: string;
          priority?: string;
          startDate?: string;
          targetDate?: string;
          domain?: string;
        };
      }) => {
        if (isDemoRequest(context)) {
          return updateDemoGoal(input.id, input);
        }
        const db = getDb(context);
        const { id, ...updateData } = input;

        const filteredData: Record<string, unknown> = {};
        Object.entries(updateData).forEach(([key, value]) => {
          if (value !== undefined) {
            if (key === "startDate" || key === "targetDate") {
              filteredData[key] = value ? new Date(value) : null;
            } else {
              filteredData[key] = value;
            }
          }
        });

        const result = await trackQuery("updateGoal", () =>
          db
            .update(goals)
            .set(filteredData as any)
            .where(eq((goals as any).id, id))
            .returning(),
        );
        const goal =
          Array.isArray(result) && result.length > 0 ? result[0] : null;

        if (!goal) {
          throw new Error("Goal not found");
        }

        await invalidateCache(`goal:${input.id}`);
        await invalidateCache(`goals:list:${context.organization.id}`);

        return goal;
      },
    ),

  /**
   * Delete a goal
   */
  delete: orgAuthed
    .route({
      method: "DELETE",
      path: "/goals/:id",
      summary: "Delete goal",
      tags: ["Goals"],
    })
    .input(z.object({ id: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .handler(
      async ({
        context,
        input,
      }: { context: OrgContext; input: { id: string } }) => {
        if (isDemoRequest(context)) {
          return deleteDemoGoal(input.id);
        }
        const db = getDb(context);
        await trackQuery("deleteGoal", () =>
          db.delete(goals).where(eq(goals.id, input.id)),
        );

        await invalidateCache(`goal:${input.id}`);
        await invalidateCache(`goals:list:${context.organization.id}`);

        return { success: true };
      },
    ),
};
