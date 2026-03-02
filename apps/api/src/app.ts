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
import { eq } from "drizzle-orm";
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
    return Scalar({
      spec: {
        url: "/api/openapi.json",
      },
      theme: "purple",
    })(c);
  });

  return app;
}

// Default app instance
export const api = createApp();
