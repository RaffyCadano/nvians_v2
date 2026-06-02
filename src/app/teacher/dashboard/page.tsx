import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, ClipboardList, BarChart3 } from "lucide-react";

export default async function TeacherDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: teacher } = await supabase
    .from("teachers")
    .select("*, user:users(*)")
    .eq("user_id", user?.id)
    .single();

  const { data: advisoryClass } = await supabase
    .from("classes")
    .select("*")
    .eq("advisor_id", teacher?.id)
    .eq("status", "active")
    .single();

  const { data: classSubjects } = await supabase
    .from("class_subjects")
    .select("*, subject:subjects(*), class:classes(*), term:terms(*)")
    .eq("teacher_id", teacher?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome, {teacher?.user?.full_name ?? "Teacher"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Advisory Class</CardTitle>
            <div className="rounded-lg bg-blue-50 p-2">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            {advisoryClass ? (
              <div className="text-lg font-bold text-gray-900">
                {advisoryClass.grade_level} - {advisoryClass.section}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No advisory class</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Assigned Subjects</CardTitle>
            <div className="rounded-lg bg-green-50 p-2">
              <BookOpen className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{classSubjects?.length ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Assignments</CardTitle>
            <div className="rounded-lg bg-orange-50 p-2">
              <ClipboardList className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Grades Posted</CardTitle>
            <div className="rounded-lg bg-purple-50 p-2">
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Subjects */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">My Subjects This Term</CardTitle>
        </CardHeader>
        <CardContent>
          {classSubjects && classSubjects.length > 0 ? (
            <div className="space-y-2">
              {classSubjects.map((cs: any) => (
                <div key={cs.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium text-sm">{cs.subject?.name}</p>
                    <p className="text-xs text-gray-500">
                      {cs.class?.grade_level} - {cs.class?.section} · {cs.term?.name}
                    </p>
                  </div>
                  <Badge variant="secondary">{cs.schedule ?? "No schedule"}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No subjects assigned yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
