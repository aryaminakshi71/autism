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
