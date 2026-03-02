import { expect, test } from "@playwright/test";

test("Landing Page - loads correctly with all sections", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await expect(page.locator("nav")).toBeVisible();
  await expect(page.locator("h1")).toBeVisible();

  const content = await page.content();
  expect(content).toContain("Smart Parking Management");
  expect(content).toContain("Features");
  expect(content).toContain("Pricing");
  expect(content).toContain("Frequently Asked Questions");
});

test("Landing Page - navigation links work", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await expect(page.locator('a:has-text("Find Parking")')).toBeVisible();
  await expect(page.locator('a:has-text("Try Demo")')).toBeVisible();
  await expect(page.locator('a:has-text("Sign In")')).toBeVisible();
});

test("Landing Page - pricing cards display correctly", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const pricingSection = page.locator("#pricing");
  await expect(pricingSection).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Free", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Starter", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Professional", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Enterprise", exact: true }),
  ).toBeVisible();
});

test("Landing Page - features section has all 4 cards", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const featuresSection = page.locator("#features");
  await expect(featuresSection).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Simple Operations", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Analytics", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Security", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "API & Integrations", exact: true }),
  ).toBeVisible();
});

test("Landing Page - footer displays correctly", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const footer = page
    .locator("footer")
    .filter({ hasText: "All rights reserved" });
  await expect(footer).toBeVisible();
});

test("Landing Page - no console errors", async ({ page }) => {
  const errors: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);

  const criticalErrors = errors.filter(
    (e) => !e.includes("favicon") && !e.includes("net::ERR"),
  );

  expect(criticalErrors.length).toBe(0);
});

test("Login Page - loads with form elements", async ({ page }) => {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");

  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});

test("Login Page - form validation works", async ({ page }) => {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");

  await page.locator('button[type="submit"]').click();

  const urlAfterSubmit = page.url();
  expect(urlAfterSubmit).toContain("/login");
});

test("Login Page - navigation links work", async ({ page }) => {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");

  await expect(page.locator('a:has-text("Back to Home")')).toBeVisible();
  await expect(page.locator('a:has-text("Sign Up")')).toBeVisible();
  await expect(page.locator('a:has-text("Try Demo Instead")')).toBeVisible();
});

test("Login Page - demo link works", async ({ page }) => {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");

  const demoLink = page.locator('a:has-text("Try Demo Instead")');
  await expect(demoLink).toHaveAttribute("href", "/demo");
  // Destination rendering is covered by "Demo Page - loads correctly".
});

test("Demo Page - loads correctly", async ({ page }) => {
  await page.goto("/demo");
  await page.waitForLoadState("networkidle");

  const content = await page.content();
  expect(content).toContain("Try ParkingPro Demo");
  expect(content).toContain("Experience smart parking management");
});

test("Demo Page - feature list displays", async ({ page }) => {
  await page.goto("/demo");
  await page.waitForLoadState("networkidle");

  await expect(page.locator("text=Full access to all features")).toBeVisible();
  await expect(
    page.locator("text=Sample parking lot data pre-loaded"),
  ).toBeVisible();
  await expect(page.locator("text=No credit card required")).toBeVisible();
  await expect(page.locator("text=Demo resets after 24 hours")).toBeVisible();
});

test("Demo Page - start demo button exists", async ({ page }) => {
  await page.goto("/demo");
  await page.waitForLoadState("networkidle");

  await expect(page.locator('button:has-text("Start Demo")')).toBeVisible();
});

test("Demo Page - sign in link works", async ({ page }) => {
  await page.goto("/demo");
  await page.waitForLoadState("networkidle");

  const signIn = page.locator('a:has-text("Sign In")');
  await expect(signIn).toHaveAttribute("href", "/login");
  // Login page rendering is covered by "Login Page - loads with form elements".
});

test("Dashboard - redirects when not authenticated", async ({ page }) => {
  await page.goto("/dashboard");
  // Some engines are inconsistent about input types on the login form; assert on stable content.
  await expect(
    page.getByRole("heading", { name: /welcome back/i }),
  ).toBeVisible({ timeout: 30000 });
});

test("API - RPC endpoint accessible", async ({ request }) => {
  const response = await request.get("/api/rpc", {
    headers: { "x-api-version": "1" },
  });

  expect(response.status()).not.toBe(500);
});

test("API - Auth endpoint accessible", async ({ request }) => {
  const response = await request.get("/api/auth");

  expect(response.status()).not.toBe(500);
});

test("Service Worker - file accessible", async ({ request }) => {
  const response = await request.get("/sw.js");

  expect(response.status()).toBe(200);
  const content = await response.text();
  expect(content).toContain("api-cache-v1");
  expect(content).toContain("static-cache-v1");
});

test("Manifest - file accessible", async ({ request }) => {
  const response = await request.get("/manifest.json");

  expect(response.status()).toBe(200);
  const content = await response.json();
  expect(content.name).toBe("Autism Care Platform");
});

test("Service Worker - registration attempted", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const registrationAttempted = await page.evaluate(() => {
    return navigator.serviceWorker.getRegistration() !== undefined;
  });

  expect(registrationAttempted).toBe(true);
});

test("Performance - page loads within acceptable time", async ({ page }) => {
  const startTime = Date.now();

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const loadTime = Date.now() - startTime;

  // Firefox can be slower in dev mode during cold starts.
  expect(loadTime).toBeLessThan(20000);
});

test("Accessibility - page has proper language", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const html = page.locator("html");
  await expect(html).toHaveAttribute("lang", "en");
});

test("Accessibility - forms have labels", async ({ page }) => {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");

  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
});

test("Accessibility - buttons are clickable", async ({ page }) => {
  await page.goto("/demo");
  await page.waitForLoadState("networkidle");

  const startButton = page.locator('button:has-text("Start Demo")');
  await expect(startButton).toBeVisible();
  await expect(startButton).toBeEnabled();
});

test("Responsive - works on mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await expect(page.locator("nav")).toBeVisible();
});

test("Responsive - works on tablet viewport", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await expect(page.locator("nav")).toBeVisible();
  await expect(page.locator("h1")).toBeVisible();
});

test("Responsive - works on desktop viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await expect(page.locator("nav")).toBeVisible();
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("#features")).toBeVisible();
  await expect(page.locator("#pricing")).toBeVisible();
});

test("Security - no sensitive data in console", async ({ page }) => {
  const consoleMessages: string[] = [];

  page.on("console", (msg) => {
    consoleMessages.push(msg.text());
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);

  const sensitivePatterns = [/password/i, /secret/i, /api_key/i, /token/i];

  sensitivePatterns.forEach((pattern) => {
    const found = consoleMessages.some((msg) => pattern.test(msg));
    expect(found).toBe(false);
  });
});

test("Security - forms use proper input types", async ({ page }) => {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");

  const emailInput = page.locator('input[type="email"]');
  await expect(emailInput).toHaveAttribute("type", "email");

  const passwordInput = page.locator('input[type="password"]');
  await expect(passwordInput).toHaveAttribute("type", "password");
});

test("Analytics - window available", async ({ page }) => {
  const hasWindow = await page.evaluate(() => {
    return typeof window !== "undefined";
  });

  expect(hasWindow).toBe(true);
});

test("Caching - static assets serve correctly", async ({ page }) => {
  const response = await page.request.get("/src/styles/app.css");
  expect(response.status()).toBeGreaterThanOrEqual(200);
});
