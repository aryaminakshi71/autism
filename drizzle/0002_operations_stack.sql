CREATE TABLE IF NOT EXISTS "provider_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE cascade,
	"user_id" text REFERENCES "user"("id") ON DELETE set null,
	"display_name" text NOT NULL,
	"role" text NOT NULL,
	"employment_type" text,
	"home_state" text,
	"service_states" text[],
	"status" text DEFAULT 'active' NOT NULL,
	"max_client_load" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "provider_state_licenses" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE cascade,
	"provider_id" text NOT NULL REFERENCES "provider_profiles"("id") ON DELETE cascade,
	"state" text NOT NULL,
	"license_type" text NOT NULL,
	"license_number" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"issued_date" timestamp,
	"expiration_date" timestamp,
	"evidence_url" text,
	"verified_by" text REFERENCES "user"("id") ON DELETE set null,
	"verified_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payer_credentialing" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE cascade,
	"provider_id" text REFERENCES "provider_profiles"("id") ON DELETE set null,
	"payer_name" text NOT NULL,
	"state" text NOT NULL,
	"network_type" text,
	"status" text DEFAULT 'not_started' NOT NULL,
	"application_id" text,
	"submitted_date" timestamp,
	"effective_date" timestamp,
	"revalidation_date" timestamp,
	"portal_url" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "service_authorizations" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE cascade,
	"patient_id" text NOT NULL REFERENCES "patients"("id") ON DELETE cascade,
	"payer_credentialing_id" text REFERENCES "payer_credentialing"("id") ON DELETE set null,
	"payer_name" text NOT NULL,
	"authorization_number" text,
	"state" text NOT NULL,
	"cpt_code" text NOT NULL,
	"modifier" text,
	"approved_units" integer NOT NULL,
	"used_units" integer DEFAULT 0 NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"document_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "insurance_claims" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE cascade,
	"patient_id" text NOT NULL REFERENCES "patients"("id") ON DELETE cascade,
	"session_id" text REFERENCES "sessions"("id") ON DELETE set null,
	"authorization_id" text REFERENCES "service_authorizations"("id") ON DELETE set null,
	"payer_name" text NOT NULL,
	"state" text NOT NULL,
	"claim_number" text,
	"clearinghouse_trace" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"date_of_service" timestamp NOT NULL,
	"submitted_date" timestamp,
	"billed_cents" integer DEFAULT 0 NOT NULL,
	"allowed_cents" integer,
	"paid_cents" integer,
	"denial_reason" text,
	"next_follow_up_date" timestamp,
	"assigned_rcm_user_id" text REFERENCES "user"("id") ON DELETE set null,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "claim_events" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE cascade,
	"claim_id" text NOT NULL REFERENCES "insurance_claims"("id") ON DELETE cascade,
	"event_type" text NOT NULL,
	"event_date" timestamp DEFAULT now() NOT NULL,
	"payer_representative" text,
	"reference_number" text,
	"summary" text NOT NULL,
	"next_action" text,
	"created_by" text REFERENCES "user"("id") ON DELETE set null,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rbt_supervision_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE cascade,
	"rbt_provider_id" text NOT NULL REFERENCES "provider_profiles"("id") ON DELETE cascade,
	"supervising_provider_id" text NOT NULL REFERENCES "provider_profiles"("id") ON DELETE cascade,
	"month" text NOT NULL,
	"total_service_minutes" integer DEFAULT 0 NOT NULL,
	"supervised_minutes" integer DEFAULT 0 NOT NULL,
	"direct_observation_done" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"evidence_url" text,
	"reviewed_by" text REFERENCES "user"("id") ON DELETE set null,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hipaa_audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE cascade,
	"actor_user_id" text REFERENCES "user"("id") ON DELETE set null,
	"actor_role" text,
	"action" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text,
	"patient_id" text REFERENCES "patients"("id") ON DELETE set null,
	"ip_address" text,
	"country" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "india_rcm_access" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE cascade,
	"user_id" text NOT NULL REFERENCES "user"("id") ON DELETE cascade,
	"access_scope" text NOT NULL,
	"phi_access_level" text DEFAULT 'minimum' NOT NULL,
	"baa_verified" boolean DEFAULT false NOT NULL,
	"mfa_verified" boolean DEFAULT false NOT NULL,
	"last_access_review" timestamp,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_video_alerts" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE cascade,
	"patient_id" text NOT NULL REFERENCES "patients"("id") ON DELETE cascade,
	"session_id" text REFERENCES "sessions"("id") ON DELETE set null,
	"state" text NOT NULL,
	"severity" text NOT NULL,
	"signal" text NOT NULL,
	"ai_model" text,
	"confidence_percent" integer,
	"clip_url" text,
	"human_reviewed" boolean DEFAULT false NOT NULL,
	"reviewed_by" text REFERENCES "user"("id") ON DELETE set null,
	"reviewed_at" timestamp,
	"resolution" text,
	"claim_hold" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "operations_payer_rate_rules" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE cascade,
	"state" text NOT NULL,
	"payer_name" text NOT NULL,
	"service_type" text NOT NULL,
	"cpt_code" text NOT NULL,
	"modifier" text,
	"place_of_service" text,
	"unit_minutes" integer DEFAULT 15 NOT NULL,
	"collected_rate_cents_per_hour" integer DEFAULT 0 NOT NULL,
	"verification_status" text DEFAULT 'placeholder' NOT NULL,
	"effective_date" timestamp,
	"review_date" timestamp,
	"source_url" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "operations_schedule_blocks" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE cascade,
	"patient_id" text REFERENCES "patients"("id") ON DELETE set null,
	"provider_id" text REFERENCES "provider_profiles"("id") ON DELETE set null,
	"state" text NOT NULL,
	"center" text,
	"service_type" text NOT NULL,
	"mode" text DEFAULT 'in_person' NOT NULL,
	"scheduled_start" timestamp NOT NULL,
	"scheduled_end" timestamp NOT NULL,
	"paid_minutes" integer DEFAULT 0 NOT NULL,
	"billable_minutes" integer DEFAULT 0 NOT NULL,
	"rule_status" text DEFAULT 'verify' NOT NULL,
	"status" text DEFAULT 'scheduled' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "operations_payroll_time_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE cascade,
	"provider_id" text REFERENCES "provider_profiles"("id") ON DELETE set null,
	"patient_id" text REFERENCES "patients"("id") ON DELETE set null,
	"schedule_block_id" text REFERENCES "operations_schedule_blocks"("id") ON DELETE set null,
	"staff_name" text NOT NULL,
	"role" text NOT NULL,
	"state" text NOT NULL,
	"center" text,
	"service_type" text NOT NULL,
	"clock_in" timestamp NOT NULL,
	"clock_out" timestamp,
	"paid_minutes" integer DEFAULT 0 NOT NULL,
	"billable_minutes" integer DEFAULT 0 NOT NULL,
	"note_signed" boolean DEFAULT false NOT NULL,
	"claim_ready" boolean DEFAULT false NOT NULL,
	"payroll_run_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "operations_payer_payment_cycles" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE cascade,
	"state" text NOT NULL,
	"payer_name" text NOT NULL,
	"expected_payment_cycle" text DEFAULT 'unknown' NOT NULL,
	"average_days_to_pay" integer DEFAULT 21 NOT NULL,
	"eft_account_strategy" text DEFAULT 'single_operating_with_state_ledgers' NOT NULL,
	"bank_account_label" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "operations_compliance_requirements" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE cascade,
	"state" text NOT NULL,
	"domain" text NOT NULL,
	"requirement" text NOT NULL,
	"owner" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"due_date" timestamp,
	"renewal_date" timestamp,
	"penalty_risk" text DEFAULT 'medium' NOT NULL,
	"next_action" text,
	"evidence_url" text,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "operations_work_items" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE cascade,
	"state" text NOT NULL,
	"domain" text NOT NULL,
	"priority" text DEFAULT 'medium' NOT NULL,
	"owner" text NOT NULL,
	"title" text NOT NULL,
	"detail" text,
	"due_date" timestamp,
	"blocks" text,
	"source" text,
	"status" text DEFAULT 'open' NOT NULL,
	"completed_at" timestamp,
	"completed_by" text REFERENCES "user"("id") ON DELETE set null,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "operations_accounting_ledger_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE cascade,
	"state" text NOT NULL,
	"center" text,
	"client_label" text,
	"provider_id" text REFERENCES "provider_profiles"("id") ON DELETE set null,
	"patient_id" text REFERENCES "patients"("id") ON DELETE set null,
	"source_type" text NOT NULL,
	"source_id" text,
	"account" text NOT NULL,
	"debit_cents" integer DEFAULT 0 NOT NULL,
	"credit_cents" integer DEFAULT 0 NOT NULL,
	"entry_date" timestamp NOT NULL,
	"memo" text,
	"posted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
