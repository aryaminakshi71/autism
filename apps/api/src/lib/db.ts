/**
 * Database Access Module
 *
 * Provides database access for procedures without exposing
 * full Drizzle types in the oRPC context (which causes TS7056 errors).
 *
 * In Cloudflare Workers, we create a new client per-request since
 * environment bindings are request-scoped.
 */

import {
  createDb as createDbClient,
  schema,
} from "@autism-legacy-20260205/storage";
import type { InitialContext } from "../context";

export { schema };

/**
 * Create a database client from the request context
 * Use this in procedures instead of accessing db from context
 */
export function getDb(context: Pick<InitialContext, "env">) {
  return createDbClient({
    connectionString: context.env.DATABASE.connectionString,
  });
}

/**
 * Read-only database client.
 *
 * Uses DATABASE_READ_URL when set (e.g. a Neon read replica) so analytics and
 * dashboard queries don't compete with writes. Falls back to the primary.
 */
export function getReadDb(context: Pick<InitialContext, "env">) {
  const readUrl = (context.env as any)?.DATABASE_READ_URL || process.env.DATABASE_READ_URL;
  if (!readUrl) return getDb(context);
  return createDbClient({ connectionString: readUrl });
}

/**
 * Database client type - use sparingly to avoid type inference bloat
 */
export type Db = ReturnType<typeof getDb>;
