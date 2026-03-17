/**
 * App Router
 *
 * Composed router with all domain routers.
 * Split into separate files to avoid TypeScript TS7056 limits.
 */

import { activitiesRouter } from "./activities";
import { contactsRouter } from "./contacts";
import { dashboardRouter } from "./dashboard";
import { dealsRouter } from "./deals";
import { goalsRouter } from "./goals";
import { healthRouter } from "./health";
import { leadsRouter } from "./leads";
import { patientsRouter } from "./patients";
import { sessionsRouter } from "./sessions";

import { assetsRouter } from "./assets";

export const appRouter = {
  health: healthRouter,
  contacts: contactsRouter,
  deals: dealsRouter,
  leads: leadsRouter,
  activities: activitiesRouter,
  dashboard: dashboardRouter,
  patients: patientsRouter,
  goals: goalsRouter,
  sessions: sessionsRouter,
  assets: assetsRouter,
};

export type AppRouter = typeof appRouter;
