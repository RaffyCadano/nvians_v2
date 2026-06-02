/**
 * Inspect mock teacher related data in Supabase.
 * Run: node --env-file=.env.local scripts/inspect-mock-teacher-data.mjs
 */

import { createClient } from "@supabase/supabase-js";

const email = "teacher.mock@nvians.edu";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Missing env vars");
  process.exit(1);
}

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data: users } = await admin.from("users").select("id, email, full_name, role").eq("email", email);
  const userId = users?.[0]?.id;
  console.log("USER:", users);
  if (!userId) {
    console.log("No mock user — run seed-mock-teacher.mjs first");
    return;
  }

  const { data: teacher } = await admin.from("teachers").select("*").eq("user_id", userId).maybeSingle();
  console.log("TEACHER:", teacher);

  const { data: advisoryClasses } = await admin
    .from("classes")
    .select("id, grade_level, section, advisor_id, status")
    .eq("advisor_id", teacher?.id ?? "");
  console.log("ADVISORY CLASSES:", advisoryClasses);

  const { data: classSubjects } = await admin
    .from("class_subjects")
    .select("id, class_id, subject_id, teacher_id, subject:subjects(name), class:classes(grade_level, section)")
    .eq("teacher_id", teacher?.id ?? "");
  console.log("CLASS_SUBJECTS:", classSubjects);

  const { data: announcements } = await admin.from("announcements").select("*").eq("author_id", userId);
  console.log("ANNOUNCEMENTS (by author):", announcements);

  const { data: allAnn } = await admin
    .from("announcements")
    .select("id, title, author_id, class_id, class_subject_id, created_at")
    .order("created_at", { ascending: false })
    .limit(20);
  console.log("ALL ANNOUNCEMENTS:", allAnn);

  const { data: sy } = await admin.from("school_years").select("id, name, status").limit(5);
  console.log("SCHOOL_YEARS:", sy);

  const { data: terms } = await admin.from("terms").select("id, name, school_year_id, status").limit(5);
  console.log("TERMS:", terms);

  const { data: subjects } = await admin.from("subjects").select("id, code, name").limit(10);
  console.log("SUBJECTS:", subjects);

  const santosClassId = classSubjects?.[0]?.class_id;
  if (santosClassId) {
    const { count } = await admin
      .from("enrollments")
      .select("*", { count: "exact", head: true })
      .eq("class_id", santosClassId)
      .eq("status", "enrolled");
    console.log("ENROLLED STUDENTS (teacher class):", count ?? 0);
  }
}

main();
