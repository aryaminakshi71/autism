import { beforeEach, describe, expect, it } from "vitest";
import { schema } from "../../procedures";
import { goalsRouter } from "../goals";
import { hasDatabase, testDb } from "./setup";
import { createMockOrgContext } from "./test-utils";

describe("Goals Router", () => {
  let context: ReturnType<typeof createMockOrgContext>;
  let testOrgId: string;
  let testPatientId: string;

  beforeEach(async () => {
    if (!hasDatabase || !testDb) {
      return;
    }

    // Clean up test data
    await testDb.delete(schema.goals);
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

    // Create test patient
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
    testPatientId = patient.id;

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
      "should return paginated goals",
      async () => {
        const result = await goalsRouter.list.handler({
          context,
          input: { page: 1, limit: 10 },
        });

        expect(result.data).toBeDefined();
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.page).toBe(1);
        expect(result.limit).toBe(10);
      },
    );

    it.skipIf(!hasDatabase || !testDb)(
      "should filter goals by patientId",
      async () => {
        // Create test goals
        const { goals } = schema;
        await testDb.insert(goals).values([
          {
            id: crypto.randomUUID(),
            organizationId: testOrgId,
            patientId: testPatientId,
            name: "Goal 1",
            category: "Communication",
            targetValue: 100,
            status: "active",
            priority: "high",
          },
          {
            id: crypto.randomUUID(),
            organizationId: testOrgId,
            patientId: "other-patient-id",
            name: "Goal 2",
            category: "Social",
            targetValue: 80,
            status: "active",
            priority: "medium",
          },
        ]);

        const result = await goalsRouter.list.handler({
          context,
          input: { page: 1, limit: 10, patientId: testPatientId },
        });

        expect(result.data.length).toBeGreaterThanOrEqual(1);
        result.data.forEach((goal: any) => {
          expect(goal.patientId).toBe(testPatientId);
        });
      },
    );
  });

  describe("create", () => {
    it.skipIf(!hasDatabase || !testDb)("should create new goal", async () => {
      const input = {
        patientId: testPatientId,
        name: "Increase eye contact",
        description: "Increase sustained eye contact",
        category: "Social",
        baselineValue: 20,
        targetValue: 80,
        unit: "%",
        masteryCriteria: 80,
        priority: "high",
      };

      const result = await goalsRouter.create.handler({
        context,
        input,
      });

      expect(result).toBeDefined();
      expect(result.name).toBe("Increase eye contact");
      expect(result.patientId).toBe(testPatientId);
      expect(result.status).toBe("active");
    });
  });

  describe("update", () => {
    it.skipIf(!hasDatabase || !testDb)(
      "should update goal progress",
      async () => {
        // Create a test goal first
        const { goals } = schema;
        const [goal] = await testDb
          .insert(goals)
          .values({
            id: crypto.randomUUID(),
            organizationId: testOrgId,
            patientId: testPatientId,
            name: "Test Goal",
            category: "Communication",
            baselineValue: 10,
            targetValue: 100,
            currentValue: 10,
            status: "active",
            priority: "medium",
          })
          .returning();

        const result = await goalsRouter.update.handler({
          context,
          input: { id: goal.id, currentValue: 50 },
        });

        expect(result.currentValue).toBe(50);
      },
    );
  });

  describe("delete", () => {
    it.skipIf(!hasDatabase || !testDb)("should delete goal", async () => {
      // Create a test goal first
      const { goals } = schema;
      const [goal] = await testDb
        .insert(goals)
        .values({
          id: crypto.randomUUID(),
          organizationId: testOrgId,
          patientId: testPatientId,
          name: "ToDelete",
          category: "Communication",
          targetValue: 100,
          status: "active",
          priority: "low",
        })
        .returning();

      const result = await goalsRouter.delete.handler({
        context,
        input: { id: goal.id },
      });

      expect(result.success).toBe(true);
    });
  });
});
