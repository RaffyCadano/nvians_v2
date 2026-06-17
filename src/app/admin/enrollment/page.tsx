import { createAdminClient } from "@/lib/supabase/admin";
import EnrollmentClient from "./client";

export default async function EnrollmentPage({
  searchParams,
}: {
  searchParams: Promise<{ class?: string; q?: string }>;
}) {
  const { class: classId, q } = await searchParams;
  const supabase = createAdminClient();

  const [
    { data: enrollments },
    { data: classes },
    { data: students },
    { data: schoolYears },
  ] = await Promise.all([
    supabase
      .from("enrollments")
      .select(
        "*, student:students(id, student_number, user:users(full_name, email)), class:classes(id, grade_level, section, school_year:school_years(name))"
      )
      .order("enrolled_at", { ascending: false }),
    supabase
      .from("classes")
      .select("id, grade_level, section, school_year:school_years(id, name)")
      .eq("status", "active")
      .order("grade_level"),
    supabase
      .from("students")
      .select("id, student_number, user:users(full_name)")
      .eq("status", "active")
      .order("created_at", { ascending: false }),
    supabase
      .from("school_years")
      .select("id, name")
      .order("start_date", { ascending: false }),
  ]);

  const all = enrollments ?? [];
  const stats = {
    total: all.length,
    enrolled: all.filter((e) => e.status === "enrolled").length,
    dropped: all.filter((e) => e.status === "dropped").length,
    transferred: all.filter((e) => e.status === "transferred").length,
  };

  let filtered = all;
  if (classId) filtered = filtered.filter((e) => e.class_id === classId);
  if (q) {
    const lower = q.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.student?.user?.full_name?.toLowerCase().includes(lower) ||
        e.student?.student_number?.toLowerCase().includes(lower)
    );
  }

  return (
    <EnrollmentClient
      enrollments={filtered}
      stats={stats}
      classes={classes ?? []}
      students={students ?? []}
      schoolYears={schoolYears ?? []}
      filterClass={classId ?? ""}
      filterQ={q ?? ""}
    />
  );
}
