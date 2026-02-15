import { expect, test } from "@playwright/test";

test.describe("Basic Application Tests", () => {
  test("Landing page loads", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const title = await page.title();
    console.log("Page title:", title);

    const hasNav = await page.locator("nav").isVisible();
    console.log("Navigation visible:", hasNav);
  });

  test("Login page loads", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    const hasEmail = await page.locator('input[type="email"]').isVisible();
    const hasPassword = await page
      .locator('input[type="password"]')
      .isVisible();

    console.log("Email input visible:", hasEmail);
    console.log("Password input visible:", hasPassword);
  });

  test("Dashboard loads", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    const content = await page.content();
    console.log("Dashboard loaded, content length:", content.length);
  });

  test("Demo page loads", async ({ page }) => {
    await page.goto("/demo");
    await page.waitForLoadState("networkidle");

    const content = await page.content();
    console.log("Demo page loaded, content length:", content.length);
  });
});
