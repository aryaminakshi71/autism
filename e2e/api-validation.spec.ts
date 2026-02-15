/**
 * E2E Tests for API Validation
 */

import { test, expect } from "@playwright/test";

test.describe("API Validation E2E", () => {
  test("health endpoint responds with ok", async ({ request }) => {
    const response = await request.get("/api/health", {
      headers: { "x-api-version": "1" },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toMatchObject({ ok: true });
  });

  test("OpenAPI spec is accessible", async ({ request }) => {
    const response = await request.get("/api/openapi/spec.json", {
      headers: { "x-api-version": "1" },
    });

    expect(response.status()).toBe(200);
    const spec = await response.json();
    expect(spec?.openapi).toBeTruthy();
    expect(spec?.info?.title).toContain("API");
  });

  test("RPC and Auth endpoints do not 5xx", async ({ request }) => {
    const rpc = await request.get("/api/rpc", {
      headers: { "x-api-version": "1" },
    });
    const auth = await request.get("/api/auth");

    expect(rpc.status()).toBeLessThan(500);
    expect(auth.status()).toBeLessThan(500);
  });
});
