import { defineConfig, devices } from '@playwright/test'

const port = Number(process.env.PORT ?? '3000')
const host = process.env.HOST ?? '127.0.0.1'
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ?? `http://${host}:${port}`

export default defineConfig({
  timeout: 60_000,
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  expect: {
    timeout: 10_000,
  },
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
  ],
  use: {
    baseURL,
    navigationTimeout: 60_000,
    actionTimeout: 30_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    // Ensure Playwright can bring up the app in environments where :3000 is busy.
    command: `SKIP_CLOUDFLARE=true HOST=${host} PORT=${port} bun run dev`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
})
