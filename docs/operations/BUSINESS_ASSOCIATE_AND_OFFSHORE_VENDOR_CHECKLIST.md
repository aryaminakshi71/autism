# Business Associate and Offshore Vendor Checklist

Last updated: 2026-07-05

Use this before allowing any vendor, software company, billing company, India RCM team, AI vendor, video vendor, cloud provider, or subcontractor to access PHI.

## Vendor Register

| Vendor | Function | PHI Access | BAA Required | BAA Signed | Owner | Review Date |
| --- | --- | --- | --- | --- | --- | --- |
| India software/RCM company | Software support, billing ops | Yes | Yes | TODO | Owner | TODO |
| Video platform | Telehealth/video monitoring | Yes | Yes | TODO | Owner | TODO |
| EHR/database/cloud vendor | PHI storage | Yes | Yes | TODO | Software A | TODO |
| Clearinghouse | Claim submission | Yes | Yes | TODO | RCM | TODO |
| Payroll provider | Staff data; possible PHI if notes exposed | Usually no PHI | Review | TODO | CPA | TODO |

## BAA Must Cover

- Permitted uses and disclosures of PHI.
- Prohibition on unauthorized uses/disclosures.
- Safeguards for PHI/ePHI.
- Reporting of security incidents and breaches.
- Subcontractor BAA requirement.
- Return or destruction of PHI at termination.
- Access, amendment, accounting, and disclosure support where applicable.
- Audit/cooperation obligations.
- Indemnity and responsibility for vendor-caused breach costs, if negotiated.

## Offshore-Specific Controls

Before India access:

- BAA or subcontractor BAA signed.
- Workforce confidentiality agreements signed.
- HIPAA/security training completed.
- MFA enabled.
- Role-based access configured.
- Access limited to assigned queues.
- No bulk export permission unless necessary.
- No video access by default.
- No local PHI storage by default.
- Approved device and network requirements documented.
- Incident reporting channel active.

## Minimum Necessary Access Matrix

| Role | Allowed Access | Blocked Access |
| --- | --- | --- |
| India RCM caller | Payer, claim number, patient identifiers needed for call, authorization status, denial codes | Full treatment plan, behavior video, psychotherapy-style notes, unrelated clients |
| India payment poster | ERA, EFT, claim line, allowed/paid/write-off fields | Clinical notes and video |
| Software Engineer A | Production logs without PHI, schemas, de-identified test data, issue tickets | Real PHI unless break-glass approved |
| BCBA B | Clinical QA records for assigned cases | Billing bank details, payroll tax data |
| Owner BCBA | Full clinical oversight and final launch/risk decisions | None, but access must still be audited |

## Vendor Approval Decision

Approve only if:

- There is a signed BAA where PHI is involved.
- The vendor can explain access controls and audit logs.
- The vendor supports MFA.
- The vendor will not train AI models on PHI without approval.
- Data location, retention, and deletion are known.
- Breach reporting obligations are clear.
- Subcontractors are disclosed and controlled.

