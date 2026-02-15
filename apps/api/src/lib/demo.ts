/**
 * Demo Mode Helpers
 */

import type { InitialContext } from "../context";

type DemoContext = Pick<InitialContext, "headers" | "env"> | {
  headers?: Headers | null;
  env?: {
    DATABASE?: { connectionString?: string | null } | null;
    DATABASE_URL?: string | null;
  } | null;
};

export function isDemoRequest(context: DemoContext): boolean {
  const demoHeader = context?.headers?.get("x-demo-mode") === "true";
  if (demoHeader) return true;

  const env = context?.env as any;
  const connectionString =
    env?.DATABASE?.connectionString ||
    env?.DATABASE_URL ||
    undefined;

  return !connectionString;
}
