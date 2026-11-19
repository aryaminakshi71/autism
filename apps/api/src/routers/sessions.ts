/**
 * Sessions Router
 *
 * Session management operations for autism care.
 */

import {
  getOrCache,
  invalidateCache,
} from "@autism-legacy-20260205/storage/redis";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { z } from "zod";
import type { OrgContext } from "../context";
import { writeAuditEvent } from "../lib/audit";
import { trackQuery } from "../lib/db-performance";
import { isDemoRequest } from "../lib/demo";
import {
  createDemoSession,
  deleteDemoSession,
  getDemoSession,
  getDemoSessions,
  updateDemoSession,
} from "../lib/demo-data";
import { adminOnly, getDb, orgAuthed, schema } from "../procedures";

const { sessions } = schema;

export const sessionsRouter = {
  /**
   * List sessions
   */
  list: orgAuthed
    .route({
      method: "GET",
      path: "/sessions",
      summary: "List sessions",
      tags: ["Sessions"],
    })
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(200).default(50),
        patientId: z.string().optional(),
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
          status?: string;
          startDate?: string;
          endDate?: string;
        };
      }) => {
        if (isDemoRequest(context)) {
          return getDemoSessions(
            input.page,
            input.limit,
            input.patientId,
            input.status,
          );
        }
        const db = getDb(context);
        const offset = (input.page - 1) * input.limit;

        const conditions = [
          eq(
            (sessions as any).organizationId ||
              (sessions as any).activeOrganizationId,
            context.organization.id,
          ),
        ];
        if (input.patientId) {
          conditions.push(eq((sessions as any).patientId, input.patientId));
        }
        if (input.status) {
          conditions.push(eq((sessions as any).status, input.status));
        }
        if (input.startDate) {
          conditions.push(
            gte((sessions as any).scheduledStart, new Date(input.startDate)),
          );
        }
        if (input.endDate) {
          conditions.push(
            lte((sessions as any).scheduledStart, new Date(input.endDate)),
          );
        }

        const cacheKey = `sessions:list:${context.organization.id}:${input.page}:${input.limit}:${input.patientId || "none"}:${input.status || "none"}`;

        return getOrCache(
          cacheKey,
          async () => {
            const allSessions = await trackQuery<
              (typeof sessions.$inferSelect)[]
            >("listSessionsCount", () =>
              db
                .select()
                .from(sessions)
                .where(and(...conditions)),
            );
            const total = allSessions.length;

            const paginatedSessions = await trackQuery<
              (typeof sessions.$inferSelect)[]
            >("listSessionsPaginated", () =>
              db
                .select()
                .from(sessions)
                .where(and(...conditions))
                .orderBy(desc((sessions as any).scheduledStart))
                .limit(input.limit)
                .offset(offset),
            );

            return {
              data: paginatedSessions,
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
   * Get a single session
   */
  get: orgAuthed
    .route({
      method: "GET",
      path: "/sessions/:id",
      summary: "Get session",
      tags: ["Sessions"],
    })
    .input(z.object({ id: z.string() }))
    .output(z.any())
    .handler(
      async ({
        context,
        input,
      }: { context: OrgContext; input: { id: string } }) => {
        if (isDemoRequest(context)) {
          return getDemoSession(input.id);
        }
        const db = getDb(context);

        const session = await trackQuery("getSession", async () => {
          return getOrCache(
            `session:${input.id}`,
            async () => {
              const [result] = await db
                .select()
                .from(sessions)
                .where(eq(sessions.id, input.id))
                .limit(1);

              if (!result) {
                throw new Error("Session not found");
              }

              return result;
            },
            3600,
          );
        });

        await writeAuditEvent(context, {
          action: "read",
          resourceType: "session",
          resourceId: session.id,
          patientId: session.patientId,
        });

        return session;
      },
    ),

  /**
   * Create a new session
   */
  create: orgAuthed
    .route({
      method: "POST",
      path: "/sessions",
      summary: "Create session",
      tags: ["Sessions"],
    })
    .input(
      z.object({
        patientId: z.string(),
        therapistId: z.string(),
        type: z.string().min(1),
        scheduledStart: z.string(),
        scheduledEnd: z.string(),
        location: z.string().optional(),
        room: z.string().optional(),
        telehealth: z.boolean().default(false),
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
          therapistId: string;
          type: string;
          scheduledStart: string;
          scheduledEnd: string;
          location?: string;
          room?: string;
          telehealth?: boolean;
        };
      }) => {
        if (isDemoRequest(context)) {
          return createDemoSession({
            ...input,
            organizationId: context.organization.id,
            createdBy: context.user.id,
          });
        }
        const db = getDb(context);

        const startDate = new Date(input.scheduledStart);
        const endDate = new Date(input.scheduledEnd);
        const durationMinutes = Math.round(
          (endDate.getTime() - startDate.getTime()) / 60000,
        );

        const [session] = await trackQuery<(typeof sessions.$inferSelect)[]>(
          "createSession",
          () =>
            db
              .insert(sessions)
              .values({
                id: crypto.randomUUID(),
                patientId: input.patientId,
                therapistId: input.therapistId,
                type: input.type,
                status: "scheduled",
                scheduledStart: startDate,
                scheduledEnd: endDate,
                durationMinutes,
                location: input.location || null,
                room: input.room || null,
                telehealth: input.telehealth,
                organizationId: context.organization.id,
                createdBy: context.user.id,
              })
              .returning(),
        );

        await invalidateCache(`sessions:list:${context.organization.id}`);

        await writeAuditEvent(context, {
          action: "create",
          resourceType: "session",
          resourceId: session.id,
          patientId: input.patientId,
          metadata: { type: input.type, telehealth: input.telehealth },
        });

        return session;
      },
    ),

  /**
   * Update a session
   */
  update: orgAuthed
    .route({
      method: "PATCH",
      path: "/sessions/:id",
      summary: "Update session",
      tags: ["Sessions"],
    })
    .input(
      z.object({
        id: z.string(),
        patientId: z.string().optional(),
        therapistId: z.string().optional(),
        type: z.string().optional(),
        status: z.string().optional(),
        scheduledStart: z.string().optional(),
        scheduledEnd: z.string().optional(),
        actualStart: z.string().optional(),
        actualEnd: z.string().optional(),
        location: z.string().optional(),
        room: z.string().optional(),
        telehealth: z.boolean().optional(),
        mood: z.string().optional(),
        energyLevel: z.string().optional(),
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
          patientId?: string;
          therapistId?: string;
          type?: string;
          status?: string;
          scheduledStart?: string;
          scheduledEnd?: string;
          actualStart?: string;
          actualEnd?: string;
          location?: string;
          room?: string;
          telehealth?: boolean;
          mood?: string;
          energyLevel?: string;
          notes?: string;
        };
      }) => {
        if (isDemoRequest(context)) {
          return updateDemoSession(input.id, input);
        }
        const db = getDb(context);
        const { id, ...updateData } = input;

        const filteredData: Record<string, unknown> = {};
        Object.entries(updateData).forEach(([key, value]) => {
          if (value !== undefined) {
            if (
              key === "scheduledStart" ||
              key === "scheduledEnd" ||
              key === "actualStart" ||
              key === "actualEnd"
            ) {
              filteredData[key] = new Date(value as string);
            } else {
              filteredData[key] = value;
            }
          }
        });

        const [session] = await trackQuery<(typeof sessions.$inferSelect)[]>(
          "updateSession",
          () =>
            db
              .update(sessions)
              .set(filteredData)
              .where(eq(sessions.id, id))
              .returning(),
        );

        if (!session) {
          throw new Error("Session not found");
        }

        await invalidateCache(`session:${input.id}`);
        await invalidateCache(`sessions:list:${context.organization.id}`);

        await writeAuditEvent(context, {
          action: "update",
          resourceType: "session",
          resourceId: session.id,
          patientId: session.patientId,
          metadata: { changedFields: Object.keys(filteredData) },
        });

        return session;
      },
    ),

  /**
   * Start a session
   */
  start: orgAuthed
    .route({
      method: "POST",
      path: "/sessions/:id/start",
      summary: "Start session",
      tags: ["Sessions"],
    })
    .input(z.object({ id: z.string() }))
    .output(z.any())
    .handler(
      async ({
        context,
        input,
      }: { context: OrgContext; input: { id: string } }) => {
        if (isDemoRequest(context)) {
          return updateDemoSession(input.id, {
            status: "in-progress",
            actualStart: new Date().toISOString(),
          });
        }
        const db = getDb(context);

        const [session] = await trackQuery<(typeof sessions.$inferSelect)[]>(
          "startSession",
          () =>
            db
              .update(sessions)
              .set({
                status: "in-progress",
                actualStart: new Date(),
              })
              .where(eq(sessions.id, input.id))
              .returning(),
        );

        if (!session) {
          throw new Error("Session not found");
        }

        await invalidateCache(`session:${input.id}`);
        await invalidateCache(`sessions:list:${context.organization.id}`);

        await writeAuditEvent(context, {
          action: "start",
          resourceType: "session",
          resourceId: session.id,
          patientId: session.patientId,
        });

        return session;
      },
    ),

  /**
   * Complete a session
   */
  complete: orgAuthed
    .route({
      method: "POST",
      path: "/sessions/:id/complete",
      summary: "Complete session",
      tags: ["Sessions"],
    })
    .input(
      z.object({
        id: z.string(),
        mood: z.string().optional(),
        energyLevel: z.string().optional(),
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
          mood?: string;
          energyLevel?: string;
          notes?: string;
        };
      }) => {
        if (isDemoRequest(context)) {
          return updateDemoSession(input.id, {
            status: "completed",
            actualEnd: new Date().toISOString(),
            mood: input.mood || null,
            energyLevel: input.energyLevel || null,
            notes: input.notes || null,
          });
        }
        const db = getDb(context);

        const [existing] = await db
          .select()
          .from(sessions)
          .where(eq(sessions.id, input.id))
          .limit(1);
        if (!existing) {
          throw new Error("Session not found");
        }

        const actualEnd = new Date();
        let durationMinutes = existing.durationMinutes;
        if (existing.actualStart) {
          durationMinutes = Math.round(
            (actualEnd.getTime() - new Date(existing.actualStart).getTime()) /
              60000,
          );
        }

        const [session] = await trackQuery<(typeof sessions.$inferSelect)[]>(
          "completeSession",
          () =>
            db
              .update(sessions)
              .set({
                status: "completed",
                actualEnd,
                durationMinutes,
                mood: input.mood || null,
                energyLevel: input.energyLevel || null,
                notes: input.notes || null,
              })
              .where(eq(sessions.id, input.id))
              .returning(),
        );

        await invalidateCache(`session:${input.id}`);
        await invalidateCache(`sessions:list:${context.organization.id}`);

        await writeAuditEvent(context, {
          action: "complete",
          resourceType: "session",
          resourceId: session.id,
          patientId: session.patientId,
          metadata: { durationMinutes: session.durationMinutes ?? null },
        });

        return session;
      },
    ),

  /**
   * Delete a session
   */
  delete: adminOnly
    .route({
      method: "DELETE",
      path: "/sessions/:id",
      summary: "Delete session",
      tags: ["Sessions"],
    })
    .input(z.object({ id: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .handler(
      async ({
        context,
        input,
      }: { context: OrgContext; input: { id: string } }) => {
        if (isDemoRequest(context)) {
          return deleteDemoSession(input.id);
        }
        const db = getDb(context);
        const [existing] = await db
          .select({ patientId: sessions.patientId })
          .from(sessions)
          .where(eq(sessions.id, input.id))
          .limit(1);
        if (!existing) {
          throw new Error("Session not found");
        }
        await trackQuery("deleteSession", () =>
          db.delete(sessions).where(eq(sessions.id, input.id)),
        );

        await invalidateCache(`session:${input.id}`);
        await invalidateCache(`sessions:list:${context.organization.id}`);

        await writeAuditEvent(context, {
          action: "delete",
          resourceType: "session",
          resourceId: input.id,
          patientId: existing.patientId,
        });

        return { success: true };
      },
    ),
};
