import { expect, test } from "@playwright/test";

/**
 * Visual Regression Tests
 * These tests capture screenshots of key pages and components
 * to detect unintended visual changes.
 */

test.describe("Visual Regression - Landing Page", () => {
  test("landing page full screenshot", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Take full page screenshot
    await expect(page).toHaveScreenshot("landing-full.png", {
      fullPage: true,
    });
  });

  test("landing page above the fold", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Take viewport screenshot
    await expect(page).toHaveScreenshot("landing-viewport.png");
  });

  test("landing page mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("landing-mobile.png");
  });
});

test.describe("Visual Regression - Login Page", () => {
  test("login page screenshot", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("login-page.png");
  });
});

test.describe("Visual Regression - Demo Page", () => {
  test("demo page screenshot", async ({ page }) => {
    await page.goto("/demo");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("demo-page.png");
  });
});

test.describe("Visual Regression - Dashboard", () => {
  test("dashboard page in demo mode", async ({ page }) => {
    // Set up demo mode
    await page.addInitScript(() => {
      window.localStorage.setItem("demo_mode", "true");
      window.localStorage.setItem("isDemo", "true");
    });

    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("dashboard-demo.png");
  });
});

test.describe("Visual Regression - Component States", () => {
  test("button variants", async ({ page }) => {
    await page.goto("/demo");
    await page.waitForLoadState("networkidle");

    // Test various button states
    const button = page.locator('button:has-text("Start Demo")');
    await expect(button).toHaveScreenshot("button-primary.png");

    // Hover state
    await button.hover();
    await expect(button).toHaveScreenshot("button-primary-hover.png");
  });
});
