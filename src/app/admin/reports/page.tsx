import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { StatsLineChart } from "@/components/admin/stats-line-chart";
import { buildMonthlyAttendanceRate, buildMonthlyTrend, buildStatusTrend } from "@/lib/trend-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3 } from "lucide-react";
import { format } from "date-fns";

export default async function AdminReportsPage() {
  const supabase = createAdminClient();

  const [
    { data: students },
    { data: teachers },
    { data: classes },
    { data: subjects },
    { data: enrollments },
    { data: attendanceRecords },
    { data: enrollmentsByClass },
    { data: recentEnrollments },
  ] = await Promise.all([
    supabase.from("students").select("created_at, status").eq("status", "active"),
    supabase.from("teachers").select("created_at, status").eq("status", "active"),
    supabase.from("classes").select("created_at, status").eq("status", "active"),
    supabase.from("subjects").select("created_at, status").eq("status", "active"),
    supabase.from("enrollments").select("enrolled_at, status").eq("status", "enrolled"),
    supabase.from("attendance_records").select("status, created_at"),
    supabase
      .from("enrollments")
      .select("class_id, class:classes(grade_level, section)")
      .eq("status", "enrolled"),
    supabase
      .from("enrollments")
      .select("enrolled_at, student:students(user:users(full_name)), class:classes(grade_level, section)")
      .eq("status", "enrolled")
      .order("enrolled_at", { ascending: false })
      .limit(10),
  ]);

  const studentRows = students ?? [];
  const teacherRows = teachers ?? [];
  const classRows = classes ?? [];
  const subjectRows = subjects ?? [];
  const enrollmentRows = enrollments ?? [];
  const attendanceRows = attendanceRecords ?? [];

  const classCounts: Record<string, { label: string; count: number }> = {};
  (enrollmentsByClass ?? []).forEach((e: any) => {
    const key = e.class_id;
    if (!classCounts[key]) {
      classCounts[key] = {
        label: `${e.class?.grade_level} — ${e.class?.section}`,
        count: 0,
      };
    }
    classCounts[key].count++;
  });

  const sortedClasses = Object.values(classCounts).sort((a, b) => b.count - a.count);
  const maxClassCount = sortedClasses[0]?.count ?? 1;

  const presentCount = attendanceRows.filter((record) => record.status === "present").length;
  const absentCount = attendanceRows.filter((record) => record.status === "absent").length;
  const totalAttendance = presentCount + absentCount;
  const attendanceRate =
    totalAttendance > 0 ? ((presentCount / totalAttendance) * 100).toFixed(1) : "—";
  const attendanceRateValue =
    attendanceRate === "—" ? 0 : Number.parseFloat(attendanceRate);

  const enrollmentTrendItems = enrollmentRows
    .filter((row) => row.enrolled_at)
    .map((row) => ({
      status: row.status as string,
      created_at: row.enrolled_at as string,
    }));

  const trendSeries = [
    {
      title: "Active Students",
      stroke: "#2563eb",
      color: "text-blue-600",
      bg: "bg-blue-50",
      current: studentRows.length,
      data: buildStatusTrend(studentRows, "active"),
    },
    {
      title: "Active Teachers",
      stroke: "#9333ea",
      color: "text-purple-600",
      bg: "bg-purple-50",
      current: teacherRows.length,
      data: buildStatusTrend(teacherRows, "active"),
    },
    {
      title: "Active Classes",
      stroke: "#16a34a",
      color: "text-green-600",
      bg: "bg-green-50",
      current: classRows.length,
      data: buildStatusTrend(classRows, "active"),
    },
    {
      title: "Subjects",
      stroke: "#d97706",
      color: "text-amber-600",
      bg: "bg-amber-50",
      current: subjectRows.length,
      data: buildStatusTrend(subjectRows, "active"),
    },
    {
      title: "Enrolled",
      stroke: "#4f46e5",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      current: enrollmentRows.length,
      data: buildStatusTrend(enrollmentTrendItems, "enrolled"),
    },
    {
      title: "Attendance Rate",
      stroke: "#0d9488",
      color: "text-teal-600",
      bg: "bg-teal-50",
      current: attendanceRateValue,
      valueLabel: attendanceRate === "—" ? "—" : `${attendanceRate}%`,
      data: buildMonthlyAttendanceRate(attendanceRows),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-blue-900 px-6 py-6 text-white sm:px-8 sm:py-7">
        <div>
          <p className="text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">Analytics</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Reports</h1>
          <p className="mt-2 max-w-xl text-sm text-slate-200">
            School-wide statistics, enrollment breakdowns, and recent activity at a glance.
          </p>
        </div>
      </section>

      <StatsLineChart series={trendSeries} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="flex min-w-0 flex-col gap-6">
          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
              <h2 className="font-semibold text-gray-900">Enrollment by Class</h2>
              <p className="mt-0.5 text-sm text-gray-500">
                {sortedClasses.length} class{sortedClasses.length === 1 ? "" : "es"} with enrollments
              </p>
            </div>
            {sortedClasses.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {sortedClasses.map((c) => (
                  <div key={c.label} className="px-5 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium text-gray-900">{c.label}</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {c.count} student{c.count !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                    <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{ width: `${Math.round((c.count / maxClassCount) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-16 text-center">
                <BarChart3 className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-4 font-medium text-gray-700">No enrollments yet</p>
                <p className="mt-1 text-sm text-gray-500">Enroll students to see class breakdowns.</p>
                <Button asChild className="mt-4" variant="outline">
                  <Link href="/enrollment">Go to Enrollment</Link>
                </Button>
              </div>
            )}
          </section>

          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
              <h2 className="font-semibold text-gray-900">Recent Enrollments</h2>
              <p className="mt-0.5 text-sm text-gray-500">Latest 10 enrollments</p>
            </div>
            {(recentEnrollments ?? []).length > 0 ? (
              <div className="divide-y divide-gray-100">
                {(recentEnrollments ?? []).map((e: any, i: number) => (
                  <div key={i} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">{e.student?.user?.full_name}</p>
                      <p className="text-xs text-gray-500">
                        {e.enrolled_at ? format(new Date(e.enrolled_at), "MMM d, yyyy") : "—"}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm text-gray-600">
                      {e.class?.grade_level} — {e.class?.section}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-12 text-center text-sm text-gray-500">No recent enrollments.</div>
            )}
          </section>
        </div>

        <aside className="rounded-xl border border-gray-200 bg-white p-5 lg:sticky lg:top-7">
          <h2 className="text-base font-bold text-gray-900">Quick Guide</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                1
              </span>
              <span>Stats refresh on each page load from live data.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                2
              </span>
              <span>Enrollment bars show relative class sizes.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                3
              </span>
              <span>Attendance rate is based on all recorded sessions.</span>
            </li>
          </ul>
          <div className="mt-5 space-y-2 border-t border-gray-100 pt-4">
            <Link
              href="/students"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View students <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/attendance"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View attendance <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
