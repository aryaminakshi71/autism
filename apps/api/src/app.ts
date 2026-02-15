/**
 * API Application
 *
 * Hono app with oRPC integration for Cloudflare Workers.
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { RPCHandler } from "@orpc/server/fetch";
import { OpenAPIGenerator } from "@orpc/openapi";
import { ZodToJsonSchemaConverter } from "@orpc/zod";
import { onError } from "@orpc/server";
import { createDb } from "@autism-legacy-20260205/storage";
import { appRouter } from "./routers";
import { createAuthFromEnv } from "./lib/create-auth-from-env";
import { loggerMiddleware } from "./middleware/logger";
// Monitoring imports disabled for Cloudflare Workers compatibility
// import { initSentry } from "./lib/sentry";
// import { initDatadog } from "./lib/datadog";
import { rateLimitRedis } from "./middleware/rate-limit-redis";
import { APIError, formatErrorResponse, captureException } from "./lib/errors";
// import { captureException as sentryCaptureException } from "./lib/sentry";
import type { AppEnv, InitialContext } from "./context";

/**
 * Create Hono app with all routes
 */
export function createApp() {
  const app = new Hono<{ Bindings: AppEnv }>();

  // Monitoring disabled for Cloudflare Workers compatibility
  // (Sentry and Datadog require semver which fails in Workers environment)

  // Global middleware
  app.use("*", cors({ origin: (origin: string | null) => origin, credentials: true }));
  app.use("*", requestId());
  app.use("*", loggerMiddleware);

  // Health check (non-RPC) - must be before rate limiting
  app.get("/api/health", (c: any) => {
    return c.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
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
      isLocal: connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
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
      console.error("❌ DB Connection Failed detected in request handler:", dbErr);
      return c.json({
        error: "Database Connection Failed",
        details: String(dbErr),
        stack: dbErr instanceof Error ? dbErr.stack : undefined
      }, 500);
    }

    try {
      return await auth.handler(c.req.raw);
    } catch (e) {
      console.error("[Auth Error]", e);
      return c.json({ error: "Internal Server Error", details: String(e) }, 500);
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
