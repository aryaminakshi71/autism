export type PayrollState = "WA" | "ND" | "CT" | "MO";
export type PayrollRole = "rbt" | "bcba";
export type PayCycle = "weekly" | "biweekly" | "monthly" | "unknown";
export type TreasuryRecommendation = "single_operating_with_state_ledgers" | "separate_state_account_optional";
export type PayrollExportFormat = "gusto" | "adp" | "quickbooks" | "internal_ledger";

export interface PayrollTimeEntry {
  id: string;
  staff: string;
  role: PayrollRole;
  state: PayrollState;
  center: string;
  client: string;
  serviceDate: string;
  clockIn: string;
  clockOut: string;
  paidHours: number;
  billableHours: number;
  serviceType: "rbt_direct_treatment" | "bcba_supervision" | "bcba_protocol" | "admin";
  noteSigned: boolean;
  claimReady: boolean;
}

export interface StaffPayRate {
  staff: string;
  role: PayrollRole;
  state: PayrollState;
  regularRatePerHour: number;
  loadedMultiplier: number;
  payCycle: "biweekly";
}

export interface BiweeklyPayrollSummary {
  staff: string;
  role: PayrollRole;
  state: PayrollState;
  paidHours: number;
  billableHours: number;
  nonBillableHours: number;
  grossPay: number;
  loadedCost: number;
  claimReadyHours: number;
  documentationHoldHours: number;
  utilizationRate: number;
  status: "ready" | "watch" | "blocked";
}

export interface PayerPaymentCycle {
  state: PayrollState;
  payer: string;
  expectedPaymentCycle: PayCycle;
  averageDaysToPay: number;
  eftAccountStrategy: TreasuryRecommendation;
  notes: string;
}

export interface StateCashFlowSummary {
  state: PayrollState;
  payrollLoadedCost: number;
  claimReadyRevenue: number;
  documentationHoldRevenue: number;
  expectedPaymentCycle: string;
  treasuryRecommendation: TreasuryRecommendation;
  cashRisk: "low" | "medium" | "high";
}

export interface PayrollExportFile {
  format: PayrollExportFormat;
  filename: string;
  mimeType: "text/csv";
  rowCount: number;
  content: string;
}

export interface InternalPayrollLedgerRow {
  entryId: string;
  ledgerClass: string;
  payrollAccount: string;
  revenueAccount: string;
  staff: string;
  role: PayrollRole;
  state: PayrollState;
  center: string;
  client: string;
  serviceDate: string;
  serviceType: PayrollTimeEntry["serviceType"];
  paidHours: number;
  billableHours: number;
  regularRatePerHour: number;
  grossPay: number;
  loadedCost: number;
  claimReady: boolean;
  noteSigned: boolean;
  revenueHoldStatus: "release_to_claims" | "documentation_hold" | "non_billable";
}

export const payrollTimeEntries: PayrollTimeEntry[] = [
  {
    id: "time-wa-rbt-1",
    staff: "RBT WA-1",
    role: "rbt",
    state: "WA",
    center: "WA Center",
    client: "Client WA-01",
    serviceDate: "2026-07-03",
    clockIn: "09:00",
    clockOut: "15:00",
    paidHours: 6,
    billableHours: 6,
    serviceType: "rbt_direct_treatment",
    noteSigned: true,
    claimReady: true,
  },
  {
    id: "time-wa-bcba-1",
    staff: "Owner BCBA",
    role: "bcba",
    state: "WA",
    center: "WA Center",
    client: "Client WA-01",
    serviceDate: "2026-07-03",
    clockIn: "15:00",
    clockOut: "16:00",
    paidHours: 1,
    billableHours: 1,
    serviceType: "bcba_supervision",
    noteSigned: true,
    claimReady: true,
  },
  {
    id: "time-nd-rbt-1",
    staff: "RBT ND-1",
    role: "rbt",
    state: "ND",
    center: "ND Center",
    client: "Client ND-01",
    serviceDate: "2026-07-03",
    clockIn: "09:30",
    clockOut: "15:30",
    paidHours: 6,
    billableHours: 6,
    serviceType: "rbt_direct_treatment",
    noteSigned: true,
    claimReady: false,
  },
  {
    id: "time-ct-rbt-1",
    staff: "RBT CT-1",
    role: "rbt",
    state: "CT",
    center: "CT Center",
    client: "Client CT-01",
    serviceDate: "2026-07-03",
    clockIn: "10:00",
    clockOut: "14:00",
    paidHours: 4,
    billableHours: 4,
    serviceType: "rbt_direct_treatment",
    noteSigned: false,
    claimReady: false,
  },
  {
    id: "time-mo-bcba-1",
    staff: "Owner BCBA",
    role: "bcba",
    state: "MO",
    center: "MO Center",
    client: "Client MO-01",
    serviceDate: "2026-07-03",
    clockIn: "12:00",
    clockOut: "13:00",
    paidHours: 1,
    billableHours: 1,
    serviceType: "bcba_supervision",
    noteSigned: true,
    claimReady: false,
  },
];

export const staffPayRates: StaffPayRate[] = [
  {
    staff: "RBT WA-1",
    role: "rbt",
    state: "WA",
    regularRatePerHour: 28,
    loadedMultiplier: 1.18,
    payCycle: "biweekly",
  },
  {
    staff: "RBT ND-1",
    role: "rbt",
    state: "ND",
    regularRatePerHour: 27,
    loadedMultiplier: 1.18,
    payCycle: "biweekly",
  },
  {
    staff: "RBT CT-1",
    role: "rbt",
    state: "CT",
    regularRatePerHour: 30,
    loadedMultiplier: 1.18,
    payCycle: "biweekly",
  },
  {
    staff: "RBT MO-1",
    role: "rbt",
    state: "MO",
    regularRatePerHour: 27,
    loadedMultiplier: 1.18,
    payCycle: "biweekly",
  },
  {
    staff: "Owner BCBA",
    role: "bcba",
    state: "WA",
    regularRatePerHour: 65,
    loadedMultiplier: 1,
    payCycle: "biweekly",
  },
  {
    staff: "Owner BCBA",
    role: "bcba",
    state: "MO",
    regularRatePerHour: 65,
    loadedMultiplier: 1,
    payCycle: "biweekly",
  },
];

export const payerPaymentCycles: PayerPaymentCycle[] = [
  {
    state: "WA",
    payer: "Washington Apple Health / ProviderOne",
    expectedPaymentCycle: "weekly",
    averageDaysToPay: 14,
    eftAccountStrategy: "single_operating_with_state_ledgers",
    notes: "Use EFT into operating account; track WA receipts in the state ledger.",
  },
  {
    state: "ND",
    payer: "North Dakota Medicaid",
    expectedPaymentCycle: "unknown",
    averageDaysToPay: 21,
    eftAccountStrategy: "single_operating_with_state_ledgers",
    notes: "Confirm remittance cycle after enrollment and first paid claim.",
  },
  {
    state: "CT",
    payer: "Connecticut Medical Assistance Program / HUSKY",
    expectedPaymentCycle: "weekly",
    averageDaysToPay: 14,
    eftAccountStrategy: "single_operating_with_state_ledgers",
    notes: "Keep CT receipts separate in accounting classes even if EFT uses one bank account.",
  },
  {
    state: "MO",
    payer: "MO HealthNet",
    expectedPaymentCycle: "biweekly",
    averageDaysToPay: 21,
    eftAccountStrategy: "single_operating_with_state_ledgers",
    notes: "Use payer ERA/EFT posting to match MO payroll and claim cash flow.",
  },
];

function findPayRate(entry: PayrollTimeEntry) {
  return (
    staffPayRates.find(
      (rate) =>
        rate.staff === entry.staff &&
        rate.state === entry.state &&
        rate.role === entry.role,
    ) ??
    staffPayRates.find((rate) => rate.staff === entry.staff && rate.role === entry.role)
  );
}

function escapeCsvValue(value: unknown) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll("\"", "\"\"")}"`;
  }
  return text;
}

function toCsv(headers: string[], rows: Array<Array<unknown>>) {
  return [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) => row.map(escapeCsvValue).join(",")),
  ].join("\n");
}

function formatMoney(value: number) {
  return value.toFixed(2);
}

function getLedgerClass(entry: PayrollTimeEntry) {
  return `${entry.state}:${entry.center}:${entry.client}:${entry.role}:${entry.serviceType}`;
}

function getEarningsCode(entry: PayrollTimeEntry) {
  if (entry.serviceType === "rbt_direct_treatment") return "RBT-DIRECT";
  if (entry.serviceType === "bcba_supervision") return "BCBA-SUP";
  if (entry.serviceType === "bcba_protocol") return "BCBA-PROTOCOL";
  return "ADMIN";
}

function getPayrollItem(entry: PayrollTimeEntry) {
  if (entry.role === "bcba") return "BCBA Regular Pay";
  return "RBT Regular Pay";
}

function getRevenueHoldStatus(
  entry: PayrollTimeEntry,
): InternalPayrollLedgerRow["revenueHoldStatus"] {
  if (entry.billableHours <= 0) return "non_billable";
  if (entry.claimReady) return "release_to_claims";
  return "documentation_hold";
}

export function buildInternalPayrollLedger(): InternalPayrollLedgerRow[] {
  return payrollTimeEntries.map((entry) => {
    const rate = findPayRate(entry);
    const regularRatePerHour = rate?.regularRatePerHour ?? 0;
    const grossPay = entry.paidHours * regularRatePerHour;
    const loadedCost = grossPay * (rate?.loadedMultiplier ?? 1);

    return {
      entryId: entry.id,
      ledgerClass: getLedgerClass(entry),
      payrollAccount:
        entry.role === "bcba"
          ? "Payroll Expense:BCBA"
          : "Payroll Expense:RBT",
      revenueAccount:
        entry.serviceType === "rbt_direct_treatment"
          ? "Revenue:RBT Direct Treatment"
          : "Revenue:BCBA Services",
      staff: entry.staff,
      role: entry.role,
      state: entry.state,
      center: entry.center,
      client: entry.client,
      serviceDate: entry.serviceDate,
      serviceType: entry.serviceType,
      paidHours: entry.paidHours,
      billableHours: entry.billableHours,
      regularRatePerHour,
      grossPay,
      loadedCost,
      claimReady: entry.claimReady,
      noteSigned: entry.noteSigned,
      revenueHoldStatus: getRevenueHoldStatus(entry),
    };
  });
}

export function buildPayrollExportFile(
  format: PayrollExportFormat,
  payPeriodStart = "2026-06-22",
  payPeriodEnd = "2026-07-05",
): PayrollExportFile {
  const safePeriod = `${payPeriodStart}_to_${payPeriodEnd}`;

  if (format === "gusto") {
    const headers = [
      "Employee",
      "Work Date",
      "Regular Hours",
      "Earnings Code",
      "Hourly Rate",
      "Department",
      "Work Location",
      "Job",
      "Memo",
    ];
    const rows = payrollTimeEntries.map((entry) => {
      const rate = findPayRate(entry);
      return [
        entry.staff,
        entry.serviceDate,
        entry.paidHours,
        getEarningsCode(entry),
        formatMoney(rate?.regularRatePerHour ?? 0),
        `${entry.state} ABA`,
        entry.center,
        entry.client,
        `${entry.serviceType}; billable=${entry.billableHours}; claim_ready=${entry.claimReady}`,
      ];
    });

    return {
      format,
      filename: `gusto_payroll_${safePeriod}.csv`,
      mimeType: "text/csv",
      rowCount: rows.length,
      content: toCsv(headers, rows),
    };
  }

  if (format === "adp") {
    const headers = [
      "Company Code",
      "Batch ID",
      "File Number",
      "Employee Name",
      "Pay Period Start",
      "Pay Period End",
      "Work Date",
      "Hours",
      "Rate",
      "Earnings Code",
      "Department",
      "State",
      "Memo",
    ];
    const rows = payrollTimeEntries.map((entry, index) => {
      const rate = findPayRate(entry);
      return [
        "ABA01",
        `ABA-${safePeriod}`,
        String(index + 1).padStart(4, "0"),
        entry.staff,
        payPeriodStart,
        payPeriodEnd,
        entry.serviceDate,
        entry.paidHours,
        formatMoney(rate?.regularRatePerHour ?? 0),
        getEarningsCode(entry),
        `${entry.state}-${entry.center}`,
        entry.state,
        `${entry.client}; ${entry.serviceType}; claim_ready=${entry.claimReady}`,
      ];
    });

    return {
      format,
      filename: `adp_payroll_${safePeriod}.csv`,
      mimeType: "text/csv",
      rowCount: rows.length,
      content: toCsv(headers, rows),
    };
  }

  if (format === "quickbooks") {
    const headers = [
      "Employee",
      "Start Date",
      "Start Time",
      "End Date",
      "End Time",
      "Customer",
      "Service Item",
      "Payroll Item",
      "Billable",
      "Class",
      "Notes",
      "Hours",
    ];
    const rows = payrollTimeEntries.map((entry) => [
      entry.staff,
      entry.serviceDate,
      entry.clockIn,
      entry.serviceDate,
      entry.clockOut,
      entry.client,
      entry.serviceType,
      getPayrollItem(entry),
      entry.billableHours > 0 ? "Y" : "N",
      getLedgerClass(entry),
      `state=${entry.state}; center=${entry.center}; note_signed=${entry.noteSigned}; claim_ready=${entry.claimReady}`,
      entry.paidHours,
    ]);

    return {
      format,
      filename: `quickbooks_time_${safePeriod}.csv`,
      mimeType: "text/csv",
      rowCount: rows.length,
      content: toCsv(headers, rows),
    };
  }

  const headers = [
    "Entry ID",
    "Ledger Class",
    "Payroll Account",
    "Revenue Account",
    "Staff",
    "Role",
    "State",
    "Center",
    "Client",
    "Service Date",
    "Service Type",
    "Paid Hours",
    "Billable Hours",
    "Hourly Rate",
    "Gross Pay",
    "Loaded Cost",
    "Claim Ready",
    "Note Signed",
    "Revenue Hold Status",
  ];
  const rows = buildInternalPayrollLedger().map((row) => [
    row.entryId,
    row.ledgerClass,
    row.payrollAccount,
    row.revenueAccount,
    row.staff,
    row.role,
    row.state,
    row.center,
    row.client,
    row.serviceDate,
    row.serviceType,
    row.paidHours,
    row.billableHours,
    formatMoney(row.regularRatePerHour),
    formatMoney(row.grossPay),
    formatMoney(row.loadedCost),
    row.claimReady ? "Y" : "N",
    row.noteSigned ? "Y" : "N",
    row.revenueHoldStatus,
  ]);

  return {
    format,
    filename: `internal_state_ledger_${safePeriod}.csv`,
    mimeType: "text/csv",
    rowCount: rows.length,
    content: toCsv(headers, rows),
  };
}

export function buildBiweeklyPayrollSummaries(): BiweeklyPayrollSummary[] {
  const grouped = new Map<string, PayrollTimeEntry[]>();

  for (const entry of payrollTimeEntries) {
    const key = `${entry.staff}-${entry.role}-${entry.state}`;
    grouped.set(key, [...(grouped.get(key) ?? []), entry]);
  }

  return [...grouped.entries()].map(([, entries]) => {
    const first = entries[0];
    const rate = findPayRate(first);
    const paidHours = entries.reduce((total, entry) => total + entry.paidHours, 0);
    const billableHours = entries.reduce(
      (total, entry) => total + entry.billableHours,
      0,
    );
    const claimReadyHours = entries
      .filter((entry) => entry.claimReady)
      .reduce((total, entry) => total + entry.billableHours, 0);
    const documentationHoldHours = billableHours - claimReadyHours;
    const regularRate = rate?.regularRatePerHour ?? 0;
    const grossPay = paidHours * regularRate;
    const loadedCost = grossPay * (rate?.loadedMultiplier ?? 1);
    const utilizationRate = paidHours > 0 ? billableHours / paidHours : 0;
    const status =
      documentationHoldHours > 0
        ? "blocked"
        : utilizationRate < 0.75
          ? "watch"
          : "ready";

    return {
      staff: first.staff,
      role: first.role,
      state: first.state,
      paidHours,
      billableHours,
      nonBillableHours: paidHours - billableHours,
      grossPay,
      loadedCost,
      claimReadyHours,
      documentationHoldHours,
      utilizationRate,
      status,
    };
  });
}

export function buildStateCashFlowSummaries(): StateCashFlowSummary[] {
  const payroll = buildBiweeklyPayrollSummaries();

  return payerPaymentCycles.map((payer) => {
    const statePayrollCost = payroll
      .filter((item) => item.state === payer.state)
      .reduce((total, item) => total + item.loadedCost, 0);
    const stateEntries = payrollTimeEntries.filter((entry) => entry.state === payer.state);
    const claimReadyHours = stateEntries
      .filter((entry) => entry.claimReady)
      .reduce((total, entry) => total + entry.billableHours, 0);
    const holdHours = stateEntries
      .filter((entry) => !entry.claimReady)
      .reduce((total, entry) => total + entry.billableHours, 0);
    const blendedRevenueRate = payer.state === "CT" ? 72 : payer.state === "MO" ? 132 : 70;
    const claimReadyRevenue = claimReadyHours * blendedRevenueRate;
    const documentationHoldRevenue = holdHours * blendedRevenueRate;
    const cashRisk =
      documentationHoldRevenue > statePayrollCost
        ? "high"
        : documentationHoldRevenue > 0
          ? "medium"
          : "low";

    return {
      state: payer.state,
      payrollLoadedCost: statePayrollCost,
      claimReadyRevenue,
      documentationHoldRevenue,
      expectedPaymentCycle: `${payer.expectedPaymentCycle}, about ${payer.averageDaysToPay} days`,
      treasuryRecommendation: payer.eftAccountStrategy,
      cashRisk,
    };
  });
}
