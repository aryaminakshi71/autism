// Autism Care User Roles Schema - therapist, parent, admin roles and permissions

import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { organizations, users } from "./auth.schema";
import { patients } from "./autism-care.schema";

export type UserRole =
  | "admin"
  | "therapist"
  | "parent"
  | "bcba"
  | "speech_therapist"
  | "ot_therapist"
  | "behavior_analyst"
  | "guardian";

export const userRoles = pgTable(
  "user_roles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role", {
      enum: [
        "admin",
        "therapist",
        "parent",
        "bcba",
        "speech_therapist",
        "ot_therapist",
        "behavior_analyst",
        "guardian",
      ],
    })
      .notNull()
      .default("therapist"),
    permissions: jsonb("permissions").$type<{
      canManagePatients: boolean;
      canManageGoals: boolean;
      canConductSessions: boolean;
      canViewAllPatients: boolean;
      canEditOwnPatients: boolean;
      canViewOwnChildren: boolean;
      canAccessAssessments: boolean;
      canAdministerAssessments: boolean;
      canExportData: boolean;
      canManageUsers: boolean;
      canViewAnalytics: boolean;
      canManageSchedules: boolean;
      canManageCommunicationBoards: boolean;
    }>(),
    specializations: text("specializations").array(),
    licenseNumber: text("license_number"),
    certificationExpiry: timestamp("certification_expiry", {
      withTimezone: true,
    }),
    isActive: boolean("is_active").default(true).notNull(),
    activatedAt: timestamp("activated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    deactivatedAt: timestamp("deactivated_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationUserIdx: index("idx_user_roles_org_user").on(
      table.organizationId,
      table.userId,
    ),
    roleIdx: index("idx_user_roles_role").on(table.role),
    userIdx: index("idx_user_roles_user_id").on(table.userId),
  }),
);

export const patientGuardians = pgTable(
  "patient_guardians",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    relationship: text("relationship").notNull(),
    isPrimary: boolean("is_primary").default(false).notNull(),
    canViewProgress: boolean("can_view_progress").default(true).notNull(),
    canViewNotes: boolean("can_view_notes").default(true).notNull(),
    canViewAssessments: boolean("can_view_assessments").default(true).notNull(),
    canScheduleSessions: boolean("can_schedule_sessions")
      .default(false)
      .notNull(),
    canEditProfile: boolean("can_edit_profile").default(false).notNull(),
    consentGiven: boolean("consent_given").default(false).notNull(),
    consentDate: timestamp("consent_date", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    patientUserIdx: index("idx_patient_guardians_patient_user").on(
      table.patientId,
      table.userId,
    ),
    userIdx: index("idx_patient_guardians_user_id").on(table.userId),
  }),
);

export const therapistAssignments = pgTable(
  "therapist_assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    therapistId: text("therapist_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    patientId: uuid("patient_id")
      .notNull()
      .references(() => patients.id, { onDelete: "cascade" }),
    assignmentType: text("assignment_type", {
      enum: ["primary", "secondary", "consultant", "supervisor"],
    })
      .notNull()
      .default("primary"),
    startDate: timestamp("start_date", { withTimezone: true })
      .defaultNow()
      .notNull(),
    endDate: timestamp("end_date", { withTimezone: true }),
    isActive: boolean("is_active").default(true).notNull(),
    hoursPerWeek: integer("hours_per_week"),
    goalsAssigned: uuid("goals_assigned").array(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    therapistPatientIdx: index(
      "idx_therapist_assignments_therapist_patient",
    ).on(table.therapistId, table.patientId),
    patientIdx: index("idx_therapist_assignments_patient_id").on(
      table.patientId,
    ),
  }),
);

export const roleTemplates = pgTable(
  "role_templates",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    role: text("role", {
      enum: [
        "admin",
        "therapist",
        "parent",
        "bcba",
        "speech_therapist",
        "ot_therapist",
        "behavior_analyst",
        "guardian",
      ],
    }).notNull(),
    permissions: jsonb("permissions")
      .$type<{
        canManagePatients: boolean;
        canManageGoals: boolean;
        canConductSessions: boolean;
        canViewAllPatients: boolean;
        canEditOwnPatients: boolean;
        canViewOwnChildren: boolean;
        canAccessAssessments: boolean;
        canAdministerAssessments: boolean;
        canExportData: boolean;
        canManageUsers: boolean;
        canViewAnalytics: boolean;
        canManageSchedules: boolean;
        canManageCommunicationBoards: boolean;
      }>()
      .notNull(),
    isDefault: boolean("is_default").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({}),
);

export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    action: varchar("action", { length: 100 }).notNull(),
    resourceType: varchar("resource_type", { length: 100 }).notNull(),
    resourceId: varchar("resource_id", { length: 255 }),
    previousValue: jsonb("previous_value"),
    newValue: jsonb("new_value"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    organizationIdx: index("idx_audit_log_organization_id").on(
      table.organizationId,
    ),
    userIdx: index("idx_audit_log_user_id").on(table.userId),
    actionIdx: index("idx_audit_log_action").on(table.action),
    resourceIdx: index("idx_audit_log_resource").on(
      table.resourceType,
      table.resourceId,
    ),
    createdAtIdx: index("idx_audit_log_created_at").on(table.createdAt),
  }),
);

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  organization: one(organizations, {
    fields: [userRoles.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
}));

export const patientGuardiansRelations = relations(
  patientGuardians,
  ({ one }) => ({
    patient: one(patients, {
      fields: [patientGuardians.patientId],
      references: [patients.id],
    }),
    user: one(users, {
      fields: [patientGuardians.userId],
      references: [users.id],
    }),
  }),
);

export const therapistAssignmentsRelations = relations(
  therapistAssignments,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [therapistAssignments.organizationId],
      references: [organizations.id],
    }),
    therapist: one(users, {
      fields: [therapistAssignments.therapistId],
      references: [users.id],
    }),
    patient: one(patients, {
      fields: [therapistAssignments.patientId],
      references: [patients.id],
    }),
  }),
);

export const roleTemplatesRelations = relations(roleTemplates, ({ one }) => ({
  organization: one(organizations, {
    fields: [roleTemplates.organizationId],
    references: [organizations.id],
  }),
}));

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  organization: one(organizations, {
    fields: [auditLog.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [auditLog.userId],
    references: [users.id],
  }),
}));

export type UserRoleRow = typeof userRoles.$inferSelect;
export type UserRoleInsert = typeof userRoles.$inferInsert;
export type PatientGuardianRow = typeof patientGuardians.$inferSelect;
export type TherapistAssignmentRow = typeof therapistAssignments.$inferSelect;
export type AuditLogRow = typeof auditLog.$inferSelect;
