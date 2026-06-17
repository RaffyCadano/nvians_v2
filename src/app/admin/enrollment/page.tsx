import { createAdminClient } from "@/lib/supabase/admin";
import { buildMonthlyTrend, buildStatusTrend } from "@/lib/trend-utils";
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
  const enrollmentTrendItems = all
    .filter((e) => e.enrolled_at)
    .map((e) => ({
      status: e.status as string,
      created_at: e.enrolled_at as string,
    }));

  const enrollmentDates = all.map((e) => e.enrolled_at).filter(Boolean) as string[];
  const stats = {
    total: all.length,
    enrolled: all.filter((e) => e.status === "enrolled").length,
    dropped: all.filter((e) => e.status === "dropped").length,
    transferred: all.filter((e) => e.status === "transferred").length,
  };

  const trendSeries = [
    {
      title: "Total Records",
      stroke: "#4f46e5",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      current: stats.total,
      data: buildMonthlyTrend(enrollmentDates),
    },    {
      title: "Enrolled",
      stroke: "#16a34a",
      color: "text-green-600",
      bg: "bg-green-50",
      current: stats.enrolled,
      data: buildStatusTrend(enrollmentTrendItems, "enrolled"),
    },
    {
      title: "Transferred",
      stroke: "#d97706",
      color: "text-amber-600",
      bg: "bg-amber-50",
      current: stats.transferred,
      data: buildStatusTrend(enrollmentTrendItems, "transferred"),
    },
    {
      title: "Dropped",
      stroke: "#dc2626",
      color: "text-red-600",
      bg: "bg-red-50",
      current: stats.dropped,
      data: buildStatusTrend(enrollmentTrendItems, "dropped"),
    },
  ];
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
      trendSeries={trendSeries}
      classes={classes ?? []}
      students={students ?? []}
      schoolYears={schoolYears ?? []}
      filterClass={classId ?? ""}
      filterQ={q ?? ""}
    />
  );
}