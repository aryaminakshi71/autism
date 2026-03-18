import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required to roll back.");
  process.exit(1);
}

const backupDir = path.resolve("drizzle/backups");
if (!existsSync(backupDir)) {
  console.error(
    `Backup directory does not exist: ${backupDir}. Run db:backup:pre-migrate first.`,
  );
  process.exit(1);
}

const backups = readdirSync(backupDir)
  .filter((file) => file.endsWith("-pre-autism-schema-transition.sql"))
  .sort();

if (backups.length === 0) {
  console.error(
    `No pre-migration backups found in ${backupDir}. Run db:backup:pre-migrate first.`,
  );
  process.exit(1);
}

const latest = path.join(backupDir, backups[backups.length - 1]);

try {
  execFileSync("psql", [databaseUrl, "-v", "ON_ERROR_STOP=1", "-f", latest], {
    stdio: "inherit",
  });

  console.log(`Rollback restored from latest backup: ${latest}`);
} catch (error) {
  console.error("Rollback failed while restoring backup.");
  if (error instanceof Error) {
    console.error(error.message);
  }
  process.exit(1);
}
