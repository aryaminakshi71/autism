/**
 * Assessments Router
 *
 * Assessment tracking for autism care (ADOS-2, VB-MAPP, CARS-2, M-CHAT, etc.)
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

const { assessments } = schema;

// Demo data for assessments
const demoAssessments = [
  {
    id: "demo-assess-001",
    patientId: "demo-patient-001",
    type: "ADOS-2",
    name: "ADOS-2 Module 3",
    provider: "Dr. Sarah Johnson",
    version: "2012",
    status: "completed",
    scheduledDate: new Date("2026-02-15").toISOString(),
    completedDate: new Date("2026-02-15").toISOString(),
    results: {
      rawScore: 18,
      descriptiveRating: "Moderate ASD",
      domainScores: [
        { domain: "Communication", score: 6, description: "Moderate concern" },
        {
          domain: "Social Interaction",
          score: 7,
          description: "Moderate concern",
        },
        { domain: "Play", score: 5, description: "Mild concern" },
      ],
    },
    recommendations:
      "Recommend 15-20 hours of ABA therapy per week with focus on social skills and communication. Consider speech therapy adjunct.",
    nextAssessmentDate: new Date("2026-08-15").toISOString(),
    notes:
      "Child showed good engagement during assessment. Eye contact variable.",
    createdAt: new Date("2026-02-10").toISOString(),
    updatedAt: new Date("2026-02-15").toISOString(),
  },
  {
    id: "demo-assess-002",
    patientId: "demo-patient-001",
    type: "VB-MAPP",
    name: "VB-MAPP Milestones Assessment",
    provider: "Emily Chen, BCBA",
    version: "2008",
    status: "completed",
    scheduledDate: new Date("2026-03-01").toISOString(),
    completedDate: new Date("2026-03-01").toISOString(),
    results: {
      rawScore: 85,
      standardScore: 92,
      percentile: 30,
      ageEquivalent: "3 years, 6 months",
      domainScores: [
        { domain: "Mand", score: 15, description: "Level 2" },
        { domain: "Tact", score: 18, description: "Level 2" },
        { domain: "Listener Responding", score: 16, description: "Level 2" },
        { domain: "Visual Perceptual", score: 12, description: "Level 1" },
        { domain: "Motor Imitation", score: 14, description: "Level 2" },
        { domain: "Intraverbal", score: 10, description: "Level 1" },
      ],
    },
    recommendations:
      "Focus on intraverbal skills and expanding listener responding to complex discriminations. Continue manding with full sentence frames.",
    nextAssessmentDate: new Date("2026-09-01").toISOString(),
    notes:
      "Strong performance in tacting. Needs support with intraverbal conversation skills.",
    createdAt: new Date("2026-02-25").toISOString(),
    updatedAt: new Date("2026-03-01").toISOString(),
  },
  {
    id: "demo-assess-003",
    patientId: "demo-patient-002",
    type: "M-CHAT-R/F",
    name: "M-CHAT-R/F Screening",
    provider: "Dr. Michael Torres",
    status: "scheduled",
    scheduledDate: new Date("2026-04-10").toISOString(),
    createdAt: new Date("2026-03-20").toISOString(),
    updatedAt: new Date("2026-03-20").toISOString(),
  },
];

const getDemoAssessments = (
  page: number,
  limit: number,
  patientId?: string,
  status?: string,
  type?: string,
) => {
  let filtered = [...demoAssessments];

  if (patientId) {
    filtered = filtered.filter((a) => a.patientId === patientId);
  }
  if (status) {
    filtered = filtered.filter((a) => a.status === status);
  }
  if (type) {
    filtered = filtered.filter((a) => a.type === type);
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

const getDemoAssessment = (id: string) => {
  return demoAssessments.find((a) => a.id === id) || null;
};

export const assessmentsRouter = {
  /**
   * List assessments
   */
  list: orgAuthed
    .route({
      method: "GET",
      path: "/assessments",
      summary: "List assessments",
      tags: ["Assessments"],
    })
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(200).default(50),
        patientId: z.string().optional(),
        status: z.string().optional(),
        type: z.string().optional(),
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
          type?: string;
        };
      }) => {
        if (isDemoRequest(context)) {
          return getDemoAssessments(
            input.page,
            input.limit,
            input.patientId,
            input.status,
            input.type,
          );
        }

        const db = getDb(context);
        const offset = (input.page - 1) * input.limit;

        const conditions = [
          eq(assessments.organizationId, context.organization.id),
        ];
        if (input.patientId) {
          conditions.push(eq(assessments.patientId, input.patientId));
        }
        if (input.status) {
          conditions.push(eq(assessments.status, input.status));
        }
        if (input.type) {
          conditions.push(eq(assessments.type, input.type));
        }

        const cacheKey = `assessments:list:${context.organization.id}:${input.page}:${input.limit}:${input.patientId || "none"}:${input.status || "none"}:${input.type || "none"}`;

        return getOrCache(
          cacheKey,
          async () => {
            const allAssessments = await db
              .select()
              .from(assessments)
              .where(and(...conditions));
            const total = allAssessments.length;

            const paginatedAssessments = await db
              .select()
              .from(assessments)
              .where(and(...conditions))
              .orderBy(desc(assessments.createdAt))
              .limit(input.limit)
              .offset(offset);

            return {
              data: paginatedAssessments,
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
   * Get single assessment
   */
  get: orgAuthed
    .route({
      method: "GET",
      path: "/assessments/:id",
      summary: "Get assessment by ID",
      tags: ["Assessments"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
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
          return getDemoAssessment(input.id);
        }

        const db = getDb(context);

        const cacheKey = `assessments:get:${context.organization.id}:${input.id}`;

        return getOrCache(
          cacheKey,
          async () => {
            const result = await db
              .select()
              .from(assessments)
              .where(
                and(
                  eq(assessments.id, input.id),
                  eq(assessments.organizationId, context.organization.id),
                ),
              )
              .limit(1);

            return result[0] || null;
          },
          300,
        );
      },
    ),

  /**
   * Create assessment
   */
  create: orgAuthed
    .route({
      method: "POST",
      path: "/assessments",
      summary: "Create new assessment",
      tags: ["Assessments"],
    })
    .input(
      z.object({
        patientId: z.string().uuid(),
        type: z.string().min(1).max(100),
        name: z.string().min(1).max(255),
        provider: z.string().optional(),
        version: z.string().optional(),
        status: z.string().default("scheduled"),
        scheduledDate: z.string().optional(),
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
          patientId: string;
          type: string;
          name: string;
          provider?: string;
          version?: string;
          status?: string;
          scheduledDate?: string;
          notes?: string;
        };
      }) => {
        if (isDemoRequest(context)) {
          return {
            id: "demo-assess-new",
            organizationId: context.organization.id,
            ...input,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }

        const db = getDb(context);

        const result = await db
          .insert(assessments)
          .values({
            organizationId: context.organization.id,
            createdBy: context.user.id,
            patientId: input.patientId,
            type: input.type,
            name: input.name,
            provider: input.provider,
            version: input.version,
            status: input.status || "scheduled",
            scheduledDate: input.scheduledDate
              ? new Date(input.scheduledDate)
              : undefined,
            notes: input.notes,
          })
          .returning();

        // Invalidate list cache
        await invalidateCache(`assessments:list:${context.organization.id}`);

        return result[0];
      },
    ),

  /**
   * Update assessment
   */
  update: orgAuthed
    .route({
      method: "PATCH",
      path: "/assessments/:id",
      summary: "Update assessment",
      tags: ["Assessments"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).max(255).optional(),
        provider: z.string().optional(),
        status: z.string().optional(),
        scheduledDate: z.string().optional(),
        completedDate: z.string().optional(),
        administeredBy: z.string().optional(),
        results: z.record(z.any()).optional(),
        recommendations: z.string().optional(),
        goalsRecommended: z.string().optional(),
        nextAssessmentDate: z.string().optional(),
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
          id: string;
          name?: string;
          provider?: string;
          status?: string;
          scheduledDate?: string;
          completedDate?: string;
          administeredBy?: string;
          results?: Record<string, any>;
          recommendations?: string;
          goalsRecommended?: string;
          nextAssessmentDate?: string;
          notes?: string;
        };
      }) => {
        if (isDemoRequest(context)) {
          return {
            id: input.id,
            organizationId: context.organization.id,
            ...input,
            updatedAt: new Date().toISOString(),
          };
        }

        const db = getDb(context);

        const updateData: any = {};
        if (input.name !== undefined) updateData.name = input.name;
        if (input.provider !== undefined) updateData.provider = input.provider;
        if (input.status !== undefined) updateData.status = input.status;
        if (input.scheduledDate !== undefined)
          updateData.scheduledDate = new Date(input.scheduledDate);
        if (input.completedDate !== undefined)
          updateData.completedDate = new Date(input.completedDate);
        if (input.administeredBy !== undefined)
          updateData.administeredBy = input.administeredBy;
        if (input.results !== undefined) updateData.results = input.results;
        if (input.recommendations !== undefined)
          updateData.recommendations = input.recommendations;
        if (input.goalsRecommended !== undefined)
          updateData.goalsRecommended = input.goalsRecommended;
        if (input.nextAssessmentDate !== undefined)
          updateData.nextAssessmentDate = new Date(input.nextAssessmentDate);
        if (input.notes !== undefined) updateData.notes = input.notes;

        const result = await db
          .update(assessments)
          .set(updateData)
          .where(
            and(
              eq(assessments.id, input.id),
              eq(assessments.organizationId, context.organization.id),
            ),
          )
          .returning();

        // Invalidate caches
        await invalidateCache(`assessments:list:${context.organization.id}`);
        await invalidateCache(
          `assessments:get:${context.organization.id}:${input.id}`,
        );

        return result[0];
      },
    ),

  /**
   * Delete assessment
   */
  delete: orgAuthed
    .route({
      method: "DELETE",
      path: "/assessments/:id",
      summary: "Delete assessment",
      tags: ["Assessments"],
    })
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .output(z.boolean())
    .handler(
      async ({
        context,
        input,
      }: {
        context: OrgContext;
        input: { id: string };
      }) => {
        if (isDemoRequest(context)) {
          return true;
        }

        const db = getDb(context);

        await db
          .delete(assessments)
          .where(
            and(
              eq(assessments.id, input.id),
              eq(assessments.organizationId, context.organization.id),
            ),
          );

        // Invalidate caches
        await invalidateCache(`assessments:list:${context.organization.id}`);
        await invalidateCache(
          `assessments:get:${context.organization.id}:${input.id}`,
        );

        return true;
      },
    ),
};
