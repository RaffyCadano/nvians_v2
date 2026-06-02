import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, UserCheck, TrendingUp, Calendar } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: studentCount },
    { count: teacherCount },
    { count: classCount },
    { count: subjectCount },
  ] = await Promise.all([
    supabase.from("students").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("teachers").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("classes").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("subjects").select("*", { count: "exact", head: true }).eq("status", "active"),
  ]);

  const stats = [
    { title: "Total Students", value: studentCount ?? 0, icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Teachers", value: teacherCount ?? 0, icon: UserCheck, color: "text-green-600", bg: "bg-green-50" },
    { title: "Active Classes", value: classCount ?? 0, icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Subjects Offered", value: subjectCount ?? 0, icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back. Here's an overview of the school.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <div className={`rounded-lg p-2 ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "Enroll New Student", href: "/admin/enrollment/new" },
              { label: "Add Teacher", href: "/admin/teachers/new" },
              { label: "Create Class", href: "/admin/classes/new" },
              { label: "Post News", href: "/admin/cms/news/new" },
            ].map((action) => (
              <a
                key={action.href}
                href={action.href}
                className="block rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {action.label}
              </a>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Academic Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">No active school year found. Set up a school year to get started.</p>
            <a href="/admin/school-years" className="mt-3 inline-block text-sm text-blue-600 hover:underline">
              Manage School Years →
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              System Users
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Students</span>
              <span className="font-medium">{studentCount ?? 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Teachers</span>
              <span className="font-medium">{teacherCount ?? 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
