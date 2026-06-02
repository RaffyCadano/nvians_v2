/**
 * Creates a mock teacher account in Supabase (auth + users + teachers).
 * Run: node --env-file=.env.local scripts/seed-mock-teacher.mjs
 */

import { createClient } from "@supabase/supabase-js";

const MOCK_TEACHER = {
  email: "teacher.mock@nvians.edu",
  password: "TeacherMock00!",
  full_name: "Maria Santos",
  employee_number: "EMP-MOCK-001",
  department: "Mathematics",
  specialization: "Algebra, Geometry",
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey || serviceRoleKey === "your_supabase_service_role_key") {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data: existing } = await admin.auth.admin.listUsers();
  const found = existing?.users?.find((u) => u.email === MOCK_TEACHER.email);

  let userId = found?.id;

  if (found) {
    console.log("Auth user already exists, updating profile rows...");
  } else {
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email: MOCK_TEACHER.email,
      password: MOCK_TEACHER.password,
      email_confirm: true,
      user_metadata: { full_name: MOCK_TEACHER.full_name, role: "teacher" },
    });

    if (authError) {
      console.error("Auth create failed:", authError.message);
      process.exit(1);
    }

    userId = authData.user.id;
    console.log("Created auth user:", userId);
  }

  const { error: userError } = await admin.from("users").upsert(
    {
      id: userId,
      email: MOCK_TEACHER.email,
      full_name: MOCK_TEACHER.full_name,
      role: "teacher",
      is_active: true,
    },
    { onConflict: "id" }
  );

  if (userError) {
    console.error("users upsert failed:", userError.message);
    process.exit(1);
  }

  const { data: existingTeacher } = await admin
    .from("teachers")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existingTeacher) {
    const { error: updateError } = await admin
      .from("teachers")
      .update({
        employee_number: MOCK_TEACHER.employee_number,
        department: MOCK_TEACHER.department,
        specialization: MOCK_TEACHER.specialization,
        status: "active",
      })
      .eq("id", existingTeacher.id);

    if (updateError) {
      console.error("teachers update failed:", updateError.message);
      process.exit(1);
    }
    console.log("Updated existing teacher profile:", existingTeacher.id);
  } else {
    const { data: teacherRow, error: teacherError } = await admin
      .from("teachers")
      .insert({
        user_id: userId,
        employee_number: MOCK_TEACHER.employee_number,
        department: MOCK_TEACHER.department,
        specialization: MOCK_TEACHER.specialization,
        status: "active",
      })
      .select("id")
      .single();

    if (teacherError) {
      console.error("teachers insert failed:", teacherError.message);
      process.exit(1);
    }
    console.log("Created teacher profile:", teacherRow.id);
  }

  console.log("\nMock teacher ready:");
  console.log("  Email:    ", MOCK_TEACHER.email);
  console.log("  Password: ", MOCK_TEACHER.password);
  console.log("  Login at: /auth/login → redirects to /teacher/dashboard");
  console.log("\nNext: seed demo classes & announcements:");
  console.log("  node --env-file=.env.local scripts/seed-mock-teacher-data.mjs");
  console.log("Then seed students for Grade 7 — Santos:");
  console.log("  node --env-file=.env.local scripts/seed-mock-teacher-students.mjs");
}

main();
