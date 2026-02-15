import { expect, test } from "@playwright/test";

test.describe("Navigation E2E Tests", () => {
  test("should navigate to main public pages", async ({ page }) => {
    const routes = ["/", "/login", "/register", "/demo", "/reserve"];

    for (const route of routes) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page).toHaveURL(new RegExp(`${route.replace("/", "\\/")}`));
    }

    await page.goto("/reserve", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { name: /Find parking in seconds/i }),
    ).toBeVisible();
  });

  test("should navigate through dashboard pages in demo mode", async ({
    page,
  }) => {
    test.setTimeout(180_000);
    await page.addInitScript(() => {
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

    await page.setViewportSize({ width: 1280, height: 800 });

    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { name: "Dashboard", exact: true }),
    ).toBeVisible({ timeout: 30000 });

    const nav = [
      { label: "Patients", title: "Patients" },
      { label: "Goals", title: "Goals & Progress" },
      { label: "Sessions", title: "Sessions" },
      { label: "Visual Schedules", title: "Visual Schedules" },
      { label: "Communication", title: "Communication Boards" },
      { label: "Assessments", title: "Assessments & Screeners" },
      { label: "Analytics", title: "Analytics" },
      { label: "Settings", title: "Settings" },
    ];

    for (const item of nav) {
      await page.getByRole("link", { name: item.label }).click();
      await expect(
        page.getByRole("heading", { name: item.title, exact: true }),
      ).toBeVisible({ timeout: 30000 });
    }
  });
});
