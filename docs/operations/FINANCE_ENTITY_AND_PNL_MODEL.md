# Finance, Entity, and P&L Model

Last updated: 2026-07-05

This memo gives a starting finance model for an ABA/autism center scaling from 10 to 15 clients across multiple states with one owner BCBA, RBTs, BCBA support, and India-based RCM/software support.

This is not tax, legal, or payer-contract advice. Use it as a planning model and replace assumptions with actual payer rates, wage rates, rent, payroll taxes, insurance, and denial rates.

## Are All Dashboards Implemented?

The app now has visual dashboard sections for:

- State launch gates.
- Credentialing and Medicaid readiness.
- Claims call queue.
- AI video safety alerts.
- Provider profiles.
- Authorization guard.
- HIPAA access review.
- RBT supervision monitor.
- AI operations triage.
- Document packet.
- Finance and P&L guardrail.

However, these are not yet all backed by live production CRUD workflows. The app has schema and UI foundations, but still needs APIs, database migrations, real forms, role-based access enforcement, clearinghouse/ERA integrations, payroll export, and live payer/claim data.

## US Company vs India Company

### Recommended at the beginning

Use a US healthcare/provider company as the operating entity and contract with Indian individuals or an Indian company for back-office work.

Reasons:

- Medicaid/commercial payer enrollment is tied to the US provider/entity.
- Clinical services are delivered under US state rules.
- Payroll, workers' comp, liability, licensure, and payer contracts are US-centered.
- For 10-15 clients, creating and maintaining an India company usually adds overhead before it creates enough savings.

### India contractor model

Use India contractors or an India vendor for:

- Eligibility checks.
- Authorization follow-up.
- Claim status calls.
- Denial queue management.
- ERA/EFT matching support.
- Reporting.
- Software support.

Required controls:

- Business Associate Agreement or subcontractor BAA where PHI is involved.
- Confidentiality agreement.
- Minimum-necessary access.
- MFA.
- Audit logs.
- No personal email/WhatsApp for PHI.
- No clinical decision-making.
- No unsupervised video access unless specifically approved.

### When to consider an India company

Consider an India company or subsidiary only when:

- You have stable monthly revenue.
- You need multiple full-time India staff.
- You are selling software or RCM services to other companies.
- You can afford India accounting, tax, HR, compliance, and management overhead.
- Your US attorney/CPA and India accountant agree on structure.

For 10-15 clients, contractor/vendor is usually simpler.

## Planning Assumptions

There are now two models. The first is the old conservative center-style model. The second is the software-style operating model you described: high parent/RBT management, high attendance, full authorized-hour utilization, and India back-office support used to reduce admin cost and prevent lost revenue.

| Assumption | Conservative Center-Style | Software-Style High Utilization |
| --- | ---: | ---: |
| Direct RBT/therapy hours/client/week | 15 | 25 |
| BCBA protocol/supervision hours/client/week | 2 | 3 for 10 clients; about 2.27 for 15 clients |
| Collected direct therapy rate/hour | $50 | $70 |
| Collected BCBA rate/hour | $110 | $140 |
| Collection rate after denials/adjustments | 92% | 94% |
| RBT wage/hour | $28 | $28 |
| Loaded payroll multiplier | 1.18 | 1.18 |
| BCBA support cost/hour | $65 | $65 |
| ABA software/internal platform cost/client/month | $80 | $80 |
| Multi-state payroll software | $80/month + $12/person | $80/month + $12/person |
| Credentialing amortized cost | $1,200-$1,500/month | $1,200-$1,500/month |
| US RCM outsourced cost | 6% of collections | 6% of collections |
| India contractor RCM/software cost | $1,150/month for 10 clients; $1,800/month for 15 clients |
| India company overhead | about $3,200/month for 10 clients; $4,000/month for 15 clients |

The India contractor cost was corrected downward. The earlier model treated offshore support too close to US RCM cost. A lean India admin/software team should cost less, but must still have HIPAA, BAA, MFA, audit logs, and minimum-necessary access controls.

## Monthly P&L Estimate

| Model | Clients | Back Office | Collected Revenue | RCM/Admin | Total Cost | Profit Before Owner Tax | Margin | Savings vs US RCM |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Conservative | 10 | US outsourced RCM | ~$38,641 | ~$2,318 | ~$37,043 | ~$1,598 | ~4% | baseline |
| Conservative | 10 | India contractor | ~$38,641 | ~$1,150 | ~$35,874 | ~$2,766 | ~7% | ~$1,168/month |
| Conservative | 10 | India company | ~$38,641 | ~$3,200 | ~$37,924 | ~$716 | ~2% | costs ~$882/month more |
| Conservative | 15 | US outsourced RCM | ~$57,961 | ~$3,478 | ~$54,906 | ~$3,055 | ~5% | baseline |
| Conservative | 15 | India contractor | ~$57,961 | ~$1,800 | ~$53,229 | ~$4,733 | ~8% | ~$1,678/month |
| Conservative | 15 | India company | ~$57,961 | ~$4,000 | ~$55,429 | ~$2,533 | ~4% | costs ~$522/month more |
| Software-style high utilization | 10 | US outsourced RCM | ~$88,323 | ~$5,299 | ~$55,945 | ~$32,379 | ~37% | baseline |
| Software-style high utilization | 10 | India contractor | ~$88,323 | ~$1,150 | ~$51,795 | ~$36,528 | ~41% | ~$4,149/month |
| Software-style high utilization | 10 | India company | ~$88,323 | ~$3,200 | ~$53,845 | ~$34,478 | ~39% | ~$2,099/month |
| Software-style high utilization | 15 | US outsourced RCM | ~$126,217 | ~$7,573 | ~$79,587 | ~$46,630 | ~37% | baseline |
| Software-style high utilization | 15 | India contractor | ~$126,217 | ~$1,800 | ~$73,814 | ~$52,403 | ~42% | ~$5,773/month |
| Software-style high utilization | 15 | India company | ~$126,217 | ~$4,000 | ~$76,014 | ~$50,203 | ~40% | ~$3,573/month |

Interpretation:

- At Medicaid-heavy rates and low utilization, 10-15 clients can still be thin-margin.
- If you can reliably deliver 25 direct RBT/therapy hours/client/week, keep attendance high, supervise RBTs tightly, train parents, and collect clean claims, the economics change significantly.
- India contractor support saves direct admin cost and also protects revenue by preventing missed auths, rejected claims, delayed follow-up, and avoidable no-shows.
- An India company can save money in the high-utilization model, but it still adds management, tax, accounting, HR, and compliance complexity. Contractor/vendor remains simpler until there is stable volume or outside software/RCM revenue.
- Profit improves only if authorization utilization is high, claims are clean, RBT scheduling is efficient, and rent/admin are controlled.

## Time-Zone Advantage

The four-state schedule should be treated like a software operations queue, not a traditional single-location clinic.

| Location | Current Summer Time Zone | India Offset | Operating Use |
| --- | --- | --- | --- |
| Connecticut | Eastern Daylight Time | India is 9.5 hours ahead | Earliest US block; India can finish claim checks before CT morning. |
| North Dakota | Mostly Central Daylight Time; some Mountain Time areas | India is usually 10.5-11.5 hours ahead | Midday block for payer calls and parent/RBT follow-up. |
| Missouri | Central Daylight Time | India is 10.5 hours ahead | Pairs with ND for central scheduling and evening parent training. |
| Washington | Pacific Daylight Time | India is 12.5 hours ahead | Latest US block; India can prepare queues overnight before WA morning. |
| India | India Standard Time | Ahead of all active US states | Overnight eligibility, auth packets, claim scrubbing, denial packets, dashboards, and software support. |

This is a real advantage if the app runs queues by time zone: CT first, ND/MO middle, WA last, and India overnight.

## High-Hour Intake and Dual Billing Rule

For ABA staffing economics, low-hour cases can be operationally expensive even if the clinical work is appropriate. The preferred business model is:

- Take clients who clinically need and are authorized for about 40 direct RBT/therapy hours/week.
- Operationally target at least 30 delivered direct RBT/therapy hours/week.
- Avoid clients below about 20 hours/week unless there is a specific strategic or clinical reason.
- Keep RBT direct-service billing separate from BCBA supervision/protocol/parent-training billing.
- Plan each full-time RBT as 40 paid hours/week with about 30 billable hours/week.
- Plan the owner BCBA as 40 working hours/week with a mature target of about 30 billable hours/week.

This improves retention because the RBT has a stable paycheck, the client has consistent staffing, and the BCBA is managing quality rather than constantly repairing schedule failure.

## What to Charge for the Software Later

Do not sell the software broadly until your own workflow works. Once stable, possible pricing:

| Model | Possible Price | Notes |
| --- | ---: | --- |
| Internal cost tracking | $50-$150/client/month | Use for your own P&L until product is mature. |
| Small clinic SaaS | $99-$299/provider/month | For scheduling, auth, supervision, and claims dashboard. |
| Per-client SaaS | $20-$80/client/month | Easier for small ABA clinics to understand. |
| RCM plus software | 3%-6% of collections | Only if you provide billing operations, not just software. |
| Enterprise/white-label | Custom | Requires security, support, BAA, onboarding, and compliance maturity. |

## Key Financial Controls From Day One

Track weekly:

- Authorized units remaining.
- Scheduled units.
- Completed units.
- Notes signed.
- Claims released.
- Claims rejected.
- Claims denied.
- Claims unpaid over 14/30/45 days.
- EFT deposits received.
- ERA posted.
- RBT hours paid vs units billed.
- BCBA hours paid vs units billed.
- Payroll taxes and workers' comp.
- Software cost per client.
- India RCM cost per claim and per dollar collected.

## Expansion Rule

Do not expand from 10 to 15 clients unless:

- Collection rate is above 90%.
- Denial rate is below 8%.
- Claims over 30 days are actively managed.
- RBT supervision is compliant.
- Owner BCBA is not spending most of the week on billing/admin.
- There is at least 2 months of operating cash reserve.
- Every active state has payer effective dates and authorization controls.

## Bottom Line

For 10-15 clients, keep the US entity as the healthcare provider and use India contractors/vendor support under strict HIPAA/BAA controls. Do not create an India company yet unless software/RCM will become a separate commercial business. The app now includes a finance dashboard, but actual profitability depends on real payer rates, authorization utilization, staff scheduling, denial control, and rent/admin discipline.

Important clarification: the 15 or 25 hours/client/week assumptions are direct RBT/therapy hours, not BCBA hours. BCBA time is modeled separately as supervision, protocol modification, assessment, treatment planning, and parent training, commonly around 2-3 hours/client/week when clinically appropriate and authorized.
