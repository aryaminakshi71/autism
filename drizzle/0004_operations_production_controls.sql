CREATE TABLE IF NOT EXISTS "operations_role_permission_policies" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE cascade,
	"role" text NOT NULL,
	"permission" text NOT NULL,
	"resource_type" text NOT NULL,
	"access_level" text NOT NULL,
	"allowed_states" text[],
	"requires_mfa" boolean DEFAULT true NOT NULL,
	"requires_baa" boolean DEFAULT false NOT NULL,
	"phi_access" text DEFAULT 'none' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "operations_call_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE cascade,
	"claim_id" text REFERENCES "insurance_claims"("id") ON DELETE set null,
	"authorization_id" text REFERENCES "service_authorizations"("id") ON DELETE set null,
	"patient_id" text REFERENCES "patients"("id") ON DELETE set null,
	"state" text NOT NULL,
	"payer_name" text,
	"call_type" text NOT NULL,
	"direction" text DEFAULT 'outbound' NOT NULL,
	"caller_role" text DEFAULT 'india_rcm' NOT NULL,
	"caller_name" text,
	"phone_number_label" text,
	"payer_representative" text,
	"reference_number" text NOT NULL,
	"disposition" text NOT NULL,
	"summary" text NOT NULL,
	"next_action" text,
	"follow_up_date" timestamp,
	"minimum_necessary_fields" text[],
	"recording_consent" text DEFAULT 'not_recorded' NOT NULL,
	"recording_url" text,
	"escalation_required" boolean DEFAULT false NOT NULL,
	"escalated_to" text,
	"created_by" text REFERENCES "user"("id") ON DELETE set null,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "operations_claim_scrubber_rules" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE cascade,
	"state" text NOT NULL,
	"payer_name" text NOT NULL,
	"service_type" text NOT NULL,
	"cpt_code" text NOT NULL,
	"modifier" text,
	"place_of_service" text,
	"rule_type" text NOT NULL,
	"severity" text DEFAULT 'error' NOT NULL,
	"requirement" text NOT NULL,
	"failure_message" text NOT NULL,
	"effective_date" timestamp,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "operations_ai_alert_review_events" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE cascade,
	"alert_id" text NOT NULL REFERENCES "ai_video_alerts"("id") ON DELETE cascade,
	"reviewer_user_id" text REFERENCES "user"("id") ON DELETE set null,
	"reviewer_role" text DEFAULT 'bcba' NOT NULL,
	"decision" text NOT NULL,
	"false_positive_reason" text,
	"clinical_action" text,
	"claim_hold_after_review" boolean DEFAULT true NOT NULL,
	"reviewed_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "operations_ledger_links" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE cascade,
	"ledger_entry_id" text NOT NULL REFERENCES "operations_accounting_ledger_entries"("id") ON DELETE cascade,
	"payroll_entry_id" text REFERENCES "operations_payroll_time_entries"("id") ON DELETE set null,
	"claim_id" text REFERENCES "insurance_claims"("id") ON DELETE set null,
	"era_trace" text,
	"bank_deposit_id" text,
	"reconciliation_status" text DEFAULT 'unmatched' NOT NULL,
	"variance_cents" integer DEFAULT 0 NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "operations_training_completions" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL REFERENCES "organization"("id") ON DELETE cascade,
	"provider_id" text REFERENCES "provider_profiles"("id") ON DELETE set null,
	"patient_id" text REFERENCES "patients"("id") ON DELETE set null,
	"assigned_to_role" text NOT NULL,
	"assigned_to_name" text NOT NULL,
	"module_id" text NOT NULL,
	"module_title" text NOT NULL,
	"audience" text NOT NULL,
	"assigned_at" timestamp DEFAULT now() NOT NULL,
	"due_date" timestamp,
	"completed_at" timestamp,
	"competency_score" integer,
	"signature_name" text,
	"supervisor_signoff_by" text REFERENCES "user"("id") ON DELETE set null,
	"supervisor_signoff_at" timestamp,
	"status" text DEFAULT 'assigned' NOT NULL,
	"evidence_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
