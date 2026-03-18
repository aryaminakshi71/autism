import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required to restore a backup.");
  process.exit(1);
}

const input = process.argv[2];
if (!input) {
  console.error("Usage: node scripts/db/restore-backup.mjs <backup-file.sql>");
  process.exit(1);
}

const backupFile = path.resolve(input);
if (!existsSync(backupFile)) {
  console.error(`Backup file not found: ${backupFile}`);
  process.exit(1);
}

try {
  execFileSync(
    "psql",
    [databaseUrl, "-v", "ON_ERROR_STOP=1", "-f", backupFile],
    { stdio: "inherit" },
  );

  console.log(`Restore complete from: ${backupFile}`);
} catch (error) {
  console.error(
    "Restore failed. Ensure `psql` is installed and access is valid.",
  );
  if (error instanceof Error) {
    console.error(error.message);
  }
  process.exit(1);
}
