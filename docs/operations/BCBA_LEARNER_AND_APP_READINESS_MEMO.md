# BCBA Learner, Staffing, and App Readiness Memo

Last updated: 2026-07-05

## Executive Answer

A learner BCBA can help, but does not automatically increase the legal or clinical capacity of the responsible BCBA. A trainee can reduce workload by helping with data review, treatment-material preparation, session observation, draft updates, caregiver-resource preparation, and QA checklists. The supervising BCBA still remains responsible for clinical decisions and supervision quality.

The better capacity path is usually a layered model:

1. Owner BCBA for final clinical responsibility and payer/state sign-off.
2. BCBA B for clinical QA and supervision where licensed/credentialed and allowed.
3. BCaBA/licensed assistant behavior analyst where the state and payer allow it.
4. Senior RBT or lead technician for non-clinical coordination.
5. India RCM team for billing, claim calls, denials, eligibility, and reporting.
6. Software automation for alerts, queues, reminders, and audit trails.

## Can a Learner BCBA Increase the Number of Clients?

### Yes, but only indirectly

A learner BCBA can help with:

- Data graphing and trend summaries.
- Drafting treatment-plan updates for BCBA review.
- Preparing caregiver-training materials.
- Reviewing session-note completeness.
- Preparing supervision packets.
- Observing sessions and flagging issues.
- Organizing assessment materials.
- Tracking authorization usage.
- Drafting non-final clinical summaries.

### No, not as an independent BCBA

A learner BCBA should not be counted as an independent BCBA unless they are fully credentialed, licensed where required, payer-approved where required, and legally allowed to perform the assigned function.

Do not use a learner BCBA to:

- Independently design treatment plans.
- Independently supervise RBTs if not authorized.
- Sign clinical documents as the responsible BCBA.
- Make medical-necessity decisions for payer submissions.
- Replace the owner BCBA in high-risk cases.
- Increase caseload without additional supervision time.

## Better Capacity Options

| Option | Helps Capacity? | Conditions |
| --- | --- | --- |
| Learner BCBA/trainee | Moderate | Good for preparation and QA; does not remove owner responsibility |
| BCaBA/licensed assistant behavior analyst | High | Useful if state and payer allow supervision/delegated duties |
| Second experienced BCBA | Highest | Best option, but hard to hire |
| Remote BCBA B clinical QA | Moderate to high | Must be licensed/allowed in the relevant state if providing regulated services |
| Senior RBT/lead RBT | Moderate | Helps scheduling, materials, and communication; not a clinical decision-maker |
| India RCM/admin team | High admin relief | Helps billing and claims, not clinical capacity |
| AI video alerts | Moderate safety visibility | Alerts humans; does not replace supervision responsibility |

## Practical Caseload Recommendation

For one owner BCBA across four states:

- Start with 4 clients: one per state.
- Move to 5-8 clients only after claims are paid and supervision workflows are stable.
- Move to 8-12 clients only with a trained RBT team, India RCM support, BCBA B QA, and clean payer workflows.
- Treat 12-15 clients as a high-risk ceiling.
- Do not exceed 15 without another fully qualified BCBA or a legally valid assistant-supervisor layer.

## App Readiness for Multiple BCBAs, RBTs, and States

### What the app already supports partially

The app has useful foundations:

- Organization-based data model in several APIs.
- Better Auth organization support.
- Patient records.
- Assigned therapist fields.
- Session therapist IDs.
- Goals, assessments, schedules, parent portal, and reports.
- Operations dashboard UI.
- Basic billing/invoice types.

### What has been improved now

The app now has code-level foundations for:

- Provider profiles for owner BCBA, BCBA, BCaBA, learner BCBA, RBT, admin, and RCM users.
- State license tracking.
- Payer credentialing tracking by provider/state/payer.
- Prior authorization tracking by patient, payer, CPT, units, and dates.
- Insurance claim lifecycle records.
- Claim event and payer-call log structure.
- RBT supervision logs.
- HIPAA audit logs.
- India RCM restricted-access records.
- AI video-alert records.
- Rule-based AI triage recommendations for credentialing, authorization, claims, supervision, HIPAA access, and video alerts.

### What is not production-ready yet

The app is still not fully ready for real multi-BCBA, multi-RBT, multi-state operations until these are built:

| Requirement | Current Readiness | Needed Before Production |
| --- | --- | --- |
| Multiple organizations/tenants | Partial | Tenant isolation testing and admin controls |
| Multiple BCBAs | Improved foundation | Provider CRUD screens, license evidence upload, payer credentialing workflow, role permissions |
| Multiple RBTs | Improved foundation | RBT CRUD screens, supervision data entry, competency status, assignment rules |
| Multiple states | Improved foundation | State rules table, payer enrollment workflow by state |
| Claims management | Improved foundation | Claim APIs, denial queue, ERA/EFT reconciliation |
| Prior authorizations | Improved foundation | Auth CRUD screens, utilization alerts, claim-hold logic |
| HIPAA audit logs | Improved foundation | Real logging middleware and access-review UI |
| India RCM restricted portal | Improved foundation | Minimum-necessary claim-only workspace and enforced RBAC |
| AI video monitoring | Improved foundation | Consent workflow, BAA vendor integration, alert persistence, human-review closure |
| Payroll | Not complete | Payroll export/integration by state |

## Minimum Build Before Real Use

Build these before relying on the app for real operations:

1. Provider profile table: BCBA, BCaBA, RBT, learner, admin, RCM.
2. State license table: state, license number, expiration, status.
3. Payer credentialing table: payer, state, provider, effective date.
4. Authorization table: client, payer, CPT, units, dates, remaining units.
5. Claims table: dates, CPT, units, status, denial reason, paid amount.
6. Claim call log table: reference number, payer rep, next action.
7. RBT supervision table: hours, observation, supervisor, month, compliance status.
8. AI video alert table: severity, clip reference, human review, resolution.
9. HIPAA audit table: user, patient, action, timestamp, IP/device.
10. Vendor BAA table: vendor, function, PHI access, BAA date, renewal.

Items 1-9 now have code-level schema foundations. They still need migrations, APIs, screens, permissions, and real data workflows before production use.

## Recommended Staffing Model

### First 4 clients

- Owner BCBA: final clinical authority.
- BCBA B: weekly QA and documentation review.
- RBTs: one or more assigned by state/client need.
- India RCM: eligibility, claims, payer calls.
- Software Engineer A: dashboard, queues, access controls.

### 5-8 clients

Add:

- Lead RBT or operations coordinator.
- Learner BCBA for prep, data review, QA checklists.
- Formal weekly claims review.
- Formal weekly clinical-risk review.

### 8-12 clients

Add:

- BCaBA/licensed assistant behavior analyst if legal and payer-accepted.
- More RBTs with clear supervision assignments.
- Dedicated credentialing/RCM specialist.
- Stronger access logs and compliance review.

### Above 12 clients

Add:

- Another fully qualified BCBA or equivalent licensed supervisor.
- More formal compliance officer function.
- Separate clinical operations and billing operations leads.

## Bottom Line

A learner BCBA is useful but should be treated as support, not as a capacity multiplier by itself. The real capacity multiplier is a properly delegated system: qualified assistant/supervisor layer where legal, trained RBTs, India RCM for billing, strong software queues, and weekly owner BCBA oversight.

The app is promising and already has a strong base, but it is not yet production-ready for multi-state ABA billing and supervision. It needs the operational database, RBAC, audit logs, RBT supervision tracking, authorization/claim lifecycle, and HIPAA controls before it should be used as the main system of record.
