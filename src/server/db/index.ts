import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as authSchema from './auth-schema'
import * as appSchema from './schema'

export const schema = {
  ...authSchema,
  ...appSchema,
}

export type Database = ReturnType<typeof getDb>;

let _db: Database | null = null;
let _sql: ReturnType<typeof postgres> | null = null;
let _dbUrl: string | null = null;

function createDb(url: string): Database {
  // Hyperdrive provides its own pooling, so keep the client-side pool small.
  // For local dev this is still a reasonable default.
  const max = Number(process.env.DB_MAX_CONNECTIONS ?? "1");
  _sql = postgres(url, { max });
  return drizzle(_sql, { schema });
}

export function getDb(): Database {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  if (_db && _dbUrl === url) return _db;

  _dbUrl = url;
  _db = createDb(url);
  return _db;
}

// Back-compat: many modules import `db` directly. Make it lazy so it can be
// initialized after `process.env` is populated in the Worker fetch handler.
export const db: Database = new Proxy({} as Database, {
  get(_target, prop) {
    return (getDb() as any)[prop];
  },
}) as Database;

export async function closeDb(): Promise<void> {
  const sql = _sql;
  _sql = null;
  _db = null;
  _dbUrl = null;
  // postgres-js returns a thenable `end()`
  await (sql?.end?.({ timeout: 5 }) as any);
}
