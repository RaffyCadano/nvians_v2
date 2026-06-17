import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import ClassEditForm from "./edit-form";

function relationOne<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export default async function ClassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [
    { data: classData, error: classError },
    { data: schoolYears },
    { data: teachers },
    { count: enrollmentCount },
    { count: subjectCount },
  ] = await Promise.all([
    supabase
      .from("classes")
      .select("*, school_year:school_years(id, name), advisor:teachers(id, user:users(id, full_name))")
      .eq("id", id)
      .single(),
    supabase.from("school_years").select("id, name").order("name"),
    supabase.from("teachers").select("id, user:users(id, full_name)").order("id"),
    supabase
      .from("enrollments")
      .select("*", { count: "exact", head: true })
      .eq("class_id", id)
      .eq("status", "enrolled"),
    supabase
      .from("class_subjects")
      .select("*", { count: "exact", head: true })
      .eq("class_id", id),
  ]);

  if (classError || !classData) notFound();

  const schoolYear = relationOne(classData.school_year);
  const advisor = relationOne(classData.advisor);
  const advisorUser = relationOne(advisor?.user);

  return (
    <ClassEditForm
      classData={{
        id: classData.id,
        grade_level: classData.grade_level,
        section: classData.section,
        school_year_id: classData.school_year_id,
        advisor_id: classData.advisor_id,
        status: classData.status as "active" | "archived",
        schoolYearName: schoolYear?.name ?? "—",
        advisorName: advisorUser?.full_name ?? null,
      }}
      schoolYears={schoolYears ?? []}
      teachers={(teachers ?? []).map((teacher) => ({
        id: teacher.id,
        fullName: relationOne(teacher.user)?.full_name ?? "Unknown teacher",
      }))}
      stats={{
        enrollments: enrollmentCount ?? 0,
        subjects: subjectCount ?? 0,
      }}
    />
  );
}
