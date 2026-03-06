import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const host = process.env.HOST ?? "127.0.0.1";
const port = Number(process.env.LIGHTHOUSE_PORT ?? 3120);
const baseUrl = `http://${host}:${port}`;
const outputDir = path.resolve("test-results/lighthouse");
const budgetPath = path.resolve("scripts/qa/lighthouse-budget.json");

const thresholds = {
  desktop: {
    performance: 0.8,
    accessibility: 0.9,
    bestPractices: 0.85,
    seo: 0.85,
    lcpMs: 3000,
  },
  mobile: {
    performance: 0.3,
    accessibility: 0.85,
    bestPractices: 0.8,
    seo: 0.8,
    lcpMs: 50_000,
  },
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 120_000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url, {
        headers: { "x-api-version": "1" },
      });
      if (response.status < 500) return;
    } catch {
      // retry
    }
    await sleep(1000);
  }

  throw new Error(`Timed out waiting for server at ${url}`);
}

function runLighthouse(label, options = []) {
  const chromePath = chromium.executablePath();
  const outputPath = path.join(outputDir, `${label}.json`);

  const args = [
    "lighthouse",
    baseUrl,
    `--chrome-path=${chromePath}`,
    `--output-path=${outputPath}`,
    "--output=json",
    "--quiet",
    `--budget-path=${budgetPath}`,
    "--chrome-flags=--headless=new --no-sandbox --disable-gpu",
    ...options,
  ];

  execFileSync("bunx", args, { stdio: "inherit" });
  return outputPath;
}

function toPercent(score) {
  return Math.round(score * 100);
}

function evaluateReport(label, reportPath, limits) {
  const report = JSON.parse(readFileSync(reportPath, "utf8"));
  const categories = report.categories ?? {};
  const lcp = report.audits?.["largest-contentful-paint"]?.numericValue ?? 0;

  const scores = {
    performance: categories.performance?.score ?? 0,
    accessibility: categories.accessibility?.score ?? 0,
    bestPractices: categories["best-practices"]?.score ?? 0,
    seo: categories.seo?.score ?? 0,
    lcpMs: lcp,
  };

  console.log(
    `${label} scores -> perf:${toPercent(scores.performance)} a11y:${toPercent(scores.accessibility)} best:${toPercent(scores.bestPractices)} seo:${toPercent(scores.seo)} lcp:${Math.round(scores.lcpMs)}ms`,
  );

  const failures = [];

  if (scores.performance < limits.performance) {
    failures.push(
      `${label} performance ${toPercent(scores.performance)} < ${toPercent(limits.performance)}`,
    );
  }
  if (scores.accessibility < limits.accessibility) {
    failures.push(
      `${label} accessibility ${toPercent(scores.accessibility)} < ${toPercent(limits.accessibility)}`,
    );
  }
  if (scores.bestPractices < limits.bestPractices) {
    failures.push(
      `${label} best-practices ${toPercent(scores.bestPractices)} < ${toPercent(limits.bestPractices)}`,
    );
  }
  if (scores.seo < limits.seo) {
    failures.push(`${label} seo ${toPercent(scores.seo)} < ${toPercent(limits.seo)}`);
  }
  if (scores.lcpMs > limits.lcpMs) {
    failures.push(`${label} LCP ${Math.round(scores.lcpMs)}ms > ${limits.lcpMs}ms`);
  }

  return failures;
}

async function main() {
  if (!existsSync(budgetPath)) {
    throw new Error(`Missing Lighthouse budget file: ${budgetPath}`);
  }

  mkdirSync(outputDir, { recursive: true });

  const server = spawn("bun", ["run", "dev:web"], {
    env: {
      ...process.env,
      SKIP_CLOUDFLARE: "true",
      DISABLE_TANSTACK_DEVTOOLS: "true",
      HOST: host,
      PORT: String(port),
    },
    stdio: "inherit",
  });

  try {
    await waitForServer(baseUrl);

    const desktopReport = runLighthouse("desktop", ["--preset=desktop"]);
    const mobileReport = runLighthouse("mobile");

    const failures = [
      ...evaluateReport("desktop", desktopReport, thresholds.desktop),
      ...evaluateReport("mobile", mobileReport, thresholds.mobile),
    ];

    if (failures.length > 0) {
      console.error("Lighthouse quality gate failed:");
      for (const failure of failures) {
        console.error(`- ${failure}`);
      }
      process.exit(1);
    }

    console.log("Lighthouse quality gate passed.");
  } finally {
    server.kill("SIGTERM");
    await sleep(2000);
    if (server.exitCode === null) {
      server.kill("SIGKILL");
    }
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
