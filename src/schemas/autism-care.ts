import { JSON_SCHEMA_REGISTRY } from "@orpc/zod/zod4";
import * as z from "zod";

export const DateTimeSchema = z.string().datetime();

export const PatientSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: DateTimeSchema.nullable().optional(),
  gender: z.string().nullable().optional(),
  diagnosis: z.string().nullable().optional(),
  severityLevel: z.string().nullable().optional(),
  primaryLanguage: z.string().default("en"),
  preferredCommunication: z.string().default("verbal"),
  status: z.string().default("active"),
  assignedTherapistId: z.string().nullable().optional(),
  guardianUserId: z.string().nullable().optional(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const CreatePatientSchema = PatientSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export const UpdatePatientSchema = CreatePatientSchema;

export const GoalSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  patientId: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  category: z.string(),
  subcategory: z.string().nullable().optional(),
  targetBehavior: z.string().nullable().optional(),
  baselineValue: z.number().nullable().optional(),
  targetValue: z.number(),
  currentValue: z.number().nullable().optional(),
  unit: z.string().default("%"),
  masteryCriteria: z.number().default(80),
  status: z.string().default("active"),
  priority: z.string().default("medium"),
  startDate: DateTimeSchema.nullable().optional(),
  targetDate: DateTimeSchema.nullable().optional(),
  domain: z.string().nullable().optional(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const CreateGoalSchema = GoalSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export const UpdateGoalSchema = CreateGoalSchema;

export const SessionSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  patientId: z.string(),
  therapistId: z.string(),
  type: z.string(),
  status: z.string().default("scheduled"),
  scheduledStart: DateTimeSchema,
  scheduledEnd: DateTimeSchema,
  actualStart: DateTimeSchema.nullable().optional(),
  actualEnd: DateTimeSchema.nullable().optional(),
  durationMinutes: z.number().nullable().optional(),
  location: z.string().nullable().optional(),
  room: z.string().nullable().optional(),
  telehealth: z.boolean().default(false),
  mood: z.string().nullable().optional(),
  energyLevel: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const CreateSessionSchema = SessionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export const UpdateSessionSchema = CreateSessionSchema;

export const VisualScheduleSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  patientId: z.string().nullable().optional(),
  name: z.string(),
  description: z.string().nullable().optional(),
  type: z.string(),
  schedule: z.any().nullable().optional(),
  isTemplate: z.boolean().default(false),
  isDefault: z.boolean().default(false),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const CreateVisualScheduleSchema = VisualScheduleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export const CommunicationCardSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  patientId: z.string().nullable().optional(),
  name: z.string(),
  description: z.string().nullable().optional(),
  category: z.string(),
  cards: z.any().nullable().optional(),
  gridSize: z.string().default("4x4"),
  isTemplate: z.boolean().default(false),
  language: z.string().default("en"),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const CreateCommunicationCardSchema = CommunicationCardSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export const AssessmentSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  patientId: z.string(),
  type: z.string(),
  name: z.string(),
  provider: z.string().nullable().optional(),
  version: z.string().nullable().optional(),
  status: z.string().default("scheduled"),
  scheduledDate: DateTimeSchema.nullable().optional(),
  completedDate: DateTimeSchema.nullable().optional(),
  administeredBy: z.string().nullable().optional(),
  results: z.any().nullable().optional(),
  recommendations: z.string().nullable().optional(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const CreateAssessmentSchema = AssessmentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export const PatientStatsSchema = z.object({
  totalPatients: z.number(),
  activePatients: z.number(),
  totalGoals: z.number(),
  activeGoals: z.number(),
  sessionsThisWeek: z.number(),
  completedAssessments: z.number(),
});

JSON_SCHEMA_REGISTRY.add(PatientSchema, {
  examples: [
    {
      id: "pat_123",
      organizationId: "org_123",
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "2020-01-15T00:00:00Z",
      gender: "male",
      diagnosis: "Autism Spectrum Disorder",
      severityLevel: "Level 1",
      primaryLanguage: "en",
      preferredCommunication: "verbal",
      status: "active",
      assignedTherapistId: "usr_123",
      guardianUserId: "usr_456",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
});

JSON_SCHEMA_REGISTRY.add(GoalSchema, {
  examples: [
    {
      id: "goal_123",
      organizationId: "org_123",
      patientId: "pat_123",
      name: "Increase eye contact",
      description: "Patient will maintain eye contact for 3+ seconds",
      category: "social",
      targetValue: 80,
      currentValue: 45,
      unit: "%",
      masteryCriteria: 80,
      status: "active",
      priority: "high",
      domain: "Social Skills",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
});

JSON_SCHEMA_REGISTRY.add(SessionSchema, {
  examples: [
    {
      id: "ses_123",
      organizationId: "org_123",
      patientId: "pat_123",
      therapistId: "usr_123",
      type: "ABA Therapy",
      status: "completed",
      scheduledStart: new Date().toISOString(),
      scheduledEnd: new Date(Date.now() + 3600000).toISOString(),
      actualStart: new Date().toISOString(),
      actualEnd: new Date(Date.now() + 3500000).toISOString(),
      durationMinutes: 60,
      location: "Clinic",
      room: "Room 101",
      telehealth: false,
      mood: "happy",
      energyLevel: "high",
      notes: "Great session today",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
});
