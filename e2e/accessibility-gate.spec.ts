import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

async function expectNoCriticalA11yViolations(page: Page, label: string) {
  const result = await new AxeBuilder({ page }).analyze();
  const critical = result.violations.filter(
    (violation) => violation.impact === "critical",
  );

  const summary = critical
    .map((violation) => `${violation.id}: ${violation.help}`)
    .join("\n");

  expect(
    critical,
    `${label} has critical accessibility violations:\n${summary}`,
  ).toEqual([]);
}

test.describe("Accessibility Gate", () => {
  test("landing page has no critical accessibility violations", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expectNoCriticalA11yViolations(page, "Landing page");
  });

  test("login page has no critical accessibility violations", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await expectNoCriticalA11yViolations(page, "Login page");
  });

  test("demo page has no critical accessibility violations", async ({
    page,
  }) => {
    await page.goto("/demo");
    await page.waitForLoadState("networkidle");
    await expectNoCriticalA11yViolations(page, "Demo page");
  });

  test("dashboard has no critical accessibility violations in demo mode", async ({
    page,
    context,
  }) => {
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

    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    await expectNoCriticalA11yViolations(page, "Dashboard page");
  });
});
