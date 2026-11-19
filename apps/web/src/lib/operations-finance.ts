export type FinanceScenarioKey = "ten_clients" | "fifteen_clients";
export type BackOfficeModelKey =
  | "us_rcm"
  | "india_contractor"
  | "india_company";

export interface FinanceAssumptions {
  clients: number;
  directHoursPerClientWeek: number;
  bcbaHoursPerClientWeek: number;
  collectedDirectRatePerHour: number;
  collectedBcbaRatePerHour: number;
  collectionRate: number;
  rbtHourlyWage: number;
  loadedPayrollMultiplier: number;
  bcbaSupportHourlyCost: number;
  fixedClinicCostMonthly: number;
  insuranceComplianceMonthly: number;
  payrollSoftwareBaseMonthly: number;
  payrollSoftwarePerPersonMonthly: number;
  softwarePlatformPerClientMonthly: number;
  credentialingAmortizedMonthly: number;
}

export interface FinanceResult {
  key: string;
  scenarioLabel: string;
  clients: number;
  backOfficeModel: BackOfficeModelKey;
  grossRevenue: number;
  collectibleRevenue: number;
  directLaborCost: number;
  bcbaSupportCost: number;
  backOfficeCost: number;
  softwareAndPayrollCost: number;
  fixedCost: number;
  totalCost: number;
  operatingProfitBeforeOwnerTax: number;
  margin: number;
  savingsVsUsRcm?: number;
}

export interface RevenueSensitivityResult {
  label: string;
  clients: number;
  directHoursPerClientWeek: number;
  bcbaBillableHoursPerWeek: number;
  collectedDirectRatePerHour: number;
  collectedBcbaRatePerHour: number;
  attendanceRate: number;
  denialLossRate: number;
  monthlyCollected: number;
  missedVisitLoss: number;
  denialLoss: number;
  ownerBcbaEarningsBeforeTax: number;
}

export interface BcbaCapacityScenario {
  label: string;
  clients: number;
  directHoursPerClientWeek: number;
  totalRbtHoursPerWeek: number;
  minimumRbtSupervisionHoursPerWeek: number;
  plannedBcbaBillableHoursPerWeek: number;
  delegatedAdminHoursPerWeek: number;
  ownerNonBillableHoursPerWeek: number;
  utilizationRate: number;
  monthlyCollected: number;
  operatingProfitBeforeOwnerTax: number;
  ownerEarningsBeforeTax: number;
  capacityRisk: "low" | "moderate" | "high";
}

export interface TimeZoneOperatingWindow {
  state: "WA" | "ND" | "CT" | "MO" | "IN";
  location: string;
  currentSummerTimeZone: string;
  indiaOffset: string;
  operatingUse: string;
}

export interface HighHourRetentionScenario {
  label: string;
  clients: number;
  authorizedDirectHoursPerClientWeek: number;
  minimumAcceptedDirectHoursPerClientWeek: number;
  expectedDeliveredDirectHoursPerClientWeek: number;
  rbtFullTimeEquivalentCount: number;
  rbtPaidHoursPerWeek: number;
  rbtBillableHoursPerWeek: number;
  rbtUtilizationRate: number;
  bcbaPaidHoursPerWeek: number;
  bcbaBillableHoursPerWeek: number;
  bcbaUtilizationRate: number;
  rbtRevenueMonthly: number;
  bcbaRevenueMonthly: number;
  totalRevenueMonthly: number;
  rbtPayrollMonthly: number;
  grossClinicalMarginMonthly: number;
  retentionLogic: string;
}

const weeksPerMonth = 4.33;
const ownerAvailableHoursPerWeek = 40;

export const baseFinanceAssumptions: FinanceAssumptions = {
  clients: 10,
  directHoursPerClientWeek: 15,
  bcbaHoursPerClientWeek: 2,
  collectedDirectRatePerHour: 50,
  collectedBcbaRatePerHour: 110,
  collectionRate: 0.92,
  rbtHourlyWage: 28,
  loadedPayrollMultiplier: 1.18,
  bcbaSupportHourlyCost: 65,
  fixedClinicCostMonthly: 4200,
  insuranceComplianceMonthly: 1200,
  payrollSoftwareBaseMonthly: 80,
  payrollSoftwarePerPersonMonthly: 12,
  softwarePlatformPerClientMonthly: 80,
  credentialingAmortizedMonthly: 1200,
};

export const backOfficeModelLabels: Record<BackOfficeModelKey, string> = {
  us_rcm: "US outsourced RCM",
  india_contractor: "India contractor team",
  india_company: "India company/subsidiary",
};

function getBackOfficeCost(
  model: BackOfficeModelKey,
  collectibleRevenue: number,
  clients: number,
) {
  if (model === "us_rcm") {
    return Math.max(1200, collectibleRevenue * 0.06);
  }

  if (model === "india_contractor") {
    const rcmSupport = clients <= 10 ? 700 : 1100;
    const softwareSupport = clients <= 10 ? 450 : 700;
    return rcmSupport + softwareSupport;
  }

  const offshoreOps = clients <= 10 ? 1500 : 2300;
  const indiaEntityOverhead = 1200;
  const crossBorderCompliance = 500;
  return offshoreOps + indiaEntityOverhead + crossBorderCompliance;
}

export function calculateFinanceScenario(
  assumptions: FinanceAssumptions,
  model: BackOfficeModelKey,
  scenarioLabel = "Base",
): FinanceResult {
  const grossRevenue =
    assumptions.clients *
    weeksPerMonth *
    (assumptions.directHoursPerClientWeek *
      assumptions.collectedDirectRatePerHour +
      assumptions.bcbaHoursPerClientWeek *
        assumptions.collectedBcbaRatePerHour);
  const collectibleRevenue = grossRevenue * assumptions.collectionRate;
  const directLaborCost =
    assumptions.clients *
    assumptions.directHoursPerClientWeek *
    weeksPerMonth *
    assumptions.rbtHourlyWage *
    assumptions.loadedPayrollMultiplier;
  const bcbaSupportCost =
    assumptions.clients *
    assumptions.bcbaHoursPerClientWeek *
    weeksPerMonth *
    assumptions.bcbaSupportHourlyCost;
  const employeeCount = assumptions.clients + 3;
  const softwareAndPayrollCost =
    assumptions.payrollSoftwareBaseMonthly +
    assumptions.payrollSoftwarePerPersonMonthly * employeeCount +
    assumptions.softwarePlatformPerClientMonthly * assumptions.clients;
  const fixedCost =
    assumptions.fixedClinicCostMonthly +
    assumptions.insuranceComplianceMonthly +
    assumptions.credentialingAmortizedMonthly;
  const backOfficeCost = getBackOfficeCost(
    model,
    collectibleRevenue,
    assumptions.clients,
  );
  const totalCost =
    directLaborCost +
    bcbaSupportCost +
    backOfficeCost +
    softwareAndPayrollCost +
    fixedCost;
  const operatingProfitBeforeOwnerTax = collectibleRevenue - totalCost;

  return {
    key: `${scenarioLabel}-${assumptions.clients}-${model}`,
    scenarioLabel,
    clients: assumptions.clients,
    backOfficeModel: model,
    grossRevenue,
    collectibleRevenue,
    directLaborCost,
    bcbaSupportCost,
    backOfficeCost,
    softwareAndPayrollCost,
    fixedCost,
    totalCost,
    operatingProfitBeforeOwnerTax,
    margin:
      collectibleRevenue > 0
        ? operatingProfitBeforeOwnerTax / collectibleRevenue
        : 0,
  };
}

export function buildFinanceResults() {
  const scenarios: Array<FinanceAssumptions & { scenarioLabel: string }> = [
    {
      ...baseFinanceAssumptions,
      scenarioLabel: "Old conservative center-style",
      clients: 10,
    },
    {
      ...baseFinanceAssumptions,
      scenarioLabel: "Old conservative center-style",
      clients: 15,
      fixedClinicCostMonthly: 6200,
      insuranceComplianceMonthly: 1600,
      credentialingAmortizedMonthly: 1500,
    },
    {
      ...baseFinanceAssumptions,
      scenarioLabel: "Software-style high-utilization",
      clients: 10,
      directHoursPerClientWeek: 25,
      bcbaHoursPerClientWeek: 3,
      collectedDirectRatePerHour: 70,
      collectedBcbaRatePerHour: 140,
      collectionRate: 0.94,
      fixedClinicCostMonthly: 3000,
      insuranceComplianceMonthly: 1200,
      credentialingAmortizedMonthly: 1200,
    },
    {
      ...baseFinanceAssumptions,
      scenarioLabel: "Software-style high-utilization",
      clients: 15,
      directHoursPerClientWeek: 25,
      bcbaHoursPerClientWeek: 34 / 15,
      collectedDirectRatePerHour: 70,
      collectedBcbaRatePerHour: 140,
      collectionRate: 0.94,
      fixedClinicCostMonthly: 4200,
      insuranceComplianceMonthly: 1600,
      credentialingAmortizedMonthly: 1500,
    },
  ];

  const results = scenarios.flatMap((scenario) =>
    (["us_rcm", "india_contractor", "india_company"] as const).map((model) =>
      calculateFinanceScenario(scenario, model, scenario.scenarioLabel),
    ),
  );

  return results.map((result) => {
    const matchingUs = results.find(
      (item) =>
        item.clients === result.clients &&
        item.scenarioLabel === result.scenarioLabel &&
        item.backOfficeModel === "us_rcm",
    );
    return {
      ...result,
      savingsVsUsRcm:
        matchingUs && result.backOfficeModel !== "us_rcm"
          ? matchingUs.totalCost - result.totalCost
          : undefined,
    };
  });
}

export function buildTimeZoneOperatingWindows(): TimeZoneOperatingWindow[] {
  return [
    {
      state: "CT",
      location: "Connecticut",
      currentSummerTimeZone: "Eastern Daylight Time",
      indiaOffset: "India is 9.5 hours ahead",
      operatingUse:
        "Earliest US clinical block; India can finish next-day claim checks before CT morning starts.",
    },
    {
      state: "ND",
      location: "North Dakota",
      currentSummerTimeZone:
        "Mostly Central Daylight Time; some Mountain Time areas",
      indiaOffset: "India is usually 10.5 to 11.5 hours ahead",
      operatingUse:
        "Useful middle block for payer calls and parent/RBT follow-up after CT morning.",
    },
    {
      state: "MO",
      location: "Missouri",
      currentSummerTimeZone: "Central Daylight Time",
      indiaOffset: "India is 10.5 hours ahead",
      operatingUse:
        "Pairs well with ND for central scheduling, claim status calls, and evening parent training.",
    },
    {
      state: "WA",
      location: "Washington",
      currentSummerTimeZone: "Pacific Daylight Time",
      indiaOffset: "India is 12.5 hours ahead",
      operatingUse:
        "Latest US clinical block; India can prepare auth/claim queues overnight for WA morning.",
    },
    {
      state: "IN",
      location: "India back office",
      currentSummerTimeZone: "India Standard Time",
      indiaOffset: "Ahead of every active US state",
      operatingUse:
        "Use for overnight eligibility, document QA, claim scrubbing, denial packets, dashboards, and software support.",
    },
  ];
}

export function buildRevenueSensitivity() {
  const scenarios = [
    {
      label: "Conservative Medicaid-heavy",
      clients: 10,
      directHoursPerClientWeek: 15,
      bcbaBillableHoursPerWeek: 20,
      collectedDirectRatePerHour: 50,
      collectedBcbaRatePerHour: 110,
      attendanceRate: 0.88,
      denialLossRate: 0.08,
    },
    {
      label: "Base mixed payer",
      clients: 10,
      directHoursPerClientWeek: 20,
      bcbaBillableHoursPerWeek: 28,
      collectedDirectRatePerHour: 65,
      collectedBcbaRatePerHour: 125,
      attendanceRate: 0.9,
      denialLossRate: 0.06,
    },
    {
      label: "Higher utilization/commercial mix",
      clients: 10,
      directHoursPerClientWeek: 25,
      bcbaBillableHoursPerWeek: 32,
      collectedDirectRatePerHour: 80,
      collectedBcbaRatePerHour: 150,
      attendanceRate: 0.92,
      denialLossRate: 0.04,
    },
    {
      label: "15-client base mixed payer",
      clients: 15,
      directHoursPerClientWeek: 20,
      bcbaBillableHoursPerWeek: 34,
      collectedDirectRatePerHour: 65,
      collectedBcbaRatePerHour: 125,
      attendanceRate: 0.9,
      denialLossRate: 0.06,
    },
  ];

  return scenarios.map<RevenueSensitivityResult>((scenario) => {
    const scheduledGross =
      scenario.clients *
        weeksPerMonth *
        scenario.directHoursPerClientWeek *
        scenario.collectedDirectRatePerHour +
      scenario.bcbaBillableHoursPerWeek *
        weeksPerMonth *
        scenario.collectedBcbaRatePerHour;
    const attendanceAdjusted = scheduledGross * scenario.attendanceRate;
    const monthlyCollected = attendanceAdjusted * (1 - scenario.denialLossRate);
    const missedVisitLoss = scheduledGross * (1 - scenario.attendanceRate);
    const denialLoss = attendanceAdjusted * scenario.denialLossRate;
    const comparable = calculateFinanceScenario(
      {
        ...baseFinanceAssumptions,
        clients: scenario.clients,
        directHoursPerClientWeek: scenario.directHoursPerClientWeek,
        bcbaHoursPerClientWeek:
          scenario.bcbaBillableHoursPerWeek / scenario.clients,
        collectedDirectRatePerHour: scenario.collectedDirectRatePerHour,
        collectedBcbaRatePerHour: scenario.collectedBcbaRatePerHour,
        collectionRate: scenario.attendanceRate * (1 - scenario.denialLossRate),
        fixedClinicCostMonthly: scenario.clients >= 15 ? 6200 : 4200,
        insuranceComplianceMonthly: scenario.clients >= 15 ? 1600 : 1200,
        credentialingAmortizedMonthly: scenario.clients >= 15 ? 1500 : 1200,
      },
      "india_contractor",
    );

    return {
      ...scenario,
      monthlyCollected,
      missedVisitLoss,
      denialLoss,
      ownerBcbaEarningsBeforeTax:
        comparable.operatingProfitBeforeOwnerTax + comparable.bcbaSupportCost,
    };
  });
}

export function buildBcbaCapacityScenarios() {
  const scenarios = [
    {
      label: "10 clients, Medicaid-heavy",
      clients: 10,
      directHoursPerClientWeek: 20,
      plannedBcbaBillableHoursPerWeek: 26,
      delegatedAdminHoursPerWeek: 12,
      ownerNonBillableHoursPerWeek: 14,
      collectedDirectRatePerHour: 55,
      collectedBcbaRatePerHour: 120,
      attendanceRate: 0.88,
      denialLossRate: 0.08,
    },
    {
      label: "10 clients, mixed payer",
      clients: 10,
      directHoursPerClientWeek: 25,
      plannedBcbaBillableHoursPerWeek: 30,
      delegatedAdminHoursPerWeek: 16,
      ownerNonBillableHoursPerWeek: 10,
      collectedDirectRatePerHour: 70,
      collectedBcbaRatePerHour: 140,
      attendanceRate: 0.9,
      denialLossRate: 0.06,
    },
    {
      label: "15 clients, tight but possible",
      clients: 15,
      directHoursPerClientWeek: 20,
      plannedBcbaBillableHoursPerWeek: 34,
      delegatedAdminHoursPerWeek: 20,
      ownerNonBillableHoursPerWeek: 6,
      collectedDirectRatePerHour: 70,
      collectedBcbaRatePerHour: 140,
      attendanceRate: 0.9,
      denialLossRate: 0.06,
    },
    {
      label: "15 clients, overextended",
      clients: 15,
      directHoursPerClientWeek: 25,
      plannedBcbaBillableHoursPerWeek: 38,
      delegatedAdminHoursPerWeek: 22,
      ownerNonBillableHoursPerWeek: 2,
      collectedDirectRatePerHour: 75,
      collectedBcbaRatePerHour: 150,
      attendanceRate: 0.88,
      denialLossRate: 0.08,
    },
  ];

  return scenarios.map<BcbaCapacityScenario>((scenario) => {
    const totalRbtHoursPerWeek =
      scenario.clients * scenario.directHoursPerClientWeek;
    const minimumRbtSupervisionHoursPerWeek = totalRbtHoursPerWeek * 0.05;
    const utilizationRate =
      scenario.plannedBcbaBillableHoursPerWeek / ownerAvailableHoursPerWeek;
    const scheduledGross =
      totalRbtHoursPerWeek *
        weeksPerMonth *
        scenario.collectedDirectRatePerHour +
      scenario.plannedBcbaBillableHoursPerWeek *
        weeksPerMonth *
        scenario.collectedBcbaRatePerHour;
    const monthlyCollected =
      scheduledGross * scenario.attendanceRate * (1 - scenario.denialLossRate);
    const finance = calculateFinanceScenario(
      {
        ...baseFinanceAssumptions,
        clients: scenario.clients,
        directHoursPerClientWeek: scenario.directHoursPerClientWeek,
        bcbaHoursPerClientWeek:
          scenario.plannedBcbaBillableHoursPerWeek / scenario.clients,
        collectedDirectRatePerHour: scenario.collectedDirectRatePerHour,
        collectedBcbaRatePerHour: scenario.collectedBcbaRatePerHour,
        collectionRate: scenario.attendanceRate * (1 - scenario.denialLossRate),
        fixedClinicCostMonthly: scenario.clients >= 15 ? 6200 : 4200,
        insuranceComplianceMonthly: scenario.clients >= 15 ? 1600 : 1200,
        credentialingAmortizedMonthly: scenario.clients >= 15 ? 1500 : 1200,
      },
      "india_contractor",
    );
    const capacityRisk =
      utilizationRate > 0.85 || scenario.ownerNonBillableHoursPerWeek < 6
        ? "high"
        : utilizationRate > 0.7
          ? "moderate"
          : "low";

    return {
      label: scenario.label,
      clients: scenario.clients,
      directHoursPerClientWeek: scenario.directHoursPerClientWeek,
      totalRbtHoursPerWeek,
      minimumRbtSupervisionHoursPerWeek,
      plannedBcbaBillableHoursPerWeek: scenario.plannedBcbaBillableHoursPerWeek,
      delegatedAdminHoursPerWeek: scenario.delegatedAdminHoursPerWeek,
      ownerNonBillableHoursPerWeek: scenario.ownerNonBillableHoursPerWeek,
      utilizationRate,
      monthlyCollected,
      operatingProfitBeforeOwnerTax: finance.operatingProfitBeforeOwnerTax,
      ownerEarningsBeforeTax:
        finance.operatingProfitBeforeOwnerTax + finance.bcbaSupportCost,
      capacityRisk,
    };
  });
}

export function buildHighHourRetentionScenarios(): HighHourRetentionScenario[] {
  const scenarios = [
    {
      label: "Reject low-hour case",
      clients: 1,
      authorizedDirectHoursPerClientWeek: 15,
      minimumAcceptedDirectHoursPerClientWeek: 30,
      expectedDeliveredDirectHoursPerClientWeek: 15,
      rbtFullTimeEquivalentCount: 0.5,
      bcbaBillableHoursPerClientWeek: 2,
      collectedDirectRatePerHour: 65,
      collectedBcbaRatePerHour: 135,
      rbtHourlyWage: 28,
      retentionLogic:
        "Low hours do not create a stable RBT paycheck, so both RBT and client retention are weak.",
    },
    {
      label: "One high-hour client",
      clients: 1,
      authorizedDirectHoursPerClientWeek: 40,
      minimumAcceptedDirectHoursPerClientWeek: 30,
      expectedDeliveredDirectHoursPerClientWeek: 30,
      rbtFullTimeEquivalentCount: 1,
      bcbaBillableHoursPerClientWeek: 3,
      collectedDirectRatePerHour: 70,
      collectedBcbaRatePerHour: 140,
      rbtHourlyWage: 28,
      retentionLogic:
        "One RBT can be attached to one high-hour client with a predictable paycheck and enough supervision value.",
    },
    {
      label: "Four launch clients",
      clients: 4,
      authorizedDirectHoursPerClientWeek: 40,
      minimumAcceptedDirectHoursPerClientWeek: 30,
      expectedDeliveredDirectHoursPerClientWeek: 30,
      rbtFullTimeEquivalentCount: 4,
      bcbaBillableHoursPerClientWeek: 3,
      collectedDirectRatePerHour: 70,
      collectedBcbaRatePerHour: 140,
      rbtHourlyWage: 28,
      retentionLogic:
        "Four full-time RBT assignments stabilize schedule, payroll, parent expectations, and clinical routines.",
    },
    {
      label: "Ten-client software-style panel",
      clients: 10,
      authorizedDirectHoursPerClientWeek: 40,
      minimumAcceptedDirectHoursPerClientWeek: 30,
      expectedDeliveredDirectHoursPerClientWeek: 30,
      rbtFullTimeEquivalentCount: 10,
      bcbaBillableHoursPerClientWeek: 3,
      collectedDirectRatePerHour: 70,
      collectedBcbaRatePerHour: 140,
      rbtHourlyWage: 28,
      retentionLogic:
        "Full-time RBT/client pairing maximizes retention; BCBA runs a 30-hour billable supervision/protocol week.",
    },
  ];

  return scenarios.map<HighHourRetentionScenario>((scenario) => {
    const rbtPaidHoursPerWeek = scenario.rbtFullTimeEquivalentCount * 40;
    const rbtBillableHoursPerWeek =
      scenario.clients * scenario.expectedDeliveredDirectHoursPerClientWeek;
    const bcbaPaidHoursPerWeek = ownerAvailableHoursPerWeek;
    const bcbaBillableHoursPerWeek =
      scenario.clients * scenario.bcbaBillableHoursPerClientWeek;
    const rbtRevenueMonthly =
      rbtBillableHoursPerWeek *
      weeksPerMonth *
      scenario.collectedDirectRatePerHour;
    const bcbaRevenueMonthly =
      bcbaBillableHoursPerWeek *
      weeksPerMonth *
      scenario.collectedBcbaRatePerHour;
    const rbtPayrollMonthly =
      rbtPaidHoursPerWeek *
      weeksPerMonth *
      scenario.rbtHourlyWage *
      baseFinanceAssumptions.loadedPayrollMultiplier;

    return {
      label: scenario.label,
      clients: scenario.clients,
      authorizedDirectHoursPerClientWeek:
        scenario.authorizedDirectHoursPerClientWeek,
      minimumAcceptedDirectHoursPerClientWeek:
        scenario.minimumAcceptedDirectHoursPerClientWeek,
      expectedDeliveredDirectHoursPerClientWeek:
        scenario.expectedDeliveredDirectHoursPerClientWeek,
      rbtFullTimeEquivalentCount: scenario.rbtFullTimeEquivalentCount,
      rbtPaidHoursPerWeek,
      rbtBillableHoursPerWeek,
      rbtUtilizationRate:
        rbtPaidHoursPerWeek > 0
          ? rbtBillableHoursPerWeek / rbtPaidHoursPerWeek
          : 0,
      bcbaPaidHoursPerWeek,
      bcbaBillableHoursPerWeek,
      bcbaUtilizationRate: bcbaBillableHoursPerWeek / bcbaPaidHoursPerWeek,
      rbtRevenueMonthly,
      bcbaRevenueMonthly,
      totalRevenueMonthly: rbtRevenueMonthly + bcbaRevenueMonthly,
      rbtPayrollMonthly,
      grossClinicalMarginMonthly:
        rbtRevenueMonthly + bcbaRevenueMonthly - rbtPayrollMonthly,
      retentionLogic: scenario.retentionLogic,
    };
  });
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}
