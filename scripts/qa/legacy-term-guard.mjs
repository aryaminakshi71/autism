import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const scanScopes = [
  "apps/web/src/",
  "src/",
  "e2e/",
  ".github/workflows/",
  "README.md",
  "DOCUMENTATION.md",
];

const allowedExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".md",
  ".json",
  ".yml",
  ".yaml",
  ".css",
]);

const bannedPatterns = [
  { label: "parking", regex: /\bparking\b/gi },
  { label: "parkingpro", regex: /\bparkingpro\b/gi },
  { label: "smart parking", regex: /\bsmart\s+parking\b/gi },
  { label: "find parking", regex: /\bfind\s+parking\b/gi },
];

function shouldScan(path) {
  const inScope = scanScopes.some(
    (scope) => path === scope || path.startsWith(scope),
  );
  if (!inScope) return false;

  const lastDot = path.lastIndexOf(".");
  if (lastDot < 0) return false;
  const ext = path.slice(lastDot);
  return allowedExtensions.has(ext);
}

function lineForIndex(text, index) {
  let line = 1;
  for (let i = 0; i < index; i++) {
    if (text.charCodeAt(i) === 10) line++;
  }
  return line;
}

const files = execSync("git ls-files", { encoding: "utf8" })
  .split("\n")
  .map((x) => x.trim())
  .filter(Boolean)
  .filter(shouldScan);

const violations = [];

for (const file of files) {
  if (!existsSync(file)) continue;
  const text = readFileSync(file, "utf8");

  for (const { label, regex } of bannedPatterns) {
    for (const match of text.matchAll(regex)) {
      if (match.index == null) continue;
      violations.push({
        file,
        line: lineForIndex(text, match.index),
        label,
        value: match[0],
      });
    }
  }
}

if (violations.length > 0) {
  console.error("Legacy-term guard failed.");
  for (const violation of violations.slice(0, 200)) {
    console.error(
      `${violation.file}:${violation.line} [${violation.label}] "${violation.value}"`,
    );
  }
  process.exit(1);
}

console.log(`Legacy-term guard passed on ${files.length} files.`);
