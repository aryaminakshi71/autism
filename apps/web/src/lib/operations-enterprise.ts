export type EnterpriseStatus = "ready" | "watch" | "blocked";
export type PortalRole = "parent" | "rbt" | "bcba" | "admin";
export type TrainingAudience = "parent" | "rbt" | "bcba" | "admin";

export interface CompanyOperatingProfile {
  id: string;
  legalName: string;
  dbaName: string;
  entityType: string;
  headquartersState: string;
  activeStates: string[];
  expansionStates: string[];
  npiStatus: EnterpriseStatus;
  taxAndPayrollStatus: EnterpriseStatus;
  bankAndEftStatus: EnterpriseStatus;
  hipaaStatus: EnterpriseStatus;
  defaultOperatingBankStrategy: string;
  clinicalOwner: string;
  operationsOwner: string;
}

export interface CompanyStateConfiguration {
  state: string;
  centers: string[];
  activeClients: number;
  activeRbts: number;
  activeBcbas: number;
  payerCount: number;
  credentialingStatus: EnterpriseStatus;
  payrollRegistrationStatus: EnterpriseStatus;
  workersCompStatus: EnterpriseStatus;
  telehealthRuleStatus: EnterpriseStatus;
  claimReadinessStatus: EnterpriseStatus;
  nextAction: string;
}

export interface CompanyPayerConfiguration {
  state: string;
  payerName: string;
  payerType: string;
  credentialing: EnterpriseStatus;
  authTemplate: EnterpriseStatus;
  claimTemplate: EnterpriseStatus;
  eftEra: EnterpriseStatus;
  timelyFilingDays: number | null;
  nextAction: string;
}

export interface CompanySetupGate {
  domain: string;
  owner: string;
  status: EnterpriseStatus;
  requiredEvidence: string;
  blocks: string;
}

export interface CompanyRoleAccess {
  role: PortalRole | "owner" | "india_rcm";
  users: number;
  allowedStates: string;
  allowedData: string;
  blockedData: string;
  requiredControls: string[];
}

export type CompanyConfigurationDomain =
  | "company"
  | "state"
  | "payer"
  | "staff"
  | "client"
  | "portal"
  | "training"
  | "security"
  | "finance";

export interface CompanyConfigurationTask {
  id: string;
  domain: CompanyConfigurationDomain;
  title: string;
  owner: string;
  status: EnterpriseStatus;
  dueWindow: string;
  blocks: string[];
  evidence: string;
}

export interface CompanyLaunchPhase {
  phase: string;
  target: string;
  status: EnterpriseStatus;
  exitCriteria: string[];
}

export type RetentionRecordCategory =
  | "clinical"
  | "billing"
  | "hipaa"
  | "payroll"
  | "credentialing"
  | "training"
  | "video"
  | "corporate";

export interface RecordRetentionPolicy {
  id: string;
  category: RetentionRecordCategory;
  recordSet: string;
  appliesToStates: string[];
  retentionYears: number;
  retentionTrigger: string;
  authorityBasis: string;
  owner: string;
  storageSystem: string;
  destructionRule: string;
  status: EnterpriseStatus;
}

export interface RetentionInventoryItem {
  id: string;
  recordSet: string;
  state: string;
  clientOrOwner: string;
  periodEnd: string;
  retainUntil: string;
  legalHold: boolean;
  location: string;
  nextAction: string;
  status: EnterpriseStatus;
}

export interface IndiaCallCenterOperatingRule {
  domain: string;
  allowedWork: string[];
  blockedWork: string[];
  requiredControls: string[];
  escalationTrigger: string;
}

export interface IndiaCallCenterShift {
  shift: string;
  indiaTime: string;
  usCoverage: string;
  primaryWork: string;
  handoffRule: string;
}

export interface IndiaCallScript {
  id: string;
  callType: string;
  permittedPurpose: string;
  minimumNecessaryFields: string[];
  scriptOpening: string;
  requiredOutcomeFields: string[];
  escalationRule: string;
}

export interface IndiaCallCenterQaMetric {
  metric: string;
  target: string;
  evidence: string;
  status: EnterpriseStatus;
}

export interface UsCallingInfrastructureItem {
  domain: string;
  requirement: string;
  whyNeeded: string;
  implementation: string;
  status: EnterpriseStatus;
}

export interface UsCallingVendorReadiness {
  vendorType: string;
  requiredContract: string;
  mustSupport: string[];
  goLiveEvidence: string;
  status: EnterpriseStatus;
}

export interface OffshoreDeviceControl {
  control: string;
  requirement: string;
  enforcement: string;
  owner: string;
  status: EnterpriseStatus;
}

export interface CallRecordingConsentRule {
  callType: string;
  defaultPolicy: string;
  allowedWhen: string;
  storageRule: string;
  status: EnterpriseStatus;
}

export interface OffshoreEscalationRoute {
  trigger: string;
  indiaAction: string;
  usOwner: string;
  sla: string;
  status: EnterpriseStatus;
}

export interface AppImprovementRoadmapItem {
  area: string;
  improvement: string;
  whyItMatters: string;
  nextImplementation: string;
  status: EnterpriseStatus;
}

export interface StateExpansionReadiness {
  region: string;
  stateCount: number;
  readiness: EnterpriseStatus;
  requiredBeforeLaunch: string[];
  operatingRisk: string;
}

export interface AbaSoftwareFeatureGap {
  feature: string;
  marketExpectation: string;
  currentStatus: EnterpriseStatus;
  implementedNow: string;
  nextBuild: string;
}

export interface PortalExperience {
  role: PortalRole;
  dashboard: string;
  weeklySchedule: string[];
  moneyOrProgress: string[];
  requiredActions: string[];
  accessBoundary: string;
}

export interface TrainingModule {
  id: string;
  audience: TrainingAudience;
  title: string;
  minutes: number;
  required: boolean;
  competencyCheck: string;
  renewalCadence: string;
}

export interface ChildProgressSnapshot {
  child: string;
  state: string;
  goalsInTreatmentPlan: number;
  masteredGoals: number;
  improvingGoals: number;
  highPriorityBarriers: string[];
  homePractice: string[];
  parentTrainingDue: string;
}

const stateCodes = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
] as const;

export const supportedUsStates = [...stateCodes];

export const companyOperatingProfile: CompanyOperatingProfile = {
  id: "aba-launch-company",
  legalName: "ABA Multi-State Launch LLC",
  dbaName: "Launch ABA Care",
  entityType: "US healthcare provider entity",
  headquartersState: "WA",
  activeStates: ["WA", "ND", "CT", "MO"],
  expansionStates: ["TX", "FL", "GA", "AZ"],
  npiStatus: "watch",
  taxAndPayrollStatus: "watch",
  bankAndEftStatus: "watch",
  hipaaStatus: "blocked",
  defaultOperatingBankStrategy:
    "One US operating account with state, center, payer, client, and provider ledger classes until a payer/CPA requires a separate account.",
  clinicalOwner: "Owner BCBA",
  operationsOwner: "Software Engineer A / India RCM under BAA",
};

export const companyStateConfigurations: CompanyStateConfiguration[] = [
  {
    state: "WA",
    centers: ["WA Center"],
    activeClients: 1,
    activeRbts: 1,
    activeBcbas: 1,
    payerCount: 6,
    credentialingStatus: "watch",
    payrollRegistrationStatus: "ready",
    workersCompStatus: "watch",
    telehealthRuleStatus: "watch",
    claimReadinessStatus: "watch",
    nextAction:
      "Confirm Apple Health effective date and MCO billing path before expanding beyond one client.",
  },
  {
    state: "ND",
    centers: ["ND Center"],
    activeClients: 1,
    activeRbts: 1,
    activeBcbas: 1,
    payerCount: 2,
    credentialingStatus: "ready",
    payrollRegistrationStatus: "watch",
    workersCompStatus: "watch",
    telehealthRuleStatus: "blocked",
    claimReadinessStatus: "watch",
    nextAction:
      "Store ND Medicaid authorization, telehealth mode approval, and payment cycle evidence.",
  },
  {
    state: "CT",
    centers: ["CT Center"],
    activeClients: 1,
    activeRbts: 1,
    activeBcbas: 1,
    payerCount: 2,
    credentialingStatus: "blocked",
    payrollRegistrationStatus: "watch",
    workersCompStatus: "watch",
    telehealthRuleStatus: "blocked",
    claimReadinessStatus: "blocked",
    nextAction:
      "Finish CMAP/HUSKY provider path, supervision rule evidence, and documentation-signature workflow.",
  },
  {
    state: "MO",
    centers: ["MO Center"],
    activeClients: 1,
    activeRbts: 1,
    activeBcbas: 1,
    payerCount: 5,
    credentialingStatus: "watch",
    payrollRegistrationStatus: "ready",
    workersCompStatus: "watch",
    telehealthRuleStatus: "blocked",
    claimReadinessStatus: "blocked",
    nextAction:
      "Validate MO HealthNet/MCO auth number, technician documentation, and remote-supervision billing rule.",
  },
];

export const companyPayerConfigurations: CompanyPayerConfiguration[] = [
  {
    state: "WA",
    payerName: "Washington Apple Health / ProviderOne",
    payerType: "medicaid_ffs",
    credentialing: "watch",
    authTemplate: "ready",
    claimTemplate: "watch",
    eftEra: "watch",
    timelyFilingDays: 365,
    nextAction:
      "Store effective date, ProviderOne billing provider ID, ERA route, and tested claim example.",
  },
  {
    state: "ND",
    payerName: "North Dakota Medicaid",
    payerType: "medicaid_ffs",
    credentialing: "ready",
    authTemplate: "watch",
    claimTemplate: "watch",
    eftEra: "blocked",
    timelyFilingDays: null,
    nextAction:
      "Confirm timely filing, service-code units, ERA setup, and payer call reference workflow.",
  },
  {
    state: "CT",
    payerName: "Connecticut Medical Assistance Program / HUSKY",
    payerType: "medicaid_ffs",
    credentialing: "blocked",
    authTemplate: "watch",
    claimTemplate: "blocked",
    eftEra: "blocked",
    timelyFilingDays: null,
    nextAction:
      "Complete CMAP/Gainwell enrollment and verify ASD CPT, modifier, POS, and supervision requirements.",
  },
  {
    state: "MO",
    payerName: "MO HealthNet",
    payerType: "medicaid_ffs",
    credentialing: "watch",
    authTemplate: "blocked",
    claimTemplate: "watch",
    eftEra: "watch",
    timelyFilingDays: null,
    nextAction:
      "Add authorization number capture, documentation-timeliness hold, and ERA matching workflow.",
  },
];

export const companySetupGates: CompanySetupGate[] = [
  {
    domain: "Company identity",
    owner: "Owner/admin",
    status: "watch",
    requiredEvidence:
      "Legal name, DBA, EIN, Type 2 NPI, taxonomy, liability insurance, service addresses.",
    blocks: "Payer enrollment, EFT/ERA, claim submission, and contracts.",
  },
  {
    domain: "State operating authority",
    owner: "Credentialing",
    status: "blocked",
    requiredEvidence:
      "BCBA/LBA permissions, agency enrollment, service location approvals, and renewal dates by state.",
    blocks:
      "Scheduling billable services in states without verified provider authority.",
  },
  {
    domain: "Payroll and workers comp",
    owner: "CPA/payroll admin",
    status: "watch",
    requiredEvidence:
      "Employer registration, withholding, unemployment, workers comp, wage notices, pay frequency by work state.",
    blocks: "Hiring RBTs and issuing compliant biweekly payroll.",
  },
  {
    domain: "Payer operations",
    owner: "India RCM",
    status: "blocked",
    requiredEvidence:
      "Payer portal, credentialing effective date, auth template, claim template, EFT/ERA, timely filing.",
    blocks: "Clean claim release and reliable cash collection.",
  },
  {
    domain: "HIPAA/security",
    owner: "Software Engineer A",
    status: "blocked",
    requiredEvidence:
      "BAAs, MFA, audit logs, minimum-necessary roles, encryption, video vendor risk review.",
    blocks:
      "India team access, parent portal, video monitoring, and multi-company SaaS sales.",
  },
];

export const companyRoleAccess: CompanyRoleAccess[] = [
  {
    role: "owner",
    users: 1,
    allowedStates: "All configured company states",
    allowedData:
      "Clinical, finance, payroll, claims, credentialing, audit, and expansion dashboards.",
    blockedData: "None by role, but break-glass access should still be logged.",
    requiredControls: [
      "MFA",
      "Audit log",
      "Quarterly access review",
      "BAA oversight",
    ],
  },
  {
    role: "bcba",
    users: 1,
    allowedStates: "Assigned clinical states",
    allowedData:
      "Assigned clients, RBT supervision, clinical notes, parent training, authorization utilization.",
    blockedData:
      "Full company payroll, other BCBA payroll, unrestricted RCM downloads.",
    requiredControls: ["MFA", "Clinical signature", "Supervision attestation"],
  },
  {
    role: "rbt",
    users: 4,
    allowedStates: "Own work state",
    allowedData:
      "Assigned client schedule, data sheets, session notes, own timesheet, own training.",
    blockedData:
      "Other clients, payer contracts, claim payment amounts, company P&L.",
    requiredControls: ["MFA", "Device lock", "Session-note signature"],
  },
  {
    role: "parent",
    users: 4,
    allowedStates: "Own child only",
    allowedData:
      "Child schedule, progress, parent training, home practice, documents requiring signature.",
    blockedData:
      "Staff pay, other children, internal claim notes, payer credentialing.",
    requiredControls: [
      "MFA or verified OTP",
      "Guardian relationship",
      "Consent record",
    ],
  },
  {
    role: "india_rcm",
    users: 3,
    allowedStates: "Company states assigned by owner",
    allowedData:
      "Credentialing tasks, claim queue, payer call scripts, ERA posting, denial follow-up.",
    blockedData:
      "Treatment plan editing, unrestricted video, clinical decision fields, payroll bank details.",
    requiredControls: [
      "BAA",
      "MFA",
      "IP/session review",
      "Minimum necessary PHI",
      "Export restrictions",
    ],
  },
];

export const companyConfigurationTasks: CompanyConfigurationTask[] = [
  {
    id: "company-identity",
    domain: "company",
    title: "Complete legal provider identity",
    owner: "Owner/admin",
    status: "watch",
    dueWindow: "Before payer enrollment",
    blocks: ["Payer contracts", "EFT/ERA", "claim submission"],
    evidence:
      "Legal name, DBA, EIN, Type 2 NPI, taxonomy, CAQH/NPPES records, insurance certificate, W-9.",
  },
  {
    id: "state-rule-registry",
    domain: "state",
    title: "Load active-state rule registry",
    owner: "Credentialing",
    status: "blocked",
    dueWindow: "Before intake in each state",
    blocks: [
      "Billable scheduling",
      "remote supervision",
      "parent training claims",
    ],
    evidence:
      "State license path, Medicaid provider path, RBT/technician rules, supervision rules, telehealth policy evidence.",
  },
  {
    id: "payer-contract-pack",
    domain: "payer",
    title: "Configure payer contract and claim templates",
    owner: "India RCM",
    status: "blocked",
    dueWindow: "Before first claim",
    blocks: ["Clean claim release", "denial prevention", "cash forecast"],
    evidence:
      "Effective date, CPT/modifier/POS, rate, timely filing, auth fields, claim scrub rules, payer phone/script.",
  },
  {
    id: "staff-profile-pack",
    domain: "staff",
    title: "Complete staff profiles and work-state setup",
    owner: "BCBA/admin",
    status: "watch",
    dueWindow: "Before first scheduled shift",
    blocks: ["Scheduling", "payroll", "supervision audit"],
    evidence:
      "Role, credential, work state, background checks, pay rate, availability, assigned supervisor, training status.",
  },
  {
    id: "client-intake-pack",
    domain: "client",
    title: "Complete client intake and authorization packet",
    owner: "BCBA",
    status: "watch",
    dueWindow: "Before recurring treatment",
    blocks: ["Schedule release", "RBT assignment", "claim-ready documentation"],
    evidence:
      "Diagnosis, consent, treatment plan, authorization, target hours, parent portal invite, emergency contact.",
  },
  {
    id: "portal-permissions",
    domain: "portal",
    title: "Activate role-based portals",
    owner: "Software Engineer A",
    status: "blocked",
    dueWindow: "Before parent/RBT login",
    blocks: ["Parent access", "RBT self-service", "India RCM access"],
    evidence:
      "Owner, BCBA, RBT, parent, admin, India RCM roles with minimum-necessary permissions and audit logging.",
  },
  {
    id: "training-assignments",
    domain: "training",
    title: "Assign required training by role",
    owner: "Clinical governance",
    status: "watch",
    dueWindow: "Before independent work",
    blocks: [
      "RBT documentation",
      "parent portal use",
      "India RCM claim handling",
    ],
    evidence:
      "Training modules, competency checks, due dates, certificates, supervisor sign-off, renewal cadence.",
  },
  {
    id: "hipaa-security",
    domain: "security",
    title: "Complete HIPAA and cross-border access controls",
    owner: "Software Engineer A",
    status: "blocked",
    dueWindow: "Before production PHI",
    blocks: [
      "Video monitoring",
      "India operations",
      "multi-company SaaS sales",
    ],
    evidence:
      "BAAs, MFA, encryption, audit logs, role review, export restriction, incident response, vendor risk review.",
  },
  {
    id: "records-retention",
    domain: "security",
    title: "Configure record retention and destruction controls",
    owner: "Compliance/admin",
    status: "blocked",
    dueWindow: "Before production records",
    blocks: ["Audit defense", "record destruction", "company closure plan"],
    evidence:
      "Retention schedule by record type/state/payer, legal hold process, archive location, destruction approval log.",
  },
  {
    id: "finance-ledger",
    domain: "finance",
    title: "Configure state/client/provider ledger",
    owner: "CPA/admin",
    status: "watch",
    dueWindow: "Before first payroll close",
    blocks: ["Profit/loss", "payroll reconciliation", "payer cash tracking"],
    evidence:
      "State, center, payer, client, provider, service, claim, payroll, cash, denial, and write-off classes.",
  },
];

export const companyLaunchPhases: CompanyLaunchPhase[] = [
  {
    phase: "1. Company foundation",
    target:
      "Provider identity, HIPAA controls, bank/EFT policy, payroll vendor, owner/admin access.",
    status: "watch",
    exitCriteria: [
      "Provider identity evidence uploaded",
      "BAAs and role permissions approved",
      "Accounting classes created",
    ],
  },
  {
    phase: "2. State activation",
    target:
      "Activate only states with license, payroll, workers comp, payer path, and telehealth rule evidence.",
    status: "blocked",
    exitCriteria: [
      "State credentialing ready",
      "Payroll tax/workers comp ready",
      "Remote supervision rule verified or blocked in scheduler",
    ],
  },
  {
    phase: "3. Client/RBT launch",
    target:
      "Assign RBTs to authorized clients, protect 30-hour retention target, and start parent portal.",
    status: "watch",
    exitCriteria: [
      "Client auth packet complete",
      "RBT training complete",
      "Weekly schedule and backup coverage approved",
    ],
  },
  {
    phase: "4. Claims and cash cycle",
    target:
      "Release only clean claims, post ERA/payment, follow denials, and reconcile payroll to collections.",
    status: "blocked",
    exitCriteria: [
      "Claim templates configured",
      "EFT/ERA tested",
      "Denial and payer-call workflow active",
    ],
  },
  {
    phase: "5. Multi-company SaaS",
    target:
      "Turn the operating model into configurable tenants for other ABA companies.",
    status: "blocked",
    exitCriteria: [
      "Tenant isolation tested",
      "Company setup wizard complete",
      "Audit exports and support workflows ready",
    ],
  },
];

export function calculateCompanyReadiness(tasks = companyConfigurationTasks) {
  const weightByStatus: Record<EnterpriseStatus, number> = {
    ready: 1,
    watch: 0.5,
    blocked: 0,
  };
  const score =
    tasks.reduce((total, task) => total + weightByStatus[task.status], 0) /
    Math.max(tasks.length, 1);

  return {
    percent: Math.round(score * 100),
    ready: tasks.filter((task) => task.status === "ready").length,
    watch: tasks.filter((task) => task.status === "watch").length,
    blocked: tasks.filter((task) => task.status === "blocked").length,
    total: tasks.length,
  };
}

export const recordRetentionPolicies: RecordRetentionPolicy[] = [
  {
    id: "clinical-minor-aba-record",
    category: "clinical",
    recordSet:
      "Client clinical chart, assessment, treatment plan, session notes, supervision logs",
    appliesToStates: ["WA", "ND", "CT", "MO"],
    retentionYears: 10,
    retentionTrigger:
      "Later of last service date, payer final action, or minor reaching age of majority plus configured buffer",
    authorityBasis:
      "Conservative company rule because ABA clients are commonly minors and state/payer rules differ.",
    owner: "Clinical governance",
    storageSystem: "Encrypted EHR/document vault",
    destructionRule:
      "Never auto-delete. Compliance owner must verify no payer audit, legal hold, incident, appeal, or open balance.",
    status: "watch",
  },
  {
    id: "medicaid-billing-record",
    category: "billing",
    recordSet:
      "Medicaid claims, authorizations, signed notes, remittance, denial, appeal, payer call logs",
    appliesToStates: ["WA", "ND", "CT", "MO"],
    retentionYears: 6,
    retentionTrigger:
      "Date of service, payment, final claim determination, or payer contract rule, whichever is later",
    authorityBasis:
      "Medicaid and payer audit defense baseline; Missouri and Connecticut Medicaid materials identify six-year retention in relevant contexts.",
    owner: "India RCM / US compliance",
    storageSystem: "Billing vault and accounting ledger",
    destructionRule:
      "Hold if claim is denied, appealed, audited, overpaid, under recoupment, or tied to open payer inquiry.",
    status: "watch",
  },
  {
    id: "hipaa-compliance-documentation",
    category: "hipaa",
    recordSet:
      "HIPAA policies, risk assessments, BAAs, access reviews, incident logs, training attestations",
    appliesToStates: ["WA", "ND", "CT", "MO", "All future states"],
    retentionYears: 6,
    retentionTrigger:
      "Creation date or last effective date, whichever is later",
    authorityBasis:
      "HIPAA documentation retention baseline under 45 CFR 164.316(b)(2)(i).",
    owner: "Security officer",
    storageSystem: "Compliance vault",
    destructionRule:
      "Do not destroy if policy was active during an unresolved incident, OCR inquiry, breach review, or litigation hold.",
    status: "blocked",
  },
  {
    id: "payroll-employment-record",
    category: "payroll",
    recordSet:
      "Timesheets, wage rates, payroll runs, tax filings, unemployment, workers comp, contractor invoices",
    appliesToStates: ["WA", "ND", "CT", "MO"],
    retentionYears: 7,
    retentionTrigger:
      "Pay period end, tax filing date, audit final action, or employment termination, whichever is later",
    authorityBasis:
      "Conservative operating rule for payroll, tax, wage, unemployment, and workers comp audit defense.",
    owner: "CPA/payroll admin",
    storageSystem: "Payroll ledger and HR vault",
    destructionRule:
      "Hold if wage dispute, tax notice, workers comp claim, unemployment claim, or employment litigation is open.",
    status: "watch",
  },
  {
    id: "credentialing-provider-record",
    category: "credentialing",
    recordSet:
      "BCBA/RBT credentials, licenses, background checks, payer credentialing, CAQH/portal submissions",
    appliesToStates: ["WA", "ND", "CT", "MO"],
    retentionYears: 7,
    retentionTrigger:
      "Later of credential expiration, payer termination, provider termination, or last billed service",
    authorityBasis:
      "Conservative credentialing and payer audit rule; exact payer contracts may require longer retention.",
    owner: "Credentialing",
    storageSystem: "Provider credentialing vault",
    destructionRule:
      "Hold if provider rendered services tied to retained clinical or billing records.",
    status: "watch",
  },
  {
    id: "video-safety-monitoring",
    category: "video",
    recordSet:
      "AI video alerts, reviewed clips, incident clips, human confirmation notes",
    appliesToStates: ["WA", "ND", "CT", "MO"],
    retentionYears: 6,
    retentionTrigger:
      "Alert date, incident closure, complaint closure, or payer/legal final action, whichever is later",
    authorityBasis:
      "Conservative HIPAA/security and incident-defense rule; routine non-incident video should have a shorter configurable policy.",
    owner: "BCBA / security officer",
    storageSystem: "Encrypted video evidence vault",
    destructionRule:
      "Routine video can follow shorter policy only if not used for clinical documentation, claim support, incident review, or complaint.",
    status: "blocked",
  },
  {
    id: "parent-training-documentation",
    category: "training",
    recordSet:
      "Parent training plans, attendance, home-practice assignments, competency checks, signatures",
    appliesToStates: ["WA", "ND", "CT", "MO"],
    retentionYears: 6,
    retentionTrigger:
      "Training date, plan update, or final claim/payment action, whichever is later",
    authorityBasis:
      "Claim support and clinical documentation retention rule when parent training is billed or tied to treatment plan.",
    owner: "BCBA",
    storageSystem: "Parent portal and clinical chart",
    destructionRule: "Hold with associated clinical chart and claims records.",
    status: "watch",
  },
  {
    id: "corporate-contract-record",
    category: "corporate",
    recordSet:
      "Payer contracts, BAAs, vendor agreements, India contractor agreements, insurance policies",
    appliesToStates: ["WA", "ND", "CT", "MO", "All future states"],
    retentionYears: 7,
    retentionTrigger:
      "Contract termination, final payment, or audit closure, whichever is later",
    authorityBasis:
      "Conservative corporate, payer, insurance, and BAA audit-defense rule.",
    owner: "Owner/admin",
    storageSystem: "Corporate document vault",
    destructionRule:
      "Hold if contract relates to retained PHI, unresolved claim, payer audit, security incident, or legal dispute.",
    status: "watch",
  },
];

export const retentionInventoryItems: RetentionInventoryItem[] = [
  {
    id: "ret-wa-client-chart",
    recordSet: "Clinical chart and session documentation",
    state: "WA",
    clientOrOwner: "Client WA-01",
    periodEnd: "2026-07-05",
    retainUntil: "2036-07-05",
    legalHold: false,
    location: "Encrypted EHR/document vault",
    nextAction:
      "Attach authorization, signed treatment plan, session notes, supervision logs, and parent-training records.",
    status: "watch",
  },
  {
    id: "ret-nd-medicaid-claim",
    recordSet: "Medicaid claim support packet",
    state: "ND",
    clientOrOwner: "Client ND-01",
    periodEnd: "2026-07-05",
    retainUntil: "2032-07-05",
    legalHold: false,
    location: "Billing vault and accounting ledger",
    nextAction:
      "Confirm ND payer timely filing and final-payment trigger before marking destruction date final.",
    status: "watch",
  },
  {
    id: "ret-ct-denial-packet",
    recordSet: "Denied claim and appeal packet",
    state: "CT",
    clientOrOwner: "Client CT-01",
    periodEnd: "2026-07-05",
    retainUntil: "2032-07-05",
    legalHold: true,
    location: "Billing vault and denial queue",
    nextAction:
      "Legal/audit hold because denial and documentation deficiency are unresolved.",
    status: "blocked",
  },
  {
    id: "ret-mo-video-alert",
    recordSet: "Video safety alert and human review note",
    state: "MO",
    clientOrOwner: "Client MO-01",
    periodEnd: "2026-07-05",
    retainUntil: "2032-07-05",
    legalHold: true,
    location: "Encrypted video evidence vault",
    nextAction:
      "Keep until BCBA closes incident review and payer/legal risk is cleared.",
    status: "blocked",
  },
  {
    id: "ret-company-hipaa",
    recordSet: "HIPAA policies, access reviews, BAA records",
    state: "All",
    clientOrOwner: "Launch ABA Care",
    periodEnd: "2026-07-05",
    retainUntil: "2032-07-05",
    legalHold: false,
    location: "Compliance vault",
    nextAction:
      "Add India RCM BAA, vendor list, access review export, and incident response policy.",
    status: "blocked",
  },
];

export function summarizeRetentionReadiness(
  policies = recordRetentionPolicies,
  inventory = retentionInventoryItems,
) {
  const blockedPolicies = policies.filter(
    (policy) => policy.status === "blocked",
  ).length;
  const legalHolds = inventory.filter((item) => item.legalHold).length;
  const readyPolicies = policies.filter(
    (policy) => policy.status === "ready",
  ).length;

  return {
    policies: policies.length,
    readyPolicies,
    blockedPolicies,
    legalHolds,
    archiveItems: inventory.length,
  };
}

export const indiaCallCenterOperatingRules: IndiaCallCenterOperatingRule[] = [
  {
    domain: "Payer eligibility and authorization",
    allowedWork: [
      "Check eligibility and active coverage",
      "Confirm authorization status and units",
      "Ask payer for portal reference number",
    ],
    blockedWork: [
      "Change diagnosis or treatment plan",
      "Represent clinical medical necessity without BCBA-approved wording",
      "Download full chart when a claim/auth packet is sufficient",
    ],
    requiredControls: [
      "BAA or subcontractor BAA",
      "Minimum-necessary screen",
      "Call recording policy if used",
      "Reference number log",
    ],
    escalationTrigger:
      "Escalate to BCBA/owner if payer asks clinical questions, denies medical necessity, or requests treatment-plan change.",
  },
  {
    domain: "Claim status and denial follow-up",
    allowedWork: [
      "Call payer for claim status",
      "Collect denial reason and appeal deadline",
      "Prepare corrected-claim checklist",
      "Post payer reference number into claim event",
    ],
    blockedWork: [
      "Submit appeal language without US clinical/admin approval",
      "Write off balances",
      "Change billed CPT/modifier without payer rule confirmation",
    ],
    requiredControls: [
      "Claim ID only until identity is verified",
      "No local file downloads",
      "Audit log for every viewed claim",
      "Supervisor QA review",
    ],
    escalationTrigger:
      "Escalate if payer mentions overpayment, fraud/waste/abuse, medical necessity denial, audit, or recoupment.",
  },
  {
    domain: "Credentialing and enrollment",
    allowedWork: [
      "Track application status",
      "Upload owner-approved documents",
      "Call provider relations",
      "Log missing credentialing evidence",
    ],
    blockedWork: [
      "Sign attestations as provider",
      "Alter license or credential evidence",
      "Submit false effective dates",
    ],
    requiredControls: [
      "Credentialing role access",
      "Upload approval queue",
      "Document checksum/version log",
      "Owner attestation before submit",
    ],
    escalationTrigger:
      "Escalate when portal requires provider signature, ownership disclosure, sanction question, or license attestation.",
  },
  {
    domain: "Parent/RBT administrative reminders",
    allowedWork: [
      "Remind parent about attendance and signatures",
      "Remind RBT about missing note completion",
      "Confirm schedule availability",
    ],
    blockedWork: [
      "Give clinical advice",
      "Discuss another child or staff payroll",
      "Handle safety incidents without BCBA escalation",
    ],
    requiredControls: [
      "Approved message templates",
      "No diagnosis details in SMS",
      "Guardian identity verification",
      "Escalation log",
    ],
    escalationTrigger:
      "Escalate distress, safety issue, complaint, treatment question, or request to change goals to BCBA.",
  },
];

export const indiaCallCenterShifts: IndiaCallCenterShift[] = [
  {
    shift: "Overnight preparation",
    indiaTime: "06:30-10:30 IST",
    usCoverage: "Previous US evening work queued for review",
    primaryWork:
      "Scrub claims, prepare payer-call list, identify missing signatures, update dashboards before US morning.",
    handoffRule:
      "No outbound payer/parent calls unless the US contact window is open and script is approved.",
  },
  {
    shift: "US morning payer window",
    indiaTime: "18:30-22:30 IST",
    usCoverage: "US Eastern/Central business hours",
    primaryWork:
      "Call CT/MO/ND payers, log references, resolve eligibility/auth/claim status tasks.",
    handoffRule:
      "Escalate unresolved clinical or legal issues to owner/BCBA before end of shift.",
  },
  {
    shift: "US west coast payer window",
    indiaTime: "22:30-01:30 IST",
    usCoverage: "US Pacific business hours",
    primaryWork:
      "Call WA payers and referral partners, complete end-of-day claim and denial updates.",
    handoffRule:
      "Night shift requires supervisor approval and lower PHI exposure because fatigue increases error risk.",
  },
];

export const indiaCallScripts: IndiaCallScript[] = [
  {
    id: "payer-claim-status",
    callType: "Payer claim status",
    permittedPurpose: "Payment operations and claim follow-up",
    minimumNecessaryFields: [
      "Billing provider name/NPI",
      "Member ID",
      "Date of service",
      "Claim number or clearinghouse trace",
      "Billed amount",
    ],
    scriptOpening:
      "Hello, I am calling on behalf of the provider billing office to check claim status. I can verify provider and claim identifiers.",
    requiredOutcomeFields: [
      "Payer representative",
      "Reference number",
      "Claim status",
      "Denial/payment reason",
      "Next action",
      "Follow-up date",
    ],
    escalationRule:
      "Escalate medical necessity, audit, recoupment, fraud/waste/abuse, or appeal drafting to US owner/BCBA.",
  },
  {
    id: "authorization-status",
    callType: "Authorization status",
    permittedPurpose: "Treatment authorization administration",
    minimumNecessaryFields: [
      "Provider NPI",
      "Member ID",
      "Requested CPT/service",
      "Authorization number if known",
    ],
    scriptOpening:
      "Hello, I am calling from the provider authorization team to confirm ABA authorization status and approved units.",
    requiredOutcomeFields: [
      "Authorization number",
      "Approved dates",
      "Approved units/hours",
      "CPT/modifier/POS",
      "Portal document needed",
      "Reference number",
    ],
    escalationRule:
      "Escalate requests for clinical justification, plan changes, or peer review to BCBA.",
  },
  {
    id: "missing-documentation",
    callType: "RBT/parent documentation reminder",
    permittedPurpose: "Operations reminder for claim-ready documentation",
    minimumNecessaryFields: [
      "First name or internal client label",
      "Service date",
      "Missing signature/note item",
      "Secure portal link",
    ],
    scriptOpening:
      "Hello, this is an administrative reminder from the ABA office about a pending documentation item in the secure portal.",
    requiredOutcomeFields: [
      "Identity verified",
      "Reminder delivered",
      "Barrier reported",
      "Escalation needed",
      "Next follow-up date",
    ],
    escalationRule:
      "Escalate clinical questions, complaints, safety concerns, or requests for treatment advice to BCBA.",
  },
];

export const indiaCallCenterQaMetrics: IndiaCallCenterQaMetric[] = [
  {
    metric: "BAA and role access complete",
    target: "100% before PHI access",
    evidence:
      "Signed BAA/subcontractor BAA, MFA, role assignment, access review.",
    status: "blocked",
  },
  {
    metric: "Calls with reference number",
    target: "95%+ payer calls",
    evidence:
      "Claim event or auth event includes payer representative and reference number.",
    status: "watch",
  },
  {
    metric: "Minimum necessary access",
    target: "100% sampled calls",
    evidence:
      "QA confirms caller viewed only claim/auth fields needed for the task.",
    status: "blocked",
  },
  {
    metric: "Same-day escalation",
    target: "100% high-risk issues",
    evidence:
      "Medical necessity, audit, complaint, safety, and legal issues routed to owner/BCBA same day.",
    status: "watch",
  },
  {
    metric: "No local PHI storage",
    target: "0 local downloads/screenshots",
    evidence: "DLP/export logs and device/session monitoring.",
    status: "blocked",
  },
];

export const usCallingInfrastructure: UsCallingInfrastructureItem[] = [
  {
    domain: "Telephony platform",
    requirement: "HIPAA-eligible cloud phone/VoIP system with BAA",
    whyNeeded:
      "India staff will discuss claim, authorization, member, and payer details that can include PHI.",
    implementation:
      "Use a business VoIP/contact-center vendor that will sign a BAA, supports US numbers, call routing, audit logs, recording controls, and user-level permissions.",
    status: "blocked",
  },
  {
    domain: "US phone numbers",
    requirement: "Dedicated US outbound caller IDs by company or state",
    whyNeeded:
      "Payers, parents, and referral partners are more likely to answer a verified US business number, and logs must tie calls to the right state/company.",
    implementation:
      "Assign numbers for billing/RCM and parent admin calls; keep caller ID truthful and consistent with the provider office.",
    status: "watch",
  },
  {
    domain: "Caller identity",
    requirement: "STIR/SHAKEN-capable carrier and no deceptive spoofing",
    whyNeeded:
      "International-originated calls to the US can be blocked or marked spam if caller identity is weak or misleading.",
    implementation:
      "Route through a reputable US carrier/contact-center provider, register branded caller ID where available, and prohibit fake payer/provider impersonation.",
    status: "watch",
  },
  {
    domain: "Manual dialing policy",
    requirement:
      "No autodialed, prerecorded, AI voice, or marketing calls without consent/legal review",
    whyNeeded:
      "Healthcare admin calls are lower risk when manually dialed and purpose-limited; automated outreach has TCPA/FCC risk.",
    implementation:
      "Use click-to-call or manual dial for payer/parent operations. Keep AI only for note drafting/summarization, not autonomous voice calls.",
    status: "blocked",
  },
  {
    domain: "Call recording",
    requirement:
      "Recording disabled by default or all-party notice/consent workflow",
    whyNeeded:
      "Call recording consent rules vary by state and some payer calls may contain PHI.",
    implementation:
      "If recording is needed, play disclosure before recording, store recordings in encrypted US-controlled storage, and map consent rules by state.",
    status: "blocked",
  },
  {
    domain: "Secure workstation",
    requirement: "Managed India devices or VDI with no local PHI storage",
    whyNeeded:
      "Offshore staff should not download charts, screenshots, recordings, or claim packets to personal machines.",
    implementation:
      "Require company-managed laptop or VDI, MFA, device encryption, screen lock, DLP, blocked USB, disabled local downloads, and session timeout.",
    status: "blocked",
  },
  {
    domain: "Network access",
    requirement: "VPN/ZTNA, IP/session monitoring, and least-privilege portals",
    whyNeeded:
      "Payer portals and the ABA app need auditable access from India without exposing full clinical records.",
    implementation:
      "Permit India RCM role only to claim/auth/credentialing queues, deny treatment-plan editing and unrestricted video, and alert on unusual downloads.",
    status: "blocked",
  },
  {
    domain: "Call documentation",
    requirement: "Structured call log tied to claim/auth/credentialing event",
    whyNeeded:
      "Every call needs payer representative, reference number, decision, next action, and escalation trail.",
    implementation:
      "Force required fields before closing a call task; attach call outcome to the relevant claim, authorization, payer, client, and state ledger.",
    status: "watch",
  },
  {
    domain: "Training and scripts",
    requirement:
      "Approved scripts, identity verification, and escalation rules",
    whyNeeded:
      "India staff must know what they may say, what they must not say, and when BCBA/owner approval is required.",
    implementation:
      "Train staff on payer scripts, parent admin reminders, minimum-necessary PHI, HIPAA, incident escalation, and no clinical advice.",
    status: "watch",
  },
  {
    domain: "Business continuity",
    requirement: "Backup internet, headset, power, and supervisor coverage",
    whyNeeded:
      "Dropped payer calls and poor audio create billing delays and bad documentation.",
    implementation:
      "Require wired headset, quiet workspace, dual internet/power backup for India supervisors, QA review, and US owner escalation channel.",
    status: "watch",
  },
];

export const usCallingVendorReadiness: UsCallingVendorReadiness[] = [
  {
    vendorType: "HIPAA phone/contact center",
    requiredContract: "BAA plus service agreement",
    mustSupport: [
      "US local/toll-free numbers",
      "user-level call logs",
      "recording off by default",
      "role permissions",
      "API/webhook for call outcome posting",
    ],
    goLiveEvidence:
      "Signed BAA, admin screenshot of recording policy, test outbound call, and audit log export.",
    status: "blocked",
  },
  {
    vendorType: "Internet and endpoint management",
    requiredContract: "MSP/security agreement or internal IT policy",
    mustSupport: [
      "device encryption",
      "remote wipe",
      "patch status",
      "DLP rules",
      "blocked local downloads",
    ],
    goLiveEvidence:
      "MDM enrollment, encryption proof, DLP policy, and sample blocked-download event.",
    status: "blocked",
  },
  {
    vendorType: "Identity and access",
    requiredContract:
      "Internal security policy plus vendor terms/BAA where PHI is processed",
    mustSupport: [
      "MFA",
      "SSO or named users",
      "least privilege",
      "quarterly access review",
      "break-glass logging",
    ],
    goLiveEvidence:
      "India RCM role assigned, MFA enforced, access review created, and treatment-plan editing denied.",
    status: "blocked",
  },
  {
    vendorType: "Secure document and call-note storage",
    requiredContract: "BAA if PHI is stored or transmitted",
    mustSupport: [
      "US-controlled encrypted storage",
      "retention rules",
      "legal hold",
      "download restrictions",
      "audit export",
    ],
    goLiveEvidence:
      "Test call note attached to claim event without local download; retention label applied.",
    status: "watch",
  },
];

export const offshoreDeviceControls: OffshoreDeviceControl[] = [
  {
    control: "Managed workstation or VDI",
    requirement: "No personal laptop for PHI workflows",
    enforcement:
      "Only enrolled devices or VDI sessions can access claims, auth, credentialing, or call logs.",
    owner: "Software Engineer A",
    status: "blocked",
  },
  {
    control: "No local PHI storage",
    requirement:
      "Disable downloads, screenshots where possible, USB copy, and local print",
    enforcement:
      "DLP policy blocks exports; every attempted download becomes an audit event.",
    owner: "Security/admin",
    status: "blocked",
  },
  {
    control: "MFA and session timeout",
    requirement: "Named India users with MFA and short idle timeout",
    enforcement:
      "No shared logins; sessions expire after inactivity; high-risk login prompts owner review.",
    owner: "Software Engineer A",
    status: "watch",
  },
  {
    control: "Quiet workspace and headset",
    requirement:
      "Private call area, wired headset, no family/shared-space PHI exposure",
    enforcement:
      "Supervisor attestation, random QA checks, and failed-call incident log.",
    owner: "India supervisor",
    status: "watch",
  },
  {
    control: "Access review",
    requirement: "Weekly review during launch, monthly after stable operations",
    enforcement:
      "Owner confirms users, states, queues, downloads, escalations, and inactive accounts.",
    owner: "Owner/admin",
    status: "watch",
  },
];

export const callRecordingConsentRules: CallRecordingConsentRule[] = [
  {
    callType: "Payer claim/auth call",
    defaultPolicy: "Do not record by default",
    allowedWhen:
      "Recording is enabled only after approved disclosure/consent workflow and payer policy review.",
    storageRule:
      "Store encrypted with claim/auth event, retention label, access log, and no local download.",
    status: "blocked",
  },
  {
    callType: "Parent administrative reminder",
    defaultPolicy: "Do not record by default",
    allowedWhen:
      "Use portal message instead where possible; record only with prior notice and consent.",
    storageRule:
      "Store only if needed for complaint, safety, consent, or attendance dispute.",
    status: "blocked",
  },
  {
    callType: "Internal India-US handoff",
    defaultPolicy: "Meeting notes preferred over recording",
    allowedWhen:
      "Recording allowed only if no child PHI is discussed or all participants are notified.",
    storageRule:
      "Store in compliance vault if policy/training evidence; avoid client identifiers.",
    status: "watch",
  },
];

export const offshoreEscalationRoutes: OffshoreEscalationRoute[] = [
  {
    trigger:
      "Medical necessity denial, peer review, or payer asks clinical questions",
    indiaAction:
      "Stop clinical discussion; record payer question and reference number.",
    usOwner: "BCBA/owner",
    sla: "Same business day",
    status: "blocked",
  },
  {
    trigger: "Audit, recoupment, overpayment, fraud/waste/abuse language",
    indiaAction:
      "Do not answer substantively; capture notice details and documents requested.",
    usOwner: "Owner plus compliance/attorney if needed",
    sla: "Immediate escalation",
    status: "blocked",
  },
  {
    trigger: "Parent complaint, safety concern, or treatment-change request",
    indiaAction: "Acknowledge receipt, do not advise, open escalation event.",
    usOwner: "BCBA/clinical governance",
    sla: "Same day, urgent if safety-related",
    status: "watch",
  },
  {
    trigger:
      "Portal access problem blocks claim, auth, or credentialing deadline",
    indiaAction:
      "Log portal screenshot metadata without PHI download and assign owner.",
    usOwner: "Software Engineer A / admin",
    sla: "4 business hours",
    status: "watch",
  },
];

export const appImprovementRoadmap: AppImprovementRoadmapItem[] = [
  {
    area: "Production RBAC and audit logs",
    improvement:
      "Move role permissions from dashboard display into enforced backend middleware.",
    whyItMatters:
      "India RCM, parent, RBT, BCBA, owner, and admin users must be technically prevented from over-accessing PHI.",
    nextImplementation:
      "Add permission policies to API routes, persist audit events for every PHI view/download/update, and expose access-review exports.",
    status: "blocked",
  },
  {
    area: "Integrated telephony",
    improvement: "Connect VoIP provider webhooks to call tasks and claims.",
    whyItMatters:
      "Call outcomes should automatically attach to claim/auth events and drive follow-up queues.",
    nextImplementation:
      "Create call log database tables, webhook receiver, call disposition form, and payer-reference validation.",
    status: "blocked",
  },
  {
    area: "Real payer templates",
    improvement:
      "Convert payer/state templates into editable database records with effective dates.",
    whyItMatters:
      "Rates, modifiers, timely filing, EFT/ERA, and auth rules change by state and payer.",
    nextImplementation:
      "Add payer contract versioning, claim scrub rules, and denial-code playbooks per state/payer.",
    status: "watch",
  },
  {
    area: "AI safety and claim QA",
    improvement:
      "Add human-reviewed AI alerts for video safety, note completeness, and claim rejection risk.",
    whyItMatters:
      "AI can reduce owner workload only if every alert has human confirmation, audit trail, and no autonomous clinical decision.",
    nextImplementation:
      "Store AI alert events, confidence, reviewer decision, false-positive reason, and claim hold/release action.",
    status: "watch",
  },
  {
    area: "Payroll and profitability",
    improvement:
      "Tie scheduled hours, clock-in/out, claim status, payment, and payroll ledger together.",
    whyItMatters:
      "Profit/loss depends on attendance, denial rate, RBT utilization, BCBA supervision, and payment timing.",
    nextImplementation:
      "Add state/payer/client/provider accounting classes and cash forecast from claims plus payroll liabilities.",
    status: "watch",
  },
  {
    area: "Parent and training portals",
    improvement:
      "Make parent home practice, RBT training, competency checks, and signatures transactional.",
    whyItMatters:
      "Portals should produce claim-supporting documentation, not only display information.",
    nextImplementation:
      "Add assignment completion records, signatures, competency score, renewal date, and supervisor sign-off.",
    status: "watch",
  },
];

export const stateExpansionReadiness: StateExpansionReadiness[] = [
  {
    region: "Current launch states",
    stateCount: 4,
    readiness: "watch",
    requiredBeforeLaunch: [
      "State license and payer enrollment evidence",
      "Payroll tax, unemployment, and workers comp setup",
      "Telehealth/supervision rule stored by payer",
    ],
    operatingRisk:
      "One BCBA can pilot carefully, but state-specific payer rules must block scheduling and claims until verified.",
  },
  {
    region: "Next controlled expansion",
    stateCount: 8,
    readiness: "blocked",
    requiredBeforeLaunch: [
      "Configurable payer templates by state",
      "Role permissions and audit logs",
      "Credential renewal and expiration automations",
    ],
    operatingRisk:
      "Expansion beyond the first few states needs state onboarding checklists and payer-specific authorization rules.",
  },
  {
    region: "National ABA SaaS",
    stateCount: 50,
    readiness: "blocked",
    requiredBeforeLaunch: [
      "50-state rule registry and payer-rate library",
      "Multi-tenant organization isolation",
      "Clearinghouse, ERA, EVV, e-signature, and payroll tax integrations",
      "Support workflow for parent, RBT, BCBA, admin, and owner roles",
    ],
    operatingRisk:
      "National use requires configurable workflows; hard-coded state logic will fail when payer contracts differ.",
  },
];

export const competitorFeatureGaps: AbaSoftwareFeatureGap[] = [
  {
    feature: "Scheduling and availability",
    marketExpectation:
      "Role calendars, recurring sessions, staff availability, cancellations, reminders, and utilization.",
    currentStatus: "watch",
    implementedNow:
      "Weekly role schedule, state rule status, utilization, and staff portal summaries.",
    nextBuild:
      "Drag-and-drop calendar, recurring templates, cancellation reason codes, SMS/email reminders, and waitlist matching.",
  },
  {
    feature: "Clinical data collection",
    marketExpectation:
      "RBT mobile data collection, behavior tracking, graphing, notes, offline mode, and BCBA review.",
    currentStatus: "watch",
    implementedNow:
      "Parent progress and clinical summary panels connected to treatment-plan concepts.",
    nextBuild:
      "Real trial-by-trial data sheets, offline RBT capture, behavior ABC forms, graph exports, and clinical signatures.",
  },
  {
    feature: "Parent portal",
    marketExpectation:
      "Schedule, progress, session notes, signatures, documents, parent training, and home-practice tasks.",
    currentStatus: "watch",
    implementedNow:
      "Parent portal view with progress, weekly schedule, home practice, training, and required actions.",
    nextBuild:
      "Secure parent login, e-signature, messaging, document vault, parent-entered data, and video upload controls.",
  },
  {
    feature: "Billing and RCM",
    marketExpectation:
      "Auth tracking, claim scrubbing, claim submission, ERA posting, denial queue, and payer follow-up.",
    currentStatus: "watch",
    implementedNow:
      "Claim lifecycle actions, payment ledger posting, denial/follow-up queue, and payer call worklists.",
    nextBuild:
      "Clearinghouse 837P/EDI, ERA 835 import, payer-specific claim templates, and automated denial rules.",
  },
  {
    feature: "Payroll and staff finance",
    marketExpectation:
      "Clock-in/out, mileage/admin time, overtime, payroll exports, staff pay visibility, and loaded labor cost.",
    currentStatus: "watch",
    implementedNow:
      "Biweekly summaries, role payroll cards, state ledger classes, and internal payroll export.",
    nextBuild:
      "Overtime rules, PTO, wage notices, payroll tax filing integration, direct deposit, and employee self-service documents.",
  },
  {
    feature: "Training and competency",
    marketExpectation:
      "RBT onboarding, HIPAA, documentation, parent training, BCBA supervision, quizzes, renewals, and certificates.",
    currentStatus: "watch",
    implementedNow:
      "Training module catalog by parent, RBT, BCBA, and admin roles with competency checks.",
    nextBuild:
      "Course player, quizzes, SCORM/video tracking, certificates, supervisor sign-off, and renewal alerts.",
  },
  {
    feature: "Enterprise administration",
    marketExpectation:
      "Multi-location, multi-state, multi-BCBA, permissions, audit logs, analytics, and compliance dashboards.",
    currentStatus: "blocked",
    implementedNow:
      "50-state readiness model and role-based operating surfaces.",
    nextBuild:
      "True multi-tenant isolation, configurable state packs, owner analytics, API keys, audit exports, and SOC/HIPAA controls.",
  },
];

export const portalExperiences: PortalExperience[] = [
  {
    role: "parent",
    dashboard:
      "Child progress, next sessions, parent-training due items, documents, and home practice.",
    weeklySchedule: [
      "Upcoming RBT sessions",
      "BCBA parent-training appointment",
      "Canceled/makeup session status",
    ],
    moneyOrProgress: [
      "Goal mastery and trend",
      "Barriers to generalization",
      "Home-practice completion",
    ],
    requiredActions: [
      "Sign session note",
      "Complete parent training module",
      "Confirm availability or cancellation reason",
    ],
    accessBoundary:
      "Can see own child only; cannot see staff payroll, other clients, payer credentials, or internal claim notes.",
  },
  {
    role: "rbt",
    dashboard:
      "Weekly client schedule, data collection, session notes, supervision status, training, and timesheet.",
    weeklySchedule: [
      "Direct treatment blocks",
      "Supervision observation windows",
      "Makeup sessions",
    ],
    moneyOrProgress: [
      "Biweekly paid hours",
      "Billable hours",
      "Documentation holds affecting claim release",
    ],
    requiredActions: [
      "Clock in/out",
      "Complete session data",
      "Sign note",
      "Complete RBT training renewal",
    ],
    accessBoundary:
      "Can see assigned clients and own payroll summary only; cannot see full company finance or other staff pay.",
  },
  {
    role: "bcba",
    dashboard:
      "Caseload, supervision percentage, protocols, parent training, auth utilization, and claim holds.",
    weeklySchedule: [
      "Supervision blocks by RBT/client",
      "Protocol modification",
      "Parent training",
      "Assessment/report writing",
    ],
    moneyOrProgress: [
      "Billable BCBA hours",
      "Supervision compliance",
      "Client goal progress and barriers",
    ],
    requiredActions: [
      "Review RBT notes",
      "Approve protocol changes",
      "Close AI safety alerts",
      "Sign supervision logs",
    ],
    accessBoundary:
      "Can see assigned clinical records and supervision reports; finance access depends on owner/admin permission.",
  },
  {
    role: "admin",
    dashboard:
      "Credentialing, authorizations, claims, payroll, payer calls, intake, referrals, and compliance.",
    weeklySchedule: [
      "Staff utilization",
      "Authorization expirations",
      "Payer follow-up calls",
      "Payroll close",
    ],
    moneyOrProgress: [
      "Claim aging",
      "Payroll cost",
      "Cash collections",
      "Center profitability",
    ],
    requiredActions: [
      "Resolve credentialing blockers",
      "Run payroll review",
      "Post ERA",
      "Escalate denied claims",
    ],
    accessBoundary:
      "Minimum-necessary access by job; India RCM cannot alter clinical plans or download unrestricted PHI.",
  },
];

export const trainingModules: TrainingModule[] = [
  {
    id: "parent-home-practice",
    audience: "parent",
    title: "Home practice and generalization",
    minutes: 18,
    required: true,
    competencyCheck:
      "Parent selects correct prompting and reinforcement steps.",
    renewalCadence: "Every treatment-plan update",
  },
  {
    id: "parent-session-signature",
    audience: "parent",
    title: "Reviewing progress and signing session notes",
    minutes: 10,
    required: true,
    competencyCheck: "Parent signs a sample note and flags an incorrect time.",
    renewalCadence: "Annual",
  },
  {
    id: "rbt-session-data",
    audience: "rbt",
    title: "RBT data collection and session documentation",
    minutes: 45,
    required: true,
    competencyCheck:
      "RBT completes a mock session with data, note, and claim-ready checklist.",
    renewalCadence: "Quarterly",
  },
  {
    id: "rbt-safety-video",
    audience: "rbt",
    title: "Video safety alerts and escalation",
    minutes: 25,
    required: true,
    competencyCheck:
      "RBT responds to out-of-frame, distress, and parent-interruption scenarios.",
    renewalCadence: "Semiannual",
  },
  {
    id: "bcba-supervision",
    audience: "bcba",
    title: "Multi-state supervision and remote-service review",
    minutes: 40,
    required: true,
    competencyCheck:
      "BCBA validates supervision percentage, mode, payer authorization, and note signature.",
    renewalCadence: "Quarterly",
  },
  {
    id: "admin-rcm",
    audience: "admin",
    title: "Claims, ERA, denials, and payer call scripts",
    minutes: 50,
    required: true,
    competencyCheck:
      "Admin posts a sample payment, logs denial reference number, and queues next action.",
    renewalCadence: "Quarterly",
  },
  {
    id: "admin-hipaa-minimum",
    audience: "admin",
    title: "HIPAA minimum necessary access for US and India teams",
    minutes: 35,
    required: true,
    competencyCheck:
      "Admin assigns correct role access to parent, RBT, BCBA, and India RCM users.",
    renewalCadence: "Annual",
  },
];

export const childProgressSnapshots: ChildProgressSnapshot[] = [
  {
    child: "Client WA-01",
    state: "WA",
    goalsInTreatmentPlan: 18,
    masteredGoals: 6,
    improvingGoals: 8,
    highPriorityBarriers: [
      "Transition refusal after tablet removal",
      "Parent prompt fading inconsistent",
    ],
    homePractice: [
      "Two 5-minute manding routines daily",
      "Use first-then board before dinner",
    ],
    parentTrainingDue:
      "Review generalization module before next BCBA parent-training session",
  },
  {
    child: "Client ND-01",
    state: "ND",
    goalsInTreatmentPlan: 16,
    masteredGoals: 4,
    improvingGoals: 7,
    highPriorityBarriers: ["RBT coverage not yet at 30-hour retention target"],
    homePractice: [
      "Practice functional communication during snack",
      "Record one short caregiver observation",
    ],
    parentTrainingDue:
      "Confirm telehealth/parent-training authorization before online session",
  },
  {
    child: "Client CT-01",
    state: "CT",
    goalsInTreatmentPlan: 20,
    masteredGoals: 5,
    improvingGoals: 9,
    highPriorityBarriers: [
      "Unsigned session note",
      "Supervision mode requires payer verification",
    ],
    homePractice: [
      "Complete toileting routine tracker",
      "Upload caregiver note after bedtime routine",
    ],
    parentTrainingDue: "Complete session-note signature module",
  },
  {
    child: "Client MO-01",
    state: "MO",
    goalsInTreatmentPlan: 15,
    masteredGoals: 3,
    improvingGoals: 6,
    highPriorityBarriers: [
      "Authorization number missing",
      "Remote supervision not confirmed",
    ],
    homePractice: [
      "Run two matching trials with natural reinforcement",
      "Confirm availability for makeup block",
    ],
    parentTrainingDue:
      "BCBA to schedule parent-training block after authorization update",
  },
];
