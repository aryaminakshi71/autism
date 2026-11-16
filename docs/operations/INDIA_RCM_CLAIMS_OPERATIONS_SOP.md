# India RCM Claims Operations SOP

Last updated: 2026-07-05

This SOP defines how the India-based RCM team can support eligibility, authorizations, claim follow-up, denial tracking, ERA/EFT reconciliation, and reporting.

## Roles

| Role | Primary Duties | Not Allowed |
| --- | --- | --- |
| Software Engineer A | Software workflows, reports, queue automation, access controls | Clinical decisions or uncontrolled PHI export |
| India RCM Specialist | Eligibility, claim status calls, denial queue, payment posting support | Treatment plan changes or RBT instructions |
| BCBA B | Clinical QA, supervision audit, documentation review | Payer contract decisions without owner approval |
| Owner BCBA | Final clinical and business oversight | Delegating final clinical accountability to AI or non-clinical staff |

## Daily Workflow

1. Pull new sessions completed yesterday.
2. Confirm note complete and signed.
3. Confirm authorization exists for the date, CPT, units, and provider.
4. Confirm RBT supervision/documentation requirements are satisfied.
5. Release clean claims.
6. Check clearinghouse rejections.
7. Fix demographic, payer, NPI, modifier, or authorization errors.
8. Update claim status in the dashboard.
9. Queue calls for claims with no update by follow-up threshold.

## Claim Status Stages

Use one status per claim:

- `draft`
- `held_missing_note`
- `held_missing_authorization`
- `submitted`
- `clearinghouse_rejected`
- `payer_accepted`
- `information_requested`
- `denied`
- `appeal_pending`
- `paid`
- `underpaid`
- `closed`

## Follow-Up SLA

| Claim Age | Action |
| --- | --- |
| 0-2 days | Verify clearinghouse acceptance. |
| 3-7 days | Verify payer acceptance if no portal status. |
| 14 days | First payer call if no adjudication. |
| 21 days | Second payer call and supervisor escalation if stalled. |
| 30 days | Owner review and written escalation/appeal planning. |
| 45 days | High-priority escalation. Check timely filing and appeal limits. |

## Required Call Log Fields

- Date/time of call.
- Payer.
- Phone number called.
- Representative name and ID, if provided.
- Claim number.
- Patient initials or approved identifier.
- Date of service.
- Billed amount.
- Status provided.
- Reason pending/denied.
- Reference number.
- Next action.
- Follow-up date.
- Staff member.

## Denial Categories

- Eligibility inactive.
- Authorization missing.
- Authorization exhausted.
- Provider not credentialed.
- Modifier/CPT issue.
- Diagnosis issue.
- Duplicate claim.
- Timely filing.
- Documentation requested.
- Coordination of benefits.
- Medical necessity.
- Unknown payer processing issue.

## Escalation Rules

Escalate to Owner BCBA if:

- Denial cites medical necessity.
- Payer requests treatment plan or clinical documentation.
- More than two claims are denied for the same payer/reason.
- Claim is over 30 days without a clear payer answer.
- Payment is below expected contracted rate.
- Any staff member suspects documentation does not support billing.

## Monthly RCM Review

Review these KPIs:

- Claims submitted.
- Claims rejected.
- Denial rate.
- Days in AR.
- Collections by payer.
- Unpaid claims over 30/60/90 days.
- Authorization utilization.
- Write-offs.
- Underpayments.
- Claims held because of documentation.

