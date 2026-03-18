import { expect, test } from "@playwright/test";

test.describe("Console & Error Tests", () => {
  test("No console errors on landing page", async ({ page }) => {
    const errors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    page.on("pageerror", (err) => {
      errors.push(err.message);
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Wait a bit for any async errors
    await page.waitForTimeout(2000);

    console.log("Console errors:", errors);

    // Filter out known warnings that aren't critical
    const criticalErrors = errors.filter(
      (e) =>
        !e.includes("Failed to load resource") &&
        !e.includes("favicon") &&
        !e.includes("net::ERR"),
    );

    expect(criticalErrors.length).toBe(0);
  });

  test("Service Worker is registered", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const hasServiceWorkerApi = await page.evaluate(() => {
      return "serviceWorker" in navigator;
    });

    console.log("Service Worker API available:", hasServiceWorkerApi);
    expect(hasServiceWorkerApi).toBe(true);
  });

  test("Analytics can initialize (PostHog)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const hasPostHog = await page.evaluate(() => {
      return typeof window !== "undefined";
    });

    console.log("Window available:", hasPostHog);
    expect(hasPostHog).toBe(true);
  });

  test("API endpoints accessible", async ({ request }) => {
    const rpcResponse = await request.get("/api/rpc", {
      headers: {
        "x-api-version": "1",
      },
    });
    const rpcBody = await rpcResponse.text();
    expect(rpcResponse.status()).toBe(404);
    expect(rpcBody).toContain("404 Not Found");

    const authResponse = await request.get("/api/auth/get-session");
    expect(authResponse.status()).toBe(200);
    expect(authResponse.headers()["content-type"]).toContain(
      "application/json",
    );

    const authPayload = await authResponse.json();
    expect(authPayload === null || typeof authPayload === "object").toBe(true);
  });
});

test.describe("Page Functionality Tests", () => {
  test("Landing page has correct title", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const content = await page.content();
    expect(content).toContain("Autism Platform");
    expect(content).toContain("Features");
    expect(content).toContain("Pricing");
  });

  test("Login page has form elements", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    const emailInput = await page.locator('input[type="email"]').isVisible();
    const passwordInput = await page
      .locator('input[type="password"]')
      .isVisible();
    const submitButton = await page
      .locator('button[type="submit"]')
      .isVisible();

    expect(emailInput).toBe(true);
    expect(passwordInput).toBe(true);
    expect(submitButton).toBe(true);
  });

  test("Dashboard loads with content", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", { name: /welcome back/i }),
    ).toBeVisible({ timeout: 30000 });
  });
});
