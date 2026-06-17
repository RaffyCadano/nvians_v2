import { createClient } from "@/lib/supabase/server";
import NewClassForm from "./form";

function relationOne<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

type ClassRow = {
  id: string;
  grade_level: string;
  section: string;
  status: string;
  school_year: { name: string } | null;
  enrollments: { count: number }[];
};

export default async function NewClassPage() {
  const supabase = await createClient();

  const [
    { data: schoolYears },
    { data: teachers },
    { data: recentClasses },
    { data: activeSchoolYear },
    { count: totalClasses },
    { count: activeClasses },
  ] = await Promise.all([
    supabase.from("school_years").select("id, name, status").order("start_date", { ascending: false }),
    supabase.from("teachers").select("id, user:users(full_name)").eq("status", "active"),
    supabase
      .from("classes")
      .select("id, grade_level, section, status, school_year:school_years(name), enrollments(count)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("school_years").select("id, name").eq("status", "active").maybeSingle(),
    supabase.from("classes").select("*", { count: "exact", head: true }),
    supabase.from("classes").select("*", { count: "exact", head: true }).eq("status", "active"),
  ]);

  const rows = (recentClasses ?? []) as ClassRow[];

  return (
    <NewClassForm
      schoolYears={(schoolYears ?? []).map((sy) => ({
        id: sy.id,
        name: sy.name,
        status: sy.status,
      }))}
      teachers={(teachers ?? []).map((t) => ({
        id: t.id,
        fullName: relationOne(t.user)?.full_name ?? "Unknown teacher",
      }))}
      activeSchoolYearId={activeSchoolYear?.id ?? null}
      stats={{
        total: totalClasses ?? 0,
        active: activeClasses ?? 0,
        teachers: (teachers ?? []).length,
      }}
      recentClasses={rows.map((cls) => ({
        id: cls.id,
        gradeLevel: cls.grade_level,
        section: cls.section,
        schoolYearName: relationOne(cls.school_year)?.name ?? "—",
        studentCount: cls.enrollments?.[0]?.count ?? 0,
      }))}
    />
  );
}
