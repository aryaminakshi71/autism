import type { ActiveOrganization, Session } from "../auth";
import type { Database } from "../db";
import { db } from "../db";

export type ORPCContext = {
  request: Request;
  env?: Env;
  db: Database;
  session?: Session | null;
  user?: Session["user"];
  organizationId?: string;
  organization?: ActiveOrganization | null;
};

export async function createContext(
  request: Request,
  env?: Env,
): Promise<ORPCContext> {
  return {
    request,
    env,
    db,
  };
}
