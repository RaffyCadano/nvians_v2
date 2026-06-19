/**
 * Upload Supabase env vars to Firebase App Hosting secrets.
 *
 * Usage:
 *   node --env-file=.env.local scripts/set-apphosting-secrets.mjs
 *
 * Requires Firebase CLI login and access to the nvians project.
 */

import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const ENV_FILE = resolve(ROOT, ".env.local");
const BACKEND_ID = "db-nvians";

const SECRETS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

function loadEnvFile(path) {
  if (!existsSync(path)) return {};
  const values = {};

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }

  return values;
}

function runFirebase(args, input) {
  const result = spawnSync("npx", ["-y", "firebase-tools@latest", ...args], {
    cwd: ROOT,
    input,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    throw new Error(
      `firebase ${args.join(" ")} failed:\n${result.stdout}\n${result.stderr}`.trim()
    );
  }

  return result.stdout.trim();
}

const env = loadEnvFile(ENV_FILE);

for (const name of SECRETS) {
  const value = env[name];
  if (!value) {
    console.error(`Missing ${name} in .env.local`);
    process.exit(1);
  }

  console.log(`Setting secret ${name}...`);
  runFirebase(["apphosting:secrets:set", name, "--force"], value);
}

console.log(`Granting secret access to backend ${BACKEND_ID}...`);
runFirebase(
  [
    "apphosting:secrets:grantaccess",
    SECRETS.join(","),
    "--backend",
    BACKEND_ID,
  ],
  ""
);

console.log("App Hosting secrets are ready. Redeploy with:");
console.log("  npx -y firebase-tools@latest deploy --only apphosting");
