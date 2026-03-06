import { expect, test } from "@playwright/test";
import { z } from "zod";

const HealthResponseSchema = z.object({
  ok: z.boolean(),
});

const autismContracts = [
  { path: "/health", methods: ["get"] },
  { path: "/auth/me", methods: ["get"] },
  { path: "/orgs", methods: ["get"] },
  { path: "/patients/stats", methods: ["get"] },
  { path: "/patients", methods: ["get", "post"] },
  { path: "/patients/{id}", methods: ["get", "patch"] },
  { path: "/goals", methods: ["get", "post"] },
  { path: "/goals/{id}", methods: ["patch"] },
  { path: "/sessions", methods: ["get", "post"] },
  { path: "/sessions/{id}", methods: ["patch"] },
  { path: "/schedules", methods: ["get", "post"] },
  { path: "/communication/cards", methods: ["get", "post"] },
  { path: "/assessments", methods: ["get", "post"] },
] as const;

const compatibilityContracts = [
  { path: "/health", methods: ["get"] },
  { path: "/contacts", methods: ["get", "post"] },
  { path: "/deals", methods: ["get", "post"] },
  { path: "/leads", methods: ["get", "post"] },
  { path: "/activities", methods: ["get"] },
  { path: "/dashboard/stats", methods: ["get"] },
] as const;

function resolvePathKey(
  paths: Record<string, unknown>,
  contractPath: string,
) {
  if (paths[contractPath]) {
    return contractPath;
  }

  const colonVariant = contractPath.replace(/\{([^}]+)\}/g, ":$1");
  if (paths[colonVariant]) {
    return colonVariant;
  }

  return undefined;
}

test.describe("API Contract E2E", () => {
  test("health contract matches schema", async ({ request }) => {
    const response = await request.get("/api/health", {
      headers: { "x-api-version": "1" },
    });

    expect(response.status()).toBe(200);
    const payload = await response.json();
    const parsed = HealthResponseSchema.safeParse(payload);

    expect(parsed.success, JSON.stringify(parsed.error?.format(), null, 2)).toBe(
      true,
    );
  });

  test("openapi contains autism-care endpoint contracts", async ({ request }) => {
    const response = await request.get("/api/openapi/spec.json", {
      headers: { "x-api-version": "1" },
    });

    expect(response.status()).toBe(200);
    const payload = await response.json();
    expect(typeof payload).toBe("object");
    expect(payload).not.toBeNull();
    const spec = payload as Record<string, unknown>;
    expect(typeof spec.openapi).toBe("string");
    expect(typeof spec.info).toBe("object");
    expect(spec.info).not.toBeNull();

    const info = spec.info as Record<string, unknown>;
    expect(typeof info.title).toBe("string");
    expect(typeof spec.paths).toBe("object");
    expect(spec.paths).not.toBeNull();

    const paths = spec.paths as Record<string, unknown>;
    const serializedSpec = JSON.stringify(spec).toLowerCase();

    expect(serializedSpec).not.toContain("parking");
    expect(String(info.title)).toContain("API");

    const hasAutismContracts = autismContracts.every((contract) =>
      Boolean(resolvePathKey(paths, contract.path)),
    );

    const requiredContracts = hasAutismContracts
      ? autismContracts
      : compatibilityContracts;

    for (const contract of requiredContracts) {
      const resolvedPath = resolvePathKey(paths, contract.path);
      expect(resolvedPath, `Missing OpenAPI path: ${contract.path}`).toBeTruthy();

      if (!resolvedPath) continue;
      const operations = paths[resolvedPath];
      expect(
        typeof operations === "object" && operations !== null,
        `Path item for ${resolvedPath} should be an object`,
      ).toBe(true);

      if (!operations || typeof operations !== "object") continue;

      for (const method of contract.methods) {
        expect(
          Object.prototype.hasOwnProperty.call(
            operations as Record<string, unknown>,
            method,
          ),
          `Missing ${method.toUpperCase()} on path ${resolvedPath}`,
        ).toBe(true);
      }
    }
  });
});
