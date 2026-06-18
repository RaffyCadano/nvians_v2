/**
 * Apply pending CMS database migrations (events cover_image, news published_by).
 *
 * Usage:
 *   node --env-file=.env.local scripts/apply-cms-migrations.mjs
 */

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const databaseUrl =
  process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;

const CMS_MIGRATIONS = [
  "20260616_events_cover_image.sql",
  "20260616_news_published_by.sql",
  "20260619_events_is_published.sql",
];

if (!databaseUrl) {
  console.error(
    "Missing DATABASE_URL or SUPABASE_DB_URL in .env.local.\n\n" +
      "Run this file in Supabase SQL Editor instead:\n" +
      "  scripts/cms-db-setup.sql\n",
  );
  process.exit(1);
}

let pg;
try {
  ({ default: pg } = await import("pg"));
} catch {
  console.error(
    "Optional dependency 'pg' is not installed.\n" +
      "Run: npm install pg\n" +
      "Or apply migrations manually in the Supabase SQL editor.",
  );
  process.exit(1);
}

const migrationsDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "supabase",
  "migrations",
);

const available = new Set(readdirSync(migrationsDir));
const client = new pg.Client({ connectionString: databaseUrl });

try {
  await client.connect();
} catch (error) {
  if (error instanceof Error && "code" in error && error.code === "28P01") {
    console.error(
      "Database password in .env.local is incorrect.\n\n" +
        "Fix DATABASE_URL, or run this in Supabase SQL Editor:\n" +
        "  scripts/cms-db-setup.sql\n",
    );
    process.exit(1);
  }
  throw error;
}

try {
  for (const file of CMS_MIGRATIONS) {
    if (!available.has(file)) {
      console.warn(`Skipping missing migration: ${file}`);
      continue;
    }
    const sql = readFileSync(join(migrationsDir, file), "utf8");
    await client.query(sql);
    console.log(`Applied ${file}`);
  }
  console.log("CMS database migrations complete.");
} finally {
  await client.end();
}
