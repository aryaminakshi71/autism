/**
 * Unified Data Models for Autism Platform
 * All entities for 27 major features
 */

// ============================================================================
// 1. GOAL TRACKING SYSTEM
// ============================================================================

export interface Goal {
  id: string;
  title: string;
  description?: string;
  patientId: string;
  category: GoalCategory;
  status: GoalStatus;
  priority: GoalPriority;
  progress: number;
  targetDate?: string;
  startDate: string;
  completedDate?: string;
  milestones: Milestone[];
  attachments: Attachment[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isTemplate: boolean;
}

export type GoalCategory =
  | "communication"
  | "social"
  | "behavioral"
  | "academic"
  | "life_skills"
  | "motor"
  | "sensory"
  | "play"
  | "other";

export type GoalStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "mastered"
  | "discontinued"
  | "on_hold";

export type GoalPriority = "low" | "medium" | "high" | "urgent";

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  targetDate?: string;
  completedDate?: string;
  isCompleted: boolean;
  order: number;
}

// ============================================================================
// 2. SESSION MANAGEMENT
// ============================================================================

export interface Session {
  id: string;
  patientId: string;
  therapistId: string;
  scheduledDate: string;
  startTime?: string;
  endTime?: string;
  duration?: number; // in minutes
  status: SessionStatus;
  type: SessionType;
  notes?: SessionNotes;
  activities: SessionActivity[];
  goalsAddressed: string[]; // goal IDs
  attendance: AttendanceRecord;
  location: SessionLocation;
  billingCode?: string;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export type SessionStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show"
  | "rescheduled";

export type SessionType =
  | "individual"
  | "group"
  | "family"
  | "assessment"
  | "consultation"
  | "telehealth";

export interface SessionNotes {
  subjective?: string; // SOAP - Subjective
  objective?: string; // SOAP - Objective
  assessment?: string; // SOAP - Assessment
  plan?: string; // SOAP - Plan
  private?: string; // Internal only
  parentFeedback?: string;
}

export interface SessionActivity {
  id: string;
  name: string;
  description?: string;
  duration?: number;
  materials?: string[];
  outcome?: string;
  engagementLevel?: 1 | 2 | 3 | 4 | 5;
}

export interface AttendanceRecord {
  patientAttended: boolean;
  caregiverPresent?: boolean;
  arrivalTime?: string;
  departureTime?: string;
}

export interface SessionLocation {
  type: "clinic" | "home" | "school" | "telehealth";
  address?: string;
  room?: string;
  meetingLink?: string;
}

// ============================================================================
// 3. VISUAL SCHEDULE BUILDER
// ============================================================================

export interface VisualSchedule {
  id: string;
  patientId: string;
  name: string;
  description?: string;
  type: ScheduleType;
  activities: ScheduledActivity[];
  settings: ScheduleSettings;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ScheduleType =
  | "daily"
  | "weekly"
  | "first_then"
  | "transition"
  | "reward";

export interface ScheduledActivity {
  id: string;
  name: string;
  icon?: string;
  imageUrl?: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  isRequired: boolean;
  transitionWarning: boolean;
  reward?: string;
  order: number;
}

export interface ScheduleSettings {
  showTimes: boolean;
  showDuration: boolean;
  enableTimer: boolean;
  transitionWarningMinutes: number[];
  audioCues: boolean;
  visualCues: boolean;
  celebrationAnimation: boolean;
}

// ============================================================================
// 4. COMMUNICATION BOARDS (AAC)
// ============================================================================

export interface CommunicationBoard {
  id: string;
  patientId: string;
  name: string;
  layout: BoardLayout;
  categories: BoardCategory[];
  settings: BoardSettings;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BoardLayout = "grid" | "list" | "carousel" | "hierarchical";

export interface BoardCategory {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  items: CommunicationItem[];
  order: number;
}

export interface CommunicationItem {
  id: string;
  label: string;
  imageUrl?: string;
  icon?: string;
  audioUrl?: string;
  category: string;
  isFrequent: boolean;
  order: number;
}

export interface BoardSettings {
  voiceType: string;
  speechRate: number;
  showLabels: boolean;
  imageSize: "small" | "medium" | "large";
  enableSound: boolean;
  progressDisplay: boolean;
}

// ============================================================================
// 5. ASSESSMENT & EVALUATION
// ============================================================================

export interface Assessment {
  id: string;
  patientId: string;
  type: AssessmentType;
  title: string;
  status: AssessmentStatus;
  administeredBy: string;
  dateAdministered?: string;
  dateCompleted?: string;
  results: AssessmentResult[];
  domains: AssessmentDomain[];
  scores: AssessmentScore[];
  notes?: string;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export type AssessmentType =
  | "ados2"
  | "cars2"
  | "vbmapp"
  | "abllsr"
  | "vineland3"
  | "ssis"
  | "custom";

export type AssessmentStatus =
  | "draft"
  | "in_progress"
  | "completed"
  | "scored"
  | "archived";

export interface AssessmentDomain {
  id: string;
  name: string;
  description?: string;
  order: number;
  items: AssessmentItem[];
}

export interface AssessmentItem {
  id: string;
  question: string;
  type: "rating" | "boolean" | "text" | "choice" | "checklist";
  options?: string[];
  required: boolean;
  order: number;
}

export interface AssessmentResult {
  itemId: string;
  value: string | number | boolean | string[];
  notes?: string;
}

export interface AssessmentScore {
  domainId: string;
  rawScore: number;
  standardScore?: number;
  percentile?: number;
  ageEquivalent?: string;
  interpretation?: string;
}

// ============================================================================
// 6. BEHAVIOR TRACKING
// ============================================================================

export interface BehaviorRecord {
  id: string;
  patientId: string;
  type: "antecedent" | "behavior" | "consequence";
  category: string;
  description: string;
  severity?: 1 | 2 | 3 | 4 | 5;
  duration?: number; // in seconds
  frequency?: number;
  intensity?: "low" | "medium" | "high";
  location?: string;
  timeOfDay?: string;
  triggeredBy?: string[];
  interventions?: string[];
  outcome?: string;
  recordedBy: string;
  recordedAt: string;
  sessionId?: string;
  attachments: Attachment[];
}

export interface BehaviorSummary {
  patientId: string;
  period: "day" | "week" | "month";
  startDate: string;
  endDate: string;
  totalIncidents: number;
  averageFrequency: number;
  averageDuration: number;
  patterns: BehaviorPattern[];
  triggers: string[];
  successfulInterventions: string[];
}

export interface BehaviorPattern {
  category: string;
  frequency: number;
  timeOfDay: string[];
  locations: string[];
  triggers: string[];
  trend: "increasing" | "decreasing" | "stable";
}

// ============================================================================
// 7. FAMILY PORTAL
// ============================================================================

export interface FamilyPortalAccess {
  id: string;
  patientId: string;
  userId: string;
  relationship: "parent" | "guardian" | "grandparent" | "sibling" | "other";
  permissions: PortalPermission[];
  isActive: boolean;
  lastAccessedAt?: string;
  createdAt: string;
}

export type PortalPermission =
  | "view_goals"
  | "view_sessions"
  | "view_schedule"
  | "view_documents"
  | "view_assessments"
  | "view_behavior"
  | "view_medication"
  | "communicate"
  | "upload_documents"
  | "schedule_appointments"
  | "view_billing";

export interface HomeActivity {
  id: string;
  patientId: string;
  title: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  materials?: string[];
  instructions: string[];
  estimatedTime?: number;
  relatedGoals: string[];
  attachments: Attachment[];
  isRecommended: boolean;
  completionRate?: number;
  createdAt: string;
}

export interface FamilyCommunication {
  id: string;
  patientId: string;
  senderId: string;
  senderType: "therapist" | "family" | "admin";
  subject: string;
  message: string;
  category: "general" | "progress" | "concern" | "scheduling" | "urgent";
  isRead: boolean;
  readAt?: string;
  attachments: Attachment[];
  createdAt: string;
  replies?: FamilyCommunication[];
}

// ============================================================================
// 8. DOCUMENT MANAGEMENT
// ============================================================================

export interface Document {
  id: string;
  patientId: string;
  name: string;
  description?: string;
  type: DocumentType;
  category: DocumentCategory;
  fileUrl: string;
  thumbnailUrl?: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  folderId?: string;
  tags: string[];
  isConfidential: boolean;
  expirationDate?: string;
  version: number;
  previousVersions?: DocumentVersion[];
  accessLog: AccessLogEntry[];
  createdAt: string;
  updatedAt: string;
}

export type DocumentType =
  | "pdf"
  | "image"
  | "video"
  | "audio"
  | "spreadsheet"
  | "document"
  | "other";

export type DocumentCategory =
  | "assessment"
  | "report"
  | "iep"
  | "medical"
  | "insurance"
  | "consent"
  | "photo"
  | "video"
  | "other";

export interface DocumentFolder {
  id: string;
  patientId: string;
  name: string;
  parentId?: string;
  order: number;
  createdAt: string;
}

export interface DocumentVersion {
  version: number;
  fileUrl: string;
  updatedBy: string;
  updatedAt: string;
  changeDescription?: string;
}

export interface AccessLogEntry {
  userId: string;
  action: "view" | "download" | "edit" | "delete" | "share";
  timestamp: string;
  ipAddress?: string;
}

// ============================================================================
// 9. MEDICATION MANAGEMENT
// ============================================================================

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  route: "oral" | "injection" | "topical" | "inhaler" | "other";
  prescribedBy: string;
  prescribedDate: string;
  pharmacy?: string;
  instructions?: string;
  sideEffects?: string[];
  contraindications?: string[];
  isActive: boolean;
  isPRN: boolean; // As needed
  schedule: MedicationSchedule[];
  logs: MedicationLog[];
  refillInfo?: RefillInfo;
  createdAt: string;
  updatedAt: string;
}

export interface MedicationSchedule {
  id: string;
  time: string;
  daysOfWeek: number[]; // 0-6, 0 = Sunday
  dosage?: string;
  instructions?: string;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  scheduledTime: string;
  takenTime?: string;
  status: "taken" | "missed" | "skipped" | "refused" | "late";
  dosage?: string;
  administeredBy?: string;
  notes?: string;
  sideEffects?: string[];
  createdAt: string;
}

export interface RefillInfo {
  totalRefills: number;
  refillsRemaining: number;
  lastRefillDate?: string;
  nextRefillDate?: string;
  pharmacyName?: string;
  pharmacyPhone?: string;
}

// ============================================================================
// 10. NOTIFICATION SYSTEM
// ============================================================================

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "unread" | "read" | "archived";
  relatedEntity?: {
    type: string;
    id: string;
  };
  actions?: NotificationAction[];
  sentVia: ("in_app" | "email" | "sms" | "push")[];
  scheduledFor?: string;
  readAt?: string;
  createdAt: string;
}

export type NotificationType =
  | "goal_updated"
  | "session_reminder"
  | "assessment_due"
  | "document_uploaded"
  | "message_received"
  | "behavior_logged"
  | "medication_reminder"
  | "billing_reminder"
  | "system_alert"
  | "appointment_confirmed"
  | "goal_completed";

export type NotificationCategory =
  | "clinical"
  | "administrative"
  | "communication"
  | "billing"
  | "system";

export interface NotificationAction {
  label: string;
  action: string;
  url?: string;
}

export interface NotificationPreference {
  userId: string;
  type: NotificationType;
  inApp: boolean;
  email: boolean;
  sms: boolean;
  push: boolean;
  digestMode?: "immediate" | "daily" | "weekly";
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

// ============================================================================
// SHARED TYPES
// ============================================================================

export interface Attachment {
  id: string;
  type: "image" | "video" | "document" | "audio";
  url: string;
  thumbnailUrl?: string;
  name: string;
  size?: number;
  mimeType?: string;
  caption?: string;
  uploadedBy: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: "create" | "read" | "update" | "delete" | "share" | "export";
  userId: string;
  userType: "therapist" | "admin" | "family" | "system";
  changes?: Record<string, { old: unknown; new: unknown }>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    perPage?: number;
    hasMore?: boolean;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// ============================================================================
// 11. BILLING & INVOICING
// ============================================================================

export interface Invoice {
  id: string;
  patientId: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  notes?: string;
  insuranceClaim?: InsuranceClaim;
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}

export type InvoiceStatus =
  | "draft"
  | "sent"
  | "paid"
  | "overdue"
  | "cancelled"
  | "void";

export interface InvoiceLineItem {
  id: string;
  description: string;
  serviceDate: string;
  serviceCode: string;
  units: number;
  unitPrice: number;
  amount: number;
  sessionId?: string;
}

export interface Payment {
  id: string;
  amount: number;
  method: "credit_card" | "check" | "cash" | "bank_transfer" | "insurance";
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;
  processedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface InsuranceClaim {
  id: string;
  insuranceProvider: string;
  policyNumber: string;
  claimNumber?: string;
  status: "pending" | "submitted" | "approved" | "denied" | "partial";
  submittedDate?: string;
  responseDate?: string;
  allowedAmount?: number;
  paidAmount?: number;
  denialReason?: string;
}

// ============================================================================
// COMPONENT-FRIENDLY TYPE ALIASES AND EXTENSIONS
// ============================================================================

// Extended Session properties for components (using Omit for conflicting properties)
export type SessionExtended = Omit<Session, "location"> & {
  therapistName?: string;
  location?: string | SessionLocation;
};

// Visual Schedule Item for components
export interface ScheduleItem {
  id: string;
  title: string;
  duration: number;
  order: number;
  imageUrl?: string;
  isOptional?: boolean;
  notes?: string;
}

// Extended Visual Schedule for components
export interface VisualScheduleExtended extends VisualSchedule {
  title: string;
  scheduleType: ScheduleType;
  items: ScheduleItem[];
  colorTheme?: string;
  isTemplate?: boolean;
}

// Communication Card for components
export interface CommunicationCard {
  id: string;
  text: string;
  category: CommunicationCategory;
  order: number;
  imageUrl?: string;
  audioUrl?: string;
}

export type CommunicationCategory =
  | "needs"
  | "feelings"
  | "actions"
  | "social"
  | "food"
  | "activities"
  | "places"
  | "people"
  | "custom";

// Extended Communication Board for components
export interface CommunicationBoardExtended extends CommunicationBoard {
  title: string;
  description?: string;
  cards: CommunicationCard[];
  gridColumns: number;
  isActive?: boolean;
}

// Assessment Question for components
export interface AssessmentQuestion {
  id: string;
  text: string;
  type: "scale" | "boolean" | "text" | "multiple_choice";
  order: number;
  category?: string;
  options?: string[];
  answer?: string | number | boolean | string[];
}

// Extended Assessment for components
export interface AssessmentExtended extends Assessment {
  description?: string;
  questions: AssessmentQuestion[];
  administeredById?: string;
  administeredByName?: string;
  dateAdministered: string;
}

// Family Portal Access for components (using existing FamilyPortalAccess type)
export type FamilyPortalAccessExtended = FamilyPortalAccess & {
  familyMemberEmail: string;
  familyMemberName: string;
  invitedAt: string;
  lastLoginAt?: string;
  notes?: string;
};

// Extended Document for components (using Omit for conflicting properties)
export type DocumentExtended = Omit<Document, "isConfidential"> & {
  uploadedByName: string;
  isConfidential?: boolean;
};

// Extended Behavior Record for components (using Omit for conflicting properties)
export type BehaviorRecordExtended = Omit<BehaviorRecord, "description"> & {
  description?: string;
  intensity?: number;
};

// Extended Medication for components
export interface MedicationExtended extends Medication {
  prescribedByName: string;
  instructions?: string;
}

// Extended Invoice for components
export interface InvoiceExtended extends Invoice {
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}
