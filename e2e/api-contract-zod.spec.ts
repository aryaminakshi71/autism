import { expect, test } from "@playwright/test";
import { z } from "zod";

/**
 * API Contract Tests with Zod
 * Validates API responses match expected schemas
 */

// Health endpoint schema
const HealthSchema = z.object({
  status: z.enum(["ok", "error"]),
  timestamp: z.string().datetime().optional(),
  version: z.string().optional(),
});

// Auth session schema
const AuthSessionSchema = z.object({
  user: z
    .object({
      id: z.string(),
      email: z.string().email(),
      name: z.string().optional(),
      image: z.string().url().optional(),
    })
    .nullable(),
});

// Patient schema
const PatientSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
  dateOfBirth: z.string().optional(),
  status: z.enum(["active", "inactive", "archived"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Goal schema
const GoalSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(["not_started", "in_progress", "completed", "mastered"]),
  progress: z.number().min(0).max(100),
  patientId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// API response wrapper
const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    error: z.string().optional(),
  });

test.describe("API Contract Tests - Health", () => {
  test("health endpoint returns valid schema", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    const result = HealthSchema.safeParse(data);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("ok");
    }
  });
});

test.describe("API Contract Tests - Authentication", () => {
  test("auth session endpoint returns valid schema", async ({ request }) => {
    const response = await request.get("/api/auth/get-session");
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    const result = AuthSessionSchema.safeParse(data);

    expect(result.success).toBe(true);
  });
});

test.describe("API Contract Tests - OpenAPI Spec", () => {
  test("OpenAPI spec is valid JSON", async ({ request }) => {
    const response = await request.get("/api/openapi/");
    expect(response.ok()).toBeTruthy();

    const data = await response.json();

    // Validate basic OpenAPI structure
    expect(data).toHaveProperty("openapi");
    expect(data).toHaveProperty("info");
    expect(data).toHaveProperty("paths");
    expect(data.openapi).toMatch(/^3\.\d+\.\d+$/);
  });

  test("OpenAPI spec contains autism-care endpoints", async ({ request }) => {
    const response = await request.get("/api/openapi/");
    const data = await response.json();

    // Check for key endpoints
    const paths = Object.keys(data.paths || {});
    expect(paths.some((p) => p.includes("patients"))).toBe(true);
    expect(paths.some((p) => p.includes("goals"))).toBe(true);
    expect(paths.some((p) => p.includes("sessions"))).toBe(true);
  });
});

test.describe("API Contract Tests - RPC Endpoints", () => {
  test("RPC endpoints return valid JSON", async ({ request }) => {
    const response = await request.get("/api/rpc", {
      headers: {
        "x-api-version": "1",
        Accept: "application/json",
      },
    });

    // Should return JSON even if 404
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("application/json");
  });
});

test.describe("API Contract Tests - Response Headers", () => {
  test("API responses have required security headers", async ({ request }) => {
    const response = await request.get("/api/health");

    const headers = response.headers();

    // Check for security headers
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-xss-protection"]).toBe("1; mode=block");
  });

  test("API responses have CORS headers", async ({ request }) => {
    const response = await request.get("/api/health");

    const headers = response.headers();

    // CORS headers should be present
    expect(headers["access-control-allow-origin"]).toBeTruthy();
    expect(headers["access-control-allow-methods"]).toContain("GET");
  });
});

test.describe("API Contract Tests - Error Handling", () => {
  test("404 errors return valid JSON", async ({ request }) => {
    const response = await request.get("/api/nonexistent");

    expect(response.status()).toBe(404);

    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("application/json");
  });

  test("invalid method returns appropriate error", async ({ request }) => {
    const response = await request.patch("/api/health");

    // Should return error, not crash
    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
  });
});
