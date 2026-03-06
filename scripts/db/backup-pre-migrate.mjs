import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required to create a backup.");
  process.exit(1);
}

const backupDir = path.resolve("drizzle/backups");
mkdirSync(backupDir, { recursive: true });

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupFile = path.join(
  backupDir,
  `${timestamp}-pre-autism-schema-transition.sql`,
);

try {
  execFileSync(
    "pg_dump",
    [
      "--no-owner",
      "--no-privileges",
      "--format=plain",
      "--file",
      backupFile,
      databaseUrl,
    ],
    { stdio: "inherit" },
  );

  console.log(`Backup created: ${backupFile}`);
} catch (error) {
  console.error(
    "Backup failed. Ensure `pg_dump` is installed and DATABASE_URL is reachable.",
  );
  if (error instanceof Error) {
    console.error(error.message);
  }
  process.exit(1);
}
