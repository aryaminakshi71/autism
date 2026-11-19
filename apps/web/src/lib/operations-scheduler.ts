export type ScheduleState = "WA" | "ND" | "CT" | "MO";
export type ServiceMode =
  | "in_person"
  | "telehealth_allowed"
  | "verify_before_use";
export type ScheduleRole = "rbt" | "bcba";
export type ScheduleServiceType =
  | "rbt_direct_treatment"
  | "bcba_supervision"
  | "bcba_protocol_modification"
  | "bcba_parent_training"
  | "bcba_assessment";

export interface StateSchedulingRule {
  state: ScheduleState;
  directTreatmentMode: ServiceMode;
  remoteSupervisionMode: ServiceMode;
  parentTrainingMode: ServiceMode;
  remoteSupervisionAllowedHoursPerClientWeek: number;
  onlineParentTrainingAllowedHoursPerClientWeek: number;
  remoteRequirements: string[];
  supervisionFormula: string;
  bcbaPlanningRangeHoursPerClientWeek: string;
  schedulingRisk: string;
  verificationSource: string;
}

export interface ClientRequirement {
  client: string;
  state: ScheduleState;
  center: string;
  payer: string;
  authorizedDirectHoursPerWeek: number;
  targetDeliveredDirectHoursPerWeek: number;
  minimumDeliveredDirectHoursPerWeek: number;
  bcbaTreatmentHoursPerWeek: number;
  bcbaSupervisionHoursPerWeek: number;
  bcbaParentTrainingHoursPerWeek: number;
  preferredMode: ServiceMode;
  assignedRbt: string;
}

export interface StaffCapacity {
  staff: string;
  role: ScheduleRole;
  states: ScheduleState[];
  paidHoursPerWeek: number;
  targetBillableHoursPerWeek: number;
}

export interface WeeklyScheduleBlock {
  id: string;
  staff: string;
  role: ScheduleRole;
  client: string;
  state: ScheduleState;
  serviceType: ScheduleServiceType;
  mode: ServiceMode;
  hours: number;
  billable: boolean;
  ruleStatus: "ok" | "verify" | "blocked";
}

export interface StaffScheduleSummary {
  staff: string;
  role: ScheduleRole;
  paidHoursPerWeek: number;
  targetBillableHoursPerWeek: number;
  scheduledBillableHours: number;
  scheduledNonBillableHours: number;
  utilizationRate: number;
  status: "underfilled" | "target" | "overbooked";
  notes: string[];
}

export const stateSchedulingRules: StateSchedulingRule[] = [
  {
    state: "WA",
    directTreatmentMode: "in_person",
    remoteSupervisionMode: "telehealth_allowed",
    parentTrainingMode: "telehealth_allowed",
    remoteSupervisionAllowedHoursPerClientWeek: 2,
    onlineParentTrainingAllowedHoursPerClientWeek: 1,
    remoteRequirements: [
      "Bill according to WAC 182-531A-1200 and HCA telemedicine billing instructions.",
      "Use telemedicine only for authorized ABA supervision/family training contexts.",
      "Document child/caregiver presence where required, mode, time, participants, and clinical purpose.",
      "Use correct POS/modifier required by HCA/MCO before claim release.",
    ],
    supervisionFormula:
      "Plan at least 5% LBAT/BCBA supervision of CBT/direct therapy hours per week per child, plus treatment-plan and caregiver work.",
    bcbaPlanningRangeHoursPerClientWeek:
      "2-3 hours/week for a 30-hour direct program, adjusted by acuity and authorization.",
    schedulingRisk:
      "Direct RBT treatment should default to in-person unless the authorization and payer rule clearly allow telehealth.",
    verificationSource:
      "Washington Apple Health ABA billing guide/WAC telemedicine references.",
  },
  {
    state: "ND",
    directTreatmentMode: "verify_before_use",
    remoteSupervisionMode: "verify_before_use",
    parentTrainingMode: "verify_before_use",
    remoteSupervisionAllowedHoursPerClientWeek: 0,
    onlineParentTrainingAllowedHoursPerClientWeek: 0,
    remoteRequirements: [
      "Verify telehealth allowance in the ND Medicaid authorization or payer contract before scheduling remote billable work.",
      "Confirm CPT, modifier, POS, and provider eligibility with the payer.",
      "Keep remote hours at zero in the billable plan until payer written approval is stored.",
    ],
    supervisionFormula:
      "Use authorized service-code units, treatment-plan need, provider rules, and BACB RBT supervision minimums; no fixed weekly BCBA-hour rule is assumed.",
    bcbaPlanningRangeHoursPerClientWeek:
      "2-3 hours/week planning placeholder until ND authorization specifies units.",
    schedulingRisk:
      "Do not bill remote treatment or supervision until ND Medicaid/payer authorization confirms allowed mode and code.",
    verificationSource:
      "ND Medicaid Autism ABA service policy and payer authorization.",
  },
  {
    state: "CT",
    directTreatmentMode: "verify_before_use",
    remoteSupervisionMode: "verify_before_use",
    parentTrainingMode: "verify_before_use",
    remoteSupervisionAllowedHoursPerClientWeek: 0,
    onlineParentTrainingAllowedHoursPerClientWeek: 0,
    remoteRequirements: [
      "Verify HUSKY/CMAP telehealth coverage for the exact ASD CPT and authorization.",
      "Parent training codes 97156/97156 U2 require qualified provider delivery and prior authorization after the transition period.",
      "Remote parent training is not marked billable until CMAP/Carelon authorization confirms mode and code.",
    ],
    supervisionFormula:
      "Plan 1 hour supervision for every 10 treatment hours where the ASD policy applies, documented weekly.",
    bcbaPlanningRangeHoursPerClientWeek:
      "About 3 hours/week for a 30-hour direct program under the 1:10 planning rule.",
    schedulingRisk:
      "CT has ASD and telehealth bulletins, but mode must be verified for the exact HUSKY/CMAP code and authorization.",
    verificationSource:
      "CT HUSKY/CMAP ASD provider bulletins and authorization.",
  },
  {
    state: "MO",
    directTreatmentMode: "in_person",
    remoteSupervisionMode: "verify_before_use",
    parentTrainingMode: "verify_before_use",
    remoteSupervisionAllowedHoursPerClientWeek: 0,
    onlineParentTrainingAllowedHoursPerClientWeek: 0,
    remoteRequirements: [
      "Verify MO HealthNet or MCO telehealth coverage before billing remote supervision or parent training.",
      "Confirm LBA/LP supervision relationship, technician rules, CPT, modifier, POS, and authorization.",
      "Default direct treatment to in-person and hold remote BCBA billing until payer approval is stored.",
    ],
    supervisionFormula:
      "Document supervisory relationship, medical necessity, treatment plan, technician credentialing, and payer-authorized units.",
    bcbaPlanningRangeHoursPerClientWeek:
      "2-3 hours/week planning placeholder until MO HealthNet/MCO authorization specifies units.",
    schedulingRisk:
      "Do not assume online treatment or remote supervision is billable unless MO HealthNet/MCO contract and authorization allow it.",
    verificationSource:
      "MO HealthNet ABA rule, documentation guidance, and MCO authorization.",
  },
];

export const clientRequirements: ClientRequirement[] = [
  {
    client: "Client WA-01",
    state: "WA",
    center: "WA Center",
    payer: "Washington Apple Health / ProviderOne",
    authorizedDirectHoursPerWeek: 40,
    targetDeliveredDirectHoursPerWeek: 30,
    minimumDeliveredDirectHoursPerWeek: 30,
    bcbaTreatmentHoursPerWeek: 1,
    bcbaSupervisionHoursPerWeek: 2,
    bcbaParentTrainingHoursPerWeek: 1,
    preferredMode: "in_person",
    assignedRbt: "RBT WA-1",
  },
  {
    client: "Client ND-01",
    state: "ND",
    center: "ND Center",
    payer: "North Dakota Medicaid",
    authorizedDirectHoursPerWeek: 40,
    targetDeliveredDirectHoursPerWeek: 30,
    minimumDeliveredDirectHoursPerWeek: 30,
    bcbaTreatmentHoursPerWeek: 1,
    bcbaSupervisionHoursPerWeek: 2,
    bcbaParentTrainingHoursPerWeek: 1,
    preferredMode: "verify_before_use",
    assignedRbt: "RBT ND-1",
  },
  {
    client: "Client CT-01",
    state: "CT",
    center: "CT Center",
    payer: "Connecticut Medical Assistance Program / HUSKY",
    authorizedDirectHoursPerWeek: 40,
    targetDeliveredDirectHoursPerWeek: 30,
    minimumDeliveredDirectHoursPerWeek: 30,
    bcbaTreatmentHoursPerWeek: 1,
    bcbaSupervisionHoursPerWeek: 3,
    bcbaParentTrainingHoursPerWeek: 1,
    preferredMode: "verify_before_use",
    assignedRbt: "RBT CT-1",
  },
  {
    client: "Client MO-01",
    state: "MO",
    center: "MO Center",
    payer: "MO HealthNet",
    authorizedDirectHoursPerWeek: 40,
    targetDeliveredDirectHoursPerWeek: 30,
    minimumDeliveredDirectHoursPerWeek: 30,
    bcbaTreatmentHoursPerWeek: 1,
    bcbaSupervisionHoursPerWeek: 2,
    bcbaParentTrainingHoursPerWeek: 1,
    preferredMode: "in_person",
    assignedRbt: "RBT MO-1",
  },
];

export const staffCapacities: StaffCapacity[] = [
  {
    staff: "Owner BCBA",
    role: "bcba",
    states: ["WA", "ND", "CT", "MO"],
    paidHoursPerWeek: 40,
    targetBillableHoursPerWeek: 30,
  },
  ...clientRequirements.map<StaffCapacity>((client) => ({
    staff: client.assignedRbt,
    role: "rbt",
    states: [client.state],
    paidHoursPerWeek: 40,
    targetBillableHoursPerWeek: 30,
  })),
];

function getRule(state: ScheduleState) {
  return stateSchedulingRules.find((rule) => rule.state === state);
}

function getRuleStatus(
  state: ScheduleState,
  serviceType: ScheduleServiceType,
  mode: ServiceMode,
) {
  const rule = getRule(state);
  if (!rule) return "verify" as const;

  if (serviceType === "rbt_direct_treatment") {
    if (
      mode === "telehealth_allowed" &&
      rule.directTreatmentMode !== "telehealth_allowed"
    ) {
      return "verify" as const;
    }
    return rule.directTreatmentMode === "verify_before_use"
      ? ("verify" as const)
      : ("ok" as const);
  }

  if (serviceType === "bcba_parent_training") {
    return rule.parentTrainingMode === "verify_before_use"
      ? ("verify" as const)
      : ("ok" as const);
  }

  return rule.remoteSupervisionMode === "verify_before_use"
    ? ("verify" as const)
    : ("ok" as const);
}

export function buildWeeklyScheduleBlocks(): WeeklyScheduleBlock[] {
  return clientRequirements.flatMap<WeeklyScheduleBlock>((client) => [
    {
      id: `${client.client}-rbt-direct`,
      staff: client.assignedRbt,
      role: "rbt",
      client: client.client,
      state: client.state,
      serviceType: "rbt_direct_treatment",
      mode: client.preferredMode,
      hours: client.targetDeliveredDirectHoursPerWeek,
      billable: true,
      ruleStatus: getRuleStatus(
        client.state,
        "rbt_direct_treatment",
        client.preferredMode,
      ),
    },
    {
      id: `${client.client}-bcba-supervision`,
      staff: "Owner BCBA",
      role: "bcba",
      client: client.client,
      state: client.state,
      serviceType: "bcba_supervision",
      mode: getRule(client.state)?.remoteSupervisionMode ?? "verify_before_use",
      hours: client.bcbaSupervisionHoursPerWeek,
      billable: true,
      ruleStatus: getRuleStatus(
        client.state,
        "bcba_supervision",
        getRule(client.state)?.remoteSupervisionMode ?? "verify_before_use",
      ),
    },
    {
      id: `${client.client}-bcba-treatment`,
      staff: "Owner BCBA",
      role: "bcba",
      client: client.client,
      state: client.state,
      serviceType: "bcba_protocol_modification",
      mode: "in_person",
      hours: client.bcbaTreatmentHoursPerWeek,
      billable: true,
      ruleStatus: "ok",
    },
    {
      id: `${client.client}-bcba-parent-training`,
      staff: "Owner BCBA",
      role: "bcba",
      client: client.client,
      state: client.state,
      serviceType: "bcba_parent_training",
      mode: getRule(client.state)?.parentTrainingMode ?? "verify_before_use",
      hours: client.bcbaParentTrainingHoursPerWeek,
      billable: true,
      ruleStatus: getRuleStatus(
        client.state,
        "bcba_parent_training",
        getRule(client.state)?.parentTrainingMode ?? "verify_before_use",
      ),
    },
  ]);
}

export function buildStaffScheduleSummaries(): StaffScheduleSummary[] {
  const blocks = buildWeeklyScheduleBlocks();

  return staffCapacities.map((staff) => {
    const staffBlocks = blocks.filter((block) => block.staff === staff.staff);
    const scheduledBillableHours = staffBlocks
      .filter((block) => block.billable)
      .reduce((total, block) => total + block.hours, 0);
    const scheduledNonBillableHours = Math.max(
      staff.paidHoursPerWeek - scheduledBillableHours,
      0,
    );
    const utilizationRate = scheduledBillableHours / staff.paidHoursPerWeek;
    const verificationCount = staffBlocks.filter(
      (block) => block.ruleStatus !== "ok",
    ).length;
    const status =
      scheduledBillableHours > staff.targetBillableHoursPerWeek + 2
        ? "overbooked"
        : scheduledBillableHours < staff.targetBillableHoursPerWeek - 2
          ? "underfilled"
          : "target";
    const notes: string[] = [];

    if (verificationCount > 0) {
      notes.push(
        `${verificationCount} block(s) need state/payer mode verification`,
      );
    }
    if (status === "underfilled") {
      notes.push(
        "Add billable blocks or adjust paid hours to protect retention",
      );
    }
    if (status === "overbooked") {
      notes.push("Add another qualified provider or reduce assignment");
    }

    return {
      staff: staff.staff,
      role: staff.role,
      paidHoursPerWeek: staff.paidHoursPerWeek,
      targetBillableHoursPerWeek: staff.targetBillableHoursPerWeek,
      scheduledBillableHours,
      scheduledNonBillableHours,
      utilizationRate,
      status,
      notes,
    };
  });
}
