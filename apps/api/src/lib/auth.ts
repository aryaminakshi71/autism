import { env } from "@autism-legacy-20260205/env/server";
import { logger } from "@autism-legacy-20260205/logger";
import { createDb, schema } from "@autism-legacy-20260205/storage";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";

// Create scoped logger for auth module
const log = logger.child({ module: "auth" });

/**
 * Create auth instance with database
 * In Cloudflare Workers, we create this per-request
 */
export function createAuth(connectionString: string) {
  const db = createDb({ connectionString });

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: schema,
    }),
    baseURL: env.VITE_PUBLIC_SITE_URL || "http://localhost:5173",
    basePath: "/api/auth",
    trustedOrigins: [
      env.VITE_PUBLIC_SITE_URL,
      env.BETTER_AUTH_URL,
      "http://localhost:3003",
      "http://localhost:3005",
      "http://localhost:3080",
      "http://localhost:5173",
      "http://127.0.0.1:3003",
      "http://127.0.0.1:3005",
      "http://127.0.0.1:3080",
      "http://127.0.0.1:5173",
    ].filter((o): o is string => Boolean(o)),
    secret: env.BETTER_AUTH_SECRET || "change-me-in-production-min-32-chars",
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // Update session every 24 hours
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 minutes
      },
    },
    socialProviders: {
      google:
        env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
          ? {
              clientId: env.GOOGLE_CLIENT_ID,
              clientSecret: env.GOOGLE_CLIENT_SECRET,
            }
          : undefined,
      github:
        env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
          ? {
              clientId: env.GITHUB_CLIENT_ID,
              clientSecret: env.GITHUB_CLIENT_SECRET,
            }
          : undefined,
    },
    plugins: [
      organization({
        allowUserToCreateOrganization: true,
        organizationCreation: {
          afterCreate: async ({
            organization,
            user,
          }: { organization: any; user: any }) => {
            log.info("organization:created", {
              organizationId: organization.id,
              userId: user.id,
            });
            try {
              await fetch(
                `${process.env.REGISTRY_URL ?? "http://127.0.0.1:4100"}/api/registry/company`,
                {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({
                    app: "spectrumai",
                    orgId: organization.id,
                    name: organization.name,
                    slug: organization.slug,
                    plan: "free",
                    status: "active",
                    email: user.email,
                    isDemo: false,
                    mrr: 0,
                    currency: "INR",
                  }),
                  signal: AbortSignal.timeout(3000),
                },
              );
            } catch {
              // registry is optional
            }
          },
        },
      }),
    ],
    advanced: {
      cookiePrefix: "autism-legacy-20260205",
      useSecureCookies: env.NODE_ENV === "production",
    },
  });
}
