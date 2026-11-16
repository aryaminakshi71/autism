// Autism Care Schema - patients, goals, sessions, schedules, assessments

import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { organizations, users } from "./auth.schema";

// Patients table - core client/patient information
export const patients = pgTable(
  "patients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    dateOfBirth: timestamp("date_of_birth", { withTimezone: true }),
    gender: varchar("gender", { length: 20 }),
    diagnosis: text("diagnosis"),
    diagnosisDate: timestamp("diagnosis_date", { withTimezone: true }),
    severityLevel: varchar("severity_level", { length: 20 }),
    primaryLanguage: varchar("primary_language", { length: 50 }).default("en"),
    preferredCommunication: varchar("preferred_communication", {
      length: 50,
    }).default("verbal"),
    allergies: text("allergies"),
    medications: text("medications"),
    emergencyContact: jsonb("emergency_contact").$type<{
      name: string;
      phone: string;
      relationship: string;
    }>(),
    preferences: jsonb("preferences").$type<{
      sensory: string[];
      triggers: string[];
      reinforcers: string[];
    }>(),
    notes: text("notes"),
    status: varchar("status", { length: 20 }).default("active").notNull(),
    assignedTherapistId: text("assigned_therapist_id").references(
      () => users.id,
      { onDelete: "set null" },
    ),
    guardianUserId: text("guardian_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdBy: text("created_by")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_patients_organization_id").on(
      table.organizationId,
    ),
    therapistIdx: index("idx_patients_therapist_id").on(
      table.assignedTherapistId,
    ),
    guardianIdx: index("idx_patients_guardian_id").on(table.guardianUserId),
    statusIdx: index("idx_patients_status").on(table.status),
  }),
);

// Goals table - ABA therapy goals
export const goals = pgTable(
  "goals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    category: varchar("category", { length: 50 }).notNull(),
    subcategory: varchar("subcategory", { length: 100 }),
    targetBehavior: text("target_behavior"),
    baselineValue: numeric("baseline_value", { precision: 10, scale: 2 }),
    targetValue: numeric("target_value", { precision: 10, scale: 2 }).notNull(),
    currentValue: numeric("current_value", { precision: 10, scale: 2 }),
    unit: varchar("unit", { length: 50 }).default("%"),
    masteryCriteria: numeric("mastery_criteria", {
      precision: 5,
      scale: 2,
    }).default("80"),
    status: varchar("status", { length: 20 }).default("active").notNull(),
    priority: varchar("priority", { length: 20 }).default("medium"),
    startDate: timestamp("start_date", { withTimezone: true }),
    targetDate: timestamp("target_date", { withTimezone: true }),
    domain: varchar("domain", { length: 50 }),
    iepGoalId: varchar("iep_goal_id", { length: 100 }),
    createdBy: text("created_by")
      .notNull()
      .references(() => users.id),
    assignedToId: text("assigned_to_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_goals_organization_id").on(
      table.organizationId,
    ),
    patientIdIdx: index("idx_goals_patient_id").on(table.patientId),
    statusIdx: index("idx_goals_status").on(table.status),
    categoryIdx: index("idx_goals_category").on(table.category),
  }),
);

// Goal progress tracking
export const goalProgress = pgTable(
  "goal_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    goalId: uuid("goal_id")
      .notNull()
      .references(() => goals.id, { onDelete: "cascade" }),
    sessionId: uuid("session_id").references(() => sessions.id, {
      onDelete: "set null",
    }),
    value: numeric("value", { precision: 10, scale: 2 }).notNull(),
    totalTrials: integer("total_trials"),
    correctTrials: integer("correct_trials"),
    promptLevel: varchar("prompt_level", { length: 20 }),
    dataCollectionMethod: varchar("data_collection_method", { length: 50 }),
    notes: text("notes"),
    recordedById: text("recorded_by_id").references(() => users.id),
    recordedAt: timestamp("recorded_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_goal_progress_organization_id").on(
      table.organizationId,
    ),
    goalIdIdx: index("idx_goal_progress_goal_id").on(table.goalId),
    sessionIdIdx: index("idx_goal_progress_session_id").on(table.sessionId),
    recordedAtIdx: index("idx_goal_progress_recorded_at").on(table.recordedAt),
  }),
);

// Sessions table - therapy session records
export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id, { onDelete: "cascade" }),
    therapistId: text("therapist_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 50 }).notNull(),
    status: varchar("status", { length: 20 }).default("scheduled").notNull(),
    scheduledStart: timestamp("scheduled_start", {
      withTimezone: true,
    }).notNull(),
    scheduledEnd: timestamp("scheduled_end", { withTimezone: true }).notNull(),
    actualStart: timestamp("actual_start", { withTimezone: true }),
    actualEnd: timestamp("actual_end", { withTimezone: true }),
    durationMinutes: integer("duration_minutes"),
    location: varchar("location", { length: 100 }),
    room: varchar("room", { length: 100 }),
    telehealth: boolean("telehealth").default(false),
    telehealthUrl: text("telehealth_url"),
    goalsTargeted: uuid("goals_targeted").array(),
    activities:
      jsonb("activities").$type<
        {
          name: string;
          duration: number;
          notes?: string;
        }[]
      >(),
    behaviors:
      jsonb("behaviors").$type<
        {
          type: string;
          description: string;
          intervention: string;
          outcome: string;
        }[]
      >(),
    mood: varchar("mood", { length: 20 }),
    energyLevel: varchar("energy_level", { length: 20 }),
    notes: text("notes"),
    therapistNotes: text("therapist_notes"),
    parentNotes: text("parent_notes"),
    cancellationReason: text("cancellation_reason"),
    makeUpSession: boolean("make_up_session").default(false),
    createdBy: text("created_by")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_sessions_organization_id").on(
      table.organizationId,
    ),
    patientIdIdx: index("idx_sessions_patient_id").on(table.patientId),
    therapistIdIdx: index("idx_sessions_therapist_id").on(table.therapistId),
    scheduledStartIdx: index("idx_sessions_scheduled_start").on(
      table.scheduledStart,
    ),
    statusIdx: index("idx_sessions_status").on(table.status),
  }),
);

// Visual schedules - daily routines and visual supports
export const visualSchedules = pgTable(
  "visual_schedules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    patientId: uuid("patient_id").references(() => patients.id, {
      onDelete: "cascade",
    }),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    type: varchar("type", { length: 50 }).notNull(),
    schedule: jsonb("schedule").$type<{
      items: {
        id: string;
        time?: string;
        duration?: number;
        activity: string;
        icon?: string;
        color?: string;
        isFirstThen?: boolean;
        isChoice?: boolean;
        choices?: string[];
        completed?: boolean;
      }[];
    }>(),
    isTemplate: boolean("is_template").default(false),
    isDefault: boolean("is_default").default(false),
    activeFrom: timestamp("active_from", { withTimezone: true }),
    activeTo: timestamp("active_to", { withTimezone: true }),
    createdBy: text("created_by")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_visual_schedules_organization_id").on(
      table.organizationId,
    ),
    patientIdIdx: index("idx_visual_schedules_patient_id").on(table.patientId),
    typeIdx: index("idx_visual_schedules_type").on(table.type),
  }),
);

// Communication cards - AAC tools
export const communicationCards = pgTable(
  "communication_cards",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    patientId: uuid("patient_id").references(() => patients.id, {
      onDelete: "cascade",
    }),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    category: varchar("category", { length: 100 }).notNull(),
    cards:
      jsonb("cards").$type<
        {
          id: string;
          label: string;
          symbol?: string;
          color?: string;
          sound?: string;
          linkTo?: string;
          subCards?: {
            id: string;
            label: string;
            symbol?: string;
            color?: string;
            sound?: string;
          }[];
        }[]
      >(),
    gridSize: varchar("grid_size", { length: 20 }).default("4x4"),
    isTemplate: boolean("is_template").default(false),
    isDefault: boolean("is_default").default(false),
    language: varchar("language", { length: 10 }).default("en"),
    createdBy: text("created_by")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_communication_cards_organization_id").on(
      table.organizationId,
    ),
    patientIdIdx: index("idx_communication_cards_patient_id").on(
      table.patientId,
    ),
    categoryIdx: index("idx_communication_cards_category").on(table.category),
  }),
);

// Assessments and screening tools
export const assessments = pgTable(
  "assessments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 100 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 100 }),
    version: varchar("version", { length: 20 }),
    status: varchar("status", { length: 20 }).default("scheduled").notNull(),
    scheduledDate: timestamp("scheduled_date", { withTimezone: true }),
    completedDate: timestamp("completed_date", { withTimezone: true }),
    administeredBy: text("administered_by").references(() => users.id, {
      onDelete: "set null",
    }),
    results: jsonb("results").$type<{
      rawScore?: number;
      standardScore?: number;
      percentile?: number;
      ageEquivalent?: string;
      descriptiveRating?: string;
      domainScores?: {
        domain: string;
        score: number;
        description?: string;
      }[];
      qualitativeNotes?: string;
    }>(),
    recommendations: text("recommendations"),
    goalsRecommended: text("goals_recommended"),
    nextAssessmentDate: timestamp("next_assessment_date", {
      withTimezone: true,
    }),
    notes: text("notes"),
    attachments: uuid("attachments").array(),
    createdBy: text("created_by")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_assessments_organization_id").on(
      table.organizationId,
    ),
    patientIdIdx: index("idx_assessments_patient_id").on(table.patientId),
    typeIdx: index("idx_assessments_type").on(table.type),
    statusIdx: index("idx_assessments_status").on(table.status),
  }),
);

// Parent training resources
export const parentResources = pgTable(
  "parent_resources",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    category: varchar("category", { length: 100 }).notNull(),
    type: varchar("type", { length: 50 }).notNull(),
    content: jsonb("content").$type<{
      sections: {
        title: string;
        body: string;
        videoUrl?: string;
      }[];
      exercises?: {
        title: string;
        instructions: string;
        tips?: string[];
      }[];
    }>(),
    targetAgeMin: integer("target_age_min"),
    targetAgeMax: integer("target_age_max"),
    duration: integer("duration"),
    isPublished: boolean("is_published").default(false),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdBy: text("created_by")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_parent_resources_organization_id").on(
      table.organizationId,
    ),
    categoryIdx: index("idx_parent_resources_category").on(table.category),
  }),
);

// Relations
export const patientsRelations = relations(patients, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [patients.organizationId],
    references: [organizations.id],
  }),
  assignedTherapist: one(users, {
    fields: [patients.assignedTherapistId],
    references: [users.id],
  }),
  guardian: one(users, {
    fields: [patients.guardianUserId],
    references: [users.id],
  }),
  createdByUser: one(users, {
    fields: [patients.createdBy],
    references: [users.id],
  }),
  goals: many(goals),
  sessions: many(sessions),
  visualSchedules: many(visualSchedules),
  communicationCards: many(communicationCards),
  assessments: many(assessments),
}));

export const goalsRelations = relations(goals, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [goals.organizationId],
    references: [organizations.id],
  }),
  patient: one(patients, {
    fields: [goals.patientId],
    references: [patients.id],
  }),
  createdByUser: one(users, {
    fields: [goals.createdBy],
    references: [users.id],
  }),
  assignedTo: one(users, {
    fields: [goals.assignedToId],
    references: [users.id],
  }),
  progress: many(goalProgress),
}));

export const goalProgressRelations = relations(goalProgress, ({ one }) => ({
  organization: one(organizations, {
    fields: [goalProgress.organizationId],
    references: [organizations.id],
  }),
  goal: one(goals, {
    fields: [goalProgress.goalId],
    references: [goals.id],
  }),
  session: one(sessions, {
    fields: [goalProgress.sessionId],
    references: [sessions.id],
  }),
  recordedBy: one(users, {
    fields: [goalProgress.recordedById],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [sessions.organizationId],
    references: [organizations.id],
  }),
  patient: one(patients, {
    fields: [sessions.patientId],
    references: [patients.id],
  }),
  therapist: one(users, {
    fields: [sessions.therapistId],
    references: [users.id],
  }),
  createdByUser: one(users, {
    fields: [sessions.createdBy],
    references: [users.id],
  }),
  goalProgress: many(goalProgress),
}));

export const visualSchedulesRelations = relations(
  visualSchedules,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [visualSchedules.organizationId],
      references: [organizations.id],
    }),
    patient: one(patients, {
      fields: [visualSchedules.patientId],
      references: [patients.id],
    }),
    createdByUser: one(users, {
      fields: [visualSchedules.createdBy],
      references: [users.id],
    }),
  }),
);

export const communicationCardsRelations = relations(
  communicationCards,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [communicationCards.organizationId],
      references: [organizations.id],
    }),
    patient: one(patients, {
      fields: [communicationCards.patientId],
      references: [patients.id],
    }),
    createdByUser: one(users, {
      fields: [communicationCards.createdBy],
      references: [users.id],
    }),
  }),
);

export const assessmentsRelations = relations(assessments, ({ one }) => ({
  organization: one(organizations, {
    fields: [assessments.organizationId],
    references: [organizations.id],
  }),
  patient: one(patients, {
    fields: [assessments.patientId],
    references: [patients.id],
  }),
  administeredBy: one(users, {
    fields: [assessments.administeredBy],
    references: [users.id],
  }),
  createdByUser: one(users, {
    fields: [assessments.createdBy],
    references: [users.id],
  }),
}));

export const parentResourcesRelations = relations(
  parentResources,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [parentResources.organizationId],
      references: [organizations.id],
    }),
    createdByUser: one(users, {
      fields: [parentResources.createdBy],
      references: [users.id],
    }),
  }),
);

// Data Collection Templates - ABA data collection method configurations
export const dataCollectionTemplates = pgTable(
  "data_collection_templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    type: varchar("type", { length: 50 }).notNull(), // trial_based, task_analysis, frequency, duration, latency, interval
    configuration: jsonb("configuration").$type<{
      fields: {
        name: string;
        type: "text" | "number" | "boolean" | "select" | "datetime";
        label: string;
        required: boolean;
        options?: string[];
        defaultValue?: any;
        calculated?: boolean;
      }[];
      scoring: {
        type: "percentage" | "rate" | "average" | "total";
        formula: string;
        unit?: string;
      };
    }>(),
    isBuiltIn: boolean("is_built_in").default(false),
    createdBy: text("created_by")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_data_templates_organization_id").on(
      table.organizationId,
    ),
    typeIdx: index("idx_data_templates_type").on(table.type),
  }),
);

// Data Collection Sheets - actual data collection instances
export const dataCollectionSheets = pgTable(
  "data_collection_sheets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    templateId: uuid("template_id")
      .notNull()
      .references(() => dataCollectionTemplates.id, { onDelete: "cascade" }),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id, { onDelete: "cascade" }),
    goalId: uuid("goal_id").references(() => goals.id, {
      onDelete: "set null",
    }),
    sessionId: uuid("session_id").references(() => sessions.id, {
      onDelete: "set null",
    }),
    name: varchar("name", { length: 255 }).notNull(),
    data: jsonb("data").$type<{
      entries: Record<string, any>[];
      summary?: {
        totalTrials?: number;
        correctTrials?: number;
        percentage?: number;
        rate?: number;
        average?: number;
      };
    }>(),
    status: varchar("status", { length: 20 }).default("in_progress").notNull(),
    startedAt: timestamp("started_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    recordedById: text("recorded_by_id")
      .notNull()
      .references(() => users.id),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_data_sheets_organization_id").on(
      table.organizationId,
    ),
    templateIdIdx: index("idx_data_sheets_template_id").on(table.templateId),
    patientIdIdx: index("idx_data_sheets_patient_id").on(table.patientId),
    goalIdIdx: index("idx_data_sheets_goal_id").on(table.goalId),
    sessionIdIdx: index("idx_data_sheets_session_id").on(table.sessionId),
    statusIdx: index("idx_data_sheets_status").on(table.status),
  }),
);

// Relations for data collection
export const dataCollectionTemplatesRelations = relations(
  dataCollectionTemplates,
  ({ one, many }) => ({
    organization: one(organizations, {
      fields: [dataCollectionTemplates.organizationId],
      references: [organizations.id],
    }),
    createdByUser: one(users, {
      fields: [dataCollectionTemplates.createdBy],
      references: [users.id],
    }),
    sheets: many(dataCollectionSheets),
  }),
);

export const dataCollectionSheetsRelations = relations(
  dataCollectionSheets,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [dataCollectionSheets.organizationId],
      references: [organizations.id],
    }),
    template: one(dataCollectionTemplates, {
      fields: [dataCollectionSheets.templateId],
      references: [dataCollectionTemplates.id],
    }),
    patient: one(patients, {
      fields: [dataCollectionSheets.patientId],
      references: [patients.id],
    }),
    goal: one(goals, {
      fields: [dataCollectionSheets.goalId],
      references: [goals.id],
    }),
    session: one(sessions, {
      fields: [dataCollectionSheets.sessionId],
      references: [sessions.id],
    }),
    recordedBy: one(users, {
      fields: [dataCollectionSheets.recordedById],
      references: [users.id],
    }),
  }),
);

// Parent Notes - Session summaries for parents
export const parentNotes = pgTable(
  "parent_notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    sessionId: uuid("session_id").references(() => sessions.id, {
      onDelete: "set null",
    }),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id, { onDelete: "cascade" }),
    date: varchar("date", { length: 10 }).notNull(),
    sessionType: varchar("session_type", { length: 50 }),
    duration: integer("duration"),
    summary: text("summary").notNull(),
    wins: text("wins").array(),
    challenges: text("challenges").array(),
    homePractice:
      jsonb("home_practice").$type<
        {
          skill: string;
          howToPractice: string;
          timeNeeded: string;
        }[]
      >(),
    photos: text("photos").array(),
    therapistNote: text("therapist_note"),
    parentAcknowledged: boolean("parent_acknowledged").default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_parent_notes_organization_id").on(
      table.organizationId,
    ),
    patientIdIdx: index("idx_parent_notes_patient_id").on(table.patientId),
    sessionIdIdx: index("idx_parent_notes_session_id").on(table.sessionId),
    dateIdx: index("idx_parent_notes_date").on(table.date),
    acknowledgedIdx: index("idx_parent_notes_acknowledged").on(
      table.parentAcknowledged,
    ),
  }),
);

// Parent Messages - Secure messaging between team and parents
export const parentMessages = pgTable(
  "parent_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id, { onDelete: "cascade" }),
    fromUserId: text("from_user_id")
      .notNull()
      .references(() => users.id),
    toUserId: text("to_user_id")
      .notNull()
      .references(() => users.id),
    subject: varchar("subject", { length: 255 }).notNull(),
    message: text("message").notNull(),
    attachments: text("attachments").array(),
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_parent_messages_organization_id").on(
      table.organizationId,
    ),
    patientIdIdx: index("idx_parent_messages_patient_id").on(table.patientId),
    fromUserIdIdx: index("idx_parent_messages_from_user_id").on(
      table.fromUserId,
    ),
    toUserIdIdx: index("idx_parent_messages_to_user_id").on(table.toUserId),
    isReadIdx: index("idx_parent_messages_is_read").on(table.isRead),
    createdAtIdx: index("idx_parent_messages_created_at").on(table.createdAt),
  }),
);

// Relations for parent portal
export const parentNotesRelations = relations(parentNotes, ({ one }) => ({
  organization: one(organizations, {
    fields: [parentNotes.organizationId],
    references: [organizations.id],
  }),
  session: one(sessions, {
    fields: [parentNotes.sessionId],
    references: [sessions.id],
  }),
  patient: one(patients, {
    fields: [parentNotes.patientId],
    references: [patients.id],
  }),
}));

export const parentMessagesRelations = relations(parentMessages, ({ one }) => ({
  organization: one(organizations, {
    fields: [parentMessages.organizationId],
    references: [organizations.id],
  }),
  patient: one(patients, {
    fields: [parentMessages.patientId],
    references: [patients.id],
  }),
  fromUser: one(users, {
    fields: [parentMessages.fromUserId],
    references: [users.id],
  }),
  toUser: one(users, {
    fields: [parentMessages.toUserId],
    references: [users.id],
  }),
}));

// Operations readiness: providers, licenses, credentialing, claims, supervision, HIPAA, and AI video alerts
export const providerProfiles = pgTable(
  "provider_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    displayName: varchar("display_name", { length: 160 }).notNull(),
    role: varchar("role", { length: 40 }).notNull(),
    employmentType: varchar("employment_type", { length: 40 }),
    homeState: varchar("home_state", { length: 2 }),
    serviceStates: text("service_states").array(),
    status: varchar("status", { length: 30 }).default("active").notNull(),
    maxClientLoad: integer("max_client_load"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_provider_profiles_organization_id").on(
      table.organizationId,
    ),
    roleIdx: index("idx_provider_profiles_role").on(table.role),
    statusIdx: index("idx_provider_profiles_status").on(table.status),
  }),
);

export const providerStateLicenses = pgTable(
  "provider_state_licenses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    providerId: uuid("provider_id")
      .notNull()
      .references(() => providerProfiles.id, { onDelete: "cascade" }),
    state: varchar("state", { length: 2 }).notNull(),
    licenseType: varchar("license_type", { length: 80 }).notNull(),
    licenseNumber: varchar("license_number", { length: 120 }),
    status: varchar("status", { length: 30 }).default("pending").notNull(),
    issuedDate: timestamp("issued_date", { withTimezone: true }),
    expirationDate: timestamp("expiration_date", { withTimezone: true }),
    evidenceUrl: text("evidence_url"),
    verifiedBy: text("verified_by").references(() => users.id, {
      onDelete: "set null",
    }),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_provider_licenses_organization_id").on(
      table.organizationId,
    ),
    providerIdx: index("idx_provider_licenses_provider_id").on(
      table.providerId,
    ),
    stateIdx: index("idx_provider_licenses_state").on(table.state),
    statusIdx: index("idx_provider_licenses_status").on(table.status),
  }),
);

export const payerCredentialing = pgTable(
  "payer_credentialing",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    providerId: uuid("provider_id").references(() => providerProfiles.id, {
      onDelete: "set null",
    }),
    payerName: varchar("payer_name", { length: 180 }).notNull(),
    state: varchar("state", { length: 2 }).notNull(),
    networkType: varchar("network_type", { length: 40 }),
    status: varchar("status", { length: 40 }).default("not_started").notNull(),
    applicationId: varchar("application_id", { length: 120 }),
    submittedDate: timestamp("submitted_date", { withTimezone: true }),
    effectiveDate: timestamp("effective_date", { withTimezone: true }),
    revalidationDate: timestamp("revalidation_date", { withTimezone: true }),
    portalUrl: text("portal_url"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_payer_credentialing_organization_id").on(
      table.organizationId,
    ),
    providerIdx: index("idx_payer_credentialing_provider_id").on(
      table.providerId,
    ),
    stateIdx: index("idx_payer_credentialing_state").on(table.state),
    statusIdx: index("idx_payer_credentialing_status").on(table.status),
  }),
);

export const serviceAuthorizations = pgTable(
  "service_authorizations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id, { onDelete: "cascade" }),
    payerCredentialingId: uuid("payer_credentialing_id").references(
      () => payerCredentialing.id,
      { onDelete: "set null" },
    ),
    payerName: varchar("payer_name", { length: 180 }).notNull(),
    authorizationNumber: varchar("authorization_number", { length: 160 }),
    state: varchar("state", { length: 2 }).notNull(),
    cptCode: varchar("cpt_code", { length: 20 }).notNull(),
    modifier: varchar("modifier", { length: 20 }),
    approvedUnits: integer("approved_units").notNull(),
    usedUnits: integer("used_units").default(0).notNull(),
    startDate: timestamp("start_date", { withTimezone: true }).notNull(),
    endDate: timestamp("end_date", { withTimezone: true }).notNull(),
    status: varchar("status", { length: 30 }).default("active").notNull(),
    documentUrl: text("document_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_service_auth_organization_id").on(
      table.organizationId,
    ),
    patientIdx: index("idx_service_auth_patient_id").on(table.patientId),
    stateIdx: index("idx_service_auth_state").on(table.state),
    statusIdx: index("idx_service_auth_status").on(table.status),
  }),
);

export const insuranceClaims = pgTable(
  "insurance_claims",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id, { onDelete: "cascade" }),
    sessionId: uuid("session_id").references(() => sessions.id, {
      onDelete: "set null",
    }),
    authorizationId: uuid("authorization_id").references(
      () => serviceAuthorizations.id,
      { onDelete: "set null" },
    ),
    payerName: varchar("payer_name", { length: 180 }).notNull(),
    state: varchar("state", { length: 2 }).notNull(),
    claimNumber: varchar("claim_number", { length: 160 }),
    clearinghouseTrace: varchar("clearinghouse_trace", { length: 160 }),
    status: varchar("status", { length: 40 }).default("draft").notNull(),
    dateOfService: timestamp("date_of_service", {
      withTimezone: true,
    }).notNull(),
    submittedDate: timestamp("submitted_date", { withTimezone: true }),
    billedCents: integer("billed_cents").default(0).notNull(),
    allowedCents: integer("allowed_cents"),
    paidCents: integer("paid_cents"),
    denialReason: text("denial_reason"),
    nextFollowUpDate: timestamp("next_follow_up_date", { withTimezone: true }),
    assignedRcmUserId: text("assigned_rcm_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_claims_organization_id").on(
      table.organizationId,
    ),
    patientIdx: index("idx_claims_patient_id").on(table.patientId),
    stateIdx: index("idx_claims_state").on(table.state),
    statusIdx: index("idx_claims_status").on(table.status),
    followUpIdx: index("idx_claims_next_follow_up").on(table.nextFollowUpDate),
  }),
);

export const claimEvents = pgTable(
  "claim_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    claimId: uuid("claim_id")
      .notNull()
      .references(() => insuranceClaims.id, { onDelete: "cascade" }),
    eventType: varchar("event_type", { length: 40 }).notNull(),
    eventDate: timestamp("event_date", { withTimezone: true })
      .defaultNow()
      .notNull(),
    payerRepresentative: varchar("payer_representative", { length: 160 }),
    referenceNumber: varchar("reference_number", { length: 160 }),
    summary: text("summary").notNull(),
    nextAction: text("next_action"),
    createdBy: text("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_claim_events_organization_id").on(
      table.organizationId,
    ),
    claimIdx: index("idx_claim_events_claim_id").on(table.claimId),
    eventTypeIdx: index("idx_claim_events_event_type").on(table.eventType),
  }),
);

export const rbtSupervisionLogs = pgTable(
  "rbt_supervision_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    rbtProviderId: uuid("rbt_provider_id")
      .notNull()
      .references(() => providerProfiles.id, { onDelete: "cascade" }),
    supervisingProviderId: uuid("supervising_provider_id")
      .notNull()
      .references(() => providerProfiles.id, { onDelete: "cascade" }),
    month: varchar("month", { length: 7 }).notNull(),
    totalServiceMinutes: integer("total_service_minutes").default(0).notNull(),
    supervisedMinutes: integer("supervised_minutes").default(0).notNull(),
    directObservationDone: boolean("direct_observation_done")
      .default(false)
      .notNull(),
    status: varchar("status", { length: 30 }).default("open").notNull(),
    evidenceUrl: text("evidence_url"),
    reviewedBy: text("reviewed_by").references(() => users.id, {
      onDelete: "set null",
    }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_rbt_supervision_organization_id").on(
      table.organizationId,
    ),
    rbtIdx: index("idx_rbt_supervision_rbt_id").on(table.rbtProviderId),
    supervisorIdx: index("idx_rbt_supervision_supervisor_id").on(
      table.supervisingProviderId,
    ),
    monthIdx: index("idx_rbt_supervision_month").on(table.month),
  }),
);

export const hipaaAuditLogs = pgTable(
  "hipaa_audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    actorUserId: text("actor_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    actorRole: varchar("actor_role", { length: 80 }),
    action: varchar("action", { length: 80 }).notNull(),
    resourceType: varchar("resource_type", { length: 80 }).notNull(),
    resourceId: text("resource_id"),
    patientId: uuid("patient_id").references(() => patients.id, {
      onDelete: "set null",
    }),
    ipAddress: varchar("ip_address", { length: 80 }),
    country: varchar("country", { length: 80 }),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_hipaa_audit_organization_id").on(
      table.organizationId,
    ),
    actorIdx: index("idx_hipaa_audit_actor_user_id").on(table.actorUserId),
    patientIdx: index("idx_hipaa_audit_patient_id").on(table.patientId),
    createdAtIdx: index("idx_hipaa_audit_created_at").on(table.createdAt),
  }),
);

export const indiaRcmAccess = pgTable(
  "india_rcm_access",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessScope: varchar("access_scope", { length: 80 }).notNull(),
    phiAccessLevel: varchar("phi_access_level", { length: 40 })
      .default("minimum")
      .notNull(),
    baaVerified: boolean("baa_verified").default(false).notNull(),
    mfaVerified: boolean("mfa_verified").default(false).notNull(),
    lastAccessReview: timestamp("last_access_review", { withTimezone: true }),
    status: varchar("status", { length: 30 }).default("pending").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_india_rcm_access_organization_id").on(
      table.organizationId,
    ),
    userIdx: index("idx_india_rcm_access_user_id").on(table.userId),
    statusIdx: index("idx_india_rcm_access_status").on(table.status),
  }),
);

export const aiVideoAlerts = pgTable(
  "ai_video_alerts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id, { onDelete: "cascade" }),
    sessionId: uuid("session_id").references(() => sessions.id, {
      onDelete: "set null",
    }),
    state: varchar("state", { length: 2 }).notNull(),
    severity: varchar("severity", { length: 20 }).notNull(),
    signal: text("signal").notNull(),
    aiModel: varchar("ai_model", { length: 120 }),
    confidencePercent: integer("confidence_percent"),
    clipUrl: text("clip_url"),
    humanReviewed: boolean("human_reviewed").default(false).notNull(),
    reviewedBy: text("reviewed_by").references(() => users.id, {
      onDelete: "set null",
    }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    resolution: text("resolution"),
    claimHold: boolean("claim_hold").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_ai_video_alerts_organization_id").on(
      table.organizationId,
    ),
    patientIdx: index("idx_ai_video_alerts_patient_id").on(table.patientId),
    severityIdx: index("idx_ai_video_alerts_severity").on(table.severity),
    reviewIdx: index("idx_ai_video_alerts_human_reviewed").on(
      table.humanReviewed,
    ),
  }),
);

export const operationsPayrollTimeEntries = pgTable(
  "operations_payroll_time_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    providerId: uuid("provider_id").references(() => providerProfiles.id, {
      onDelete: "set null",
    }),
    patientId: uuid("patient_id").references(() => patients.id, {
      onDelete: "set null",
    }),
    staffName: varchar("staff_name", { length: 160 }).notNull(),
    role: varchar("role", { length: 40 }).notNull(),
    state: varchar("state", { length: 2 }).notNull(),
    center: varchar("center", { length: 120 }),
    serviceType: varchar("service_type", { length: 60 }).notNull(),
    clockIn: timestamp("clock_in", { withTimezone: true }).notNull(),
    clockOut: timestamp("clock_out", { withTimezone: true }),
    paidMinutes: integer("paid_minutes").default(0).notNull(),
    billableMinutes: integer("billable_minutes").default(0).notNull(),
    noteSigned: boolean("note_signed").default(false).notNull(),
    claimReady: boolean("claim_ready").default(false).notNull(),
    payrollRunId: varchar("payroll_run_id", { length: 160 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_operations_payroll_org_id").on(
      table.organizationId,
    ),
    providerIdx: index("idx_operations_payroll_provider_id").on(
      table.providerId,
    ),
    patientIdx: index("idx_operations_payroll_patient_id").on(table.patientId),
    stateIdx: index("idx_operations_payroll_state").on(table.state),
  }),
);

export const operationsAccountingLedgerEntries = pgTable(
  "operations_accounting_ledger_entries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    state: varchar("state", { length: 2 }).notNull(),
    center: varchar("center", { length: 120 }),
    clientLabel: varchar("client_label", { length: 180 }),
    providerId: uuid("provider_id").references(() => providerProfiles.id, {
      onDelete: "set null",
    }),
    patientId: uuid("patient_id").references(() => patients.id, {
      onDelete: "set null",
    }),
    sourceType: varchar("source_type", { length: 60 }).notNull(),
    sourceId: text("source_id"),
    account: varchar("account", { length: 160 }).notNull(),
    debitCents: integer("debit_cents").default(0).notNull(),
    creditCents: integer("credit_cents").default(0).notNull(),
    entryDate: timestamp("entry_date", { withTimezone: true }).notNull(),
    memo: text("memo"),
    postedAt: timestamp("posted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_operations_ledger_org_id").on(
      table.organizationId,
    ),
    stateIdx: index("idx_operations_ledger_state").on(table.state),
    sourceIdx: index("idx_operations_ledger_source").on(
      table.sourceType,
      table.sourceId,
    ),
    entryDateIdx: index("idx_operations_ledger_entry_date").on(table.entryDate),
  }),
);

export const operationsRolePermissionPolicies = pgTable(
  "operations_role_permission_policies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 60 }).notNull(),
    permission: varchar("permission", { length: 100 }).notNull(),
    resourceType: varchar("resource_type", { length: 100 }).notNull(),
    accessLevel: varchar("access_level", { length: 40 }).notNull(),
    allowedStates: text("allowed_states").array(),
    requiresMfa: boolean("requires_mfa").default(true).notNull(),
    requiresBaa: boolean("requires_baa").default(false).notNull(),
    phiAccess: varchar("phi_access", { length: 40 }).default("none").notNull(),
    status: varchar("status", { length: 30 }).default("active").notNull(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_operations_rbac_org_id").on(
      table.organizationId,
    ),
    roleIdx: index("idx_operations_rbac_role").on(table.role),
  }),
);

export const operationsCallLogs = pgTable(
  "operations_call_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    claimId: uuid("claim_id").references(() => insuranceClaims.id, {
      onDelete: "set null",
    }),
    authorizationId: uuid("authorization_id").references(
      () => serviceAuthorizations.id,
      { onDelete: "set null" },
    ),
    patientId: uuid("patient_id").references(() => patients.id, {
      onDelete: "set null",
    }),
    state: varchar("state", { length: 2 }).notNull(),
    payerName: varchar("payer_name", { length: 180 }),
    callType: varchar("call_type", { length: 80 }).notNull(),
    direction: varchar("direction", { length: 30 }).default("outbound").notNull(),
    callerRole: varchar("caller_role", { length: 60 }).default("india_rcm").notNull(),
    callerName: varchar("caller_name", { length: 160 }),
    phoneNumberLabel: varchar("phone_number_label", { length: 120 }),
    payerRepresentative: varchar("payer_representative", { length: 160 }),
    referenceNumber: varchar("reference_number", { length: 160 }).notNull(),
    disposition: varchar("disposition", { length: 80 }).notNull(),
    summary: text("summary").notNull(),
    nextAction: text("next_action"),
    followUpDate: timestamp("follow_up_date", { withTimezone: true }),
    minimumNecessaryFields: text("minimum_necessary_fields").array(),
    recordingConsent: varchar("recording_consent", { length: 40 })
      .default("not_recorded")
      .notNull(),
    recordingUrl: text("recording_url"),
    escalationRequired: boolean("escalation_required").default(false).notNull(),
    escalatedTo: varchar("escalated_to", { length: 160 }),
    createdBy: text("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_operations_call_logs_org_id").on(
      table.organizationId,
    ),
    claimIdx: index("idx_operations_call_logs_claim_id").on(table.claimId),
    referenceIdx: index("idx_operations_call_logs_reference").on(
      table.referenceNumber,
    ),
  }),
);

export const operationsClaimScrubberRules = pgTable(
  "operations_claim_scrubber_rules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    state: varchar("state", { length: 2 }).notNull(),
    payerName: varchar("payer_name", { length: 180 }).notNull(),
    serviceType: varchar("service_type", { length: 60 }).notNull(),
    cptCode: varchar("cpt_code", { length: 20 }).notNull(),
    modifier: varchar("modifier", { length: 20 }),
    placeOfService: varchar("place_of_service", { length: 20 }),
    ruleType: varchar("rule_type", { length: 80 }).notNull(),
    severity: varchar("severity", { length: 20 }).default("error").notNull(),
    requirement: text("requirement").notNull(),
    failureMessage: text("failure_message").notNull(),
    effectiveDate: timestamp("effective_date", { withTimezone: true }),
    status: varchar("status", { length: 30 }).default("draft").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_operations_scrub_rules_org_id").on(
      table.organizationId,
    ),
    payerIdx: index("idx_operations_scrub_rules_payer").on(
      table.state,
      table.payerName,
    ),
  }),
);

export const operationsAiAlertReviewEvents = pgTable(
  "operations_ai_alert_review_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    alertId: uuid("alert_id")
      .notNull()
      .references(() => aiVideoAlerts.id, { onDelete: "cascade" }),
    reviewerUserId: text("reviewer_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    reviewerRole: varchar("reviewer_role", { length: 60 }).default("bcba").notNull(),
    decision: varchar("decision", { length: 80 }).notNull(),
    falsePositiveReason: text("false_positive_reason"),
    clinicalAction: text("clinical_action"),
    claimHoldAfterReview: boolean("claim_hold_after_review").default(true).notNull(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_operations_ai_reviews_org_id").on(
      table.organizationId,
    ),
    alertIdx: index("idx_operations_ai_reviews_alert_id").on(table.alertId),
  }),
);

export const operationsLedgerLinks = pgTable(
  "operations_ledger_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    ledgerEntryId: uuid("ledger_entry_id")
      .notNull()
      .references(() => operationsAccountingLedgerEntries.id, {
        onDelete: "cascade",
      }),
    payrollEntryId: uuid("payroll_entry_id").references(
      () => operationsPayrollTimeEntries.id,
      { onDelete: "set null" },
    ),
    claimId: uuid("claim_id").references(() => insuranceClaims.id, {
      onDelete: "set null",
    }),
    eraTrace: varchar("era_trace", { length: 160 }),
    bankDepositId: varchar("bank_deposit_id", { length: 160 }),
    reconciliationStatus: varchar("reconciliation_status", { length: 40 })
      .default("unmatched")
      .notNull(),
    varianceCents: integer("variance_cents").default(0).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_operations_ledger_links_org_id").on(
      table.organizationId,
    ),
    ledgerIdx: index("idx_operations_ledger_links_ledger_id").on(
      table.ledgerEntryId,
    ),
  }),
);

export const operationsTrainingCompletions = pgTable(
  "operations_training_completions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    providerId: uuid("provider_id").references(() => providerProfiles.id, {
      onDelete: "set null",
    }),
    patientId: uuid("patient_id").references(() => patients.id, {
      onDelete: "set null",
    }),
    assignedToRole: varchar("assigned_to_role", { length: 60 }).notNull(),
    assignedToName: varchar("assigned_to_name", { length: 160 }).notNull(),
    moduleId: varchar("module_id", { length: 120 }).notNull(),
    moduleTitle: varchar("module_title", { length: 200 }).notNull(),
    audience: varchar("audience", { length: 60 }).notNull(),
    assignedAt: timestamp("assigned_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    dueDate: timestamp("due_date", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    competencyScore: integer("competency_score"),
    signatureName: varchar("signature_name", { length: 160 }),
    supervisorSignoffBy: text("supervisor_signoff_by").references(() => users.id, {
      onDelete: "set null",
    }),
    supervisorSignoffAt: timestamp("supervisor_signoff_at", { withTimezone: true }),
    status: varchar("status", { length: 30 }).default("assigned").notNull(),
    evidenceUrl: text("evidence_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdIdx: index("idx_operations_training_org_id").on(
      table.organizationId,
    ),
    providerIdx: index("idx_operations_training_provider_id").on(table.providerId),
    patientIdx: index("idx_operations_training_patient_id").on(table.patientId),
    statusIdx: index("idx_operations_training_status").on(table.status),
  }),
);

// Type exports
export type Patient = typeof patients.$inferSelect;
export type NewPatient = typeof patients.$inferInsert;
export type Goal = typeof goals.$inferSelect;
export type NewGoal = typeof goals.$inferInsert;
export type GoalProgress = typeof goalProgress.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type VisualSchedule = typeof visualSchedules.$inferSelect;
export type CommunicationCard = typeof communicationCards.$inferSelect;
export type Assessment = typeof assessments.$inferSelect;
export type ParentResource = typeof parentResources.$inferSelect;
export type DataCollectionTemplate =
  typeof dataCollectionTemplates.$inferSelect;
export type DataCollectionSheet = typeof dataCollectionSheets.$inferSelect;
export type ProviderProfile = typeof providerProfiles.$inferSelect;
export type ProviderStateLicense = typeof providerStateLicenses.$inferSelect;
export type PayerCredentialing = typeof payerCredentialing.$inferSelect;
export type ServiceAuthorization = typeof serviceAuthorizations.$inferSelect;
export type InsuranceClaim = typeof insuranceClaims.$inferSelect;
export type ClaimEvent = typeof claimEvents.$inferSelect;
export type RbtSupervisionLog = typeof rbtSupervisionLogs.$inferSelect;
export type HipaaAuditLog = typeof hipaaAuditLogs.$inferSelect;
export type IndiaRcmAccess = typeof indiaRcmAccess.$inferSelect;
export type AiVideoAlert = typeof aiVideoAlerts.$inferSelect;
export type OperationsPayrollTimeEntry =
  typeof operationsPayrollTimeEntries.$inferSelect;
export type OperationsAccountingLedgerEntry =
  typeof operationsAccountingLedgerEntries.$inferSelect;
export type OperationsRolePermissionPolicy =
  typeof operationsRolePermissionPolicies.$inferSelect;
export type OperationsCallLog = typeof operationsCallLogs.$inferSelect;
export type OperationsClaimScrubberRule =
  typeof operationsClaimScrubberRules.$inferSelect;
export type OperationsAiAlertReviewEvent =
  typeof operationsAiAlertReviewEvents.$inferSelect;
export type OperationsLedgerLink = typeof operationsLedgerLinks.$inferSelect;
export type OperationsTrainingCompletion =
  typeof operationsTrainingCompletions.$inferSelect;
