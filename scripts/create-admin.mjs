/**
 * Create a new admin (or staff) portal account.
 *
 * Usage:
 *   node --env-file=.env.local scripts/create-admin.mjs <email> <password> [full name] [role]
 *
 * Examples:
 *   node --env-file=.env.local scripts/create-admin.mjs admin@nvians.edu "YourPass123!" "Site Admin"
 *   node --env-file=.env.local scripts/create-admin.mjs staff@nvians.edu "YourPass123!" "Staff User" staff
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const email = process.argv[2]?.trim();
const password = process.argv[3];
const fullName = (process.argv[4] ?? "Admin User").trim();
const role = (process.argv[5] ?? "admin").trim();

if (!url || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

if (!email || !password) {
  console.error(
    'Usage: node --env-file=.env.local scripts/create-admin.mjs <email> <password> [full name] [role]'
  );
  process.exit(1);
}

if (!["admin", "staff"].includes(role)) {
  console.error('Role must be "admin" or "staff".');
  process.exit(1);
}

if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data: existing } = await admin.from("users").select("id, role").eq("email", email).maybeSingle();

  if (existing) {
    const { error } = await admin
      .from("users")
      .update({ role, full_name: fullName, is_active: true })
      .eq("id", existing.id);

    if (error) throw error;

    console.log(`Updated existing user to ${role}: ${email}`);
    console.log("Sign in at /auth/login with this email and your existing password.");
    return;
  }

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role },
  });

  if (authError) throw authError;

  const { error: userError } = await admin.from("users").upsert(
    {
      id: authData.user.id,
      email,
      full_name: fullName,
      role,
      is_active: true,
    },
    { onConflict: "id" }
  );

  if (userError) {
    await admin.auth.admin.deleteUser(authData.user.id);
    throw userError;
  }

  console.log(`Created ${role} account: ${email}`);
  console.log("Sign in at /auth/login, then open /dashboard.");
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
