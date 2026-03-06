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
  assignedTherapistId: text("assigned_therapist_id").references(
    () => user.id,
    { onDelete: "set null" },
  ),
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
