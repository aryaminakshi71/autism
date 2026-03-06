import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { OrganizationSchema, UserSchema } from "~/schemas/auth";
import {
  AssessmentSchema,
  CommunicationCardSchema,
  CreateAssessmentSchema,
  CreateCommunicationCardSchema,
  CreateGoalSchema,
  CreatePatientSchema,
  CreateSessionSchema,
  CreateVisualScheduleSchema,
  GoalSchema,
  PatientSchema,
  PatientStatsSchema,
  SessionSchema,
  UpdateGoalSchema,
  UpdatePatientSchema,
  UpdateSessionSchema,
  VisualScheduleSchema,
} from "~/schemas/autism-care";
import { auth } from "../auth";
import { authed, orgAuthed, pub } from "./middlewares";

const HealthSchema = z.object({ ok: z.boolean() });

export const router = {
  system: {
    health: pub
      .route({
        method: "GET",
        path: "/health",
        summary: "Health check",
        tags: ["System"],
      })
      .output(HealthSchema)
      .handler(async () => ({ ok: true })),
  },
  auth: {
    me: authed
      .route({
        method: "GET",
        path: "/auth/me",
        summary: "Get current user",
        tags: ["Authentication"],
      })
      .output(UserSchema)
      .handler(async ({ context }) => context.user!),
  },
  org: {
    list: authed
      .route({
        method: "GET",
        path: "/orgs",
        summary: "List organizations",
        tags: ["Organizations"],
      })
      .output(z.array(OrganizationSchema))
      .handler(async ({ context }) => {
        const result = await auth.api.listOrganizations({
          headers: context.request.headers,
        });
        return "data" in result
          ? (result.data as typeof result.data)
          : (result as any);
      }),
  },
  patients: {
    stats: orgAuthed
      .route({
        method: "GET",
        path: "/patients/stats",
        summary: "Get patient overview stats",
        tags: ["Patients"],
      })
      .output(PatientStatsSchema)
      .handler(async ({ context }) => {
        const {
          patients: patientsTable,
          goals,
          sessions,
          assessments,
        } = await import("../db/schema");

        const orgId = context.organizationId!;

        const allPatients = await context.db
          .select({ id: patientsTable.id })
          .from(patientsTable)
          .where(eq(patientsTable.organizationId, orgId));

        const totalPatients = allPatients.length;
        const activePatients = allPatients.length;

        const allGoals = await context.db
          .select({ id: goals.id })
          .from(goals)
          .where(eq(goals.organizationId, orgId));

        const totalGoals = allGoals.length;
        const activeGoals = allGoals.length;

        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const weekSessions = await context.db
          .select({ id: sessions.id })
          .from(sessions)
          .where(sql`${sessions.scheduledStart} >= ${weekAgo}`);

        const completedAssessments = await context.db
          .select({ id: assessments.id })
          .from(assessments)
          .where(eq(assessments.status, "completed"));

        return {
          totalPatients,
          activePatients,
          totalGoals,
          activeGoals,
          sessionsThisWeek: weekSessions.length,
          completedAssessments: completedAssessments.length,
        };
      }),
    list: orgAuthed
      .route({
        method: "GET",
        path: "/patients",
        summary: "List patients",
        tags: ["Patients"],
      })
      .output(z.array(PatientSchema))
      .handler(async ({ context }) => {
        const { patients: patientsTable } = await import("../db/schema");
        const patients = await context.db
          .select()
          .from(patientsTable)
          .where(eq(patientsTable.organizationId, context.organizationId!));

        return patients.map((patient) => ({
          ...patient,
          dateOfBirth: patient.dateOfBirth?.toISOString() ?? null,
          createdAt: patient.createdAt.toISOString(),
          updatedAt: patient.updatedAt.toISOString(),
        }));
      }),
    get: orgAuthed
      .route({
        method: "GET",
        path: "/patients/:id",
        summary: "Get patient by ID",
        tags: ["Patients"],
      })
      .input(z.object({ id: z.string() }))
      .output(PatientSchema)
      .handler(async ({ context, input }) => {
        const { patients: patientsTable } = await import("../db/schema");
        const [patient] = await context.db
          .select()
          .from(patientsTable)
          .where(sql`${patientsTable.id} = ${input.id}`);

        if (!patient) {
          throw new Error("Patient not found");
        }

        return {
          ...patient,
          dateOfBirth: patient.dateOfBirth?.toISOString() ?? null,
          createdAt: patient.createdAt.toISOString(),
          updatedAt: patient.updatedAt.toISOString(),
        };
      }),
    create: orgAuthed
      .route({
        method: "POST",
        path: "/patients",
        summary: "Create a patient",
        tags: ["Patients"],
      })
      .input(CreatePatientSchema)
      .output(PatientSchema)
      .handler(async ({ context, input }) => {
        const { patients: patientsTable } = await import("../db/schema");
        const [patient] = await context.db
          .insert(patientsTable)
          .values({
            id: crypto.randomUUID(),
            organizationId: context.organizationId!,
            firstName: input.firstName,
            lastName: input.lastName,
            dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
            gender: input.gender ?? null,
            diagnosis: input.diagnosis ?? null,
            severityLevel: input.severityLevel ?? null,
            primaryLanguage: input.primaryLanguage ?? "en",
            preferredCommunication: input.preferredCommunication ?? "verbal",
            status: input.status ?? "active",
            assignedTherapistId: input.assignedTherapistId ?? null,
            guardianUserId: input.guardianUserId ?? null,
            createdBy: context.user!.id,
          })
          .returning();

        return {
          ...patient,
          dateOfBirth: patient.dateOfBirth?.toISOString() ?? null,
          createdAt: patient.createdAt.toISOString(),
          updatedAt: patient.updatedAt.toISOString(),
        };
      }),
    update: orgAuthed
      .route({
        method: "PATCH",
        path: "/patients/:id",
        summary: "Update a patient",
        tags: ["Patients"],
      })
      .input(z.object({ id: z.string() }).merge(UpdatePatientSchema))
      .output(PatientSchema)
      .handler(async ({ context, input }) => {
        const { patients: patientsTable } = await import("../db/schema");
        const { id, ...data } = input;

        const [patient] = await context.db
          .update(patientsTable)
          .set({
            ...data,
            dateOfBirth: data.dateOfBirth
              ? new Date(data.dateOfBirth)
              : undefined,
            updatedAt: new Date(),
          })
          .where(sql`${patientsTable.id} = ${id}`)
          .returning();

        if (!patient) {
          throw new Error("Patient not found");
        }

        return {
          ...patient,
          dateOfBirth: patient.dateOfBirth?.toISOString() ?? null,
          createdAt: patient.createdAt.toISOString(),
          updatedAt: patient.updatedAt.toISOString(),
        };
      }),
  },
  goals: {
    list: orgAuthed
      .route({
        method: "GET",
        path: "/goals",
        summary: "List goals",
        tags: ["Goals"],
      })
      .input(
        z
          .object({
            patientId: z.string().optional(),
            status: z.string().optional(),
          })
          .optional(),
      )
      .output(z.array(GoalSchema))
      .handler(async ({ context, input }) => {
        const { goals: goalsTable } = await import("../db/schema");
        let condition = eq(goalsTable.organizationId, context.organizationId!);

        if (input?.patientId) {
          condition = sql`${condition} AND ${goalsTable.patientId} = ${input.patientId}`;
        }

        const goals = await context.db
          .select()
          .from(goalsTable)
          .where(condition);

        return goals.map((goal) => ({
          ...goal,
          startDate: goal.startDate?.toISOString() ?? null,
          targetDate: goal.targetDate?.toISOString() ?? null,
          createdAt: goal.createdAt.toISOString(),
          updatedAt: goal.updatedAt.toISOString(),
        }));
      }),
    create: orgAuthed
      .route({
        method: "POST",
        path: "/goals",
        summary: "Create a goal",
        tags: ["Goals"],
      })
      .input(CreateGoalSchema)
      .output(GoalSchema)
      .handler(async ({ context, input }) => {
        const { goals: goalsTable } = await import("../db/schema");
        const [goal] = await context.db
          .insert(goalsTable)
          .values({
            id: crypto.randomUUID(),
            organizationId: context.organizationId!,
            patientId: input.patientId,
            name: input.name,
            description: input.description ?? null,
            category: input.category,
            subcategory: input.subcategory ?? null,
            targetBehavior: input.targetBehavior ?? null,
            baselineValue: input.baselineValue ?? null,
            targetValue: input.targetValue,
            currentValue: input.currentValue ?? null,
            unit: input.unit ?? "%",
            masteryCriteria: input.masteryCriteria ?? 80,
            status: input.status ?? "active",
            priority: input.priority ?? "medium",
            startDate: input.startDate ? new Date(input.startDate) : null,
            targetDate: input.targetDate ? new Date(input.targetDate) : null,
            domain: input.domain ?? null,
            createdBy: context.user!.id,
          })
          .returning();

        return {
          ...goal,
          startDate: goal.startDate?.toISOString() ?? null,
          targetDate: goal.targetDate?.toISOString() ?? null,
          createdAt: goal.createdAt.toISOString(),
          updatedAt: goal.updatedAt.toISOString(),
        };
      }),
    update: orgAuthed
      .route({
        method: "PATCH",
        path: "/goals/:id",
        summary: "Update a goal",
        tags: ["Goals"],
      })
      .input(z.object({ id: z.string() }).merge(UpdateGoalSchema))
      .output(GoalSchema)
      .handler(async ({ context, input }) => {
        const { goals: goalsTable } = await import("../db/schema");
        const { id, ...data } = input;

        const [goal] = await context.db
          .update(goalsTable)
          .set({
            ...data,
            startDate: data.startDate ? new Date(data.startDate) : undefined,
            targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
            updatedAt: new Date(),
          })
          .where(sql`${goalsTable.id} = ${id}`)
          .returning();

        if (!goal) {
          throw new Error("Goal not found");
        }

        return {
          ...goal,
          startDate: goal.startDate?.toISOString() ?? null,
          targetDate: goal.targetDate?.toISOString() ?? null,
          createdAt: goal.createdAt.toISOString(),
          updatedAt: goal.updatedAt.toISOString(),
        };
      }),
  },
  sessions: {
    list: orgAuthed
      .route({
        method: "GET",
        path: "/sessions",
        summary: "List sessions",
        tags: ["Sessions"],
      })
      .input(
        z
          .object({
            patientId: z.string().optional(),
            therapistId: z.string().optional(),
            status: z.string().optional(),
            startDate: z.string().optional(),
            endDate: z.string().optional(),
          })
          .optional(),
      )
      .output(z.array(SessionSchema))
      .handler(async ({ context, input }) => {
        const { sessions: sessionsTable } = await import("../db/schema");
        let condition = eq(
          sessionsTable.organizationId,
          context.organizationId!,
        );

        if (input?.patientId) {
          condition = sql`${condition} AND ${sessionsTable.patientId} = ${input.patientId}`;
        }
        if (input?.therapistId) {
          condition = sql`${condition} AND ${sessionsTable.therapistId} = ${input.therapistId}`;
        }
        if (input?.status) {
          condition = sql`${condition} AND ${sessionsTable.status} = ${input.status}`;
        }

        const sessions = await context.db
          .select()
          .from(sessionsTable)
          .where(condition)
          .orderBy(desc(sessionsTable.scheduledStart));

        return sessions.map((session) => ({
          ...session,
          scheduledStart: session.scheduledStart.toISOString(),
          scheduledEnd: session.scheduledEnd.toISOString(),
          actualStart: session.actualStart?.toISOString() ?? null,
          actualEnd: session.actualEnd?.toISOString() ?? null,
          createdAt: session.createdAt.toISOString(),
          updatedAt: session.updatedAt.toISOString(),
        }));
      }),
    create: orgAuthed
      .route({
        method: "POST",
        path: "/sessions",
        summary: "Create a session",
        tags: ["Sessions"],
      })
      .input(CreateSessionSchema)
      .output(SessionSchema)
      .handler(async ({ context, input }) => {
        const { sessions: sessionsTable } = await import("../db/schema");
        const [session] = await context.db
          .insert(sessionsTable)
          .values({
            id: crypto.randomUUID(),
            organizationId: context.organizationId!,
            patientId: input.patientId,
            therapistId: input.therapistId,
            type: input.type,
            status: input.status ?? "scheduled",
            scheduledStart: new Date(input.scheduledStart),
            scheduledEnd: new Date(input.scheduledEnd),
            actualStart: input.actualStart ? new Date(input.actualStart) : null,
            actualEnd: input.actualEnd ? new Date(input.actualEnd) : null,
            durationMinutes: input.durationMinutes ?? null,
            location: input.location ?? null,
            room: input.room ?? null,
            telehealth: input.telehealth ?? false,
            mood: input.mood ?? null,
            energyLevel: input.energyLevel ?? null,
            notes: input.notes ?? null,
            createdBy: context.user!.id,
          })
          .returning();

        return {
          ...session,
          scheduledStart: session.scheduledStart.toISOString(),
          scheduledEnd: session.scheduledEnd.toISOString(),
          actualStart: session.actualStart?.toISOString() ?? null,
          actualEnd: session.actualEnd?.toISOString() ?? null,
          createdAt: session.createdAt.toISOString(),
          updatedAt: session.updatedAt.toISOString(),
        };
      }),
    update: orgAuthed
      .route({
        method: "PATCH",
        path: "/sessions/:id",
        summary: "Update a session",
        tags: ["Sessions"],
      })
      .input(z.object({ id: z.string() }).merge(UpdateSessionSchema))
      .output(SessionSchema)
      .handler(async ({ context, input }) => {
        const { sessions: sessionsTable } = await import("../db/schema");
        const { id, ...data } = input;

        const [session] = await context.db
          .update(sessionsTable)
          .set({
            ...data,
            scheduledStart: data.scheduledStart
              ? new Date(data.scheduledStart)
              : undefined,
            scheduledEnd: data.scheduledEnd
              ? new Date(data.scheduledEnd)
              : undefined,
            actualStart: data.actualStart
              ? new Date(data.actualStart)
              : undefined,
            actualEnd: data.actualEnd ? new Date(data.actualEnd) : undefined,
            updatedAt: new Date(),
          })
          .where(sql`${sessionsTable.id} = ${id}`)
          .returning();

        if (!session) {
          throw new Error("Session not found");
        }

        return {
          ...session,
          scheduledStart: session.scheduledStart.toISOString(),
          scheduledEnd: session.scheduledEnd.toISOString(),
          actualStart: session.actualStart?.toISOString() ?? null,
          actualEnd: session.actualEnd?.toISOString() ?? null,
          createdAt: session.createdAt.toISOString(),
          updatedAt: session.updatedAt.toISOString(),
        };
      }),
  },
  schedules: {
    list: orgAuthed
      .route({
        method: "GET",
        path: "/schedules",
        summary: "List visual schedules",
        tags: ["Visual Schedules"],
      })
      .input(
        z
          .object({
            patientId: z.string().optional(),
            type: z.string().optional(),
          })
          .optional(),
      )
      .output(z.array(VisualScheduleSchema))
      .handler(async ({ context, input }) => {
        const { visualSchedules } = await import("../db/schema");
        let condition = eq(
          visualSchedules.organizationId,
          context.organizationId!,
        );

        if (input?.patientId) {
          condition = sql`${condition} AND ${visualSchedules.patientId} = ${input.patientId}`;
        }

        const schedules = await context.db
          .select()
          .from(visualSchedules)
          .where(condition);

        return schedules.map((schedule) => ({
          ...schedule,
          createdAt: schedule.createdAt.toISOString(),
          updatedAt: schedule.updatedAt.toISOString(),
        }));
      }),
    create: orgAuthed
      .route({
        method: "POST",
        path: "/schedules",
        summary: "Create a visual schedule",
        tags: ["Visual Schedules"],
      })
      .input(CreateVisualScheduleSchema)
      .output(VisualScheduleSchema)
      .handler(async ({ context, input }) => {
        const { visualSchedules } = await import("../db/schema");
        const [schedule] = await context.db
          .insert(visualSchedules)
          .values({
            id: crypto.randomUUID(),
            organizationId: context.organizationId!,
            patientId: input.patientId ?? null,
            name: input.name,
            description: input.description ?? null,
            type: input.type,
            schedule: input.schedule ?? null,
            isTemplate: input.isTemplate ?? false,
            isDefault: input.isDefault ?? false,
            createdBy: context.user!.id,
          })
          .returning();

        return {
          ...schedule,
          createdAt: schedule.createdAt.toISOString(),
          updatedAt: schedule.updatedAt.toISOString(),
        };
      }),
  },
  communication: {
    cards: {
      list: orgAuthed
        .route({
          method: "GET",
          path: "/communication/cards",
          summary: "List communication cards",
          tags: ["Communication"],
        })
        .input(
          z
            .object({
              patientId: z.string().optional(),
              category: z.string().optional(),
            })
            .optional(),
        )
        .output(z.array(CommunicationCardSchema))
        .handler(async ({ context, input }) => {
          const { communicationCards } = await import("../db/schema");
          let condition = eq(
            communicationCards.organizationId,
            context.organizationId!,
          );

          if (input?.patientId) {
            condition = sql`${condition} AND ${communicationCards.patientId} = ${input.patientId}`;
          }

          const cards = await context.db
            .select()
            .from(communicationCards)
            .where(condition);

          return cards.map((card) => ({
            ...card,
            createdAt: card.createdAt.toISOString(),
            updatedAt: card.updatedAt.toISOString(),
          }));
        }),
      create: orgAuthed
        .route({
          method: "POST",
          path: "/communication/cards",
          summary: "Create a communication card",
          tags: ["Communication"],
        })
        .input(CreateCommunicationCardSchema)
        .output(CommunicationCardSchema)
        .handler(async ({ context, input }) => {
          const { communicationCards } = await import("../db/schema");
          const [card] = await context.db
            .insert(communicationCards)
            .values({
              id: crypto.randomUUID(),
              organizationId: context.organizationId!,
              patientId: input.patientId ?? null,
              name: input.name,
              description: input.description ?? null,
              category: input.category,
              cards: input.cards ?? null,
              gridSize: input.gridSize ?? "4x4",
              isTemplate: input.isTemplate ?? false,
              language: input.language ?? "en",
              createdBy: context.user!.id,
            })
            .returning();

          return {
            ...card,
            createdAt: card.createdAt.toISOString(),
            updatedAt: card.updatedAt.toISOString(),
          };
        }),
    },
  },
  assessments: {
    list: orgAuthed
      .route({
        method: "GET",
        path: "/assessments",
        summary: "List assessments",
        tags: ["Assessments"],
      })
      .input(
        z
          .object({
            patientId: z.string().optional(),
            type: z.string().optional(),
            status: z.string().optional(),
          })
          .optional(),
      )
      .output(z.array(AssessmentSchema))
      .handler(async ({ context, input }) => {
        const { assessments: assessmentsTable } = await import("../db/schema");
        let condition = eq(
          assessmentsTable.organizationId,
          context.organizationId!,
        );

        if (input?.patientId) {
          condition = sql`${condition} AND ${assessmentsTable.patientId} = ${input.patientId}`;
        }

        const assessments = await context.db
          .select()
          .from(assessmentsTable)
          .where(condition)
          .orderBy(desc(assessmentsTable.scheduledDate));

        return assessments.map((assessment) => ({
          ...assessment,
          scheduledDate: assessment.scheduledDate?.toISOString() ?? null,
          completedDate: assessment.completedDate?.toISOString() ?? null,
          createdAt: assessment.createdAt.toISOString(),
          updatedAt: assessment.updatedAt.toISOString(),
        }));
      }),
    create: orgAuthed
      .route({
        method: "POST",
        path: "/assessments",
        summary: "Create an assessment",
        tags: ["Assessments"],
      })
      .input(CreateAssessmentSchema)
      .output(AssessmentSchema)
      .handler(async ({ context, input }) => {
        const { assessments: assessmentsTable } = await import("../db/schema");
        const [assessment] = await context.db
          .insert(assessmentsTable)
          .values({
            id: crypto.randomUUID(),
            organizationId: context.organizationId!,
            patientId: input.patientId,
            type: input.type,
            name: input.name,
            provider: input.provider ?? null,
            version: input.version ?? null,
            status: input.status ?? "scheduled",
            scheduledDate: input.scheduledDate
              ? new Date(input.scheduledDate)
              : null,
            completedDate: input.completedDate
              ? new Date(input.completedDate)
              : null,
            administeredBy: input.administeredBy ?? null,
            results: input.results ?? null,
            recommendations: input.recommendations ?? null,
            createdBy: context.user!.id,
          })
          .returning();

        return {
          ...assessment,
          scheduledDate: assessment.scheduledDate?.toISOString() ?? null,
          completedDate: assessment.completedDate?.toISOString() ?? null,
          createdAt: assessment.createdAt.toISOString(),
          updatedAt: assessment.updatedAt.toISOString(),
        };
      }),
  },
};
