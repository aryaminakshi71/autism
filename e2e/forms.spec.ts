import { expect, test } from "@playwright/test";

test.describe("Form Interactions E2E", () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      window.localStorage.setItem("demo_mode", "true");
      window.localStorage.setItem("isDemo", "true");
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          id: "demo-user",
          email: "demo@autism.app",
          name: "Demo User",
        }),
      );
    });
  });

  test("patients search filters the table", async ({ page }) => {
    await page.goto("/dashboard/patients");
    await page.waitForLoadState("networkidle");

    const tbody = page.locator("tbody");
    await expect(tbody).toContainText("Emma Johnson");

    const search = page.getByPlaceholder("Search patients...");
    await expect(search).toBeVisible();
    await search.click();
    await search.fill("Noah");
    await expect(search).toHaveValue("Noah");

    await expect(tbody).toContainText("Noah Martinez");
    await expect(tbody).not.toContainText("Emma Johnson");
  });

  test("goals status filter shows mastered goals", async ({ page }) => {
    await page.goto("/dashboard/goals");
    await page.waitForLoadState("networkidle");

    const statusFilter = page.locator("select");
    await expect(statusFilter).toBeVisible();
    await statusFilter.selectOption("mastered");

    await expect(
      page.getByText("Picture exchange communication"),
    ).toBeVisible();
    await expect(page.getByText("Turn-taking in games")).toHaveCount(0);
  });

  test("sessions status filter shows completed sessions", async ({ page }) => {
    await page.goto("/dashboard/sessions");
    await page.waitForLoadState("networkidle");

    const statusFilter = page.locator("select");
    await expect(statusFilter).toBeVisible();
    await statusFilter.selectOption("completed");

    const tbody = page.locator("tbody");
    await expect(tbody.locator('td:has-text("completed")')).toBeVisible();
    await expect(tbody.locator('td:has-text("scheduled")')).toHaveCount(0);
  });
});
