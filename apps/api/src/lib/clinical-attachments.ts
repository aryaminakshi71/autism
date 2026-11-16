export type ClinicalAttachment = {
  id: string;
  organizationId: string;
  patientId: string;
  sessionId?: string;
  filename: string;
  contentType: string;
  byteSize: number;
  storageKey: string;
  encrypted: boolean;
  uploadedBy: string;
  createdAt: string;
};

export function buildAttachmentMetadata(input: Omit<ClinicalAttachment, "id" | "createdAt" | "encrypted">) {
  return {
    ...input,
    id: crypto.randomUUID(),
    encrypted: true,
    createdAt: new Date().toISOString(),
  } satisfies ClinicalAttachment;
}
