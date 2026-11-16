export type PayerState = "WA" | "ND" | "CT" | "MO";
export type PayerCategory = "medicaid_ffs" | "medicaid_mco" | "aso" | "commercial" | "private_pay";

export interface PayerTemplate {
  id: string;
  state: PayerState;
  payerName: string;
  category: PayerCategory;
  portal: string;
  enrollmentTemplate: string[];
  authorizationTemplate: string[];
  claimTemplate: string[];
  followUpTemplate: string[];
  status: "starter" | "needs_verification";
}

const defaultEnrollment = [
  "Provider legal name, DBA, EIN, NPI Type 1/Type 2",
  "BCBA state license and BACB certificate",
  "Professional liability insurance",
  "W-9, EFT, ERA, CAQH/DataSpring profile",
  "Service location, taxonomy, contact, credentialing owner",
];

const defaultAuthorization = [
  "Patient demographics and member ID",
  "Diagnosis and assessment summary",
  "Treatment plan with goals, hours, CPT codes, setting, start/end dates",
  "Parent/caregiver consent where required",
  "BCBA signature and supporting clinical documentation",
];

const defaultClaim = [
  "Patient/member ID and payer",
  "Rendering provider, billing provider, NPI, taxonomy",
  "Date of service, CPT, modifier, units, place of service",
  "Authorization number when required",
  "Signed session note and supervision compliance check",
];

const defaultFollowUp = [
  "Claim number or clearinghouse trace",
  "Date of service, billed amount, CPT/modifier",
  "Authorization number",
  "Payer representative, reference number, next action",
  "Denial reason, appeal deadline, document request",
];

export const payerTemplates: PayerTemplate[] = [
  {
    id: "wa-apple-health-providerone",
    state: "WA",
    payerName: "Washington Apple Health / ProviderOne",
    category: "medicaid_ffs",
    portal: "ProviderOne",
    enrollmentTemplate: defaultEnrollment,
    authorizationTemplate: defaultAuthorization,
    claimTemplate: defaultClaim,
    followUpTemplate: defaultFollowUp,
    status: "starter",
  },
  ...[
    "Community Health Plan of Washington",
    "Coordinated Care of Washington",
    "Molina Healthcare of Washington",
    "UnitedHealthcare Community Plan of Washington",
    "Wellpoint Washington",
  ].map((payer) => ({
    id: `wa-${payer.toLowerCase().replaceAll(" ", "-")}`,
    state: "WA" as const,
    payerName: payer,
    category: "medicaid_mco" as const,
    portal: "Payer/provider portal plus ProviderOne checks",
    enrollmentTemplate: defaultEnrollment,
    authorizationTemplate: defaultAuthorization,
    claimTemplate: defaultClaim,
    followUpTemplate: defaultFollowUp,
    status: "needs_verification" as const,
  })),
  {
    id: "nd-medicaid",
    state: "ND",
    payerName: "North Dakota Medicaid",
    category: "medicaid_ffs",
    portal: "ND Medicaid provider portal",
    enrollmentTemplate: defaultEnrollment,
    authorizationTemplate: defaultAuthorization,
    claimTemplate: defaultClaim,
    followUpTemplate: defaultFollowUp,
    status: "starter",
  },
  {
    id: "nd-bcbs-medicaid-expansion",
    state: "ND",
    payerName: "BCBSND Medicaid Expansion",
    category: "medicaid_mco",
    portal: "BCBSND provider portal",
    enrollmentTemplate: defaultEnrollment,
    authorizationTemplate: defaultAuthorization,
    claimTemplate: defaultClaim,
    followUpTemplate: defaultFollowUp,
    status: "needs_verification",
  },
  {
    id: "ct-cmap-husky",
    state: "CT",
    payerName: "Connecticut Medical Assistance Program / HUSKY",
    category: "medicaid_ffs",
    portal: "CTDSSMAP / Gainwell",
    enrollmentTemplate: defaultEnrollment,
    authorizationTemplate: defaultAuthorization,
    claimTemplate: defaultClaim,
    followUpTemplate: defaultFollowUp,
    status: "starter",
  },
  {
    id: "ct-husky-aso",
    state: "CT",
    payerName: "HUSKY Health / ASO workflow",
    category: "aso",
    portal: "HUSKY Health provider resources",
    enrollmentTemplate: defaultEnrollment,
    authorizationTemplate: defaultAuthorization,
    claimTemplate: defaultClaim,
    followUpTemplate: defaultFollowUp,
    status: "needs_verification",
  },
  {
    id: "mo-healthnet-ffs",
    state: "MO",
    payerName: "MO HealthNet",
    category: "medicaid_ffs",
    portal: "MO HealthNet provider portal",
    enrollmentTemplate: defaultEnrollment,
    authorizationTemplate: defaultAuthorization,
    claimTemplate: defaultClaim,
    followUpTemplate: defaultFollowUp,
    status: "starter",
  },
  ...[
    "Home State Health",
    "Healthy Blue Missouri",
    "UnitedHealthcare Community Plan Missouri",
    "Show Me Healthy Kids",
  ].map((payer) => ({
    id: `mo-${payer.toLowerCase().replaceAll(" ", "-")}`,
    state: "MO" as const,
    payerName: payer,
    category: "medicaid_mco" as const,
    portal: "Payer/provider portal",
    enrollmentTemplate: defaultEnrollment,
    authorizationTemplate: defaultAuthorization,
    claimTemplate: defaultClaim,
    followUpTemplate: defaultFollowUp,
    status: "needs_verification" as const,
  })),
  ...["Aetna", "Anthem/Elevance", "Cigna/Evernorth", "UnitedHealthcare Commercial", "Blue Cross/Blue Shield local plan"].flatMap(
    (payer) =>
      (["WA", "ND", "CT", "MO"] as const).map((state) => ({
        id: `${state.toLowerCase()}-${payer.toLowerCase().replaceAll("/", "-").replaceAll(" ", "-")}`,
        state,
        payerName: payer,
        category: "commercial" as const,
        portal: "Commercial payer/provider portal",
        enrollmentTemplate: defaultEnrollment,
        authorizationTemplate: defaultAuthorization,
        claimTemplate: defaultClaim,
        followUpTemplate: defaultFollowUp,
        status: "needs_verification" as const,
      })),
  ),
];

export function getPayerCountsByState() {
  return (["WA", "ND", "CT", "MO"] as const).map((state) => ({
    state,
    count: payerTemplates.filter((payer) => payer.state === state).length,
    verified: payerTemplates.filter(
      (payer) => payer.state === state && payer.status === "starter",
    ).length,
  }));
}
