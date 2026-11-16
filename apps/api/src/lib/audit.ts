import type { OrgContext } from "../context";
import { getDb, schema } from "../procedures";

type AuditEvent = {
  action: string;
  resourceType: string;
  resourceId?: string;
  patientId?: string;
  metadata?: Record<string, unknown>;
};

/**
 * Writes a minimum-necessary audit record for patient-data actions. Metadata
 * must never contain narrative notes, behavior details, or other PHI content.
 */
export async function writeAuditEvent(context: OrgContext, event: AuditEvent) {
  try {
    await getDb(context).insert(schema.hipaaAuditLogs).values({
      organizationId: context.organization.id,
      actorUserId: context.user.id,
      actorRole: context.member.role,
      action: event.action,
      resourceType: event.resourceType,
      resourceId: event.resourceId ?? null,
      patientId: event.patientId ?? null,
      metadata: event.metadata ?? {},
    });
  } catch (error) {
    // Audit storage must be observable without leaking clinical content.
    console.error("Unable to write HIPAA audit event", {
      action: event.action,
      resourceType: event.resourceType,
      error: error instanceof Error ? error.message : "unknown",
    });
  }
}
