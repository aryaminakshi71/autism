CREATE TABLE IF NOT EXISTS "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"active_organization_id" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'member',
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"inviter_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "member" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo" text,
	"metadata" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"image" text,
	"email_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_video_alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"patient_id" uuid NOT NULL,
	"session_id" uuid,
	"state" varchar(2) NOT NULL,
	"severity" varchar(20) NOT NULL,
	"signal" text NOT NULL,
	"ai_model" varchar(120),
	"confidence_percent" integer,
	"clip_url" text,
	"human_reviewed" boolean DEFAULT false NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"resolution" text,
	"claim_hold" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"patient_id" uuid NOT NULL,
	"type" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"provider" varchar(100),
	"version" varchar(20),
	"status" varchar(20) DEFAULT 'scheduled' NOT NULL,
	"scheduled_date" timestamp with time zone,
	"completed_date" timestamp with time zone,
	"administered_by" text,
	"results" jsonb,
	"recommendations" text,
	"goals_recommended" text,
	"next_assessment_date" timestamp with time zone,
	"notes" text,
	"attachments" uuid[],
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "claim_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"claim_id" uuid NOT NULL,
	"event_type" varchar(40) NOT NULL,
	"event_date" timestamp with time zone DEFAULT now() NOT NULL,
	"payer_representative" varchar(160),
	"reference_number" varchar(160),
	"summary" text NOT NULL,
	"next_action" text,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "communication_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"patient_id" uuid,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100) NOT NULL,
	"cards" jsonb,
	"grid_size" varchar(20) DEFAULT '4x4',
	"is_template" boolean DEFAULT false,
	"is_default" boolean DEFAULT false,
	"language" varchar(10) DEFAULT 'en',
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "data_collection_sheets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"template_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"goal_id" uuid,
	"session_id" uuid,
	"name" varchar(255) NOT NULL,
	"data" jsonb,
	"status" varchar(20) DEFAULT 'in_progress' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"recorded_by_id" text NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "data_collection_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"type" varchar(50) NOT NULL,
	"configuration" jsonb,
	"is_built_in" boolean DEFAULT false,
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"goal_id" uuid NOT NULL,
	"session_id" uuid,
	"value" numeric(10, 2) NOT NULL,
	"total_trials" integer,
	"correct_trials" integer,
	"prompt_level" varchar(20),
	"data_collection_method" varchar(50),
	"notes" text,
	"recorded_by_id" text,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"patient_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(50) NOT NULL,
	"subcategory" varchar(100),
	"target_behavior" text,
	"baseline_value" numeric(10, 2),
	"target_value" numeric(10, 2) NOT NULL,
	"current_value" numeric(10, 2),
	"unit" varchar(50) DEFAULT '%',
	"mastery_criteria" numeric(5, 2) DEFAULT '80',
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"priority" varchar(20) DEFAULT 'medium',
	"start_date" timestamp with time zone,
	"target_date" timestamp with time zone,
	"domain" varchar(50),
	"iep_goal_id" varchar(100),
	"created_by" text NOT NULL,
	"assigned_to_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hipaa_audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"actor_user_id" text,
	"actor_role" varchar(80),
	"action" varchar(80) NOT NULL,
	"resource_type" varchar(80) NOT NULL,
	"resource_id" text,
	"patient_id" uuid,
	"ip_address" varchar(80),
	"country" varchar(80),
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "india_rcm_access" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_scope" varchar(80) NOT NULL,
	"phi_access_level" varchar(40) DEFAULT 'minimum' NOT NULL,
	"baa_verified" boolean DEFAULT false NOT NULL,
	"mfa_verified" boolean DEFAULT false NOT NULL,
	"last_access_review" timestamp with time zone,
	"status" varchar(30) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "insurance_claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"patient_id" uuid NOT NULL,
	"session_id" uuid,
	"authorization_id" uuid,
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
	"assigned_rcm_user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "operations_accounting_ledger_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"state" varchar(2) NOT NULL,
	"center" varchar(120),
	"client_label" varchar(180),
	"provider_id" uuid,
	"patient_id" uuid,
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
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "operations_ai_alert_review_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"alert_id" uuid NOT NULL,
	"reviewer_user_id" text,
	"reviewer_role" varchar(60) DEFAULT 'bcba' NOT NULL,
	"decision" varchar(80) NOT NULL,
	"false_positive_reason" text,
	"clinical_action" text,
	"claim_hold_after_review" boolean DEFAULT true NOT NULL,
	"reviewed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "operations_call_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"claim_id" uuid,
	"authorization_id" uuid,
	"patient_id" uuid,
	"state" varchar(2) NOT NULL,
	"payer_name" varchar(180),
	"call_type" varchar(80) NOT NULL,
	"direction" varchar(30) DEFAULT 'outbound' NOT NULL,
	"caller_role" varchar(60) DEFAULT 'india_rcm' NOT NULL,
	"caller_name" varchar(160),
	"phone_number_label" varchar(120),
	"payer_representative" varchar(160),
	"reference_number" varchar(160) NOT NULL,
	"disposition" varchar(80) NOT NULL,
	"summary" text NOT NULL,
	"next_action" text,
	"follow_up_date" timestamp with time zone,
	"minimum_necessary_fields" text[],
	"recording_consent" varchar(40) DEFAULT 'not_recorded' NOT NULL,
	"recording_url" text,
	"escalation_required" boolean DEFAULT false NOT NULL,
	"escalated_to" varchar(160),
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "operations_claim_scrubber_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"state" varchar(2) NOT NULL,
	"payer_name" varchar(180) NOT NULL,
	"service_type" varchar(60) NOT NULL,
	"cpt_code" varchar(20) NOT NULL,
	"modifier" varchar(20),
	"place_of_service" varchar(20),
	"rule_type" varchar(80) NOT NULL,
	"severity" varchar(20) DEFAULT 'error' NOT NULL,
	"requirement" text NOT NULL,
	"failure_message" text NOT NULL,
	"effective_date" timestamp with time zone,
	"status" varchar(30) DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "operations_ledger_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"ledger_entry_id" uuid NOT NULL,
	"payroll_entry_id" uuid,
	"claim_id" uuid,
	"era_trace" varchar(160),
	"bank_deposit_id" varchar(160),
	"reconciliation_status" varchar(40) DEFAULT 'unmatched' NOT NULL,
	"variance_cents" integer DEFAULT 0 NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "operations_payroll_time_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"provider_id" uuid,
	"patient_id" uuid,
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
CREATE TABLE IF NOT EXISTS "operations_role_permission_policies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"role" varchar(60) NOT NULL,
	"permission" varchar(100) NOT NULL,
	"resource_type" varchar(100) NOT NULL,
	"access_level" varchar(40) NOT NULL,
	"allowed_states" text[],
	"requires_mfa" boolean DEFAULT true NOT NULL,
	"requires_baa" boolean DEFAULT false NOT NULL,
	"phi_access" varchar(40) DEFAULT 'none' NOT NULL,
	"status" varchar(30) DEFAULT 'active' NOT NULL,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "operations_training_completions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"provider_id" uuid,
	"patient_id" uuid,
	"assigned_to_role" varchar(60) NOT NULL,
	"assigned_to_name" varchar(160) NOT NULL,
	"module_id" varchar(120) NOT NULL,
	"module_title" varchar(200) NOT NULL,
	"audience" varchar(60) NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"due_date" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"competency_score" integer,
	"signature_name" varchar(160),
	"supervisor_signoff_by" text,
	"supervisor_signoff_at" timestamp with time zone,
	"status" varchar(30) DEFAULT 'assigned' NOT NULL,
	"evidence_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "parent_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"patient_id" uuid NOT NULL,
	"from_user_id" text NOT NULL,
	"to_user_id" text NOT NULL,
	"subject" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"attachments" text[],
	"is_read" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "parent_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"session_id" uuid,
	"patient_id" uuid NOT NULL,
	"date" varchar(10) NOT NULL,
	"session_type" varchar(50),
	"duration" integer,
	"summary" text NOT NULL,
	"wins" text[],
	"challenges" text[],
	"home_practice" jsonb,
	"photos" text[],
	"therapist_note" text,
	"parent_acknowledged" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "parent_resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(100) NOT NULL,
	"type" varchar(50) NOT NULL,
	"content" jsonb,
	"target_age_min" integer,
	"target_age_max" integer,
	"duration" integer,
	"is_published" boolean DEFAULT false,
	"published_at" timestamp with time zone,
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
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
	"assigned_therapist_id" text,
	"guardian_user_id" text,
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payer_credentialing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"provider_id" uuid,
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
CREATE TABLE IF NOT EXISTS "provider_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text,
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
	"organization_id" text NOT NULL,
	"provider_id" uuid NOT NULL,
	"state" varchar(2) NOT NULL,
	"license_type" varchar(80) NOT NULL,
	"license_number" varchar(120),
	"status" varchar(30) DEFAULT 'pending' NOT NULL,
	"issued_date" timestamp with time zone,
	"expiration_date" timestamp with time zone,
	"evidence_url" text,
	"verified_by" text,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rbt_supervision_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"rbt_provider_id" uuid NOT NULL,
	"supervising_provider_id" uuid NOT NULL,
	"month" varchar(7) NOT NULL,
	"total_service_minutes" integer DEFAULT 0 NOT NULL,
	"supervised_minutes" integer DEFAULT 0 NOT NULL,
	"direct_observation_done" boolean DEFAULT false NOT NULL,
	"status" varchar(30) DEFAULT 'open' NOT NULL,
	"evidence_url" text,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "service_authorizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"patient_id" uuid NOT NULL,
	"payer_credentialing_id" uuid,
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
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"patient_id" uuid NOT NULL,
	"therapist_id" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"status" varchar(20) DEFAULT 'scheduled' NOT NULL,
	"scheduled_start" timestamp with time zone NOT NULL,
	"scheduled_end" timestamp with time zone NOT NULL,
	"actual_start" timestamp with time zone,
	"actual_end" timestamp with time zone,
	"duration_minutes" integer,
	"location" varchar(100),
	"room" varchar(100),
	"telehealth" boolean DEFAULT false,
	"telehealth_url" text,
	"goals_targeted" uuid[],
	"activities" jsonb,
	"behaviors" jsonb,
	"mood" varchar(20),
	"energy_level" varchar(20),
	"notes" text,
	"therapist_notes" text,
	"parent_notes" text,
	"cancellation_reason" text,
	"make_up_session" boolean DEFAULT false,
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "visual_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"patient_id" uuid,
	"name" varchar(255) NOT NULL,
	"description" text,
	"type" varchar(50) NOT NULL,
	"schedule" jsonb,
	"is_template" boolean DEFAULT false,
	"is_default" boolean DEFAULT false,
	"active_from" timestamp with time zone,
	"active_to" timestamp with time zone,
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"description" text,
	"contact_id" uuid,
	"deal_id" uuid,
	"lead_id" uuid,
	"user_id" text NOT NULL,
	"due_date" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(255),
	"phone" varchar(20),
	"company_name" varchar(255),
	"job_title" varchar(100),
	"notes" text,
	"tags" text[],
	"metadata" jsonb,
	"owner_id" text,
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"value" numeric(15, 2) NOT NULL,
	"stage" varchar(50) DEFAULT 'lead' NOT NULL,
	"probability" numeric(5, 2) DEFAULT '0',
	"contact_id" uuid,
	"expected_close_date" timestamp with time zone,
	"notes" text,
	"owner_id" text,
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"size" varchar(50) NOT NULL,
	"r2_key" text NOT NULL,
	"contact_id" uuid,
	"deal_id" uuid,
	"lead_id" uuid,
	"uploaded_by_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"company_name" varchar(255),
	"job_title" varchar(100),
	"phone" varchar(20),
	"source" varchar(100) DEFAULT 'website' NOT NULL,
	"status" varchar(50) DEFAULT 'new' NOT NULL,
	"score" numeric(5, 2) DEFAULT '0',
	"notes" text,
	"converted_contact_id" uuid,
	"assigned_to_id" text,
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"key" varchar(64) NOT NULL,
	"name" varchar(255),
	"is_active" boolean DEFAULT true,
	"expires_at" timestamp,
	"last_used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "api_keys_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "app_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"source_app" varchar(50) NOT NULL,
	"target_app" varchar(50) NOT NULL,
	"trigger_event" varchar(100) NOT NULL,
	"action_type" varchar(50) NOT NULL,
	"action_config" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "integration_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"integration_type" varchar(50) NOT NULL,
	"account_name" varchar(255),
	"access_token" text,
	"refresh_token" text,
	"token_expires_at" timestamp,
	"config" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lead_forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"token" varchar(64) NOT NULL,
	"is_active" boolean DEFAULT true,
	"submission_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "lead_forms_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workflow_executions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" text NOT NULL,
	"connection_id" uuid,
	"trigger_event" varchar(100) NOT NULL,
	"source_data" jsonb,
	"action_result" jsonb,
	"status" varchar(20) NOT NULL,
	"error_message" text,
	"executed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "white_label_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"brand_name" varchar(120) DEFAULT 'SpectrumAI' NOT NULL,
	"logo_url" text,
	"primary_color" varchar(20) DEFAULT '#6366f1' NOT NULL,
	"support_email" varchar(180),
	"custom_domain" varchar(180),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "white_label_settings_organization_id_unique" UNIQUE("organization_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "member" ADD CONSTRAINT "member_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_video_alerts" ADD CONSTRAINT "ai_video_alerts_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_video_alerts" ADD CONSTRAINT "ai_video_alerts_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_video_alerts" ADD CONSTRAINT "ai_video_alerts_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_video_alerts" ADD CONSTRAINT "ai_video_alerts_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assessments" ADD CONSTRAINT "assessments_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assessments" ADD CONSTRAINT "assessments_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assessments" ADD CONSTRAINT "assessments_administered_by_user_id_fk" FOREIGN KEY ("administered_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assessments" ADD CONSTRAINT "assessments_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "claim_events" ADD CONSTRAINT "claim_events_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "claim_events" ADD CONSTRAINT "claim_events_claim_id_insurance_claims_id_fk" FOREIGN KEY ("claim_id") REFERENCES "public"."insurance_claims"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "claim_events" ADD CONSTRAINT "claim_events_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "communication_cards" ADD CONSTRAINT "communication_cards_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "communication_cards" ADD CONSTRAINT "communication_cards_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "communication_cards" ADD CONSTRAINT "communication_cards_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "data_collection_sheets" ADD CONSTRAINT "data_collection_sheets_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "data_collection_sheets" ADD CONSTRAINT "data_collection_sheets_template_id_data_collection_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."data_collection_templates"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "data_collection_sheets" ADD CONSTRAINT "data_collection_sheets_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "data_collection_sheets" ADD CONSTRAINT "data_collection_sheets_goal_id_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "data_collection_sheets" ADD CONSTRAINT "data_collection_sheets_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "data_collection_sheets" ADD CONSTRAINT "data_collection_sheets_recorded_by_id_user_id_fk" FOREIGN KEY ("recorded_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "data_collection_templates" ADD CONSTRAINT "data_collection_templates_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "data_collection_templates" ADD CONSTRAINT "data_collection_templates_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal_progress" ADD CONSTRAINT "goal_progress_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal_progress" ADD CONSTRAINT "goal_progress_goal_id_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal_progress" ADD CONSTRAINT "goal_progress_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal_progress" ADD CONSTRAINT "goal_progress_recorded_by_id_user_id_fk" FOREIGN KEY ("recorded_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goals" ADD CONSTRAINT "goals_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goals" ADD CONSTRAINT "goals_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goals" ADD CONSTRAINT "goals_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goals" ADD CONSTRAINT "goals_assigned_to_id_user_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hipaa_audit_logs" ADD CONSTRAINT "hipaa_audit_logs_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hipaa_audit_logs" ADD CONSTRAINT "hipaa_audit_logs_actor_user_id_user_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hipaa_audit_logs" ADD CONSTRAINT "hipaa_audit_logs_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "india_rcm_access" ADD CONSTRAINT "india_rcm_access_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "india_rcm_access" ADD CONSTRAINT "india_rcm_access_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "insurance_claims" ADD CONSTRAINT "insurance_claims_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "insurance_claims" ADD CONSTRAINT "insurance_claims_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "insurance_claims" ADD CONSTRAINT "insurance_claims_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "insurance_claims" ADD CONSTRAINT "insurance_claims_authorization_id_service_authorizations_id_fk" FOREIGN KEY ("authorization_id") REFERENCES "public"."service_authorizations"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "insurance_claims" ADD CONSTRAINT "insurance_claims_assigned_rcm_user_id_user_id_fk" FOREIGN KEY ("assigned_rcm_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "operations_accounting_ledger_entries" ADD CONSTRAINT "operations_accounting_ledger_entries_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "operations_accounting_ledger_entries" ADD CONSTRAINT "operations_accounting_ledger_entries_provider_id_provider_profiles_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."provider_profiles"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "operations_accounting_ledger_entries" ADD CONSTRAINT "operations_accounting_ledger_entries_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "operations_ai_alert_review_events" ADD CONSTRAINT "operations_ai_alert_review_events_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "operations_ai_alert_review_events" ADD CONSTRAINT "operations_ai_alert_review_events_alert_id_ai_video_alerts_id_fk" FOREIGN KEY ("alert_id") REFERENCES "public"."ai_video_alerts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "operations_ai_alert_review_events" ADD CONSTRAINT "operations_ai_alert_review_events_reviewer_user_id_user_id_fk" FOREIGN KEY ("reviewer_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "operations_call_logs" ADD CONSTRAINT "operations_call_logs_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "operations_call_logs" ADD CONSTRAINT "operations_call_logs_claim_id_insurance_claims_id_fk" FOREIGN KEY ("claim_id") REFERENCES "public"."insurance_claims"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "operations_call_logs" ADD CONSTRAINT "operations_call_logs_authorization_id_service_authorizations_id_fk" FOREIGN KEY ("authorization_id") REFERENCES "public"."service_authorizations"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "operations_call_logs" ADD CONSTRAINT "operations_call_logs_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "operations_call_logs" ADD CONSTRAINT "operations_call_logs_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "operations_claim_scrubber_rules" ADD CONSTRAINT "operations_claim_scrubber_rules_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "operations_ledger_links" ADD CONSTRAINT "operations_ledger_links_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "operations_ledger_links" ADD CONSTRAINT "operations_ledger_links_ledger_entry_id_operations_accounting_ledger_entries_id_fk" FOREIGN KEY ("ledger_entry_id") REFERENCES "public"."operations_accounting_ledger_entries"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "operations_ledger_links" ADD CONSTRAINT "operations_ledger_links_payroll_entry_id_operations_payroll_time_entries_id_fk" FOREIGN KEY ("payroll_entry_id") REFERENCES "public"."operations_payroll_time_entries"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "operations_ledger_links" ADD CONSTRAINT "operations_ledger_links_claim_id_insurance_claims_id_fk" FOREIGN KEY ("claim_id") REFERENCES "public"."insurance_claims"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "operations_payroll_time_entries" ADD CONSTRAINT "operations_payroll_time_entries_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "operations_payroll_time_entries" ADD CONSTRAINT "operations_payroll_time_entries_provider_id_provider_profiles_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."provider_profiles"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "operations_payroll_time_entries" ADD CONSTRAINT "operations_payroll_time_entries_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "operations_role_permission_policies" ADD CONSTRAINT "operations_role_permission_policies_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "operations_training_completions" ADD CONSTRAINT "operations_training_completions_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "operations_training_completions" ADD CONSTRAINT "operations_training_completions_provider_id_provider_profiles_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."provider_profiles"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "operations_training_completions" ADD CONSTRAINT "operations_training_completions_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "operations_training_completions" ADD CONSTRAINT "operations_training_completions_supervisor_signoff_by_user_id_fk" FOREIGN KEY ("supervisor_signoff_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "parent_messages" ADD CONSTRAINT "parent_messages_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "parent_messages" ADD CONSTRAINT "parent_messages_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "parent_messages" ADD CONSTRAINT "parent_messages_from_user_id_user_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "parent_messages" ADD CONSTRAINT "parent_messages_to_user_id_user_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "parent_notes" ADD CONSTRAINT "parent_notes_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "parent_notes" ADD CONSTRAINT "parent_notes_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "parent_notes" ADD CONSTRAINT "parent_notes_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "parent_resources" ADD CONSTRAINT "parent_resources_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "parent_resources" ADD CONSTRAINT "parent_resources_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patients" ADD CONSTRAINT "patients_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patients" ADD CONSTRAINT "patients_assigned_therapist_id_user_id_fk" FOREIGN KEY ("assigned_therapist_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patients" ADD CONSTRAINT "patients_guardian_user_id_user_id_fk" FOREIGN KEY ("guardian_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patients" ADD CONSTRAINT "patients_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payer_credentialing" ADD CONSTRAINT "payer_credentialing_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payer_credentialing" ADD CONSTRAINT "payer_credentialing_provider_id_provider_profiles_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."provider_profiles"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "provider_profiles" ADD CONSTRAINT "provider_profiles_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "provider_profiles" ADD CONSTRAINT "provider_profiles_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "provider_state_licenses" ADD CONSTRAINT "provider_state_licenses_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "provider_state_licenses" ADD CONSTRAINT "provider_state_licenses_provider_id_provider_profiles_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."provider_profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "provider_state_licenses" ADD CONSTRAINT "provider_state_licenses_verified_by_user_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rbt_supervision_logs" ADD CONSTRAINT "rbt_supervision_logs_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rbt_supervision_logs" ADD CONSTRAINT "rbt_supervision_logs_rbt_provider_id_provider_profiles_id_fk" FOREIGN KEY ("rbt_provider_id") REFERENCES "public"."provider_profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rbt_supervision_logs" ADD CONSTRAINT "rbt_supervision_logs_supervising_provider_id_provider_profiles_id_fk" FOREIGN KEY ("supervising_provider_id") REFERENCES "public"."provider_profiles"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rbt_supervision_logs" ADD CONSTRAINT "rbt_supervision_logs_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service_authorizations" ADD CONSTRAINT "service_authorizations_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service_authorizations" ADD CONSTRAINT "service_authorizations_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "service_authorizations" ADD CONSTRAINT "service_authorizations_payer_credentialing_id_payer_credentialing_id_fk" FOREIGN KEY ("payer_credentialing_id") REFERENCES "public"."payer_credentialing"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_therapist_id_user_id_fk" FOREIGN KEY ("therapist_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "visual_schedules" ADD CONSTRAINT "visual_schedules_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "visual_schedules" ADD CONSTRAINT "visual_schedules_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "visual_schedules" ADD CONSTRAINT "visual_schedules_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "activities" ADD CONSTRAINT "activities_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "activities" ADD CONSTRAINT "activities_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contacts" ADD CONSTRAINT "contacts_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contacts" ADD CONSTRAINT "contacts_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contacts" ADD CONSTRAINT "contacts_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deals" ADD CONSTRAINT "deals_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deals" ADD CONSTRAINT "deals_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "deals" ADD CONSTRAINT "deals_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files" ADD CONSTRAINT "files_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "files" ADD CONSTRAINT "files_uploaded_by_id_user_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "leads" ADD CONSTRAINT "leads_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_to_id_user_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "leads" ADD CONSTRAINT "leads_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "app_connections" ADD CONSTRAINT "app_connections_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "integration_accounts" ADD CONSTRAINT "integration_accounts_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lead_forms" ADD CONSTRAINT "lead_forms_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workflow_executions" ADD CONSTRAINT "workflow_executions_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ai_video_alerts_organization_id" ON "ai_video_alerts" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ai_video_alerts_patient_id" ON "ai_video_alerts" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ai_video_alerts_severity" ON "ai_video_alerts" USING btree ("severity");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ai_video_alerts_human_reviewed" ON "ai_video_alerts" USING btree ("human_reviewed");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_assessments_organization_id" ON "assessments" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_assessments_patient_id" ON "assessments" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_assessments_type" ON "assessments" USING btree ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_assessments_status" ON "assessments" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_claim_events_organization_id" ON "claim_events" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_claim_events_claim_id" ON "claim_events" USING btree ("claim_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_claim_events_event_type" ON "claim_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_communication_cards_organization_id" ON "communication_cards" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_communication_cards_patient_id" ON "communication_cards" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_communication_cards_category" ON "communication_cards" USING btree ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_data_sheets_organization_id" ON "data_collection_sheets" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_data_sheets_template_id" ON "data_collection_sheets" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_data_sheets_patient_id" ON "data_collection_sheets" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_data_sheets_goal_id" ON "data_collection_sheets" USING btree ("goal_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_data_sheets_session_id" ON "data_collection_sheets" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_data_sheets_status" ON "data_collection_sheets" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_data_templates_organization_id" ON "data_collection_templates" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_data_templates_type" ON "data_collection_templates" USING btree ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_goal_progress_organization_id" ON "goal_progress" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_goal_progress_goal_id" ON "goal_progress" USING btree ("goal_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_goal_progress_session_id" ON "goal_progress" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_goal_progress_recorded_at" ON "goal_progress" USING btree ("recorded_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_goals_organization_id" ON "goals" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_goals_patient_id" ON "goals" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_goals_status" ON "goals" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_goals_category" ON "goals" USING btree ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_hipaa_audit_organization_id" ON "hipaa_audit_logs" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_hipaa_audit_actor_user_id" ON "hipaa_audit_logs" USING btree ("actor_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_hipaa_audit_patient_id" ON "hipaa_audit_logs" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_hipaa_audit_created_at" ON "hipaa_audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_india_rcm_access_organization_id" ON "india_rcm_access" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_india_rcm_access_user_id" ON "india_rcm_access" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_india_rcm_access_status" ON "india_rcm_access" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_claims_organization_id" ON "insurance_claims" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_claims_patient_id" ON "insurance_claims" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_claims_state" ON "insurance_claims" USING btree ("state");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_claims_status" ON "insurance_claims" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_claims_next_follow_up" ON "insurance_claims" USING btree ("next_follow_up_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_operations_ledger_org_id" ON "operations_accounting_ledger_entries" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_operations_ledger_state" ON "operations_accounting_ledger_entries" USING btree ("state");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_operations_ledger_source" ON "operations_accounting_ledger_entries" USING btree ("source_type","source_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_operations_ledger_entry_date" ON "operations_accounting_ledger_entries" USING btree ("entry_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_operations_ai_reviews_org_id" ON "operations_ai_alert_review_events" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_operations_ai_reviews_alert_id" ON "operations_ai_alert_review_events" USING btree ("alert_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_operations_call_logs_org_id" ON "operations_call_logs" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_operations_call_logs_claim_id" ON "operations_call_logs" USING btree ("claim_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_operations_call_logs_reference" ON "operations_call_logs" USING btree ("reference_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_operations_scrub_rules_org_id" ON "operations_claim_scrubber_rules" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_operations_scrub_rules_payer" ON "operations_claim_scrubber_rules" USING btree ("state","payer_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_operations_ledger_links_org_id" ON "operations_ledger_links" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_operations_ledger_links_ledger_id" ON "operations_ledger_links" USING btree ("ledger_entry_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_operations_payroll_org_id" ON "operations_payroll_time_entries" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_operations_payroll_provider_id" ON "operations_payroll_time_entries" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_operations_payroll_patient_id" ON "operations_payroll_time_entries" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_operations_payroll_state" ON "operations_payroll_time_entries" USING btree ("state");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_operations_rbac_org_id" ON "operations_role_permission_policies" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_operations_rbac_role" ON "operations_role_permission_policies" USING btree ("role");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_operations_training_org_id" ON "operations_training_completions" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_operations_training_provider_id" ON "operations_training_completions" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_operations_training_patient_id" ON "operations_training_completions" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_operations_training_status" ON "operations_training_completions" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_parent_messages_organization_id" ON "parent_messages" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_parent_messages_patient_id" ON "parent_messages" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_parent_messages_from_user_id" ON "parent_messages" USING btree ("from_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_parent_messages_to_user_id" ON "parent_messages" USING btree ("to_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_parent_messages_is_read" ON "parent_messages" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_parent_messages_created_at" ON "parent_messages" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_parent_notes_organization_id" ON "parent_notes" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_parent_notes_patient_id" ON "parent_notes" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_parent_notes_session_id" ON "parent_notes" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_parent_notes_date" ON "parent_notes" USING btree ("date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_parent_notes_acknowledged" ON "parent_notes" USING btree ("parent_acknowledged");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_parent_resources_organization_id" ON "parent_resources" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_parent_resources_category" ON "parent_resources" USING btree ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_patients_organization_id" ON "patients" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_patients_therapist_id" ON "patients" USING btree ("assigned_therapist_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_patients_guardian_id" ON "patients" USING btree ("guardian_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_patients_status" ON "patients" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_payer_credentialing_organization_id" ON "payer_credentialing" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_payer_credentialing_provider_id" ON "payer_credentialing" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_payer_credentialing_state" ON "payer_credentialing" USING btree ("state");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_payer_credentialing_status" ON "payer_credentialing" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_provider_profiles_organization_id" ON "provider_profiles" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_provider_profiles_role" ON "provider_profiles" USING btree ("role");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_provider_profiles_status" ON "provider_profiles" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_provider_licenses_organization_id" ON "provider_state_licenses" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_provider_licenses_provider_id" ON "provider_state_licenses" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_provider_licenses_state" ON "provider_state_licenses" USING btree ("state");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_provider_licenses_status" ON "provider_state_licenses" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_rbt_supervision_organization_id" ON "rbt_supervision_logs" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_rbt_supervision_rbt_id" ON "rbt_supervision_logs" USING btree ("rbt_provider_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_rbt_supervision_supervisor_id" ON "rbt_supervision_logs" USING btree ("supervising_provider_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_rbt_supervision_month" ON "rbt_supervision_logs" USING btree ("month");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_service_auth_organization_id" ON "service_authorizations" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_service_auth_patient_id" ON "service_authorizations" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_service_auth_state" ON "service_authorizations" USING btree ("state");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_service_auth_status" ON "service_authorizations" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sessions_organization_id" ON "sessions" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sessions_patient_id" ON "sessions" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sessions_therapist_id" ON "sessions" USING btree ("therapist_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sessions_scheduled_start" ON "sessions" USING btree ("scheduled_start");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_sessions_status" ON "sessions" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_visual_schedules_organization_id" ON "visual_schedules" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_visual_schedules_patient_id" ON "visual_schedules" USING btree ("patient_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_visual_schedules_type" ON "visual_schedules" USING btree ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_activities_organization_id" ON "activities" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_activities_contact_id" ON "activities" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_activities_deal_id" ON "activities" USING btree ("deal_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_activities_type" ON "activities" USING btree ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_contacts_organization_id" ON "contacts" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_contacts_email" ON "contacts" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_contacts_owner_id" ON "contacts" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_deals_organization_id" ON "deals" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_deals_contact_id" ON "deals" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_deals_stage" ON "deals" USING btree ("stage");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_leads_organization_id" ON "leads" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_leads_email" ON "leads" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_leads_status" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_api_keys_user" ON "api_keys" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_api_keys_key" ON "api_keys" USING btree ("key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_app_connections_organization" ON "app_connections" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_app_connections_source" ON "app_connections" USING btree ("source_app","trigger_event");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_integration_accounts_organization" ON "integration_accounts" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_integration_accounts_type" ON "integration_accounts" USING btree ("integration_type","is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_lead_forms_organization" ON "lead_forms" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_lead_forms_token" ON "lead_forms" USING btree ("token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_workflow_executions_organization" ON "workflow_executions" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_workflow_executions_connection" ON "workflow_executions" USING btree ("connection_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_workflow_executions_status" ON "workflow_executions" USING btree ("status","executed_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_white_label_org" ON "white_label_settings" USING btree ("organization_id");