/**
 * API Application
 *
 * Hono app with oRPC integration for Cloudflare Workers.
 */

import { createDb } from "@autism-legacy-20260205/storage";
import { OpenAPIGenerator } from "@orpc/openapi";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod";
import { and, eq, gte, sql } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
// import { captureException as sentryCaptureException } from "./lib/sentry";
import type { AppEnv, InitialContext } from "./context";
import {
  enrichContact,
  generateMeetingSummary,
  scoreLead,
  suggestEmailContent,
} from "./lib/ai-features";
import { createAuthFromEnv } from "./lib/create-auth-from-env";
import { getDb, schema } from "./lib/db";
import { APIError } from "./lib/errors";
import { loggerMiddleware } from "./middleware/logger";
// Monitoring imports disabled for Cloudflare Workers compatibility
// import { initSentry } from "./lib/sentry";
// import { initDatadog } from "./lib/datadog";
import { rateLimitRedis } from "./middleware/rate-limit-redis";
import { appRouter } from "./routers";
import { registerOperationsRestRoutes } from "./routes/operations-rest";

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

function getOperationTable(entity: OperationsEntity) {
  const tableByEntity = {
    providers: schema.providerProfiles,
    licenses: schema.providerStateLicenses,
    payerCredentialing: schema.payerCredentialing,
    authorizations: schema.serviceAuthorizations,
    payrollEntries: schema.operationsPayrollTimeEntries,
    claims: schema.insuranceClaims,
    ledgerEntries: schema.operationsAccountingLedgerEntries,
  } as const;
  return tableByEntity[entity] as any;
}

function asEntity(value: string): OperationsEntity | null {
  return operationsEntities.has(value as OperationsEntity)
    ? (value as OperationsEntity)
    : null;
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

function buildOperationsRestValues(
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

/**
 * Create Hono app with all routes
 */
export function createApp() {
  const app = new Hono<{ Bindings: AppEnv }>();

  // Monitoring disabled for Cloudflare Workers compatibility
  // (Sentry and Datadog require semver which fails in Workers environment)

  // Global middleware
  app.use(
    "*",
    cors({ origin: (origin: string | null) => origin, credentials: true }),
  );
  app.use("*", requestId());
  app.use("*", loggerMiddleware);

  // Health check (non-RPC) - must be before rate limiting
  app.get("/api/health", (c: any) => {
    return c.json({
      ok: true,
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    });
  });

  // AI assistant routes
  app.post("/api/ai/lead/score", async (c: any) => {
    try {
      const body = (await c.req.json()) as {
        email?: string;
        companyName?: string;
        jobTitle?: string;
        notes?: string;
        tags?: string[];
      };

      const result = await scoreLead(body || {});
      return c.json({ result });
    } catch (error) {
      console.error("Error in /api/ai/lead/score:", error);
      return c.json({ error: "AI lead scoring failed" }, 500);
    }
  });

  app.post("/api/ai/email/suggest", async (c: any) => {
    try {
      const body = (await c.req.json()) as {
        recipient?: string;
        purpose?: "follow-up" | "introduction" | "proposal" | "meeting-request";
      };

      if (!body?.recipient || !body?.purpose) {
        return c.json({ error: "recipient and purpose are required" }, 400);
      }

      const suggestions = await suggestEmailContent(
        body.recipient,
        body.purpose,
      );
      return c.json({ suggestions });
    } catch (error) {
      console.error("Error in /api/ai/email/suggest:", error);
      return c.json({ error: "AI email suggestion failed" }, 500);
    }
  });

  app.post("/api/ai/meeting/summarize", async (c: any) => {
    try {
      const body = (await c.req.json()) as { notes?: string };
      if (!body?.notes) {
        return c.json({ error: "notes is required" }, 400);
      }

      const summary = await generateMeetingSummary(body.notes);
      return c.json({ summary });
    } catch (error) {
      console.error("Error in /api/ai/meeting/summarize:", error);
      return c.json({ error: "AI meeting summary failed" }, 500);
    }
  });

  app.post("/api/ai/contact/enrich", async (c: any) => {
    try {
      const body = (await c.req.json()) as {
        email?: string;
        companyName?: string;
        name?: string;
      };
      if (!body?.name) {
        return c.json({ error: "name is required" }, 400);
      }

      const enrichment = await enrichContact({
        name: body.name,
        email: body.email,
        companyName: body.companyName,
      });
      return c.json({ enrichment });
    } catch (error) {
      console.error("Error in /api/ai/contact/enrich:", error);
      return c.json({ error: "AI contact enrichment failed" }, 500);
    }
  });

  // REST CRUD endpoints for autism app
  // Contacts
  app.get("/api/v1/contacts", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const db = getDb({ env: c.env });
    const { contacts } = schema;
    const { contacts: contactsTable } = db._.schema;
    const allContacts = await db
      .select()
      .from(contacts)
      .where(eq(contacts.organizationId, orgId));
    return c.json({ data: allContacts, total: allContacts.length });
  });

  app.post("/api/v1/contacts", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const body = await c.req.json().catch(() => null);
    if (!body?.firstName || !body?.lastName) {
      return c.json({ error: "First and last name are required" }, 400);
    }
    const db = getDb({ env: c.env });
    const { contacts } = schema;
    const [contact] = await db
      .insert(contacts)
      .values({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email?.toLowerCase() || null,
        phone: body.phone || null,
        companyName: body.companyName || null,
        organizationId: orgId,
        createdBy: "demo-user-001",
      })
      .returning();
    return c.json(contact);
  });

  app.get("/api/v1/contacts/:id", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const contactId = c.req.param("id");
    const db = getDb({ env: c.env });
    const { contacts } = schema;
    const [contact] = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, contactId))
      .limit(1);
    if (!contact || contact.organizationId !== orgId) {
      return c.json({ error: "Contact not found" }, 404);
    }
    return c.json(contact);
  });

  app.patch("/api/v1/contacts/:id", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const contactId = c.req.param("id");
    const body = await c.req.json().catch(() => null);
    const db = getDb({ env: c.env });
    const { contacts } = schema;
    const [existing] = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, contactId))
      .limit(1);
    if (!existing || existing.organizationId !== orgId) {
      return c.json({ error: "Contact not found" }, 404);
    }
    const [contact] = await db
      .update(contacts)
      .set({
        ...(body.firstName && { firstName: body.firstName }),
        ...(body.lastName && { lastName: body.lastName }),
        ...(body.email !== undefined && {
          email: body.email?.toLowerCase() || null,
        }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.companyName !== undefined && {
          companyName: body.companyName,
        }),
      })
      .where(eq(contacts.id, contactId))
      .returning();
    return c.json(contact);
  });

  app.delete("/api/v1/contacts/:id", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const contactId = c.req.param("id");
    const db = getDb({ env: c.env });
    const { contacts } = schema;
    const [existing] = await db
      .select()
      .from(contacts)
      .where(eq(contacts.id, contactId))
      .limit(1);
    if (!existing || existing.organizationId !== orgId) {
      return c.json({ error: "Contact not found" }, 404);
    }
    await db.delete(contacts).where(eq(contacts.id, contactId));
    return c.json({ success: true });
  });

  // Deals
  app.get("/api/v1/deals", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const db = getDb({ env: c.env });
    const { deals } = schema;
    const allDeals = await db
      .select()
      .from(deals)
      .where(eq(deals.organizationId, orgId));
    return c.json({ data: allDeals, total: allDeals.length });
  });

  app.post("/api/v1/deals", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const body = await c.req.json().catch(() => null);
    if (!body?.name || !body?.value) {
      return c.json({ error: "Name and value are required" }, 400);
    }
    const db = getDb({ env: c.env });
    const { deals } = schema;
    const [deal] = await db
      .insert(deals)
      .values({
        name: body.name,
        value: String(body.value),
        stage: body.stage || "lead",
        notes: body.notes || null,
        organizationId: orgId,
        createdBy: "demo-user-001",
      })
      .returning();
    return c.json(deal);
  });

  app.get("/api/v1/deals/:id", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const dealId = c.req.param("id");
    const db = getDb({ env: c.env });
    const { deals } = schema;
    const [deal] = await db
      .select()
      .from(deals)
      .where(eq(deals.id, dealId))
      .limit(1);
    if (!deal || deal.organizationId !== orgId) {
      return c.json({ error: "Deal not found" }, 404);
    }
    return c.json(deal);
  });

  app.patch("/api/v1/deals/:id", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const dealId = c.req.param("id");
    const body = await c.req.json().catch(() => null);
    const db = getDb({ env: c.env });
    const { deals } = schema;
    const [existing] = await db
      .select()
      .from(deals)
      .where(eq(deals.id, dealId))
      .limit(1);
    if (!existing || existing.organizationId !== orgId) {
      return c.json({ error: "Deal not found" }, 404);
    }
    const [deal] = await db
      .update(deals)
      .set({
        ...(body.name && { name: body.name }),
        ...(body.value !== undefined && { value: String(body.value) }),
        ...(body.stage && { stage: body.stage }),
        ...(body.notes !== undefined && { notes: body.notes }),
      })
      .where(eq(deals.id, dealId))
      .returning();
    return c.json(deal);
  });

  app.delete("/api/v1/deals/:id", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const dealId = c.req.param("id");
    const db = getDb({ env: c.env });
    const { deals } = schema;
    const [existing] = await db
      .select()
      .from(deals)
      .where(eq(deals.id, dealId))
      .limit(1);
    if (!existing || existing.organizationId !== orgId) {
      return c.json({ error: "Deal not found" }, 404);
    }
    await db.delete(deals).where(eq(deals.id, dealId));
    return c.json({ success: true });
  });

  // Leads
  app.get("/api/v1/leads", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const db = getDb({ env: c.env });
    const { leads } = schema;
    const allLeads = await db
      .select()
      .from(leads)
      .where(eq(leads.organizationId, orgId));
    return c.json({ data: allLeads, total: allLeads.length });
  });

  app.post("/api/v1/leads", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const body = await c.req.json().catch(() => null);
    if (!body?.email) {
      return c.json({ error: "Email is required" }, 400);
    }
    const db = getDb({ env: c.env });
    const { leads } = schema;
    const [lead] = await db
      .insert(leads)
      .values({
        firstName: body.firstName || "",
        lastName: body.lastName || "",
        email: body.email.toLowerCase(),
        phone: body.phone || null,
        companyName: body.companyName || null,
        source: body.source || "website",
        status: body.status || "new",
        organizationId: orgId,
        createdBy: "demo-user-001",
      })
      .returning();
    return c.json(lead);
  });

  // Activities
  app.get("/api/v1/activities", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const db = getDb({ env: c.env });
    const { activities } = schema;
    const allActivities = await db
      .select()
      .from(activities)
      .where(eq(activities.organizationId, orgId));
    return c.json({ data: allActivities, total: allActivities.length });
  });

  app.post("/api/v1/activities", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const body = await c.req.json().catch(() => null);
    if (!body?.type) {
      return c.json({ error: "Activity type is required" }, 400);
    }
    const db = getDb({ env: c.env });
    const { activities } = schema;
    const [activity] = await db
      .insert(activities)
      .values({
        type: body.type,
        title: body.title || "",
        description: body.description || null,
        organizationId: orgId,
        createdBy: "demo-user-001",
      })
      .returning();
    return c.json(activity);
  });

  // Dashboard stats
  app.get("/api/v1/dashboard/stats", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const db = getDb({ env: c.env });
    const { contacts, deals, leads, activities } = schema;

    const allContacts = await db
      .select()
      .from(contacts)
      .where(eq(contacts.organizationId, orgId));
    const allDeals = await db
      .select()
      .from(deals)
      .where(eq(deals.organizationId, orgId));
    const allLeads = await db
      .select()
      .from(leads)
      .where(eq(leads.organizationId, orgId));
    const allActivities = await db
      .select()
      .from(activities)
      .where(eq(activities.organizationId, orgId));

    const totalDealsValue = allDeals.reduce(
      (sum: number, deal: any) => sum + Number(deal.value || 0),
      0,
    );

    return c.json({
      totalContacts: allContacts.length,
      activeDeals: allDeals.filter(
        (d: any) => !["won", "lost"].includes(d.stage),
      ).length,
      conversionRate:
        allLeads.length > 0
          ? (allLeads.filter((l: any) => l.status === "converted").length /
              allLeads.length) *
            100
          : 0,
      revenue: totalDealsValue,
    });
  });

  // Patients
  app.get("/api/v1/patients", async (c: any) => {
    const isDemo = c.req.header("x-demo-mode") === "true";
    const orgId = c.req.header("x-organization-id") || "demo-org";

    if (isDemo) {
      return c.json({
        data: [
          {
            id: "1",
            firstName: "Emma",
            lastName: "Johnson",
            dateOfBirth: "2019-03-15",
            diagnosis: "ASD Level 1",
            status: "active",
          },
          {
            id: "2",
            firstName: "Liam",
            lastName: "Williams",
            dateOfBirth: "2020-07-22",
            diagnosis: "ASD Level 2",
            status: "active",
          },
          {
            id: "3",
            firstName: "Noah",
            lastName: "Martinez",
            dateOfBirth: "2018-11-08",
            diagnosis: "ASD Level 1",
            status: "active",
          },
        ],
        total: 3,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    }

    const db = getDb({ env: c.env });
    const { patients } = schema;
    const allPatients = await db
      .select()
      .from(patients)
      .where(eq((patients as any).organizationId, orgId));
    return c.json({
      data: allPatients,
      total: allPatients.length,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  });

  app.post("/api/v1/patients", async (c: any) => {
    const isDemo = c.req.header("x-demo-mode") === "true";
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const body = await c.req.json().catch(() => null);

    if (isDemo || !c.env) {
      return c.json({
        id: crypto.randomUUID(),
        organizationId: orgId,
        firstName: body?.firstName || "",
        lastName: body?.lastName || "",
        dateOfBirth: body?.dateOfBirth || null,
        diagnosis: body?.diagnosis || null,
        status: "active",
        createdAt: new Date().toISOString(),
      });
    }

    const db = getDb({ env: c.env });
    const { patients } = schema;
    const [patient] = await db
      .insert(patients)
      .values({
        id: crypto.randomUUID(),
        firstName: body.firstName,
        lastName: body.lastName,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
        diagnosis: body.diagnosis || null,
        severityLevel: body.severityLevel || null,
        primaryLanguage: body.primaryLanguage || "en",
        preferredCommunication: body.preferredCommunication || "verbal",
        status: "active",
        organizationId: orgId,
        createdBy: "mobile-user",
      })
      .returning();
    return c.json(patient);
  });

  app.get("/api/v1/patients/stats", async (c: any) => {
    const isDemo = c.req.header("x-demo-mode") === "true";

    if (isDemo) {
      return c.json({ total: 3, active: 3, inactive: 0, newThisMonth: 0 });
    }

    const orgId = c.req.header("x-organization-id") || "demo-org";
    const db = getDb({ env: c.env });
    const { patients } = schema;
    const allPatients = await db
      .select()
      .from(patients)
      .where(eq((patients as any).organizationId, orgId));

    return c.json({
      total: allPatients.length,
      active: allPatients.filter((p: any) => p.status === "active").length,
      inactive: allPatients.filter((p: any) => p.status === "inactive").length,
      newThisMonth: 0,
    });
  });

  // Autism dashboard stats (real counts)
  app.get("/api/v1/autism/stats", async (c: any) => {
    const orgId = c.req.header("x-organization-id") || "org-spectrumai-demo";
    const db = getDb({ env: c.env });
    const { patients, goals, sessions, assessments } = schema;

    const [p] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(patients)
      .where(and(eq(patients.organizationId, orgId), eq(patients.status, "active")));
    const [g] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(goals)
      .where(and(eq(goals.organizationId, orgId), eq(goals.status, "in-progress")));
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const [s] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(sessions)
      .where(
        and(
          eq(sessions.organizationId, orgId),
          gte(sessions.scheduledStart, weekStart),
        ),
      );
    const [a] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(assessments)
      .where(
        and(
          eq(assessments.organizationId, orgId),
          eq(assessments.status, "scheduled"),
        ),
      );

    return c.json({
      activePatients: p?.n ?? 0,
      goalsInProgress: g?.n ?? 0,
      sessionsThisWeek: s?.n ?? 0,
      assessmentsDue: a?.n ?? 0,
    });
  });

  // Goals
  app.get("/api/v1/goals", async (c: any) => {
    const isDemo = c.req.header("x-demo-mode") === "true";
    const orgId = c.req.header("x-organization-id") || "demo-org";

    if (isDemo) {
      return c.json({
        data: [
          {
            id: "1",
            patientId: "1",
            patientName: "Emma Johnson",
            name: "Increase eye contact",
            category: "Social",
            currentValue: 75,
            targetValue: 100,
            status: "active",
            priority: "high",
          },
          {
            id: "2",
            patientId: "1",
            patientName: "Emma Johnson",
            name: "Picture exchange communication",
            category: "Communication",
            currentValue: 100,
            targetValue: 100,
            status: "mastered",
            priority: "high",
          },
          {
            id: "3",
            patientId: "2",
            patientName: "Liam Williams",
            name: "Turn-taking in games",
            category: "Social",
            currentValue: 60,
            targetValue: 80,
            status: "active",
            priority: "medium",
          },
        ],
        total: 3,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    }

    const db = getDb({ env: c.env });
    const { goals } = schema;
    const allGoals = await db
      .select()
      .from(goals)
      .where(eq(goals.organizationId, orgId));
    return c.json({
      data: allGoals,
      total: allGoals.length,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  });

  app.post("/api/v1/goals", async (c: any) => {
    const isDemo = c.req.header("x-demo-mode") === "true";
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const body = await c.req.json().catch(() => null);

    if (isDemo || !c.env) {
      return c.json({
        id: crypto.randomUUID(),
        organizationId: orgId,
        patientId: body?.patientId || "",
        name: body?.name || "",
        description: body?.description || null,
        category: body?.category || "Communication",
        baselineValue: body?.baselineValue || 0,
        targetValue: body?.targetValue || 100,
        currentValue: body?.baselineValue || 0,
        status: "active",
        priority: body?.priority || "medium",
        createdAt: new Date().toISOString(),
      });
    }

    const db = getDb({ env: c.env });
    const { goals } = schema;
    const [goal] = await db
      .insert(goals)
      .values({
        id: crypto.randomUUID(),
        patientId: body.patientId,
        name: body.name,
        description: body.description || null,
        category: body.category || "Communication",
        baselineValue: body.baselineValue || 0,
        targetValue: body.targetValue || 100,
        currentValue: body.baselineValue || 0,
        status: "active",
        priority: body.priority || "medium",
        organizationId: orgId,
      })
      .returning();
    return c.json(goal);
  });

  // Sessions
  app.get("/api/v1/sessions", async (c: any) => {
    const isDemo = c.req.header("x-demo-mode") === "true";
    const orgId = c.req.header("x-organization-id") || "demo-org";

    if (isDemo) {
      const now = new Date().toISOString();
      return c.json({
        data: [
          {
            id: "1",
            patientId: "1",
            patientName: "Emma Johnson",
            type: "ABA Therapy",
            status: "scheduled",
            scheduledStart: now,
            scheduledEnd: now,
            telehealth: false,
          },
          {
            id: "2",
            patientId: "2",
            patientName: "Liam Williams",
            type: "Speech Therapy",
            status: "scheduled",
            scheduledStart: now,
            scheduledEnd: now,
            telehealth: false,
          },
        ],
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    }

    const db = getDb({ env: c.env });
    const { sessions } = schema;
    const allSessions = await db
      .select()
      .from(sessions)
      .where(
        eq(
          (sessions as any).organizationId ||
            (sessions as any).activeOrganizationId,
          orgId,
        ),
      );
    return c.json({
      data: allSessions,
      total: allSessions.length,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  });

  app.post("/api/v1/sessions", async (c: any) => {
    const isDemo = c.req.header("x-demo-mode") === "true";
    const orgId = c.req.header("x-organization-id") || "demo-org";
    const body = await c.req.json().catch(() => null);

    if (isDemo || !c.env) {
      return c.json({
        id: crypto.randomUUID(),
        organizationId: orgId,
        patientId: body?.patientId || "",
        type: body?.type || "",
        status: "scheduled",
        scheduledStart: body?.scheduledStart || new Date().toISOString(),
        scheduledEnd: body?.scheduledEnd || new Date().toISOString(),
        location: body?.location || null,
        telehealth: body?.telehealth || false,
        createdAt: new Date().toISOString(),
      });
    }

    const db = getDb({ env: c.env });
    const { sessions } = schema;
    const [session] = await db
      .insert(sessions)
      .values({
        id: crypto.randomUUID(),
        patientId: body.patientId,
        type: body.type,
        status: "scheduled",
        scheduledStart: new Date(body.scheduledStart),
        scheduledEnd: new Date(body.scheduledEnd),
        location: body.location || null,
        telehealth: body.telehealth || false,
        organizationId: orgId,
      })
      .returning();
    return c.json(session);
  });

  // Rate limiting middleware
  app.use("/api/*", rateLimitRedis({ limiterType: "api" }));
  app.use("/api/auth/*", rateLimitRedis({ limiterType: "auth" }));

  // Better Auth handler (includes Stripe webhook at /api/auth/stripe/webhook)
  app.on(["GET", "POST"], "/api/auth/*", async (c: any) => {
    // Fallback to process.env when running without Cloudflare Workers
    // c.env may be undefined when not running on Cloudflare (SKIP_CLOUDFLARE=true)
    const envBindings = c.env || {};
    const connectionString =
      envBindings.DATABASE?.connectionString || process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error(
        "DATABASE connection string not found in environment bindings or process.env.DATABASE_URL",
      );
    }

    console.log("[Debug DB] Connection String Check:", {
      val: connectionString,
      isLocal:
        connectionString.includes("localhost") ||
        connectionString.includes("127.0.0.1"),
    });

    const db = createDb({ connectionString });

    // Create minimal env object with defaults for missing bindings
    const minimalEnv = {
      DATABASE_URL: connectionString,
      NODE_ENV: envBindings.NODE_ENV || process.env.NODE_ENV || "development",
      VITE_PUBLIC_SITE_URL:
        envBindings.VITE_PUBLIC_SITE_URL ||
        process.env.VITE_PUBLIC_SITE_URL ||
        "http://localhost:5173",
      BETTER_AUTH_SECRET:
        envBindings.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET,
      CACHE: envBindings.CACHE,
      BUCKET: envBindings.BUCKET,
      ASSETS: envBindings.ASSETS,
      GOOGLE_CLIENT_ID: envBindings.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: envBindings.GOOGLE_CLIENT_SECRET,
      GITHUB_CLIENT_ID: envBindings.GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET: envBindings.GITHUB_CLIENT_SECRET,
      STRIPE_SECRET_KEY: envBindings.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: envBindings.STRIPE_WEBHOOK_SECRET,
    };

    const auth = createAuthFromEnv(db, minimalEnv as any);

    // DB Connection Test
    try {
      // @ts-ignore - verify connection works
      await db.execute("SELECT 1");
      console.log("✅ DB Connection successful");
    } catch (dbErr) {
      console.error(
        "❌ DB Connection Failed detected in request handler:",
        dbErr,
      );
      return c.json(
        {
          error: "Database Connection Failed",
          details: String(dbErr),
          stack: dbErr instanceof Error ? dbErr.stack : undefined,
        },
        500,
      );
    }

    try {
      return await auth.handler(c.req.raw);
    } catch (e) {
      console.error("[Auth Error]", e);
      return c.json(
        { error: "Internal Server Error", details: String(e) },
        500,
      );
    }
  });

  registerOperationsRestRoutes(app);

  // oRPC handler
  const rpcHandler = new RPCHandler(appRouter, {
    interceptors: [
      onError((error: unknown) => {
        console.error("[RPC Error]", error);

        // Capture in Sentry (disabled for Cloudflare Workers compatibility)
        // if (error instanceof Error) {
        //   sentryCaptureException(error);
        // }

        // Handle APIError
        if (error instanceof APIError) {
          // APIError will be handled by oRPC's error handling
          return;
        }
      }),
    ],
  });

  app.use("/api/rpc/*", async (c: any, next: any) => {
    const initialContext: InitialContext = {
      env: c.env,
      headers: c.req.raw.headers,
      requestId: c.get("requestId") || crypto.randomUUID(),
      logger: c.get("logger"),
    };

    const { matched, response } = await rpcHandler.handle(c.req.raw, {
      prefix: "/api/rpc",
      context: initialContext,
    });

    if (matched && response) {
      return c.newResponse(response.body, response);
    }

    await next();
  });

  // OpenAPI spec
  app.get("/api/openapi.json", async (c: any) => {
    const generator = new OpenAPIGenerator({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    });

    const spec = await generator.generate(appRouter, {
      info: {
        title: "Autism API",
        version: "1.0.0",
        description: "Customer Relationship Management API",
      },
      servers: [
        {
          url: c.env?.VITE_PUBLIC_SITE_URL || "http://localhost:5173",
          description: "Current",
        },
      ],
      security: [{ bearerAuth: [] }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "JWT token from Better Auth",
          },
        },
      },
      tags: [
        { name: "Contacts", description: "Contact management operations" },
        { name: "Organizations", description: "Organization management" },
        { name: "System", description: "System endpoints" },
      ],
    });

    return c.json(spec);
  });

  // Compatibility alias used by browser e2e checks.
  app.get("/api/openapi/spec.json", async (c: any) => {
    const generator = new OpenAPIGenerator({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    });

    const spec = await generator.generate(appRouter, {
      info: {
        title: "Autism API",
        version: "1.0.0",
        description: "Customer Relationship Management API",
      },
      servers: [
        {
          url: c.env?.VITE_PUBLIC_SITE_URL || "http://localhost:5173",
          description: "Current",
        },
      ],
      security: [{ bearerAuth: [] }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "JWT token from Better Auth",
          },
        },
      },
      tags: [
        { name: "Contacts", description: "Contact management operations" },
        { name: "Organizations", description: "Organization management" },
        { name: "System", description: "System endpoints" },
      ],
    });

    return c.json(spec);
  });

  // Scalar API Documentation UI
  app.get("/api/docs", async (c: any) => {
    const { Scalar } = await import("@scalar/hono-api-reference");
    return (Scalar as any)({
      url: "/api/openapi.json",
      theme: "purple",
    })(c);
  });

  return app;
}

// Default app instance
export const api = createApp();
