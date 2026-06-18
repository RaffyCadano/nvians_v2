/**
 * Provision the public CMS storage bucket and policies for news cover images.
 *
 * Usage:
 *   node --env-file=.env.local scripts/setup-cms-storage.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const databaseUrl = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;

if (!url || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function ensureBucket() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    throw new Error(`Failed to list buckets: ${listError.message}`);
  }

  const exists = buckets?.some((bucket) => bucket.id === "cms" || bucket.name === "cms");
  if (exists) {
    console.log("Bucket 'cms' already exists.");
    return;
  }

  const { error } = await supabase.storage.createBucket("cms", {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  });

  if (error) {
    throw new Error(`Failed to create bucket: ${error.message}`);
  }

  console.log("Created bucket 'cms'.");
}

async function ensurePolicies() {
  if (!databaseUrl) {
    console.warn(
      "DATABASE_URL not set — bucket created, but storage policies were not applied.",
    );
    console.warn(
      "Run supabase/migrations/20260616_cms_storage_bucket.sql in the Supabase SQL editor.",
    );
    return;
  }

  let pg;
  try {
    ({ default: pg } = await import("pg"));
  } catch {
    console.warn("Optional dependency 'pg' is not installed — skipping policy SQL.");
    console.warn(
      "Run supabase/migrations/20260616_cms_storage_bucket.sql in the Supabase SQL editor.",
    );
    return;
  }

  const migrationPath = join(
    dirname(fileURLToPath(import.meta.url)),
    "..",
    "supabase",
    "migrations",
    "20260616_cms_storage_bucket.sql",
  );
  const sql = readFileSync(migrationPath, "utf8");
  const client = new pg.Client({ connectionString: databaseUrl });

  await client.connect();
  try {
    await client.query(sql);
    console.log("Applied CMS storage policies.");
  } finally {
    await client.end();
  }
}

try {
  await ensureBucket();
  await ensurePolicies();
  console.log("CMS storage is ready.");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
