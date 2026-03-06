/**
 * Route Smoke Tests
 *
 * This repo previously had link tests targeting legacy `/app/*` routes.
 * These tests cover the current public + dashboard surface area.
 */

import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/demo",
  "/care-finder",
] as const;

for (const route of publicRoutes) {
  test(`public route responds (<500): ${route}`, async ({ request }) => {
    const response = await request.get(route);
    expect(response.status(), `Bad status for ${route}`).toBeLessThan(500);
  });
}

test("dashboard routes render in demo mode", async ({ page, context }) => {
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

  const routes = [
    { path: "/dashboard", title: "Dashboard" },
    { path: "/dashboard/patients", title: "Patients" },
    { path: "/dashboard/goals", title: "Goals & Progress" },
    { path: "/dashboard/sessions", title: "Sessions" },
    { path: "/dashboard/schedules", title: "Visual Schedules" },
    { path: "/dashboard/communication", title: "Communication Boards" },
    { path: "/dashboard/assessments", title: "Assessments & Screeners" },
  ] as const;

  for (const route of routes) {
    // Firefox/WebKit can be slower to hydrate on first visit in dev mode.
    test.setTimeout(120_000);
    await page.goto(route.path, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle").catch(() => {});
    await expect(page.getByRole("heading", { name: route.title })).toBeVisible({
      timeout: 60_000,
    });
  }
});
