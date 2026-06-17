import { createClient } from "@/lib/supabase/server";
import NewStudentForm from "./new-student-form";

function relationOne<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

type StudentRow = {
  id: string;
  student_number: string | null;
  status: string;
  user: { full_name: string; email: string } | null;
};

export default async function NewStudentPage() {
  const supabase = await createClient();

  const [
    { data: recentStudents },
    { count: totalStudents },
    { count: activeStudents },
    { count: enrolledStudents },
  ] = await Promise.all([
    supabase
      .from("students")
      .select("id, student_number, status, user:users(full_name, email)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("students").select("*", { count: "exact", head: true }),
    supabase.from("students").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase
      .from("enrollments")
      .select("student_id", { count: "exact", head: true })
      .eq("status", "enrolled"),
  ]);

  const rows = (recentStudents ?? []) as StudentRow[];

  return (
    <NewStudentForm
      stats={{
        total: totalStudents ?? 0,
        active: activeStudents ?? 0,
        enrolled: enrolledStudents ?? 0,
      }}
      recentStudents={rows.map((student) => ({
        id: student.id,
        fullName: relationOne(student.user)?.full_name ?? "Unknown student",
        email: relationOne(student.user)?.email ?? "",
        studentNumber: student.student_number,
      }))}
    />
  );
}
