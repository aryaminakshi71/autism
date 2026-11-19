import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { organization, user } from "./auth-schema";

export const patients = pgTable("patients", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: timestamp("date_of_birth", { mode: "date" }),
  gender: text("gender"),
  diagnosis: text("diagnosis"),
  severityLevel: text("severity_level"),
  primaryLanguage: text("primary_language").default("en").notNull(),
  preferredCommunication: text("preferred_communication")
    .default("verbal")
    .notNull(),
  status: text("status").default("active").notNull(),
  assignedTherapistId: text("assigned_therapist_id").references(() => user.id, {
    onDelete: "set null",
  }),
  guardianUserId: text("guardian_user_id").references(() => user.id, {
    onDelete: "set null",
  }),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const goals = pgTable("goals", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  patientId: text("patient_id")
    .notNull()
    .references(() => patients.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  targetBehavior: text("target_behavior"),
  baselineValue: integer("baseline_value"),
  targetValue: integer("target_value").notNull(),
  currentValue: integer("current_value"),
  unit: text("unit").default("%").notNull(),
  masteryCriteria: integer("mastery_criteria").default(80).notNull(),
  status: text("status").default("active").notNull(),
  priority: text("priority").default("medium").notNull(),
  startDate: timestamp("start_date", { mode: "date" }),
  targetDate: timestamp("target_date", { mode: "date" }),
  domain: text("domain"),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  patientId: text("patient_id")
    .notNull()
    .references(() => patients.id, { onDelete: "cascade" }),
  therapistId: text("therapist_id").notNull(),
  type: text("type").notNull(),
  status: text("status").default("scheduled").notNull(),
  scheduledStart: timestamp("scheduled_start", { mode: "date" }).notNull(),
  scheduledEnd: timestamp("scheduled_end", { mode: "date" }).notNull(),
  actualStart: timestamp("actual_start", { mode: "date" }),
  actualEnd: timestamp("actual_end", { mode: "date" }),
  durationMinutes: integer("duration_minutes"),
  location: text("location"),
  room: text("room"),
  telehealth: boolean("telehealth").default(false).notNull(),
  mood: text("mood"),
  energyLevel: text("energy_level"),
  notes: text("notes"),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const visualSchedules = pgTable("visual_schedules", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  patientId: text("patient_id").references(() => patients.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  schedule: jsonb("schedule"),
  isTemplate: boolean("is_template").default(false).notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const communicationCards = pgTable("communication_cards", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  patientId: text("patient_id").references(() => patients.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  cards: jsonb("cards"),
  gridSize: text("grid_size").default("4x4").notNull(),
  isTemplate: boolean("is_template").default(false).notNull(),
  language: text("language").default("en").notNull(),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const assessments = pgTable("assessments", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  patientId: text("patient_id")
    .notNull()
    .references(() => patients.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  name: text("name").notNull(),
  provider: text("provider"),
  version: text("version"),
  status: text("status").default("scheduled").notNull(),
  scheduledDate: timestamp("scheduled_date", { mode: "date" }),
  completedDate: timestamp("completed_date", { mode: "date" }),
  administeredBy: text("administered_by"),
  results: jsonb("results"),
  recommendations: text("recommendations"),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Data Collection Templates - ABA data collection method configurations
export const dataCollectionTemplates = pgTable("data_collection_templates", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // trial_based, task_analysis, frequency, duration, latency, interval
  configuration: jsonb("configuration"),
  isBuiltIn: boolean("is_built_in").default(false),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Data Collection Sheets - actual data collection instances
export const dataCollectionSheets = pgTable("data_collection_sheets", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  templateId: text("template_id")
    .notNull()
    .references(() => dataCollectionTemplates.id, { onDelete: "cascade" }),
  patientId: text("patient_id")
    .notNull()
    .references(() => patients.id, { onDelete: "cascade" }),
  goalId: text("goal_id").references(() => goals.id, {
    onDelete: "set null",
  }),
  sessionId: text("session_id").references(() => sessions.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  data: jsonb("data"),
  status: text("status").default("in_progress").notNull(),
  startedAt: timestamp("started_at", { mode: "date" }).defaultNow().notNull(),
  completedAt: timestamp("completed_at", { mode: "date" }),
  recordedById: text("recorded_by_id")
    .notNull()
    .references(() => user.id),
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Parent Notes - Session summaries for parents
export const parentNotes = pgTable("parent_notes", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  sessionId: text("session_id").references(() => sessions.id, {
    onDelete: "set null",
  }),
  patientId: text("patient_id")
    .notNull()
    .references(() => patients.id, { onDelete: "cascade" }),
  date: text("date").notNull(),
  sessionType: text("session_type"),
  duration: integer("duration"),
  summary: text("summary").notNull(),
  wins: text("wins").array(),
  challenges: text("challenges").array(),
  homePractice: jsonb("home_practice"),
  photos: text("photos").array(),
  therapistNote: text("therapist_note"),
  parentAcknowledged: boolean("parent_acknowledged").default(false),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Parent Messages - Secure messaging between team and parents
export const parentMessages = pgTable("parent_messages", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  patientId: text("patient_id")
    .notNull()
    .references(() => patients.id, { onDelete: "cascade" }),
  fromUserId: text("from_user_id")
    .notNull()
    .references(() => user.id),
  toUserId: text("to_user_id")
    .notNull()
    .references(() => user.id),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  attachments: text("attachments").array(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// Operations Provider Profiles - BCBA, BCaBA, learner, RBT, admin, and RCM users
export const providerProfiles = pgTable("provider_profiles", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  displayName: text("display_name").notNull(),
  role: text("role").notNull(), // owner_bcba, bcba, bcaba, learner_bcba, rbt, admin, rcm
  employmentType: text("employment_type"), // employee, contractor, vendor
  homeState: text("home_state"),
  serviceStates: text("service_states").array(),
  status: text("status").default("active").notNull(),
  maxClientLoad: integer("max_client_load"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const providerStateLicenses = pgTable("provider_state_licenses", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  providerId: text("provider_id")
    .notNull()
    .references(() => providerProfiles.id, { onDelete: "cascade" }),
  state: text("state").notNull(),
  licenseType: text("license_type").notNull(),
  licenseNumber: text("license_number"),
  status: text("status").default("pending").notNull(),
  issuedDate: timestamp("issued_date", { mode: "date" }),
  expirationDate: timestamp("expiration_date", { mode: "date" }),
  evidenceUrl: text("evidence_url"),
  verifiedBy: text("verified_by").references(() => user.id, {
    onDelete: "set null",
  }),
  verifiedAt: timestamp("verified_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const payerCredentialing = pgTable("payer_credentialing", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  providerId: text("provider_id").references(() => providerProfiles.id, {
    onDelete: "set null",
  }),
  payerName: text("payer_name").notNull(),
  state: text("state").notNull(),
  networkType: text("network_type"), // medicaid, commercial, mco, private_pay
  status: text("status").default("not_started").notNull(),
  applicationId: text("application_id"),
  submittedDate: timestamp("submitted_date", { mode: "date" }),
  effectiveDate: timestamp("effective_date", { mode: "date" }),
  revalidationDate: timestamp("revalidation_date", { mode: "date" }),
  portalUrl: text("portal_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const serviceAuthorizations = pgTable("service_authorizations", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  patientId: text("patient_id")
    .notNull()
    .references(() => patients.id, { onDelete: "cascade" }),
  payerCredentialingId: text("payer_credentialing_id").references(
    () => payerCredentialing.id,
    { onDelete: "set null" },
  ),
  payerName: text("payer_name").notNull(),
  authorizationNumber: text("authorization_number"),
  state: text("state").notNull(),
  cptCode: text("cpt_code").notNull(),
  modifier: text("modifier"),
  approvedUnits: integer("approved_units").notNull(),
  usedUnits: integer("used_units").default(0).notNull(),
  startDate: timestamp("start_date", { mode: "date" }).notNull(),
  endDate: timestamp("end_date", { mode: "date" }).notNull(),
  status: text("status").default("active").notNull(),
  documentUrl: text("document_url"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const insuranceClaims = pgTable("insurance_claims", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  patientId: text("patient_id")
    .notNull()
    .references(() => patients.id, { onDelete: "cascade" }),
  sessionId: text("session_id").references(() => sessions.id, {
    onDelete: "set null",
  }),
  authorizationId: text("authorization_id").references(
    () => serviceAuthorizations.id,
    { onDelete: "set null" },
  ),
  payerName: text("payer_name").notNull(),
  state: text("state").notNull(),
  claimNumber: text("claim_number"),
  clearinghouseTrace: text("clearinghouse_trace"),
  status: text("status").default("draft").notNull(),
  dateOfService: timestamp("date_of_service", { mode: "date" }).notNull(),
  submittedDate: timestamp("submitted_date", { mode: "date" }),
  billedCents: integer("billed_cents").default(0).notNull(),
  allowedCents: integer("allowed_cents"),
  paidCents: integer("paid_cents"),
  denialReason: text("denial_reason"),
  nextFollowUpDate: timestamp("next_follow_up_date", { mode: "date" }),
  assignedRcmUserId: text("assigned_rcm_user_id").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const claimEvents = pgTable("claim_events", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  claimId: text("claim_id")
    .notNull()
    .references(() => insuranceClaims.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(), // submission, rejection, denial, call, appeal, payment
  eventDate: timestamp("event_date", { mode: "date" }).defaultNow().notNull(),
  payerRepresentative: text("payer_representative"),
  referenceNumber: text("reference_number"),
  summary: text("summary").notNull(),
  nextAction: text("next_action"),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const rbtSupervisionLogs = pgTable("rbt_supervision_logs", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  rbtProviderId: text("rbt_provider_id")
    .notNull()
    .references(() => providerProfiles.id, { onDelete: "cascade" }),
  supervisingProviderId: text("supervising_provider_id")
    .notNull()
    .references(() => providerProfiles.id, { onDelete: "cascade" }),
  month: text("month").notNull(),
  totalServiceMinutes: integer("total_service_minutes").default(0).notNull(),
  supervisedMinutes: integer("supervised_minutes").default(0).notNull(),
  directObservationDone: boolean("direct_observation_done")
    .default(false)
    .notNull(),
  status: text("status").default("open").notNull(),
  evidenceUrl: text("evidence_url"),
  reviewedBy: text("reviewed_by").references(() => user.id, {
    onDelete: "set null",
  }),
  reviewedAt: timestamp("reviewed_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const hipaaAuditLogs = pgTable("hipaa_audit_logs", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  actorUserId: text("actor_user_id").references(() => user.id, {
    onDelete: "set null",
  }),
  actorRole: text("actor_role"),
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: text("resource_id"),
  patientId: text("patient_id").references(() => patients.id, {
    onDelete: "set null",
  }),
  ipAddress: text("ip_address"),
  country: text("country"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const indiaRcmAccess = pgTable("india_rcm_access", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessScope: text("access_scope").notNull(), // claim_only, payment_posting, software_support
  phiAccessLevel: text("phi_access_level").default("minimum").notNull(),
  baaVerified: boolean("baa_verified").default(false).notNull(),
  mfaVerified: boolean("mfa_verified").default(false).notNull(),
  lastAccessReview: timestamp("last_access_review", { mode: "date" }),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const aiVideoAlerts = pgTable("ai_video_alerts", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  patientId: text("patient_id")
    .notNull()
    .references(() => patients.id, { onDelete: "cascade" }),
  sessionId: text("session_id").references(() => sessions.id, {
    onDelete: "set null",
  }),
  state: text("state").notNull(),
  severity: text("severity").notNull(),
  signal: text("signal").notNull(),
  aiModel: text("ai_model"),
  confidencePercent: integer("confidence_percent"),
  clipUrl: text("clip_url"),
  humanReviewed: boolean("human_reviewed").default(false).notNull(),
  reviewedBy: text("reviewed_by").references(() => user.id, {
    onDelete: "set null",
  }),
  reviewedAt: timestamp("reviewed_at", { mode: "date" }),
  resolution: text("resolution"),
  claimHold: boolean("claim_hold").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const operationsPayerRateRules = pgTable("operations_payer_rate_rules", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  state: text("state").notNull(),
  payerName: text("payer_name").notNull(),
  serviceType: text("service_type").notNull(),
  cptCode: text("cpt_code").notNull(),
  modifier: text("modifier"),
  placeOfService: text("place_of_service"),
  unitMinutes: integer("unit_minutes").default(15).notNull(),
  collectedRateCentsPerHour: integer("collected_rate_cents_per_hour")
    .default(0)
    .notNull(),
  verificationStatus: text("verification_status")
    .default("placeholder")
    .notNull(),
  effectiveDate: timestamp("effective_date", { mode: "date" }),
  reviewDate: timestamp("review_date", { mode: "date" }),
  sourceUrl: text("source_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const operationsScheduleBlocks = pgTable("operations_schedule_blocks", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  patientId: text("patient_id").references(() => patients.id, {
    onDelete: "set null",
  }),
  providerId: text("provider_id").references(() => providerProfiles.id, {
    onDelete: "set null",
  }),
  state: text("state").notNull(),
  center: text("center"),
  serviceType: text("service_type").notNull(),
  mode: text("mode").default("in_person").notNull(),
  scheduledStart: timestamp("scheduled_start", { mode: "date" }).notNull(),
  scheduledEnd: timestamp("scheduled_end", { mode: "date" }).notNull(),
  paidMinutes: integer("paid_minutes").default(0).notNull(),
  billableMinutes: integer("billable_minutes").default(0).notNull(),
  ruleStatus: text("rule_status").default("verify").notNull(),
  status: text("status").default("scheduled").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const operationsPayrollTimeEntries = pgTable(
  "operations_payroll_time_entries",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    providerId: text("provider_id").references(() => providerProfiles.id, {
      onDelete: "set null",
    }),
    patientId: text("patient_id").references(() => patients.id, {
      onDelete: "set null",
    }),
    scheduleBlockId: text("schedule_block_id").references(
      () => operationsScheduleBlocks.id,
      { onDelete: "set null" },
    ),
    staffName: text("staff_name").notNull(),
    role: text("role").notNull(),
    state: text("state").notNull(),
    center: text("center"),
    serviceType: text("service_type").notNull(),
    clockIn: timestamp("clock_in", { mode: "date" }).notNull(),
    clockOut: timestamp("clock_out", { mode: "date" }),
    paidMinutes: integer("paid_minutes").default(0).notNull(),
    billableMinutes: integer("billable_minutes").default(0).notNull(),
    noteSigned: boolean("note_signed").default(false).notNull(),
    claimReady: boolean("claim_ready").default(false).notNull(),
    payrollRunId: text("payroll_run_id"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
);

export const operationsPayerPaymentCycles = pgTable(
  "operations_payer_payment_cycles",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    state: text("state").notNull(),
    payerName: text("payer_name").notNull(),
    expectedPaymentCycle: text("expected_payment_cycle")
      .default("unknown")
      .notNull(),
    averageDaysToPay: integer("average_days_to_pay").default(21).notNull(),
    eftAccountStrategy: text("eft_account_strategy")
      .default("single_operating_with_state_ledgers")
      .notNull(),
    bankAccountLabel: text("bank_account_label"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
);

export const operationsComplianceRequirements = pgTable(
  "operations_compliance_requirements",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    state: text("state").notNull(),
    domain: text("domain").notNull(),
    requirement: text("requirement").notNull(),
    owner: text("owner").notNull(),
    status: text("status").default("pending").notNull(),
    dueDate: timestamp("due_date", { mode: "date" }),
    renewalDate: timestamp("renewal_date", { mode: "date" }),
    penaltyRisk: text("penalty_risk").default("medium").notNull(),
    nextAction: text("next_action"),
    evidenceUrl: text("evidence_url"),
    completedAt: timestamp("completed_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
);

export const operationsWorkItems = pgTable("operations_work_items", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  state: text("state").notNull(),
  domain: text("domain").notNull(),
  priority: text("priority").default("medium").notNull(),
  owner: text("owner").notNull(),
  title: text("title").notNull(),
  detail: text("detail"),
  dueDate: timestamp("due_date", { mode: "date" }),
  blocks: text("blocks"),
  source: text("source"),
  status: text("status").default("open").notNull(),
  completedAt: timestamp("completed_at", { mode: "date" }),
  completedBy: text("completed_by").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const operationsAccountingLedgerEntries = pgTable(
  "operations_accounting_ledger_entries",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    state: text("state").notNull(),
    center: text("center"),
    clientLabel: text("client_label"),
    providerId: text("provider_id").references(() => providerProfiles.id, {
      onDelete: "set null",
    }),
    patientId: text("patient_id").references(() => patients.id, {
      onDelete: "set null",
    }),
    sourceType: text("source_type").notNull(),
    sourceId: text("source_id"),
    account: text("account").notNull(),
    debitCents: integer("debit_cents").default(0).notNull(),
    creditCents: integer("credit_cents").default(0).notNull(),
    entryDate: timestamp("entry_date", { mode: "date" }).notNull(),
    memo: text("memo"),
    postedAt: timestamp("posted_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
);

export const operationsRolePermissionPolicies = pgTable(
  "operations_role_permission_policies",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    permission: text("permission").notNull(),
    resourceType: text("resource_type").notNull(),
    accessLevel: text("access_level").notNull(),
    allowedStates: text("allowed_states").array(),
    requiresMfa: boolean("requires_mfa").default(true).notNull(),
    requiresBaa: boolean("requires_baa").default(false).notNull(),
    phiAccess: text("phi_access").default("none").notNull(),
    status: text("status").default("active").notNull(),
    reviewedAt: timestamp("reviewed_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
);

export const operationsCallLogs = pgTable("operations_call_logs", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  claimId: text("claim_id").references(() => insuranceClaims.id, {
    onDelete: "set null",
  }),
  authorizationId: text("authorization_id").references(
    () => serviceAuthorizations.id,
    { onDelete: "set null" },
  ),
  patientId: text("patient_id").references(() => patients.id, {
    onDelete: "set null",
  }),
  state: text("state").notNull(),
  payerName: text("payer_name"),
  callType: text("call_type").notNull(),
  direction: text("direction").default("outbound").notNull(),
  callerRole: text("caller_role").default("india_rcm").notNull(),
  callerName: text("caller_name"),
  phoneNumberLabel: text("phone_number_label"),
  payerRepresentative: text("payer_representative"),
  referenceNumber: text("reference_number").notNull(),
  disposition: text("disposition").notNull(),
  summary: text("summary").notNull(),
  nextAction: text("next_action"),
  followUpDate: timestamp("follow_up_date", { mode: "date" }),
  minimumNecessaryFields: text("minimum_necessary_fields").array(),
  recordingConsent: text("recording_consent").default("not_recorded").notNull(),
  recordingUrl: text("recording_url"),
  escalationRequired: boolean("escalation_required").default(false).notNull(),
  escalatedTo: text("escalated_to"),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const operationsClaimScrubberRules = pgTable(
  "operations_claim_scrubber_rules",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    state: text("state").notNull(),
    payerName: text("payer_name").notNull(),
    serviceType: text("service_type").notNull(),
    cptCode: text("cpt_code").notNull(),
    modifier: text("modifier"),
    placeOfService: text("place_of_service"),
    ruleType: text("rule_type").notNull(),
    severity: text("severity").default("error").notNull(),
    requirement: text("requirement").notNull(),
    failureMessage: text("failure_message").notNull(),
    effectiveDate: timestamp("effective_date", { mode: "date" }),
    status: text("status").default("draft").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
);

export const operationsAiAlertReviewEvents = pgTable(
  "operations_ai_alert_review_events",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    alertId: text("alert_id")
      .notNull()
      .references(() => aiVideoAlerts.id, { onDelete: "cascade" }),
    reviewerUserId: text("reviewer_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    reviewerRole: text("reviewer_role").default("bcba").notNull(),
    decision: text("decision").notNull(),
    falsePositiveReason: text("false_positive_reason"),
    clinicalAction: text("clinical_action"),
    claimHoldAfterReview: boolean("claim_hold_after_review")
      .default(true)
      .notNull(),
    reviewedAt: timestamp("reviewed_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
);

export const operationsLedgerLinks = pgTable("operations_ledger_links", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  ledgerEntryId: text("ledger_entry_id")
    .notNull()
    .references(() => operationsAccountingLedgerEntries.id, {
      onDelete: "cascade",
    }),
  payrollEntryId: text("payroll_entry_id").references(
    () => operationsPayrollTimeEntries.id,
    { onDelete: "set null" },
  ),
  claimId: text("claim_id").references(() => insuranceClaims.id, {
    onDelete: "set null",
  }),
  eraTrace: text("era_trace"),
  bankDepositId: text("bank_deposit_id"),
  reconciliationStatus: text("reconciliation_status")
    .default("unmatched")
    .notNull(),
  varianceCents: integer("variance_cents").default(0).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const operationsTrainingCompletions = pgTable(
  "operations_training_completions",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    providerId: text("provider_id").references(() => providerProfiles.id, {
      onDelete: "set null",
    }),
    patientId: text("patient_id").references(() => patients.id, {
      onDelete: "set null",
    }),
    assignedToRole: text("assigned_to_role").notNull(),
    assignedToName: text("assigned_to_name").notNull(),
    moduleId: text("module_id").notNull(),
    moduleTitle: text("module_title").notNull(),
    audience: text("audience").notNull(),
    assignedAt: timestamp("assigned_at", { mode: "date" })
      .defaultNow()
      .notNull(),
    dueDate: timestamp("due_date", { mode: "date" }),
    completedAt: timestamp("completed_at", { mode: "date" }),
    competencyScore: integer("competency_score"),
    signatureName: text("signature_name"),
    supervisorSignoffBy: text("supervisor_signoff_by").references(
      () => user.id,
      {
        onDelete: "set null",
      },
    ),
    supervisorSignoffAt: timestamp("supervisor_signoff_at", { mode: "date" }),
    status: text("status").default("assigned").notNull(),
    evidenceUrl: text("evidence_url"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
);
