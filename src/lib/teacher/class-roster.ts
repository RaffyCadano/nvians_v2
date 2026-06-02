import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type ClassRosterRow = {
  enrollmentId: string;
  enrolledAt: string;
  studentId: string;
  studentNumber: string | null;
  fullName: string;
  email: string | null;
};

function relationOne<T>(value: T | T[] | null | undefined): T | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

/** Load enrolled students for a class after verifying the teacher may view it. */
export async function getClassRosterForTeacher(
  teacherUserId: string,
  classId: string
): Promise<ClassRosterRow[]> {
  const supabase = await createClient();

  const { data: teacher } = await supabase
    .from("teachers")
    .select("id")
    .eq("user_id", teacherUserId)
    .maybeSingle();

  if (!teacher) return [];

  const [{ data: asAdvisor }, { data: asSubjectTeacher }] = await Promise.all([
    supabase
      .from("classes")
      .select("id")
      .eq("id", classId)
      .eq("advisor_id", teacher.id)
      .maybeSingle(),
    supabase
      .from("class_subjects")
      .select("id")
      .eq("class_id", classId)
      .eq("teacher_id", teacher.id)
      .limit(1)
      .maybeSingle(),
  ]);

  if (!asAdvisor && !asSubjectTeacher) return [];

  const admin = createAdminClient();
  const { data: enrollments } = await admin
    .from("enrollments")
    .select(
      "id, enrolled_at, student:students(id, student_number, user:users(full_name, email))"
    )
    .eq("class_id", classId)
    .eq("status", "enrolled")
    .order("enrolled_at", { ascending: true });

  return (enrollments ?? [])
    .map((row) => {
      const student = relationOne(row.student);
      const profile = relationOne(student?.user);
      if (!student?.id) return null;
      return {
        enrollmentId: row.id,
        enrolledAt: row.enrolled_at,
        studentId: student.id,
        studentNumber: student.student_number ?? null,
        fullName: profile?.full_name ?? "Unknown",
        email: profile?.email ?? null,
      };
    })
    .filter((row): row is ClassRosterRow => row !== null);
}
