import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import StudentDetailForm from "./detail-form";

function relationOne<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [{ data: student, error }, { data: enrollments }] = await Promise.all([
    supabase
      .from("students")
      .select("*, user:users(id, full_name, email)")
      .eq("id", id)
      .single(),
    supabase
      .from("enrollments")
      .select(
        "id, status, class:classes(grade_level, section), school_year:school_years(name)"
      )
      .eq("student_id", id)
      .eq("status", "enrolled")
      .order("enrolled_at", { ascending: false }),
  ]);

  if (error || !student) notFound();

  const user = relationOne(student.user);
  const enrollmentRows = (enrollments ?? []).map((row) => {
    const cls = relationOne(row.class);
    const schoolYear = relationOne(row.school_year);
    return {
      id: row.id,
      gradeLevel: cls?.grade_level ?? "—",
      section: cls?.section ?? "—",
      schoolYearName: schoolYear?.name ?? "—",
    };
  });

  return (
    <StudentDetailForm
      student={{
        id: student.id,
        userId: user?.id ?? "",
        fullName: user?.full_name ?? "Unknown student",
        email: user?.email ?? "",
        studentNumber: student.student_number,
        dateOfBirth: student.date_of_birth,
        gender: student.gender,
        address: student.address,
        parentName: student.parent_name,
        parentContact: student.parent_contact,
        status: student.status as "active" | "disabled",
        createdAt: student.created_at,
      }}
      enrollments={enrollmentRows}
      stats={{
        enrollments: enrollmentRows.length,
        hasParent: Boolean(student.parent_name?.trim()),
        hasContact: Boolean(student.parent_contact?.trim()),
      }}
    />
  );
}
