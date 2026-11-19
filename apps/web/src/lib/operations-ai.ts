export type OperationsStatus = "ready" | "watch" | "blocked";
export type OperationsSeverity = "low" | "medium" | "high";
export type OperationsDomain =
  | "credentialing"
  | "authorization"
  | "claims"
  | "supervision"
  | "hipaa"
  | "video";

export type ProviderRole =
  | "owner_bcba"
  | "bcba"
  | "bcaba"
  | "learner_bcba"
  | "rbt"
  | "rcm";

export interface ProviderProfile {
  id: string;
  name: string;
  role: ProviderRole;
  states: string[];
  activeClients: number;
  supervisionLoad: number;
  status: OperationsStatus;
}

export interface StateLicense {
  providerId: string;
  state: string;
  licenseNumber: string;
  expiresInDays: number;
  status: OperationsStatus;
}

export interface PayerCredentialing {
  providerId: string;
  payer: string;
  state: string;
  effective: boolean;
  status: OperationsStatus;
}

export interface AuthorizationRecord {
  id: string;
  patient: string;
  payer: string;
  state: string;
  cpt: string;
  unitsRemaining: number;
  expiresInDays: number;
}

export interface ClaimRecord {
  id: string;
  payer: string;
  state: string;
  ageDays: number;
  status: string;
  denialReason?: string;
}

export interface SupervisionRecord {
  rbt: string;
  supervisingBcba: string;
  month: string;
  supervisionPercent: number;
  directObservationDone: boolean;
}

export interface AccessReviewRecord {
  user: string;
  role: string;
  country: string;
  lastReviewedDaysAgo: number;
  hasMfa: boolean;
  minimumNecessary: boolean;
}

export interface VideoAlertRecord {
  child: string;
  state: string;
  severity: OperationsSeverity;
  signal: string;
  humanReviewed: boolean;
  minutesOpen: number;
}

export interface AiTriageRecommendation {
  id: string;
  domain: OperationsDomain;
  severity: OperationsSeverity;
  title: string;
  finding: string;
  action: string;
  owner: string;
}

export const providerProfiles: ProviderProfile[] = [
  {
    id: "provider-owner",
    name: "Owner BCBA",
    role: "owner_bcba",
    states: ["WA", "ND", "CT", "MO"],
    activeClients: 4,
    supervisionLoad: 7,
    status: "watch",
  },
  {
    id: "provider-bcba-b",
    name: "BCBA B",
    role: "bcba",
    states: ["WA", "MO"],
    activeClients: 2,
    supervisionLoad: 3,
    status: "watch",
  },
  {
    id: "provider-learner",
    name: "Learner BCBA",
    role: "learner_bcba",
    states: ["WA"],
    activeClients: 0,
    supervisionLoad: 0,
    status: "ready",
  },
  {
    id: "provider-rbt-1",
    name: "RBT WA-1",
    role: "rbt",
    states: ["WA"],
    activeClients: 1,
    supervisionLoad: 0,
    status: "ready",
  },
  {
    id: "provider-rcm-india",
    name: "India RCM",
    role: "rcm",
    states: ["WA", "ND", "CT", "MO"],
    activeClients: 4,
    supervisionLoad: 0,
    status: "watch",
  },
];

export const stateLicenses: StateLicense[] = [
  {
    providerId: "provider-owner",
    state: "WA",
    licenseNumber: "WA-TODO",
    expiresInDays: 290,
    status: "ready",
  },
  {
    providerId: "provider-owner",
    state: "ND",
    licenseNumber: "ND-TODO",
    expiresInDays: 120,
    status: "watch",
  },
  {
    providerId: "provider-owner",
    state: "CT",
    licenseNumber: "CT-TODO",
    expiresInDays: 0,
    status: "blocked",
  },
  {
    providerId: "provider-owner",
    state: "MO",
    licenseNumber: "MO-TODO",
    expiresInDays: 210,
    status: "ready",
  },
];

export const payerCredentialing: PayerCredentialing[] = [
  {
    providerId: "provider-owner",
    payer: "Apple Health MCO",
    state: "WA",
    effective: false,
    status: "blocked",
  },
  {
    providerId: "provider-owner",
    payer: "ND Medicaid",
    state: "ND",
    effective: true,
    status: "ready",
  },
  {
    providerId: "provider-owner",
    payer: "CT Medicaid ASD",
    state: "CT",
    effective: false,
    status: "blocked",
  },
  {
    providerId: "provider-owner",
    payer: "MO HealthNet",
    state: "MO",
    effective: false,
    status: "watch",
  },
];

export const authorizations: AuthorizationRecord[] = [
  {
    id: "auth-wa-01",
    patient: "Client WA-01",
    payer: "Apple Health MCO",
    state: "WA",
    cpt: "97153",
    unitsRemaining: 22,
    expiresInDays: 18,
  },
  {
    id: "auth-nd-01",
    patient: "Client ND-01",
    payer: "ND Medicaid",
    state: "ND",
    cpt: "97155",
    unitsRemaining: 6,
    expiresInDays: 9,
  },
  {
    id: "auth-mo-01",
    patient: "Client MO-01",
    payer: "MO HealthNet",
    state: "MO",
    cpt: "97153",
    unitsRemaining: 3,
    expiresInDays: 27,
  },
];

export const claimRecords: ClaimRecord[] = [
  {
    id: "WA-ABA-1007",
    payer: "Apple Health MCO",
    state: "WA",
    ageDays: 18,
    status: "No ERA yet",
  },
  {
    id: "ND-ABA-2041",
    payer: "ND Medicaid",
    state: "ND",
    ageDays: 9,
    status: "Portal accepted",
  },
  {
    id: "MO-ABA-8842",
    payer: "MO HealthNet",
    state: "MO",
    ageDays: 31,
    status: "Needs phone follow-up",
    denialReason: "processing delay",
  },
];

export const supervisionRecords: SupervisionRecord[] = [
  {
    rbt: "RBT WA-1",
    supervisingBcba: "Owner BCBA",
    month: "2026-07",
    supervisionPercent: 4.2,
    directObservationDone: true,
  },
  {
    rbt: "RBT MO-1",
    supervisingBcba: "Owner BCBA",
    month: "2026-07",
    supervisionPercent: 6.1,
    directObservationDone: false,
  },
];

export const accessReviews: AccessReviewRecord[] = [
  {
    user: "Software Engineer A",
    role: "software_admin",
    country: "India",
    lastReviewedDaysAgo: 34,
    hasMfa: true,
    minimumNecessary: false,
  },
  {
    user: "India RCM",
    role: "claim_follow_up",
    country: "India",
    lastReviewedDaysAgo: 12,
    hasMfa: true,
    minimumNecessary: true,
  },
  {
    user: "BCBA B",
    role: "clinical_qa",
    country: "United States",
    lastReviewedDaysAgo: 19,
    hasMfa: true,
    minimumNecessary: true,
  },
];

export const videoAlerts: VideoAlertRecord[] = [
  {
    child: "Client WA-01",
    state: "WA",
    severity: "high",
    signal: "Child out of camera frame for 38 seconds",
    humanReviewed: false,
    minutesOpen: 8,
  },
  {
    child: "Client CT-01",
    state: "CT",
    severity: "medium",
    signal: "Elevated vocal distress pattern",
    humanReviewed: false,
    minutesOpen: 42,
  },
  {
    child: "Client MO-01",
    state: "MO",
    severity: "low",
    signal: "Session note missing after video event",
    humanReviewed: true,
    minutesOpen: 0,
  },
];

export function generateOperationsAiRecommendations(): AiTriageRecommendation[] {
  const recommendations: AiTriageRecommendation[] = [];

  for (const license of stateLicenses) {
    if (license.status === "blocked" || license.expiresInDays <= 30) {
      recommendations.push({
        id: `license-${license.state}`,
        domain: "credentialing",
        severity: license.status === "blocked" ? "high" : "medium",
        title: `${license.state} license gate`,
        finding:
          license.status === "blocked"
            ? "Provider is not cleared for this state."
            : `License expires in ${license.expiresInDays} days.`,
        action:
          "Block scheduling and payer launch until license evidence is uploaded.",
        owner: "Owner BCBA",
      });
    }
  }

  for (const credential of payerCredentialing) {
    if (!credential.effective) {
      recommendations.push({
        id: `credential-${credential.state}-${credential.payer}`,
        domain: "credentialing",
        severity: credential.status === "blocked" ? "high" : "medium",
        title: `${credential.payer} credentialing`,
        finding: "Payer effective date is not confirmed.",
        action:
          "Hold new billable sessions for this payer until effective date is recorded.",
        owner: "Credentialing",
      });
    }
  }

  for (const authorization of authorizations) {
    if (
      authorization.unitsRemaining <= 8 ||
      authorization.expiresInDays <= 14
    ) {
      recommendations.push({
        id: `auth-${authorization.id}`,
        domain: "authorization",
        severity: authorization.unitsRemaining <= 4 ? "high" : "medium",
        title: `${authorization.patient} authorization risk`,
        finding: `${authorization.unitsRemaining} ${authorization.cpt} units remain; expires in ${authorization.expiresInDays} days.`,
        action: "Queue reauthorization packet and hold schedule expansion.",
        owner: "BCBA B + India RCM",
      });
    }
  }

  for (const claim of claimRecords) {
    if (claim.ageDays >= 14) {
      recommendations.push({
        id: `claim-${claim.id}`,
        domain: "claims",
        severity: claim.ageDays >= 30 ? "high" : "medium",
        title: `${claim.id} claim follow-up`,
        finding: `${claim.payer} claim is ${claim.ageDays} days old: ${claim.status}.`,
        action:
          "Place payer call, log reference number, and escalate if no adjudication date.",
        owner: "India RCM",
      });
    }
  }

  for (const supervision of supervisionRecords) {
    if (
      supervision.supervisionPercent < 5 ||
      !supervision.directObservationDone
    ) {
      recommendations.push({
        id: `supervision-${supervision.rbt}`,
        domain: "supervision",
        severity: supervision.supervisionPercent < 5 ? "high" : "medium",
        title: `${supervision.rbt} supervision gap`,
        finding: `${supervision.supervisionPercent}% supervision; direct observation ${
          supervision.directObservationDone ? "complete" : "missing"
        }.`,
        action:
          "Add BCBA observation before month close and block learner-only oversight.",
        owner: supervision.supervisingBcba,
      });
    }
  }

  for (const access of accessReviews) {
    if (
      !access.hasMfa ||
      !access.minimumNecessary ||
      access.lastReviewedDaysAgo > 30
    ) {
      recommendations.push({
        id: `access-${access.user}`,
        domain: "hipaa",
        severity:
          !access.hasMfa || !access.minimumNecessary ? "high" : "medium",
        title: `${access.user} access review`,
        finding: `${access.role} access from ${access.country}; last reviewed ${access.lastReviewedDaysAgo} days ago.`,
        action:
          "Review role, remove unnecessary PHI access, and record access-review decision.",
        owner: "Security owner",
      });
    }
  }

  for (const alert of videoAlerts) {
    if (!alert.humanReviewed) {
      recommendations.push({
        id: `video-${alert.child}`,
        domain: "video",
        severity: alert.severity,
        title: `${alert.child} video alert`,
        finding: `${alert.signal}; open for ${alert.minutesOpen} minutes.`,
        action:
          alert.severity === "high"
            ? "Require immediate RBT confirmation and BCBA review."
            : "Queue same-day BCBA review before claim release.",
        owner: "Owner BCBA",
      });
    }
  }

  return recommendations.sort((a, b) => {
    const rank = { high: 0, medium: 1, low: 2 };
    return rank[a.severity] - rank[b.severity];
  });
}
