# Product Gap and Improvement Roadmap

Last updated: 2026-07-05

The current app has useful autism-care foundations and now has an Operations command center UI. The remaining work is to convert mock operational data into production-grade workflows.

## Current Useful Features

- Patient tracking.
- Goals and progress.
- Sessions.
- Assessments.
- Data collection foundations.
- Parent portal foundations.
- Operations dashboard UI.
- Basic billing/invoice types.
- Operations database schema for provider profiles, state licenses, payer credentialing, authorizations, claims, claim events, RBT supervision, HIPAA audit logs, India RCM access, and AI video alerts.
- Rule-based AI triage module for credentialing, authorization, claims, supervision, HIPAA access, and video-alert risk.

## Critical Remaining Gaps

| Gap | Risk | Priority |
| --- | --- | --- |
| CRUD screens and APIs for credentialing tracker | Cannot safely maintain live payer/state evidence | P0 |
| CRUD screens and APIs for prior authorization tracker | Claims may deny or overrun units | P0 |
| Claim lifecycle APIs and persistence | Manual AR tracking will fail as volume grows | P0 |
| ERA/EFT reconciliation | Payment posting errors and missed underpayments | P0 |
| RBT supervision data-entry workflow | Compliance and clinical quality risk | P0 |
| HIPAA role/access enforcement | Offshore and video workflows unsafe without enforced permissions | P0 |
| AI video vendor integration and consent workflow | High legal and clinical risk | P0 |
| Payer call log and escalation queue | Unpaid claims will age without action | P1 |
| Multi-state payroll integration | Payroll tax/compliance risk | P1 |
| Vendor/BAA register | HIPAA vendor-chain risk | P1 |
| Client-facing consent packet | Video/AI and payment consent risk | P1 |

## Phase 1: Operations Data Model

Build database tables for:

- `states`
- `provider_licenses`
- `payer_enrollments`
- `payer_contracts`
- `authorizations`
- `claims`
- `claim_events`
- `claim_call_logs`
- `payments`
- `era_files`
- `rbt_supervision_logs`
- `video_alerts`
- `incident_reviews`
- `vendor_baas`
- `access_reviews`

Status: partially complete. Core operations tables now exist in code for provider profiles, state licenses, payer credentialing, service authorizations, insurance claims, claim events, RBT supervision logs, HIPAA audit logs, India RCM access, and AI video alerts. Separate vendor BAA and state rule tables still need to be added.

## Phase 2: Work Queues

Build queues:

- Credentialing missing documents.
- Authorization expiring in 14/30 days.
- Claims rejected.
- Claims unpaid over 14/30/45 days.
- Denials needing appeal.
- Notes incomplete.
- Supervision below threshold.
- AI high-risk alerts pending BCBA review.
- BAA/vendor review due.

Status: partially complete. The Operations dashboard now shows AI-generated triage recommendations using rule-based mock data. The next step is to persist queue items in the database and expose CRUD APIs.

## Phase 3: Integrations

Integrate only after manual workflow is stable:

- Clearinghouse claim submission.
- ERA import.
- EFT/deposit matching.
- Payroll export.
- Calendar/scheduling.
- HIPAA-compliant video vendor.
- AI alert service with BAA and no-training controls.

## Phase 4: India RCM Portal

Create a restricted RCM workspace:

- No full clinical chart by default.
- Claim work queue.
- Call script panel.
- Call log form.
- Reference number capture.
- Escalation button.
- No bulk export.
- Audit trail visible to owner.

## Phase 5: Sellable Software Product

After the center workflow works for your own clinic:

- Convert operational modules to multi-tenant product.
- Add organization-level BAA package.
- Add per-role access templates.
- Add payer-specific workflow templates.
- Add onboarding wizard for small ABA practices.
- Add analytics: AR days, denial rates, supervision compliance, authorization utilization.
- Add SOC 2/HIPAA readiness package before selling broadly.

## Build Priority

1. Real operations database.
2. CRUD APIs and screens for operations database.
3. Authorization and claim lifecycle.
4. RBT supervision and AI alert audit.
5. HIPAA roles, access logs, vendor register.
6. India RCM restricted portal.
7. ERA/EFT reconciliation.
8. Video/AI vendor integration.
9. Payroll export.
10. Commercial SaaS hardening.
