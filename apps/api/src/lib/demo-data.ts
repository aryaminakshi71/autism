/**
 * Demo Data Store
 *
 * In-memory data to support demo mode without a database.
 */

const dayMs = 24 * 60 * 60 * 1000;
const now = Date.now();

const isoDate = (offsetDays: number) =>
  new Date(now - offsetDays * dayMs).toISOString();

export type DemoPatient = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  gender: string | null;
  diagnosis: string | null;
  severityLevel: string | null;
  primaryLanguage: string;
  preferredCommunication: string;
  status: string;
  assignedTherapistId: string | null;
  organizationId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type DemoGoal = {
  id: string;
  patientId: string;
  name: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  targetBehavior: string | null;
  baselineValue: number;
  targetValue: number;
  currentValue: number;
  unit: string;
  masteryCriteria: number;
  status: string;
  priority: string;
  startDate: string | null;
  targetDate: string | null;
  domain: string | null;
  organizationId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type DemoSession = {
  id: string;
  patientId: string;
  therapistId: string;
  type: string;
  status: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart: string | null;
  actualEnd: string | null;
  durationMinutes: number | null;
  location: string | null;
  room: string | null;
  telehealth: boolean;
  mood: string | null;
  energyLevel: string | null;
  notes: string | null;
  organizationId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type DemoContact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  companyName: string | null;
  status: string;
  createdAt: string;
  organizationId: string;
  createdBy: string;
};

export type DemoLead = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  companyName: string | null;
  phone: string | null;
  source: string;
  status: string;
  notes: string | null;
  createdAt: string;
  organizationId: string;
  createdBy: string;
};

export type DemoDeal = {
  id: string;
  name: string;
  value: string;
  stage: string;
  notes: string | null;
  contactId: string | null;
  organizationId: string;
  createdBy: string;
  createdAt: string;
};

export type DemoActivity = {
  id: string;
  type: string;
  subject: string;
  description: string | null;
  contactId: string | null;
  dealId: string | null;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  organizationId: string;
  userId: string;
};

let demoContacts: DemoContact[] = [
  {
    id: "demo-contact-1",
    firstName: "Ava",
    lastName: "Morales",
    email: "ava.morales@sunriseaba.com",
    phone: "+1-415-555-0132",
    companyName: "Sunrise ABA Center",
    status: "customer",
    createdAt: isoDate(18),
    organizationId: "demo-org",
    createdBy: "demo-user-001",
  },
  {
    id: "demo-contact-2",
    firstName: "Noah",
    lastName: "Patel",
    email: "noah.patel@brightsteps.org",
    phone: "+1-510-555-0187",
    companyName: "BrightSteps Clinic",
    status: "active",
    createdAt: isoDate(12),
    organizationId: "demo-org",
    createdBy: "demo-user-001",
  },
  {
    id: "demo-contact-3",
    firstName: "Mia",
    lastName: "Rodriguez",
    email: "mia.rodriguez@oakvalley.org",
    phone: "+1-650-555-0119",
    companyName: "Oak Valley Pediatrics",
    status: "active",
    createdAt: isoDate(9),
    organizationId: "demo-org",
    createdBy: "demo-user-001",
  },
  {
    id: "demo-contact-4",
    firstName: "Ethan",
    lastName: "Kim",
    email: "ethan.kim@riverstone.org",
    phone: "+1-408-555-0174",
    companyName: "Riverstone Therapy",
    status: "prospect",
    createdAt: isoDate(6),
    organizationId: "demo-org",
    createdBy: "demo-user-001",
  },
  {
    id: "demo-contact-5",
    firstName: "Lily",
    lastName: "Johnson",
    email: "lily.johnson@northgate.edu",
    phone: "+1-415-555-0199",
    companyName: "Northgate School District",
    status: "active",
    createdAt: isoDate(3),
    organizationId: "demo-org",
    createdBy: "demo-user-001",
  },
];

let demoLeads: DemoLead[] = [
  {
    id: "demo-lead-1",
    email: "olivia.chen@creekside.edu",
    firstName: "Olivia",
    lastName: "Chen",
    companyName: "Creekside Elementary",
    phone: "+1-415-555-0101",
    source: "school",
    status: "new",
    notes: "Requested intake packet for 2nd grade student.",
    createdAt: isoDate(4),
    organizationId: "demo-org",
    createdBy: "demo-user-001",
  },
  {
    id: "demo-lead-2",
    email: "samuel.brooks@peds.org",
    firstName: "Samuel",
    lastName: "Brooks",
    companyName: "Bay Pediatrics",
    phone: "+1-510-555-0133",
    source: "pediatrician",
    status: "contacted",
    notes: "Follow-up scheduled for insurance verification.",
    createdAt: isoDate(6),
    organizationId: "demo-org",
    createdBy: "demo-user-001",
  },
  {
    id: "demo-lead-3",
    email: "isabella.nguyen@hopeclinic.org",
    firstName: "Isabella",
    lastName: "Nguyen",
    companyName: "Hope Path Clinic",
    phone: "+1-650-555-0168",
    source: "clinic",
    status: "qualified",
    notes: "Documentation complete, awaiting scheduling.",
    createdAt: isoDate(10),
    organizationId: "demo-org",
    createdBy: "demo-user-001",
  },
  {
    id: "demo-lead-4",
    email: "liam.wilson@community.org",
    firstName: "Liam",
    lastName: "Wilson",
    companyName: "Community Resource Center",
    phone: "+1-408-555-0122",
    source: "community",
    status: "converted",
    notes: "Converted to learner and assigned care team.",
    createdAt: isoDate(14),
    organizationId: "demo-org",
    createdBy: "demo-user-001",
  },
];

let demoDeals: DemoDeal[] = [
  {
    id: "demo-deal-1",
    name: "Initial ABA Assessment",
    value: "1200",
    stage: "lead",
    notes: "Pending insurance confirmation.",
    contactId: "demo-contact-4",
    organizationId: "demo-org",
    createdBy: "demo-user-001",
    createdAt: isoDate(8),
  },
  {
    id: "demo-deal-2",
    name: "Communication Skills Plan",
    value: "3200",
    stage: "qualified",
    notes: "Assessment complete, plan draft in progress.",
    contactId: "demo-contact-2",
    organizationId: "demo-org",
    createdBy: "demo-user-001",
    createdAt: isoDate(11),
  },
  {
    id: "demo-deal-3",
    name: "Social Skills Group",
    value: "2400",
    stage: "proposal",
    notes: "Waiting on family approval.",
    contactId: "demo-contact-3",
    organizationId: "demo-org",
    createdBy: "demo-user-001",
    createdAt: isoDate(13),
  },
  {
    id: "demo-deal-4",
    name: "Parent Training Series",
    value: "1800",
    stage: "negotiation",
    notes: "Caregiver availability being finalized.",
    contactId: "demo-contact-1",
    organizationId: "demo-org",
    createdBy: "demo-user-001",
    createdAt: isoDate(16),
  },
  {
    id: "demo-deal-5",
    name: "Behavior Support Plan",
    value: "4500",
    stage: "won",
    notes: "Care plan delivered and scheduled.",
    contactId: "demo-contact-5",
    organizationId: "demo-org",
    createdBy: "demo-user-001",
    createdAt: isoDate(20),
  },
  {
    id: "demo-deal-6",
    name: "Transition Readiness Plan",
    value: "900",
    stage: "lost",
    notes: "Family postponed for next semester.",
    contactId: "demo-contact-3",
    organizationId: "demo-org",
    createdBy: "demo-user-001",
    createdAt: isoDate(22),
  },
];

let demoActivities: DemoActivity[] = [
  {
    id: "demo-activity-1",
    type: "call",
    subject: "Weekly ABA session with Ava",
    description: "Reviewed communication goals and progress.",
    contactId: "demo-contact-1",
    dealId: "demo-deal-4",
    dueDate: null,
    completedAt: isoDate(1),
    createdAt: isoDate(2),
    organizationId: "demo-org",
    userId: "demo-user-001",
  },
  {
    id: "demo-activity-2",
    type: "meeting",
    subject: "IEP coordination meeting",
    description: "Aligned school and therapy objectives.",
    contactId: "demo-contact-5",
    dealId: null,
    dueDate: null,
    completedAt: isoDate(3),
    createdAt: isoDate(4),
    organizationId: "demo-org",
    userId: "demo-user-001",
  },
  {
    id: "demo-activity-3",
    type: "note",
    subject: "Progress note: communication goals",
    description: "Increased spontaneous requests during play.",
    contactId: "demo-contact-2",
    dealId: "demo-deal-2",
    dueDate: null,
    completedAt: isoDate(5),
    createdAt: isoDate(6),
    organizationId: "demo-org",
    userId: "demo-user-001",
  },
  {
    id: "demo-activity-4",
    type: "task",
    subject: "Schedule caregiver training",
    description: "Coordinate with family calendar for next week.",
    contactId: "demo-contact-3",
    dealId: "demo-deal-3",
    dueDate: new Date(now + 3 * dayMs).toISOString(),
    completedAt: null,
    createdAt: isoDate(1),
    organizationId: "demo-org",
    userId: "demo-user-001",
  },
  {
    id: "demo-activity-5",
    type: "demo",
    subject: "Initial assessment intake",
    description: "Collecting baseline data and family goals.",
    contactId: "demo-contact-4",
    dealId: "demo-deal-1",
    dueDate: new Date(now + 1 * dayMs).toISOString(),
    completedAt: null,
    createdAt: isoDate(0),
    organizationId: "demo-org",
    userId: "demo-user-001",
  },
];

function paginate<T>(items: T[], page: number, limit: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = items.slice(start, start + limit);
  return { data, total, page, limit, totalPages };
}

export function getDemoContacts(page: number, limit: number) {
  return paginate(demoContacts, page, limit);
}

export function getDemoContact(id: string) {
  const contact = demoContacts.find((item) => item.id === id);
  if (!contact) {
    throw new Error("Contact not found");
  }
  return contact;
}

export function createDemoContact(input: {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  companyName?: string;
  organizationId?: string;
  createdBy?: string;
}) {
  const newContact: DemoContact = {
    id: `demo-contact-${Date.now()}`,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email ?? null,
    phone: input.phone ?? null,
    companyName: input.companyName ?? null,
    status: "customer",
    createdAt: new Date().toISOString(),
    organizationId: input.organizationId ?? "demo-org",
    createdBy: input.createdBy ?? "demo-user-001",
  };
  demoContacts = [newContact, ...demoContacts];
  return newContact;
}

export function deleteDemoContact(id: string) {
  const index = demoContacts.findIndex((item) => item.id === id);
  if (index >= 0) {
    demoContacts.splice(index, 1);
  }
  return { success: true };
}

export function getDemoLeads(page: number, limit: number, status?: string) {
  const filtered = status
    ? demoLeads.filter((lead) => lead.status === status)
    : demoLeads;
  return paginate(filtered, page, limit);
}

export function createDemoLead(input: {
  email: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  phone?: string;
  source: string;
  notes?: string;
  organizationId?: string;
  createdBy?: string;
}) {
  const newLead: DemoLead = {
    id: `demo-lead-${Date.now()}`,
    email: input.email,
    firstName: input.firstName ?? null,
    lastName: input.lastName ?? null,
    companyName: input.companyName ?? null,
    phone: input.phone ?? null,
    source: input.source,
    status: "new",
    notes: input.notes ?? null,
    createdAt: new Date().toISOString(),
    organizationId: input.organizationId ?? "demo-org",
    createdBy: input.createdBy ?? "demo-user-001",
  };
  demoLeads = [newLead, ...demoLeads];
  return newLead;
}

export function convertDemoLead(input: {
  id: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
}) {
  const lead = demoLeads.find((item) => item.id === input.id);
  if (!lead) {
    throw new Error("Lead not found");
  }

  lead.status = "converted";
  if (input.firstName) {
    lead.firstName = input.firstName;
  }
  if (input.lastName) {
    lead.lastName = input.lastName;
  }
  if (input.companyName) {
    lead.companyName = input.companyName;
  }

  return createDemoContact({
    firstName: input.firstName || lead.firstName || "Unknown",
    lastName: input.lastName || lead.lastName || "",
    email: lead.email,
    phone: lead.phone ?? undefined,
    companyName: input.companyName || lead.companyName || undefined,
  });
}

export function getDemoDeals(page: number, limit: number, stage?: string) {
  const filtered = stage
    ? demoDeals.filter((deal) => deal.stage === stage)
    : demoDeals;
  return paginate(filtered, page, limit);
}

export function createDemoDeal(input: {
  name: string;
  value: number | string;
  stage: string;
  notes?: string;
  contactId?: string;
  organizationId?: string;
  createdBy?: string;
}) {
  const newDeal: DemoDeal = {
    id: `demo-deal-${Date.now()}`,
    name: input.name,
    value: String(input.value),
    stage: input.stage,
    notes: input.notes ?? null,
    contactId: input.contactId ?? null,
    organizationId: input.organizationId ?? "demo-org",
    createdBy: input.createdBy ?? "demo-user-001",
    createdAt: new Date().toISOString(),
  };
  demoDeals = [newDeal, ...demoDeals];
  return newDeal;
}

export function updateDemoDealStage(id: string, stage: string) {
  const deal = demoDeals.find((item) => item.id === id);
  if (!deal) {
    throw new Error("Deal not found");
  }
  deal.stage = stage;
  return deal;
}

export function getDemoActivities(
  page: number,
  limit: number,
  contactId?: string,
  dealId?: string,
) {
  let filtered = demoActivities;
  if (contactId) {
    filtered = filtered.filter((activity) => activity.contactId === contactId);
  }
  if (dealId) {
    filtered = filtered.filter((activity) => activity.dealId === dealId);
  }
  return paginate(filtered, page, limit);
}

export function createDemoActivity(input: {
  type: string;
  subject: string;
  description?: string;
  contactId?: string;
  dealId?: string;
  organizationId?: string;
  userId?: string;
}) {
  const newActivity: DemoActivity = {
    id: `demo-activity-${Date.now()}`,
    type: input.type,
    subject: input.subject,
    description: input.description ?? null,
    contactId: input.contactId ?? null,
    dealId: input.dealId ?? null,
    dueDate: null,
    completedAt: null,
    createdAt: new Date().toISOString(),
    organizationId: input.organizationId ?? "demo-org",
    userId: input.userId ?? "demo-user-001",
  };
  demoActivities = [newActivity, ...demoActivities];
  return newActivity;
}

function formatTimeAgo(date: Date | string): string {
  const nowDate = new Date();
  const then = new Date(date);
  const diffMs = nowDate.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  }
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return then.toLocaleDateString();
}

export function getDemoDashboardStats() {
  const totalContacts = demoContacts.length;
  const totalDeals = demoDeals.length;
  const activeDeals = demoDeals.filter(
    (deal) => deal.stage !== "won" && deal.stage !== "lost",
  ).length;
  const wonDeals = demoDeals.filter((deal) => deal.stage === "won").length;
  const conversionRate =
    totalDeals > 0 ? Math.round((wonDeals / totalDeals) * 100) : 0;

  const revenue = demoDeals
    .filter((deal) => deal.stage === "won")
    .reduce((sum, deal) => sum + (parseFloat(deal.value) || 0), 0);

  const pipeline = [
    { stage: "lead", value: 0, count: 0 },
    { stage: "qualified", value: 0, count: 0 },
    { stage: "proposal", value: 0, count: 0 },
    { stage: "negotiation", value: 0, count: 0 },
    { stage: "won", value: 0, count: 0 },
  ];

  demoDeals.forEach((deal) => {
    const stageIndex = pipeline.findIndex((item) => item.stage === deal.stage);
    if (stageIndex >= 0) {
      pipeline[stageIndex].count += 1;
      pipeline[stageIndex].value += parseFloat(deal.value) || 0;
    }
  });

  const recentActivities = [...demoActivities]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10)
    .map((activity) => ({
      id: activity.id,
      type: activity.type,
      message: `${activity.type}: ${activity.subject}`,
      time: formatTimeAgo(activity.createdAt),
    }));

  return {
    totalContacts,
    activeDeals,
    conversionRate,
    revenue: Math.round(revenue),
    contactsChange: 0,
    dealsChange: 0,
    conversionChange: 0,
    revenueChange: 0,
    pipeline,
    recentActivities,
  };
}

// Demo Patients Data
let demoPatients: DemoPatient[] = [
  {
    id: "demo-patient-1",
    firstName: "Emma",
    lastName: "Johnson",
    dateOfBirth: "2019-03-15T00:00:00.000Z",
    gender: "female",
    diagnosis: "ASD Level 1",
    severityLevel: "Level 1",
    primaryLanguage: "en",
    preferredCommunication: "verbal",
    status: "active",
    assignedTherapistId: "demo-therapist-1",
    organizationId: "demo-org",
    createdBy: "demo-user-001",
    createdAt: isoDate(60),
    updatedAt: isoDate(0),
  },
  {
    id: "demo-patient-2",
    firstName: "Liam",
    lastName: "Williams",
    dateOfBirth: "2020-07-22T00:00:00.000Z",
    gender: "male",
    diagnosis: "ASD Level 2",
    severityLevel: "Level 2",
    primaryLanguage: "en",
    preferredCommunication: "pecs",
    status: "active",
    assignedTherapistId: "demo-therapist-1",
    organizationId: "demo-org",
    createdBy: "demo-user-001",
    createdAt: isoDate(45),
    updatedAt: isoDate(0),
  },
  {
    id: "demo-patient-3",
    firstName: "Noah",
    lastName: "Martinez",
    dateOfBirth: "2018-11-08T00:00:00.000Z",
    gender: "male",
    diagnosis: "ASD Level 1",
    severityLevel: "Level 1",
    primaryLanguage: "es",
    preferredCommunication: "verbal",
    status: "active",
    assignedTherapistId: "demo-therapist-2",
    organizationId: "demo-org",
    createdBy: "demo-user-001",
    createdAt: isoDate(30),
    updatedAt: isoDate(0),
  },
  {
    id: "demo-patient-4",
    firstName: "Olivia",
    lastName: "Brown",
    dateOfBirth: "2019-05-30T00:00:00.000Z",
    gender: "female",
    diagnosis: "ASD Level 2",
    severityLevel: "Level 2",
    primaryLanguage: "en",
    preferredCommunication: "sign",
    status: "inactive",
    assignedTherapistId: "demo-therapist-2",
    organizationId: "demo-org",
    createdBy: "demo-user-001",
    createdAt: isoDate(90),
    updatedAt: isoDate(15),
  },
];

// Demo Goals Data
let demoGoals: DemoGoal[] = [
  {
    id: "demo-goal-1",
    patientId: "demo-patient-1",
    name: "Increase eye contact",
    description: "Increase sustained eye contact during verbal exchanges",
    category: "Social",
    subcategory: "Joint Attention",
    targetBehavior: "Maintain eye contact for 3+ seconds",
    baselineValue: 20,
    targetValue: 80,
    currentValue: 75,
    unit: "%",
    masteryCriteria: 80,
    status: "active",
    priority: "high",
    startDate: isoDate(30),
    targetDate: isoDate(60),
    domain: "Social Communication",
    organizationId: "demo-org",
    createdBy: "demo-user-001",
    createdAt: isoDate(30),
    updatedAt: isoDate(0),
  },
  {
    id: "demo-goal-2",
    patientId: "demo-patient-1",
    name: "Picture exchange communication",
    description: "Use PECS to request desired items",
    category: "Communication",
    subcategory: "PECS",
    targetBehavior: "Independently exchange picture card for desired item",
    baselineValue: 0,
    targetValue: 100,
    currentValue: 100,
    unit: "%",
    masteryCriteria: 90,
    status: "mastered",
    priority: "high",
    startDate: isoDate(60),
    targetDate: isoDate(90),
    domain: "Communication",
    organizationId: "demo-org",
    createdBy: "demo-user-001",
    createdAt: isoDate(60),
    updatedAt: isoDate(5),
  },
  {
    id: "demo-goal-3",
    patientId: "demo-patient-2",
    name: "Turn-taking in games",
    description: "Take turns during simple board games",
    category: "Social",
    subcategory: "Play Skills",
    targetBehavior: "Complete 5 turns in sequence",
    baselineValue: 1,
    targetValue: 5,
    currentValue: 3,
    unit: "turns",
    masteryCriteria: 5,
    status: "active",
    priority: "medium",
    startDate: isoDate(20),
    targetDate: isoDate(50),
    domain: "Social Play",
    organizationId: "demo-org",
    createdBy: "demo-user-001",
    createdAt: isoDate(20),
    updatedAt: isoDate(0),
  },
  {
    id: "demo-goal-4",
    patientId: "demo-patient-3",
    name: "Verbal requests",
    description: "Make vocal requests for desired items",
    category: "Communication",
    subcategory: "Expressive Language",
    targetBehavior: "Vocalize request without prompting",
    baselineValue: 10,
    targetValue: 80,
    currentValue: 45,
    unit: "%",
    masteryCriteria: 80,
    status: "active",
    priority: "high",
    startDate: isoDate(25),
    targetDate: isoDate(55),
    domain: "Expressive Communication",
    organizationId: "demo-org",
    createdBy: "demo-user-001",
    createdAt: isoDate(25),
    updatedAt: isoDate(0),
  },
];

// Demo Sessions Data
let demoSessions: DemoSession[] = [
  {
    id: "demo-session-1",
    patientId: "demo-patient-1",
    therapistId: "demo-therapist-1",
    type: "ABA Therapy",
    status: "completed",
    scheduledStart: isoDate(1) + "T10:00:00.000Z",
    scheduledEnd: isoDate(1) + "T11:00:00.000Z",
    actualStart: isoDate(1) + "T10:05:00.000Z",
    actualEnd: isoDate(1) + "T11:00:00.000Z",
    durationMinutes: 55,
    location: "Room 1",
    room: "1",
    telehealth: false,
    mood: "great",
    energyLevel: "high",
    notes: "Great progress on eye contact goal",
    organizationId: "demo-org",
    createdBy: "demo-user-001",
    createdAt: isoDate(1),
    updatedAt: isoDate(1),
  },
  {
    id: "demo-session-2",
    patientId: "demo-patient-2",
    therapistId: "demo-therapist-1",
    type: "Speech Therapy",
    status: "scheduled",
    scheduledStart: isoDate(0) + "T11:30:00.000Z",
    scheduledEnd: isoDate(0) + "T12:00:00.000Z",
    actualStart: null,
    actualEnd: null,
    durationMinutes: 30,
    location: "Room 2",
    room: "2",
    telehealth: false,
    mood: null,
    energyLevel: null,
    notes: null,
    organizationId: "demo-org",
    createdBy: "demo-user-001",
    createdAt: isoDate(3),
    updatedAt: isoDate(3),
  },
  {
    id: "demo-session-3",
    patientId: "demo-patient-3",
    therapistId: "demo-therapist-2",
    type: "OT Session",
    status: "scheduled",
    scheduledStart: isoDate(0) + "T14:00:00.000Z",
    scheduledEnd: isoDate(0) + "T14:30:00.000Z",
    actualStart: null,
    actualEnd: null,
    durationMinutes: 30,
    location: "OT Room",
    room: "3",
    telehealth: false,
    mood: null,
    energyLevel: null,
    notes: null,
    organizationId: "demo-org",
    createdBy: "demo-user-001",
    createdAt: isoDate(2),
    updatedAt: isoDate(2),
  },
];

// Patient functions
export function getDemoPatients(
  page: number,
  limit: number,
  search?: string,
  status?: string,
) {
  let filtered = demoPatients;
  if (status) {
    filtered = filtered.filter((p) => p.status === status);
  }
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.firstName.toLowerCase().includes(searchLower) ||
        p.lastName.toLowerCase().includes(searchLower),
    );
  }
  return paginate(filtered, page, limit);
}

export function getDemoPatient(id: string) {
  const patient = demoPatients.find((p) => p.id === id);
  if (!patient) {
    throw new Error("Patient not found");
  }
  return patient;
}

export function getDemoPatientStats() {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    total: demoPatients.length,
    active: demoPatients.filter((p) => p.status === "active").length,
    inactive: demoPatients.filter((p) => p.status === "inactive").length,
    newThisMonth: demoPatients.filter(
      (p) => p.createdAt && new Date(p.createdAt) >= firstOfMonth,
    ).length,
  };
}

export function createDemoPatient(input: {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  diagnosis?: string;
  severityLevel?: string;
  primaryLanguage?: string;
  preferredCommunication?: string;
  status?: string;
  organizationId?: string;
  createdBy?: string;
}) {
  const newPatient: DemoPatient = {
    id: `demo-patient-${Date.now()}`,
    firstName: input.firstName,
    lastName: input.lastName,
    dateOfBirth: input.dateOfBirth || null,
    gender: input.gender || null,
    diagnosis: input.diagnosis || null,
    severityLevel: input.severityLevel || null,
    primaryLanguage: input.primaryLanguage || "en",
    preferredCommunication: input.preferredCommunication || "verbal",
    status: input.status || "active",
    assignedTherapistId: null,
    organizationId: input.organizationId || "demo-org",
    createdBy: input.createdBy || "demo-user-001",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  demoPatients = [newPatient, ...demoPatients];
  return newPatient;
}

export function deleteDemoPatient(id: string) {
  const index = demoPatients.findIndex((p) => p.id === id);
  if (index >= 0) {
    demoPatients.splice(index, 1);
  }
  return { success: true };
}

// Goal functions
export function getDemoGoals(
  page: number,
  limit: number,
  patientId?: string,
  status?: string,
) {
  let filtered = demoGoals;
  if (patientId) {
    filtered = filtered.filter((g) => g.patientId === patientId);
  }
  if (status) {
    filtered = filtered.filter((g) => g.status === status);
  }
  return paginate(filtered, page, limit);
}

export function getDemoGoal(id: string) {
  const goal = demoGoals.find((g) => g.id === id);
  if (!goal) {
    throw new Error("Goal not found");
  }
  return goal;
}

export function createDemoGoal(input: {
  patientId: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  targetBehavior?: string;
  baselineValue: number;
  targetValue: number;
  unit?: string;
  masteryCriteria?: number;
  priority?: string;
  startDate?: string;
  targetDate?: string;
  domain?: string;
  organizationId?: string;
  createdBy?: string;
}) {
  const newGoal: DemoGoal = {
    id: `demo-goal-${Date.now()}`,
    patientId: input.patientId,
    name: input.name,
    description: input.description || null,
    category: input.category,
    subcategory: input.subcategory || null,
    targetBehavior: input.targetBehavior || null,
    baselineValue: input.baselineValue,
    targetValue: input.targetValue,
    currentValue: input.baselineValue,
    unit: input.unit || "%",
    masteryCriteria: input.masteryCriteria || 80,
    status: "active",
    priority: input.priority || "medium",
    startDate: input.startDate || new Date().toISOString(),
    targetDate: input.targetDate || null,
    domain: input.domain || null,
    organizationId: input.organizationId || "demo-org",
    createdBy: input.createdBy || "demo-user-001",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  demoGoals = [newGoal, ...demoGoals];
  return newGoal;
}

export function updateDemoGoal(id: string, updates: Partial<DemoGoal>) {
  const goal = demoGoals.find((g) => g.id === id);
  if (!goal) {
    throw new Error("Goal not found");
  }
  Object.assign(goal, updates, { updatedAt: new Date().toISOString() });
  return goal;
}

export function deleteDemoGoal(id: string) {
  const index = demoGoals.findIndex((g) => g.id === id);
  if (index >= 0) {
    demoGoals.splice(index, 1);
  }
  return { success: true };
}

// Session functions
export function getDemoSessions(
  page: number,
  limit: number,
  patientId?: string,
  status?: string,
) {
  let filtered = demoSessions;
  if (patientId) {
    filtered = filtered.filter((s) => s.patientId === patientId);
  }
  if (status) {
    filtered = filtered.filter((s) => s.status === status);
  }
  return paginate(filtered, page, limit);
}

export function getDemoSession(id: string) {
  const session = demoSessions.find((s) => s.id === id);
  if (!session) {
    throw new Error("Session not found");
  }
  return session;
}

export function createDemoSession(input: {
  patientId: string;
  therapistId: string;
  type: string;
  scheduledStart: string;
  scheduledEnd: string;
  location?: string;
  room?: string;
  telehealth?: boolean;
  organizationId?: string;
  createdBy?: string;
}) {
  const newSession: DemoSession = {
    id: `demo-session-${Date.now()}`,
    patientId: input.patientId,
    therapistId: input.therapistId,
    type: input.type,
    status: "scheduled",
    scheduledStart: input.scheduledStart,
    scheduledEnd: input.scheduledEnd,
    actualStart: null,
    actualEnd: null,
    durationMinutes: null,
    location: input.location || null,
    room: input.room || null,
    telehealth: input.telehealth || false,
    mood: null,
    energyLevel: null,
    notes: null,
    organizationId: input.organizationId || "demo-org",
    createdBy: input.createdBy || "demo-user-001",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  demoSessions = [newSession, ...demoSessions];
  return newSession;
}

export function updateDemoSession(id: string, updates: Partial<DemoSession>) {
  const session = demoSessions.find((s) => s.id === id);
  if (!session) {
    throw new Error("Session not found");
  }
  Object.assign(session, updates, { updatedAt: new Date().toISOString() });
  return session;
}

export function deleteDemoSession(id: string) {
  const index = demoSessions.findIndex((s) => s.id === id);
  if (index >= 0) {
    demoSessions.splice(index, 1);
  }
  return { success: true };
}
