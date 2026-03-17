/**
 * Patients Router
 *
 * Patient management operations for autism care.
 */

import {
  getOrCache,
  invalidateCache,
} from "@autism-legacy-20260205/storage/redis";
import { desc, eq, and, like, or } from "drizzle-orm";
import { z } from "zod";
import type { OrgContext } from "../context";
import { trackQuery } from "../lib/db-performance";
import { isDemoRequest } from "../lib/demo";
import {
  createDemoPatient,
  deleteDemoPatient,
  getDemoPatient,
  getDemoPatients,
  getDemoPatientStats,
} from "../lib/demo-data";
import { getDb, orgAuthed, schema } from "../procedures";

const { patients } = schema;

export const patientsRouter = {
  /**
   * List patients for the organization
   */
  list: orgAuthed
    .route({
      method: "GET",
      path: "/patients",
      summary: "List patients",
      tags: ["Patients"],
    })
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(200).default(50),
        search: z.string().optional(),
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
        input: { page: number; limit: number; search?: string; status?: string };
      }) => {
        if (isDemoRequest(context)) {
          return getDemoPatients(input.page, input.limit, input.search, input.status);
        }
        const db = getDb(context);
        const offset = (input.page - 1) * input.limit;

        // Build where clause
        const conditions = [eq(patients.organizationId, context.organization.id)];
        if (input.status) {
          conditions.push(eq(patients.status, input.status));
        }
        if (input.search) {
          conditions.push(
            or(
              like(patients.firstName, `%${input.search}%`),
              like(patients.lastName, `%${input.search}%`),
            ),
          );
        }

        const cacheKey = `patients:list:${context.organization.id}:${input.page}:${input.limit}:${input.search || "none"}:${input.status || "none"}`;

        return getOrCache(
          cacheKey,
          async () => {
            const allPatients = await trackQuery("listPatientsCount", () =>
              db.select().from(patients).where(and(...conditions)),
            );
            const total = allPatients.length;

            const paginatedPatients = await trackQuery(
              "listPatientsPaginated",
              () =>
                db
                  .select()
                  .from(patients)
                  .where(and(...conditions))
                  .orderBy(desc(patients.createdAt))
                  .limit(input.limit)
                  .offset(offset),
            );

            return {
              data: paginatedPatients,
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
   * Get a single patient
   */
  get: orgAuthed
    .route({
      method: "GET",
      path: "/patients/:id",
      summary: "Get patient",
      tags: ["Patients"],
    })
    .input(z.object({ id: z.string() }))
    .output(z.any())
    .handler(
      async ({ context, input }: { context: OrgContext; input: { id: string } }) => {
        if (isDemoRequest(context)) {
          return getDemoPatient(input.id);
        }
        const db = getDb(context);

        const patient = await trackQuery("getPatient", async () => {
          return getOrCache(
            `patient:${input.id}`,
            async () => {
              const [result] = await db
                .select()
                .from(patients)
                .where(eq(patients.id, input.id))
                .limit(1);

              if (!result) {
                throw new Error("Patient not found");
              }

              return result;
            },
            3600,
          );
        });

        return patient;
      },
    ),

  /**
   * Get patient statistics
   */
  stats: orgAuthed
    .route({
      method: "GET",
      path: "/patients/stats",
      summary: "Get patient statistics",
      tags: ["Patients"],
    })
    .output(
      z.object({
        total: z.number(),
        active: z.number(),
        inactive: z.number(),
        newThisMonth: z.number(),
      }),
    )
    .handler(
      async ({ context }: { context: OrgContext }) => {
        if (isDemoRequest(context)) {
          return getDemoPatientStats();
        }
        const db = getDb(context);

        const allPatients = await trackQuery("patientStats", () =>
          db.select().from(patients).where(eq(patients.organizationId, context.organization.id)),
        );

        const now = new Date();
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        return {
          total: allPatients.length,
          active: allPatients.filter((p) => p.status === "active").length,
          inactive: allPatients.filter((p) => p.status === "inactive").length,
          newThisMonth: allPatients.filter((p) => p.createdAt && p.createdAt >= firstOfMonth).length,
        };
      },
    ),

  /**
   * Create a new patient
   */
  create: orgAuthed
    .route({
      method: "POST",
      path: "/patients",
      summary: "Create patient",
      tags: ["Patients"],
    })
    .input(
      z.object({
        firstName: z.string().min(1).max(100),
        lastName: z.string().min(1).max(100),
        dateOfBirth: z.string().optional(),
        gender: z.string().optional(),
        diagnosis: z.string().optional(),
        severityLevel: z.string().optional(),
        primaryLanguage: z.string().default("en"),
        preferredCommunication: z.string().default("verbal"),
        status: z.string().default("active"),
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
          firstName: string;
          lastName: string;
          dateOfBirth?: string;
          gender?: string;
          diagnosis?: string;
          severityLevel?: string;
          primaryLanguage?: string;
          preferredCommunication?: string;
          status?: string;
        };
      }) => {
        if (isDemoRequest(context)) {
          return createDemoPatient({
            ...input,
            organizationId: context.organization.id,
            createdBy: context.user.id,
          });
        }
        const db = getDb(context);
        const [patient] = await trackQuery("createPatient", () =>
          db
            .insert(patients)
            .values({
              id: crypto.randomUUID(),
              firstName: input.firstName,
              lastName: input.lastName,
              dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
              gender: input.gender || null,
              diagnosis: input.diagnosis || null,
              severityLevel: input.severityLevel || null,
              primaryLanguage: input.primaryLanguage,
              preferredCommunication: input.preferredCommunication,
              status: input.status,
              organizationId: context.organization.id,
              createdBy: context.user.id,
            })
            .returning(),
        );

        await invalidateCache(`patients:list:${context.organization.id}`);

        return patient;
      },
    ),

  /**
   * Update a patient
   */
  update: orgAuthed
    .route({
      method: "PATCH",
      path: "/patients/:id",
      summary: "Update patient",
      tags: ["Patients"],
    })
    .input(
      z.object({
        id: z.string(),
        firstName: z.string().min(1).max(100).optional(),
        lastName: z.string().min(1).max(100).optional(),
        dateOfBirth: z.string().optional(),
        gender: z.string().optional(),
        diagnosis: z.string().optional(),
        severityLevel: z.string().optional(),
        primaryLanguage: z.string().optional(),
        preferredCommunication: z.string().optional(),
        status: z.string().optional(),
        assignedTherapistId: z.string().optional(),
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
          firstName?: string;
          lastName?: string;
          dateOfBirth?: string;
          gender?: string;
          diagnosis?: string;
          severityLevel?: string;
          primaryLanguage?: string;
          preferredCommunication?: string;
          status?: string;
          assignedTherapistId?: string;
        };
      }) => {
        if (isDemoRequest(context)) {
          return getDemoPatient(input.id);
        }
        const db = getDb(context);
        const { id, ...updateData } = input;

        // Filter out undefined values
        const filteredData: Record<string, unknown> = {};
        Object.entries(updateData).forEach(([key, value]) => {
          if (value !== undefined) {
            if (key === "dateOfBirth" && value) {
              filteredData[key] = new Date(value);
            } else {
              filteredData[key] = value;
            }
          }
        });

        const [patient] = await trackQuery("updatePatient", () =>
          db
            .update(patients)
            .set(filteredData)
            .where(eq(patients.id, id))
            .returning(),
        );

        if (!patient) {
          throw new Error("Patient not found");
        }

        await invalidateCache(`patient:${input.id}`);
        await invalidateCache(`patients:list:${context.organization.id}`);

        return patient;
      },
    ),

  /**
   * Delete a patient
   */
  delete: orgAuthed
    .route({
      method: "DELETE",
      path: "/patients/:id",
      summary: "Delete patient",
      tags: ["Patients"],
    })
    .input(z.object({ id: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .handler(
      async ({ context, input }: { context: OrgContext; input: { id: string } }) => {
        if (isDemoRequest(context)) {
          return deleteDemoPatient(input.id);
        }
        const db = getDb(context);
        await trackQuery("deletePatient", () =>
          db.delete(patients).where(eq(patients.id, input.id)),
        );

        await invalidateCache(`patient:${input.id}`);
        await invalidateCache(`patients:list:${context.organization.id}`);

        return { success: true };
      },
    ),
};
