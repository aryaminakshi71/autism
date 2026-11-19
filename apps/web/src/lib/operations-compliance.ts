export type ComplianceState = "WA" | "ND" | "CT" | "MO";
export type ComplianceStatus =
  | "complete"
  | "in_progress"
  | "pending"
  | "blocked";
export type ComplianceDomain =
  | "payroll_tax"
  | "state_withholding"
  | "unemployment"
  | "workers_comp"
  | "payer_eft_era"
  | "accounting_ledger"
  | "bcba_license"
  | "rbt_credential"
  | "payer_credentialing"
  | "telehealth_rule";

export interface ComplianceRequirement {
  id: string;
  state: ComplianceState;
  domain: ComplianceDomain;
  requirement: string;
  owner: "Owner" | "CPA" | "Payroll vendor" | "India RCM" | "Credentialing";
  status: ComplianceStatus;
  dueInDays: number;
  renewalInDays?: number;
  penaltyRisk: "low" | "medium" | "high";
  nextAction: string;
}

export interface ComplianceSummary {
  state: ComplianceState;
  total: number;
  complete: number;
  blocked: number;
  dueSoon: number;
  highRisk: number;
  status: "ready" | "watch" | "blocked";
}

const baseByState: Array<{
  state: ComplianceState;
  bcbaLicenseStatus: ComplianceStatus;
  payerCredentialingStatus: ComplianceStatus;
  telehealthStatus: ComplianceStatus;
}> = [
  {
    state: "WA",
    bcbaLicenseStatus: "complete",
    payerCredentialingStatus: "in_progress",
    telehealthStatus: "in_progress",
  },
  {
    state: "ND",
    bcbaLicenseStatus: "in_progress",
    payerCredentialingStatus: "in_progress",
    telehealthStatus: "blocked",
  },
  {
    state: "CT",
    bcbaLicenseStatus: "blocked",
    payerCredentialingStatus: "blocked",
    telehealthStatus: "blocked",
  },
  {
    state: "MO",
    bcbaLicenseStatus: "complete",
    payerCredentialingStatus: "in_progress",
    telehealthStatus: "blocked",
  },
];

export const complianceRequirements: ComplianceRequirement[] =
  baseByState.flatMap((state) => [
    {
      id: `${state.state}-payroll-tax`,
      state: state.state,
      domain: "payroll_tax",
      requirement:
        "Register payroll tax account before first paycheck in work state",
      owner: "CPA",
      status:
        state.state === "WA" || state.state === "MO"
          ? "complete"
          : "in_progress",
      dueInDays: state.state === "CT" ? 7 : 21,
      penaltyRisk: state.state === "CT" ? "high" : "medium",
      nextAction: "Confirm state employer account and payroll vendor setup",
    },
    {
      id: `${state.state}-withholding`,
      state: state.state,
      domain: "state_withholding",
      requirement: "Set up state withholding where employee performs services",
      owner: "Payroll vendor",
      status: state.state === "WA" ? "complete" : "in_progress",
      dueInDays: 14,
      penaltyRisk: "medium",
      nextAction: "Store withholding account ID and filing frequency",
    },
    {
      id: `${state.state}-ui`,
      state: state.state,
      domain: "unemployment",
      requirement: "Set up state unemployment insurance account",
      owner: "Payroll vendor",
      status:
        state.state === "WA" || state.state === "MO" ? "complete" : "pending",
      dueInDays: 14,
      penaltyRisk: "medium",
      nextAction: "Store UI account number and tax rate",
    },
    {
      id: `${state.state}-workers-comp`,
      state: state.state,
      domain: "workers_comp",
      requirement:
        "Workers comp coverage active for employees working in the state",
      owner: "Payroll vendor",
      status: state.state === "CT" ? "blocked" : "in_progress",
      dueInDays: state.state === "CT" ? 3 : 10,
      penaltyRisk: state.state === "CT" ? "high" : "medium",
      nextAction:
        "Confirm state endorsement and effective date before RBT starts",
    },
    {
      id: `${state.state}-eft-era`,
      state: state.state,
      domain: "payer_eft_era",
      requirement: "Payer EFT/ERA enrollment and remittance posting route",
      owner: "India RCM",
      status: state.state === "WA" ? "in_progress" : "pending",
      dueInDays: 21,
      penaltyRisk: "medium",
      nextAction: "Submit EFT/ERA forms and test ERA posting",
    },
    {
      id: `${state.state}-ledger`,
      state: state.state,
      domain: "accounting_ledger",
      requirement:
        "Accounting class/ledger by state, payer, center, client, and provider",
      owner: "CPA",
      status: "in_progress",
      dueInDays: 10,
      penaltyRisk: "medium",
      nextAction: "Create accounting classes and map payroll/claims feeds",
    },
    {
      id: `${state.state}-bcba-license`,
      state: state.state,
      domain: "bcba_license",
      requirement:
        "Owner BCBA license/permission active for the state and service setting",
      owner: "Credentialing",
      status: state.bcbaLicenseStatus,
      dueInDays: state.state === "CT" ? 1 : 30,
      renewalInDays:
        state.state === "WA" ? 290 : state.state === "MO" ? 210 : undefined,
      penaltyRisk: state.state === "CT" ? "high" : "medium",
      nextAction:
        "Verify license, expiry, telehealth privilege, and payer credentialing linkage",
    },
    {
      id: `${state.state}-payer-credentialing`,
      state: state.state,
      domain: "payer_credentialing",
      requirement:
        "Billing/rendering provider effective with Medicaid/MCO/commercial payer",
      owner: "Credentialing",
      status: state.payerCredentialingStatus,
      dueInDays: state.state === "CT" ? 2 : 18,
      penaltyRisk: state.state === "CT" ? "high" : "medium",
      nextAction: "Store effective date before scheduling billable services",
    },
    {
      id: `${state.state}-telehealth`,
      state: state.state,
      domain: "telehealth_rule",
      requirement:
        "Remote supervision/parent-training rule verified by payer authorization",
      owner: "India RCM",
      status: state.telehealthStatus,
      dueInDays: state.state === "WA" ? 7 : 5,
      penaltyRisk: state.telehealthStatus === "blocked" ? "high" : "medium",
      nextAction:
        state.state === "WA"
          ? "Store WAC/HCA/MCO rule, POS/modifier, and authorization evidence"
          : "Call payer and obtain written mode/code confirmation before online billing",
    },
  ]);

export function buildComplianceSummaries(): ComplianceSummary[] {
  return (["WA", "ND", "CT", "MO"] as const).map((state) => {
    const items = complianceRequirements.filter((item) => item.state === state);
    const blocked = items.filter((item) => item.status === "blocked").length;
    const dueSoon = items.filter((item) => item.dueInDays <= 7).length;
    const highRisk = items.filter((item) => item.penaltyRisk === "high").length;
    const complete = items.filter((item) => item.status === "complete").length;
    const status =
      blocked > 0 ? "blocked" : dueSoon > 0 || highRisk > 0 ? "watch" : "ready";

    return {
      state,
      total: items.length,
      complete,
      blocked,
      dueSoon,
      highRisk,
      status,
    };
  });
}
