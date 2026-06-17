import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarCheck,
  GraduationCap,
  School,
  TrendingUp,
  Users,
} from "lucide-react";
import { format } from "date-fns";

export default async function AdminReportsPage() {
  const supabase = createAdminClient();

  const [
    { count: totalStudents },
    { count: totalTeachers },
    { count: totalClasses },
    { count: totalSubjects },
    { count: totalEnrollments },
    { count: presentCount },
    { count: absentCount },
    { data: enrollmentsByClass },
    { data: recentEnrollments },
  ] = await Promise.all([
    supabase.from("students").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("teachers").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("classes").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("subjects").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("status", "enrolled"),
    supabase.from("attendance_records").select("*", { count: "exact", head: true }).eq("status", "present"),
    supabase.from("attendance_records").select("*", { count: "exact", head: true }).eq("status", "absent"),
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

  const totalAttendance = (presentCount ?? 0) + (absentCount ?? 0);
  const attendanceRate =
    totalAttendance > 0
      ? ((presentCount ?? 0) / totalAttendance * 100).toFixed(1)
      : "—";

  const stats = [
    { label: "Active Students", value: totalStudents ?? 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Teachers", value: totalTeachers ?? 0, icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Active Classes", value: totalClasses ?? 0, icon: School, color: "text-green-600", bg: "bg-green-50" },
    { label: "Subjects", value: totalSubjects ?? 0, icon: BookOpen, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Enrolled", value: totalEnrollments ?? 0, icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Attendance Rate", value: `${attendanceRate}%`, icon: CalendarCheck, color: "text-teal-600", bg: "bg-teal-50" },
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

      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">{stat.label}</p>
                  <p className="mt-1.5 text-2xl font-bold text-gray-900 sm:text-3xl">
                    {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                  </p>
                </div>
                <div className={`rounded-xl p-2.5 ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="flex min-w-0 flex-col gap-6">
          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
              <h2 className="font-semibold text-gray-900">Enrollment by Class</h2>
              <p className="mt-0.5 text-sm text-gray-500">{sortedClasses.length} class{sortedClasses.length === 1 ? "" : "es"} with enrollments</p>
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

          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
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

        <aside className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-7">
          <h2 className="text-base font-bold text-gray-900">Quick Guide</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">1</span>
              <span>Stats refresh on each page load from live data.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">2</span>
              <span>Enrollment bars show relative class sizes.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">3</span>
              <span>Attendance rate is based on all recorded sessions.</span>
            </li>
          </ul>
          <div className="mt-5 space-y-2 border-t border-gray-100 pt-4">
            <Link href="/students" className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
              View students <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link href="/attendance" className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
              View attendance <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
