/**
 * Compliance Router
 *
 * Organization administrators can review minimum-necessary access history.
 * Clinical content is never returned from audit metadata.
 */

import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import type { OrgContext } from "../context";
import { isDemoRequest } from "../lib/demo";
import { adminOnly, getDb, schema } from "../procedures";

const { hipaaAuditLogs } = schema;

export const complianceRouter = {
  auditLog: adminOnly
    .route({
      method: "GET",
      path: "/compliance/audit-log",
      summary: "Review organization audit events",
      tags: ["Compliance"],
    })
    .input(
      z.object({
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(50),
        patientId: z.string().uuid().optional(),
        action: z.string().max(80).optional(),
        resourceType: z.string().max(80).optional(),
      }),
    )
    .output(
      z.object({
        data: z.array(
          z.object({
            id: z.string(),
            actorUserId: z.string().nullable(),
            actorRole: z.string().nullable(),
            action: z.string(),
            resourceType: z.string(),
            resourceId: z.string().nullable(),
            patientId: z.string().nullable(),
            createdAt: z.coerce.date(),
          }),
        ),
        page: z.number(),
        limit: z.number(),
        total: z.number(),
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
          action?: string;
          resourceType?: string;
        };
      }) => {
        if (isDemoRequest(context)) {
          return {
            data: [],
            page: input.page,
            limit: input.limit,
            total: 0,
            totalPages: 0,
          };
        }
        const db = getDb(context);
        const conditions = [
          eq(hipaaAuditLogs.organizationId, context.organization.id),
        ];
        if (input.patientId) {
          conditions.push(eq(hipaaAuditLogs.patientId, input.patientId));
        }
        if (input.action) {
          conditions.push(eq(hipaaAuditLogs.action, input.action));
        }
        if (input.resourceType) {
          conditions.push(eq(hipaaAuditLogs.resourceType, input.resourceType));
        }

        const matching = await db
          .select({ id: hipaaAuditLogs.id })
          .from(hipaaAuditLogs)
          .where(and(...conditions));
        const data = await db
          .select({
            id: hipaaAuditLogs.id,
            actorUserId: hipaaAuditLogs.actorUserId,
            actorRole: hipaaAuditLogs.actorRole,
            action: hipaaAuditLogs.action,
            resourceType: hipaaAuditLogs.resourceType,
            resourceId: hipaaAuditLogs.resourceId,
            patientId: hipaaAuditLogs.patientId,
            createdAt: hipaaAuditLogs.createdAt,
          })
          .from(hipaaAuditLogs)
          .where(and(...conditions))
          .orderBy(desc(hipaaAuditLogs.createdAt))
          .limit(input.limit)
          .offset((input.page - 1) * input.limit);

        return {
          data,
          page: input.page,
          limit: input.limit,
          total: matching.length,
          totalPages: Math.ceil(matching.length / input.limit),
        };
      },
    ),
};
