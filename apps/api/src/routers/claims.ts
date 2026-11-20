/**
 * Claims Router
 *
 * Real insurance-claim exports from the `insurance_claims` table:
 * - CMS-1500 style PDF summary
 * - 837P EDI (simplified, HIPAA-shaped segments)
 */

import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { z } from "zod";
import { getDb, orgAuthed, schema } from "../procedures";

const exportInput = z.object({ claimId: z.string().uuid() });

async function loadClaim(context: any, claimId: string) {
  const db = getDb(context);
  const [claim] = await db
    .select()
    .from(schema.insuranceClaims)
    .where(eq(schema.insuranceClaims.id, claimId))
    .limit(1);
  if (!claim) throw new ORPCError("NOT_FOUND", { message: "Claim not found" });
  const [patient] = await db
    .select()
    .from(schema.patients)
    .where(eq(schema.patients.id, claim.patientId))
    .limit(1);
  return { claim, patient };
}

export const claimsRouter = {
  exportCms1500: orgAuthed
    .route({
      method: "POST",
      path: "/claims/cms1500",
      summary: "Export claim as CMS-1500 style PDF",
      tags: ["Claims"],
    })
    .input(exportInput)
    .output(z.object({ pdfBase64: z.string(), fileName: z.string() }))
    .handler(async ({ context, input }) => {
      const { claim, patient } = await loadClaim(context, input.claimId);
      const db = getDb(context);
      const [branding] = await db
        .select()
        .from(schema.whiteLabelSettings)
        .where(eq(schema.whiteLabelSettings.organizationId, context.organization.id))
        .limit(1);
      const brandName = branding?.brandName ?? "SpectrumAI";

      const pdf = await PDFDocument.create();
      const page = pdf.addPage([612, 792]); // US Letter
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
      let y = 740;
      const draw = (text: string, size = 10, isBold = false) => {
        page.drawText(text, {
          x: 48,
          y,
          size,
          font: isBold ? bold : font,
          color: rgb(0, 0, 0),
        });
        y -= size + 6;
      };

      draw(brandName, 12, true);
      draw("HEALTH INSURANCE CLAIM FORM (CMS-1500 summary)", 13, true);
      y -= 6;
      draw(`Payer: ${claim.payerName}`, 10, true);
      draw(`State: ${claim.state}`);
      draw(`Claim #: ${claim.claimNumber || claim.id.slice(0, 12)}`);
      draw(`Status: ${claim.status}`);
      y -= 6;
      draw("Patient", 10, true);
      draw(`${patient?.firstName ?? ""} ${patient?.lastName ?? ""}`);
      if (patient?.dateOfBirth)
        draw(
          `DOB: ${new Date(patient.dateOfBirth).toLocaleDateString("en-US")}`,
        );
      y -= 6;
      draw("Service", 10, true);
      draw(
        `Date of service: ${new Date(claim.dateOfService).toLocaleDateString("en-US")}`,
      );
      draw(`Billed: $${(claim.billedCents / 100).toFixed(2)}`);
      if (claim.allowedCents != null)
        draw(`Allowed: $${(claim.allowedCents / 100).toFixed(2)}`);
      if (claim.paidCents != null)
        draw(`Paid: $${(claim.paidCents / 100).toFixed(2)}`);
      if (claim.denialReason) draw(`Denial: ${claim.denialReason}`);
      y -= 10;
      draw(
        "This is a system-generated claim summary. Submit via your clearinghouse for the official CMS-1500.",
        8,
      );

      const bytes = await pdf.save();
      return {
        pdfBase64: Buffer.from(bytes).toString("base64"),
        fileName: `claim-${claim.claimNumber || claim.id.slice(0, 8)}.pdf`,
      };
    }),

  export837p: orgAuthed
    .route({
      method: "POST",
      path: "/claims/837p",
      summary: "Export claim as 837P EDI (simplified)",
      tags: ["Claims"],
    })
    .input(exportInput)
    .output(z.object({ edi: z.string(), fileName: z.string() }))
    .handler(async ({ context, input }) => {
      const { claim, patient } = await loadClaim(context, input.claimId);
      const now = new Date();
      const date = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
      const dos = new Date(claim.dateOfService);
      const dosStr = `${dos.getFullYear()}${String(dos.getMonth() + 1).padStart(2, "0")}${String(dos.getDate()).padStart(2, "0")}`;
      const control = String(Date.now()).slice(-9);
      const seg = (id: string, ...els: string[]) =>
        [id, ...els].join("*") + "~";

      const edi = [
        seg(
          "ISA",
          "00",
          "          ",
          "00",
          "          ",
          "ZZ",
          "SCHOOLAI",
          "ZZ",
          "CLEARING",
          date.slice(2),
          String(now.getHours()).padStart(2, "0") +
            String(now.getMinutes()).padStart(2, "0"),
          "^",
          "00501",
          control,
          "0",
          "P",
          ":",
        ),
        seg(
          "GS",
          "HC",
          "SENDER",
          "RECEIVER",
          dosStr,
          date.slice(2),
          control,
          "X",
          "005010X222A1",
        ),
        seg("ST", "837", control, "005010X222A1"),
        seg(
          "BHT",
          "0019",
          "00",
          control,
          dosStr,
          String(now.getHours()).padStart(2, "0") +
            String(now.getMinutes()).padStart(2, "0"),
          "CH",
        ),
        seg(
          "NM1",
          "41",
          "2",
          claim.payerName,
          "",
          "",
          "",
          "",
          "PI",
          claim.state,
        ),
        seg(
          "NM1",
          "QC",
          "1",
          patient?.lastName ?? "",
          patient?.firstName ?? "",
        ),
        seg(
          "CLM",
          claim.claimNumber || claim.id.slice(0, 12),
          String((claim.billedCents / 100).toFixed(2)),
          "",
          "",
          "",
          "11:B:1",
        ),
        seg("DTP", "434", "D8", dosStr),
        seg("SE", "9", control),
        seg("GE", "1", control),
        seg("IEA", "1", control),
      ].join("\n");

      return {
        edi,
        fileName: `claim-${claim.claimNumber || claim.id.slice(0, 8)}.837p.txt`,
      };
    }),
};
