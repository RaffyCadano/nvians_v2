import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, GraduationCap, BookOpen, School, TrendingUp, CalendarCheck } from "lucide-react";

export default async function AdminReportsPage() {
  const supabase = await createClient();

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
      .select("created_at, student:students(user:users(full_name)), class:classes(grade_level, section)")
      .eq("status", "enrolled")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  // Count enrollments per class
  const classCounts: Record<string, { label: string; count: number }> = {};
  (enrollmentsByClass ?? []).forEach((e: any) => {
    const key = e.class_id;
    if (!classCounts[key]) {
      classCounts[key] = {
        label: `${e.class?.grade_level} - ${e.class?.section}`,
        count: 0,
      };
    }
    classCounts[key].count++;
  });

  const totalAttendance = (presentCount ?? 0) + (absentCount ?? 0);
  const attendanceRate = totalAttendance > 0
    ? ((presentCount ?? 0) / totalAttendance * 100).toFixed(1)
    : "—";

  const stats = [
    { label: "Active Students", value: totalStudents ?? 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Teachers", value: totalTeachers ?? 0, icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Active Classes", value: totalClasses ?? 0, icon: School, color: "text-green-600", bg: "bg-green-50" },
    { label: "Subjects", value: totalSubjects ?? 0, icon: BookOpen, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Enrolled", value: totalEnrollments ?? 0, icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Attendance Rate", value: `${attendanceRate}%`, icon: CalendarCheck, color: "text-teal-600", bg: "bg-teal-50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-1">School-wide statistics and summaries.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 py-5">
              <div className={`rounded-xl ${s.bg} p-3`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Enrollment by Class */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enrollment by Class</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.values(classCounts).length > 0 ? (
              Object.values(classCounts)
                .sort((a, b) => b.count - a.count)
                .map((c) => (
                  <div key={c.label} className="flex items-center justify-between py-1">
                    <span className="text-sm text-gray-700">{c.label}</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {c.count} student{c.count !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-500 py-4 text-center">No enrollments yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Enrollments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(recentEnrollments ?? []).length > 0 ? (
              (recentEnrollments ?? []).map((e: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <span className="text-sm text-gray-700">{e.student?.user?.full_name}</span>
                  <span className="text-xs text-gray-500">
                    {e.class?.grade_level} - {e.class?.section}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 py-4 text-center">No enrollments yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
