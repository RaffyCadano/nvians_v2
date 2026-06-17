import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, ClipboardList, UserCheck, BookOpen, Megaphone } from "lucide-react";

export default async function StudentDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: student } = await supabase
    .from("students")
    .select("*, user:users(*)")
    .eq("user_id", user?.id)
    .single();

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("*, class:classes(*), school_year:school_years(*)")
    .eq("student_id", student?.id)
    .eq("status", "enrolled")
    .order("enrolled_at", { ascending: false })
    .limit(1)
    .single();

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Portal</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome, {student?.user?.full_name ?? "Student"}
          {student && (
            <span className="ml-2 text-blue-600 font-medium">· {student.student_number}</span>
          )}
        </p>
      </div>

      {/* Enrollment Info */}
      {enrollment && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm font-medium text-blue-900">Currently Enrolled</p>
                <p className="text-lg font-bold text-blue-700">
                  {enrollment.class?.grade_level} - {enrollment.class?.section}
                </p>
                <p className="text-xs text-blue-600">{enrollment.school_year?.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "View Grades", icon: BarChart3, href: "/student/grades", color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Attendance", icon: UserCheck, href: "/student/attendance", color: "text-green-600", bg: "bg-green-50" },
          { title: "Assignments", icon: ClipboardList, href: "/student/assignments", color: "text-orange-600", bg: "bg-orange-50" },
          { title: "Schedule", icon: BookOpen, href: "/student/schedule", color: "text-purple-600", bg: "bg-purple-50" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <a key={item.href} href={item.href}>
              <Card className="cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{item.title}</CardTitle>
                  <div className={`rounded-lg p-2 ${item.bg}`}>
                    <Icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500">Click to view →</p>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>

      {/* Announcements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            Recent Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {announcements && announcements.length > 0 ? (
            <div className="space-y-3">
              {announcements.map((a: any) => (
                <div key={a.id} className="rounded-lg border p-3">
                  <p className="font-medium text-sm">{a.title}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{a.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(a.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No announcements yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
