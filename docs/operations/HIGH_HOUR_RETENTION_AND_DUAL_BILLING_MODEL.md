# High-Hour Retention and Dual Billing Model

Last updated: 2026-07-05

This model is for running the ABA operation like a software operations company: stable queues, high utilization, clear staffing math, and separate billing tracks for RBT direct therapy and BCBA clinical work.

## Operating Rule

Do not build the business around low-hour ABA cases when the RBT cannot earn a stable paycheck.

Preferred intake rule:

- Accept clients who clinically need and are authorized for about 40 direct therapy hours/week.
- Operational target is at least 30 delivered direct RBT/therapy hours/week.
- Avoid taking clients below about 20 hours/week unless there is a specific strategic or clinical reason.
- Pair high-hour clients with stable RBT schedules so the RBT can work near 40 paid hours/week.
- Keep BCBA billing separate from RBT billing.

The reason is retention. A low-hour case may look easy, but it often fails both sides:

- RBT does not earn enough monthly income.
- RBT leaves or takes other cases.
- Client loses consistency.
- Parent loses trust.
- BCBA spends more time repairing staffing failures.

## Two Separate Billing Tracks

| Billing Track | Typical Work | Staff | Planning Target |
| --- | --- | --- | --- |
| RBT/direct therapy billing | Direct ABA implementation, data collection, protocol delivery | RBT/technician or other allowed provider | 30 billable hours out of a 40-hour workweek |
| BCBA billing | Supervision, protocol modification, assessment, treatment planning, parent training | BCBA/LBAT/LBA or other qualified provider | 30 billable hours out of a 40-hour workweek at mature volume |

These must not be mixed. Direct therapy hours are not BCBA hours. BCBA hours should be separately authorized, documented, billed, and monitored.

## Staffing Math

| Scenario | Clients | Authorized Direct Hrs/Client/Wk | Delivered Direct Hrs/Client/Wk | RBT Paid Hrs/Wk | RBT Billable Hrs/Wk | RBT Utilization | BCBA Paid Hrs/Wk | BCBA Billable Hrs/Wk | BCBA Utilization | RBT Billing/Mo | BCBA Billing/Mo | Clinical Margin Before Overhead |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Reject low-hour case | 1 | 15 | 15 | 20 | 15 | 75% | 40 | 2 | 5% | ~$4,222 | ~$1,169 | ~$2,530 |
| One high-hour client | 1 | 40 | 30 | 40 | 30 | 75% | 40 | 3 | 8% | ~$9,093 | ~$1,819 | ~$5,189 |
| Four launch clients | 4 | 40 | 30 | 160 | 120 | 75% | 40 | 12 | 30% | ~$36,372 | ~$7,274 | ~$20,756 |
| Ten-client software-style panel | 10 | 40 | 30 | 400 | 300 | 75% | 40 | 30 | 75% | ~$90,930 | ~$18,186 | ~$51,891 |

Assumptions:

- RBT billing rate used for planning: $70/hour.
- BCBA billing rate used for planning: $140/hour.
- RBT wage used for planning: $28/hour.
- RBT loaded payroll multiplier: 1.18.
- Month: 4.33 weeks.
- Clinical margin before overhead excludes rent, insurance, software, RCM/admin, credentialing, taxes, and owner draw.

## Why 40 Authorized Hours Matter

A 40-authorized-hour client does not mean every week will produce 40 billable hours. The operating target is to protect at least 30 billable hours.

This gives:

- RBT enough hours to stay.
- Client enough consistency to progress.
- Parent a predictable schedule.
- BCBA enough supervision visibility.
- Billing enough volume to support payroll.

The software should flag any client whose delivered direct hours drop below the minimum threshold.

## Dashboard Rules To Implement

Track separately:

- RBT authorized hours.
- RBT scheduled hours.
- RBT delivered hours.
- RBT paid hours.
- RBT billable hours.
- RBT utilization.
- BCBA authorized hours.
- BCBA scheduled hours.
- BCBA delivered hours.
- BCBA billable hours.
- Parent cancellations.
- Staff cancellations.
- Make-up hours offered and completed.
- Claim release status for RBT service.
- Claim release status for BCBA service.

## Retention Guardrails

Pause accepting a new client if:

- There is no RBT available for at least 30 delivered hours/week.
- The payer authorizes fewer hours than needed for a stable staffing plan.
- Parent cannot commit to the schedule.
- Delivered hours fall below 75% of paid RBT hours for two consecutive weeks.
- BCBA billable capacity exceeds 30 hours/week without additional qualified support.

The goal is not maximum client count. The goal is maximum stable utilization with clean documentation, clean claims, and retained staff.
