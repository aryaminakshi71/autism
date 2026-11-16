/**
 * Data Collection Sheets Router
 *
 * Actual data collection instances for ABA therapy sessions.
 * Records data using templates (DTT, Task Analysis, Frequency, etc.)
 */

import {
  getOrCache,
  invalidateCache,
} from "@autism-legacy-20260205/storage/redis";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";
import type { OrgContext } from "../context";
import { isDemoRequest } from "../lib/demo";
import { getDb, orgAuthed } from "../procedures";
import { builtInTemplates } from "./data-collection-templates";

// The local clinical migration uses text IDs. Keep this route aligned with
// that migration instead of the legacy UUID-oriented storage schema.
const dataCollectionTemplates = pgTable("data_collection_templates", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  configuration: jsonb("configuration"),
  isBuiltIn: boolean("is_built_in"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

const dataCollectionSheets = pgTable("data_collection_sheets", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull(),
  templateId: text("template_id").notNull(),
  patientId: text("patient_id").notNull(),
  goalId: text("goal_id"),
  sessionId: text("session_id"),
  name: text("name").notNull(),
  data: jsonb("data"),
  status: text("status").notNull(),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  recordedById: text("recorded_by_id").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

async function ensureBuiltInTemplate(
  db: ReturnType<typeof getDb>,
  context: OrgContext,
  templateId: string,
) {
  const template = builtInTemplates.find((item) => item.id === templateId);
  if (!template) return;
  const now = new Date();
  await db
    .insert(dataCollectionTemplates)
    .values({
      id: template.id,
      organizationId: context.organization.id,
      name: template.name,
      description: template.description,
      type: template.type,
      configuration: template.configuration,
      isBuiltIn: true,
      createdBy: context.user.id,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoNothing();
}

// Demo data
const demoSheets: any[] = [
  {
    id: "demo-sheet-001",
    organizationId: "demo-org",
    templateId: "builtin-dtt",
    patientId: "demo-patient-001",
    goalId: "demo-goal-001",
    sessionId: "demo-session-001",
    name: "Manding Session - March 28, 2026",
    data: {
      entries: [
        {
          trialNumber: 1,
          promptLevel: "Gestural",
          response: "Correct",
          latencySeconds: 2.5,
        },
        {
          trialNumber: 2,
          promptLevel: "Verbal",
          response: "Correct",
          latencySeconds: 3.2,
        },
        {
          trialNumber: 3,
          promptLevel: "Model",
          response: "Correct",
          latencySeconds: 4.1,
        },
        {
          trialNumber: 4,
          promptLevel: "Independent",
          response: "Correct",
          latencySeconds: 1.8,
        },
        {
          trialNumber: 5,
          promptLevel: "Independent",
          response: "Incorrect",
          latencySeconds: 5.0,
        },
      ],
      summary: {
        totalTrials: 5,
        correctTrials: 4,
        percentage: 80,
      },
    },
    status: "completed",
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    recordedById: "demo-therapist-001",
    notes: "Good progress on independent manding",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-sheet-002",
    organizationId: "demo-org",
    templateId: "builtin-task-analysis",
    patientId: "demo-patient-001",
    goalId: "demo-goal-002",
    sessionId: "demo-session-002",
    name: "Hand Washing Task Analysis",
    data: {
      entries: [
        {
          stepNumber: 1,
          stepDescription: "Turn on water",
          completed: true,
          promptLevel: "Independent",
        },
        {
          stepNumber: 2,
          stepDescription: "Wet hands",
          completed: true,
          promptLevel: "Minimal",
        },
        {
          stepNumber: 3,
          stepDescription: "Get soap",
          completed: true,
          promptLevel: "Moderate",
        },
        {
          stepNumber: 4,
          stepDescription: "Rub hands together",
          completed: false,
          promptLevel: "Maximum",
        },
        {
          stepNumber: 5,
          stepDescription: "Rinse hands",
          completed: true,
          promptLevel: "Minimal",
        },
        {
          stepNumber: 6,
          stepDescription: "Turn off water",
          completed: true,
          promptLevel: "Independent",
        },
        {
          stepNumber: 7,
          stepDescription: "Dry hands",
          completed: true,
          promptLevel: "Independent",
        },
      ],
      summary: {
        totalSteps: 7,
        completedSteps: 6,
        percentage: 85.7,
      },
    },
    status: "completed",
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    recordedById: "demo-therapist-001",
    notes: "Need to work on step 4 - rubbing hands",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Helper functions for calculations
const calculateDTTStats = (entries: any[]) => {
  const total = entries.length;
  const correct = entries.filter((e) => e.response === "Correct").length;
  return {
    totalTrials: total,
    correctTrials: correct,
    percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
  };
};

const calculateTaskAnalysisStats = (entries: any[]) => {
  const total = entries.length;
  const completed = entries.filter((e) => e.completed).length;
  return {
    totalSteps: total,
    completedSteps: completed,
    percentage: total > 0 ? Math.round((completed / total) * 100 * 10) / 10 : 0,
  };
};

const calculateFrequencyStats = (entries: any[]) => {
  const totalCount = entries.reduce((sum, e) => sum + (e.count || 0), 0);
  const totalMinutes = entries.reduce(
    (sum, e) => sum + (e.observationPeriod || 0),
    0,
  );
  return {
    totalCount,
    rate:
      totalMinutes > 0
        ? Math.round((totalCount / totalMinutes) * 100) / 100
        : 0,
    unit: "per minute",
  };
};

const getDemoSheets = (
  page: number,
  limit: number,
  patientId?: string,
  goalId?: string,
  sessionId?: string,
  status?: string,
) => {
  let filtered = [...demoSheets];

  if (patientId) {
    filtered = filtered.filter((s) => s.patientId === patientId);
  }
  if (goalId) {
    filtered = filtered.filter((s) => s.goalId === goalId);
  }
  if (sessionId) {
    filtered = filtered.filter((s) => s.sessionId === sessionId);
  }
  if (status) {
    filtered = filtered.filter((s) => s.status === status);
  }

  const total = filtered.length;
  const offset = (page - 1) * limit;
  const data = filtered.slice(offset, offset + limit);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getDemoSheet = (id: string) => {
  return demoSheets.find((s) => s.id === id) || null;
};

export const dataCollectionSheetsRouter = {
  /**
   * List data collection sheets
   */
  list: orgAuthed
    .route({
      method: "GET",
      path: "/data-collection-sheets",
      summary: "List data collection sheets",
      tags: ["Data Collection"],
    })
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(200).default(50),
        patientId: z.string().optional(),
        goalId: z.string().optional(),
        sessionId: z.string().optional(),
        status: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
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
          goalId?: string;
          sessionId?: string;
          status?: string;
          startDate?: string;
          endDate?: string;
        };
      }) => {
        if (isDemoRequest(context)) {
          return getDemoSheets(
            input.page,
            input.limit,
            input.patientId,
            input.goalId,
            input.sessionId,
            input.status,
          );
        }

        const db = getDb(context);
        const offset = (input.page - 1) * input.limit;

        const conditions = [
          eq(dataCollectionSheets.organizationId, context.organization.id),
        ];
        if (input.patientId) {
          conditions.push(eq(dataCollectionSheets.patientId, input.patientId));
        }
        if (input.goalId) {
          conditions.push(eq(dataCollectionSheets.goalId, input.goalId));
        }
        if (input.sessionId) {
          conditions.push(eq(dataCollectionSheets.sessionId, input.sessionId));
        }
        if (input.status) {
          conditions.push(eq(dataCollectionSheets.status, input.status));
        }
        if (input.startDate) {
          conditions.push(
            gte(dataCollectionSheets.startedAt, new Date(input.startDate)),
          );
        }
        if (input.endDate) {
          conditions.push(
            lte(dataCollectionSheets.startedAt, new Date(input.endDate)),
          );
        }

        const cacheKey = `sheets:list:${context.organization.id}:${input.page}:${input.limit}:${input.patientId || "none"}:${input.goalId || "none"}:${input.status || "none"}`;

        return getOrCache(
          cacheKey,
          async () => {
            const allSheets = await db
              .select()
              .from(dataCollectionSheets)
              .where(and(...conditions));
            const total = allSheets.length;

            const paginatedSheets = await db
              .select()
              .from(dataCollectionSheets)
              .where(and(...conditions))
              .orderBy(desc(dataCollectionSheets.createdAt))
              .limit(input.limit)
              .offset(offset);

            return {
              data: paginatedSheets,
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
   * Get single data collection sheet
   */
  get: orgAuthed
    .route({
      method: "GET",
      path: "/data-collection-sheets/:id",
      summary: "Get data collection sheet",
      tags: ["Data Collection"],
    })
    .input(
      z.object({
        id: z.string().min(1),
      }),
    )
    .output(z.any())
    .handler(
      async ({
        context,
        input,
      }: {
        context: OrgContext;
        input: { id: string };
      }) => {
        if (isDemoRequest(context)) {
          return getDemoSheet(input.id);
        }

        const db = getDb(context);

        const cacheKey = `sheets:get:${context.organization.id}:${input.id}`;

        return getOrCache(
          cacheKey,
          async () => {
            const [result] = await db
              .select()
              .from(dataCollectionSheets)
              .where(
                and(
                  eq(dataCollectionSheets.id, input.id),
                  eq(
                    dataCollectionSheets.organizationId,
                    context.organization.id,
                  ),
                ),
              )
              .limit(1);

            return result || null;
          },
          300,
        );
      },
    ),

  /**
   * Create data collection sheet
   */
  create: orgAuthed
    .route({
      method: "POST",
      path: "/data-collection-sheets",
      summary: "Create data collection sheet",
      tags: ["Data Collection"],
    })
    .input(
      z.object({
        templateId: z.string().min(1),
        patientId: z.string().min(1),
        goalId: z.string().min(1).optional(),
        sessionId: z.string().min(1).optional(),
        name: z.string().min(1).max(255),
        notes: z.string().optional(),
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
          templateId: string;
          patientId: string;
          goalId?: string;
          sessionId?: string;
          name: string;
          notes?: string;
        };
      }) => {
        if (isDemoRequest(context)) {
          const sheet = {
            id: `demo-sheet-${Date.now()}`,
            organizationId: context.organization.id,
            ...input,
            data: { entries: [] },
            status: "in_progress",
            startedAt: new Date().toISOString(),
            recordedById: context.user.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          // Keep demo requests coherent for the lifetime of the API process.
          // Previously create returned an object that addEntry could never find.
          demoSheets.unshift(sheet);
          return sheet;
        }

        const db = getDb(context);
        await ensureBuiltInTemplate(db, context, input.templateId);
        const now = new Date();

        const [sheet] = await db
          .insert(dataCollectionSheets)
          .values({
            id: crypto.randomUUID(),
            organizationId: context.organization.id,
            recordedById: context.user.id,
            templateId: input.templateId,
            patientId: input.patientId,
            goalId: input.goalId,
            sessionId: input.sessionId,
            name: input.name,
            data: { entries: [] },
            status: "in_progress",
            notes: input.notes,
            startedAt: now,
            createdAt: now,
            updatedAt: now,
          })
          .returning();

        await invalidateCache(`sheets:list:${context.organization.id}`);

        return sheet;
      },
    ),

  /**
   * Update narrative metadata without replacing the objective entries.
   */
  update: orgAuthed
    .route({
      method: "PATCH",
      path: "/data-collection-sheets/:id",
      summary: "Update data collection sheet metadata",
      tags: ["Data Collection"],
    })
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1).max(255).optional(),
        notes: z.string().max(20_000).optional(),
      }),
    )
    .output(z.any())
    .handler(
      async ({ context, input }: { context: OrgContext; input: { id: string; name?: string; notes?: string } }) => {
        if (isDemoRequest(context)) {
          const sheet = getDemoSheet(input.id);
          if (!sheet) throw new Error("Sheet not found");
          if (input.name !== undefined) sheet.name = input.name;
          if (input.notes !== undefined) sheet.notes = input.notes;
          sheet.updatedAt = new Date().toISOString();
          return sheet;
        }

        const db = getDb(context);
        const [updated] = await db
          .update(dataCollectionSheets)
          .set({
            ...(input.name !== undefined ? { name: input.name } : {}),
            ...(input.notes !== undefined ? { notes: input.notes } : {}),
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(dataCollectionSheets.id, input.id),
              eq(dataCollectionSheets.organizationId, context.organization.id),
            ),
          )
          .returning();
        if (!updated) throw new Error("Sheet not found");
        await invalidateCache(`sheets:list:${context.organization.id}`);
        await invalidateCache(`sheets:get:${context.organization.id}:${input.id}`);
        return updated;
      },
    ),

  /**
   * Add entry to data collection sheet
   */
  addEntry: orgAuthed
    .route({
      method: "POST",
      path: "/data-collection-sheets/:id/entries",
      summary: "Add entry to data collection sheet",
      tags: ["Data Collection"],
    })
    .input(
      z.object({
        id: z.string().min(1),
        // Zod 4 requires explicit key and value schemas for records.
        entry: z.record(z.string(), z.unknown()),
      }),
    )
    .output(z.any())
    .handler(
      async ({
        context,
        input,
      }: {
        context: OrgContext;
        input: { id: string; entry: Record<string, any> };
      }) => {
        if (isDemoRequest(context)) {
          const sheet = getDemoSheet(input.id);
          if (!sheet) throw new Error("Sheet not found");

          sheet.data.entries.push(input.entry);

          // Recalculate summary based on template type
          if (sheet.templateId === "builtin-dtt") {
            sheet.data.summary = calculateDTTStats(sheet.data.entries);
          } else if (sheet.templateId === "builtin-task-analysis") {
            sheet.data.summary = calculateTaskAnalysisStats(sheet.data.entries);
          } else if (sheet.templateId === "builtin-frequency") {
            sheet.data.summary = calculateFrequencyStats(sheet.data.entries);
          }

          sheet.updatedAt = new Date().toISOString();
          return sheet;
        }

        const db = getDb(context);

        // Get current sheet
        const [sheet] = await db
          .select()
          .from(dataCollectionSheets)
          .where(
            and(
              eq(dataCollectionSheets.id, input.id),
              eq(dataCollectionSheets.organizationId, context.organization.id),
            ),
          )
          .limit(1);

        if (!sheet) {
          throw new Error("Sheet not found");
        }

        // Get template to determine calculation method
        const [template] = await db
          .select()
          .from(dataCollectionTemplates)
          .where(eq(dataCollectionTemplates.id, sheet.templateId))
          .limit(1);

        // Add entry
        const currentData = (sheet.data as any) || { entries: [] };
        currentData.entries.push(input.entry);

        // Calculate summary based on template type
        let summary: any = {};
        if (template?.type === "trial_based") {
          summary = calculateDTTStats(currentData.entries);
        } else if (template?.type === "task_analysis") {
          summary = calculateTaskAnalysisStats(currentData.entries);
        } else if (template?.type === "frequency") {
          summary = calculateFrequencyStats(currentData.entries);
        }
        currentData.summary = summary;

        // Update sheet
        const [updated] = await db
          .update(dataCollectionSheets)
          .set({
            data: currentData,
            updatedAt: new Date(),
          })
          .where(eq(dataCollectionSheets.id, input.id))
          .returning();

        // Invalidate caches
        await invalidateCache(`sheets:list:${context.organization.id}`);
        await invalidateCache(
          `sheets:get:${context.organization.id}:${input.id}`,
        );

        return updated;
      },
    ),

  /**
   * Complete data collection sheet
   */
  complete: orgAuthed
    .route({
      method: "POST",
      path: "/data-collection-sheets/:id/complete",
      summary: "Complete data collection sheet",
      tags: ["Data Collection"],
    })
    .input(
      z.object({
        id: z.string().min(1),
        finalNotes: z.string().optional(),
      }),
    )
    .output(z.any())
    .handler(
      async ({
        context,
        input,
      }: {
        context: OrgContext;
        input: { id: string; finalNotes?: string };
      }) => {
        if (isDemoRequest(context)) {
          const sheet = getDemoSheet(input.id);
          if (!sheet) throw new Error("Sheet not found");

          sheet.status = "completed";
          sheet.completedAt = new Date().toISOString();
          if (input.finalNotes) {
            sheet.notes = input.finalNotes;
          }
          sheet.updatedAt = new Date().toISOString();
          return sheet;
        }

        const db = getDb(context);

        const [updated] = await db
          .update(dataCollectionSheets)
          .set({
            status: "completed",
            completedAt: new Date(),
            notes: input.finalNotes,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(dataCollectionSheets.id, input.id),
              eq(dataCollectionSheets.organizationId, context.organization.id),
            ),
          )
          .returning();

        // Invalidate caches
        await invalidateCache(`sheets:list:${context.organization.id}`);
        await invalidateCache(
          `sheets:get:${context.organization.id}:${input.id}`,
        );

        return updated;
      },
    ),

  /**
   * Get statistics for data collection
   */
  getStats: orgAuthed
    .route({
      method: "GET",
      path: "/data-collection-sheets/stats",
      summary: "Get data collection statistics",
      tags: ["Data Collection"],
    })
    .input(
      z.object({
        patientId: z.string().optional(),
        goalId: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }),
    )
    .output(
      z.object({
        totalSheets: z.number(),
        completedSheets: z.number(),
        totalEntries: z.number(),
        averagePercentage: z.number(),
        trend: z.array(
          z.object({
            date: z.string(),
            value: z.number(),
          }),
        ),
      }),
    )
    .handler(
      async ({
        context,
        input,
      }: {
        context: OrgContext;
        input: {
          patientId?: string;
          goalId?: string;
          startDate?: string;
          endDate?: string;
        };
      }) => {
        if (isDemoRequest(context)) {
          return {
            totalSheets: demoSheets.length,
            completedSheets: demoSheets.filter((s) => s.status === "completed")
              .length,
            totalEntries: demoSheets.reduce(
              (sum, s) => sum + (s.data?.entries?.length || 0),
              0,
            ),
            averagePercentage: 75,
            trend: [
              { date: "2026-03-01", value: 60 },
              { date: "2026-03-15", value: 70 },
              { date: "2026-03-28", value: 75 },
            ],
          };
        }

        const db = getDb(context);

        const conditions = [
          eq(dataCollectionSheets.organizationId, context.organization.id),
        ];
        if (input.patientId) {
          conditions.push(eq(dataCollectionSheets.patientId, input.patientId));
        }
        if (input.goalId) {
          conditions.push(eq(dataCollectionSheets.goalId, input.goalId));
        }
        if (input.startDate) {
          conditions.push(
            gte(dataCollectionSheets.createdAt, new Date(input.startDate)),
          );
        }
        if (input.endDate) {
          conditions.push(
            lte(dataCollectionSheets.createdAt, new Date(input.endDate)),
          );
        }

        const sheets = await db
          .select()
          .from(dataCollectionSheets)
          .where(and(...conditions));

        const totalSheets = sheets.length;
        const completedSheets = sheets.filter(
          (s) => s.status === "completed",
        ).length;
        const totalEntries = sheets.reduce(
          (sum: number, s) => sum + ((s.data as any)?.entries?.length || 0),
          0,
        );

        // Calculate average percentage from summaries
        const percentages = sheets
          .map((s) => (s.data as any)?.summary?.percentage)
          .filter((p): p is number => typeof p === "number");
        const averagePercentage =
          percentages.length > 0
            ? Math.round(
                (percentages.reduce((a: number, b: number) => a + b, 0) /
                  percentages.length) *
                  10,
              ) / 10
            : 0;

        // Generate trend data (group by week)
        const trend: { date: string; value: number }[] = [];
        const groupedByWeek = new Map<string, number[]>();

        sheets.forEach((sheet) => {
          const date = new Date(sheet.createdAt);
          const weekKey = date.toISOString().split("T")[0];
          const percentage = (sheet.data as any)?.summary?.percentage;
          if (typeof percentage === "number") {
            if (!groupedByWeek.has(weekKey)) {
              groupedByWeek.set(weekKey, []);
            }
            groupedByWeek.get(weekKey)!.push(percentage);
          }
        });

        groupedByWeek.forEach((values, date) => {
          const avg = values.reduce((a, b) => a + b, 0) / values.length;
          trend.push({ date, value: Math.round(avg) });
        });

        trend.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

        return {
          totalSheets,
          completedSheets,
          totalEntries,
          averagePercentage,
          trend,
        };
      },
    ),
};
