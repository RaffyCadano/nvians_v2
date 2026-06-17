import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import ClassSubjectsClient from "./client";

function relationOne<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export default async function ClassSubjectsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [
    { data: cls },
    { data: classSubjects },
    { data: subjects },
    { data: teachers },
    { count: enrollmentCount },
  ] = await Promise.all([
    supabase
      .from("classes")
      .select(
        "id, grade_level, section, school_year_id, status, school_year:school_years(id, name), advisor:teachers(user:users(full_name))"
      )
      .eq("id", id)
      .single(),
    supabase
      .from("class_subjects")
      .select(
        "id, term_id, schedule, subject:subjects(id, name, code), teacher:teachers(id, user:users(full_name))"
      )
      .eq("class_id", id)
      .order("created_at"),
    supabase
      .from("subjects")
      .select("id, name, code")
      .eq("status", "active")
      .order("name"),
    supabase
      .from("teachers")
      .select("id, user:users(full_name)")
      .eq("status", "active")
      .order("created_at"),
    supabase
      .from("enrollments")
      .select("*", { count: "exact", head: true })
      .eq("class_id", id)
      .eq("status", "enrolled"),
  ]);

  if (!cls) notFound();

  const { data: terms } = await supabase
    .from("terms")
    .select("id, name, status, start_date, end_date")
    .eq("school_year_id", cls.school_year_id)
    .order("start_date");

  const schoolYear = relationOne(cls.school_year);
  const advisor = relationOne(cls.advisor);
  const advisorUser = relationOne(advisor?.user);

  const normalizedClassSubjects = (classSubjects ?? []).map((cs) => {
    const subject = relationOne(cs.subject);
    const teacher = relationOne(cs.teacher);
    const teacherUser = relationOne(teacher?.user);
    return {
      id: cs.id,
      termId: cs.term_id,
      schedule: cs.schedule,
      subjectId: subject?.id ?? "",
      subjectName: subject?.name ?? "Unknown subject",
      subjectCode: subject?.code ?? "—",
      teacherId: teacher?.id ?? null,
      teacherName: teacherUser?.full_name ?? null,
    };
  });

  const withTeacher = normalizedClassSubjects.filter((cs) => cs.teacherName).length;

  return (
    <ClassSubjectsClient
      cls={{
        id: cls.id,
        gradeLevel: cls.grade_level,
        section: cls.section,
        status: cls.status,
        schoolYearName: schoolYear?.name ?? "—",
        advisorName: advisorUser?.full_name ?? null,
      }}
      classSubjects={normalizedClassSubjects}
      subjects={subjects ?? []}
      teachers={(teachers ?? []).map((t) => ({
        id: t.id,
        fullName: relationOne(t.user)?.full_name ?? "Unknown teacher",
      }))}
      terms={(terms ?? []).map((t) => ({
        id: t.id,
        name: t.name,
        status: t.status,
        startDate: t.start_date,
        endDate: t.end_date,
      }))}
      stats={{
        total: normalizedClassSubjects.length,
        terms: (terms ?? []).length,
        withTeacher,
        enrollments: enrollmentCount ?? 0,
      }}
    />
  );
}
