/**
 * Data Collection Templates Router
 *
 * Pre-configured templates for ABA data collection methods:
 * - Discrete Trial Training (DTT)
 * - Task Analysis
 * - Frequency Recording
 * - Duration Recording
 * - Latency Recording
 * - Interval Recording (Partial/Whole)
 * - Momentary Time Sampling
 */

import {
  getOrCache,
  invalidateCache,
} from "@autism-legacy-20260205/storage/redis";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import type { OrgContext } from "../context";
import { isDemoRequest } from "../lib/demo";
import { getDb, orgAuthed, schema } from "../procedures";

const { dataCollectionTemplates } = schema;

// Built-in ABA data collection templates
export const builtInTemplates = [
  {
    id: "builtin-dtt",
    name: "Discrete Trial Training (DTT)",
    description:
      "Record individual trials with prompt levels and correct/incorrect responses",
    type: "trial_based",
    configuration: {
      fields: [
        {
          name: "trialNumber",
          type: "number",
          label: "Trial #",
          required: true,
        },
        {
          name: "promptLevel",
          type: "select",
          label: "Prompt Level",
          options: [
            "Independent",
            "Gestural",
            "Verbal",
            "Model",
            "Partial Physical",
            "Full Physical",
          ],
          required: true,
        },
        {
          name: "response",
          type: "select",
          label: "Response",
          options: ["Correct", "Incorrect", "No Response"],
          required: true,
        },
        {
          name: "latencySeconds",
          type: "number",
          label: "Latency (sec)",
          required: false,
        },
      ],
      scoring: {
        type: "percentage",
        formula: "(correctTrials / totalTrials) * 100",
      },
    },
  },
  {
    id: "builtin-task-analysis",
    name: "Task Analysis",
    description: "Break down complex tasks into steps and track completion",
    type: "task_analysis",
    configuration: {
      fields: [
        { name: "stepNumber", type: "number", label: "Step #", required: true },
        {
          name: "stepDescription",
          type: "text",
          label: "Step Description",
          required: true,
        },
        {
          name: "completed",
          type: "boolean",
          label: "Completed",
          required: true,
        },
        {
          name: "promptLevel",
          type: "select",
          label: "Prompt Level",
          options: ["Independent", "Minimal", "Moderate", "Maximum"],
          required: false,
        },
      ],
      scoring: {
        type: "percentage",
        formula: "(completedSteps / totalSteps) * 100",
      },
    },
  },
  {
    id: "builtin-frequency",
    name: "Frequency Recording",
    description: "Count occurrences of target behavior within a time period",
    type: "frequency",
    configuration: {
      fields: [
        { name: "behavior", type: "text", label: "Behavior", required: true },
        { name: "count", type: "number", label: "Count", required: true },
        {
          name: "observationPeriod",
          type: "number",
          label: "Observation Period (minutes)",
          required: true,
        },
      ],
      scoring: {
        type: "rate",
        formula: "count / observationPeriod",
        unit: "per minute",
      },
    },
  },
  {
    id: "builtin-duration",
    name: "Duration Recording",
    description: "Measure how long a behavior lasts",
    type: "duration",
    configuration: {
      fields: [
        { name: "behavior", type: "text", label: "Behavior", required: true },
        {
          name: "startTime",
          type: "datetime",
          label: "Start Time",
          required: true,
        },
        {
          name: "endTime",
          type: "datetime",
          label: "End Time",
          required: true,
        },
        {
          name: "duration",
          type: "number",
          label: "Duration (seconds)",
          calculated: true,
        },
      ],
      scoring: {
        type: "average",
        formula: "totalDuration / occurrences",
        unit: "seconds",
      },
    },
  },
  {
    id: "builtin-latency",
    name: "Latency Recording",
    description: "Measure time between instruction and response",
    type: "latency",
    configuration: {
      fields: [
        {
          name: "instruction",
          type: "text",
          label: "Instruction",
          required: true,
        },
        {
          name: "instructionTime",
          type: "datetime",
          label: "Instruction Time",
          required: true,
        },
        {
          name: "responseTime",
          type: "datetime",
          label: "Response Time",
          required: true,
        },
        {
          name: "latencySeconds",
          type: "number",
          label: "Latency (seconds)",
          calculated: true,
        },
      ],
      scoring: {
        type: "average",
        formula: "totalLatency / trials",
        unit: "seconds",
      },
    },
  },
  {
    id: "builtin-partial-interval",
    name: "Partial Interval Recording",
    description: "Record if behavior occurred at any point during interval",
    type: "interval",
    configuration: {
      fields: [
        {
          name: "intervalNumber",
          type: "number",
          label: "Interval #",
          required: true,
        },
        {
          name: "behaviorOccurred",
          type: "boolean",
          label: "Behavior Occurred",
          required: true,
        },
        {
          name: "duration",
          type: "number",
          label: "Interval Duration (seconds)",
          required: true,
          defaultValue: 10,
        },
      ],
      scoring: {
        type: "percentage",
        formula: "(intervalsWithBehavior / totalIntervals) * 100",
        unit: "% of intervals",
      },
    },
  },
  {
    id: "builtin-whole-interval",
    name: "Whole Interval Recording",
    description: "Record if behavior occurred throughout entire interval",
    type: "interval",
    configuration: {
      fields: [
        {
          name: "intervalNumber",
          type: "number",
          label: "Interval #",
          required: true,
        },
        {
          name: "behaviorThroughout",
          type: "boolean",
          label: "Behavior Throughout",
          required: true,
        },
        {
          name: "duration",
          type: "number",
          label: "Interval Duration (seconds)",
          required: true,
          defaultValue: 10,
        },
      ],
      scoring: {
        type: "percentage",
        formula: "(intervalsWithBehavior / totalIntervals) * 100",
        unit: "% of intervals",
      },
    },
  },
  {
    id: "builtin-momentary",
    name: "Momentary Time Sampling",
    description: "Record if behavior is occurring at the end of interval",
    type: "interval",
    configuration: {
      fields: [
        {
          name: "intervalNumber",
          type: "number",
          label: "Interval #",
          required: true,
        },
        {
          name: "behaviorAtMoment",
          type: "boolean",
          label: "Behavior at Moment",
          required: true,
        },
        {
          name: "duration",
          type: "number",
          label: "Interval Duration (seconds)",
          required: true,
          defaultValue: 30,
        },
      ],
      scoring: {
        type: "percentage",
        formula: "(intervalsWithBehavior / totalIntervals) * 100",
        unit: "% of intervals",
      },
    },
  },
];

// Demo templates
const demoTemplates = [...builtInTemplates];

const getDemoTemplates = (
  page: number,
  limit: number,
  type?: string,
  search?: string,
) => {
  let filtered = [...demoTemplates];

  if (type) {
    filtered = filtered.filter((t) => t.type === type);
  }
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower),
    );
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

const getDemoTemplate = (id: string) => {
  return demoTemplates.find((t) => t.id === id) || null;
};

export const dataCollectionTemplatesRouter = {
  /**
   * List data collection templates
   */
  list: orgAuthed
    .route({
      method: "GET",
      path: "/data-collection-templates",
      summary: "List data collection templates",
      tags: ["Data Collection"],
    })
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(200).default(50),
        type: z.string().optional(),
        search: z.string().optional(),
        includeBuiltIn: z.boolean().default(true),
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
          type?: string;
          search?: string;
          includeBuiltIn?: boolean;
        };
      }) => {
        // Return built-in templates directly (no DB needed)
        if (isDemoRequest(context)) {
          return getDemoTemplates(
            input.page,
            input.limit,
            input.type,
            input.search,
          );
        }

        const db = getDb(context);
        const offset = (input.page - 1) * input.limit;

        const conditions = [
          eq(dataCollectionTemplates.organizationId, context.organization.id),
        ];
        if (input.type) {
          conditions.push(eq(dataCollectionTemplates.type, input.type));
        }

        const cacheKey = `templates:list:${context.organization.id}:${input.page}:${input.limit}:${input.type || "all"}`;

        const customTemplates = await getOrCache(
          cacheKey,
          async () => {
            const templates = await db
              .select()
              .from(dataCollectionTemplates)
              .where(and(...conditions))
              .orderBy(desc(dataCollectionTemplates.createdAt))
              .limit(input.limit)
              .offset(offset);

            const [{ count }] = await db
              .select({ count: count() })
              .from(dataCollectionTemplates)
              .where(and(...conditions));

            return {
              data: templates,
              total: Number(count),
              page: input.page,
              limit: input.limit,
              totalPages: Math.ceil(Number(count) / input.limit),
            };
          },
          600,
        );

        // Combine with built-in templates if requested
        if (input.includeBuiltIn) {
          const builtInFiltered = builtInTemplates.filter((t) =>
            input.type ? t.type === input.type : true,
          );

          return {
            data: [...builtInFiltered, ...customTemplates.data],
            total: builtInFiltered.length + customTemplates.total,
            page: 1,
            limit: customTemplates.limit,
            totalPages: 1,
          };
        }

        return customTemplates;
      },
    ),

  /**
   * Get single template
   */
  get: orgAuthed
    .route({
      method: "GET",
      path: "/data-collection-templates/:id",
      summary: "Get data collection template",
      tags: ["Data Collection"],
    })
    .input(
      z.object({
        id: z.string(),
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
        // Check built-in templates first
        const builtIn = builtInTemplates.find((t) => t.id === input.id);
        if (builtIn) {
          return builtIn;
        }

        if (isDemoRequest(context)) {
          return getDemoTemplate(input.id);
        }

        const db = getDb(context);

        const cacheKey = `templates:get:${context.organization.id}:${input.id}`;

        return getOrCache(
          cacheKey,
          async () => {
            const [result] = await db
              .select()
              .from(dataCollectionTemplates)
              .where(
                and(
                  eq(dataCollectionTemplates.id, input.id),
                  eq(
                    dataCollectionTemplates.organizationId,
                    context.organization.id,
                  ),
                ),
              )
              .limit(1);

            return result || null;
          },
          600,
        );
      },
    ),

  /**
   * Create custom template
   */
  create: orgAuthed
    .route({
      method: "POST",
      path: "/data-collection-templates",
      summary: "Create custom data collection template",
      tags: ["Data Collection"],
    })
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        type: z.enum([
          "trial_based",
          "task_analysis",
          "frequency",
          "duration",
          "latency",
          "interval",
        ]),
        configuration: z.object({
          fields: z.array(
            z.object({
              name: z.string(),
              type: z.enum(["text", "number", "boolean", "select", "datetime"]),
              label: z.string(),
              required: z.boolean(),
              options: z.array(z.string()).optional(),
              defaultValue: z.any().optional(),
              calculated: z.boolean().optional(),
            }),
          ),
          scoring: z.object({
            type: z.enum(["percentage", "rate", "average", "total"]),
            formula: z.string(),
            unit: z.string().optional(),
          }),
        }),
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
          name: string;
          description?: string;
          type: string;
          configuration: any;
        };
      }) => {
        if (isDemoRequest(context)) {
          return {
            id: `demo-template-${Date.now()}`,
            organizationId: context.organization.id,
            ...input,
            isBuiltIn: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }

        const db = getDb(context);

        const [template] = await db
          .insert(dataCollectionTemplates)
          .values({
            organizationId: context.organization.id,
            createdBy: context.user.id,
            name: input.name,
            description: input.description,
            type: input.type,
            configuration: input.configuration,
            isBuiltIn: false,
          })
          .returning();

        await invalidateCache(`templates:list:${context.organization.id}`);

        return template;
      },
    ),
};
