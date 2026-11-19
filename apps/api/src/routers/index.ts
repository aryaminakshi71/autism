/**
 * App Router
 *
 * Composed router with all domain routers.
 * Split into separate files to avoid TypeScript TS7056 limits.
 */

import { activitiesRouter } from "./activities";
import { assessmentsRouter } from "./assessments";
import { billingRouter } from "./billing";
import { brandingRouter } from "./branding";
import { claimsRouter } from "./claims";
import { complianceRouter } from "./compliance";
import { contactsRouter } from "./contacts";
import { dashboardRouter } from "./dashboard";
import { dataCollectionSheetsRouter } from "./data-collection-sheets";
import { dataCollectionTemplatesRouter } from "./data-collection-templates";
import { dealsRouter } from "./deals";
import { goalsRouter } from "./goals";
import { healthRouter } from "./health";
import { leadsRouter } from "./leads";
import { metricsRouter } from "./metrics";
import { parentPortalRouter } from "./parent-portal";
import { patientsRouter } from "./patients";
import { reportsRouter } from "./reports";
import { sessionsRouter } from "./sessions";

import { assetsRouter } from "./assets";

export const appRouter = {
  branding: brandingRouter,
  billing: billingRouter,
  claims: claimsRouter,
  health: healthRouter,
  metrics: metricsRouter,
  contacts: contactsRouter,
  compliance: complianceRouter,
  deals: dealsRouter,
  leads: leadsRouter,
  activities: activitiesRouter,
  dashboard: dashboardRouter,
  patients: patientsRouter,
  goals: goalsRouter,
  sessions: sessionsRouter,
  assessments: assessmentsRouter,
  dataCollectionTemplates: dataCollectionTemplatesRouter,
  dataCollectionSheets: dataCollectionSheetsRouter,
  reports: reportsRouter,
  parentPortal: parentPortalRouter,
  assets: assetsRouter,
};

export type AppRouter = typeof appRouter;
