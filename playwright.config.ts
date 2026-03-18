import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PORT ?? "3020");
const host = process.env.HOST ?? "localhost";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://${host}:${port}`;

export default defineConfig({
  timeout: 60_000,
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : Number(process.env.PW_WORKERS ?? "2"),
  expect: {
    timeout: 10_000,
  },
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["json", { outputFile: "test-results.json" }],
  ],
  use: {
    baseURL,
    navigationTimeout: 60_000,
    actionTimeout: 30_000,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 12"] },
    },
  ],
  webServer: {
    // Start only the web app; it already serves /api/* via integrated server routes.
    command: `SKIP_CLOUDFLARE=true DISABLE_TANSTACK_DEVTOOLS=true HOST=${host} PORT=${port} bun run dev:web`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
    gracefulShutdown: {
      signal: "SIGTERM",
      timeout: 10_000,
    },
  },
});
