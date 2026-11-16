# BCBA Capacity and Delegation Model

Last updated: 2026-07-05

This model is for one primary BCBA opening operations in Washington, North Dakota, Connecticut, and Missouri with delegated India RCM/software support and clinical QA support from BCBA B.

## Practical Capacity Estimate

| Stage | Client Count | Risk Level | Conditions |
| --- | ---: | --- | --- |
| Launch | 1-4 | Low to moderate | One client per state, no complex staffing, manual review possible |
| Controlled growth | 5-8 | Moderate | RBTs trained, auth/claims dashboard working, BCBA B reviews QA |
| Upper routine range | 8-12 | Moderate | Strong RBT team, clean payer workflows, admin/RCM support, stable clients, high attendance |
| High-utilization range | 12-15 | Moderate to high | Possible when 25 authorized hours/client/week are actually delivered and RBT/parent systems are strong |
| Not recommended | 16+ | Very high | Requires additional BCBA or clinical supervisor layer |

## 40-Hour Owner BCBA Week

If the owner BCBA works 40 hours/week and billing, claim calls, software, and routine paperwork are delegated, the full 40 hours still should not be assumed to be billable. A practical split is:

| Use of Owner BCBA Time | Conservative | Aggressive |
| --- | ---: | ---: |
| Billable supervision/protocol modification/parent training | 24-30 hrs/week | 32-34 hrs/week |
| Non-billable clinical review, crises, reauth, audits, staff coaching | 8-12 hrs/week | 4-6 hrs/week |
| Business/admin oversight that cannot be delegated fully | 2-6 hrs/week | 1-3 hrs/week |

The aggressive model is only reasonable when RBTs are stable, authorizations are clean, session notes are timely, parents attend consistently, and claim denials are low.

This model should not assume the weak operations seen in many private-equity style ABA companies. If the BCBA actively manages parent expectations, RBT performance, schedule adherence, data quality, and parent training, 25 hours/client/week can be realistic for appropriate clients with valid authorization. The app should therefore track attendance as an operations performance metric, not as an unavoidable loss.

## Capacity Scenarios With Delegated Admin

| Scenario | Clients | Direct RBT Hrs/Wk | Minimum RBT Supervision Hrs/Wk | Planned BCBA Billable Hrs/Wk | Delegated Admin Hrs/Wk | Owner Non-Billable Hrs/Wk | Risk |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 10 clients, Medicaid-heavy | 10 | 200 | 10.0 | 26 | 12 | 14 | Moderate |
| 10 clients, mixed payer | 10 | 250 | 12.5 | 30 | 16 | 10 | Moderate |
| 15 clients, tight but possible | 15 | 300 | 15.0 | 34 | 20 | 6 | Moderate-high |
| 15 clients, overextended | 15 | 375 | 18.8 | 38 | 22 | 2 | High |

The BACB RBT supervision floor is not the whole clinical workload. It is a minimum supervision requirement. The BCBA also needs time for assessment, treatment-plan changes, caregiver work, reauthorization, incident review, staff retraining, and payer documentation.

## Direct Therapy Versus BCBA Time

The client-hour assumptions must stay separated:

- Direct RBT/therapy hours/client/week: the authorized treatment hours delivered by an RBT/technician or other allowed provider under the treatment plan.
- BCBA/LBAT/LBA hours/client/week: supervision, protocol modification, assessment, parent training, treatment planning, and clinical oversight.

The app should not interpret 15 or 25 direct therapy hours as BCBA hours. A more realistic BCBA planning range is 2-3 hours/client/week, adjusted by state Medicaid rule, payer authorization, acuity, RBT competence, caregiver needs, and documentation requirements.

| State | Medicaid Supervision Planning Note |
| --- | --- |
| WA | Washington Apple Health guidance references at least 5% LBAT supervision of CBT therapy/direct-care hours per week per child. |
| ND | ND policy requires hours by week/service code with justification and notes majority requested may be RBT-provided; no fixed weekly BCBA-hour number was found in the policy snapshot. |
| CT | CT ASD policy states 1 hour of supervision per 10 treatment hours, documented weekly. |
| MO | MO HealthNet requires services be medically necessary/precertified and technician services paid to the supervising/employing LBA/LP; no fixed weekly BCBA-hour number was found in the rule snapshot. |

## Time-Zone Advantage

The four states are not only a burden. They also create a staggered operating day:

| Block | State/Team | Operational Use |
| --- | --- | --- |
| Earliest US block | Connecticut | Start clinical review, parent/RBT follow-up, and payer items earlier in the US day. |
| Middle US block | North Dakota and Missouri | Combine central-time scheduling, payer calls, documentation QA, and parent training. |
| Latest US block | Washington | Use as the late-day clinical window after eastern/central tasks are completed. |
| Overnight/pre-US block | India | Prepare eligibility checks, auth packets, claim scrubbing, denial queues, dashboards, and software fixes before US morning. |

This supports a software-company operating rhythm: queues, service-level agreements, handoffs, dashboards, and exception management. The owner BCBA should work on clinical exceptions and supervision quality, not routine claim chasing.

## Why Four States Reduce Capacity

Four states add:

- Separate licenses and rules.
- Separate Medicaid enrollments.
- Separate payer portals.
- Separate documentation and auth rules.
- Multi-state payroll.
- More calendar fragmentation.
- More supervision tracking burden.
- More denial and compliance risk.

AI and dashboards increase visibility but do not remove BCBA responsibility.

## Delegation Model

| Workstream | Can Delegate To | Owner Still Responsible |
| --- | --- | --- |
| Eligibility and benefits | India RCM | Owner/admin |
| Claim status calls | India RCM | Owner/admin |
| Denial categorization | India RCM | Owner/admin |
| Clinical documentation quality | BCBA B | Owner BCBA |
| Treatment plans | BCBA B for review; Owner for approval | Owner BCBA |
| RBT supervision | BCBA B where licensed/allowed; Owner for final oversight | Owner BCBA |
| AI alert triage | RBT/BCBA B initial review | Owner BCBA for high-risk |
| Payroll processing | Payroll provider/bookkeeper | Owner/CPA |
| Software maintenance | Software Engineer A | Owner/security lead |

## Red Flags That Require Slowing Growth

- Claims unpaid over 45 days.
- Denial rate above 8-10%.
- More than 10% of sessions missing timely notes.
- RBT supervision logs incomplete.
- High-risk AI alerts not reviewed same day.
- Parent complaints rising.
- BCBA working mostly on billing/admin instead of clinical oversight.
- More than one state blocked or not fully credentialed.
- No weekly dashboard review.

## Recommended Starting Rule

Do not exceed 8 active clients until:

- All four state launch checklists are green or the inactive states are paused.
- Claims have been paid at least once in each active payer.
- RBT supervision audit passes for two consecutive months.
- India RCM call logs are complete and accurate.
- HIPAA access review has been completed.
- BCBA B responsibilities are written and signed.

After those controls are stable, 10 clients can be reasonable for one owner BCBA with strong delegation. Fifteen clients can be workable if the model resembles a high-discipline software operations system: full auth utilization, consistent attendance, RBT accountability, parent training, clean claims, and India back-office handoff. If those controls weaken, 15 clients becomes a ceiling rather than a stable operating level.
