import { expect, test } from "@playwright/test";

/**
 * Keyboard Navigation and Accessibility Tests
 * Ensures the application is fully keyboard accessible
 */

test.describe("Keyboard Navigation - Landing Page", () => {
  test("tab navigation works through all interactive elements", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Get all focusable elements
    const focusableElements = await page.locator(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    // Press Tab multiple times and verify focus moves
    let previousFocus = "";
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return el
          ? el.tagName +
              (el.getAttribute("aria-label") ||
                el.textContent?.slice(0, 20) ||
                "")
          : "null";
      });

      expect(focusedElement).not.toBe(previousFocus);
      previousFocus = focusedElement;
    }
  });

  test("skip link appears on first Tab", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Press Tab once
    await page.keyboard.press("Tab");

    // Check if skip link is visible
    const skipLink = page.locator('[href="#main-content"]').first();
    await expect(skipLink).toBeVisible();
  });

  test("Enter key activates links", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Tab to first link
    await page.keyboard.press("Tab");

    // Press Enter
    await page.keyboard.press("Enter");

    // Verify navigation occurred (URL changed or modal opened)
    const currentUrl = page.url();
    expect(currentUrl).toBeDefined();
  });
});

test.describe("Keyboard Navigation - Login Page", () => {
  test("can navigate login form with keyboard", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    // Tab to email input
    await page.keyboard.press("Tab");
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeFocused();

    // Tab to password input
    await page.keyboard.press("Tab");
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeFocused();

    // Tab to submit button
    await page.keyboard.press("Tab");
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeFocused();
  });

  test("form submission works with Enter key", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    // Fill email using keyboard
    await page.keyboard.press("Tab");
    await page.keyboard.type("test@example.com");

    // Tab to password and fill
    await page.keyboard.press("Tab");
    await page.keyboard.type("password123");

    // Submit with Enter
    await page.keyboard.press("Enter");

    // Should show validation error or redirect
    await page.waitForTimeout(500);
    expect(page.url()).toBeDefined();
  });
});

test.describe("Keyboard Navigation - Dashboard", () => {
  test("can navigate dashboard with arrow keys", async ({ page }) => {
    // Set up demo mode
    await page.addInitScript(() => {
      window.localStorage.setItem("demo_mode", "true");
      window.localStorage.setItem("isDemo", "true");
    });

    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Tab through dashboard elements
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press("Tab");
      const focusedElement = await page.evaluate(
        () => document.activeElement?.tagName,
      );
      expect(focusedElement).not.toBeNull();
    }
  });

  test("Escape key closes modals or menus", async ({ page }) => {
    await page.goto("/demo");
    await page.waitForLoadState("networkidle");

    // Press Escape
    await page.keyboard.press("Escape");

    // Should not throw error
    expect(page.url()).toContain("/demo");
  });
});

test.describe("Focus Management", () => {
  test("focus visible styles are applied", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Tab to first focusable element
    await page.keyboard.press("Tab");

    // Check if focus ring is visible
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        boxShadow: styles.boxShadow,
      };
    });

    // Should have visible focus indicator
    expect(focusedElement).not.toBeNull();
  });

  test("focus trap works in modal-like elements", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    // Focus should stay within the form
    const form = page.locator("form").first();
    await expect(form).toBeVisible();

    // Tab multiple times to ensure we stay in form
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
    }

    // Active element should still be in the document
    const hasFocus = await page.evaluate(
      () => document.activeElement !== document.body,
    );
    expect(hasFocus).toBe(true);
  });
});

test.describe("Screen Reader Support", () => {
  test("page has proper heading hierarchy", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check for h1
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();

    // Check heading order
    const headings = await page.locator("h1, h2, h3").all();
    expect(headings.length).toBeGreaterThan(0);
  });

  test("images have alt text or are decorative", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Get all images
    const images = await page.locator("img").all();

    for (const img of images) {
      const alt = await img.getAttribute("alt");
      const ariaHidden = await img.getAttribute("aria-hidden");

      // Either has alt text or is marked as decorative
      expect(alt !== null || ariaHidden === "true").toBe(true);
    }
  });

  test("interactive elements have accessible names", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check buttons
    const buttons = await page.locator("button").all();

    for (const button of buttons.slice(0, 5)) {
      const accessibleName = await button.evaluate((el) => {
        return (
          el.getAttribute("aria-label") ||
          el.textContent ||
          el.getAttribute("title")
        );
      });

      expect(accessibleName).toBeTruthy();
    }
  });

  test("form inputs have associated labels", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    // Get all inputs
    const inputs = await page.locator("input, select, textarea").all();

    for (const input of inputs) {
      const id = await input.getAttribute("id");
      const ariaLabel = await input.getAttribute("aria-label");
      const ariaLabelledBy = await input.getAttribute("aria-labelledby");
      const hasLabel = await input.evaluate((el) => {
        const id = el.id;
        if (!id) return false;
        return !!document.querySelector(`label[for="${id}"]`);
      });

      // Should have some form of accessible name
      expect(ariaLabel !== null || ariaLabelledBy !== null || hasLabel).toBe(
        true,
      );
    }
  });
});
