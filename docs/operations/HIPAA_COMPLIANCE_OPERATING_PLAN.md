# HIPAA Compliance Operating Plan

Last updated: 2026-07-05

This plan covers the autism center software, India RCM/support operation, video monitoring, AI alerts, billing, and clinical documentation workflows.

## Source Basis

HHS states that the HIPAA Security Rule requires regulated entities to use reasonable and appropriate administrative, physical, and technical safeguards for ePHI. HHS also states that covered entities and business associates generally need contracts with business associates that handle PHI, and that subcontractors can also be business associates.

Key references:

- HHS Security Rule: https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html
- HHS Business Associate Contracts: https://www.hhs.gov/hipaa/for-professionals/covered-entities/sample-business-associate-agreement-provisions/index.html
- HHS Risk Analysis Guidance: https://www.hhs.gov/hipaa/for-professionals/security/guidance/guidance-risk-analysis/index.html
- HHS Breach Notification: https://www.hhs.gov/hipaa/for-professionals/breach-notification/index.html
- HHS Telehealth and Remote Communication Guidance: https://www.hhs.gov/hipaa/for-professionals/special-topics/telehealth/index.html

## Compliance Scope

Systems and workflows in scope:

- Patient intake and demographics.
- Diagnosis, assessment, treatment plans, session notes, goals, behavior data.
- Video monitoring feeds, video clips, AI alert metadata, incident logs.
- Insurance eligibility, authorization, claims, payer calls, ERA/EFT reconciliation.
- Staff records relevant to service delivery and supervision.
- Parent portal messages and documents.
- India RCM/software access to any PHI or ePHI.

## Administrative Safeguards

Required operating documents:

- HIPAA risk analysis and annual update.
- Workforce HIPAA training log.
- Role-based access policy.
- Sanction policy for misuse of PHI.
- Incident response and breach assessment plan.
- Vendor and BAA register.
- Offshore access approval register.
- Data retention and deletion policy.
- Device and remote access policy.
- Backup and disaster recovery policy.

Minimum workflow:

1. Identify where PHI is created, received, maintained, or transmitted.
2. List all users and vendors with access.
3. Assign each user the minimum role needed.
4. Require MFA for all privileged, RCM, developer, and clinical users.
5. Review access monthly while the company is small.
6. Review audit logs weekly for unusual access.
7. Document every incident, even if it is not ultimately a breach.

## Physical Safeguards

Clinic requirements:

- Lock clinical files and devices.
- Prevent unattended screens in therapy rooms and reception.
- Use privacy screens where billing or PHI is visible.
- Restrict video monitoring screens to authorized staff.
- Keep visitor logs for non-public clinic areas.

India/offshore requirements:

- No PHI work from public Wi-Fi or shared public computers.
- Company-managed devices preferred.
- Full-disk encryption required.
- Screen lock required.
- No local PHI downloads unless explicitly approved.
- No printing PHI offshore unless specifically approved and logged.

## Technical Safeguards

Baseline controls:

- Unique user IDs.
- MFA.
- Role-based access control.
- Audit logs for view, create, update, delete, export, video access, and claim access.
- Encryption in transit.
- Encryption at rest.
- Time-limited sessions.
- Secure password policy or SSO.
- Backups and restore testing.
- Production/test data separation.
- No real PHI in local developer environments unless approved and encrypted.
- Error monitoring must not capture PHI in logs.

## AI and Video Controls

AI video monitoring must be treated as high-risk PHI processing.

Rules:

- Obtain parent/guardian consent before video monitoring.
- Explain what is monitored, what is stored, who reviews it, and how long it is retained.
- AI cannot make clinical or emergency decisions alone.
- AI alerts must create a human review task.
- High-risk alerts require RBT confirmation and BCBA review.
- Do not use vendor AI tools unless a BAA is in place and data retention/training settings are controlled.
- Disable model training on PHI unless specifically approved by legal and the family consent covers it.

## Offshore Access Model

India staff may support:

- Eligibility verification.
- Authorization status checks.
- Claim status follow-up.
- Denial categorization.
- ERA/EFT matching.
- Software support and reporting.

India staff must not:

- Change treatment plans.
- Give clinical guidance to RBTs or families.
- Access video unless specifically authorized.
- Download bulk patient records.
- Use PHI in personal email, WhatsApp, consumer messaging, or non-approved tools.
- Copy PHI into AI tools without BAA and explicit approval.

## Breach and Incident Response

Incident examples:

- Wrong patient document sent.
- Unauthorized access.
- Lost/stolen device.
- Video clip shared outside approved platform.
- PHI copied into non-approved AI tool.
- RCM staff accessed records outside assigned queue.
- Vendor security incident.

Response:

1. Contain the issue immediately.
2. Preserve evidence.
3. Disable affected access if needed.
4. Notify owner BCBA and security owner.
5. Start breach risk assessment.
6. Determine whether notification is required.
7. Document decision and corrective action.

Attorney review is required before final breach notification decisions.

