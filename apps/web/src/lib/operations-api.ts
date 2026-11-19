import { platformFetch } from "./platform-api-client";

export type OperationsSnapshot = {
  providers: Array<Record<string, unknown>>;
  licenses: Array<Record<string, unknown>>;
  payerCredentialing: Array<Record<string, unknown>>;
  authorizations: Array<Record<string, unknown>>;
  claims: Array<Record<string, unknown>>;
  claimEvents: Array<Record<string, unknown>>;
  hipaaAuditLogs: Array<Record<string, unknown>>;
  indiaRcmAccess: Array<Record<string, unknown>>;
  aiVideoAlerts: Array<Record<string, unknown>>;
  payerRateRules: Array<Record<string, unknown>>;
  scheduleBlocks: Array<Record<string, unknown>>;
  payrollTimeEntries: Array<Record<string, unknown>>;
  payerPaymentCycles: Array<Record<string, unknown>>;
  complianceRequirements: Array<Record<string, unknown>>;
  workItems: Array<Record<string, unknown>>;
  accountingLedgerEntries: Array<Record<string, unknown>>;
  rolePermissionPolicies: Array<Record<string, unknown>>;
  callLogs: Array<Record<string, unknown>>;
  claimScrubberRules: Array<Record<string, unknown>>;
  aiAlertReviewEvents: Array<Record<string, unknown>>;
  ledgerLinks: Array<Record<string, unknown>>;
  trainingCompletions: Array<Record<string, unknown>>;
};
export type OperationsEntity =
  | "providers"
  | "licenses"
  | "payerCredentialing"
  | "authorizations"
  | "payrollEntries"
  | "claims"
  | "ledgerEntries";

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Operations API failed with ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function getOperationsSnapshot(): Promise<OperationsSnapshot> {
  const response = await platformFetch("/api/v1/operations/snapshot", {
    headers: { "x-api-version": "1" },
  });

  return readJson<OperationsSnapshot>(response);
}

export async function completeOperationsWorkItem(id: string) {
  const response = await platformFetch(
    `/api/v1/operations/work-items/${encodeURIComponent(id)}/complete`,
    {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        "x-api-version": "1",
      },
      body: JSON.stringify({ id }),
    },
  );

  return readJson<{ id: string; ok: boolean }>(response);
}

export async function createOperationsRecord(input: {
  entity: OperationsEntity;
  record: Record<string, unknown>;
}) {
  const response = await platformFetch("/api/v1/operations/records", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-version": "1",
    },
    body: JSON.stringify(input),
  });

  return readJson<{ id: string; ok: boolean }>(response);
}

export async function updateOperationsRecord(input: {
  entity: OperationsEntity;
  id: string;
  record: Record<string, unknown>;
}) {
  const response = await platformFetch(
    `/api/v1/operations/records/${input.entity}/${encodeURIComponent(input.id)}`,
    {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        "x-api-version": "1",
      },
      body: JSON.stringify(input),
    },
  );

  return readJson<{ id: string; ok: boolean }>(response);
}

export async function deleteOperationsRecord(input: {
  entity: OperationsEntity;
  id: string;
}) {
  const response = await platformFetch(
    `/api/v1/operations/records/${input.entity}/${encodeURIComponent(input.id)}`,
    {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        "x-api-version": "1",
      },
      body: JSON.stringify(input),
    },
  );

  return readJson<{ id: string; ok: boolean }>(response);
}

export async function seedOperationsLaunchData() {
  const response = await platformFetch("/api/v1/operations/seed-launch-data", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-version": "1",
    },
    body: JSON.stringify({}),
  });

  return readJson<{ ok: boolean; created: number; skipped: number }>(response);
}

export async function submitOperationsClaim(id: string) {
  const response = await platformFetch(
    `/api/v1/operations/claims/${encodeURIComponent(id)}/submit`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-version": "1",
      },
      body: JSON.stringify({}),
    },
  );

  return readJson<{ id: string; ok: boolean }>(response);
}

export async function postOperationsClaimPayment(input: {
  id: string;
  paidCents: number;
  allowedCents?: number;
}) {
  const response = await platformFetch(
    `/api/v1/operations/claims/${encodeURIComponent(input.id)}/payment`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-version": "1",
      },
      body: JSON.stringify(input),
    },
  );

  return readJson<{ id: string; ok: boolean }>(response);
}

export async function denyOperationsClaim(input: {
  id: string;
  denialReason: string;
}) {
  const response = await platformFetch(
    `/api/v1/operations/claims/${encodeURIComponent(input.id)}/denial`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-version": "1",
      },
      body: JSON.stringify(input),
    },
  );

  return readJson<{ id: string; ok: boolean }>(response);
}

export async function followUpOperationsClaim(input: {
  id: string;
  summary?: string;
  referenceNumber?: string;
  nextAction?: string;
}) {
  const response = await platformFetch(
    `/api/v1/operations/claims/${encodeURIComponent(input.id)}/follow-up`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-version": "1",
      },
      body: JSON.stringify(input),
    },
  );

  return readJson<{ id: string; ok: boolean }>(response);
}

export async function createOperationsCallLog(input: {
  claimId?: string;
  authorizationId?: string;
  patientId?: string;
  state: string;
  payerName?: string;
  callType:
    | "claim_status"
    | "authorization_status"
    | "credentialing"
    | "parent_admin";
  callerName?: string;
  phoneNumberLabel?: string;
  payerRepresentative: string;
  referenceNumber: string;
  disposition: string;
  summary: string;
  nextAction?: string;
  followUpDate?: string;
  minimumNecessaryFields?: string[];
  escalationRequired?: boolean;
  escalatedTo?: string;
}) {
  const response = await platformFetch("/api/v1/operations/call-logs", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-version": "1",
    },
    body: JSON.stringify(input),
  });

  return readJson<{ id: string; ok: boolean }>(response);
}

export async function reviewOperationsAiAlert(input: {
  alertId: string;
  decision:
    | "confirmed_safety_event"
    | "false_positive"
    | "monitor"
    | "training_issue";
  falsePositiveReason?: string;
  clinicalAction?: string;
  claimHoldAfterReview?: boolean;
}) {
  const response = await platformFetch("/api/v1/operations/ai-alerts/review", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-version": "1",
    },
    body: JSON.stringify(input),
  });

  return readJson<{ id: string; ok: boolean }>(response);
}

export async function completeOperationsTraining(input: {
  id: string;
  competencyScore: number;
  signatureName: string;
}) {
  const response = await platformFetch(
    `/api/v1/operations/training-completions/${encodeURIComponent(input.id)}/complete`,
    {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        "x-api-version": "1",
      },
      body: JSON.stringify(input),
    },
  );

  return readJson<{ id: string; ok: boolean }>(response);
}
