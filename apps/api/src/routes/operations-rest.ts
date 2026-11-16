import { and, eq } from "drizzle-orm";
import { getDb, schema } from "../lib/db";

type OperationsEntity =
  | "providers"
  | "licenses"
  | "payerCredentialing"
  | "authorizations"
  | "payrollEntries"
  | "claims"
  | "ledgerEntries";

const operationsEntities = new Set<OperationsEntity>([
  "providers",
  "licenses",
  "payerCredentialing",
  "authorizations",
  "payrollEntries",
  "claims",
  "ledgerEntries",
]);

function asEntity(value: string): OperationsEntity | null {
  return operationsEntities.has(value as OperationsEntity)
    ? (value as OperationsEntity)
    : null;
}

function getTable(entity: OperationsEntity) {
  return {
    providers: schema.providerProfiles,
    licenses: schema.providerStateLicenses,
    payerCredentialing: schema.payerCredentialing,
    authorizations: schema.serviceAuthorizations,
    payrollEntries: schema.operationsPayrollTimeEntries,
    claims: schema.insuranceClaims,
    ledgerEntries: schema.operationsAccountingLedgerEntries,
  }[entity] as any;
}

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

function getOperationsDb(c: any) {
  const connectionString =
    c.env?.DATABASE?.connectionString || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required for operations routes");
  }
  return getDb({ env: { DATABASE: { connectionString } } } as any);
}

function buildValues(
  entity: OperationsEntity,
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

async function ensureOrgAndUser(db: any, orgId: string) {
  const userId = "demo-user-001";
  const [existingUser] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);
  if (!existingUser) {
    await db.insert(schema.users).values({
      id: userId,
      email: "demo@autism.app",
      name: "Demo Owner BCBA",
      emailVerified: true,
    });
  }

  const [existingOrg] = await db
    .select()
    .from(schema.organizations)
    .where(eq(schema.organizations.id, orgId))
    .limit(1);
  if (!existingOrg) {
    await db.insert(schema.organizations).values({
      id: orgId,
      name: "ABA Multi-State Launch",
      slug: orgId,
    });
  }

  return { userId, orgId };
}

export function registerOperationsRestRoutes(app: any) {
  app.get("/api/v1/operations/snapshot", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const db = getOperationsDb(c);
    const [
      providers,
      licenses,
      payerCredentialing,
      authorizations,
      claims,
      claimEvents,
      hipaaAuditLogs,
      indiaRcmAccess,
      aiVideoAlerts,
      payrollTimeEntries,
      accountingLedgerEntries,
      rolePermissionPolicies,
      callLogs,
      claimScrubberRules,
      aiAlertReviewEvents,
      ledgerLinks,
      trainingCompletions,
    ] = await Promise.all([
      db.select().from(schema.providerProfiles).where(eq(schema.providerProfiles.organizationId, orgId)),
      db.select().from(schema.providerStateLicenses).where(eq(schema.providerStateLicenses.organizationId, orgId)),
      db.select().from(schema.payerCredentialing).where(eq(schema.payerCredentialing.organizationId, orgId)),
      db.select().from(schema.serviceAuthorizations).where(eq(schema.serviceAuthorizations.organizationId, orgId)),
      db.select().from(schema.insuranceClaims).where(eq(schema.insuranceClaims.organizationId, orgId)),
      db.select().from(schema.claimEvents).where(eq(schema.claimEvents.organizationId, orgId)),
      db.select().from(schema.hipaaAuditLogs).where(eq(schema.hipaaAuditLogs.organizationId, orgId)),
      db.select().from(schema.indiaRcmAccess).where(eq(schema.indiaRcmAccess.organizationId, orgId)),
      db.select().from(schema.aiVideoAlerts).where(eq(schema.aiVideoAlerts.organizationId, orgId)),
      db.select().from(schema.operationsPayrollTimeEntries).where(eq(schema.operationsPayrollTimeEntries.organizationId, orgId)),
      db.select().from(schema.operationsAccountingLedgerEntries).where(eq(schema.operationsAccountingLedgerEntries.organizationId, orgId)),
      db.select().from(schema.operationsRolePermissionPolicies).where(eq(schema.operationsRolePermissionPolicies.organizationId, orgId)),
      db.select().from(schema.operationsCallLogs).where(eq(schema.operationsCallLogs.organizationId, orgId)),
      db.select().from(schema.operationsClaimScrubberRules).where(eq(schema.operationsClaimScrubberRules.organizationId, orgId)),
      db.select().from(schema.operationsAiAlertReviewEvents).where(eq(schema.operationsAiAlertReviewEvents.organizationId, orgId)),
      db.select().from(schema.operationsLedgerLinks).where(eq(schema.operationsLedgerLinks.organizationId, orgId)),
      db.select().from(schema.operationsTrainingCompletions).where(eq(schema.operationsTrainingCompletions.organizationId, orgId)),
    ]);

    return c.json({
      providers,
      licenses,
      payerCredentialing,
      authorizations,
      claims,
      claimEvents,
      hipaaAuditLogs,
      indiaRcmAccess,
      aiVideoAlerts,
      payrollTimeEntries,
      accountingLedgerEntries,
      rolePermissionPolicies,
      callLogs,
      claimScrubberRules,
      aiAlertReviewEvents,
      ledgerLinks,
      trainingCompletions,
      payerRateRules: [],
      scheduleBlocks: [],
      payerPaymentCycles: [],
      complianceRequirements: [],
      workItems: [],
    });
  });

  app.post("/api/v1/operations/claims/:id/submit", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const claimId = c.req.param("id");
    const body = await c.req.json().catch(() => ({}));
    const db = getOperationsDb(c);
    await ensureOrgAndUser(db, orgId);
    const [claim] = await db
      .update(schema.insuranceClaims)
      .set({
        status: "submitted",
        submittedDate: new Date(),
        clearinghouseTrace:
          stringOrNull(body.clearinghouseTrace) ?? `CH-${Date.now()}`,
        nextFollowUpDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.insuranceClaims.id, claimId),
          eq(schema.insuranceClaims.organizationId, orgId),
        ),
      )
      .returning();
    if (!claim) return c.json({ error: "Claim not found" }, 404);

    await db.insert(schema.claimEvents).values({
      organizationId: orgId,
      claimId: claim.id,
      eventType: "submission",
      eventDate: new Date(),
      summary: "Claim submitted from operations dashboard.",
      nextAction: "Monitor clearinghouse and payer adjudication.",
      createdBy: "demo-user-001",
    });

    return c.json({ id: claim.id, ok: true });
  });

  app.post("/api/v1/operations/claims/:id/payment", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const claimId = c.req.param("id");
    const body = await c.req.json().catch(() => ({}));
    const paidCents = numberOrDefault(body.paidCents, 0);
    const allowedCents = numberOrDefault(body.allowedCents, paidCents);
    const db = getOperationsDb(c);
    await ensureOrgAndUser(db, orgId);
    const [claim] = await db
      .update(schema.insuranceClaims)
      .set({
        status: paidCents > 0 ? "paid" : "zero_paid",
        allowedCents,
        paidCents,
        denialReason: paidCents > 0 ? null : stringOrNull(body.denialReason),
        nextFollowUpDate: paidCents > 0 ? null : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.insuranceClaims.id, claimId),
          eq(schema.insuranceClaims.organizationId, orgId),
        ),
      )
      .returning();
    if (!claim) return c.json({ error: "Claim not found" }, 404);

    await db.insert(schema.claimEvents).values({
      organizationId: orgId,
      claimId: claim.id,
      eventType: paidCents > 0 ? "payment" : "zero_paid",
      eventDate: new Date(),
      referenceNumber: stringOrNull(body.referenceNumber),
      summary:
        paidCents > 0
          ? `Payment posted for ${(paidCents / 100).toFixed(2)}.`
          : "Zero-paid claim posted for follow-up.",
      nextAction: paidCents > 0 ? "Reconcile ERA to bank deposit." : "Open denial follow-up.",
      createdBy: "demo-user-001",
    });

    await db.insert(schema.operationsAccountingLedgerEntries).values([
      {
        organizationId: orgId,
        state: claim.state,
        center: null,
        clientLabel: null,
        providerId: null,
        patientId: claim.patientId,
        sourceType: "payment",
        sourceId: claim.id,
        account: "Cash",
        debitCents: paidCents,
        creditCents: 0,
        entryDate: new Date(),
        memo: "ERA/payment cash posting.",
        postedAt: new Date(),
      },
      {
        organizationId: orgId,
        state: claim.state,
        center: null,
        clientLabel: null,
        providerId: null,
        patientId: claim.patientId,
        sourceType: "payment",
        sourceId: claim.id,
        account: "Accounts Receivable",
        debitCents: 0,
        creditCents: paidCents,
        entryDate: new Date(),
        memo: "Reduce receivable after payment posting.",
        postedAt: new Date(),
      },
    ]);

    return c.json({ id: claim.id, ok: true });
  });

  app.post("/api/v1/operations/claims/:id/denial", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const claimId = c.req.param("id");
    const body = await c.req.json().catch(() => ({}));
    const denialReason = stringOrDefault(
      body.denialReason,
      "Missing documentation or authorization issue",
    );
    const db = getOperationsDb(c);
    await ensureOrgAndUser(db, orgId);
    const [claim] = await db
      .update(schema.insuranceClaims)
      .set({
        status: "denied",
        denialReason,
        nextFollowUpDate: dateOrDefault(
          body.nextFollowUpDate,
          new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        ),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.insuranceClaims.id, claimId),
          eq(schema.insuranceClaims.organizationId, orgId),
        ),
      )
      .returning();
    if (!claim) return c.json({ error: "Claim not found" }, 404);

    await db.insert(schema.claimEvents).values({
      organizationId: orgId,
      claimId: claim.id,
      eventType: "denial",
      eventDate: new Date(),
      referenceNumber: stringOrNull(body.referenceNumber),
      summary: denialReason,
      nextAction: stringOrDefault(body.nextAction, "Call payer and prepare corrected claim or appeal."),
      createdBy: "demo-user-001",
    });

    return c.json({ id: claim.id, ok: true });
  });

  app.post("/api/v1/operations/claims/:id/follow-up", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const claimId = c.req.param("id");
    const body = await c.req.json().catch(() => ({}));
    const db = getOperationsDb(c);
    await ensureOrgAndUser(db, orgId);
    const [claim] = await db
      .update(schema.insuranceClaims)
      .set({
        status: "follow_up",
        nextFollowUpDate: dateOrDefault(
          body.nextFollowUpDate,
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.insuranceClaims.id, claimId),
          eq(schema.insuranceClaims.organizationId, orgId),
        ),
      )
      .returning();
    if (!claim) return c.json({ error: "Claim not found" }, 404);

    await db.insert(schema.claimEvents).values({
      organizationId: orgId,
      claimId: claim.id,
      eventType: "call",
      eventDate: new Date(),
      payerRepresentative: stringOrNull(body.payerRepresentative),
      referenceNumber: stringOrNull(body.referenceNumber),
      summary: stringOrDefault(body.summary, "Payer follow-up call logged."),
      nextAction: stringOrNull(body.nextAction),
      createdBy: "demo-user-001",
    });

    return c.json({ id: claim.id, ok: true });
  });

  app.post("/api/v1/operations/call-logs", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const body = await c.req.json().catch(() => ({}));
    const referenceNumber = stringOrDefault(body.referenceNumber, "");
    const payerRepresentative = stringOrDefault(body.payerRepresentative, "");
    if (!referenceNumber || !payerRepresentative) {
      return c.json(
        { error: "payerRepresentative and referenceNumber are required" },
        400,
      );
    }
    const db = getOperationsDb(c);
    const { userId } = await ensureOrgAndUser(db, orgId);
    const [log] = await db
      .insert(schema.operationsCallLogs)
      .values({
        organizationId: orgId,
        claimId: stringOrNull(body.claimId),
        authorizationId: stringOrNull(body.authorizationId),
        patientId: stringOrNull(body.patientId),
        state: stringOrDefault(body.state, "WA"),
        payerName: stringOrNull(body.payerName),
        callType: stringOrDefault(body.callType, "claim_status"),
        direction: "outbound",
        callerRole: "india_rcm",
        callerName: stringOrDefault(body.callerName, "India RCM"),
        phoneNumberLabel: stringOrDefault(body.phoneNumberLabel, "US billing line"),
        payerRepresentative,
        referenceNumber,
        disposition: stringOrDefault(body.disposition, "follow_up_needed"),
        summary: stringOrDefault(body.summary, "Payer call logged."),
        nextAction: stringOrNull(body.nextAction),
        followUpDate: dateOrNull(body.followUpDate),
        minimumNecessaryFields: stringArrayOrNull(body.minimumNecessaryFields),
        recordingConsent: "not_recorded",
        recordingUrl: null,
        escalationRequired: booleanOrDefault(body.escalationRequired),
        escalatedTo: stringOrNull(body.escalatedTo),
        createdBy: userId,
      })
      .returning();

    if (body.claimId) {
      await db.insert(schema.claimEvents).values({
        organizationId: orgId,
        claimId: body.claimId,
        eventType: "call",
        eventDate: new Date(),
        payerRepresentative,
        referenceNumber,
        summary: stringOrDefault(body.summary, "Payer call logged."),
        nextAction: stringOrNull(body.nextAction),
        createdBy: userId,
      });
    }

    await db.insert(schema.hipaaAuditLogs).values({
      organizationId: orgId,
      actorUserId: userId,
      actorRole: "india_rcm",
      action: "create:operations_call_logs",
      resourceType: "operations_call_logs",
      resourceId: log.id,
      patientId: stringOrNull(body.patientId),
      country: "India",
      metadata: { minimumNecessaryFields: body.minimumNecessaryFields ?? [] },
    });

    return c.json({ id: log.id, ok: true });
  });

  app.post("/api/v1/operations/ai-alerts/review", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const body = await c.req.json().catch(() => ({}));
    const alertId = stringOrDefault(body.alertId, "");
    if (!alertId) return c.json({ error: "alertId is required" }, 400);
    const db = getOperationsDb(c);
    const { userId } = await ensureOrgAndUser(db, orgId);
    const [review] = await db
      .insert(schema.operationsAiAlertReviewEvents)
      .values({
        organizationId: orgId,
        alertId,
        reviewerUserId: userId,
        reviewerRole: "bcba",
        decision: stringOrDefault(body.decision, "monitor"),
        falsePositiveReason: stringOrNull(body.falsePositiveReason),
        clinicalAction: stringOrNull(body.clinicalAction),
        claimHoldAfterReview: booleanOrDefault(body.claimHoldAfterReview, true),
      })
      .returning();

    await db
      .update(schema.aiVideoAlerts)
      .set({
        humanReviewed: true,
        reviewedBy: userId,
        reviewedAt: new Date(),
        resolution: stringOrDefault(body.clinicalAction, stringOrDefault(body.decision, "monitor")),
        claimHold: booleanOrDefault(body.claimHoldAfterReview, true),
        updatedAt: new Date(),
      })
      .where(and(eq(schema.aiVideoAlerts.id, alertId), eq(schema.aiVideoAlerts.organizationId, orgId)));

    return c.json({ id: review.id, ok: true });
  });

  app.patch("/api/v1/operations/training-completions/:id/complete", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const id = c.req.param("id");
    const body = await c.req.json().catch(() => ({}));
    const db = getOperationsDb(c);
    const { userId } = await ensureOrgAndUser(db, orgId);
    const [record] = await db
      .update(schema.operationsTrainingCompletions)
      .set({
        completedAt: new Date(),
        competencyScore: numberOrDefault(body.competencyScore, 100),
        signatureName: stringOrDefault(body.signatureName, "Signed in portal"),
        supervisorSignoffBy: userId,
        supervisorSignoffAt: new Date(),
        status: "complete",
        updatedAt: new Date(),
      })
      .where(and(eq(schema.operationsTrainingCompletions.id, id), eq(schema.operationsTrainingCompletions.organizationId, orgId)))
      .returning();
    if (!record) return c.json({ error: "Training assignment not found" }, 404);
    return c.json({ id: record.id, ok: true });
  });

  app.post("/api/v1/operations/records", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const body = await c.req.json().catch(() => null);
    const entity = asEntity(body?.entity);
    if (!entity || !body?.record) {
      return c.json({ error: "Valid entity and record are required" }, 400);
    }
    const db = getOperationsDb(c);
    await ensureOrgAndUser(db, orgId);
    const [record] = await db
      .insert(getTable(entity))
      .values(buildValues(entity, body.record, orgId))
      .returning();
    return c.json({ id: record.id, ok: true });
  });

  app.patch("/api/v1/operations/records/:entity/:id", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const entity = asEntity(c.req.param("entity"));
    const id = c.req.param("id");
    const body = await c.req.json().catch(() => null);
    if (!entity || !body?.record) {
      return c.json({ error: "Valid entity and record are required" }, 400);
    }
    const table = getTable(entity);
    const { organizationId: _organizationId, ...values } = buildValues(
      entity,
      body.record,
      orgId,
    );
    const db = getOperationsDb(c);
    const [record] = await db
      .update(table)
      .set({ ...values, updatedAt: new Date() })
      .where(and(eq(table.id, id), eq(table.organizationId, orgId)))
      .returning();
    if (!record) return c.json({ error: "Operations record not found" }, 404);
    return c.json({ id: record.id, ok: true });
  });

  app.delete("/api/v1/operations/records/:entity/:id", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const entity = asEntity(c.req.param("entity"));
    const id = c.req.param("id");
    if (!entity) return c.json({ error: "Valid entity is required" }, 400);
    const table = getTable(entity);
    const db = getOperationsDb(c);
    const [record] = await db
      .delete(table)
      .where(and(eq(table.id, id), eq(table.organizationId, orgId)))
      .returning();
    if (!record) return c.json({ error: "Operations record not found" }, 404);
    return c.json({ id: record.id, ok: true });
  });

  app.post("/api/v1/operations/seed-launch-data", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const db = getOperationsDb(c);
    const { userId } = await ensureOrgAndUser(db, orgId);
    const existing = await db
      .select()
      .from(schema.providerProfiles)
      .where(eq(schema.providerProfiles.organizationId, orgId))
      .limit(1);
    if (existing.length > 0) {
      return c.json({ ok: true, created: 0, skipped: 1 });
    }

    const states = [
      ["WA", "WA Center", "Washington Apple Health / ProviderOne", "RBT WA-1", "ready", 7000],
      ["ND", "ND Center", "North Dakota Medicaid", "RBT ND-1", "hold", 6800],
      ["CT", "CT Center", "Connecticut Medical Assistance Program / HUSKY", "RBT CT-1", "blocked", 7200],
      ["MO", "MO Center", "MO HealthNet", "RBT MO-1", "hold", 6900],
    ] as const;

    const [ownerProvider] = await db.insert(schema.providerProfiles).values({
      organizationId: orgId,
      userId,
      displayName: "Owner BCBA",
      role: "owner_bcba",
      employmentType: "employee",
      homeState: "WA",
      serviceStates: ["WA", "ND", "CT", "MO"],
      status: "active",
      maxClientLoad: 12,
      notes: "Owner BCBA supervising four-state launch.",
    }).returning();

    await db.insert(schema.operationsRolePermissionPolicies).values([
      {
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
        reviewedAt: new Date(),
      },
      {
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
        reviewedAt: new Date(),
      },
    ]);

    for (const [state, center, payer, rbt, claimStatus, directRateCents] of states) {
      const [rbtProvider] = await db.insert(schema.providerProfiles).values({
        organizationId: orgId,
        displayName: rbt,
        role: "rbt",
        employmentType: "employee",
        homeState: state,
        serviceStates: [state],
        status: "credentialing",
        maxClientLoad: 1,
        notes: `Launch RBT for ${center}.`,
      }).returning();

      const [patient] = await db.insert(schema.patients).values({
        organizationId: orgId,
        firstName: "Client",
        lastName: `${state}-01`,
        dateOfBirth: new Date("2018-01-15T00:00:00.000Z"),
        diagnosis: "Autism Spectrum Disorder",
        severityLevel: "requires_support",
        primaryLanguage: "en",
        preferredCommunication: "verbal",
        status: "active",
        createdBy: userId,
      }).returning();

      await db.insert(schema.providerStateLicenses).values([
        {
          organizationId: orgId,
          providerId: ownerProvider.id,
          state,
          licenseType: "BCBA/LBA permission",
          status: state === "CT" ? "pending" : "active",
          expirationDate: new Date("2027-07-01T00:00:00.000Z"),
          verifiedBy: state === "CT" ? null : userId,
          verifiedAt: state === "CT" ? null : new Date(),
        },
        {
          organizationId: orgId,
          providerId: rbtProvider.id,
          state,
          licenseType: "RBT credential/state background checks",
          status: "pending",
        },
      ]);

      const [credentialing] = await db.insert(schema.payerCredentialing).values({
        organizationId: orgId,
        providerId: ownerProvider.id,
        payerName: payer,
        state,
        networkType: "medicaid",
        status: state === "CT" ? "blocked" : "pending",
        submittedDate: new Date("2026-07-05T00:00:00.000Z"),
        notes: "Seeded launch credentialing record; replace with payer evidence.",
      }).returning();

      const [authorization] = await db.insert(schema.serviceAuthorizations).values({
        organizationId: orgId,
        patientId: patient.id,
        payerCredentialingId: credentialing.id,
        payerName: payer,
        state,
        cptCode: "97153",
        approvedUnits: 480,
        usedUnits: state === "MO" ? 480 : 24,
        startDate: new Date("2026-07-01T00:00:00.000Z"),
        endDate: new Date("2026-09-30T00:00:00.000Z"),
        status: state === "MO" ? "exhausted" : "active",
      }).returning();

      const [payroll] = await db.insert(schema.operationsPayrollTimeEntries).values({
        organizationId: orgId,
        providerId: rbtProvider.id,
        patientId: patient.id,
        staffName: rbt,
        role: "rbt",
        state,
        center,
        serviceType: "rbt_direct",
        clockIn: new Date("2026-07-03T09:00:00.000Z"),
        clockOut: new Date("2026-07-03T15:00:00.000Z"),
        paidMinutes: 360,
        billableMinutes: 360,
        noteSigned: state !== "CT",
        claimReady: claimStatus === "ready",
        payrollRunId: "seed-payroll-2026-07-05",
      }).returning();

      const [claim] = await db.insert(schema.insuranceClaims).values({
        organizationId: orgId,
        patientId: patient.id,
        authorizationId: authorization.id,
        payerName: payer,
        state,
        status: claimStatus,
        dateOfService: new Date("2026-07-03T00:00:00.000Z"),
        billedCents: 6 * directRateCents,
        denialReason:
          claimStatus === "blocked"
            ? "Unsigned RBT note / credentialing not effective"
            : null,
        nextFollowUpDate: new Date("2026-07-08T00:00:00.000Z"),
      }).returning();

      const ledgerRows = await db.insert(schema.operationsAccountingLedgerEntries).values([
        {
          organizationId: orgId,
          state,
          center,
          clientLabel: `Client ${state}-01`,
          providerId: rbtProvider.id,
          patientId: patient.id,
          sourceType: "payroll",
          sourceId: payroll.id,
          account: "Payroll Expense:RBT",
          debitCents: 6 * 2800,
          creditCents: 0,
          entryDate: new Date("2026-07-03T00:00:00.000Z"),
          memo: "Seeded RBT payroll cost by state/client/provider.",
        },
        {
          organizationId: orgId,
          state,
          center,
          clientLabel: `Client ${state}-01`,
          providerId: rbtProvider.id,
          patientId: patient.id,
          sourceType: "claim",
          sourceId: claim.id,
          account: claimStatus === "ready" ? "Accounts Receivable" : "Claim Hold",
          debitCents: claim.billedCents,
          creditCents: 0,
          entryDate: new Date("2026-07-03T00:00:00.000Z"),
          memo: "Seeded RBT claim receivable or hold.",
        },
      ]).returning();

      await db.insert(schema.operationsClaimScrubberRules).values([
        {
          organizationId: orgId,
          state,
          payerName: payer,
          serviceType: "rbt_direct",
          cptCode: "97153",
          placeOfService: "11",
          ruleType: "authorization_required",
          severity: "error",
          requirement: "Authorization number, dates, approved units, and remaining units must be present before claim release.",
          failureMessage: "Hold claim: authorization packet is incomplete or exhausted.",
          effectiveDate: new Date("2026-07-01T00:00:00.000Z"),
          status: "active",
        },
        {
          organizationId: orgId,
          state,
          payerName: payer,
          serviceType: "rbt_direct",
          cptCode: "97153",
          placeOfService: "11",
          ruleType: "signed_note_required",
          severity: "error",
          requirement: "RBT session note, time in/out, data summary, provider identity, and signature must be complete.",
          failureMessage: "Hold claim: signed session documentation is missing.",
          effectiveDate: new Date("2026-07-01T00:00:00.000Z"),
          status: "active",
        },
      ]);

      await db.insert(schema.operationsCallLogs).values({
        organizationId: orgId,
        claimId: claim.id,
        authorizationId: authorization.id,
        patientId: patient.id,
        state,
        payerName: payer,
        callType: "claim_status",
        direction: "outbound",
        callerRole: "india_rcm",
        callerName: "India RCM Team",
        phoneNumberLabel: `${state} billing line`,
        payerRepresentative: "Payer representative",
        referenceNumber: `REF-${state}-20260705`,
        disposition: claimStatus === "ready" ? "accepted for processing" : "requires follow-up",
        summary: "Seeded payer call log with required reference number and next action.",
        nextAction: "Verify ERA/EFT enrollment and update claim status.",
        followUpDate: new Date("2026-07-08T00:00:00.000Z"),
        minimumNecessaryFields: ["billing_provider_npi", "member_id", "date_of_service", "claim_trace"],
        recordingConsent: "not_recorded",
        escalationRequired: claimStatus === "blocked",
        escalatedTo: claimStatus === "blocked" ? "Owner BCBA" : null,
        createdBy: userId,
      });

      const [aiAlert] = await db.insert(schema.aiVideoAlerts).values({
        organizationId: orgId,
        patientId: patient.id,
        state,
        severity: state === "MO" ? "high" : "medium",
        signal:
          state === "MO"
            ? "Child moved out of therapy area; RBT not visible."
            : "RBT and child were out of frame; verify supervision note before claim release.",
        aiModel: "video-safety-human-review-v1",
        confidencePercent: state === "MO" ? 91 : 77,
        humanReviewed: false,
        claimHold: true,
      }).returning();

      if (state === "WA") {
        await db.insert(schema.operationsAiAlertReviewEvents).values({
          organizationId: orgId,
          alertId: aiAlert.id,
          reviewerUserId: userId,
          reviewerRole: "bcba",
          decision: "monitor",
          clinicalAction: "BCBA reviewed clip; no incident, but RBT reminded to keep camera framing stable.",
          claimHoldAfterReview: false,
          reviewedAt: new Date(),
        });
      }

      await db.insert(schema.operationsTrainingCompletions).values([
        {
          organizationId: orgId,
          providerId: rbtProvider.id,
          patientId: patient.id,
          assignedToRole: "rbt",
          assignedToName: rbt,
          moduleId: "rbt-claim-ready-documentation",
          moduleTitle: "RBT data collection and claim-ready session notes",
          audience: "rbt",
          dueDate: new Date("2026-07-12T00:00:00.000Z"),
          completedAt: state === "WA" ? new Date() : null,
          competencyScore: state === "WA" ? 94 : null,
          signatureName: state === "WA" ? rbt : null,
          supervisorSignoffBy: state === "WA" ? userId : null,
          supervisorSignoffAt: state === "WA" ? new Date() : null,
          status: state === "WA" ? "complete" : "assigned",
        },
        {
          organizationId: orgId,
          patientId: patient.id,
          assignedToRole: "parent",
          assignedToName: `Parent ${state}-01`,
          moduleId: "parent-home-practice",
          moduleTitle: "Home practice and generalization",
          audience: "parent",
          dueDate: new Date("2026-07-19T00:00:00.000Z"),
          status: "assigned",
        },
      ]);

      await db.insert(schema.operationsLedgerLinks).values([
        {
          organizationId: orgId,
          ledgerEntryId: ledgerRows[0].id,
          payrollEntryId: payroll.id,
          reconciliationStatus: "payroll_ready",
          varianceCents: 0,
          notes: "Payroll expense linked to RBT clock entry.",
        },
        {
          organizationId: orgId,
          ledgerEntryId: ledgerRows[1].id,
          payrollEntryId: payroll.id,
          claimId: claim.id,
          reconciliationStatus: claimStatus === "ready" ? "awaiting_era" : "claim_hold",
          varianceCents: 0,
          notes: "Claim receivable linked to service time and payroll cost.",
        },
      ]);
    }

    return c.json({ ok: true, created: 86, skipped: 0 });
  });
}
