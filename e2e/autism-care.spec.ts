import { expect, test } from "@playwright/test";

test.describe("Autism Care Platform", () => {
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

  test.describe("Dashboard", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");
    });

    test("should display dashboard stats", async ({ page }) => {
      await expect(page.locator("text=Active Patients")).toBeVisible();
      await expect(page.locator("text=Goals in Progress")).toBeVisible();
      await expect(page.locator("text=Sessions This Week")).toBeVisible();
      await expect(page.locator("text=Assessments Due")).toBeVisible();
    });

    test("should display recent progress section", async ({ page }) => {
      await expect(page.locator("text=Recent Progress")).toBeVisible();
      await expect(page.getByText("Emma Johnson").first()).toBeVisible();
    });

    test("should display upcoming sessions section", async ({ page }) => {
      await expect(page.locator("text=Upcoming Sessions")).toBeVisible();
      await expect(page.getByText("Liam Williams").first()).toBeVisible();
    });
  });

  test.describe("Patients", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/dashboard/patients");
      await page.waitForLoadState("networkidle");
    });

    test("should display patients page", async ({ page }) => {
      await expect(page.locator('h1:has-text("Patients")')).toBeVisible();
    });

    test("should have search functionality", async ({ page }) => {
      const searchInput = page.locator('input[placeholder*="Search patients"]');
      await expect(searchInput).toBeVisible();
    });

    test("should display patients table", async ({ page }) => {
      await expect(page.getByText("Emma Johnson").first()).toBeVisible();
      await expect(page.getByText("Liam Williams").first()).toBeVisible();
    });

    test("should have Add Patient button", async ({ page }) => {
      await expect(page.locator("text=Add Patient")).toBeVisible();
    });
  });

  test.describe("Goals", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/dashboard/goals");
      await page.waitForLoadState("networkidle");
    });

    test("should display goals page", async ({ page }) => {
      await expect(
        page.locator('h1:has-text("Goals & Progress")'),
      ).toBeVisible();
    });

    test("should display goal cards with progress", async ({ page }) => {
      await expect(page.locator("text=Increase eye contact")).toBeVisible();
      await expect(page.getByText("Emma Johnson").first()).toBeVisible();
    });

    test("should have filter functionality", async ({ page }) => {
      const statusFilter = page.locator("select");
      await expect(statusFilter).toBeVisible();
    });

    test("should have Add Goal button", async ({ page }) => {
      await expect(
        page.getByRole("button", { name: "Add Goal", exact: true }),
      ).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe("Sessions", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/dashboard/sessions");
      await page.waitForLoadState("networkidle");
    });

    test("should display sessions page", async ({ page }) => {
      await expect(page.locator('h1:has-text("Sessions")')).toBeVisible();
    });

    test("should display sessions table", async ({ page }) => {
      const tbody = page.locator("tbody");
      await expect(tbody.getByText("Emma Johnson").first()).toBeVisible();
      await expect(tbody.getByText("ABA Therapy").first()).toBeVisible();
    });

    test("should show session status badges", async ({ page }) => {
      const tbody = page.locator("tbody");
      await expect(tbody.getByText("scheduled").first()).toBeVisible();
      await expect(tbody.getByText("completed").first()).toBeVisible();
    });
  });

  test.describe("Visual Schedules", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/dashboard/schedules");
      await page.waitForLoadState("networkidle");
    });

    test("should display schedules page", async ({ page }) => {
      await expect(
        page.locator('h1:has-text("Visual Schedules")'),
      ).toBeVisible();
    });

    test("should have list and grid view toggle", async ({ page }) => {
      const toggle = page.locator("div.bg-gray-100.rounded-xl.p-1");
      await expect(toggle).toBeVisible();
      await expect(toggle.locator("button")).toHaveCount(2);
    });

    test("should display schedule items", async ({ page }) => {
      await expect(page.locator("text=Morning Routine")).toBeVisible();
      await expect(page.locator("text=Bedtime Routine")).toBeVisible();
    });
  });

  test.describe("Communication Boards", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/dashboard/communication");
      await page.waitForLoadState("networkidle");
    });

    test("should display communication page", async ({ page }) => {
      await expect(
        page.locator('h1:has-text("Communication Boards")'),
      ).toBeVisible();
    });

    test("should display category buttons", async ({ page }) => {
      await expect(
        page.getByRole("button", { name: "Core Words" }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Feelings" }),
      ).toBeVisible();
      await expect(page.getByRole("button", { name: "Actions" })).toBeVisible();
    });

    test("should display quick access symbols", async ({ page }) => {
      await expect(page.locator("text=Quick Access Symbols")).toBeVisible();
      const section = page.locator("main").filter({
        has: page.getByText("Quick Access Symbols"),
      });
      await expect(section.getByRole("button", { name: "Yes" })).toBeVisible();
      await expect(section.getByRole("button", { name: "No" })).toBeVisible();
    });
  });

  test.describe("Assessments", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/dashboard/assessments");
      await page.waitForLoadState("networkidle");
    });

    test("should display assessments page", async ({ page }) => {
      await expect(
        page.getByRole("heading", {
          name: "Assessments & Screeners",
          exact: true,
        }),
      ).toBeVisible({ timeout: 15000 });
    });

    test("should display assessment cards", async ({ page }) => {
      await expect(page.locator("text=ADOS-2")).toBeVisible();
      await expect(page.locator("text=VB-MAPP")).toBeVisible();
      await expect(page.getByText("Emma Johnson").first()).toBeVisible();
    });

    test("should have status badges", async ({ page }) => {
      await expect(
        page
          .locator("span")
          .filter({ hasText: /^scheduled$/ })
          .first(),
      ).toBeVisible();
      await expect(
        page
          .locator("span")
          .filter({ hasText: /^completed$/ })
          .first(),
      ).toBeVisible();
    });
  });

  test.describe("Navigation", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/dashboard");
      await page.waitForLoadState("networkidle");

      // On mobile viewports the sidebar is hidden by default; open it so nav links are clickable.
      const closeMenu = page.getByRole("button", {
        name: "Close navigation menu",
      });
      const isSidebarAlreadyOpen = await closeMenu
        .isVisible()
        .catch(() => false);
      if (!isSidebarAlreadyOpen) {
        const openMenu = page.getByRole("button", {
          name: "Open navigation menu",
        });
        if (await openMenu.isVisible().catch(() => false)) {
          // Some mobile engines can report the button visible even when it can't be scrolled/clicked.
          await openMenu.scrollIntoViewIfNeeded().catch(() => {});
          await openMenu.click({ force: true });
        }
      }
    });

    test("should navigate between pages", async ({ page }) => {
      await page.click('a[href="/dashboard/patients"]');
      await expect(page).toHaveURL(/\/dashboard\/patients/);
      await expect(page.locator('h1:has-text("Patients")')).toBeVisible();

      await page.click('a[href="/dashboard/goals"]');
      await expect(page).toHaveURL(/\/dashboard\/goals/);
      await expect(
        page.locator('h1:has-text("Goals & Progress")'),
      ).toBeVisible();

      await page.click('a[href="/dashboard/sessions"]');
      await expect(page).toHaveURL(/\/dashboard\/sessions/);
      await expect(page.locator('h1:has-text("Sessions")')).toBeVisible();

      await page.click('a[href="/dashboard/schedules"]');
      await expect(page).toHaveURL(/\/dashboard\/schedules/);
      await expect(
        page.locator('h1:has-text("Visual Schedules")'),
      ).toBeVisible();

      await page.click('a[href="/dashboard/communication"]');
      await expect(page).toHaveURL(/\/dashboard\/communication/);
      await expect(
        page.locator('h1:has-text("Communication Boards")'),
      ).toBeVisible();

      await page.click('a[href="/dashboard/assessments"]');
      await expect(page).toHaveURL(/\/dashboard\/assessments/);
      await expect(
        page.locator('h1:has-text("Assessments & Screeners")'),
      ).toBeVisible();
    });
  });
});
