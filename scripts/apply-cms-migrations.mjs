/**
 * Apply pending CMS database migrations (events cover_image, news published_by).
 *
 * Usage:
 *   node --env-file=.env.local scripts/apply-cms-migrations.mjs
 */

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const databaseUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;

const CMS_MIGRATIONS = [
  "20260616_events_cover_image.sql",
  "20260616_news_published_by.sql",
];

if (!databaseUrl) {
  console.error(
    "Missing DATABASE_URL or SUPABASE_DB_URL in .env.local.\n" +
      "Run the SQL files in supabase/migrations/ via the Supabase SQL editor instead.",
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

await client.connect();
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
