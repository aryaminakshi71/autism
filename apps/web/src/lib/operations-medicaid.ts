export type MedicaidStateCode = "WA" | "ND" | "CT" | "MO";

export interface MedicaidRequirementSnapshot {
  state: MedicaidStateCode;
  program: string;
  providerPath: string;
  authorizationRule: string;
  documentationRule: string;
  directTherapyRule: string;
  bcbaSupervisionRule: string;
  supervisionRule: string;
  billingRisk: string;
  source: string;
  status: "verify_before_billing";
}

export const medicaidRequirementSnapshots: MedicaidRequirementSnapshot[] = [
  {
    state: "WA",
    program: "Washington Apple Health ABA",
    providerPath:
      "Apple Health provider enrollment, ProviderOne access, ABA billing guide, and applicable MCO workflow.",
    authorizationRule:
      "Confirm Apple Health/MCO authorization, covered CPT/modifiers, provider enrollment, and effective dates before service.",
    documentationRule:
      "Maintain treatment plan, session notes, provider credentials, authorization number, and claim-supporting records.",
    directTherapyRule:
      "Direct ABA/CBT hours are authorized by program and treatment plan. Washington day-treatment guidance references 12-15 program hours/week for that specific model, not 15 BCBA hours.",
    bcbaSupervisionRule:
      "LBAT must supervise CBTs at least 5% of therapy/direct-care hours per week per child. Example: 25 direct hours/week needs at least 1.25 LBAT/BCBA supervision hours, plus parent training/treatment-plan work as required.",
    supervisionRule:
      "RBT/technician oversight must satisfy BACB, state license, payer, and treatment-plan requirements. Parent/caregiver training is also expected in the treatment plan.",
    billingRisk:
      "Do not rely on a managed care contract alone; verify ProviderOne and plan-specific ABA billing rules.",
    source:
      "Washington HCA Apple Health ABA billing guide and provider ABA page",
    status: "verify_before_billing",
  },
  {
    state: "ND",
    program: "North Dakota Medicaid Autism ABA",
    providerPath:
      "ND Medicaid provider enrollment, ASD/ABA service request process, and portal access.",
    authorizationRule:
      "ND Medicaid uses an ABA service request/documentation process; verify approval before scheduling recurring hours.",
    documentationRule:
      "Keep diagnostic support, request packet, treatment plan, service logs, and documentation required by ND Medicaid policy.",
    directTherapyRule:
      "Requested Autism ABA hours must be listed by week and service code with justification; the policy notes the majority requested may be provided by an RBT.",
    bcbaSupervisionRule:
      "No fixed weekly BCBA-hour number was found in the policy snapshot. Use authorized service-code units, treatment-plan need, state licensure, payer rules, and BACB RBT supervision minimums.",
    supervisionRule:
      "BCBA/state-licensed qualified professional oversight and RBT supervision must be documented.",
    billingRisk:
      "Small-state payer workflows can be manual; track every request, approval, and claim reference number.",
    source:
      "North Dakota Medicaid Autism ABA service policy and fee schedule/provider resources",
    status: "verify_before_billing",
  },
  {
    state: "CT",
    program: "Connecticut HUSKY / CMAP ASD services",
    providerPath:
      "CMAP/Gainwell enrollment plus HUSKY/ASD State Plan provider workflow.",
    authorizationRule:
      "Verify HUSKY ASD eligibility, under-21 criteria where applicable, diagnostic evaluation, and authorization pathway.",
    documentationRule:
      "Maintain diagnostic evaluation, ASD treatment plan, BCBA/QHP documentation, parent-training records, and CMAP claim support.",
    directTherapyRule:
      "ASD treatment intervention hours are authorized from the diagnostic evaluation, behavior assessment, and plan of care. They are not a blanket BCBA-hours requirement.",
    bcbaSupervisionRule:
      "CT ASD policy states 1 hour of direct supervision for every 10 hours of treatment services, documented weekly. Example: 25 direct hours/week needs about 2.5 supervision hours/week.",
    supervisionRule:
      "Qualified healthcare professional/BCBA requirements vary by service; do not let RBTs deliver services outside approved scope.",
    billingRisk:
      "CT workflows can involve CMAP, ASO, and service-specific rules; verify the exact route before intake.",
    source:
      "CT HUSKY Health ASD provider resources and CTDSSMAP provider portal",
    status: "verify_before_billing",
  },
  {
    state: "MO",
    program: "Missouri MO HealthNet ABA",
    providerPath:
      "MO HealthNet provider enrollment and managed care plan contract/portal when the member is in managed care.",
    authorizationRule:
      "ABA must be medically necessary, precertified where required, and delivered under the treatment plan.",
    documentationRule:
      "MO HealthNet documentation must be timely and adequate; current state guidance flags five business days for ABA documentation timeliness.",
    directTherapyRule:
      "ABA services must be medically necessary, precertified where required, and delivered according to the treatment plan. Technician services are paid to the supervising/employing LBA or LP.",
    bcbaSupervisionRule:
      "No fixed weekly BCBA-hour number was found in the rule snapshot. The supervisory relationship must be documented, technicians must meet credentialing rules, and documentation must support billed services.",
    supervisionRule:
      "ABA technicians must meet credentialing/supervision requirements, and the supervisory relationship must be documented.",
    billingRisk:
      "Missouri managed care and fee-for-service paths differ; track plan, auth, modifier, and documentation deadline.",
    source:
      "MO HealthNet ABA rule, provider resources, and ABA documentation guidance",
    status: "verify_before_billing",
  },
];
