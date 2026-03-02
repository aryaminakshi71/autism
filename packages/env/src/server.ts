/**
 * Server environment variables
 *
 * Includes all environment variables (client + server-only).
 * Never exposed to browser - import from "@autism-legacy-20260205/env/server" explicitly.
 *
 * Uses Cloudflare Workers runtime to access environment variables.
 */

import { z } from "zod";
import { clientSchema } from "./client.js";

const serverSchema = clientSchema.extend({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters")
    .optional(),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  UPSTASH_REDIS_REST_URL: z.string().url().or(z.literal("")).optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  STRIPE_SECRET_KEY: z.string().startsWith("sk_").optional(),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_").optional(),

  SENTRY_DSN: z.string().url().or(z.literal("")).optional(),
  SENTRY_ENVIRONMENT: z.string().optional(),
  SENTRY_DEBUG: z.string().optional(),

  DATADOG_API_KEY: z.string().optional(),
  DATADOG_SERVICE_NAME: z.string().optional(),
  DATADOG_ENV: z.string().optional(),
  DATADOG_VERSION: z.string().optional(),

  LOG_AGGREGATION_ENDPOINT: z.string().url().or(z.literal("")).optional(),
  LOG_AGGREGATION_API_KEY: z.string().optional(),
  LOG_AGGREGATION_SERVICE: z
    .enum(["datadog", "logtail", "cloudwatch", "custom"])
    .optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;

function getRuntimeEnv(): Record<string, any> {
  const env: Record<string, any> = {};

  if (typeof process !== "undefined" && process.env) {
    Object.assign(env, process.env);
  }

  if (typeof globalThis !== "undefined" && (globalThis as any).env) {
    Object.assign(env, (globalThis as any).env);
  }

  return env;
}

let cachedEnv: ServerEnv | null = null;

export function getServerEnv(throwOnMissing = false): ServerEnv {
  if (cachedEnv) return cachedEnv;

  const runtimeEnv = getRuntimeEnv();
  const parsedEnv = serverSchema.parse(runtimeEnv);

  const resolvedAuthSecret =
    parsedEnv.BETTER_AUTH_SECRET ||
    (parsedEnv.NODE_ENV === "production"
      ? undefined
      : "dev-only-secret-dev-only-secret-dev");

  if (!resolvedAuthSecret && throwOnMissing) {
    throw new Error(
      "BETTER_AUTH_SECRET is required in production environments.",
    );
  }

  cachedEnv = {
    ...parsedEnv,
    BETTER_AUTH_SECRET: resolvedAuthSecret,
  };

  return cachedEnv;
}

export const env = new Proxy({} as ServerEnv, {
  get(_target, prop) {
    return getServerEnv()[prop as keyof ServerEnv];
  },
  has(_target, _prop) {
    return true;
  },
});
