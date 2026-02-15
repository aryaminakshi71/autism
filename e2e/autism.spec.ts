import { expect, test } from "@playwright/test";

test.describe("Autism Platform Smoke", () => {
  test("landing page loads", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("nav")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Try Demo/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Sign In/i })).toBeVisible();
  });

  test("login page renders fields", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("demo flow reaches dashboard", async ({ page }) => {
    await page.goto("/demo");
    await page.waitForLoadState("networkidle");
    const start = page.getByRole("button", { name: /Start Demo/i });
    await start.scrollIntoViewIfNeeded().catch(() => {});
    await start.click({ force: true });
    await expect(
      page.getByRole("heading", { name: "Dashboard", exact: true }),
    ).toBeVisible({ timeout: 30000 });
  });
});
