import { JSON_SCHEMA_REGISTRY } from "@orpc/zod/zod4";
import * as z from "zod";
import { DateTimeSchema } from "./autism-care";

export const OperationsStatusSchema = z.enum([
  "not_started",
  "pending",
  "active",
  "ready",
  "watch",
  "blocked",
  "expired",
  "closed",
]);

export const ProviderRoleSchema = z.enum([
  "owner_bcba",
  "bcba",
  "bcaba",
  "learner_bcba",
  "rbt",
  "admin",
  "rcm",
]);

export const ProviderProfileSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  userId: z.string().nullable().optional(),
  displayName: z.string(),
  role: ProviderRoleSchema,
  employmentType: z.string().nullable().optional(),
  homeState: z.string().nullable().optional(),
  serviceStates: z.array(z.string()).nullable().optional(),
  status: z.string(),
  maxClientLoad: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const ProviderStateLicenseSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  providerId: z.string(),
  state: z.string(),
  licenseType: z.string(),
  licenseNumber: z.string().nullable().optional(),
  status: z.string(),
  issuedDate: DateTimeSchema.nullable().optional(),
  expirationDate: DateTimeSchema.nullable().optional(),
  evidenceUrl: z.string().nullable().optional(),
  verifiedBy: z.string().nullable().optional(),
  verifiedAt: DateTimeSchema.nullable().optional(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const PayerCredentialingSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  providerId: z.string().nullable().optional(),
  payerName: z.string(),
  state: z.string(),
  networkType: z.string().nullable().optional(),
  status: z.string(),
  applicationId: z.string().nullable().optional(),
  submittedDate: DateTimeSchema.nullable().optional(),
  effectiveDate: DateTimeSchema.nullable().optional(),
  revalidationDate: DateTimeSchema.nullable().optional(),
  portalUrl: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const ServiceAuthorizationSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  patientId: z.string(),
  payerCredentialingId: z.string().nullable().optional(),
  payerName: z.string(),
  authorizationNumber: z.string().nullable().optional(),
  state: z.string(),
  cptCode: z.string(),
  modifier: z.string().nullable().optional(),
  approvedUnits: z.number(),
  usedUnits: z.number(),
  startDate: DateTimeSchema,
  endDate: DateTimeSchema,
  status: z.string(),
  documentUrl: z.string().nullable().optional(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const InsuranceClaimSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  patientId: z.string(),
  sessionId: z.string().nullable().optional(),
  authorizationId: z.string().nullable().optional(),
  payerName: z.string(),
  state: z.string(),
  claimNumber: z.string().nullable().optional(),
  clearinghouseTrace: z.string().nullable().optional(),
  status: z.string(),
  dateOfService: DateTimeSchema,
  submittedDate: DateTimeSchema.nullable().optional(),
  billedCents: z.number(),
  allowedCents: z.number().nullable().optional(),
  paidCents: z.number().nullable().optional(),
  denialReason: z.string().nullable().optional(),
  nextFollowUpDate: DateTimeSchema.nullable().optional(),
  assignedRcmUserId: z.string().nullable().optional(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const ClaimEventSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  claimId: z.string(),
  eventType: z.string(),
  eventDate: DateTimeSchema,
  payerRepresentative: z.string().nullable().optional(),
  referenceNumber: z.string().nullable().optional(),
  summary: z.string(),
  nextAction: z.string().nullable().optional(),
  createdBy: z.string().nullable().optional(),
  createdAt: DateTimeSchema,
});

export const RbtSupervisionLogSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  rbtProviderId: z.string(),
  supervisingProviderId: z.string(),
  month: z.string(),
  totalServiceMinutes: z.number(),
  supervisedMinutes: z.number(),
  directObservationDone: z.boolean(),
  status: z.string(),
  evidenceUrl: z.string().nullable().optional(),
  reviewedBy: z.string().nullable().optional(),
  reviewedAt: DateTimeSchema.nullable().optional(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const HipaaAuditLogSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  actorUserId: z.string().nullable().optional(),
  actorRole: z.string().nullable().optional(),
  action: z.string(),
  resourceType: z.string(),
  resourceId: z.string().nullable().optional(),
  patientId: z.string().nullable().optional(),
  ipAddress: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  createdAt: DateTimeSchema,
});

export const IndiaRcmAccessSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  userId: z.string(),
  accessScope: z.string(),
  phiAccessLevel: z.string(),
  baaVerified: z.boolean(),
  mfaVerified: z.boolean(),
  lastAccessReview: DateTimeSchema.nullable().optional(),
  status: z.string(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const AiVideoAlertSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  patientId: z.string(),
  sessionId: z.string().nullable().optional(),
  state: z.string(),
  severity: z.enum(["low", "medium", "high"]),
  signal: z.string(),
  aiModel: z.string().nullable().optional(),
  confidencePercent: z.number().nullable().optional(),
  clipUrl: z.string().nullable().optional(),
  humanReviewed: z.boolean(),
  reviewedBy: z.string().nullable().optional(),
  reviewedAt: DateTimeSchema.nullable().optional(),
  resolution: z.string().nullable().optional(),
  claimHold: z.boolean(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const AiOperationsRecommendationSchema = z.object({
  id: z.string(),
  domain: z.enum([
    "credentialing",
    "authorization",
    "claims",
    "supervision",
    "hipaa",
    "video",
  ]),
  severity: z.enum(["low", "medium", "high"]),
  title: z.string(),
  finding: z.string(),
  action: z.string(),
  owner: z.string(),
});

JSON_SCHEMA_REGISTRY.add(ProviderProfileSchema, {
  examples: [
    {
      id: "provider_123",
      organizationId: "org_123",
      displayName: "Owner BCBA",
      role: "owner_bcba",
      serviceStates: ["WA", "ND", "CT", "MO"],
      status: "active",
      maxClientLoad: 8,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
});

JSON_SCHEMA_REGISTRY.add(AiOperationsRecommendationSchema, {
  examples: [
    {
      id: "claim-WA-ABA-1007",
      domain: "claims",
      severity: "medium",
      title: "WA-ABA-1007 claim follow-up",
      finding: "Apple Health MCO claim is 18 days old: No ERA yet.",
      action:
        "Place payer call, log reference number, and escalate if no adjudication date.",
      owner: "India RCM",
    },
  ],
});
