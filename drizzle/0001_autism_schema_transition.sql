CREATE TABLE IF NOT EXISTS "patients" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"date_of_birth" timestamp,
	"gender" text,
	"diagnosis" text,
	"severity_level" text,
	"primary_language" text DEFAULT 'en' NOT NULL,
	"preferred_communication" text DEFAULT 'verbal' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"assigned_therapist_id" text,
	"guardian_user_id" text,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goals" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"patient_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"subcategory" text,
	"target_behavior" text,
	"baseline_value" integer,
	"target_value" integer NOT NULL,
	"current_value" integer,
	"unit" text DEFAULT '%' NOT NULL,
	"mastery_criteria" integer DEFAULT 80 NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"start_date" timestamp,
	"target_date" timestamp,
	"domain" text,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"patient_id" text NOT NULL,
	"therapist_id" text NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'scheduled' NOT NULL,
	"scheduled_start" timestamp NOT NULL,
	"scheduled_end" timestamp NOT NULL,
	"actual_start" timestamp,
	"actual_end" timestamp,
	"duration_minutes" integer,
	"location" text,
	"room" text,
	"telehealth" boolean DEFAULT false NOT NULL,
	"mood" text,
	"energy_level" text,
	"notes" text,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "visual_schedules" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"patient_id" text,
	"name" text NOT NULL,
	"description" text,
	"type" text NOT NULL,
	"schedule" jsonb,
	"is_template" boolean DEFAULT false NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "communication_cards" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"patient_id" text,
	"name" text NOT NULL,
	"description" text,
	"category" text NOT NULL,
	"cards" jsonb,
	"grid_size" text DEFAULT '4x4' NOT NULL,
	"is_template" boolean DEFAULT false NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "assessments" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"patient_id" text NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"provider" text,
	"version" text,
	"status" text DEFAULT 'scheduled' NOT NULL,
	"scheduled_date" timestamp,
	"completed_date" timestamp,
	"administered_by" text,
	"results" jsonb,
	"recommendations" text,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_assigned_therapist_id_user_id_fk" FOREIGN KEY ("assigned_therapist_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_guardian_user_id_user_id_fk" FOREIGN KEY ("guardian_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "visual_schedules" ADD CONSTRAINT "visual_schedules_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "visual_schedules" ADD CONSTRAINT "visual_schedules_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "visual_schedules" ADD CONSTRAINT "visual_schedules_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "communication_cards" ADD CONSTRAINT "communication_cards_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "communication_cards" ADD CONSTRAINT "communication_cards_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "communication_cards" ADD CONSTRAINT "communication_cards_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
DROP TABLE IF EXISTS "workflow_executions" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "lead_forms" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "integration_accounts" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "app_connections" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "api_keys" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "leads" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "deals" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "contacts" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "activities" CASCADE;
