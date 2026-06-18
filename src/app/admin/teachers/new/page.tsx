import { createClient } from "@/lib/supabase/server";
import NewTeacherForm from "./new-teacher-form";

function relationOne<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

type TeacherRow = {
  id: string;
  employee_number: string | null;
  department: string | null;
  status: string;
  user: { full_name: string; email: string } | { full_name: string; email: string }[] | null;
};

export default async function NewTeacherPage() {
  const supabase = await createClient();

  const [
    { data: recentTeachers },
    { count: totalTeachers },
    { count: activeTeachers },
    { data: departments },
  ] = await Promise.all([
    supabase
      .from("teachers")
      .select("id, employee_number, department, status, user:users(full_name, email)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("teachers").select("*", { count: "exact", head: true }),
    supabase.from("teachers").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("teachers").select("department").not("department", "is", null),
  ]);

  const rows = (recentTeachers ?? []) as TeacherRow[];

  const departmentCounts = Object.entries(
    (departments ?? []).reduce<Record<string, number>>((acc, row) => {
      const dept = row.department?.trim();
      if (!dept) return acc;
      acc[dept] = (acc[dept] ?? 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <NewTeacherForm
      stats={{
        total: totalTeachers ?? 0,
        active: activeTeachers ?? 0,
      }}
      recentTeachers={rows.map((teacher) => ({
        id: teacher.id,
        fullName: relationOne(teacher.user)?.full_name ?? "Unknown teacher",
        email: relationOne(teacher.user)?.email ?? "",
        department: teacher.department,
        employeeNumber: teacher.employee_number,
      }))}
      topDepartments={departmentCounts.map(([name, count]) => ({ name, count }))}
    />
  );
}
