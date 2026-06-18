/**
 * Add published_by column to news articles.
 *
 * Usage:
 *   node --env-file=.env.local scripts/apply-news-published-by.mjs
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const databaseUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;

if (!databaseUrl) {
  console.error(
    "Missing DATABASE_URL or SUPABASE_DB_URL in .env.local.\n" +
      "Alternatively, run supabase/migrations/20260616_news_published_by.sql in the Supabase SQL editor.",
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
      "Or run supabase/migrations/20260616_news_published_by.sql in the Supabase SQL editor.",
  );
  process.exit(1);
}

const migrationPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "supabase",
  "migrations",
  "20260616_news_published_by.sql",
);
const sql = readFileSync(migrationPath, "utf8");
const client = new pg.Client({ connectionString: databaseUrl });

await client.connect();
try {
  await client.query(sql);
  console.log("Applied news published_by migration.");
} finally {
  await client.end();
}
