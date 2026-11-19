import {
  buildCallCenterWorkQueue,
  buildClaimReadinessQueue,
} from "./operations-claims";
import { complianceRequirements } from "./operations-compliance";
import { buildBiweeklyPayrollSummaries } from "./operations-payroll";
import { stateSchedulingRules } from "./operations-scheduler";

export type WorkItemDomain =
  | "claim"
  | "payroll"
  | "credentialing"
  | "telehealth"
  | "call_center"
  | "accounting";
export type WorkItemState = "WA" | "ND" | "CT" | "MO";
export type WorkItemPriority = "low" | "medium" | "high";

export interface OperationsWorkItem {
  id: string;
  state: WorkItemState;
  domain: WorkItemDomain;
  priority: WorkItemPriority;
  owner: string;
  title: string;
  detail: string;
  dueInDays: number;
  blocks: string;
  source: string;
}

function mapPenaltyToPriority(value: "low" | "medium" | "high") {
  return value;
}

export function buildOperationsWorkItems(): OperationsWorkItem[] {
  const complianceItems = complianceRequirements
    .filter((item) => item.status !== "complete")
    .map<OperationsWorkItem>((item) => ({
      id: `compliance-${item.id}`,
      state: item.state,
      domain:
        item.domain === "telehealth_rule"
          ? "telehealth"
          : item.domain === "accounting_ledger"
            ? "accounting"
            : item.domain === "payer_credentialing" ||
                item.domain === "bcba_license" ||
                item.domain === "rbt_credential"
              ? "credentialing"
              : "payroll",
      priority: mapPenaltyToPriority(item.penaltyRisk),
      owner: item.owner,
      title: item.requirement,
      detail: item.nextAction,
      dueInDays: item.dueInDays,
      blocks:
        item.domain === "telehealth_rule"
          ? "Remote BCBA billing"
          : item.domain === "payer_eft_era"
            ? "Payment posting"
            : item.domain === "workers_comp"
              ? "Employee start"
              : "State launch",
      source: item.domain,
    }));

  const claimItems = buildClaimReadinessQueue()
    .filter((claim) => claim.status !== "ready")
    .map<OperationsWorkItem>((claim) => ({
      id: `claim-${claim.sessionId}`,
      state: claim.state,
      domain: "claim",
      priority: claim.status === "blocked" ? "high" : "medium",
      owner: claim.nextOwner,
      title: `${claim.client} ${claim.serviceType} claim not releasable`,
      detail: [...claim.blockers, ...claim.warnings].join("; "),
      dueInDays: claim.status === "blocked" ? 0 : 2,
      blocks: "Claim release",
      source: claim.payer,
    }));

  const payrollItems = buildBiweeklyPayrollSummaries()
    .filter((summary) => summary.status !== "ready")
    .map<OperationsWorkItem>((summary) => ({
      id: `payroll-${summary.staff}-${summary.state}`,
      state: summary.state,
      domain: "payroll",
      priority: summary.status === "blocked" ? "high" : "medium",
      owner: "Payroll vendor",
      title: `${summary.staff} payroll has ${summary.documentationHoldHours} documentation-hold hours`,
      detail:
        "Resolve signed notes and claim readiness before treating billable hours as collectible revenue.",
      dueInDays: 1,
      blocks: "Payroll-to-claims reconciliation",
      source: "biweekly payroll",
    }));

  const callCenterItems = buildCallCenterWorkQueue().map<OperationsWorkItem>(
    (item) => ({
      id: `call-${item.id}`,
      state: item.state,
      domain: "call_center",
      priority: item.priority,
      owner: item.owner,
      title: item.issue,
      detail: item.scriptGoal,
      dueInDays:
        item.priority === "high" ? 0 : item.priority === "medium" ? 2 : 5,
      blocks: item.domain.replaceAll("_", " "),
      source: `${item.payer} / ${item.referralPartner}`,
    }),
  );

  const telehealthItems = stateSchedulingRules
    .filter(
      (rule) =>
        rule.remoteSupervisionMode === "verify_before_use" ||
        rule.parentTrainingMode === "verify_before_use",
    )
    .map<OperationsWorkItem>((rule) => ({
      id: `telehealth-${rule.state}`,
      state: rule.state,
      domain: "telehealth",
      priority: "high",
      owner: "India RCM",
      title: `${rule.state} online BCBA supervision/parent training not verified`,
      detail: rule.remoteRequirements.join("; "),
      dueInDays: 3,
      blocks: "Remote scheduling and billing",
      source: rule.verificationSource,
    }));

  return [
    ...complianceItems,
    ...claimItems,
    ...payrollItems,
    ...callCenterItems,
    ...telehealthItems,
  ].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return (
      priorityOrder[a.priority] - priorityOrder[b.priority] ||
      a.dueInDays - b.dueInDays ||
      a.state.localeCompare(b.state)
    );
  });
}

export function summarizeWorkItems(items: OperationsWorkItem[]) {
  return {
    total: items.length,
    high: items.filter((item) => item.priority === "high").length,
    dueToday: items.filter((item) => item.dueInDays <= 0).length,
    byState: (["WA", "ND", "CT", "MO"] as const).map((state) => ({
      state,
      count: items.filter((item) => item.state === state).length,
      high: items.filter(
        (item) => item.state === state && item.priority === "high",
      ).length,
    })),
  };
}
