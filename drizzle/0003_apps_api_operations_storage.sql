CREATE EXTENSION IF NOT EXISTS "pgcrypto";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"image" text,
	"email_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"logo" text,
	"metadata" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organizations"("id") ON DELETE cascade,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"date_of_birth" timestamp with time zone,
	"gender" varchar(20),
	"diagnosis" text,
	"diagnosis_date" timestamp with time zone,
	"severity_level" varchar(20),
	"primary_language" varchar(50) DEFAULT 'en',
	"preferred_communication" varchar(50) DEFAULT 'verbal',
	"allergies" text,
	"medications" text,
	"emergency_contact" jsonb,
	"preferences" jsonb,
	"notes" text,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"assigned_therapist_id" text REFERENCES "users"("id") ON DELETE set null,
	"guardian_user_id" text REFERENCES "users"("id") ON DELETE set null,
	"created_by" text NOT NULL REFERENCES "users"("id"),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "provider_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organizations"("id") ON DELETE cascade,
	"user_id" text REFERENCES "users"("id") ON DELETE set null,
	"display_name" varchar(160) NOT NULL,
	"role" varchar(40) NOT NULL,
	"employment_type" varchar(40),
	"home_state" varchar(2),
	"service_states" text[],
	"status" varchar(30) DEFAULT 'active' NOT NULL,
	"max_client_load" integer,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "provider_state_licenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organizations"("id") ON DELETE cascade,
	"provider_id" uuid NOT NULL REFERENCES "provider_profiles"("id") ON DELETE cascade,
	"state" varchar(2) NOT NULL,
	"license_type" varchar(80) NOT NULL,
	"license_number" varchar(120),
	"status" varchar(30) DEFAULT 'pending' NOT NULL,
	"issued_date" timestamp with time zone,
	"expiration_date" timestamp with time zone,
	"evidence_url" text,
	"verified_by" text REFERENCES "users"("id") ON DELETE set null,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payer_credentialing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organizations"("id") ON DELETE cascade,
	"provider_id" uuid REFERENCES "provider_profiles"("id") ON DELETE set null,
	"payer_name" varchar(180) NOT NULL,
	"state" varchar(2) NOT NULL,
	"network_type" varchar(40),
	"status" varchar(40) DEFAULT 'not_started' NOT NULL,
	"application_id" varchar(120),
	"submitted_date" timestamp with time zone,
	"effective_date" timestamp with time zone,
	"revalidation_date" timestamp with time zone,
	"portal_url" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "service_authorizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organizations"("id") ON DELETE cascade,
	"patient_id" uuid NOT NULL REFERENCES "patients"("id") ON DELETE cascade,
	"payer_credentialing_id" uuid REFERENCES "payer_credentialing"("id") ON DELETE set null,
	"payer_name" varchar(180) NOT NULL,
	"authorization_number" varchar(160),
	"state" varchar(2) NOT NULL,
	"cpt_code" varchar(20) NOT NULL,
	"modifier" varchar(20),
	"approved_units" integer NOT NULL,
	"used_units" integer DEFAULT 0 NOT NULL,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	"status" varchar(30) DEFAULT 'active' NOT NULL,
	"document_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "insurance_claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organizations"("id") ON DELETE cascade,
	"patient_id" uuid NOT NULL REFERENCES "patients"("id") ON DELETE cascade,
	"session_id" uuid,
	"authorization_id" uuid REFERENCES "service_authorizations"("id") ON DELETE set null,
	"payer_name" varchar(180) NOT NULL,
	"state" varchar(2) NOT NULL,
	"claim_number" varchar(160),
	"clearinghouse_trace" varchar(160),
	"status" varchar(40) DEFAULT 'draft' NOT NULL,
	"date_of_service" timestamp with time zone NOT NULL,
	"submitted_date" timestamp with time zone,
	"billed_cents" integer DEFAULT 0 NOT NULL,
	"allowed_cents" integer,
	"paid_cents" integer,
	"denial_reason" text,
	"next_follow_up_date" timestamp with time zone,
	"assigned_rcm_user_id" text REFERENCES "users"("id") ON DELETE set null,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "claim_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organizations"("id") ON DELETE cascade,
	"claim_id" uuid NOT NULL REFERENCES "insurance_claims"("id") ON DELETE cascade,
	"event_type" varchar(40) NOT NULL,
	"event_date" timestamp with time zone DEFAULT now() NOT NULL,
	"payer_representative" varchar(160),
	"reference_number" varchar(160),
	"summary" text NOT NULL,
	"next_action" text,
	"created_by" text REFERENCES "users"("id") ON DELETE set null,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_claim_events_organization_id" ON "claim_events" ("organization_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_claim_events_claim_id" ON "claim_events" ("claim_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_claim_events_event_type" ON "claim_events" ("event_type");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "operations_payroll_time_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organizations"("id") ON DELETE cascade,
	"provider_id" uuid REFERENCES "provider_profiles"("id") ON DELETE set null,
	"patient_id" uuid REFERENCES "patients"("id") ON DELETE set null,
	"staff_name" varchar(160) NOT NULL,
	"role" varchar(40) NOT NULL,
	"state" varchar(2) NOT NULL,
	"center" varchar(120),
	"service_type" varchar(60) NOT NULL,
	"clock_in" timestamp with time zone NOT NULL,
	"clock_out" timestamp with time zone,
	"paid_minutes" integer DEFAULT 0 NOT NULL,
	"billable_minutes" integer DEFAULT 0 NOT NULL,
	"note_signed" boolean DEFAULT false NOT NULL,
	"claim_ready" boolean DEFAULT false NOT NULL,
	"payroll_run_id" varchar(160),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "operations_accounting_ledger_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organizations"("id") ON DELETE cascade,
	"state" varchar(2) NOT NULL,
	"center" varchar(120),
	"client_label" varchar(180),
	"provider_id" uuid REFERENCES "provider_profiles"("id") ON DELETE set null,
	"patient_id" uuid REFERENCES "patients"("id") ON DELETE set null,
	"source_type" varchar(60) NOT NULL,
	"source_id" text,
	"account" varchar(160) NOT NULL,
	"debit_cents" integer DEFAULT 0 NOT NULL,
	"credit_cents" integer DEFAULT 0 NOT NULL,
	"entry_date" timestamp with time zone NOT NULL,
	"memo" text,
	"posted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
