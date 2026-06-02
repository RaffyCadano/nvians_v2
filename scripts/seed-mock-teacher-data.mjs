/**
 * Seeds advisory class, subject assignment, and sample announcements for the mock teacher.
 * Run: node --env-file=.env.local scripts/seed-mock-teacher-data.mjs
 */

import { createClient } from "@supabase/supabase-js";
import {
  DEFAULT_STUDENT_PASSWORD,
  MOCK_STUDENTS,
  seedMockTeacherStudents,
} from "./seed-mock-teacher-students.mjs";

const MOCK_EMAIL = "teacher.mock@nvians.edu";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data: user } = await admin
    .from("users")
    .select("id, full_name")
    .eq("email", MOCK_EMAIL)
    .maybeSingle();

  if (!user) {
    console.error("Mock teacher user not found. Run: node --env-file=.env.local scripts/seed-mock-teacher.mjs");
    process.exit(1);
  }

  const { data: teacher } = await admin
    .from("teachers")
    .select("id")
    .eq("user_id", user.id)
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

  const { data: term } = await admin
    .from("terms")
    .select("id, name")
    .eq("school_year_id", schoolYear.id)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (!term) {
    console.error("No active term found for the school year.");
    process.exit(1);
  }

  const { data: mathSubject } = await admin
    .from("subjects")
    .select("id, name")
    .eq("code", "MATH-7")
    .maybeSingle();

  if (!mathSubject) {
    console.error("Subject MATH-7 not found.");
    process.exit(1);
  }

  // Advisory class for mock teacher (Grade 7 — Santos)
  let advisoryClass;
  const { data: existingClass } = await admin
    .from("classes")
    .select("id, grade_level, section")
    .eq("grade_level", "Grade 7")
    .eq("section", "Santos")
    .eq("school_year_id", schoolYear.id)
    .maybeSingle();

  if (existingClass) {
    const { error: updateError } = await admin
      .from("classes")
      .update({ advisor_id: teacher.id, status: "active" })
      .eq("id", existingClass.id);
    if (updateError) {
      console.error("classes update failed:", updateError.message);
      process.exit(1);
    }
    advisoryClass = existingClass;
    console.log("Updated advisory class:", existingClass.grade_level, "—", existingClass.section);
  } else {
    const { data: created, error: classError } = await admin
      .from("classes")
      .insert({
        grade_level: "Grade 7",
        section: "Santos",
        school_year_id: schoolYear.id,
        advisor_id: teacher.id,
        status: "active",
      })
      .select("id, grade_level, section")
      .single();

    if (classError) {
      console.error("classes insert failed:", classError.message);
      process.exit(1);
    }
    advisoryClass = created;
    console.log("Created advisory class:", created.grade_level, "—", created.section);
  }

  // Mathematics assignment for mock teacher
  let classSubject;
  const { data: existingCs } = await admin
    .from("class_subjects")
    .select("id")
    .eq("class_id", advisoryClass.id)
    .eq("subject_id", mathSubject.id)
    .eq("term_id", term.id)
    .maybeSingle();

  if (existingCs) {
    const { error: csUpdateError } = await admin
      .from("class_subjects")
      .update({ teacher_id: teacher.id, schedule: "Mon/Wed/Fri 8:00–9:00 AM" })
      .eq("id", existingCs.id);
    if (csUpdateError) {
      console.error("class_subjects update failed:", csUpdateError.message);
      process.exit(1);
    }
    classSubject = existingCs;
    console.log("Updated class subject assignment:", mathSubject.name, `(${term.name})`);
  } else {
    const { data: createdCs, error: csError } = await admin
      .from("class_subjects")
      .insert({
        class_id: advisoryClass.id,
        subject_id: mathSubject.id,
        teacher_id: teacher.id,
        term_id: term.id,
        schedule: "Mon/Wed/Fri 8:00–9:00 AM",
      })
      .select("id")
      .single();

    if (csError) {
      console.error("class_subjects insert failed:", csError.message);
      process.exit(1);
    }
    classSubject = createdCs;
    console.log("Created class subject:", mathSubject.name, `(${term.name})`);
  }

  const mockAnnouncements = [
    {
      title: "Welcome to the new school year",
      content:
        "Good morning! Classes begin next Monday. Please check your schedules and report to homeroom by 7:30 AM.",
      class_id: null,
      class_subject_id: null,
    },
    {
      title: "Advisory: Parent meeting this Friday",
      content:
        "Grade 7 — Santos parents are invited to a short meeting on Friday, 3:00 PM, in Room 201. Please confirm attendance via the class group chat.",
      class_id: advisoryClass.id,
      class_subject_id: null,
    },
    {
      title: "Mathematics: Unit test next week",
      content:
        "We will have a written assessment on linear equations on Wednesday. Review modules 3–5 and bring a calculator.",
      class_id: null,
      class_subject_id: classSubject.id,
    },
  ];

  for (const ann of mockAnnouncements) {
    const { data: existing } = await admin
      .from("announcements")
      .select("id")
      .eq("author_id", user.id)
      .eq("title", ann.title)
      .maybeSingle();

    if (existing) {
      console.log("Announcement already exists:", ann.title);
      continue;
    }

    const { error: annError } = await admin.from("announcements").insert({
      author_id: user.id,
      title: ann.title,
      content: ann.content,
      class_id: ann.class_id,
      class_subject_id: ann.class_subject_id,
    });

    if (annError) {
      console.error("announcement insert failed:", ann.title, annError.message);
      process.exit(1);
    }
    console.log("Created announcement:", ann.title);
  }

  const studentResult = await seedMockTeacherStudents(admin, {
    advisoryClass,
    schoolYearId: schoolYear.id,
  });

  console.log("\nMock teacher demo data ready.");
  console.log("  Teacher login:", MOCK_EMAIL);
  console.log("  Advisory:", advisoryClass.grade_level, "—", advisoryClass.section);
  console.log("  Subject: ", mathSubject.name, `(${term.name})`);
  console.log("  Students enrolled:", studentResult.enrolledInClass);
  console.log("  Pages:   /teacher/grades · /teacher/announcements · /teacher/assignments");
  console.log("\nMock student logins (password for all):", DEFAULT_STUDENT_PASSWORD);
  for (const s of MOCK_STUDENTS) {
    console.log("  ", s.email);
  }
}

main();
