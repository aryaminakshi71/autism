import { and, desc, eq, sql } from "drizzle-orm";
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
const OperationsRecordSchema = z.record(z.string(), z.unknown());
const OperationsEntitySchema = z.enum([
  "providers",
  "licenses",
  "payerCredentialing",
  "authorizations",
  "payrollEntries",
  "claims",
  "ledgerEntries",
]);
const OperationsSnapshotSchema = z.object({
  providers: z.array(OperationsRecordSchema),
  licenses: z.array(OperationsRecordSchema),
  payerCredentialing: z.array(OperationsRecordSchema),
  authorizations: z.array(OperationsRecordSchema),
  claims: z.array(OperationsRecordSchema),
  claimEvents: z.array(OperationsRecordSchema),
  hipaaAuditLogs: z.array(OperationsRecordSchema),
  indiaRcmAccess: z.array(OperationsRecordSchema),
  aiVideoAlerts: z.array(OperationsRecordSchema),
  payerRateRules: z.array(OperationsRecordSchema),
  scheduleBlocks: z.array(OperationsRecordSchema),
  payrollTimeEntries: z.array(OperationsRecordSchema),
  payerPaymentCycles: z.array(OperationsRecordSchema),
  complianceRequirements: z.array(OperationsRecordSchema),
  workItems: z.array(OperationsRecordSchema),
  accountingLedgerEntries: z.array(OperationsRecordSchema),
  rolePermissionPolicies: z.array(OperationsRecordSchema),
  callLogs: z.array(OperationsRecordSchema),
  claimScrubberRules: z.array(OperationsRecordSchema),
  aiAlertReviewEvents: z.array(OperationsRecordSchema),
  ledgerLinks: z.array(OperationsRecordSchema),
  trainingCompletions: z.array(OperationsRecordSchema),
});
const OperationsWorkItemInputSchema = z.object({
  state: z.string().min(2),
  domain: z.string().min(2),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  owner: z.string().min(2),
  title: z.string().min(3),
  detail: z.string().optional(),
  dueDate: z.string().optional(),
  blocks: z.string().optional(),
  source: z.string().optional(),
});
const OperationsPayrollTimeEntryInputSchema = z.object({
  providerId: z.string().optional(),
  patientId: z.string().optional(),
  scheduleBlockId: z.string().optional(),
  staffName: z.string().min(2),
  role: z.enum(["bcba", "rbt", "admin", "biller"]),
  state: z.string().min(2),
  center: z.string().optional(),
  serviceType: z.enum(["rbt_direct", "bcba_treatment", "bcba_supervision", "parent_training", "admin"]),
  clockIn: z.string(),
  clockOut: z.string().optional(),
  paidMinutes: z.number().int().nonnegative().default(0),
  billableMinutes: z.number().int().nonnegative().default(0),
  noteSigned: z.boolean().default(false),
  claimReady: z.boolean().default(false),
});
const OperationsCallLogInputSchema = z.object({
  claimId: z.string().optional(),
  authorizationId: z.string().optional(),
  patientId: z.string().optional(),
  state: z.string().min(2),
  payerName: z.string().optional(),
  callType: z.enum(["claim_status", "authorization_status", "credentialing", "parent_admin"]),
  callerName: z.string().optional(),
  phoneNumberLabel: z.string().optional(),
  payerRepresentative: z.string().min(2),
  referenceNumber: z.string().min(3),
  disposition: z.string().min(2),
  summary: z.string().min(5),
  nextAction: z.string().optional(),
  followUpDate: z.string().optional(),
  minimumNecessaryFields: z.array(z.string()).default([]),
  escalationRequired: z.boolean().default(false),
  escalatedTo: z.string().optional(),
});
const OperationsAiAlertReviewInputSchema = z.object({
  alertId: z.string(),
  decision: z.enum(["confirmed_safety_event", "false_positive", "monitor", "training_issue"]),
  falsePositiveReason: z.string().optional(),
  clinicalAction: z.string().optional(),
  claimHoldAfterReview: z.boolean().default(true),
});
const OperationsTrainingCompletionInputSchema = z.object({
  id: z.string(),
  competencyScore: z.number().int().min(0).max(100).default(100),
  signatureName: z.string().min(2),
});
const OperationMutationResultSchema = z.object({
  id: z.string(),
  ok: z.boolean(),
});
const OperationsCrudInputSchema = z.object({
  entity: OperationsEntitySchema,
  record: z.record(z.string(), z.unknown()),
});
const OperationsCrudUpdateInputSchema = z.object({
  entity: OperationsEntitySchema,
  id: z.string(),
  record: z.record(z.string(), z.unknown()),
});
const OperationsCrudDeleteInputSchema = z.object({
  entity: OperationsEntitySchema,
  id: z.string(),
});
const OperationsSeedResultSchema = z.object({
  ok: z.boolean(),
  created: z.number(),
  skipped: z.number(),
});

const serializeOperationRow = <T extends Record<string, unknown>>(row: T) =>
  Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      key,
      value instanceof Date ? value.toISOString() : value,
    ]),
  );

const stringOrNull = (value: unknown) =>
  typeof value === "string" && value.trim() ? value : null;
const stringOrDefault = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim() ? value : fallback;
const numberOrDefault = (value: unknown, fallback = 0) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;
const booleanOrDefault = (value: unknown, fallback = false) =>
  typeof value === "boolean" ? value : fallback;
const dateOrNull = (value: unknown) =>
  typeof value === "string" && value ? new Date(value) : null;
const dateOrDefault = (value: unknown, fallback = new Date()) =>
  typeof value === "string" && value ? new Date(value) : fallback;
const stringArrayOrNull = (value: unknown) =>
  Array.isArray(value) ? value.filter((item) => typeof item === "string") : null;

async function enforceOperationsPermission(
  context: any,
  permission: string,
  resourceType: string,
  state?: string | null,
) {
  const {
    providerProfiles,
    operationsRolePermissionPolicies,
    hipaaAuditLogs,
  } = await import("../db/schema");
  const orgId = context.organizationId!;
  const userId = context.user?.id;
  const [provider] = userId
    ? await context.db
        .select()
        .from(providerProfiles)
        .where(
          and(
            eq(providerProfiles.organizationId, orgId),
            eq(providerProfiles.userId, userId),
          ),
        )
        .limit(1)
    : [];
  const role = provider?.role ?? "owner_bcba";
  const [policy] = await context.db
    .select()
    .from(operationsRolePermissionPolicies)
    .where(
      and(
        eq(operationsRolePermissionPolicies.organizationId, orgId),
        eq(operationsRolePermissionPolicies.role, role),
        eq(operationsRolePermissionPolicies.permission, permission),
        eq(operationsRolePermissionPolicies.resourceType, resourceType),
      ),
    )
    .limit(1);

  const stateAllowed =
    !state ||
    !policy?.allowedStates?.length ||
    policy.allowedStates.includes(state);
  const allowed =
    ["owner_bcba", "admin"].includes(role) ||
    Boolean(policy && policy.status === "active" && stateAllowed);

  await context.db.insert(hipaaAuditLogs).values({
    id: crypto.randomUUID(),
    organizationId: orgId,
    actorUserId: userId ?? null,
    actorRole: role,
    action: allowed ? `allow:${permission}` : `deny:${permission}`,
    resourceType,
    resourceId: null,
    patientId: null,
    ipAddress: null,
    country: null,
    metadata: { state, permission, policyId: policy?.id ?? null },
  });

  if (!allowed) {
    throw new Error(`Operation not permitted for role ${role}`);
  }

  return { role, policy };
}

function buildOperationsCrudValues(
  entity: z.infer<typeof OperationsEntitySchema>,
  record: Record<string, unknown>,
  orgId: string,
) {
  if (entity === "providers") {
    return {
      organizationId: orgId,
      userId: stringOrNull(record.userId),
      displayName: stringOrDefault(record.displayName, "New Provider"),
      role: stringOrDefault(record.role, "rbt"),
      employmentType: stringOrNull(record.employmentType),
      homeState: stringOrNull(record.homeState),
      serviceStates: stringArrayOrNull(record.serviceStates),
      status: stringOrDefault(record.status, "active"),
      maxClientLoad:
        record.maxClientLoad === null ? null : numberOrDefault(record.maxClientLoad, 0),
      notes: stringOrNull(record.notes),
    };
  }

  if (entity === "licenses") {
    return {
      organizationId: orgId,
      providerId: stringOrDefault(record.providerId, ""),
      state: stringOrDefault(record.state, "WA"),
      licenseType: stringOrDefault(record.licenseType, "BCBA"),
      licenseNumber: stringOrNull(record.licenseNumber),
      status: stringOrDefault(record.status, "pending"),
      issuedDate: dateOrNull(record.issuedDate),
      expirationDate: dateOrNull(record.expirationDate),
      evidenceUrl: stringOrNull(record.evidenceUrl),
      verifiedBy: stringOrNull(record.verifiedBy),
      verifiedAt: dateOrNull(record.verifiedAt),
    };
  }

  if (entity === "payerCredentialing") {
    return {
      organizationId: orgId,
      providerId: stringOrNull(record.providerId),
      payerName: stringOrDefault(record.payerName, "Medicaid"),
      state: stringOrDefault(record.state, "WA"),
      networkType: stringOrNull(record.networkType),
      status: stringOrDefault(record.status, "not_started"),
      applicationId: stringOrNull(record.applicationId),
      submittedDate: dateOrNull(record.submittedDate),
      effectiveDate: dateOrNull(record.effectiveDate),
      revalidationDate: dateOrNull(record.revalidationDate),
      portalUrl: stringOrNull(record.portalUrl),
      notes: stringOrNull(record.notes),
    };
  }

  if (entity === "authorizations") {
    return {
      organizationId: orgId,
      patientId: stringOrDefault(record.patientId, ""),
      payerCredentialingId: stringOrNull(record.payerCredentialingId),
      payerName: stringOrDefault(record.payerName, "Medicaid"),
      authorizationNumber: stringOrNull(record.authorizationNumber),
      state: stringOrDefault(record.state, "WA"),
      cptCode: stringOrDefault(record.cptCode, "97153"),
      modifier: stringOrNull(record.modifier),
      approvedUnits: numberOrDefault(record.approvedUnits, 0),
      usedUnits: numberOrDefault(record.usedUnits, 0),
      startDate: dateOrDefault(record.startDate),
      endDate: dateOrDefault(record.endDate, new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)),
      status: stringOrDefault(record.status, "active"),
      documentUrl: stringOrNull(record.documentUrl),
    };
  }

  if (entity === "payrollEntries") {
    return {
      organizationId: orgId,
      providerId: stringOrNull(record.providerId),
      patientId: stringOrNull(record.patientId),
      scheduleBlockId: stringOrNull(record.scheduleBlockId),
      staffName: stringOrDefault(record.staffName, "New Staff"),
      role: stringOrDefault(record.role, "rbt"),
      state: stringOrDefault(record.state, "WA"),
      center: stringOrNull(record.center),
      serviceType: stringOrDefault(record.serviceType, "rbt_direct"),
      clockIn: dateOrDefault(record.clockIn),
      clockOut: dateOrNull(record.clockOut),
      paidMinutes: numberOrDefault(record.paidMinutes, 0),
      billableMinutes: numberOrDefault(record.billableMinutes, 0),
      noteSigned: booleanOrDefault(record.noteSigned),
      claimReady: booleanOrDefault(record.claimReady),
      payrollRunId: stringOrNull(record.payrollRunId),
    };
  }

  if (entity === "claims") {
    return {
      organizationId: orgId,
      patientId: stringOrDefault(record.patientId, ""),
      sessionId: stringOrNull(record.sessionId),
      authorizationId: stringOrNull(record.authorizationId),
      payerName: stringOrDefault(record.payerName, "Medicaid"),
      state: stringOrDefault(record.state, "WA"),
      claimNumber: stringOrNull(record.claimNumber),
      clearinghouseTrace: stringOrNull(record.clearinghouseTrace),
      status: stringOrDefault(record.status, "draft"),
      dateOfService: dateOrDefault(record.dateOfService),
      submittedDate: dateOrNull(record.submittedDate),
      billedCents: numberOrDefault(record.billedCents, 0),
      allowedCents:
        record.allowedCents === null ? null : numberOrDefault(record.allowedCents, 0),
      paidCents: record.paidCents === null ? null : numberOrDefault(record.paidCents, 0),
      denialReason: stringOrNull(record.denialReason),
      nextFollowUpDate: dateOrNull(record.nextFollowUpDate),
      assignedRcmUserId: stringOrNull(record.assignedRcmUserId),
    };
  }

  return {
    organizationId: orgId,
    state: stringOrDefault(record.state, "WA"),
    center: stringOrNull(record.center),
    clientLabel: stringOrNull(record.clientLabel),
    providerId: stringOrNull(record.providerId),
    patientId: stringOrNull(record.patientId),
    sourceType: stringOrDefault(record.sourceType, "manual"),
    sourceId: stringOrNull(record.sourceId),
    account: stringOrDefault(record.account, "Uncategorized"),
    debitCents: numberOrDefault(record.debitCents, 0),
    creditCents: numberOrDefault(record.creditCents, 0),
    entryDate: dateOrDefault(record.entryDate),
    memo: stringOrNull(record.memo),
    postedAt: dateOrNull(record.postedAt),
  };
}

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
  operations: {
    snapshot: orgAuthed
      .route({
        method: "GET",
        path: "/operations/snapshot",
        summary: "Get persisted operations dashboard data",
        tags: ["Operations"],
      })
      .output(OperationsSnapshotSchema)
      .handler(async ({ context }) => {
        const {
          providerProfiles,
          providerStateLicenses,
          payerCredentialing,
          serviceAuthorizations,
          insuranceClaims,
          claimEvents,
          hipaaAuditLogs,
          indiaRcmAccess,
          aiVideoAlerts,
          operationsPayerRateRules,
          operationsScheduleBlocks,
          operationsPayrollTimeEntries,
          operationsPayerPaymentCycles,
          operationsComplianceRequirements,
          operationsWorkItems,
          operationsAccountingLedgerEntries,
          operationsRolePermissionPolicies,
          operationsCallLogs,
          operationsClaimScrubberRules,
          operationsAiAlertReviewEvents,
          operationsLedgerLinks,
          operationsTrainingCompletions,
        } = await import("../db/schema");
        const orgId = context.organizationId!;

        const [
          providers,
          licenses,
          credentialingRows,
          authorizations,
          claims,
          claimEventRows,
          auditRows,
          indiaAccessRows,
          aiAlertRows,
          payerRateRules,
          scheduleBlocks,
          payrollTimeEntries,
          payerPaymentCycles,
          complianceRequirements,
          workItems,
          accountingLedgerEntries,
          rolePermissionPolicies,
          callLogs,
          claimScrubberRules,
          aiAlertReviewEvents,
          ledgerLinks,
          trainingCompletions,
        ] = await Promise.all([
          context.db
            .select()
            .from(providerProfiles)
            .where(eq(providerProfiles.organizationId, orgId)),
          context.db
            .select()
            .from(providerStateLicenses)
            .where(eq(providerStateLicenses.organizationId, orgId)),
          context.db
            .select()
            .from(payerCredentialing)
            .where(eq(payerCredentialing.organizationId, orgId)),
          context.db
            .select()
            .from(serviceAuthorizations)
            .where(eq(serviceAuthorizations.organizationId, orgId))
            .orderBy(desc(serviceAuthorizations.startDate)),
          context.db
            .select()
            .from(insuranceClaims)
            .where(eq(insuranceClaims.organizationId, orgId))
            .orderBy(desc(insuranceClaims.dateOfService)),
          context.db
            .select()
            .from(claimEvents)
            .where(eq(claimEvents.organizationId, orgId))
            .orderBy(desc(claimEvents.eventDate)),
          context.db
            .select()
            .from(hipaaAuditLogs)
            .where(eq(hipaaAuditLogs.organizationId, orgId))
            .orderBy(desc(hipaaAuditLogs.createdAt)),
          context.db
            .select()
            .from(indiaRcmAccess)
            .where(eq(indiaRcmAccess.organizationId, orgId)),
          context.db
            .select()
            .from(aiVideoAlerts)
            .where(eq(aiVideoAlerts.organizationId, orgId))
            .orderBy(desc(aiVideoAlerts.createdAt)),
          context.db
            .select()
            .from(operationsPayerRateRules)
            .where(eq(operationsPayerRateRules.organizationId, orgId)),
          context.db
            .select()
            .from(operationsScheduleBlocks)
            .where(eq(operationsScheduleBlocks.organizationId, orgId))
            .orderBy(desc(operationsScheduleBlocks.scheduledStart)),
          context.db
            .select()
            .from(operationsPayrollTimeEntries)
            .where(eq(operationsPayrollTimeEntries.organizationId, orgId))
            .orderBy(desc(operationsPayrollTimeEntries.clockIn)),
          context.db
            .select()
            .from(operationsPayerPaymentCycles)
            .where(eq(operationsPayerPaymentCycles.organizationId, orgId)),
          context.db
            .select()
            .from(operationsComplianceRequirements)
            .where(eq(operationsComplianceRequirements.organizationId, orgId)),
          context.db
            .select()
            .from(operationsWorkItems)
            .where(eq(operationsWorkItems.organizationId, orgId))
            .orderBy(desc(operationsWorkItems.createdAt)),
          context.db
            .select()
            .from(operationsAccountingLedgerEntries)
            .where(eq(operationsAccountingLedgerEntries.organizationId, orgId))
            .orderBy(desc(operationsAccountingLedgerEntries.entryDate)),
          context.db
            .select()
            .from(operationsRolePermissionPolicies)
            .where(eq(operationsRolePermissionPolicies.organizationId, orgId)),
          context.db
            .select()
            .from(operationsCallLogs)
            .where(eq(operationsCallLogs.organizationId, orgId))
            .orderBy(desc(operationsCallLogs.createdAt)),
          context.db
            .select()
            .from(operationsClaimScrubberRules)
            .where(eq(operationsClaimScrubberRules.organizationId, orgId)),
          context.db
            .select()
            .from(operationsAiAlertReviewEvents)
            .where(eq(operationsAiAlertReviewEvents.organizationId, orgId))
            .orderBy(desc(operationsAiAlertReviewEvents.reviewedAt)),
          context.db
            .select()
            .from(operationsLedgerLinks)
            .where(eq(operationsLedgerLinks.organizationId, orgId)),
          context.db
            .select()
            .from(operationsTrainingCompletions)
            .where(eq(operationsTrainingCompletions.organizationId, orgId)),
        ]);

        return {
          providers: providers.map(serializeOperationRow),
          licenses: licenses.map(serializeOperationRow),
          payerCredentialing: credentialingRows.map(serializeOperationRow),
          authorizations: authorizations.map(serializeOperationRow),
          claims: claims.map(serializeOperationRow),
          claimEvents: claimEventRows.map(serializeOperationRow),
          hipaaAuditLogs: auditRows.map(serializeOperationRow),
          indiaRcmAccess: indiaAccessRows.map(serializeOperationRow),
          aiVideoAlerts: aiAlertRows.map(serializeOperationRow),
          payerRateRules: payerRateRules.map(serializeOperationRow),
          scheduleBlocks: scheduleBlocks.map(serializeOperationRow),
          payrollTimeEntries: payrollTimeEntries.map(serializeOperationRow),
          payerPaymentCycles: payerPaymentCycles.map(serializeOperationRow),
          complianceRequirements: complianceRequirements.map(serializeOperationRow),
          workItems: workItems.map(serializeOperationRow),
          accountingLedgerEntries: accountingLedgerEntries.map(serializeOperationRow),
          rolePermissionPolicies: rolePermissionPolicies.map(serializeOperationRow),
          callLogs: callLogs.map(serializeOperationRow),
          claimScrubberRules: claimScrubberRules.map(serializeOperationRow),
          aiAlertReviewEvents: aiAlertReviewEvents.map(serializeOperationRow),
          ledgerLinks: ledgerLinks.map(serializeOperationRow),
          trainingCompletions: trainingCompletions.map(serializeOperationRow),
        };
      }),
    createRecord: orgAuthed
      .route({
        method: "POST",
        path: "/operations/records",
        summary: "Create an operations record",
        tags: ["Operations"],
      })
      .input(OperationsCrudInputSchema)
      .output(OperationMutationResultSchema)
      .handler(async ({ context, input }) => {
        const schema = await import("../db/schema");
        const tableByEntity = {
          providers: schema.providerProfiles,
          licenses: schema.providerStateLicenses,
          payerCredentialing: schema.payerCredentialing,
          authorizations: schema.serviceAuthorizations,
          payrollEntries: schema.operationsPayrollTimeEntries,
          claims: schema.insuranceClaims,
          ledgerEntries: schema.operationsAccountingLedgerEntries,
        } as const;
        const table = tableByEntity[input.entity] as any;
        const id = crypto.randomUUID();
        const values = buildOperationsCrudValues(
          input.entity,
          input.record,
          context.organizationId!,
        );

        await context.db.insert(table).values({ id, ...values });
        return { id, ok: true };
      }),
    updateRecord: orgAuthed
      .route({
        method: "PATCH",
        path: "/operations/records/:entity/:id",
        summary: "Update an operations record",
        tags: ["Operations"],
      })
      .input(OperationsCrudUpdateInputSchema)
      .output(OperationMutationResultSchema)
      .handler(async ({ context, input }) => {
        const schema = await import("../db/schema");
        const tableByEntity = {
          providers: schema.providerProfiles,
          licenses: schema.providerStateLicenses,
          payerCredentialing: schema.payerCredentialing,
          authorizations: schema.serviceAuthorizations,
          payrollEntries: schema.operationsPayrollTimeEntries,
          claims: schema.insuranceClaims,
          ledgerEntries: schema.operationsAccountingLedgerEntries,
        } as const;
        const table = tableByEntity[input.entity] as any;
        const { organizationId: _organizationId, ...values } =
          buildOperationsCrudValues(
            input.entity,
            input.record,
            context.organizationId!,
          );
        const [updated] = await context.db
          .update(table)
          .set({ ...values, updatedAt: new Date() })
          .where(
            and(
              eq(table.id, input.id),
              eq(table.organizationId, context.organizationId!),
            ),
          )
          .returning({ id: table.id });

        if (!updated) {
          throw new Error("Operations record not found");
        }

        return { id: updated.id, ok: true };
      }),
    deleteRecord: orgAuthed
      .route({
        method: "DELETE",
        path: "/operations/records/:entity/:id",
        summary: "Delete an operations record",
        tags: ["Operations"],
      })
      .input(OperationsCrudDeleteInputSchema)
      .output(OperationMutationResultSchema)
      .handler(async ({ context, input }) => {
        const schema = await import("../db/schema");
        const tableByEntity = {
          providers: schema.providerProfiles,
          licenses: schema.providerStateLicenses,
          payerCredentialing: schema.payerCredentialing,
          authorizations: schema.serviceAuthorizations,
          payrollEntries: schema.operationsPayrollTimeEntries,
          claims: schema.insuranceClaims,
          ledgerEntries: schema.operationsAccountingLedgerEntries,
        } as const;
        const table = tableByEntity[input.entity] as any;
        const [deleted] = await context.db
          .delete(table)
          .where(
            and(
              eq(table.id, input.id),
              eq(table.organizationId, context.organizationId!),
            ),
          )
          .returning({ id: table.id });

        if (!deleted) {
          throw new Error("Operations record not found");
        }

        return { id: deleted.id, ok: true };
      }),
    seedLaunchData: orgAuthed
      .route({
        method: "POST",
        path: "/operations/seed-launch-data",
        summary: "Seed linked launch operations records",
        tags: ["Operations"],
      })
      .output(OperationsSeedResultSchema)
      .handler(async ({ context }) => {
        const schema = await import("../db/schema");
        const orgId = context.organizationId!;
        const userId = context.user!.id;
        const idPrefix = `ops-${orgId}`;

        const ownerProviderId = `${idPrefix}-provider-owner-bcba`;
        const [existingProvider] = await context.db
          .select({ id: schema.providerProfiles.id })
          .from(schema.providerProfiles)
          .where(
            and(
              eq(schema.providerProfiles.id, ownerProviderId),
              eq(schema.providerProfiles.organizationId, orgId),
            ),
          );

        if (existingProvider) {
          return { ok: true, created: 0, skipped: 1 };
        }

        const stateConfigs = [
          {
            state: "WA",
            firstName: "Client",
            lastName: "WA-01",
            center: "WA Center",
            payer: "Washington Apple Health / ProviderOne",
            rbt: "RBT WA-1",
            directCpt: "97153",
            bcbaCpt: "97155",
            directRateCents: 7000,
            bcbaRateCents: 14000,
            claimStatus: "ready",
          },
          {
            state: "ND",
            firstName: "Client",
            lastName: "ND-01",
            center: "ND Center",
            payer: "North Dakota Medicaid",
            rbt: "RBT ND-1",
            directCpt: "97153",
            bcbaCpt: "97155",
            directRateCents: 6800,
            bcbaRateCents: 13200,
            claimStatus: "hold",
          },
          {
            state: "CT",
            firstName: "Client",
            lastName: "CT-01",
            center: "CT Center",
            payer: "Connecticut Medical Assistance Program / HUSKY",
            rbt: "RBT CT-1",
            directCpt: "97153",
            bcbaCpt: "97155",
            directRateCents: 7200,
            bcbaRateCents: 14500,
            claimStatus: "blocked",
          },
          {
            state: "MO",
            firstName: "Client",
            lastName: "MO-01",
            center: "MO Center",
            payer: "MO HealthNet",
            rbt: "RBT MO-1",
            directCpt: "97153",
            bcbaCpt: "97155",
            directRateCents: 6900,
            bcbaRateCents: 13200,
            claimStatus: "hold",
          },
        ] as const;

        const providers = [
          {
            id: ownerProviderId,
            organizationId: orgId,
            userId,
            displayName: "Owner BCBA",
            role: "owner_bcba",
            employmentType: "employee",
            homeState: "WA",
            serviceStates: ["WA", "ND", "CT", "MO"],
            status: "active",
            maxClientLoad: 12,
            notes: "Owner BCBA supervising four-state launch with restricted delegation.",
          },
          {
            id: `${idPrefix}-provider-india-rcm`,
            organizationId: orgId,
            userId: null,
            displayName: "India RCM Team",
            role: "rcm",
            employmentType: "vendor",
            homeState: null,
            serviceStates: ["WA", "ND", "CT", "MO"],
            status: "pending",
            maxClientLoad: null,
            notes: "Restricted minimum-necessary claim follow-up and payment posting team.",
          },
          ...stateConfigs.map((config) => ({
            id: `${idPrefix}-provider-rbt-${config.state.toLowerCase()}`,
            organizationId: orgId,
            userId: null,
            displayName: config.rbt,
            role: "rbt",
            employmentType: "employee",
            homeState: config.state,
            serviceStates: [config.state],
            status: "credentialing",
            maxClientLoad: 1,
            notes: `Launch RBT for ${config.center}.`,
          })),
        ];

        await context.db.insert(schema.providerProfiles).values(providers);

        const patientsToSeed = stateConfigs.map((config) => ({
          id: `${idPrefix}-patient-${config.state.toLowerCase()}-01`,
          organizationId: orgId,
          firstName: config.firstName,
          lastName: config.lastName,
          dateOfBirth: new Date("2018-01-15T00:00:00.000Z"),
          gender: null,
          diagnosis: "Autism Spectrum Disorder",
          severityLevel: "requires_support",
          primaryLanguage: "en",
          preferredCommunication: "verbal",
          status: "active",
          assignedTherapistId: null,
          guardianUserId: null,
          createdBy: userId,
        }));
        await context.db.insert(schema.patients).values(patientsToSeed);

        await context.db.insert(schema.providerStateLicenses).values(
          stateConfigs.flatMap((config) => [
            {
              id: `${idPrefix}-license-owner-${config.state.toLowerCase()}`,
              organizationId: orgId,
              providerId: ownerProviderId,
              state: config.state,
              licenseType: "BCBA/LBA permission",
              licenseNumber: null,
              status: config.state === "CT" ? "pending" : "active",
              issuedDate: config.state === "CT" ? null : new Date("2026-07-01T00:00:00.000Z"),
              expirationDate: new Date("2027-07-01T00:00:00.000Z"),
              evidenceUrl: null,
              verifiedBy: config.state === "CT" ? null : userId,
              verifiedAt: config.state === "CT" ? null : new Date("2026-07-05T00:00:00.000Z"),
            },
            {
              id: `${idPrefix}-license-rbt-${config.state.toLowerCase()}`,
              organizationId: orgId,
              providerId: `${idPrefix}-provider-rbt-${config.state.toLowerCase()}`,
              state: config.state,
              licenseType: "RBT credential/state background checks",
              licenseNumber: null,
              status: "pending",
              issuedDate: null,
              expirationDate: null,
              evidenceUrl: null,
              verifiedBy: null,
              verifiedAt: null,
            },
          ]),
        );

        await context.db.insert(schema.payerCredentialing).values(
          stateConfigs.map((config) => ({
            id: `${idPrefix}-credentialing-${config.state.toLowerCase()}`,
            organizationId: orgId,
            providerId: ownerProviderId,
            payerName: config.payer,
            state: config.state,
            networkType: "medicaid",
            status: config.state === "CT" ? "blocked" : "pending",
            applicationId: null,
            submittedDate: new Date("2026-07-05T00:00:00.000Z"),
            effectiveDate: null,
            revalidationDate: null,
            portalUrl: null,
            notes: "Seeded launch credentialing record; replace with payer portal evidence.",
          })),
        );

        await context.db.insert(schema.serviceAuthorizations).values(
          stateConfigs.flatMap((config) => {
            const patientId = `${idPrefix}-patient-${config.state.toLowerCase()}-01`;
            return [
              {
                id: `${idPrefix}-auth-${config.state.toLowerCase()}-rbt`,
                organizationId: orgId,
                patientId,
                payerCredentialingId: `${idPrefix}-credentialing-${config.state.toLowerCase()}`,
                payerName: config.payer,
                authorizationNumber: null,
                state: config.state,
                cptCode: config.directCpt,
                modifier: null,
                approvedUnits: 480,
                usedUnits: config.state === "MO" ? 480 : 24,
                startDate: new Date("2026-07-01T00:00:00.000Z"),
                endDate: new Date("2026-09-30T00:00:00.000Z"),
                status: config.state === "MO" ? "exhausted" : "active",
                documentUrl: null,
              },
              {
                id: `${idPrefix}-auth-${config.state.toLowerCase()}-bcba`,
                organizationId: orgId,
                patientId,
                payerCredentialingId: `${idPrefix}-credentialing-${config.state.toLowerCase()}`,
                payerName: config.payer,
                authorizationNumber: null,
                state: config.state,
                cptCode: config.bcbaCpt,
                modifier: null,
                approvedUnits: 48,
                usedUnits: 4,
                startDate: new Date("2026-07-01T00:00:00.000Z"),
                endDate: new Date("2026-09-30T00:00:00.000Z"),
                status: "active",
                documentUrl: null,
              },
            ];
          }),
        );

        await context.db.insert(schema.operationsPayrollTimeEntries).values(
          stateConfigs.flatMap((config) => {
            const patientId = `${idPrefix}-patient-${config.state.toLowerCase()}-01`;
            const rbtProviderId = `${idPrefix}-provider-rbt-${config.state.toLowerCase()}`;
            return [
              {
                id: `${idPrefix}-time-${config.state.toLowerCase()}-rbt-001`,
                organizationId: orgId,
                providerId: rbtProviderId,
                patientId,
                scheduleBlockId: null,
                staffName: config.rbt,
                role: "rbt",
                state: config.state,
                center: config.center,
                serviceType: "rbt_direct",
                clockIn: new Date("2026-07-03T09:00:00.000Z"),
                clockOut: new Date("2026-07-03T15:00:00.000Z"),
                paidMinutes: 360,
                billableMinutes: 360,
                noteSigned: config.state !== "CT",
                claimReady: config.claimStatus === "ready",
                payrollRunId: "seed-payroll-2026-07-05",
              },
              {
                id: `${idPrefix}-time-${config.state.toLowerCase()}-bcba-001`,
                organizationId: orgId,
                providerId: ownerProviderId,
                patientId,
                scheduleBlockId: null,
                staffName: "Owner BCBA",
                role: "bcba",
                state: config.state,
                center: config.center,
                serviceType: "bcba_supervision",
                clockIn: new Date("2026-07-03T15:00:00.000Z"),
                clockOut: new Date("2026-07-03T16:00:00.000Z"),
                paidMinutes: 60,
                billableMinutes: 60,
                noteSigned: true,
                claimReady: config.claimStatus === "ready",
                payrollRunId: "seed-payroll-2026-07-05",
              },
            ];
          }),
        );

        await context.db.insert(schema.insuranceClaims).values(
          stateConfigs.flatMap((config) => {
            const patientId = `${idPrefix}-patient-${config.state.toLowerCase()}-01`;
            const directAmount = 6 * config.directRateCents;
            const bcbaAmount = config.bcbaRateCents;
            return [
              {
                id: `${idPrefix}-claim-${config.state.toLowerCase()}-rbt-001`,
                organizationId: orgId,
                patientId,
                sessionId: null,
                authorizationId: `${idPrefix}-auth-${config.state.toLowerCase()}-rbt`,
                payerName: config.payer,
                state: config.state,
                claimNumber: null,
                clearinghouseTrace: null,
                status: config.claimStatus,
                dateOfService: new Date("2026-07-03T00:00:00.000Z"),
                submittedDate: null,
                billedCents: directAmount,
                allowedCents: null,
                paidCents: null,
                denialReason:
                  config.claimStatus === "blocked"
                    ? "Unsigned RBT note / credentialing not effective"
                    : null,
                nextFollowUpDate: new Date("2026-07-08T00:00:00.000Z"),
                assignedRcmUserId: null,
              },
              {
                id: `${idPrefix}-claim-${config.state.toLowerCase()}-bcba-001`,
                organizationId: orgId,
                patientId,
                sessionId: null,
                authorizationId: `${idPrefix}-auth-${config.state.toLowerCase()}-bcba`,
                payerName: config.payer,
                state: config.state,
                claimNumber: null,
                clearinghouseTrace: null,
                status: config.claimStatus,
                dateOfService: new Date("2026-07-03T00:00:00.000Z"),
                submittedDate: null,
                billedCents: bcbaAmount,
                allowedCents: null,
                paidCents: null,
                denialReason:
                  config.state === "MO" ? "Authorization units require review" : null,
                nextFollowUpDate: new Date("2026-07-08T00:00:00.000Z"),
                assignedRcmUserId: null,
              },
            ];
          }),
        );

        await context.db.insert(schema.operationsAccountingLedgerEntries).values(
          stateConfigs.flatMap((config) => {
            const patientId = `${idPrefix}-patient-${config.state.toLowerCase()}-01`;
            const directAmount = 6 * config.directRateCents;
            const bcbaAmount = config.bcbaRateCents;
            return [
              {
                id: `${idPrefix}-ledger-${config.state.toLowerCase()}-payroll-rbt`,
                organizationId: orgId,
                state: config.state,
                center: config.center,
                clientLabel: `${config.firstName} ${config.lastName}`,
                providerId: `${idPrefix}-provider-rbt-${config.state.toLowerCase()}`,
                patientId,
                sourceType: "payroll",
                sourceId: `${idPrefix}-time-${config.state.toLowerCase()}-rbt-001`,
                account: "Payroll Expense:RBT",
                debitCents: 6 * 2800,
                creditCents: 0,
                entryDate: new Date("2026-07-03T00:00:00.000Z"),
                memo: "Seeded RBT payroll cost by state/client/provider.",
                postedAt: null,
              },
              {
                id: `${idPrefix}-ledger-${config.state.toLowerCase()}-ar-rbt`,
                organizationId: orgId,
                state: config.state,
                center: config.center,
                clientLabel: `${config.firstName} ${config.lastName}`,
                providerId: `${idPrefix}-provider-rbt-${config.state.toLowerCase()}`,
                patientId,
                sourceType: "claim",
                sourceId: `${idPrefix}-claim-${config.state.toLowerCase()}-rbt-001`,
                account: config.claimStatus === "ready" ? "Accounts Receivable" : "Claim Hold",
                debitCents: directAmount,
                creditCents: 0,
                entryDate: new Date("2026-07-03T00:00:00.000Z"),
                memo: "Seeded RBT claim receivable or hold.",
                postedAt: null,
              },
              {
                id: `${idPrefix}-ledger-${config.state.toLowerCase()}-ar-bcba`,
                organizationId: orgId,
                state: config.state,
                center: config.center,
                clientLabel: `${config.firstName} ${config.lastName}`,
                providerId: ownerProviderId,
                patientId,
                sourceType: "claim",
                sourceId: `${idPrefix}-claim-${config.state.toLowerCase()}-bcba-001`,
                account: config.claimStatus === "ready" ? "Accounts Receivable" : "Claim Hold",
                debitCents: bcbaAmount,
                creditCents: 0,
                entryDate: new Date("2026-07-03T00:00:00.000Z"),
                memo: "Seeded BCBA claim receivable or hold.",
                postedAt: null,
              },
            ];
          }),
        );

        await context.db.insert(schema.operationsRolePermissionPolicies).values([
          {
            id: `${idPrefix}-rbac-owner-all`,
            organizationId: orgId,
            role: "owner_bcba",
            permission: "read",
            resourceType: "all_operations_phi",
            accessLevel: "full",
            allowedStates: ["WA", "ND", "CT", "MO"],
            requiresMfa: true,
            requiresBaa: false,
            phiAccess: "full",
            status: "active",
            reviewedAt: new Date("2026-07-05T00:00:00.000Z"),
          },
          {
            id: `${idPrefix}-rbac-india-call-create`,
            organizationId: orgId,
            role: "rcm",
            permission: "create",
            resourceType: "operations_call_logs",
            accessLevel: "minimum_necessary",
            allowedStates: ["WA", "ND", "CT", "MO"],
            requiresMfa: true,
            requiresBaa: true,
            phiAccess: "claim_auth_only",
            status: "active",
            reviewedAt: new Date("2026-07-05T00:00:00.000Z"),
          },
          {
            id: `${idPrefix}-rbac-bcba-ai-review`,
            organizationId: orgId,
            role: "owner_bcba",
            permission: "review",
            resourceType: "ai_video_alerts",
            accessLevel: "clinical_review",
            allowedStates: ["WA", "ND", "CT", "MO"],
            requiresMfa: true,
            requiresBaa: false,
            phiAccess: "clinical",
            status: "active",
            reviewedAt: new Date("2026-07-05T00:00:00.000Z"),
          },
          {
            id: `${idPrefix}-rbac-training-update`,
            organizationId: orgId,
            role: "owner_bcba",
            permission: "update",
            resourceType: "operations_training_completions",
            accessLevel: "signoff",
            allowedStates: ["WA", "ND", "CT", "MO"],
            requiresMfa: true,
            requiresBaa: false,
            phiAccess: "limited",
            status: "active",
            reviewedAt: new Date("2026-07-05T00:00:00.000Z"),
          },
        ]);

        await context.db.insert(schema.operationsClaimScrubberRules).values(
          stateConfigs.flatMap((config) => [
            {
              id: `${idPrefix}-scrub-${config.state.toLowerCase()}-auth`,
              organizationId: orgId,
              state: config.state,
              payerName: config.payer,
              serviceType: "rbt_direct",
              cptCode: config.directCpt,
              modifier: null,
              placeOfService: "11",
              ruleType: "authorization_required",
              severity: "error",
              requirement:
                "Authorization number, effective dates, approved units, and remaining units must be present before claim release.",
              failureMessage: "Hold claim: authorization packet is incomplete or exhausted.",
              effectiveDate: new Date("2026-07-01T00:00:00.000Z"),
              status: "active",
            },
            {
              id: `${idPrefix}-scrub-${config.state.toLowerCase()}-note`,
              organizationId: orgId,
              state: config.state,
              payerName: config.payer,
              serviceType: "rbt_direct",
              cptCode: config.directCpt,
              modifier: null,
              placeOfService: "11",
              ruleType: "signed_note_required",
              severity: "error",
              requirement:
                "RBT session note, time in/out, data summary, provider identity, and signature must be complete.",
              failureMessage: "Hold claim: signed session documentation is missing.",
              effectiveDate: new Date("2026-07-01T00:00:00.000Z"),
              status: "active",
            },
          ]),
        );

        await context.db.insert(schema.aiVideoAlerts).values(
          stateConfigs.map((config) => ({
            id: `${idPrefix}-ai-alert-${config.state.toLowerCase()}-001`,
            organizationId: orgId,
            patientId: `${idPrefix}-patient-${config.state.toLowerCase()}-01`,
            sessionId: null,
            state: config.state,
            severity: config.state === "MO" ? "high" : "medium",
            signal:
              config.state === "MO"
                ? "Child moved out of therapy area for 42 seconds; RBT not visible."
                : "RBT and child were out of frame; verify supervision note before claim release.",
            aiModel: "video-safety-human-review-v1",
            confidencePercent: config.state === "MO" ? 91 : 77,
            clipUrl: null,
            humanReviewed: false,
            reviewedBy: null,
            reviewedAt: null,
            resolution: null,
            claimHold: true,
          })),
        );

        await context.db.insert(schema.operationsAiAlertReviewEvents).values({
          id: `${idPrefix}-ai-review-wa-001`,
          organizationId: orgId,
          alertId: `${idPrefix}-ai-alert-wa-001`,
          reviewerUserId: userId,
          reviewerRole: "bcba",
          decision: "monitor",
          falsePositiveReason: null,
          clinicalAction: "BCBA reviewed clip; no incident, but RBT reminded to keep camera framing stable.",
          claimHoldAfterReview: false,
          reviewedAt: new Date("2026-07-05T00:00:00.000Z"),
        });

        await context.db.insert(schema.operationsCallLogs).values(
          stateConfigs.map((config) => ({
            id: `${idPrefix}-call-${config.state.toLowerCase()}-001`,
            organizationId: orgId,
            claimId: `${idPrefix}-claim-${config.state.toLowerCase()}-rbt-001`,
            authorizationId: `${idPrefix}-auth-${config.state.toLowerCase()}-rbt`,
            patientId: `${idPrefix}-patient-${config.state.toLowerCase()}-01`,
            state: config.state,
            payerName: config.payer,
            callType: "claim_status",
            direction: "outbound",
            callerRole: "india_rcm",
            callerName: "India RCM Team",
            phoneNumberLabel: `${config.state} billing line`,
            payerRepresentative: "Payer representative",
            referenceNumber: `REF-${config.state}-20260705`,
            disposition:
              config.claimStatus === "ready" ? "accepted for processing" : "requires follow-up",
            summary: "Seeded payer call log with required reference number and next action.",
            nextAction: "Verify ERA/EFT enrollment and update claim status.",
            followUpDate: new Date("2026-07-08T00:00:00.000Z"),
            minimumNecessaryFields: [
              "billing_provider_npi",
              "member_id",
              "date_of_service",
              "claim_trace",
            ],
            recordingConsent: "not_recorded",
            recordingUrl: null,
            escalationRequired: config.claimStatus === "blocked",
            escalatedTo: config.claimStatus === "blocked" ? "Owner BCBA" : null,
            createdBy: userId,
          })),
        );

        await context.db.insert(schema.operationsTrainingCompletions).values(
          stateConfigs.flatMap((config) => [
            {
              id: `${idPrefix}-training-rbt-${config.state.toLowerCase()}-documentation`,
              organizationId: orgId,
              providerId: `${idPrefix}-provider-rbt-${config.state.toLowerCase()}`,
              patientId: `${idPrefix}-patient-${config.state.toLowerCase()}-01`,
              assignedToRole: "rbt",
              assignedToName: config.rbt,
              moduleId: "rbt-claim-ready-documentation",
              moduleTitle: "RBT data collection and claim-ready session notes",
              audience: "rbt",
              assignedAt: new Date("2026-07-05T00:00:00.000Z"),
              dueDate: new Date("2026-07-12T00:00:00.000Z"),
              completedAt: config.state === "WA" ? new Date("2026-07-05T00:00:00.000Z") : null,
              competencyScore: config.state === "WA" ? 94 : null,
              signatureName: config.state === "WA" ? config.rbt : null,
              supervisorSignoffBy: config.state === "WA" ? userId : null,
              supervisorSignoffAt: config.state === "WA" ? new Date("2026-07-05T00:00:00.000Z") : null,
              status: config.state === "WA" ? "complete" : "assigned",
              evidenceUrl: null,
            },
            {
              id: `${idPrefix}-training-parent-${config.state.toLowerCase()}-home`,
              organizationId: orgId,
              providerId: null,
              patientId: `${idPrefix}-patient-${config.state.toLowerCase()}-01`,
              assignedToRole: "parent",
              assignedToName: `Parent ${config.state}-01`,
              moduleId: "parent-home-practice",
              moduleTitle: "Home practice and generalization",
              audience: "parent",
              assignedAt: new Date("2026-07-05T00:00:00.000Z"),
              dueDate: new Date("2026-07-19T00:00:00.000Z"),
              completedAt: null,
              competencyScore: null,
              signatureName: null,
              supervisorSignoffBy: null,
              supervisorSignoffAt: null,
              status: "assigned",
              evidenceUrl: null,
            },
          ]),
        );

        await context.db.insert(schema.operationsLedgerLinks).values(
          stateConfigs.flatMap((config) => [
            {
              id: `${idPrefix}-link-${config.state.toLowerCase()}-payroll`,
              organizationId: orgId,
              ledgerEntryId: `${idPrefix}-ledger-${config.state.toLowerCase()}-payroll-rbt`,
              payrollEntryId: `${idPrefix}-time-${config.state.toLowerCase()}-rbt-001`,
              claimId: null,
              eraTrace: null,
              bankDepositId: null,
              reconciliationStatus: "payroll_ready",
              varianceCents: 0,
              notes: "Payroll expense linked to RBT clock entry.",
            },
            {
              id: `${idPrefix}-link-${config.state.toLowerCase()}-claim`,
              organizationId: orgId,
              ledgerEntryId: `${idPrefix}-ledger-${config.state.toLowerCase()}-ar-rbt`,
              payrollEntryId: `${idPrefix}-time-${config.state.toLowerCase()}-rbt-001`,
              claimId: `${idPrefix}-claim-${config.state.toLowerCase()}-rbt-001`,
              eraTrace: null,
              bankDepositId: null,
              reconciliationStatus:
                config.claimStatus === "ready" ? "awaiting_era" : "claim_hold",
              varianceCents: 0,
              notes: "Claim receivable linked to service time and payroll cost.",
            },
          ]),
        );

        return { ok: true, created: 10 + stateConfigs.length * 31, skipped: 0 };
      }),
    createWorkItem: orgAuthed
      .route({
        method: "POST",
        path: "/operations/work-items",
        summary: "Create an operations work item",
        tags: ["Operations"],
      })
      .input(OperationsWorkItemInputSchema)
      .output(OperationMutationResultSchema)
      .handler(async ({ context, input }) => {
        const { operationsWorkItems } = await import("../db/schema");
        const id = crypto.randomUUID();

        await context.db.insert(operationsWorkItems).values({
          id,
          organizationId: context.organizationId!,
          state: input.state,
          domain: input.domain,
          priority: input.priority,
          owner: input.owner,
          title: input.title,
          detail: input.detail ?? null,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
          blocks: input.blocks ?? null,
          source: input.source ?? "manual",
          status: "open",
        });

        return { id, ok: true };
      }),
    completeWorkItem: orgAuthed
      .route({
        method: "PATCH",
        path: "/operations/work-items/:id/complete",
        summary: "Complete an operations work item",
        tags: ["Operations"],
      })
      .input(z.object({ id: z.string() }))
      .output(OperationMutationResultSchema)
      .handler(async ({ context, input }) => {
        const { operationsWorkItems } = await import("../db/schema");
        const [workItem] = await context.db
          .update(operationsWorkItems)
          .set({
            status: "closed",
            completedAt: new Date(),
            completedBy: context.user!.id,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(operationsWorkItems.id, input.id),
              eq(operationsWorkItems.organizationId, context.organizationId!),
            ),
          )
          .returning({ id: operationsWorkItems.id });

        if (!workItem) {
          throw new Error("Operations work item not found");
        }

        return { id: workItem.id, ok: true };
      }),
    createPayrollTimeEntry: orgAuthed
      .route({
        method: "POST",
        path: "/operations/payroll-time-entries",
        summary: "Create a payroll and claim time entry",
        tags: ["Operations"],
      })
      .input(OperationsPayrollTimeEntryInputSchema)
      .output(OperationMutationResultSchema)
      .handler(async ({ context, input }) => {
        const { operationsPayrollTimeEntries } = await import("../db/schema");
        const id = crypto.randomUUID();

        await context.db.insert(operationsPayrollTimeEntries).values({
          id,
          organizationId: context.organizationId!,
          providerId: input.providerId ?? null,
          patientId: input.patientId ?? null,
          scheduleBlockId: input.scheduleBlockId ?? null,
          staffName: input.staffName,
          role: input.role,
          state: input.state,
          center: input.center ?? null,
          serviceType: input.serviceType,
          clockIn: new Date(input.clockIn),
          clockOut: input.clockOut ? new Date(input.clockOut) : null,
          paidMinutes: input.paidMinutes,
          billableMinutes: input.billableMinutes,
          noteSigned: input.noteSigned,
          claimReady: input.claimReady,
        });

        return { id, ok: true };
      }),
    createCallLog: orgAuthed
      .route({
        method: "POST",
        path: "/operations/call-logs",
        summary: "Create a structured payer or parent call log",
        tags: ["Operations"],
      })
      .input(OperationsCallLogInputSchema)
      .output(OperationMutationResultSchema)
      .handler(async ({ context, input }) => {
        await enforceOperationsPermission(
          context,
          "create",
          "operations_call_logs",
          input.state,
        );
        const {
          operationsCallLogs,
          claimEvents,
          insuranceClaims,
        } = await import("../db/schema");
        const id = crypto.randomUUID();

        await context.db.insert(operationsCallLogs).values({
          id,
          organizationId: context.organizationId!,
          claimId: input.claimId ?? null,
          authorizationId: input.authorizationId ?? null,
          patientId: input.patientId ?? null,
          state: input.state,
          payerName: input.payerName ?? null,
          callType: input.callType,
          direction: "outbound",
          callerRole: "india_rcm",
          callerName: input.callerName ?? "India RCM",
          phoneNumberLabel: input.phoneNumberLabel ?? "US billing line",
          payerRepresentative: input.payerRepresentative,
          referenceNumber: input.referenceNumber,
          disposition: input.disposition,
          summary: input.summary,
          nextAction: input.nextAction ?? null,
          followUpDate: input.followUpDate ? new Date(input.followUpDate) : null,
          minimumNecessaryFields: input.minimumNecessaryFields,
          recordingConsent: "not_recorded",
          recordingUrl: null,
          escalationRequired: input.escalationRequired,
          escalatedTo: input.escalatedTo ?? null,
          createdBy: context.user!.id,
        });

        if (input.claimId) {
          await context.db.insert(claimEvents).values({
            id: crypto.randomUUID(),
            organizationId: context.organizationId!,
            claimId: input.claimId,
            eventType: "call",
            eventDate: new Date(),
            payerRepresentative: input.payerRepresentative,
            referenceNumber: input.referenceNumber,
            summary: input.summary,
            nextAction: input.nextAction ?? null,
            createdBy: context.user!.id,
          });
          await context.db
            .update(insuranceClaims)
            .set({
              status: "follow_up",
              nextFollowUpDate: input.followUpDate
                ? new Date(input.followUpDate)
                : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              updatedAt: new Date(),
            })
            .where(
              and(
                eq(insuranceClaims.id, input.claimId),
                eq(insuranceClaims.organizationId, context.organizationId!),
              ),
            );
        }

        return { id, ok: true };
      }),
    reviewAiAlert: orgAuthed
      .route({
        method: "POST",
        path: "/operations/ai-alerts/review",
        summary: "Record human review for an AI video alert",
        tags: ["Operations"],
      })
      .input(OperationsAiAlertReviewInputSchema)
      .output(OperationMutationResultSchema)
      .handler(async ({ context, input }) => {
        await enforceOperationsPermission(context, "review", "ai_video_alerts");
        const { aiVideoAlerts, operationsAiAlertReviewEvents } = await import(
          "../db/schema"
        );
        const id = crypto.randomUUID();

        await context.db.insert(operationsAiAlertReviewEvents).values({
          id,
          organizationId: context.organizationId!,
          alertId: input.alertId,
          reviewerUserId: context.user!.id,
          reviewerRole: "bcba",
          decision: input.decision,
          falsePositiveReason: input.falsePositiveReason ?? null,
          clinicalAction: input.clinicalAction ?? null,
          claimHoldAfterReview: input.claimHoldAfterReview,
        });
        await context.db
          .update(aiVideoAlerts)
          .set({
            humanReviewed: true,
            reviewedBy: context.user!.id,
            reviewedAt: new Date(),
            resolution: input.clinicalAction ?? input.decision,
            claimHold: input.claimHoldAfterReview,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(aiVideoAlerts.id, input.alertId),
              eq(aiVideoAlerts.organizationId, context.organizationId!),
            ),
          );

        return { id, ok: true };
      }),
    completeTraining: orgAuthed
      .route({
        method: "PATCH",
        path: "/operations/training-completions/:id/complete",
        summary: "Complete a parent/RBT/BCBA training assignment",
        tags: ["Operations"],
      })
      .input(OperationsTrainingCompletionInputSchema)
      .output(OperationMutationResultSchema)
      .handler(async ({ context, input }) => {
        await enforceOperationsPermission(
          context,
          "update",
          "operations_training_completions",
        );
        const { operationsTrainingCompletions } = await import("../db/schema");
        const [record] = await context.db
          .update(operationsTrainingCompletions)
          .set({
            completedAt: new Date(),
            competencyScore: input.competencyScore,
            signatureName: input.signatureName,
            supervisorSignoffBy: context.user!.id,
            supervisorSignoffAt: new Date(),
            status: "complete",
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(operationsTrainingCompletions.id, input.id),
              eq(
                operationsTrainingCompletions.organizationId,
                context.organizationId!,
              ),
            ),
          )
          .returning({ id: operationsTrainingCompletions.id });

        if (!record) {
          throw new Error("Training assignment not found");
        }

        return { id: record.id, ok: true };
      }),
  },
};
