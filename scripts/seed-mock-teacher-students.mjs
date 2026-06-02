/**
 * Creates mock students and enrolls them in the mock teacher's advisory class (Grade 7 — Santos).
 * Run: node --env-file=.env.local scripts/seed-mock-teacher-students.mjs
 *
 * Prerequisites:
 *   node --env-file=.env.local scripts/seed-mock-teacher.mjs
 *   node --env-file=.env.local scripts/seed-mock-teacher-data.mjs
 */

import { createClient } from "@supabase/supabase-js";

const MOCK_TEACHER_EMAIL = "teacher.mock@nvians.edu";
const ADVISORY_GRADE = "Grade 7";
const ADVISORY_SECTION = "Santos";
const DEFAULT_PASSWORD = "StudentMock00!";

const MOCK_STUDENTS = [
  {
    email: "student.mock1@nvians.edu",
    full_name: "Ana Garcia",
    student_number: "MOCK-7S-001",
    gender: "female",
  },
  {
    email: "student.mock2@nvians.edu",
    full_name: "Miguel Reyes",
    student_number: "MOCK-7S-002",
    gender: "male",
  },
  {
    email: "student.mock3@nvians.edu",
    full_name: "Sofia Dela Cruz",
    student_number: "MOCK-7S-003",
    gender: "female",
  },
  {
    email: "student.mock4@nvians.edu",
    full_name: "Luis Tan",
    student_number: "MOCK-7S-004",
    gender: "male",
  },
  {
    email: "student.mock5@nvians.edu",
    full_name: "Elena Villanueva",
    student_number: "MOCK-7S-005",
    gender: "female",
  },
];

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function ensureAuthUser({ email, full_name, password }) {
  const { data: listed } = await admin.auth.admin.listUsers();
  const found = listed?.users?.find((u) => u.email === email);

  if (found) {
    return found.id;
  }

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role: "student" },
  });

  if (authError) {
    throw new Error(`Auth create failed for ${email}: ${authError.message}`);
  }

  return authData.user.id;
}

async function ensureStudentProfile(userId, student) {
  const { error: userError } = await admin.from("users").upsert(
    {
      id: userId,
      email: student.email,
      full_name: student.full_name,
      role: "student",
      is_active: true,
    },
    { onConflict: "id" }
  );

  if (userError) {
    throw new Error(`users upsert failed for ${student.email}: ${userError.message}`);
  }

  const { data: existing } = await admin
    .from("students")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    const { error: updateError } = await admin
      .from("students")
      .update({
        student_number: student.student_number,
        gender: student.gender,
        status: "active",
      })
      .eq("id", existing.id);

    if (updateError) {
      throw new Error(`students update failed for ${student.email}: ${updateError.message}`);
    }

    return existing.id;
  }

  const { data: created, error: insertError } = await admin
    .from("students")
    .insert({
      user_id: userId,
      student_number: student.student_number,
      gender: student.gender,
      status: "active",
    })
    .select("id")
    .single();

  if (insertError) {
    throw new Error(`students insert failed for ${student.email}: ${insertError.message}`);
  }

  return created.id;
}

async function ensureEnrollment(studentId, classId, schoolYearId) {
  const { data: existing } = await admin
    .from("enrollments")
    .select("id, status")
    .eq("student_id", studentId)
    .eq("class_id", classId)
    .eq("school_year_id", schoolYearId)
    .maybeSingle();

  if (existing) {
    if (existing.status !== "enrolled") {
      const { error: updateError } = await admin
        .from("enrollments")
        .update({ status: "enrolled" })
        .eq("id", existing.id);

      if (updateError) {
        throw new Error(`enrollment reactivate failed: ${updateError.message}`);
      }
      return "reactivated";
    }
    return "exists";
  }

  const { error: insertError } = await admin.from("enrollments").insert({
    student_id: studentId,
    class_id: classId,
    school_year_id: schoolYearId,
    status: "enrolled",
  });

  if (insertError) {
    throw new Error(`enrollment insert failed: ${insertError.message}`);
  }

  return "created";
}

async function main() {
  const { data: teacherUser } = await admin
    .from("users")
    .select("id")
    .eq("email", MOCK_TEACHER_EMAIL)
    .maybeSingle();

  if (!teacherUser) {
    console.error("Mock teacher not found. Run seed-mock-teacher.mjs first.");
    process.exit(1);
  }

  const { data: teacher } = await admin
    .from("teachers")
    .select("id")
    .eq("user_id", teacherUser.id)
    .maybeSingle();

  if (!teacher) {
    console.error("Mock teacher profile not found.");
    process.exit(1);
  }

  const { data: schoolYear } = await admin
    .from("school_years")
    .select("id")
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (!schoolYear) {
    console.error("No active school year found.");
    process.exit(1);
  }

  const { data: advisoryClass } = await admin
    .from("classes")
    .select("id, grade_level, section")
    .eq("advisor_id", teacher.id)
    .eq("grade_level", ADVISORY_GRADE)
    .eq("section", ADVISORY_SECTION)
    .eq("school_year_id", schoolYear.id)
    .maybeSingle();

  if (!advisoryClass) {
    console.error(
      `Advisory class ${ADVISORY_GRADE} — ${ADVISORY_SECTION} not found. Run seed-mock-teacher-data.mjs first.`
    );
    process.exit(1);
  }

  console.log(`Enrolling students in ${advisoryClass.grade_level} — ${advisoryClass.section}\n`);

  let created = 0;
  let enrolled = 0;

  for (const student of MOCK_STUDENTS) {
    const userId = await ensureAuthUser({
      email: student.email,
      full_name: student.full_name,
      password: DEFAULT_PASSWORD,
    });

    const studentId = await ensureStudentProfile(userId, student);
    const enrollmentResult = await ensureEnrollment(
      studentId,
      advisoryClass.id,
      schoolYear.id
    );

    if (enrollmentResult === "created" || enrollmentResult === "reactivated") {
      enrolled += 1;
    }

    created += 1;
    console.log(
      `  ✓ ${student.full_name} (${student.student_number}) — enrollment: ${enrollmentResult}`
    );
  }

  const { count } = await admin
    .from("enrollments")
    .select("*", { count: "exact", head: true })
    .eq("class_id", advisoryClass.id)
    .eq("status", "enrolled");

  console.log(`\nDone. Processed ${created} mock student(s).`);
  console.log(`  Enrolled in class: ${count ?? 0}`);
  console.log("\nStudent login (all use the same password):");
  console.log("  Password:", DEFAULT_PASSWORD);
  for (const s of MOCK_STUDENTS) {
    console.log("  ", s.email);
  }
  console.log("\nTeacher can enter grades at /teacher/grades after adding categories & items.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
