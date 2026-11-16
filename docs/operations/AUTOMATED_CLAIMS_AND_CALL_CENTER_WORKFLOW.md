# Automated Claims and Call Center Workflow

Last updated: 2026-07-05

This workflow defines how claims should be prepared automatically from RBT data collection, BCBA notes, authorization records, payer rate rules, and India RCM follow-up. The goal is to stop bad claims before submission, reduce rejections, and give the India call center a clear work queue by state, center, client, payer, and referral partner.

## Core Rule

Do not release a claim only because a session occurred. Release a claim only when the claim-readiness gate passes.

The claim-readiness gate checks:

- Client eligibility.
- Active authorization.
- Correct payer and state.
- Correct CPT code, modifier, place of service, and unit size.
- Remaining authorization units.
- Active treatment plan.
- Diagnosis on file.
- RBT data collected for direct therapy.
- RBT note signed for RBT/direct service.
- BCBA note signed for BCBA supervision, protocol modification, assessment, or parent training.
- Supervision link completed where required.
- Parent signature or acknowledgement when required by payer or center policy.
- Rate verified from payer contract or Medicaid schedule.

## Separate Billing Tracks

| Track | Typical CPT Examples | Required Before Claim Release |
| --- | --- | --- |
| RBT/direct therapy billing | 97153 or payer-specific equivalent | RBT data, RBT note, auth units, treatment plan, diagnosis, correct rendering/supervising provider, state/payer rate rule |
| BCBA supervision/protocol billing | 97155 or payer-specific equivalent | BCBA note, supervision/protocol detail, auth units, treatment plan link, state/payer rate rule |
| Parent training | 97156 or payer-specific equivalent | BCBA/qualified provider note, caregiver participation, goals trained, auth units, payer rule |
| Assessment/reassessment | 97151 or payer-specific equivalent | Assessment documentation, payer authorization where required, BCBA signature, rate rule |

The app must never mix RBT hours and BCBA hours. They are separate claim lines with separate documentation and rates.

## State and Payer Rate Table

Every state/payer must have a rate-rule record:

- State.
- Payer.
- Service type.
- CPT.
- Modifier.
- Place of service.
- Unit size.
- Contracted or Medicaid rate.
- Verification status.
- Effective date.
- Expiration or review date.

Placeholder rates can be used for planning, but claim submission must use verified payer contract or Medicaid fee schedule values.

## Claim Readiness Status

| Status | Meaning | Action |
| --- | --- | --- |
| Ready | No blocker and rate is verified | Release claim or route to clearinghouse |
| Hold | No hard blocker, but rate/modifier/payer rule needs verification | India RCM verifies before release |
| Blocked | Required documentation, authorization, units, note, diagnosis, or supervision link is missing | Do not submit; route to RBT, BCBA, or owner |

## India Call Center Work Queue

The call center should not work from generic claim lists. It should work from structured issues.

Each work item must show:

- State.
- Center.
- Client.
- Payer.
- Referral partner.
- Domain: payer claim, authorization, client attendance, RBT documentation, center operations, or referral partner.
- Priority.
- Issue.
- Script goal.
- Required fields to collect.
- Reference number.
- Next action.
- Escalation rule.

India RCM may handle:

- Eligibility verification.
- Authorization status.
- Claim status.
- Denial reason.
- Missing payer documents.
- ERA/EFT matching.
- Referral packet follow-up.
- Parent scheduling confirmation if approved by the center policy.

India RCM must not handle:

- Clinical decision-making.
- Treatment-plan changes.
- RBT clinical instruction.
- Unrestricted video review.
- Any PHI beyond minimum necessary for the task.

## Rejection Prevention Rules

Hold the claim before submission if:

- Authorization number is missing.
- Units are exhausted.
- CPT/modifier is missing or not verified.
- Treatment plan is inactive.
- RBT direct session lacks data or signed note.
- BCBA service lacks BCBA note.
- Supervision link is missing.
- Diagnosis is missing.
- Payer rate rule is missing.
- Date of service is outside authorization dates.
- Rendering provider or billing provider is not credentialed/effective for that payer.

## Automation Roadmap

Phase 1:

- Store state/payer rate rules.
- Store RBT session data and notes.
- Store BCBA notes.
- Generate claim-readiness queue.
- Generate India call-center queue.

Phase 2:

- Add payer-specific templates and clearinghouse export.
- Add ERA/EFT reconciliation.
- Add denial categorization and appeal deadlines.
- Add referral partner dashboard.

Phase 3:

- Integrate EHR/session-note workflow.
- Integrate clearinghouse API.
- Integrate AI note quality checks.
- Integrate payer portal status automation where allowed.

The system should behave like a release pipeline: incomplete clinical documentation blocks claim release just as failing tests block software deployment.
