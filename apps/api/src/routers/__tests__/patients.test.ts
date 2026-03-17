/**
 * Patients Router Tests
 */

import { eq } from "drizzle-orm";
import { beforeEach, describe, expect, it } from "vitest";
import { schema } from "../../procedures";
import { patientsRouter } from "../patients";
import { hasDatabase, testDb } from "./setup";
import { createMockOrgContext } from "./test-utils";

describe("Patients Router", () => {
  let context: ReturnType<typeof createMockOrgContext>;
  let testOrgId: string;

  beforeEach(async () => {
    if (!hasDatabase || !testDb) {
      return;
    }

    // Clean up test data
    await testDb.delete(schema.patients);
    await testDb.delete(schema.members);
    await testDb.delete(schema.organizations);
    await testDb.delete(schema.users);

    // Create test organization
    const { organizations } = await import(
      "@autism-legacy-20260205/storage/db/schema"
    );
    const [org] = await testDb
      .insert(organizations)
      .values({
        id: crypto.randomUUID(),
        name: "Test Organization",
        slug: `test-org-${Date.now()}`,
      })
      .returning();
    testOrgId = org.id;

    // Create mock context
    context = createMockOrgContext({
      organization: {
        id: org.id,
        name: org.name,
        slug: org.slug || "test-org",
        plan: "pro",
      },
    });
  });

  describe("list", () => {
    it.skipIf(!hasDatabase || !testDb)(
      "should return paginated patients",
      async () => {
        const result = await patientsRouter.list.handler({
          context,
          input: { page: 1, limit: 10 },
        });

        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.page).toBe(1);
        expect(result.limit).toBe(10);
      },
    );
  });

  describe("get", () => {
    it.skipIf(!hasDatabase || !testDb)(
      "should return single patient",
      async () => {
        // Create a test patient first
        const { patients } = schema;
        const [patient] = await testDb
          .insert(patients)
          .values({
            id: crypto.randomUUID(),
            organizationId: testOrgId,
            firstName: "Test",
            lastName: "Patient",
            status: "active",
            primaryLanguage: "en",
            preferredCommunication: "verbal",
          })
          .returning();

        const result = await patientsRouter.get.handler({
          context,
          input: { id: patient.id },
        });

        expect(result).toBeDefined();
        expect(result.firstName).toBe("Test");
        expect(result.lastName).toBe("Patient");
      },
    );
  });

  describe("create", () => {
    it.skipIf(!hasDatabase || !testDb)(
      "should create new patient",
      async () => {
        const input = {
          firstName: "John",
          lastName: "Doe",
          dateOfBirth: "2019-01-01",
          gender: "male",
          diagnosis: "ASD Level 1",
          severityLevel: "Level 1",
          status: "active",
        };

        const result = await patientsRouter.create.handler({
          context,
          input,
        });

        expect(result).toBeDefined();
        expect(result.firstName).toBe("John");
        expect(result.lastName).toBe("Doe");
        expect(result.organizationId).toBe(context.organization.id);
      },
    );
  });

  describe("update", () => {
    it.skipIf(!hasDatabase || !testDb)(
      "should update existing patient",
      async () => {
        // Create a test patient first
        const { patients } = schema;
        const [patient] = await testDb
          .insert(patients)
          .values({
            id: crypto.randomUUID(),
            organizationId: testOrgId,
            firstName: "Jane",
            lastName: "Doe",
            status: "active",
            primaryLanguage: "en",
            preferredCommunication: "verbal",
          })
          .returning();

        const result = await patientsRouter.update.handler({
          context,
          input: { id: patient.id, firstName: "Jane Updated" },
        });

        expect(result.firstName).toBe("Jane Updated");
      },
    );
  });

  describe("delete", () => {
    it.skipIf(!hasDatabase || !testDb)(
      "should delete patient",
      async () => {
        // Create a test patient first
        const { patients } = schema;
        const [patient] = await testDb
          .insert(patients)
          .values({
            id: crypto.randomUUID(),
            organizationId: testOrgId,
            firstName: "ToDelete",
            lastName: "Patient",
            status: "active",
            primaryLanguage: "en",
            preferredCommunication: "verbal",
          })
          .returning();

        const result = await patientsRouter.delete.handler({
          context,
          input: { id: patient.id },
        });

        expect(result.success).toBe(true);
      },
    );
  });

  describe("stats", () => {
    it.skipIf(!hasDatabase || !testDb)(
      "should return patient statistics",
      async () => {
        // Create some test patients
        const { patients } = schema;
        await testDb.insert(patients).values([
          {
            id: crypto.randomUUID(),
            organizationId: testOrgId,
            firstName: "Patient1",
            lastName: "Test",
            status: "active",
            primaryLanguage: "en",
            preferredCommunication: "verbal",
          },
          {
            id: crypto.randomUUID(),
            organizationId: testOrgId,
            firstName: "Patient2",
            lastName: "Test",
            status: "active",
            primaryLanguage: "en",
            preferredCommunication: "verbal",
          },
          {
            id: crypto.randomUUID(),
            organizationId: testOrgId,
            firstName: "Patient3",
            lastName: "Test",
            status: "inactive",
            primaryLanguage: "en",
            preferredCommunication: "verbal",
          },
        ]);

        const result = await patientsRouter.stats.handler({
          context,
        });

        expect(result.total).toBeGreaterThanOrEqual(3);
        expect(result.active).toBeGreaterThanOrEqual(2);
        expect(result.inactive).toBeGreaterThanOrEqual(1);
      },
    );
  });
});
