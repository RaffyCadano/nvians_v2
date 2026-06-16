/**
 * Removes mock teacher/student accounts and related demo data from Supabase.
 * Run: node --env-file=.env.local scripts/remove-mock-accounts.mjs
 */

import { createClient } from "@supabase/supabase-js";

const MOCK_TEACHER_EMAIL = "teacher.mock@nvians.edu";
const MOCK_STUDENT_EMAILS = [
  "student.mock1@nvians.edu",
  "student.mock2@nvians.edu",
  "student.mock3@nvians.edu",
  "student.mock4@nvians.edu",
  "student.mock5@nvians.edu",
];
const MOCK_EMAILS = new Set([MOCK_TEACHER_EMAIL, ...MOCK_STUDENT_EMAILS]);
const MOCK_STUDENT_NUMBER_PREFIX = "MOCK-7S-";
const MOCK_ADVISORY = { grade_level: "Grade 7", section: "Santos" };

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function listAllAuthUsers() {
  const users = [];
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    users.push(...(data.users ?? []));
    if ((data.users?.length ?? 0) < perPage) break;
    page += 1;
  }

  return users;
}

function isMockEmail(email) {
  if (!email) return false;
  if (MOCK_EMAILS.has(email)) return true;
  return /^student\.mock\d+@nvians\.edu$/i.test(email);
}

async function findMockUserIds() {
  const authUsers = await listAllAuthUsers();
  const fromAuth = authUsers.filter((u) => isMockEmail(u.email));

  const { data: fromStudentNumbers } = await admin
    .from("students")
    .select("user_id, student_number, users!inner(email)")
    .like("student_number", `${MOCK_STUDENT_NUMBER_PREFIX}%`);

  const ids = new Set(fromAuth.map((u) => u.id));
  for (const row of fromStudentNumbers ?? []) {
    ids.add(row.user_id);
  }

  const { data: teacherRow } = await admin
    .from("users")
    .select("id")
    .eq("email", MOCK_TEACHER_EMAIL)
    .maybeSingle();
  if (teacherRow) ids.add(teacherRow.id);

  return { authUsers: fromAuth, userIds: [...ids] };
}

async function removeMockClassData(teacherUserId) {
  const { data: teacher } = await admin
    .from("teachers")
    .select("id")
    .eq("user_id", teacherUserId)
    .maybeSingle();

  if (!teacher) return;

  const { data: classSubjects } = await admin
    .from("class_subjects")
    .select("id, class_id")
    .eq("teacher_id", teacher.id);

  for (const cs of classSubjects ?? []) {
    const { error } = await admin.from("class_subjects").delete().eq("id", cs.id);
    if (error) console.warn("class_subjects delete:", cs.id, error.message);
    else console.log("Removed class subject:", cs.id);
  }

  const { data: advisoryClasses } = await admin
    .from("classes")
    .select("id, grade_level, section")
    .eq("advisor_id", teacher.id);

  for (const cls of advisoryClasses ?? []) {
    if (
      cls.grade_level === MOCK_ADVISORY.grade_level &&
      cls.section === MOCK_ADVISORY.section
    ) {
      const { error } = await admin.from("classes").delete().eq("id", cls.id);
      if (error) console.warn("classes delete:", cls.id, error.message);
      else console.log("Removed advisory class:", cls.grade_level, "—", cls.section);
    }
  }
}

async function main() {
  const { authUsers, userIds } = await findMockUserIds();

  if (userIds.length === 0) {
    console.log("No mock accounts found.");
    return;
  }

  console.log(`Found ${userIds.length} mock user id(s).`);

  const teacherAuth = authUsers.find((u) => u.email === MOCK_TEACHER_EMAIL);
  const teacherUserId =
    teacherAuth?.id ??
    (
      await admin.from("users").select("id").eq("email", MOCK_TEACHER_EMAIL).maybeSingle()
    ).data?.id;

  if (teacherUserId) {
    await removeMockClassData(teacherUserId);
  }

  const { error: sessionError } = await admin
    .from("attendance_sessions")
    .delete()
    .in("created_by", userIds);
  if (sessionError) {
    console.warn("attendance_sessions delete:", sessionError.message);
  } else {
    console.log("Removed attendance sessions created by mock users.");
  }

  for (const user of authUsers) {
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) console.error(`auth delete failed (${user.email}):`, error.message);
    else console.log(`Removed auth user: ${user.email}`);
  }

  for (const id of userIds) {
    if (authUsers.some((u) => u.id === id)) continue;
    const { data: row } = await admin.from("users").select("email").eq("id", id).maybeSingle();
    await admin.from("users").delete().eq("id", id);
    console.log(`Removed orphaned public.users row: ${row?.email ?? id}`);
  }

  console.log("\nDone. Mock accounts and demo class data removed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
