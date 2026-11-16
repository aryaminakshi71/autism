"use client";

import {
  accessReviews,
  authorizations,
  generateOperationsAiRecommendations,
  providerProfiles,
  supervisionRecords,
} from "@/lib/operations-ai";
import {
  buildCallCenterWorkQueue,
  buildClaimReadinessQueue,
  payerRateRules,
} from "@/lib/operations-claims";
import {
  buildComplianceSummaries,
  complianceRequirements,
} from "@/lib/operations-compliance";
import {
  childProgressSnapshots,
  calculateCompanyReadiness,
  appImprovementRoadmap,
  callRecordingConsentRules,
  companyConfigurationTasks,
  companyLaunchPhases,
  companyOperatingProfile,
  companyPayerConfigurations,
  companyRoleAccess,
  companySetupGates,
  companyStateConfigurations,
  competitorFeatureGaps,
  indiaCallCenterOperatingRules,
  indiaCallCenterQaMetrics,
  indiaCallCenterShifts,
  indiaCallScripts,
  offshoreDeviceControls,
  offshoreEscalationRoutes,
  portalExperiences,
  recordRetentionPolicies,
  retentionInventoryItems,
  stateExpansionReadiness,
  summarizeRetentionReadiness,
  supportedUsStates,
  trainingModules,
  usCallingInfrastructure,
  usCallingVendorReadiness,
} from "@/lib/operations-enterprise";
import {
  backOfficeModelLabels,
  buildBcbaCapacityScenarios,
  buildFinanceResults,
  buildHighHourRetentionScenarios,
  buildRevenueSensitivity,
  buildTimeZoneOperatingWindows,
  formatCurrency,
  formatPercent,
} from "@/lib/operations-finance";
import { medicaidRequirementSnapshots } from "@/lib/operations-medicaid";
import {
  completeOperationsWorkItem,
  completeOperationsTraining,
  createOperationsCallLog,
  createOperationsRecord,
  deleteOperationsRecord,
  denyOperationsClaim,
  getOperationsSnapshot,
  postOperationsClaimPayment,
  reviewOperationsAiAlert,
  seedOperationsLaunchData,
  submitOperationsClaim,
  updateOperationsRecord,
  type OperationsEntity,
  type OperationsSnapshot,
} from "@/lib/operations-api";
import {
  buildBiweeklyPayrollSummaries,
  buildInternalPayrollLedger,
  buildPayrollExportFile,
  buildStateCashFlowSummaries,
  payerPaymentCycles,
  type PayrollExportFormat,
  payrollTimeEntries,
} from "@/lib/operations-payroll";
import { getPayerCountsByState, payerTemplates } from "@/lib/operations-payers";
import {
  buildStaffScheduleSummaries,
  buildWeeklyScheduleBlocks,
  stateSchedulingRules,
} from "@/lib/operations-scheduler";
import {
  buildOperationsWorkItems,
  summarizeWorkItems,
  type WorkItemDomain,
} from "@/lib/operations-workflow";
import {
  AlertTriangle,
  Archive,
  BadgeCheck,
  Banknote,
  Building2,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Download,
  FileCheck2,
  GraduationCap,
  Headphones,
  LayoutDashboard,
  LockKeyhole,
  PhoneCall,
  ReceiptText,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

type StateCode = "WA" | "ND" | "CT" | "MO";
type Status = "ready" | "watch" | "blocked";

const operationsCrudEntities: Array<{
  key: OperationsEntity;
  label: string;
  description: string;
}> = [
  {
    key: "providers",
    label: "Providers",
    description: "BCBA, RBT, learner, admin, and India RCM profiles.",
  },
  {
    key: "licenses",
    label: "Licenses",
    description: "State license, RBT credential, renewal, and evidence tracking.",
  },
  {
    key: "payerCredentialing",
    label: "Payer credentialing",
    description: "Medicaid, MCO, commercial, portal, and effective-date status.",
  },
  {
    key: "authorizations",
    label: "Authorizations",
    description: "Client, payer, CPT, approved units, used units, and auth window.",
  },
  {
    key: "payrollEntries",
    label: "Payroll entries",
    description: "Clock-in/out, paid minutes, billable minutes, and claim readiness.",
  },
  {
    key: "claims",
    label: "Claims",
    description: "Claim lifecycle, billed/paid amounts, denial, and follow-up date.",
  },
  {
    key: "ledgerEntries",
    label: "Ledger postings",
    description: "Internal accounting by state, center, client, provider, and source.",
  },
];

const companyActiveStateSet = new Set(companyOperatingProfile.activeStates);

const states: Array<{
  code: StateCode;
  name: string;
  clientCount: number;
  launch: Status;
  credentialing: Status;
  medicaid: Status;
  payroll: Status;
  nextAction: string;
}> = [
  {
    code: "WA",
    name: "Washington",
    clientCount: 1,
    launch: "watch",
    credentialing: "watch",
    medicaid: "blocked",
    payroll: "ready",
    nextAction: "Confirm Apple Health effective date before scheduling RBT hours.",
  },
  {
    code: "ND",
    name: "North Dakota",
    clientCount: 1,
    launch: "watch",
    credentialing: "ready",
    medicaid: "watch",
    payroll: "watch",
    nextAction: "Track ND Medicaid enrollment and payer portal access.",
  },
  {
    code: "CT",
    name: "Connecticut",
    clientCount: 1,
    launch: "blocked",
    credentialing: "blocked",
    medicaid: "blocked",
    payroll: "watch",
    nextAction: "Finish DSS/ASD agency credentialing packet before intake.",
  },
  {
    code: "MO",
    name: "Missouri",
    clientCount: 1,
    launch: "watch",
    credentialing: "watch",
    medicaid: "watch",
    payroll: "ready",
    nextAction: "Validate MO HealthNet documentation and timely note rules.",
  },
];

const aiAlerts = [
  {
    child: "Client WA-01",
    state: "WA",
    severity: "high",
    signal: "Child out of camera frame for 38 seconds",
    action: "Pause session and request live RBT confirmation.",
  },
  {
    child: "Client CT-01",
    state: "CT",
    severity: "medium",
    signal: "Elevated vocal distress pattern",
    action: "BCBA review clip and decide parent/RBT support.",
  },
  {
    child: "Client MO-01",
    state: "MO",
    severity: "low",
    signal: "Session note missing after video event",
    action: "Send documentation reminder before claim release.",
  },
];

const delegationLanes = [
  {
    lane: "India RCM Team",
    lead: "Software Engineer A",
    allowed:
      "Eligibility checks, claim status calls, denial queues, ERA matching, reporting.",
    blocked:
      "Clinical decisions, unsupervised PHI access, changing treatment plans.",
  },
  {
    lane: "Clinical Governance",
    lead: "BCBA B",
    allowed:
      "Protocol review, supervision audit, escalation triage, clinical QA.",
    blocked:
      "Billing decisions without payer documentation or state-specific rules.",
  },
  {
    lane: "Owner BCBA",
    lead: "You",
    allowed:
      "Final clinical oversight, risk sign-off, state launch decision, high-risk alerts.",
    blocked:
      "Delegating BCBA responsibility to AI or non-licensed back-office staff.",
  },
];

const hipaaControls = [
  "Business Associate Agreements for India software/RCM company, cloud vendors, video vendor, EHR, billing vendor.",
  "Minimum necessary access: India staff see claim and payer fields only unless PHI is required.",
  "Role-based access, MFA, audit logs, session timeout, device policy, and offboarding checklist.",
  "Encrypted video, storage, backups, and transmission; no consumer messaging for PHI.",
  "Written incident response plan with breach assessment, notification workflow, and evidence retention.",
  "Patient consent and notice language for video monitoring and AI-assisted safety alerts.",
];

const documentPacket = [
  {
    title: "State Launch Checklist",
    path: "docs/operations/STATE_LAUNCH_CHECKLIST.md",
    purpose: "Green-light each state before scheduling billable services.",
  },
  {
    title: "BCBA Readiness Memo",
    path: "docs/operations/BCBA_LEARNER_AND_APP_READINESS_MEMO.md",
    purpose: "Learner BCBA capacity limits and app readiness for scaling.",
  },
  {
    title: "HIPAA Operating Plan",
    path: "docs/operations/HIPAA_COMPLIANCE_OPERATING_PLAN.md",
    purpose: "Administrative, physical, technical, video, and offshore controls.",
  },
  {
    title: "India RCM SOP",
    path: "docs/operations/INDIA_RCM_CLAIMS_OPERATIONS_SOP.md",
    purpose: "Claims queues, denial categories, follow-up SLAs, and escalation.",
  },
  {
    title: "AI Video Safety SOP",
    path: "docs/operations/AI_VIDEO_MONITORING_SAFETY_SOP.md",
    purpose: "Human-reviewed alert workflow for RBT supervision and safety.",
  },
  {
    title: "Finance and P&L",
    path: "docs/operations/FINANCE_ENTITY_AND_PNL_MODEL.md",
    purpose: "US entity, India contractor/company decision, and 10-15 client P&L.",
  },
  {
    title: "Product Roadmap",
    path: "docs/operations/PRODUCT_GAP_ROADMAP.md",
    purpose: "Remaining software gaps before this can become a sellable SaaS.",
  },
];

function statusClasses(status: Status) {
  if (status === "ready") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "watch") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-rose-200 bg-rose-50 text-rose-700";
}

function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 font-semibold text-xs ${statusClasses(
        status,
      )}`}
    >
      {status}
    </span>
  );
}

function SeverityPill({ severity }: { severity: "low" | "medium" | "high" }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 font-semibold text-xs ${
        severity === "high"
          ? "bg-rose-50 text-rose-700"
          : severity === "medium"
            ? "bg-amber-50 text-amber-700"
            : "bg-slate-100 text-slate-700"
      }`}
    >
      {severity}
    </span>
  );
}

function toStringValue(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function toWorkItemPriority(value: unknown): "low" | "medium" | "high" {
  if (value === "low" || value === "medium" || value === "high") return value;
  if (value === "critical") return "high";
  return "medium";
}

function toDueInDays(value: unknown) {
  if (typeof value !== "string" || !value) return 3;
  const dueDate = new Date(value);
  if (Number.isNaN(dueDate.getTime())) return 3;
  const diffMs = dueDate.getTime() - Date.now();
  return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
}

function mapPersistedWorkItems(
  snapshot: OperationsSnapshot | undefined,
): ReturnType<typeof buildOperationsWorkItems> {
  if (!snapshot?.workItems.length) return [];

  return snapshot.workItems
    .filter((item) => item.status !== "closed")
    .map((item) => ({
      id: toStringValue(item.id, crypto.randomUUID()),
      state: toStringValue(item.state, "WA") as StateCode,
      domain: toStringValue(item.domain, "credentialing") as WorkItemDomain,
      priority: toWorkItemPriority(item.priority),
      owner: toStringValue(item.owner, "Owner BCBA"),
      title: toStringValue(item.title, "Operations task"),
      detail: toStringValue(item.detail, "Complete and upload evidence."),
      dueInDays: toDueInDays(item.dueDate),
      blocks: toStringValue(item.blocks, "State launch"),
      source: toStringValue(item.source, "database"),
    }))
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return (
        priorityOrder[a.priority] - priorityOrder[b.priority] ||
        a.dueInDays - b.dueInDays ||
        a.state.localeCompare(b.state)
      );
    });
}

function downloadPayrollExport(format: PayrollExportFormat) {
  const file = buildPayrollExportFile(format);
  const blob = new Blob([file.content], { type: `${file.mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getSnapshotRecords(
  snapshot: OperationsSnapshot | undefined,
  entity: OperationsEntity,
) {
  if (!snapshot) return [];
  if (entity === "payrollEntries") return snapshot.payrollTimeEntries;
  if (entity === "ledgerEntries") return snapshot.accountingLedgerEntries;
  return snapshot[entity] ?? [];
}

function getDefaultCrudRecord(entity: OperationsEntity) {
  const today = new Date().toISOString();
  if (entity === "providers") {
    return {
      displayName: "New RBT",
      role: "rbt",
      employmentType: "employee",
      homeState: "WA",
      serviceStates: ["WA"],
      status: "credentialing",
      maxClientLoad: 1,
      notes: "Created from operations CRUD manager.",
    };
  }
  if (entity === "licenses") {
    return {
      providerId: "",
      state: "WA",
      licenseType: "RBT credential/state background checks",
      status: "pending",
      expirationDate: null,
      evidenceUrl: null,
    };
  }
  if (entity === "payerCredentialing") {
    return {
      providerId: "",
      payerName: "Washington Apple Health / ProviderOne",
      state: "WA",
      networkType: "medicaid",
      status: "not_started",
      submittedDate: today,
      portalUrl: null,
      notes: "Add portal evidence and effective date before billing.",
    };
  }
  if (entity === "authorizations") {
    return {
      patientId: "",
      payerCredentialingId: null,
      payerName: "Washington Apple Health / ProviderOne",
      authorizationNumber: null,
      state: "WA",
      cptCode: "97153",
      modifier: null,
      approvedUnits: 480,
      usedUnits: 0,
      startDate: today,
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
      documentUrl: null,
    };
  }
  if (entity === "payrollEntries") {
    return {
      providerId: null,
      patientId: null,
      staffName: "New RBT",
      role: "rbt",
      state: "WA",
      center: "WA Center",
      serviceType: "rbt_direct",
      clockIn: today,
      clockOut: null,
      paidMinutes: 0,
      billableMinutes: 0,
      noteSigned: false,
      claimReady: false,
      payrollRunId: null,
    };
  }
  if (entity === "claims") {
    return {
      patientId: "",
      authorizationId: null,
      payerName: "Washington Apple Health / ProviderOne",
      state: "WA",
      claimNumber: null,
      clearinghouseTrace: null,
      status: "draft",
      dateOfService: today,
      submittedDate: null,
      billedCents: 0,
      allowedCents: null,
      paidCents: null,
      denialReason: null,
      nextFollowUpDate: null,
      assignedRcmUserId: null,
    };
  }
  return {
    state: "WA",
    center: "WA Center",
    clientLabel: "Client WA-01",
    providerId: null,
    patientId: null,
    sourceType: "manual",
    sourceId: null,
    account: "Uncategorized",
    debitCents: 0,
    creditCents: 0,
    entryDate: today,
    memo: "Manual internal ledger posting.",
    postedAt: null,
  };
}

function getCrudRowTitle(record: Record<string, unknown>) {
  return (
    toStringValue(record.displayName) ||
    toStringValue(record.payerName) ||
    toStringValue(record.staffName) ||
    toStringValue(record.claimNumber) ||
    toStringValue(record.account) ||
    toStringValue(record.licenseType) ||
    toStringValue(record.id, "record")
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof ShieldCheck;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-slate-500 text-sm">{label}</p>
          <p className="mt-1 font-bold text-2xl text-slate-950">{value}</p>
        </div>
        <span className="rounded-md bg-teal-50 p-2 text-teal-700">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-3 text-slate-600 text-sm">{detail}</p>
    </div>
  );
}

export function CenterOperationsCommand() {
  const [stateFilter, setStateFilter] = useState<StateCode | "all">("all");
  const [showOnlyRisk, setShowOnlyRisk] = useState(false);
  const [workQueueStateFilter, setWorkQueueStateFilter] = useState<StateCode | "all">("all");
  const [workQueueDomainFilter, setWorkQueueDomainFilter] = useState<WorkItemDomain | "all">("all");
  const [completedWorkItems, setCompletedWorkItems] = useState<string[]>([]);
  const [crudEntity, setCrudEntity] = useState<OperationsEntity>("providers");
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [recordEditorText, setRecordEditorText] = useState(
    JSON.stringify(getDefaultCrudRecord("providers"), null, 2),
  );
  const [recordEditorError, setRecordEditorError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const operationsSnapshotQuery = useQuery({
    queryKey: ["operations", "snapshot"],
    queryFn: getOperationsSnapshot,
    retry: false,
    staleTime: 60_000,
  });
  const completeWorkItemMutation = useMutation({
    mutationFn: completeOperationsWorkItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operations", "snapshot"] });
    },
  });
  const seedLaunchMutation = useMutation({
    mutationFn: seedOperationsLaunchData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operations", "snapshot"] });
    },
  });
  const createRecordMutation = useMutation({
    mutationFn: createOperationsRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operations", "snapshot"] });
      setEditingRecordId(null);
      setRecordEditorText(JSON.stringify(getDefaultCrudRecord(crudEntity), null, 2));
      setRecordEditorError(null);
    },
  });
  const updateRecordMutation = useMutation({
    mutationFn: updateOperationsRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operations", "snapshot"] });
      setEditingRecordId(null);
      setRecordEditorText(JSON.stringify(getDefaultCrudRecord(crudEntity), null, 2));
      setRecordEditorError(null);
    },
  });
  const deleteRecordMutation = useMutation({
    mutationFn: deleteOperationsRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operations", "snapshot"] });
    },
  });
  const claimActionMutation = useMutation({
    mutationFn: async (input: {
      action: "submit" | "pay" | "deny" | "follow_up";
      claim: Record<string, unknown>;
    }) => {
      const id = toStringValue(input.claim.id);
      if (input.action === "submit") return submitOperationsClaim(id);
      if (input.action === "pay") {
        const billedCents =
          typeof input.claim.billedCents === "number"
            ? input.claim.billedCents
            : 0;
        return postOperationsClaimPayment({
          id,
          paidCents: billedCents,
          allowedCents: billedCents,
        });
      }
      if (input.action === "deny") {
        return denyOperationsClaim({
          id,
          denialReason: "Documentation/auth issue requires payer follow-up.",
        });
      }
      return createOperationsCallLog({
        claimId: id,
        authorizationId: toStringValue(input.claim.authorizationId) || undefined,
        patientId: toStringValue(input.claim.patientId) || undefined,
        state: toStringValue(input.claim.state, "WA"),
        payerName: toStringValue(input.claim.payerName, "Medicaid"),
        callType: "claim_status",
        callerName: "India RCM Team",
        phoneNumberLabel: `${toStringValue(input.claim.state, "WA")} billing line`,
        payerRepresentative: "Payer representative",
        referenceNumber: `REF-${toStringValue(input.claim.state, "WA")}-${Date.now()}`,
        disposition: "follow_up_needed",
        summary: "Payer follow-up call logged from operations dashboard.",
        nextAction: "Update claim status after payer response and escalate clinical denials.",
        followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        minimumNecessaryFields: [
          "billing_provider_npi",
          "member_id",
          "date_of_service",
          "claim_trace",
        ],
        escalationRequired: toStringValue(input.claim.status) === "blocked",
        escalatedTo:
          toStringValue(input.claim.status) === "blocked" ? "Owner BCBA" : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operations", "snapshot"] });
    },
  });
  const aiAlertReviewMutation = useMutation({
    mutationFn: reviewOperationsAiAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operations", "snapshot"] });
    },
  });
  const trainingCompletionMutation = useMutation({
    mutationFn: completeOperationsTraining,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operations", "snapshot"] });
    },
  });

  useEffect(() => {
    const saved = window.localStorage.getItem("operations.completedWorkItems");
    if (saved) {
      setCompletedWorkItems(JSON.parse(saved) as string[]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "operations.completedWorkItems",
      JSON.stringify(completedWorkItems),
    );
  }, [completedWorkItems]);

  const filteredStates = useMemo(() => {
    const byState =
      stateFilter === "all"
        ? states
        : states.filter((state) => state.code === stateFilter);

    if (!showOnlyRisk) return byState;
    return byState.filter((state) =>
      [state.launch, state.credentialing, state.medicaid, state.payroll].some(
        (status) => status !== "ready",
      ),
    );
  }, [stateFilter, showOnlyRisk]);

  const blockedCount = states.filter((state) =>
    companyActiveStateSet.has(state.code) &&
    [state.launch, state.credentialing, state.medicaid, state.payroll].includes("blocked"),
  ).length;

  const aiRecommendations = useMemo(
    () => generateOperationsAiRecommendations(),
    [],
  );
  const claimReadinessQueue = useMemo(() => buildClaimReadinessQueue(), []);
  const callCenterWorkQueue = useMemo(() => buildCallCenterWorkQueue(), []);
  const financeResults = useMemo(() => buildFinanceResults(), []);
  const revenueSensitivity = useMemo(() => buildRevenueSensitivity(), []);
  const bcbaCapacityScenarios = useMemo(() => buildBcbaCapacityScenarios(), []);
  const highHourRetentionScenarios = useMemo(
    () => buildHighHourRetentionScenarios(),
    [],
  );
  const scheduleBlocks = useMemo(() => buildWeeklyScheduleBlocks(), []);
  const staffScheduleSummaries = useMemo(
    () => buildStaffScheduleSummaries(),
    [],
  );
  const biweeklyPayrollSummaries = useMemo(
    () => buildBiweeklyPayrollSummaries(),
    [],
  );
  const internalPayrollLedger = useMemo(() => buildInternalPayrollLedger(), []);
  const payrollExportFiles = useMemo(
    () =>
      (["internal_ledger", "gusto", "adp", "quickbooks"] as const).map(
        (format) => buildPayrollExportFile(format),
      ),
    [],
  );
  const crudRecords = useMemo(
    () => getSnapshotRecords(operationsSnapshotQuery.data, crudEntity),
    [crudEntity, operationsSnapshotQuery.data],
  );
  const complianceSummaries = useMemo(() => buildComplianceSummaries(), []);
  const stateCashFlowSummaries = useMemo(
    () => buildStateCashFlowSummaries(),
    [],
  );
  const timeZoneWindows = useMemo(() => buildTimeZoneOperatingWindows(), []);
  const payerCounts = useMemo(
    () =>
      getPayerCountsByState().filter((item) =>
        companyActiveStateSet.has(item.state),
      ),
    [],
  );
  const companyPayerTemplates = useMemo(
    () =>
      payerTemplates.filter((payer) => companyActiveStateSet.has(payer.state)),
    [],
  );
  const companyReadiness = useMemo(() => calculateCompanyReadiness(), []);
  const retentionReadiness = useMemo(() => summarizeRetentionReadiness(), []);
  const highPriorityAiCount = aiRecommendations.filter(
    (recommendation) => recommendation.severity === "high",
  ).length;
  const blockedClaimCount = claimReadinessQueue.filter(
    (claim) => claim.status === "blocked",
  ).length;
  const blockedComplianceCount = complianceRequirements.filter(
    (item) => item.status === "blocked",
  ).length;
  const generatedWorkItems = useMemo(() => buildOperationsWorkItems(), []);
  const persistedWorkItems = useMemo(
    () => mapPersistedWorkItems(operationsSnapshotQuery.data),
    [operationsSnapshotQuery.data],
  );
  const isUsingPersistedWorkItems = persistedWorkItems.length > 0;
  const allWorkItems = isUsingPersistedWorkItems
    ? persistedWorkItems
    : generatedWorkItems;
  const activeWorkItems = useMemo(
    () =>
      allWorkItems.filter((item) => !completedWorkItems.includes(item.id)),
    [allWorkItems, completedWorkItems],
  );
  const workSummary = useMemo(
    () => summarizeWorkItems(activeWorkItems),
    [activeWorkItems],
  );
  const filteredWorkItems = useMemo(
    () =>
      activeWorkItems.filter(
        (item) =>
          (workQueueStateFilter === "all" ||
            item.state === workQueueStateFilter) &&
          (workQueueDomainFilter === "all" ||
            item.domain === workQueueDomainFilter),
      ),
    [activeWorkItems, workQueueDomainFilter, workQueueStateFilter],
  );
  const closeWorkItem = (id: string) => {
    if (isUsingPersistedWorkItems) {
      completeWorkItemMutation.mutate(id);
      return;
    }
    setCompletedWorkItems((items) =>
      items.includes(id) ? items : [...items, id],
    );
  };
  const changeCrudEntity = (entity: OperationsEntity) => {
    setCrudEntity(entity);
    setEditingRecordId(null);
    setRecordEditorError(null);
    setRecordEditorText(JSON.stringify(getDefaultCrudRecord(entity), null, 2));
  };
  const editCrudRecord = (record: Record<string, unknown>) => {
    setEditingRecordId(toStringValue(record.id));
    setRecordEditorError(null);
    setRecordEditorText(
      JSON.stringify(
        Object.fromEntries(
          Object.entries(record).filter(
            ([key]) =>
              !["id", "organizationId", "createdAt", "updatedAt"].includes(key),
          ),
        ),
        null,
        2,
      ),
    );
  };
  const submitCrudRecord = () => {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(recordEditorText) as Record<string, unknown>;
    } catch (error) {
      setRecordEditorError(
        error instanceof Error ? error.message : "Invalid JSON record",
      );
      return;
    }

    if (editingRecordId) {
      updateRecordMutation.mutate({
        entity: crudEntity,
        id: editingRecordId,
        record: parsed,
      });
      return;
    }

    createRecordMutation.mutate({ entity: crudEntity, record: parsed });
  };

  return (
    <div className="space-y-6 text-slate-900">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 text-white shadow-sm">
        <div className="grid gap-6 p-5 lg:grid-cols-[1.3fr_0.7fr] lg:p-6">
          <div>
            <p className="font-semibold text-teal-300 text-sm uppercase tracking-wide">
              Multi-state autism center command
            </p>
            <h1 className="mt-2 max-w-3xl font-bold text-3xl">
              {companyOperatingProfile.dbaName} operates state by state only
              when licensure, payroll, supervision, and claims controls are
              visible.
            </h1>
            <p className="mt-3 max-w-3xl text-slate-300">
              Company profile: {companyOperatingProfile.legalName} ·{" "}
              {companyOperatingProfile.entityType} · active states{" "}
              {companyOperatingProfile.activeStates.join(", ")} · expansion
              candidates {companyOperatingProfile.expansionStates.join(", ")}.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-2 text-teal-200">
              <Camera className="h-5 w-5" />
              <p className="font-semibold">AI video rule</p>
            </div>
            <p className="mt-2 text-slate-200 text-sm">
              AI flags risk; it does not replace the RBT, parent, or BCBA. Every
              high-risk alert needs a human confirmation trail before billing.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Building2}
          label="Company active states"
          value={`${companyOperatingProfile.activeStates.length}`}
          detail={`${supportedUsStates.length}-state platform target; this company currently uses ${companyOperatingProfile.activeStates.join(", ")}.`}
        />
        <MetricCard
          icon={Users}
          label="Setup readiness"
          value={`${companyReadiness.percent}%`}
          detail={`${companyReadiness.ready} ready, ${companyReadiness.watch} watch, ${companyReadiness.blocked} blocked setup tasks.`}
        />
        <MetricCard
          icon={ShieldAlert}
          label="Blocked state lanes"
          value={String(blockedCount)}
          detail="Do not schedule billable services in blocked lanes."
        />
        <MetricCard
          icon={PhoneCall}
          label="Call-center issues"
          value={String(callCenterWorkQueue.length)}
          detail="India RCM queues payer, client, center, and referral issues."
        />
        <MetricCard
          icon={ReceiptText}
          label="Blocked claim lines"
          value={String(blockedClaimCount)}
          detail="Claim release is held until RBT/BCBA notes and auth checks pass."
        />
        <MetricCard
          icon={FileCheck2}
          label="Compliance blockers"
          value={String(blockedComplianceCount)}
          detail="Licenses, payroll, workers comp, EFT/ERA, and telehealth checks."
        />
        <MetricCard
          icon={ClipboardCheck}
          label="Open work items"
          value={String(workSummary.total)}
          detail={`${workSummary.high} high priority, ${workSummary.dueToday} due today.`}
        />
        <MetricCard
          icon={Archive}
          label="Retention holds"
          value={String(retentionReadiness.legalHolds)}
          detail={`${retentionReadiness.policies} retention policies, ${retentionReadiness.blockedPolicies} blocked controls.`}
        />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">Company Configuration Studio</h2>
            <p className="text-slate-600 text-sm">
              This converts the company profile into an onboarding workflow:
              complete each task before the company can safely schedule,
              bill, run payroll, open parent portals, or give India RCM access.
            </p>
          </div>
          <ClipboardCheck className="h-6 w-6 text-teal-700" />
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-slate-500 text-sm">Overall setup readiness</p>
            <p className="mt-1 font-bold text-4xl">
              {companyReadiness.percent}%
            </p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-teal-600"
                style={{ width: `${companyReadiness.percent}%` }}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
              <p className="rounded-md bg-emerald-50 p-2 text-emerald-800">
                <strong>{companyReadiness.ready}</strong>
                <br />
                ready
              </p>
              <p className="rounded-md bg-amber-50 p-2 text-amber-800">
                <strong>{companyReadiness.watch}</strong>
                <br />
                watch
              </p>
              <p className="rounded-md bg-rose-50 p-2 text-rose-800">
                <strong>{companyReadiness.blocked}</strong>
                <br />
                blocked
              </p>
            </div>
            <p className="mt-4 text-slate-600 text-sm">
              Treat blocked tasks as hard stops for production use. Watch tasks
              can be piloted only with owner approval and documented risk.
            </p>
          </div>
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Task</th>
                  <th className="px-4 py-3">Domain</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Due</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Blocks</th>
                </tr>
              </thead>
              <tbody>
                {companyConfigurationTasks.map((task) => (
                  <tr key={task.id} className="border-slate-100 border-t align-top">
                    <td className="px-4 py-3">
                      <p className="font-semibold">{task.title}</p>
                      <p className="mt-1 text-slate-500 text-xs">
                        {task.evidence}
                      </p>
                    </td>
                    <td className="px-4 py-3">{task.domain}</td>
                    <td className="px-4 py-3">{task.owner}</td>
                    <td className="px-4 py-3">{task.dueWindow}</td>
                    <td className="px-4 py-3">
                      <StatusPill status={task.status} />
                    </td>
                    <td className="px-4 py-3 text-rose-700">
                      {task.blocks.join("; ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Launch phase</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Exit criteria</th>
              </tr>
            </thead>
            <tbody>
              {companyLaunchPhases.map((phase) => (
                <tr key={phase.phase} className="border-slate-100 border-t align-top">
                  <td className="px-4 py-3 font-semibold">{phase.phase}</td>
                  <td className="px-4 py-3 text-slate-600">{phase.target}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={phase.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {phase.exitCriteria.join("; ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">Company Operating Profile</h2>
            <p className="text-slate-600 text-sm">
              This is the root configuration. All schedules, payroll, claims,
              parent portals, training, and finance views should filter from
              the company, its active states, centers, payers, staff, and
              clients.
            </p>
          </div>
          <Building2 className="h-6 w-6 text-teal-700" />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1.4fr]">
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-slate-500 text-sm">Company</p>
            <p className="mt-1 font-bold text-xl">
              {companyOperatingProfile.dbaName}
            </p>
            <p className="mt-1 text-slate-600 text-sm">
              {companyOperatingProfile.legalName}
            </p>
            <div className="mt-3 grid gap-2 text-sm">
              <p className="rounded-md bg-slate-50 p-2">
                HQ: <strong>{companyOperatingProfile.headquartersState}</strong>
              </p>
              <p className="rounded-md bg-slate-50 p-2">
                Clinical owner:{" "}
                <strong>{companyOperatingProfile.clinicalOwner}</strong>
              </p>
              <p className="rounded-md bg-slate-50 p-2">
                Operations:{" "}
                <strong>{companyOperatingProfile.operationsOwner}</strong>
              </p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["NPI/enrollment", companyOperatingProfile.npiStatus],
              ["Payroll/tax", companyOperatingProfile.taxAndPayrollStatus],
              ["Bank/EFT/ERA", companyOperatingProfile.bankAndEftStatus],
              ["HIPAA/security", companyOperatingProfile.hipaaStatus],
            ].map(([label, status]) => (
              <div key={label} className="rounded-lg border border-slate-200 p-3">
                <p className="font-semibold">{label}</p>
                <div className="mt-3">
                  <StatusPill status={status as Status} />
                </div>
              </div>
            ))}
            <div className="rounded-lg border border-slate-200 p-3 md:col-span-2 xl:col-span-4">
              <p className="font-semibold">Bank and ledger policy</p>
              <p className="mt-1 text-slate-600 text-sm">
                {companyOperatingProfile.defaultOperatingBankStrategy}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">Records Retention Control</h2>
            <p className="text-slate-600 text-sm">
              ABA centers must preserve clinical, billing, HIPAA, payroll,
              credentialing, training, video, and corporate records for the
              longest applicable state, payer, HIPAA, audit, or legal-hold
              requirement. Destruction should be controlled, approved, and
              logged.
            </p>
          </div>
          <Archive className="h-6 w-6 text-teal-700" />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {[
            ["Policies", retentionReadiness.policies],
            ["Ready", retentionReadiness.readyPolicies],
            ["Blocked", retentionReadiness.blockedPolicies],
            ["Legal holds", retentionReadiness.legalHolds],
            ["Archive items", retentionReadiness.archiveItems],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-slate-200 p-3">
              <p className="text-slate-500 text-sm">{label}</p>
              <p className="mt-1 font-bold text-2xl">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[1280px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Record set</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">States</th>
                <th className="px-4 py-3">Years</th>
                <th className="px-4 py-3">Trigger</th>
                <th className="px-4 py-3">Basis</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Storage</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Destruction rule</th>
              </tr>
            </thead>
            <tbody>
              {recordRetentionPolicies.map((policy) => (
                <tr key={policy.id} className="border-slate-100 border-t align-top">
                  <td className="px-4 py-3 font-semibold">{policy.recordSet}</td>
                  <td className="px-4 py-3">{policy.category}</td>
                  <td className="px-4 py-3">{policy.appliesToStates.join(", ")}</td>
                  <td className="px-4 py-3">{policy.retentionYears}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {policy.retentionTrigger}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {policy.authorityBasis}
                  </td>
                  <td className="px-4 py-3">{policy.owner}</td>
                  <td className="px-4 py-3">{policy.storageSystem}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={policy.status} />
                  </td>
                  <td className="px-4 py-3 text-rose-700">
                    {policy.destructionRule}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[1080px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Inventory item</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Client/company</th>
                <th className="px-4 py-3">Period end</th>
                <th className="px-4 py-3">Retain until</th>
                <th className="px-4 py-3">Legal hold</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Next action</th>
              </tr>
            </thead>
            <tbody>
              {retentionInventoryItems.map((item) => (
                <tr key={item.id} className="border-slate-100 border-t align-top">
                  <td className="px-4 py-3 font-semibold">{item.recordSet}</td>
                  <td className="px-4 py-3">{item.state}</td>
                  <td className="px-4 py-3">{item.clientOrOwner}</td>
                  <td className="px-4 py-3">{item.periodEnd}</td>
                  <td className="px-4 py-3">{item.retainUntil}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={item.legalHold ? "blocked" : "ready"} />
                  </td>
                  <td className="px-4 py-3">{item.location}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={item.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {item.nextAction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">Company State Configuration</h2>
            <p className="text-slate-600 text-sm">
              Each active state needs its own centers, staff count, payers,
              credentialing, payroll registration, workers comp, telehealth
              rule, and claim-release status.
            </p>
          </div>
          <ShieldCheck className="h-6 w-6 text-teal-700" />
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Centers</th>
                <th className="px-4 py-3">Clients</th>
                <th className="px-4 py-3">RBTs</th>
                <th className="px-4 py-3">BCBAs</th>
                <th className="px-4 py-3">Payers</th>
                <th className="px-4 py-3">Credentialing</th>
                <th className="px-4 py-3">Payroll</th>
                <th className="px-4 py-3">Workers comp</th>
                <th className="px-4 py-3">Telehealth</th>
                <th className="px-4 py-3">Claims</th>
                <th className="px-4 py-3">Next action</th>
              </tr>
            </thead>
            <tbody>
              {companyStateConfigurations.map((state) => (
                <tr key={state.state} className="border-slate-100 border-t align-top">
                  <td className="px-4 py-3 font-semibold">{state.state}</td>
                  <td className="px-4 py-3">{state.centers.join(", ")}</td>
                  <td className="px-4 py-3">{state.activeClients}</td>
                  <td className="px-4 py-3">{state.activeRbts}</td>
                  <td className="px-4 py-3">{state.activeBcbas}</td>
                  <td className="px-4 py-3">{state.payerCount}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={state.credentialingStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={state.payrollRegistrationStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={state.workersCompStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={state.telehealthRuleStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={state.claimReadinessStatus} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {state.nextAction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">Company Setup Gates</h2>
            <p className="text-slate-600 text-sm">
              These gates decide whether a company/state/payer lane can accept
              clients, schedule staff, release payroll, submit claims, or give
              India RCM access.
            </p>
          </div>
          <FileCheck2 className="h-6 w-6 text-teal-700" />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-5">
          {companySetupGates.map((gate) => (
            <article
              key={gate.domain}
              className="rounded-lg border border-slate-200 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{gate.domain}</p>
                  <p className="text-slate-500 text-sm">{gate.owner}</p>
                </div>
                <StatusPill status={gate.status} />
              </div>
              <p className="mt-3 text-slate-700 text-sm">
                {gate.requiredEvidence}
              </p>
              <p className="mt-2 rounded-md bg-rose-50 p-2 text-rose-800 text-sm">
                Blocks: {gate.blocks}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">Company Role Access Matrix</h2>
            <p className="text-slate-600 text-sm">
              Access is company-specific and minimum-necessary. This is the
              boundary between owner, BCBA, RBT, parent, and India RCM users.
            </p>
          </div>
          <LockKeyhole className="h-6 w-6 text-teal-700" />
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Users</th>
                <th className="px-4 py-3">States</th>
                <th className="px-4 py-3">Allowed data</th>
                <th className="px-4 py-3">Blocked data</th>
                <th className="px-4 py-3">Controls</th>
              </tr>
            </thead>
            <tbody>
              {companyRoleAccess.map((access) => (
                <tr key={access.role} className="border-slate-100 border-t align-top">
                  <td className="px-4 py-3 font-semibold">{access.role}</td>
                  <td className="px-4 py-3">{access.users}</td>
                  <td className="px-4 py-3">{access.allowedStates}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {access.allowedData}
                  </td>
                  <td className="px-4 py-3 text-rose-700">
                    {access.blockedData}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {access.requiredControls.join("; ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">50-State ABA SaaS Readiness</h2>
            <p className="text-slate-600 text-sm">
              National ABA software must be configurable by state, payer,
              center, client, provider, role, and authorization. The first four
              states are the pilot; the product architecture must not stay
              hard-coded to four states.
            </p>
          </div>
          <Building2 className="h-6 w-6 text-teal-700" />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {stateExpansionReadiness.map((item) => (
            <article
              key={item.region}
              className="rounded-lg border border-slate-200 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{item.region}</p>
                  <p className="mt-1 text-slate-500 text-sm">
                    {item.stateCount} state{item.stateCount === 1 ? "" : "s"}
                  </p>
                </div>
                <StatusPill status={item.readiness} />
              </div>
              <div className="mt-3 space-y-2">
                {item.requiredBeforeLaunch.map((requirement) => (
                  <p
                    key={requirement}
                    className="rounded-md bg-slate-50 p-2 text-slate-700 text-sm"
                  >
                    {requirement}
                  </p>
                ))}
              </div>
              <p className="mt-3 text-rose-700 text-sm">{item.operatingRisk}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">Role Portals</h2>
            <p className="text-slate-600 text-sm">
              Every parent, RBT, BCBA, and admin needs a login with only the
              schedule, payroll/progress, training, documents, and actions that
              role is allowed to see.
            </p>
          </div>
          <LayoutDashboard className="h-6 w-6 text-teal-700" />
        </div>
        <div className="mt-4 grid gap-3 xl:grid-cols-4">
          {portalExperiences.map((portal) => (
            <article
              key={portal.role}
              className="rounded-lg border border-slate-200 p-3"
            >
              <p className="font-semibold capitalize">{portal.role} portal</p>
              <p className="mt-2 text-slate-700 text-sm">{portal.dashboard}</p>
              <div className="mt-3 grid gap-2 text-sm">
                <div className="rounded-md bg-slate-50 p-2">
                  <p className="font-semibold text-slate-950">Weekly schedule</p>
                  <p className="mt-1 text-slate-600">
                    {portal.weeklySchedule.join("; ")}
                  </p>
                </div>
                <div className="rounded-md bg-slate-50 p-2">
                  <p className="font-semibold text-slate-950">
                    Payroll/progress
                  </p>
                  <p className="mt-1 text-slate-600">
                    {portal.moneyOrProgress.join("; ")}
                  </p>
                </div>
                <div className="rounded-md bg-teal-50 p-2 text-teal-800">
                  <p className="font-semibold">Actions</p>
                  <p className="mt-1">{portal.requiredActions.join("; ")}</p>
                </div>
                <p className="rounded-md bg-rose-50 p-2 text-rose-800">
                  {portal.accessBoundary}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">Parent Progress Portal</h2>
            <p className="text-slate-600 text-sm">
              Parents should see progress, upcoming work, training needs, and
              practical home programs without seeing internal billing or staff
              payroll data.
            </p>
          </div>
          <Users className="h-6 w-6 text-teal-700" />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {childProgressSnapshots.map((child) => {
            const masteryRate =
              child.goalsInTreatmentPlan > 0
                ? child.masteredGoals / child.goalsInTreatmentPlan
                : 0;
            return (
              <article
                key={child.child}
                className="rounded-lg border border-slate-200 p-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{child.child}</p>
                    <p className="text-slate-500 text-sm">{child.state}</p>
                  </div>
                  <p className="rounded-md bg-teal-50 px-3 py-2 font-bold text-teal-800">
                    {formatPercent(masteryRate)} mastered
                  </p>
                </div>
                <div className="mt-3 grid gap-2 text-sm md:grid-cols-3">
                  <p className="rounded-md bg-slate-50 p-2">
                    Goals: <strong>{child.goalsInTreatmentPlan}</strong>
                  </p>
                  <p className="rounded-md bg-slate-50 p-2">
                    Mastered: <strong>{child.masteredGoals}</strong>
                  </p>
                  <p className="rounded-md bg-slate-50 p-2">
                    Improving: <strong>{child.improvingGoals}</strong>
                  </p>
                </div>
                <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                  <div className="rounded-md bg-amber-50 p-2 text-amber-900">
                    <p className="font-semibold">Barriers</p>
                    <p className="mt-1">{child.highPriorityBarriers.join("; ")}</p>
                  </div>
                  <div className="rounded-md bg-slate-50 p-2 text-slate-700">
                    <p className="font-semibold">Home practice</p>
                    <p className="mt-1">{child.homePractice.join("; ")}</p>
                  </div>
                </div>
                <p className="mt-3 rounded-md bg-teal-50 p-2 text-sm text-teal-800">
                  {child.parentTrainingDue}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">Training Modules</h2>
            <p className="text-slate-600 text-sm">
              Parent, RBT, BCBA, and admin training must be tracked like
              compliance: assigned, completed, competency-checked, renewed, and
              auditable.
            </p>
          </div>
          <GraduationCap className="h-6 w-6 text-teal-700" />
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Audience</th>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">Minutes</th>
                <th className="px-4 py-3">Required</th>
                <th className="px-4 py-3">Competency check</th>
                <th className="px-4 py-3">Renewal</th>
              </tr>
            </thead>
            <tbody>
              {trainingModules.map((module) => (
                <tr key={module.id} className="border-slate-100 border-t align-top">
                  <td className="px-4 py-3 font-semibold capitalize">
                    {module.audience}
                  </td>
                  <td className="px-4 py-3">{module.title}</td>
                  <td className="px-4 py-3">{module.minutes}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={module.required ? "ready" : "watch"} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {module.competencyCheck}
                  </td>
                  <td className="px-4 py-3">{module.renewalCadence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">Top ABA Software Gap Matrix</h2>
            <p className="text-slate-600 text-sm">
              Compared against current ABA platform expectations: scheduling,
              billing/RCM, payroll, parent portal, clinical data collection,
              training, analytics, and enterprise administration.
            </p>
          </div>
          <BadgeCheck className="h-6 w-6 text-teal-700" />
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Feature</th>
                <th className="px-4 py-3">Market expectation</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Implemented now</th>
                <th className="px-4 py-3">Next build</th>
              </tr>
            </thead>
            <tbody>
              {competitorFeatureGaps.map((gap) => (
                <tr key={gap.feature} className="border-slate-100 border-t align-top">
                  <td className="px-4 py-3 font-semibold">{gap.feature}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {gap.marketExpectation}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={gap.currentStatus} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {gap.implementedNow}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{gap.nextBuild}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">Production Controls Console</h2>
            <p className="text-slate-600 text-sm">
              Database-backed RBAC, call logs, claim scrubber rules, AI review
              events, ledger links, and signed training assignments.
            </p>
          </div>
          <ShieldCheck className="h-6 w-6 text-teal-700" />
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">RBAC role</th>
                  <th className="px-4 py-3">Permission</th>
                  <th className="px-4 py-3">Resource</th>
                  <th className="px-4 py-3">PHI</th>
                  <th className="px-4 py-3">Controls</th>
                </tr>
              </thead>
              <tbody>
                {(operationsSnapshotQuery.data?.rolePermissionPolicies ?? []).slice(0, 8).map((policy) => (
                  <tr key={toStringValue(policy.id)} className="border-slate-100 border-t align-top">
                    <td className="px-4 py-3 font-semibold">{toStringValue(policy.role)}</td>
                    <td className="px-4 py-3">{toStringValue(policy.permission)} / {toStringValue(policy.accessLevel)}</td>
                    <td className="px-4 py-3 text-slate-600">{toStringValue(policy.resourceType)}</td>
                    <td className="px-4 py-3 text-slate-600">{toStringValue(policy.phiAccess)}</td>
                    <td className="px-4 py-3 text-slate-600">
                      MFA {policy.requiresMfa ? "yes" : "no"} · BAA {policy.requiresBaa ? "yes" : "no"}
                    </td>
                  </tr>
                ))}
                {(operationsSnapshotQuery.data?.rolePermissionPolicies ?? []).length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-slate-500" colSpan={5}>
                      No RBAC policies seeded yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Call log</th>
                  <th className="px-4 py-3">Payer</th>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Disposition</th>
                  <th className="px-4 py-3">Escalation</th>
                </tr>
              </thead>
              <tbody>
                {(operationsSnapshotQuery.data?.callLogs ?? []).slice(0, 8).map((call) => (
                  <tr key={toStringValue(call.id)} className="border-slate-100 border-t align-top">
                    <td className="px-4 py-3">
                      <p className="font-semibold">{toStringValue(call.callType)}</p>
                      <p className="text-slate-500 text-xs">{toStringValue(call.state)} · {toStringValue(call.callerRole)}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{toStringValue(call.payerName)}</td>
                    <td className="px-4 py-3 font-semibold">{toStringValue(call.referenceNumber)}</td>
                    <td className="px-4 py-3 text-slate-600">{toStringValue(call.disposition)}</td>
                    <td className="px-4 py-3">
                      <StatusPill status={call.escalationRequired ? "blocked" : "ready"} />
                    </td>
                  </tr>
                ))}
                {(operationsSnapshotQuery.data?.callLogs ?? []).length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-slate-500" colSpan={5}>
                      No call logs yet. Use claim follow-up to create one with a reference number.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Scrub rule</th>
                  <th className="px-4 py-3">Payer</th>
                  <th className="px-4 py-3">Requirement</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {(operationsSnapshotQuery.data?.claimScrubberRules ?? []).slice(0, 8).map((rule) => (
                  <tr key={toStringValue(rule.id)} className="border-slate-100 border-t align-top">
                    <td className="px-4 py-3 font-semibold">{toStringValue(rule.state)} {toStringValue(rule.cptCode)}</td>
                    <td className="px-4 py-3 text-slate-600">{toStringValue(rule.payerName)}</td>
                    <td className="px-4 py-3 text-slate-600">{toStringValue(rule.ruleType)}</td>
                    <td className="px-4 py-3"><StatusPill status={toStringValue(rule.status) === "active" ? "ready" : "watch"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">AI alert</th>
                  <th className="px-4 py-3">Signal</th>
                  <th className="px-4 py-3">Hold</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {(operationsSnapshotQuery.data?.aiVideoAlerts ?? []).slice(0, 8).map((alert) => (
                  <tr key={toStringValue(alert.id)} className="border-slate-100 border-t align-top">
                    <td className="px-4 py-3">
                      <p className="font-semibold">{toStringValue(alert.state)} · {toStringValue(alert.severity)}</p>
                      <p className="text-slate-500 text-xs">{alert.humanReviewed ? "reviewed" : "pending review"}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{toStringValue(alert.signal)}</td>
                    <td className="px-4 py-3"><StatusPill status={alert.claimHold ? "blocked" : "ready"} /></td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          aiAlertReviewMutation.mutate({
                            alertId: toStringValue(alert.id),
                            decision: "monitor",
                            clinicalAction: "BCBA reviewed alert and documented follow-up.",
                            claimHoldAfterReview: false,
                          })
                        }
                        disabled={aiAlertReviewMutation.isPending || Boolean(alert.humanReviewed)}
                        className="rounded-md border border-teal-700 px-3 py-2 font-semibold text-teal-700 text-xs disabled:opacity-60"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Training</th>
                  <th className="px-4 py-3">Assigned to</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {(operationsSnapshotQuery.data?.trainingCompletions ?? []).slice(0, 8).map((training) => (
                  <tr key={toStringValue(training.id)} className="border-slate-100 border-t align-top">
                    <td className="px-4 py-3">
                      <p className="font-semibold">{toStringValue(training.moduleTitle)}</p>
                      <p className="text-slate-500 text-xs">Score {toStringValue(training.competencyScore, "pending")}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{toStringValue(training.assignedToName)} · {toStringValue(training.audience)}</td>
                    <td className="px-4 py-3"><StatusPill status={toStringValue(training.status) === "complete" ? "ready" : "watch"} /></td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          trainingCompletionMutation.mutate({
                            id: toStringValue(training.id),
                            competencyScore: 100,
                            signatureName: toStringValue(training.assignedToName, "Signed in portal"),
                          })
                        }
                        disabled={trainingCompletionMutation.isPending || toStringValue(training.status) === "complete"}
                        className="rounded-md border border-teal-700 px-3 py-2 font-semibold text-teal-700 text-xs disabled:opacity-60"
                      >
                        Sign off
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Ledger link</th>
                  <th className="px-4 py-3">Claim</th>
                  <th className="px-4 py-3">Payroll</th>
                  <th className="px-4 py-3">Reconciliation</th>
                  <th className="px-4 py-3">Variance</th>
                </tr>
              </thead>
              <tbody>
                {(operationsSnapshotQuery.data?.ledgerLinks ?? []).slice(0, 8).map((link) => (
                  <tr key={toStringValue(link.id)} className="border-slate-100 border-t">
                    <td className="px-4 py-3 font-semibold">{toStringValue(link.ledgerEntryId)}</td>
                    <td className="px-4 py-3 text-slate-600">{toStringValue(link.claimId, "n/a")}</td>
                    <td className="px-4 py-3 text-slate-600">{toStringValue(link.payrollEntryId, "n/a")}</td>
                    <td className="px-4 py-3">{toStringValue(link.reconciliationStatus)}</td>
                    <td className="px-4 py-3">{formatCurrency(typeof link.varianceCents === "number" ? link.varianceCents / 100 : 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">HIPAA audit</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Resource</th>
                  <th className="px-4 py-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {(operationsSnapshotQuery.data?.hipaaAuditLogs ?? []).slice(0, 8).map((audit) => (
                  <tr key={toStringValue(audit.id)} className="border-slate-100 border-t">
                    <td className="px-4 py-3 font-semibold">{toStringValue(audit.actorUserId, "system")}</td>
                    <td className="px-4 py-3">{toStringValue(audit.actorRole)}</td>
                    <td className="px-4 py-3 text-slate-600">{toStringValue(audit.action)}</td>
                    <td className="px-4 py-3 text-slate-600">{toStringValue(audit.resourceType)}</td>
                    <td className="px-4 py-3 text-slate-600">{toStringValue(audit.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-bold text-xl">Operations Data Layer</h2>
            <p className="text-slate-600 text-sm">
              Persistent tables are available for payer rates, schedule blocks,
              payroll time entries, payer payment cycles, compliance
              requirements, and work items.
            </p>
          </div>
          <StatusPill
            status={
              operationsSnapshotQuery.isFetching
                ? "watch"
                : operationsSnapshotQuery.isError
                  ? "blocked"
                  : "ready"
            }
          />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-7">
          {[
            ["Rate rules", operationsSnapshotQuery.data?.payerRateRules.length ?? 0],
            ["Schedules", operationsSnapshotQuery.data?.scheduleBlocks.length ?? 0],
            ["Payroll entries", operationsSnapshotQuery.data?.payrollTimeEntries.length ?? 0],
            ["Payment cycles", operationsSnapshotQuery.data?.payerPaymentCycles.length ?? 0],
            ["Compliance", operationsSnapshotQuery.data?.complianceRequirements.length ?? 0],
            ["Work items", operationsSnapshotQuery.data?.workItems.length ?? 0],
            ["Ledger", operationsSnapshotQuery.data?.accountingLedgerEntries.length ?? 0],
            ["RBAC policies", operationsSnapshotQuery.data?.rolePermissionPolicies.length ?? 0],
            ["Call logs", operationsSnapshotQuery.data?.callLogs.length ?? 0],
            ["Scrub rules", operationsSnapshotQuery.data?.claimScrubberRules.length ?? 0],
            ["AI reviews", operationsSnapshotQuery.data?.aiAlertReviewEvents.length ?? 0],
            ["Ledger links", operationsSnapshotQuery.data?.ledgerLinks.length ?? 0],
            ["Training", operationsSnapshotQuery.data?.trainingCompletions.length ?? 0],
            ["HIPAA audit", operationsSnapshotQuery.data?.hipaaAuditLogs.length ?? 0],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-slate-200 p-3">
              <p className="text-slate-500 text-sm">{label}</p>
              <p className="mt-1 text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-slate-500 text-xs">
          {operationsSnapshotQuery.isError
            ? "Database snapshot is not available in this browser session, so the dashboard is using the generated launch model."
            : isUsingPersistedWorkItems
              ? "Work queue is using database records."
              : "No database work items are seeded yet, so the generated launch model is shown as the operating fallback."}
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="font-bold text-xl">Operations CRUD Manager</h2>
            <p className="max-w-3xl text-slate-600 text-sm">
              Create, edit, delete, and seed real database records for
              providers, state licenses, payer credentialing, authorizations,
              payroll entries, claims, and internal accounting postings.
            </p>
          </div>
          <button
            type="button"
            onClick={() => seedLaunchMutation.mutate()}
            disabled={seedLaunchMutation.isPending}
            className="inline-flex items-center justify-center rounded-md border border-teal-700 bg-teal-700 px-4 py-2 font-semibold text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {seedLaunchMutation.isPending ? "Seeding" : "Seed 4-state launch data"}
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-7">
          {operationsCrudEntities.map((entity) => {
            const count = getSnapshotRecords(
              operationsSnapshotQuery.data,
              entity.key,
            ).length;
            return (
              <button
                key={entity.key}
                type="button"
                onClick={() => changeCrudEntity(entity.key)}
                className={`rounded-lg border p-3 text-left ${
                  crudEntity === entity.key
                    ? "border-teal-600 bg-teal-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="font-semibold">{entity.label}</p>
                <p className="mt-1 text-2xl font-bold">{count}</p>
                <p className="mt-1 text-slate-500 text-xs">{entity.description}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-lg border border-slate-200">
            <div className="border-slate-200 border-b bg-slate-50 px-4 py-3">
              <p className="font-semibold">
                {operationsCrudEntities.find((entity) => entity.key === crudEntity)?.label}
              </p>
              <p className="text-slate-500 text-xs">
                {crudRecords.length} database records
              </p>
            </div>
            <div className="max-h-[460px] overflow-auto">
              {crudRecords.length === 0 ? (
                <div className="p-4 text-slate-500 text-sm">
                  No records yet. Seed launch data or create a new record.
                </div>
              ) : (
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-white text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Record</th>
                      <th className="px-4 py-3">State</th>
                      <th className="px-4 py-3">Status/account</th>
                      <th className="px-4 py-3">Amount/units</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crudRecords.map((record) => (
                      <tr key={toStringValue(record.id)} className="border-slate-100 border-t">
                        <td className="px-4 py-3">
                          <p className="font-semibold">{getCrudRowTitle(record)}</p>
                          <p className="text-slate-500 text-xs">
                            {toStringValue(record.id)}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          {toStringValue(record.state, toStringValue(record.homeState, "n/a"))}
                        </td>
                        <td className="px-4 py-3">
                          {toStringValue(
                            record.status,
                            toStringValue(record.account, "n/a"),
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {typeof record.billedCents === "number"
                            ? formatCurrency(record.billedCents / 100)
                            : typeof record.debitCents === "number"
                              ? formatCurrency(record.debitCents / 100)
                              : typeof record.approvedUnits === "number"
                                ? `${record.usedUnits ?? 0}/${record.approvedUnits} units`
                                : typeof record.paidMinutes === "number"
                                  ? `${Math.round(record.paidMinutes / 60)} hrs`
                                  : "n/a"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => editCrudRecord(record)}
                              className="rounded-md border border-slate-300 px-3 py-2 font-semibold text-slate-700 text-xs"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                deleteRecordMutation.mutate({
                                  entity: crudEntity,
                                  id: toStringValue(record.id),
                                })
                              }
                              disabled={deleteRecordMutation.isPending}
                              className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 font-semibold text-rose-700 text-xs disabled:opacity-60"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {editingRecordId ? "Edit record" : "Create record"}
                </p>
                <p className="text-slate-500 text-xs">
                  JSON is whitelisted on the server. Use seeded IDs for linked
                  provider, patient, authorization, and claim records.
                </p>
              </div>
              {editingRecordId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingRecordId(null);
                    setRecordEditorText(
                      JSON.stringify(getDefaultCrudRecord(crudEntity), null, 2),
                    );
                    setRecordEditorError(null);
                  }}
                  className="rounded-md border border-slate-300 px-3 py-2 font-semibold text-slate-700 text-xs"
                >
                  New
                </button>
              ) : null}
            </div>
            <textarea
              value={recordEditorText}
              onChange={(event) => {
                setRecordEditorText(event.target.value);
                setRecordEditorError(null);
              }}
              className="mt-3 h-[340px] w-full resize-none rounded-md border border-slate-300 bg-slate-950 p-3 font-mono text-slate-50 text-xs"
              spellCheck={false}
            />
            {recordEditorError ? (
              <p className="mt-2 text-rose-700 text-sm">{recordEditorError}</p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={submitCrudRecord}
                disabled={
                  createRecordMutation.isPending || updateRecordMutation.isPending
                }
                className="rounded-md border border-teal-700 bg-teal-700 px-4 py-2 font-semibold text-sm text-white disabled:opacity-60"
              >
                {editingRecordId
                  ? updateRecordMutation.isPending
                    ? "Saving"
                    : "Save changes"
                  : createRecordMutation.isPending
                    ? "Creating"
                    : "Create record"}
              </button>
              <button
                type="button"
                onClick={() =>
                  setRecordEditorText(
                    JSON.stringify(getDefaultCrudRecord(crudEntity), null, 2),
                  )
                }
                className="rounded-md border border-slate-300 px-4 py-2 font-semibold text-slate-700 text-sm"
              >
                Reset template
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">Claims Lifecycle Actions</h2>
            <p className="text-slate-600 text-sm">
              Submit clean claims, post ERA payments into the internal ledger,
              mark denials, and queue payer follow-up calls for India RCM.
            </p>
          </div>
          <ReceiptText className="h-6 w-6 text-teal-700" />
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[1080px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Claim</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Payer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Billed</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Next follow-up</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(operationsSnapshotQuery.data?.claims ?? []).map((claim) => (
                <tr key={toStringValue(claim.id)} className="border-slate-100 border-t align-top">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{toStringValue(claim.id)}</p>
                    <p className="text-slate-500 text-xs">
                      {toStringValue(claim.claimNumber, "no claim number")}
                    </p>
                  </td>
                  <td className="px-4 py-3">{toStringValue(claim.state)}</td>
                  <td className="px-4 py-3">{toStringValue(claim.payerName)}</td>
                  <td className="px-4 py-3">{toStringValue(claim.status)}</td>
                  <td className="px-4 py-3">
                    {formatCurrency(
                      typeof claim.billedCents === "number"
                        ? claim.billedCents / 100
                        : 0,
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {formatCurrency(
                      typeof claim.paidCents === "number"
                        ? claim.paidCents / 100
                        : 0,
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {toStringValue(claim.nextFollowUpDate, "n/a")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          claimActionMutation.mutate({ action: "submit", claim })
                        }
                        disabled={claimActionMutation.isPending}
                        className="rounded-md border border-slate-300 px-3 py-2 font-semibold text-slate-700 text-xs disabled:opacity-60"
                      >
                        Submit
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          claimActionMutation.mutate({ action: "pay", claim })
                        }
                        disabled={claimActionMutation.isPending}
                        className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 font-semibold text-emerald-700 text-xs disabled:opacity-60"
                      >
                        Post pay
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          claimActionMutation.mutate({ action: "deny", claim })
                        }
                        disabled={claimActionMutation.isPending}
                        className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 font-semibold text-rose-700 text-xs disabled:opacity-60"
                      >
                        Deny
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          claimActionMutation.mutate({ action: "follow_up", claim })
                        }
                        disabled={claimActionMutation.isPending}
                        className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 font-semibold text-amber-700 text-xs disabled:opacity-60"
                      >
                        Follow-up
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(operationsSnapshotQuery.data?.claims ?? []).length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-slate-500 text-sm" colSpan={8}>
                    No database claims yet. Use the seed button or create claims
                    in the CRUD manager.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-bold text-xl">Operations Work Queue</h2>
            <p className="text-slate-600 text-sm">
              One action board for launch blockers, payroll setup, claim holds,
              remote supervision verification, call-center tasks, and state
              accounting controls.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={workQueueStateFilter}
              onChange={(event) =>
                setWorkQueueStateFilter(event.target.value as StateCode | "all")
              }
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="all">All states</option>
              <option value="WA">WA</option>
              <option value="ND">ND</option>
              <option value="CT">CT</option>
              <option value="MO">MO</option>
            </select>
            <select
              value={workQueueDomainFilter}
              onChange={(event) =>
                setWorkQueueDomainFilter(
                  event.target.value as WorkItemDomain | "all",
                )
              }
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="all">All domains</option>
              <option value="claim">Claims</option>
              <option value="payroll">Payroll</option>
              <option value="credentialing">Credentialing</option>
              <option value="telehealth">Telehealth</option>
              <option value="call_center">Call center</option>
              <option value="accounting">Accounting</option>
            </select>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {workSummary.byState.map((item) => (
            <div key={item.state} className="rounded-lg border border-slate-200 p-3">
              <p className="font-semibold">{item.state}</p>
              <p className="mt-1 text-2xl font-bold">{item.count}</p>
              <p className="text-slate-500 text-sm">{item.high} high priority</p>
            </div>
          ))}
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Domain</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Blocks</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Close</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkItems.slice(0, 24).map((item) => (
                <tr key={item.id} className="border-slate-100 border-t align-top">
                  <td className="px-4 py-3 font-semibold">{item.state}</td>
                  <td className="px-4 py-3">{item.domain}</td>
                  <td className="px-4 py-3">
                    <SeverityPill severity={item.priority} />
                  </td>
                  <td className="px-4 py-3">{item.owner}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-1 text-slate-600 text-xs">{item.detail}</p>
                  </td>
                  <td className="px-4 py-3">{item.blocks}</td>
                  <td className="px-4 py-3">
                    {item.dueInDays <= 0 ? "today" : `${item.dueInDays} days`}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{item.source}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => closeWorkItem(item.id)}
                      disabled={completeWorkItemMutation.isPending}
                      className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 font-semibold text-emerald-700 text-xs disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {completeWorkItemMutation.isPending ? "Saving" : "Done"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {completedWorkItems.length > 0 ? (
          <button
            type="button"
            onClick={() => setCompletedWorkItems([])}
            className="mt-3 rounded-md border border-slate-300 bg-white px-3 py-2 font-semibold text-slate-700 text-sm"
          >
            Reset completed work
          </button>
        ) : null}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">State Compliance Registration Tracker</h2>
            <p className="text-slate-600 text-sm">
              Tracks payroll tax, withholding, unemployment, workers comp,
              payer EFT/ERA, accounting ledgers, BCBA licenses, RBT credentials,
              payer credentialing, and telehealth verification by state.
            </p>
          </div>
          <FileCheck2 className="h-6 w-6 text-teal-700" />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {complianceSummaries.map((summary) => (
            <div
              key={summary.state}
              className="rounded-lg border border-slate-200 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold">{summary.state}</p>
                <StatusPill status={summary.status} />
              </div>
              <p className="mt-2 text-2xl font-bold">
                {summary.complete}/{summary.total}
              </p>
              <p className="text-slate-500 text-sm">
                {summary.blocked} blocked · {summary.dueSoon} due soon ·{" "}
                {summary.highRisk} high-risk
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Domain</th>
                <th className="px-4 py-3">Requirement</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3">Renewal</th>
                <th className="px-4 py-3">Penalty risk</th>
                <th className="px-4 py-3">Next action</th>
              </tr>
            </thead>
            <tbody>
              {complianceRequirements.map((item) => (
                <tr key={item.id} className="border-slate-100 border-t align-top">
                  <td className="px-4 py-3 font-semibold">{item.state}</td>
                  <td className="px-4 py-3">{item.domain}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {item.requirement}
                  </td>
                  <td className="px-4 py-3">{item.owner}</td>
                  <td className="px-4 py-3">
                    <StatusPill
                      status={
                        item.status === "complete"
                          ? "ready"
                          : item.status === "blocked"
                            ? "blocked"
                            : "watch"
                      }
                    />
                  </td>
                  <td className="px-4 py-3">{item.dueInDays} days</td>
                  <td className="px-4 py-3">
                    {item.renewalInDays ? `${item.renewalInDays} days` : "n/a"}
                  </td>
                  <td className="px-4 py-3">
                    <SeverityPill severity={item.penaltyRisk} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {item.nextAction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">Payer Payment Cycle and Treasury</h2>
            <p className="text-slate-600 text-sm">
              Tracks whether each state/payer is expected to pay weekly,
              biweekly, monthly, or unknown, and compares payroll cost against
              claim-ready revenue and documentation holds.
            </p>
          </div>
          <Banknote className="h-6 w-6 text-teal-700" />
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[940px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Payer</th>
                <th className="px-4 py-3">Payment cycle</th>
                <th className="px-4 py-3">Avg days</th>
                <th className="px-4 py-3">Bank/EFT strategy</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {payerPaymentCycles.map((payer) => (
                <tr key={`${payer.state}-${payer.payer}`} className="border-slate-100 border-t">
                  <td className="px-4 py-3 font-semibold">{payer.state}</td>
                  <td className="px-4 py-3">{payer.payer}</td>
                  <td className="px-4 py-3">{payer.expectedPaymentCycle}</td>
                  <td className="px-4 py-3">{payer.averageDaysToPay}</td>
                  <td className="px-4 py-3">{payer.eftAccountStrategy}</td>
                  <td className="px-4 py-3 text-slate-600">{payer.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[940px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Payroll loaded cost</th>
                <th className="px-4 py-3">Claim-ready revenue</th>
                <th className="px-4 py-3">Revenue held by docs</th>
                <th className="px-4 py-3">Expected payment</th>
                <th className="px-4 py-3">Treasury rule</th>
                <th className="px-4 py-3">Cash risk</th>
              </tr>
            </thead>
            <tbody>
              {stateCashFlowSummaries.map((state) => (
                <tr key={state.state} className="border-slate-100 border-t">
                  <td className="px-4 py-3 font-semibold">{state.state}</td>
                  <td className="px-4 py-3">
                    {formatCurrency(state.payrollLoadedCost)}
                  </td>
                  <td className="px-4 py-3">
                    {formatCurrency(state.claimReadyRevenue)}
                  </td>
                  <td className="px-4 py-3 text-rose-700">
                    {formatCurrency(state.documentationHoldRevenue)}
                  </td>
                  <td className="px-4 py-3">{state.expectedPaymentCycle}</td>
                  <td className="px-4 py-3">{state.treasuryRecommendation}</td>
                  <td className="px-4 py-3">
                    <SeverityPill
                      severity={
                        state.cashRisk === "high"
                          ? "high"
                          : state.cashRisk === "medium"
                            ? "medium"
                            : "low"
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-lg border border-slate-200 p-3">
          <p className="font-semibold">Bank account policy</p>
          <p className="mt-1 text-slate-600 text-sm">
            Start with one US operating bank account plus state-level accounting
            ledgers/classes for WA, ND, CT, and MO. Add separate state bank
            accounts only if a payer, CPA, lender, audit rule, or cash-control
            policy requires it.
          </p>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">Biweekly Payroll Timesheets</h2>
            <p className="text-slate-600 text-sm">
              Clock-in and clock-out entries by staff, state, center, client,
              and service type. Payroll is biweekly, while claim readiness
              controls which billable hours can be released to payers.
            </p>
          </div>
          <Clock3 className="h-6 w-6 text-teal-700" />
        </div>

        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-semibold text-slate-950">Payroll Export Center</h3>
              <p className="text-slate-600 text-sm">
                Export the same approved time entries to Gusto, ADP,
                QuickBooks-compatible time import, or your own internal
                state-ledger format.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {payrollExportFiles.map((file) => (
                <button
                  key={file.format}
                  type="button"
                  onClick={() => downloadPayrollExport(file.format)}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 font-semibold text-slate-800 text-sm shadow-sm hover:border-teal-500 hover:text-teal-800"
                >
                  <Download className="h-4 w-4" />
                  {file.format === "internal_ledger"
                    ? "Internal ledger"
                    : file.format === "quickbooks"
                      ? "QuickBooks CSV"
                      : file.format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-4">
            {payrollExportFiles.map((file) => (
              <div key={file.filename} className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="font-semibold text-sm">
                  {file.format === "internal_ledger"
                    ? "Own books"
                    : file.format === "quickbooks"
                      ? "QuickBooks bridge"
                      : file.format.toUpperCase()}
                </p>
                <p className="mt-1 text-slate-500 text-xs">{file.filename}</p>
                <p className="mt-2 font-bold text-lg">{file.rowCount} rows</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-slate-500 text-xs">
            Use Gusto/ADP for actual tax filing and direct deposit if you do not
            build payroll tax filing yet. Use the internal ledger as your
            QuickBooks replacement for state, payer, center, client, provider,
            claim-hold, and loaded-cost accounting.
          </p>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Ledger class</th>
                <th className="px-4 py-3">Payroll account</th>
                <th className="px-4 py-3">Revenue account</th>
                <th className="px-4 py-3">Staff</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Paid hrs</th>
                <th className="px-4 py-3">Billable hrs</th>
                <th className="px-4 py-3">Gross pay</th>
                <th className="px-4 py-3">Loaded cost</th>
                <th className="px-4 py-3">Revenue status</th>
              </tr>
            </thead>
            <tbody>
              {internalPayrollLedger.map((row) => (
                <tr key={row.entryId} className="border-slate-100 border-t align-top">
                  <td className="px-4 py-3 font-semibold">{row.ledgerClass}</td>
                  <td className="px-4 py-3">{row.payrollAccount}</td>
                  <td className="px-4 py-3">{row.revenueAccount}</td>
                  <td className="px-4 py-3">{row.staff}</td>
                  <td className="px-4 py-3">{row.state}</td>
                  <td className="px-4 py-3">{row.client}</td>
                  <td className="px-4 py-3">{row.paidHours}</td>
                  <td className="px-4 py-3">{row.billableHours}</td>
                  <td className="px-4 py-3">{formatCurrency(row.grossPay)}</td>
                  <td className="px-4 py-3">{formatCurrency(row.loadedCost)}</td>
                  <td className="px-4 py-3">
                    <StatusPill
                      status={
                        row.revenueHoldStatus === "release_to_claims"
                          ? "ready"
                          : row.revenueHoldStatus === "documentation_hold"
                            ? "blocked"
                            : "watch"
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[1040px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Staff</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Paid hrs</th>
                <th className="px-4 py-3">Billable hrs</th>
                <th className="px-4 py-3">Claim-ready hrs</th>
                <th className="px-4 py-3">Doc hold hrs</th>
                <th className="px-4 py-3">Gross pay</th>
                <th className="px-4 py-3">Loaded cost</th>
                <th className="px-4 py-3">Utilization</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {biweeklyPayrollSummaries.map((summary) => (
                <tr
                  key={`${summary.staff}-${summary.state}`}
                  className="border-slate-100 border-t"
                >
                  <td className="px-4 py-3 font-semibold">{summary.staff}</td>
                  <td className="px-4 py-3">{summary.role}</td>
                  <td className="px-4 py-3">{summary.state}</td>
                  <td className="px-4 py-3">{summary.paidHours}</td>
                  <td className="px-4 py-3">{summary.billableHours}</td>
                  <td className="px-4 py-3">{summary.claimReadyHours}</td>
                  <td className="px-4 py-3">{summary.documentationHoldHours}</td>
                  <td className="px-4 py-3">
                    {formatCurrency(summary.grossPay)}
                  </td>
                  <td className="px-4 py-3">
                    {formatCurrency(summary.loadedCost)}
                  </td>
                  <td className="px-4 py-3">
                    {formatPercent(summary.utilizationRate)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={summary.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Staff</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Center/client</th>
                <th className="px-4 py-3">Entry</th>
                <th className="px-4 py-3">Exit</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Billable</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Claim</th>
              </tr>
            </thead>
            <tbody>
              {payrollTimeEntries.map((entry) => (
                <tr key={entry.id} className="border-slate-100 border-t">
                  <td className="px-4 py-3">{entry.serviceDate}</td>
                  <td className="px-4 py-3 font-semibold">{entry.staff}</td>
                  <td className="px-4 py-3">{entry.state}</td>
                  <td className="px-4 py-3">
                    {entry.center} · {entry.client}
                  </td>
                  <td className="px-4 py-3">{entry.clockIn}</td>
                  <td className="px-4 py-3">{entry.clockOut}</td>
                  <td className="px-4 py-3">{entry.paidHours}</td>
                  <td className="px-4 py-3">{entry.billableHours}</td>
                  <td className="px-4 py-3">{entry.serviceType}</td>
                  <td className="px-4 py-3">
                    <StatusPill
                      status={
                        entry.claimReady
                          ? "ready"
                          : entry.noteSigned
                            ? "watch"
                            : "blocked"
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">RBT and BCBA Scheduler</h2>
            <p className="text-slate-600 text-sm">
              Weekly capacity plan separating RBT treatment hours from BCBA
              treatment/protocol and supervision hours. Target is 40 paid hours
              with about 30 billable hours where clinically and payer-allowed.
            </p>
          </div>
          <ClipboardCheck className="h-6 w-6 text-teal-700" />
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Staff</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Paid hrs/wk</th>
                <th className="px-4 py-3">Target billable hrs/wk</th>
                <th className="px-4 py-3">Scheduled billable</th>
                <th className="px-4 py-3">Non-billable capacity</th>
                <th className="px-4 py-3">Utilization</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {staffScheduleSummaries.map((summary) => (
                <tr key={summary.staff} className="border-slate-100 border-t">
                  <td className="px-4 py-3 font-semibold">{summary.staff}</td>
                  <td className="px-4 py-3">{summary.role}</td>
                  <td className="px-4 py-3">{summary.paidHoursPerWeek}</td>
                  <td className="px-4 py-3">
                    {summary.targetBillableHoursPerWeek}
                  </td>
                  <td className="px-4 py-3">
                    {summary.scheduledBillableHours}
                  </td>
                  <td className="px-4 py-3">
                    {summary.scheduledNonBillableHours}
                  </td>
                  <td className="px-4 py-3">
                    {formatPercent(summary.utilizationRate)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill
                      status={
                        summary.status === "target"
                          ? "ready"
                          : summary.status === "underfilled"
                            ? "watch"
                            : "blocked"
                      }
                    />
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {summary.notes.join("; ") || "Capacity on target"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[1040px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Staff</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Mode</th>
                <th className="px-4 py-3">Hours/wk</th>
                <th className="px-4 py-3">Rule status</th>
              </tr>
            </thead>
            <tbody>
              {scheduleBlocks.map((block) => (
                <tr key={block.id} className="border-slate-100 border-t">
                  <td className="px-4 py-3 font-semibold">{block.staff}</td>
                  <td className="px-4 py-3">{block.client}</td>
                  <td className="px-4 py-3">{block.state}</td>
                  <td className="px-4 py-3">{block.serviceType}</td>
                  <td className="px-4 py-3">{block.mode}</td>
                  <td className="px-4 py-3">{block.hours}</td>
                  <td className="px-4 py-3">
                    <StatusPill
                      status={
                        block.ruleStatus === "ok"
                          ? "ready"
                          : block.ruleStatus === "verify"
                            ? "watch"
                            : "blocked"
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">State Telehealth and Supervision Rules</h2>
            <p className="text-slate-600 text-sm">
              Conservative scheduling rules for online treatment, remote
              supervision, parent training, and BCBA hour planning. Verify
              payer authorization before billing remote services.
            </p>
          </div>
          <ShieldCheck className="h-6 w-6 text-teal-700" />
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Direct treatment</th>
                <th className="px-4 py-3">Remote supervision</th>
                <th className="px-4 py-3">Parent training</th>
                <th className="px-4 py-3">Online supervision hrs/client/wk</th>
                <th className="px-4 py-3">Online parent training hrs/client/wk</th>
                <th className="px-4 py-3">Supervision formula</th>
                <th className="px-4 py-3">BCBA planning</th>
                <th className="px-4 py-3">Remote requirements</th>
                <th className="px-4 py-3">Risk</th>
              </tr>
            </thead>
            <tbody>
              {stateSchedulingRules.map((rule) => (
                <tr key={rule.state} className="border-slate-100 border-t align-top">
                  <td className="px-4 py-3 font-semibold">{rule.state}</td>
                  <td className="px-4 py-3">{rule.directTreatmentMode}</td>
                  <td className="px-4 py-3">{rule.remoteSupervisionMode}</td>
                  <td className="px-4 py-3">{rule.parentTrainingMode}</td>
                  <td className="px-4 py-3">
                    {rule.remoteSupervisionAllowedHoursPerClientWeek}
                  </td>
                  <td className="px-4 py-3">
                    {rule.onlineParentTrainingAllowedHoursPerClientWeek}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {rule.supervisionFormula}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {rule.bcbaPlanningRangeHoursPerClientWeek}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {rule.remoteRequirements.join("; ")}
                  </td>
                  <td className="px-4 py-3 text-rose-700">
                    {rule.schedulingRisk}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">Automated Claim Readiness</h2>
            <p className="text-slate-600 text-sm">
              Claim lines are generated only after RBT data, RBT note, BCBA
              note, authorization, units, supervision link, and state/payer rate
              checks pass.
            </p>
          </div>
          <ReceiptText className="h-6 w-6 text-teal-700" />
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[1080px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Center</th>
                <th className="px-4 py-3">Payer</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">CPT</th>
                <th className="px-4 py-3">Units</th>
                <th className="px-4 py-3">Expected amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Blockers/warnings</th>
              </tr>
            </thead>
            <tbody>
              {claimReadinessQueue.map((claim) => (
                <tr key={claim.sessionId} className="border-slate-100 border-t align-top">
                  <td className="px-4 py-3 font-semibold">{claim.client}</td>
                  <td className="px-4 py-3">{claim.state}</td>
                  <td className="px-4 py-3">{claim.center}</td>
                  <td className="px-4 py-3">{claim.payer}</td>
                  <td className="px-4 py-3">{claim.serviceType}</td>
                  <td className="px-4 py-3">{claim.cpt}</td>
                  <td className="px-4 py-3">{claim.units}</td>
                  <td className="px-4 py-3">
                    {formatCurrency(claim.expectedAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill
                      status={
                        claim.status === "ready"
                          ? "ready"
                          : claim.status === "hold"
                            ? "watch"
                            : "blocked"
                      }
                    />
                  </td>
                  <td className="px-4 py-3">{claim.nextOwner}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {[...claim.blockers, ...claim.warnings].join("; ") ||
                      "Ready for claim release"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">State/Payer Rate Rules</h2>
            <p className="text-slate-600 text-sm">
              Separate placeholder rate table for RBT and BCBA billing by
              state, payer, CPT, modifier, place of service, and unit size.
              Replace with payer contract rates before live submission.
            </p>
          </div>
          <Banknote className="h-6 w-6 text-teal-700" />
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Payer</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">CPT</th>
                <th className="px-4 py-3">Modifier</th>
                <th className="px-4 py-3">Unit</th>
                <th className="px-4 py-3">Rate/hr</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {payerRateRules.map((rule) => (
                <tr
                  key={`${rule.state}-${rule.payer}-${rule.serviceType}`}
                  className="border-slate-100 border-t"
                >
                  <td className="px-4 py-3 font-semibold">{rule.state}</td>
                  <td className="px-4 py-3">{rule.payer}</td>
                  <td className="px-4 py-3">{rule.serviceType}</td>
                  <td className="px-4 py-3">{rule.cpt}</td>
                  <td className="px-4 py-3">{rule.modifier}</td>
                  <td className="px-4 py-3">{rule.unitMinutes} min</td>
                  <td className="px-4 py-3">
                    {formatCurrency(rule.collectedRatePerHour)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill
                      status={
                        rule.verificationStatus === "payer_verified"
                          ? "ready"
                          : "watch"
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">High-Hour Retention Model</h2>
            <p className="text-slate-600 text-sm">
              Staffing model for accepting high-authorized-hour clients so RBTs
              can work near full-time, clients receive consistent hours, and RBT
              billing stays separate from BCBA billing.
            </p>
          </div>
          <Users className="h-6 w-6 text-teal-700" />
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Scenario</th>
                <th className="px-4 py-3">Clients</th>
                <th className="px-4 py-3">Auth direct hrs/client/wk</th>
                <th className="px-4 py-3">Delivered direct hrs/client/wk</th>
                <th className="px-4 py-3">RBT paid hrs/wk</th>
                <th className="px-4 py-3">RBT billable hrs/wk</th>
                <th className="px-4 py-3">RBT utilization</th>
                <th className="px-4 py-3">BCBA paid hrs/wk</th>
                <th className="px-4 py-3">BCBA billable hrs/wk</th>
                <th className="px-4 py-3">BCBA utilization</th>
                <th className="px-4 py-3">RBT billing/mo</th>
                <th className="px-4 py-3">BCBA billing/mo</th>
                <th className="px-4 py-3">Clinical margin before overhead</th>
              </tr>
            </thead>
            <tbody>
              {highHourRetentionScenarios.map((scenario) => (
                <tr key={scenario.label} className="border-slate-100 border-t">
                  <td className="px-4 py-3 font-semibold">
                    {scenario.label}
                    <p className="mt-1 max-w-[260px] font-normal text-slate-500 text-xs">
                      {scenario.retentionLogic}
                    </p>
                  </td>
                  <td className="px-4 py-3">{scenario.clients}</td>
                  <td className="px-4 py-3">
                    {scenario.authorizedDirectHoursPerClientWeek}
                  </td>
                  <td className="px-4 py-3">
                    {scenario.expectedDeliveredDirectHoursPerClientWeek}
                  </td>
                  <td className="px-4 py-3">
                    {scenario.rbtPaidHoursPerWeek}
                  </td>
                  <td className="px-4 py-3">
                    {scenario.rbtBillableHoursPerWeek}
                  </td>
                  <td className="px-4 py-3">
                    {formatPercent(scenario.rbtUtilizationRate)}
                  </td>
                  <td className="px-4 py-3">
                    {scenario.bcbaPaidHoursPerWeek}
                  </td>
                  <td className="px-4 py-3">
                    {scenario.bcbaBillableHoursPerWeek}
                  </td>
                  <td className="px-4 py-3">
                    {formatPercent(scenario.bcbaUtilizationRate)}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {formatCurrency(scenario.rbtRevenueMonthly)}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {formatCurrency(scenario.bcbaRevenueMonthly)}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {formatCurrency(scenario.grossClinicalMarginMonthly)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">Finance and P&amp;L Guardrail</h2>
            <p className="text-slate-600 text-sm">
              Monthly model for 10-15 clients. Replace assumptions with actual
              payer contracts, wages, rent, and denial rates before hiring.
            </p>
          </div>
          <ReceiptText className="h-6 w-6 text-teal-700" />
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Clients</th>
                <th className="px-4 py-3">Back office</th>
                <th className="px-4 py-3">Collected revenue</th>
                <th className="px-4 py-3">Clinical labor</th>
                <th className="px-4 py-3">RCM/admin</th>
                <th className="px-4 py-3">Software/payroll</th>
                <th className="px-4 py-3">Fixed cost</th>
                <th className="px-4 py-3">Profit before owner tax</th>
                <th className="px-4 py-3">Margin</th>
              </tr>
            </thead>
            <tbody>
              {financeResults.map((result) => (
                <tr key={result.key} className="border-slate-100 border-t">
                  <td className="px-4 py-3 font-semibold">
                    {result.scenarioLabel}
                  </td>
                  <td className="px-4 py-3 font-semibold">{result.clients}</td>
                  <td className="px-4 py-3">
                    {backOfficeModelLabels[result.backOfficeModel]}
                    {result.savingsVsUsRcm !== undefined ? (
                      <p
                        className={`mt-1 text-xs ${
                          result.savingsVsUsRcm >= 0
                            ? "text-emerald-700"
                            : "text-rose-700"
                        }`}
                      >
                        {result.savingsVsUsRcm >= 0
                          ? `saves ${formatCurrency(result.savingsVsUsRcm)}/mo vs US RCM`
                          : `costs ${formatCurrency(Math.abs(result.savingsVsUsRcm))}/mo more than US RCM`}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    {formatCurrency(result.collectibleRevenue)}
                  </td>
                  <td className="px-4 py-3">
                    {formatCurrency(
                      result.directLaborCost + result.bcbaSupportCost,
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {formatCurrency(result.backOfficeCost)}
                  </td>
                  <td className="px-4 py-3">
                    {formatCurrency(result.softwareAndPayrollCost)}
                  </td>
                  <td className="px-4 py-3">
                    {formatCurrency(result.fixedCost)}
                  </td>
                  <td
                    className={`px-4 py-3 font-semibold ${
                      result.operatingProfitBeforeOwnerTax >= 0
                        ? "text-emerald-700"
                        : "text-rose-700"
                    }`}
                  >
                    {formatCurrency(result.operatingProfitBeforeOwnerTax)}
                  </td>
                  <td className="px-4 py-3">{formatPercent(result.margin)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="font-semibold">Best early structure</p>
            <p className="mt-1 text-slate-600 text-sm">
              Keep the US healthcare company as the provider entity. Contract
              with India workers/company under BAA, confidentiality, and
              minimum-necessary access.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="font-semibold">Delay India company setup</p>
            <p className="mt-1 text-slate-600 text-sm">
              An India entity adds accounting, tax, payroll, compliance, and
              management overhead. It usually makes sense only after stable
              volume or SaaS sales.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="font-semibold">Do not underprice software</p>
            <p className="mt-1 text-slate-600 text-sm">
              Track internal software cost from day one. For resale, price per
              client, per provider, or a percent of collections only after your
              own center workflow works.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">Time-Zone Operating Advantage</h2>
            <p className="text-slate-600 text-sm">
              Four states can be run as staggered service windows, with India
              preparing claims, authorizations, schedules, and dashboards before
              each US day starts.
            </p>
          </div>
          <Clock3 className="h-6 w-6 text-teal-700" />
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Current summer time zone</th>
                <th className="px-4 py-3">India offset</th>
                <th className="px-4 py-3">Operating use</th>
              </tr>
            </thead>
            <tbody>
              {timeZoneWindows.map((window) => (
                <tr key={window.state} className="border-slate-100 border-t">
                  <td className="px-4 py-3 font-semibold">
                    {window.location}
                  </td>
                  <td className="px-4 py-3">{window.currentSummerTimeZone}</td>
                  <td className="px-4 py-3">{window.indiaOffset}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {window.operatingUse}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">40-Hour BCBA Capacity Model</h2>
            <p className="text-slate-600 text-sm">
              Owner BCBA capacity with billing/admin delegated. Billable time
              still competes with supervision, reauthorization, caregiver
              contact, incident review, and clinical documentation.
            </p>
          </div>
          <Clock3 className="h-6 w-6 text-teal-700" />
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[1040px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Scenario</th>
                <th className="px-4 py-3">Clients</th>
                <th className="px-4 py-3">Direct RBT hrs/wk</th>
                <th className="px-4 py-3">Min RBT supervision</th>
                <th className="px-4 py-3">BCBA billable hrs/wk</th>
                <th className="px-4 py-3">Delegated admin hrs/wk</th>
                <th className="px-4 py-3">Owner non-billable hrs/wk</th>
                <th className="px-4 py-3">Collected/mo</th>
                <th className="px-4 py-3">Owner earnings pressure</th>
                <th className="px-4 py-3">Risk</th>
              </tr>
            </thead>
            <tbody>
              {bcbaCapacityScenarios.map((scenario) => (
                <tr key={scenario.label} className="border-slate-100 border-t">
                  <td className="px-4 py-3 font-semibold">
                    {scenario.label}
                  </td>
                  <td className="px-4 py-3">{scenario.clients}</td>
                  <td className="px-4 py-3">
                    {scenario.totalRbtHoursPerWeek}
                  </td>
                  <td className="px-4 py-3">
                    {scenario.minimumRbtSupervisionHoursPerWeek.toFixed(1)}
                  </td>
                  <td className="px-4 py-3">
                    {scenario.plannedBcbaBillableHoursPerWeek}
                  </td>
                  <td className="px-4 py-3">
                    {scenario.delegatedAdminHoursPerWeek}
                  </td>
                  <td className="px-4 py-3">
                    {scenario.ownerNonBillableHoursPerWeek}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {formatCurrency(scenario.monthlyCollected)}
                  </td>
                  <td className="px-4 py-3">
                    {formatCurrency(scenario.ownerEarningsBeforeTax)}
                  </td>
                  <td className="px-4 py-3">
                    <SeverityPill
                      severity={
                        scenario.capacityRisk === "high"
                          ? "high"
                          : scenario.capacityRisk === "moderate"
                            ? "medium"
                            : "low"
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-bold text-xl">State Launch Gates</h2>
            <p className="text-slate-600 text-sm">
              Each state must pass separately. One approval does not carry to
              another state or payer.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={stateFilter}
              onChange={(event) =>
                setStateFilter(event.target.value as StateCode | "all")
              }
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="all">All states</option>
              {states.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowOnlyRisk((value) => !value)}
              className={`rounded-md border px-3 py-2 font-semibold text-sm ${
                showOnlyRisk
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-slate-300 bg-white text-slate-700"
              }`}
            >
              Risk only
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Clients</th>
                <th className="px-4 py-3">Launch</th>
                <th className="px-4 py-3">Credentialing</th>
                <th className="px-4 py-3">Medicaid</th>
                <th className="px-4 py-3">Payroll</th>
                <th className="px-4 py-3">Next action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStates.map((state) => (
                <tr key={state.code} className="border-slate-100 border-t">
                  <td className="px-4 py-3 font-semibold">{state.name}</td>
                  <td className="px-4 py-3">{state.clientCount}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={state.launch} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={state.credentialing} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={state.medicaid} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={state.payroll} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {state.nextAction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">Medicaid Requirement Watch</h2>
            <p className="text-slate-600 text-sm">
              State-specific ABA Medicaid checkpoints that must be verified
              against current payer manuals before scheduling or billing.
            </p>
          </div>
          <FileCheck2 className="h-6 w-6 text-teal-700" />
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[1080px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Program</th>
                <th className="px-4 py-3">Provider path</th>
                <th className="px-4 py-3">Authorization</th>
                <th className="px-4 py-3">Direct therapy</th>
                <th className="px-4 py-3">BCBA supervision</th>
                <th className="px-4 py-3">Documentation</th>
                <th className="px-4 py-3">Supervision</th>
                <th className="px-4 py-3">Billing risk</th>
              </tr>
            </thead>
            <tbody>
              {medicaidRequirementSnapshots.map((requirement) => (
                <tr
                  key={requirement.state}
                  className="border-slate-100 border-t align-top"
                >
                  <td className="px-4 py-3 font-semibold">
                    {requirement.state}
                  </td>
                  <td className="px-4 py-3">{requirement.program}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {requirement.providerPath}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {requirement.authorizationRule}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {requirement.directTherapyRule}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {requirement.bcbaSupervisionRule}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {requirement.documentationRule}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {requirement.supervisionRule}
                  </td>
                  <td className="px-4 py-3 text-rose-700">
                    {requirement.billingRisk}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">Payer Template Library</h2>
            <p className="text-slate-600 text-sm">
              Company-specific payer setup first, then reusable templates for
              Medicaid, MCO, ASO, commercial, enrollment, authorization, claim,
              and follow-up workflows in the active states.
            </p>
          </div>
          <FileCheck2 className="h-6 w-6 text-teal-700" />
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Payer</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Credentialing</th>
                <th className="px-4 py-3">Auth template</th>
                <th className="px-4 py-3">Claim template</th>
                <th className="px-4 py-3">EFT/ERA</th>
                <th className="px-4 py-3">Timely filing</th>
                <th className="px-4 py-3">Next action</th>
              </tr>
            </thead>
            <tbody>
              {companyPayerConfigurations.map((payer) => (
                <tr
                  key={`${payer.state}-${payer.payerName}`}
                  className="border-slate-100 border-t align-top"
                >
                  <td className="px-4 py-3 font-semibold">{payer.state}</td>
                  <td className="px-4 py-3">{payer.payerName}</td>
                  <td className="px-4 py-3">{payer.payerType}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={payer.credentialing} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={payer.authTemplate} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={payer.claimTemplate} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={payer.eftEra} />
                  </td>
                  <td className="px-4 py-3">
                    {payer.timelyFilingDays
                      ? `${payer.timelyFilingDays} days`
                      : "verify"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {payer.nextAction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {payerCounts.map((item) => (
            <div
              key={item.state}
              className="rounded-lg border border-slate-200 p-3"
            >
              <p className="font-semibold">{item.state}</p>
              <p className="mt-1 text-2xl font-bold">{item.count}</p>
              <p className="text-slate-500 text-sm">
                {item.verified} starter verified, rest need payer confirmation
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[840px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Payer</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Portal/workflow</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Template fields</th>
              </tr>
            </thead>
            <tbody>
              {companyPayerTemplates.slice(0, 12).map((payer) => (
                <tr key={payer.id} className="border-slate-100 border-t">
                  <td className="px-4 py-3 font-semibold">{payer.state}</td>
                  <td className="px-4 py-3">{payer.payerName}</td>
                  <td className="px-4 py-3">{payer.category}</td>
                  <td className="px-4 py-3">{payer.portal}</td>
                  <td className="px-4 py-3">
                    <StatusPill
                      status={
                        payer.status === "starter" ? "ready" : "watch"
                      }
                    />
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    enrollment, auth, claim, follow-up
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">AI Operations Triage</h2>
            <p className="text-slate-600 text-sm">
              Rule-based AI assistant for launch, claims, supervision, HIPAA,
              and video risks. It creates recommendations only; humans close
              the item.
            </p>
          </div>
          <ShieldAlert className="h-6 w-6 text-rose-600" />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {aiRecommendations.slice(0, 8).map((recommendation) => (
            <article
              key={recommendation.id}
              className="rounded-lg border border-slate-200 p-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{recommendation.title}</p>
                  <p className="mt-1 text-slate-500 text-xs uppercase">
                    {recommendation.domain} · {recommendation.owner}
                  </p>
                </div>
                <SeverityPill severity={recommendation.severity} />
              </div>
              <p className="mt-3 text-slate-700 text-sm">
                {recommendation.finding}
              </p>
              <p className="mt-2 rounded-md bg-teal-50 p-2 text-sm text-teal-800">
                {recommendation.action}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-teal-700" />
            <h2 className="font-bold text-xl">Provider Profiles</h2>
          </div>
          <div className="mt-4 space-y-3">
            {providerProfiles.map((provider) => (
              <div
                key={provider.id}
                className="rounded-lg border border-slate-200 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{provider.name}</p>
                    <p className="text-slate-500 text-sm">
                      {provider.role.replaceAll("_", " ")} ·{" "}
                      {provider.states.join(", ")}
                    </p>
                  </div>
                  <StatusPill status={provider.status} />
                </div>
                <p className="mt-2 text-slate-600 text-sm">
                  {provider.activeClients} clients · {provider.supervisionLoad}{" "}
                  supervision items
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-teal-700" />
            <h2 className="font-bold text-xl">Authorization Guard</h2>
          </div>
          <div className="mt-4 space-y-3">
            {authorizations.map((authorization) => (
              <div
                key={authorization.id}
                className="rounded-lg border border-slate-200 p-3"
              >
                <p className="font-semibold">{authorization.patient}</p>
                <p className="mt-1 text-slate-500 text-sm">
                  {authorization.payer} · {authorization.state} ·{" "}
                  {authorization.cpt}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <p className="rounded-md bg-slate-50 p-2">
                    Units: <strong>{authorization.unitsRemaining}</strong>
                  </p>
                  <p className="rounded-md bg-slate-50 p-2">
                    Days: <strong>{authorization.expiresInDays}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <LockKeyhole className="h-5 w-5 text-teal-700" />
            <h2 className="font-bold text-xl">HIPAA Access Review</h2>
          </div>
          <div className="mt-4 space-y-3">
            {accessReviews.map((access) => (
              <div
                key={access.user}
                className="rounded-lg border border-slate-200 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{access.user}</p>
                    <p className="text-slate-500 text-sm">
                      {access.role} · {access.country}
                    </p>
                  </div>
                  <StatusPill
                    status={
                      access.hasMfa && access.minimumNecessary
                        ? access.lastReviewedDaysAgo > 30
                          ? "watch"
                          : "ready"
                        : "blocked"
                    }
                  />
                </div>
                <p className="mt-2 text-slate-600 text-sm">
                  MFA {access.hasMfa ? "on" : "off"} · minimum necessary{" "}
                  {access.minimumNecessary ? "yes" : "no"} · reviewed{" "}
                  {access.lastReviewedDaysAgo} days ago
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <BadgeCheck className="h-5 w-5 text-teal-700" />
          <h2 className="font-bold text-xl">RBT Supervision Monitor</h2>
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Revenue scenario</th>
                <th className="px-4 py-3">Clients</th>
                <th className="px-4 py-3">Direct RBT/therapy hrs/client/wk</th>
                <th className="px-4 py-3">BCBA billable hrs/wk</th>
                <th className="px-4 py-3">Direct rate/hr</th>
                <th className="px-4 py-3">Attendance</th>
                <th className="px-4 py-3">Denial loss</th>
                <th className="px-4 py-3">Collected/mo</th>
                <th className="px-4 py-3">Missed visit loss</th>
                <th className="px-4 py-3">BCBA earnings pressure</th>
              </tr>
            </thead>
            <tbody>
              {revenueSensitivity.map((scenario) => (
                <tr key={scenario.label} className="border-slate-100 border-t">
                  <td className="px-4 py-3 font-semibold">
                    {scenario.label}
                  </td>
                  <td className="px-4 py-3">{scenario.clients}</td>
                  <td className="px-4 py-3">
                    {scenario.directHoursPerClientWeek}
                  </td>
                  <td className="px-4 py-3">
                    {scenario.bcbaBillableHoursPerWeek}
                  </td>
                  <td className="px-4 py-3">
                    {formatCurrency(scenario.collectedDirectRatePerHour)}
                  </td>
                  <td className="px-4 py-3">
                    {formatPercent(scenario.attendanceRate)}
                  </td>
                  <td className="px-4 py-3">
                    {formatPercent(scenario.denialLossRate)}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {formatCurrency(scenario.monthlyCollected)}
                  </td>
                  <td className="px-4 py-3 text-rose-700">
                    {formatCurrency(scenario.missedVisitLoss)}
                  </td>
                  <td className="px-4 py-3">
                    {formatCurrency(scenario.ownerBcbaEarningsBeforeTax)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">RBT</th>
                <th className="px-4 py-3">Supervisor</th>
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3">Supervision %</th>
                <th className="px-4 py-3">Direct observation</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {supervisionRecords.map((record) => {
                const status =
                  record.supervisionPercent >= 5 && record.directObservationDone
                    ? "ready"
                    : "blocked";
                return (
                  <tr key={record.rbt} className="border-slate-100 border-t">
                    <td className="px-4 py-3 font-semibold">{record.rbt}</td>
                    <td className="px-4 py-3">{record.supervisingBcba}</td>
                    <td className="px-4 py-3">{record.month}</td>
                    <td className="px-4 py-3">
                      {record.supervisionPercent.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3">
                      {record.directObservationDone ? "Done" : "Missing"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-xl">India Call Center Operating Center</h2>
              <p className="text-slate-600 text-sm">
                India RCM can reduce cost only if work is scripted,
                minimum-necessary, audited, and escalated correctly. The team
                handles payer/admin operations; clinical decisions stay with
                the BCBA or owner.
              </p>
            </div>
            <Headphones className="h-6 w-6 text-teal-700" />
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {indiaCallCenterShifts.map((shift) => (
              <article
                key={shift.shift}
                className="rounded-lg border border-slate-200 p-3"
              >
                <p className="font-semibold">{shift.shift}</p>
                <p className="mt-1 text-slate-500 text-sm">
                  {shift.indiaTime} · {shift.usCoverage}
                </p>
                <p className="mt-3 text-slate-700 text-sm">
                  {shift.primaryWork}
                </p>
                <p className="mt-2 rounded-md bg-amber-50 p-2 text-amber-900 text-sm">
                  {shift.handoffRule}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full min-w-[1180px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Domain</th>
                  <th className="px-4 py-3">Allowed work</th>
                  <th className="px-4 py-3">Blocked work</th>
                  <th className="px-4 py-3">Required controls</th>
                  <th className="px-4 py-3">Escalation</th>
                </tr>
              </thead>
              <tbody>
                {indiaCallCenterOperatingRules.map((rule) => (
                  <tr key={rule.domain} className="border-slate-100 border-t align-top">
                    <td className="px-4 py-3 font-semibold">{rule.domain}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {rule.allowedWork.join("; ")}
                    </td>
                    <td className="px-4 py-3 text-rose-700">
                      {rule.blockedWork.join("; ")}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {rule.requiredControls.join("; ")}
                    </td>
                    <td className="px-4 py-3 text-amber-800">
                      {rule.escalationTrigger}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid gap-3 xl:grid-cols-3">
            {indiaCallScripts.map((script) => (
              <article
                key={script.id}
                className="rounded-lg border border-slate-200 p-3"
              >
                <p className="font-semibold">{script.callType}</p>
                <p className="mt-1 text-slate-500 text-sm">
                  {script.permittedPurpose}
                </p>
                <p className="mt-3 rounded-md bg-slate-50 p-2 text-slate-700 text-sm">
                  {script.scriptOpening}
                </p>
                <div className="mt-3 grid gap-2 text-sm">
                  <p>
                    <span className="font-semibold">Minimum fields:</span>{" "}
                    {script.minimumNecessaryFields.join("; ")}
                  </p>
                  <p>
                    <span className="font-semibold">Outcome fields:</span>{" "}
                    {script.requiredOutcomeFields.join("; ")}
                  </p>
                </div>
                <p className="mt-2 rounded-md bg-rose-50 p-2 text-rose-800 text-sm">
                  {script.escalationRule}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">QA metric</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3">Evidence</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {indiaCallCenterQaMetrics.map((metric) => (
                  <tr key={metric.metric} className="border-slate-100 border-t">
                    <td className="px-4 py-3 font-semibold">{metric.metric}</td>
                    <td className="px-4 py-3">{metric.target}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {metric.evidence}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={metric.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full min-w-[1180px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">US calling infrastructure</th>
                  <th className="px-4 py-3">Requirement</th>
                  <th className="px-4 py-3">Why needed</th>
                  <th className="px-4 py-3">Implementation</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {usCallingInfrastructure.map((item) => (
                  <tr key={item.domain} className="border-slate-100 border-t align-top">
                    <td className="px-4 py-3 font-semibold">{item.domain}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {item.requirement}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {item.whyNeeded}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {item.implementation}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {usCallingVendorReadiness.map((vendor) => (
              <article
                key={vendor.vendorType}
                className="rounded-lg border border-slate-200 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{vendor.vendorType}</p>
                    <p className="mt-1 text-slate-500 text-sm">
                      {vendor.requiredContract}
                    </p>
                  </div>
                  <StatusPill status={vendor.status} />
                </div>
                <p className="mt-3 text-slate-700 text-sm">
                  <span className="font-semibold">Must support:</span>{" "}
                  {vendor.mustSupport.join("; ")}
                </p>
                <p className="mt-2 rounded-md bg-slate-50 p-2 text-slate-700 text-sm">
                  {vendor.goLiveEvidence}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Offshore device control</th>
                    <th className="px-4 py-3">Requirement</th>
                    <th className="px-4 py-3">Enforcement</th>
                    <th className="px-4 py-3">Owner</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {offshoreDeviceControls.map((control) => (
                    <tr key={control.control} className="border-slate-100 border-t align-top">
                      <td className="px-4 py-3 font-semibold">{control.control}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {control.requirement}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {control.enforcement}
                      </td>
                      <td className="px-4 py-3">{control.owner}</td>
                      <td className="px-4 py-3">
                        <StatusPill status={control.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Recording policy</th>
                    <th className="px-4 py-3">Default</th>
                    <th className="px-4 py-3">Allowed when</th>
                    <th className="px-4 py-3">Storage</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {callRecordingConsentRules.map((rule) => (
                    <tr key={rule.callType} className="border-slate-100 border-t align-top">
                      <td className="px-4 py-3 font-semibold">{rule.callType}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {rule.defaultPolicy}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {rule.allowedWhen}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {rule.storageRule}
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={rule.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Escalation trigger</th>
                  <th className="px-4 py-3">India action</th>
                  <th className="px-4 py-3">US owner</th>
                  <th className="px-4 py-3">SLA</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {offshoreEscalationRoutes.map((route) => (
                  <tr key={route.trigger} className="border-slate-100 border-t align-top">
                    <td className="px-4 py-3 font-semibold">{route.trigger}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {route.indiaAction}
                    </td>
                    <td className="px-4 py-3">{route.usOwner}</td>
                    <td className="px-4 py-3 text-slate-600">{route.sla}</td>
                    <td className="px-4 py-3">
                      <StatusPill status={route.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-xl">Claims Call Queue</h2>
              <p className="text-slate-600 text-sm">
                Designed for India RCM staff to call payers, log reference
                numbers, and escalate denial risk.
              </p>
            </div>
            <Headphones className="h-6 w-6 text-teal-700" />
          </div>
          <div className="mt-4 space-y-3">
            {callCenterWorkQueue.map((task) => (
              <article
                key={task.id}
                className="rounded-lg border border-slate-200 p-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{task.issue}</p>
                    <p className="text-slate-500 text-sm">
                      {task.state} · {task.center} · {task.client} ·{" "}
                      {task.payer}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      task.priority === "high"
                        ? "bg-rose-50 text-rose-700"
                        : task.priority === "medium"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {task.owner}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                  <p className="rounded-md bg-slate-50 p-2">
                    <span className="font-semibold">Goal:</span>{" "}
                    {task.scriptGoal}
                  </p>
                  <p className="rounded-md bg-slate-50 p-2">
                    <span className="font-semibold">Referral:</span>{" "}
                    {task.referralPartner}
                  </p>
                  <p className="rounded-md bg-slate-50 p-2 md:col-span-2">
                    <span className="font-semibold">Escalation:</span>{" "}
                    {task.escalationRule}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-xl">Video Safety Alerts</h2>
              <p className="text-slate-600 text-sm">
                AI-assisted monitoring queue for live BCBA review.
              </p>
            </div>
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <div className="mt-4 space-y-3">
            {aiAlerts.map((alert) => (
              <article
                key={`${alert.child}-${alert.signal}`}
                className="rounded-lg border border-slate-200 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{alert.child}</p>
                  <span
                    className={`rounded-full px-2.5 py-1 font-semibold text-xs ${
                      alert.severity === "high"
                        ? "bg-rose-50 text-rose-700"
                        : alert.severity === "medium"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>
                <p className="mt-2 text-slate-700 text-sm">{alert.signal}</p>
                <p className="mt-2 rounded-md bg-teal-50 p-2 text-sm text-teal-800">
                  {alert.action}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-xl">App Improvement Roadmap</h2>
            <p className="text-slate-600 text-sm">
              Remaining product work to move from command-center prototype to a
              production ABA operating system.
            </p>
          </div>
          <LayoutDashboard className="h-6 w-6 text-teal-700" />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {appImprovementRoadmap.map((item) => (
            <article
              key={item.area}
              className="rounded-lg border border-slate-200 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{item.area}</p>
                  <p className="mt-1 text-slate-600 text-sm">
                    {item.improvement}
                  </p>
                </div>
                <StatusPill status={item.status} />
              </div>
              <p className="mt-3 text-slate-700 text-sm">
                {item.whyItMatters}
              </p>
              <p className="mt-2 rounded-md bg-slate-50 p-2 text-slate-700 text-sm">
                {item.nextImplementation}
              </p>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm xl:col-span-2">
          <h2 className="font-bold text-xl">Delegation Model</h2>
          <p className="mt-1 text-slate-600 text-sm">
            India operations can reduce cost, but only with strict access,
            scripts, audit logs, and clinical boundaries.
          </p>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {delegationLanes.map((lane) => (
              <article
                key={lane.lane}
                className="rounded-lg border border-slate-200 p-3"
              >
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5 text-teal-700" />
                  <p className="font-semibold">{lane.lane}</p>
                </div>
                <p className="mt-1 text-slate-500 text-sm">{lane.lead}</p>
                <p className="mt-3 text-sm">
                  <span className="font-semibold text-emerald-700">
                    Allowed:
                  </span>{" "}
                  {lane.allowed}
                </p>
                <p className="mt-2 text-sm">
                  <span className="font-semibold text-rose-700">Blocked:</span>{" "}
                  {lane.blocked}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="font-bold text-xl">BCBA Capacity Guardrail</h2>
          <div className="mt-4 space-y-3">
            {[
              ["Conservative start", "4-8 clients"],
              ["With trained RBTs + admin", "8-12 clients"],
              ["High-risk ceiling", "12-15 clients"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-md bg-slate-50 p-3"
              >
                <span className="text-slate-600 text-sm">{label}</span>
                <span className="font-bold">{value}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-slate-600 text-sm">
            Four states add licensing, payer, supervision, and travel/time-zone
            overhead. AI increases visibility, not legal clinical capacity.
          </p>
        </section>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <FileCheck2 className="h-5 w-5 text-teal-700" />
          <h2 className="font-bold text-xl">Document Packet</h2>
        </div>
        <p className="mt-1 text-slate-600 text-sm">
          Working SOPs and checklists now live in the project under
          docs/operations.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {documentPacket.map((doc) => (
            <article
              key={doc.path}
              className="rounded-lg border border-slate-200 p-3"
            >
              <p className="font-semibold">{doc.title}</p>
              <p className="mt-2 text-slate-600 text-sm">{doc.purpose}</p>
              <p className="mt-3 break-words rounded-md bg-slate-50 p-2 font-mono text-[11px] text-slate-500">
                {doc.path}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <LockKeyhole className="h-5 w-5 text-teal-700" />
          <h2 className="font-bold text-xl">HIPAA Control Checklist</h2>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {hipaaControls.map((control) => (
            <div
              key={control}
              className="flex gap-3 rounded-lg border border-slate-200 p-3"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-600" />
              <p className="text-slate-700 text-sm">{control}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          [ClipboardCheck, "Authorization", "Track CPT, units, dates, payer, and unused hours."],
          [FileCheck2, "Documentation", "Release claims only after signed notes and supervision checks."],
          [Banknote, "Payments", "Match EFT deposit, ERA allowed amount, write-off, and denial codes."],
          [Clock3, "Follow-up SLA", "Call at 14 days, escalate at 30 days, appeal before timely limits."],
        ].map(([Icon, title, body]) => {
          const CardIcon = Icon as typeof ShieldCheck;
          return (
            <article
              key={title as string}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <CardIcon className="h-5 w-5 text-teal-700" />
              <h3 className="mt-3 font-semibold">{title as string}</h3>
              <p className="mt-1 text-slate-600 text-sm">{body as string}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
