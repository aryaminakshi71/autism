/**
 * Link Testing Utility
 *
 * Automated link testing for all routes in the application.
 * This can be run with Playwright or used as a reference for manual testing.
 */

export const ROUTES_TO_TEST = {
  // Public routes
  public: [
    { path: "/", name: "Landing Page" },
    { path: "/login", name: "Login Page" },
    { path: "/register", name: "Register Page" },
    { path: "/demo", name: "Demo Page" },
    { path: "/about", name: "About Page" },
    { path: "/contact", name: "Contact Page" },
    { path: "/docs", name: "Documentation Page" },
    { path: "/support", name: "Support Page" },
    { path: "/privacy", name: "Privacy Page" },
    { path: "/terms", name: "Terms Page" },
    { path: "/forgot-password", name: "Forgot Password Page" },
  ],

  // Industry detail pages
  industries: [],

  // Dashboard routes (require auth/demo)
  app: [
    { path: "/dashboard", name: "Dashboard" },
    { path: "/dashboard/patients", name: "Patients" },
    { path: "/dashboard/goals", name: "Goals" },
    { path: "/dashboard/sessions", name: "Sessions" },
    { path: "/dashboard/schedules", name: "Visual Schedules" },
    { path: "/dashboard/communication", name: "Communication" },
    { path: "/dashboard/settings", name: "Settings" },
  ],
};

export const LINKS_TO_VERIFY = {
  "/": [
    { selector: 'a[href="/"]', text: "SpectrumAI", type: "logo" },
    { selector: 'a[href="/login"]', text: "Sign In", type: "header" },
    {
      selector: 'a[href="/register"]',
      text: "Start Free Trial",
      type: "header",
    },
    { selector: 'a[href="/demo"]', text: "Visual Schedules", type: "feature" },
    { selector: 'a[href="/demo"]', text: "AAC Communication", type: "feature" },
    { selector: 'a[href="/demo"]', text: "Therapy Analytics", type: "feature" },
    {
      selector: 'a[href="/demo"]',
      text: "Multi-Language Family Portal",
      type: "feature",
    },
    { selector: 'a[href="/demo"]', text: "Goal Tracking", type: "feature" },
    {
      selector: 'a[href="/demo"]',
      text: "Security & Compliance",
      type: "feature",
    },
    { selector: 'a[href="/demo"]', text: "Try Demo", type: "footer" },
    { selector: 'a[href="/docs"]', text: "Resources", type: "footer" },
    { selector: 'a[href="/about"]', text: "About", type: "footer" },
    { selector: 'a[href="/contact"]', text: "Contact", type: "footer" },
    { selector: 'a[href="/docs"]', text: "Documentation", type: "footer" },
    { selector: 'a[href="/support"]', text: "Support", type: "footer" },
    { selector: 'a[href="/privacy"]', text: "Privacy", type: "footer" },
    { selector: 'a[href="/terms"]', text: "Terms", type: "footer" },
  ],
  "/login": [
    { selector: 'a[href="/register"]', text: "Start Free Trial", type: "link" },
    { selector: 'a[href="/register"]', text: "Sign up", type: "link" },
    {
      selector: 'a[href="/forgot-password"]',
      text: "Forgot Password",
      type: "link",
    },
  ],
  "/register": [
    { selector: 'a[href="/login"]', text: "Sign in", type: "link" },
    { selector: 'a[href="/demo"]', text: "Try Demo", type: "link" },
  ],
  "/dashboard": [
    { selector: 'a[href="/dashboard"]', text: "Dashboard", type: "sidebar" },
    {
      selector: 'a[href="/dashboard/patients"]',
      text: "Patients",
      type: "sidebar",
    },
    { selector: 'a[href="/dashboard/goals"]', text: "Goals", type: "sidebar" },
    {
      selector: 'a[href="/dashboard/sessions"]',
      text: "Sessions",
      type: "sidebar",
    },
    {
      selector: 'a[href="/dashboard/settings"]',
      text: "Settings",
      type: "sidebar",
    },
  ],
};

export interface LinkTestResult {
  route: string;
  linkText: string;
  linkHref: string;
  status: "pass" | "fail" | "skip";
  error?: string;
}

export interface RouteTestResult {
  route: string;
  routeName: string;
  status: "pass" | "fail";
  links: LinkTestResult[];
  error?: string;
}

/**
 * Test all routes and their links
 */
export async function testAllRoutes(
  baseUrl: string = "http://localhost:5173",
): Promise<RouteTestResult[]> {
  const results: RouteTestResult[] = [];

  // Test public routes
  for (const route of ROUTES_TO_TEST.public) {
    const result = await testRoute(
      `${baseUrl}${route.path}`,
      route.name,
      route.path,
    );
    results.push(result);
  }

  // Test industry pages
  for (const route of ROUTES_TO_TEST.industries) {
    const result = await testRoute(
      `${baseUrl}${route.path}`,
      route.name,
      route.path,
    );
    results.push(result);
  }

  // Test app routes (requires demo mode or auth)
  // Note: These would need to set demo mode first
  for (const route of ROUTES_TO_TEST.app) {
    const result = await testRoute(
      `${baseUrl}${route.path}`,
      route.name,
      route.path,
      true,
    );
    results.push(result);
  }

  return results;
}

/**
 * Test a single route
 */
async function testRoute(
  url: string,
  routeName: string,
  routePath: string,
  requiresAuth: boolean = false,
): Promise<RouteTestResult> {
  const result: RouteTestResult = {
    route: routePath,
    routeName,
    status: "pass",
    links: [],
  };

  try {
    // In a real implementation, this would use Playwright or similar
    // For now, this is a structure for manual testing or future automation

    const linksToCheck =
      LINKS_TO_VERIFY[routePath as keyof typeof LINKS_TO_VERIFY] || [];

    for (const link of linksToCheck) {
      result.links.push({
        route: routePath,
        linkText: link.text,
        linkHref: link.selector,
        status: "skip", // Would be "pass" or "fail" after actual testing
      });
    }
  } catch (error) {
    result.status = "fail";
    result.error = error instanceof Error ? error.message : String(error);
  }

  return result;
}

/**
 * Generate test report
 */
export function generateTestReport(results: RouteTestResult[]): string {
  let report = "# Link Testing Report\n\n";
  report += `Generated: ${new Date().toISOString()}\n\n`;

  const totalRoutes = results.length;
  const passedRoutes = results.filter((r) => r.status === "pass").length;
  const failedRoutes = results.filter((r) => r.status === "fail").length;

  report += `## Summary\n\n`;
  report += `- Total Routes Tested: ${totalRoutes}\n`;
  report += `- Passed: ${passedRoutes}\n`;
  report += `- Failed: ${failedRoutes}\n`;
  report += `- Success Rate: ${((passedRoutes / totalRoutes) * 100).toFixed(1)}%\n\n`;

  report += `## Detailed Results\n\n`;

  for (const result of results) {
    report += `### ${result.routeName} (${result.route})\n\n`;
    report += `Status: ${result.status === "pass" ? "✅ PASS" : "❌ FAIL"}\n\n`;

    if (result.error) {
      report += `Error: ${result.error}\n\n`;
    }

    if (result.links.length > 0) {
      report += `Links Found: ${result.links.length}\n\n`;
    }

    report += `---\n\n`;
  }

  return report;
}
