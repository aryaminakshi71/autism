export type ClaimState = "WA" | "ND" | "CT" | "MO";
export type ClaimServiceType = "rbt_direct" | "bcba_supervision" | "bcba_parent_training" | "assessment";
export type ClaimReadinessStatus = "ready" | "hold" | "blocked";
export type CallQueueDomain =
  | "payer_claim"
  | "authorization"
  | "client_attendance"
  | "rbt_documentation"
  | "center_operations"
  | "referral_partner";

export interface PayerRateRule {
  state: ClaimState;
  payer: string;
  serviceType: ClaimServiceType;
  cpt: string;
  modifier: string;
  placeOfService: string;
  collectedRatePerHour: number;
  unitMinutes: number;
  verificationStatus: "placeholder" | "payer_verified";
}

export interface SessionClaimInput {
  id: string;
  client: string;
  state: ClaimState;
  center: string;
  payer: string;
  referralPartner: string;
  serviceDate: string;
  serviceType: ClaimServiceType;
  provider: string;
  startTime: string;
  endTime: string;
  minutes: number;
  dataCollected: boolean;
  rbtNoteSigned: boolean;
  bcbaNoteSigned: boolean;
  parentSignature: boolean;
  authorizationNumber: string | null;
  unitsRemaining: number;
  treatmentPlanActive: boolean;
  supervisionLinkComplete: boolean;
  diagnosisPresent: boolean;
  rateVerified: boolean;
}

export interface ClaimReadinessResult {
  sessionId: string;
  client: string;
  state: ClaimState;
  center: string;
  payer: string;
  referralPartner: string;
  serviceType: ClaimServiceType;
  cpt: string;
  units: number;
  expectedAmount: number;
  status: ClaimReadinessStatus;
  blockers: string[];
  warnings: string[];
  nextOwner: "RBT" | "BCBA" | "India RCM" | "Owner";
}

export interface CallCenterWorkItem {
  id: string;
  domain: CallQueueDomain;
  priority: "low" | "medium" | "high";
  state: ClaimState;
  center: string;
  client: string;
  payer: string;
  referralPartner: string;
  owner: "India RCM" | "BCBA" | "Owner" | "Center Lead";
  issue: string;
  scriptGoal: string;
  requiredFields: string[];
  escalationRule: string;
}

export const payerRateRules: PayerRateRule[] = [
  {
    state: "WA",
    payer: "Washington Apple Health / ProviderOne",
    serviceType: "rbt_direct",
    cpt: "97153",
    modifier: "HN",
    placeOfService: "11/12 as authorized",
    collectedRatePerHour: 70,
    unitMinutes: 15,
    verificationStatus: "placeholder",
  },
  {
    state: "WA",
    payer: "Washington Apple Health / ProviderOne",
    serviceType: "bcba_supervision",
    cpt: "97155",
    modifier: "HO",
    placeOfService: "11/12 as authorized",
    collectedRatePerHour: 140,
    unitMinutes: 15,
    verificationStatus: "placeholder",
  },
  {
    state: "ND",
    payer: "North Dakota Medicaid",
    serviceType: "rbt_direct",
    cpt: "97153",
    modifier: "HN",
    placeOfService: "11/12 as authorized",
    collectedRatePerHour: 68,
    unitMinutes: 15,
    verificationStatus: "placeholder",
  },
  {
    state: "ND",
    payer: "North Dakota Medicaid",
    serviceType: "bcba_supervision",
    cpt: "97155",
    modifier: "HO",
    placeOfService: "11/12 as authorized",
    collectedRatePerHour: 135,
    unitMinutes: 15,
    verificationStatus: "placeholder",
  },
  {
    state: "CT",
    payer: "Connecticut Medical Assistance Program / HUSKY",
    serviceType: "rbt_direct",
    cpt: "97153",
    modifier: "HN",
    placeOfService: "11/12 as authorized",
    collectedRatePerHour: 72,
    unitMinutes: 15,
    verificationStatus: "placeholder",
  },
  {
    state: "CT",
    payer: "Connecticut Medical Assistance Program / HUSKY",
    serviceType: "bcba_supervision",
    cpt: "97155",
    modifier: "HO",
    placeOfService: "11/12 as authorized",
    collectedRatePerHour: 145,
    unitMinutes: 15,
    verificationStatus: "placeholder",
  },
  {
    state: "MO",
    payer: "MO HealthNet",
    serviceType: "rbt_direct",
    cpt: "97153",
    modifier: "HN",
    placeOfService: "11/12 as authorized",
    collectedRatePerHour: 66,
    unitMinutes: 15,
    verificationStatus: "placeholder",
  },
  {
    state: "MO",
    payer: "MO HealthNet",
    serviceType: "bcba_supervision",
    cpt: "97155",
    modifier: "HO",
    placeOfService: "11/12 as authorized",
    collectedRatePerHour: 132,
    unitMinutes: 15,
    verificationStatus: "placeholder",
  },
];

export const sessionClaimInputs: SessionClaimInput[] = [
  {
    id: "sess-wa-rbt-001",
    client: "Client WA-01",
    state: "WA",
    center: "WA Center",
    payer: "Washington Apple Health / ProviderOne",
    referralPartner: "Dr. Smith Pediatrics",
    serviceDate: "2026-07-03",
    serviceType: "rbt_direct",
    provider: "RBT WA-1",
    startTime: "09:00",
    endTime: "15:00",
    minutes: 360,
    dataCollected: true,
    rbtNoteSigned: true,
    bcbaNoteSigned: false,
    parentSignature: true,
    authorizationNumber: "WA-AUTH-001",
    unitsRemaining: 120,
    treatmentPlanActive: true,
    supervisionLinkComplete: true,
    diagnosisPresent: true,
    rateVerified: false,
  },
  {
    id: "sess-wa-bcba-001",
    client: "Client WA-01",
    state: "WA",
    center: "WA Center",
    payer: "Washington Apple Health / ProviderOne",
    referralPartner: "Dr. Smith Pediatrics",
    serviceDate: "2026-07-03",
    serviceType: "bcba_supervision",
    provider: "Owner BCBA",
    startTime: "15:00",
    endTime: "16:00",
    minutes: 60,
    dataCollected: true,
    rbtNoteSigned: true,
    bcbaNoteSigned: true,
    parentSignature: false,
    authorizationNumber: "WA-AUTH-001",
    unitsRemaining: 12,
    treatmentPlanActive: true,
    supervisionLinkComplete: true,
    diagnosisPresent: true,
    rateVerified: false,
  },
  {
    id: "sess-ct-rbt-001",
    client: "Client CT-01",
    state: "CT",
    center: "CT Center",
    payer: "Connecticut Medical Assistance Program / HUSKY",
    referralPartner: "CT Developmental Clinic",
    serviceDate: "2026-07-03",
    serviceType: "rbt_direct",
    provider: "RBT CT-1",
    startTime: "10:00",
    endTime: "14:00",
    minutes: 240,
    dataCollected: true,
    rbtNoteSigned: false,
    bcbaNoteSigned: false,
    parentSignature: true,
    authorizationNumber: "CT-AUTH-001",
    unitsRemaining: 4,
    treatmentPlanActive: true,
    supervisionLinkComplete: false,
    diagnosisPresent: true,
    rateVerified: false,
  },
  {
    id: "sess-mo-bcba-001",
    client: "Client MO-01",
    state: "MO",
    center: "MO Center",
    payer: "MO HealthNet",
    referralPartner: "MO Early Referral Network",
    serviceDate: "2026-07-03",
    serviceType: "bcba_supervision",
    provider: "Owner BCBA",
    startTime: "12:00",
    endTime: "13:00",
    minutes: 60,
    dataCollected: false,
    rbtNoteSigned: true,
    bcbaNoteSigned: true,
    parentSignature: true,
    authorizationNumber: null,
    unitsRemaining: 0,
    treatmentPlanActive: true,
    supervisionLinkComplete: true,
    diagnosisPresent: true,
    rateVerified: false,
  },
];

function findRateRule(session: SessionClaimInput) {
  return payerRateRules.find(
    (rule) =>
      rule.state === session.state &&
      rule.payer === session.payer &&
      rule.serviceType === session.serviceType,
  );
}

export function buildClaimReadinessQueue(): ClaimReadinessResult[] {
  return sessionClaimInputs.map((session) => {
    const rateRule = findRateRule(session);
    const blockers: string[] = [];
    const warnings: string[] = [];

    if (!session.authorizationNumber) blockers.push("Missing authorization number");
    if (session.unitsRemaining <= 0) blockers.push("No authorization units remaining");
    if (!session.treatmentPlanActive) blockers.push("Treatment plan inactive");
    if (!session.diagnosisPresent) blockers.push("Diagnosis missing");
    if (!rateRule) blockers.push("No payer rate rule for state/payer/service");
    if (!session.rateVerified || rateRule?.verificationStatus !== "payer_verified") {
      warnings.push("Rate/modifier is placeholder until payer contract is verified");
    }

    if (session.serviceType === "rbt_direct") {
      if (!session.dataCollected) blockers.push("RBT data missing");
      if (!session.rbtNoteSigned) blockers.push("RBT session note unsigned");
      if (!session.parentSignature) warnings.push("Parent signature missing");
    } else {
      if (!session.bcbaNoteSigned) blockers.push("BCBA claim note unsigned");
      if (!session.supervisionLinkComplete) blockers.push("Supervision link missing");
    }

    const units = rateRule ? Math.ceil(session.minutes / rateRule.unitMinutes) : 0;
    const expectedAmount = rateRule
      ? (session.minutes / 60) * rateRule.collectedRatePerHour
      : 0;
    const status: ClaimReadinessStatus =
      blockers.length > 0 ? "blocked" : warnings.length > 0 ? "hold" : "ready";
    const nextOwner =
      blockers.some((item) => item.includes("RBT")) ? "RBT" :
      blockers.some((item) => item.includes("BCBA") || item.includes("Supervision")) ? "BCBA" :
      blockers.length > 0 || warnings.length > 0 ? "India RCM" :
      "Owner";

    return {
      sessionId: session.id,
      client: session.client,
      state: session.state,
      center: session.center,
      payer: session.payer,
      referralPartner: session.referralPartner,
      serviceType: session.serviceType,
      cpt: rateRule?.cpt ?? "MISSING",
      units,
      expectedAmount,
      status,
      blockers,
      warnings,
      nextOwner,
    };
  });
}

export function buildCallCenterWorkQueue(): CallCenterWorkItem[] {
  const claimItems = buildClaimReadinessQueue()
    .filter((claim) => claim.status !== "ready")
    .map<CallCenterWorkItem>((claim) => ({
      id: `call-${claim.sessionId}`,
      domain: claim.status === "blocked" ? "rbt_documentation" : "payer_claim",
      priority: claim.status === "blocked" ? "high" : "medium",
      state: claim.state,
      center: claim.center,
      client: claim.client,
      payer: claim.payer,
      referralPartner: claim.referralPartner,
      owner: claim.nextOwner === "RBT" || claim.nextOwner === "BCBA" ? claim.nextOwner : "India RCM",
      issue: [...claim.blockers, ...claim.warnings].join("; "),
      scriptGoal:
        claim.status === "blocked"
          ? "Resolve missing documentation before claim release."
          : "Verify rate, modifier, authorization, or payer rule before claim submission.",
      requiredFields: [
        "client",
        "date of service",
        "payer",
        "authorization",
        "CPT",
        "units",
        "reference number",
      ],
      escalationRule:
        "Escalate to owner BCBA if not resolved same day for documentation or within 48 hours for payer verification.",
    }));

  return [
    ...claimItems,
    {
      id: "call-center-attendance-wa-01",
      domain: "client_attendance",
      priority: "medium",
      state: "WA",
      center: "WA Center",
      client: "Client WA-01",
      payer: "Washington Apple Health / ProviderOne",
      referralPartner: "Dr. Smith Pediatrics",
      owner: "India RCM",
      issue: "Delivered direct hours below 30-hour retention target this week.",
      scriptGoal:
        "Confirm parent schedule barriers and offer make-up blocks before the RBT loses hours.",
      requiredFields: [
        "scheduled hours",
        "delivered hours",
        "missed reason",
        "make-up offered",
        "parent confirmation",
      ],
      escalationRule:
        "Escalate to BCBA if two missed blocks occur in one week or parent cannot commit to 30 hours.",
    },
    {
      id: "call-center-referral-ct-01",
      domain: "referral_partner",
      priority: "low",
      state: "CT",
      center: "CT Center",
      client: "Client CT-01",
      payer: "Connecticut Medical Assistance Program / HUSKY",
      referralPartner: "CT Developmental Clinic",
      owner: "India RCM",
      issue: "Referral packet missing updated diagnostic report for authorization renewal.",
      scriptGoal:
        "Request missing diagnostic or clinical referral document and log expected receipt date.",
      requiredFields: [
        "referral contact",
        "document requested",
        "secure delivery method",
        "expected receipt date",
      ],
      escalationRule:
        "Escalate to owner if referral partner does not respond within three business days.",
    },
  ];
}
