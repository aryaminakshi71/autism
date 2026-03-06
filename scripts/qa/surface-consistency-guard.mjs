import { existsSync, readFileSync } from "node:fs";

const checks = [];

const canonicalRouteTree = "apps/web/src/routeTree.gen.ts";
const deprecatedRouteTree = "apps/web/src/routes/routeTree.gen.ts";
const tsrConfig = "apps/web/tsr.config.json";
const routerFile = "apps/web/src/router.tsx";
const playwrightConfig = "playwright.config.ts";
const headerFile = "apps/web/src/components/header.tsx";
const loginFile = "apps/web/src/routes/login.tsx";
const registerFile = "apps/web/src/routes/register.tsx";
const rootFile = "apps/web/src/routes/__root.tsx";
const appRouteFile = "apps/web/src/routes/app.tsx";

if (!existsSync(canonicalRouteTree)) {
  checks.push(`Missing canonical route tree: ${canonicalRouteTree}`);
}

if (existsSync(deprecatedRouteTree)) {
  checks.push(`Deprecated duplicate route tree exists: ${deprecatedRouteTree}`);
}

if (existsSync(tsrConfig)) {
  const raw = readFileSync(tsrConfig, "utf8");
  if (!raw.includes('"generatedRouteTree": "./src/routeTree.gen.ts"')) {
    checks.push(
      `${tsrConfig} must generate to ./src/routeTree.gen.ts (single source of truth).`,
    );
  }
}

if (existsSync(routerFile)) {
  const raw = readFileSync(routerFile, "utf8");
  if (!raw.includes("from \"./routeTree.gen\"")) {
    checks.push(`${routerFile} should import route tree from ./routeTree.gen.`);
  }
}

if (existsSync(playwrightConfig)) {
  const raw = readFileSync(playwrightConfig, "utf8");
  if (!raw.includes("bun run dev:web")) {
    checks.push(
      `${playwrightConfig} should target apps/web as the canonical frontend surface.`,
    );
  }
}

if (existsSync(headerFile)) {
  const raw = readFileSync(headerFile, "utf8");
  if (!raw.includes('to="/dashboard"')) {
    checks.push(`${headerFile} should route demo entry points to /dashboard.`);
  }
  if (raw.includes('to="/app"') || raw.includes('to: "/app"')) {
    checks.push(`${headerFile} must not route users to legacy /app paths.`);
  }
}

if (existsSync(loginFile)) {
  const raw = readFileSync(loginFile, "utf8");
  if (!raw.includes('redirect || "/dashboard"')) {
    checks.push(`${loginFile} should default post-login redirect to /dashboard.`);
  }
}

if (existsSync(registerFile)) {
  const raw = readFileSync(registerFile, "utf8");
  if (!raw.includes('redirect || "/dashboard"')) {
    checks.push(
      `${registerFile} should default post-registration redirect to /dashboard.`,
    );
  }
}

if (existsSync(rootFile)) {
  const raw = readFileSync(rootFile, "utf8");
  if (!raw.includes('href="/dashboard"')) {
    checks.push(`${rootFile} quick dashboard link should point to /dashboard.`);
  }
}

if (existsSync(appRouteFile)) {
  const raw = readFileSync(appRouteFile, "utf8");
  if (!raw.includes('redirect({ to: "/dashboard" })')) {
    checks.push(
      `${appRouteFile} should redirect legacy /app surface to /dashboard.`,
    );
  }
}

if (checks.length > 0) {
  console.error("Surface-consistency guard failed:");
  for (const item of checks) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log("Surface-consistency guard passed.");
