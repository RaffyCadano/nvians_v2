import { createClient } from "@/lib/supabase/server";
import { getClassRosterForTeacher } from "@/lib/teacher/class-roster";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Users } from "lucide-react";

export default async function TeacherAdvisoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: teacher } = await supabase
    .from("teachers")
    .select("id, employee_number, department")
    .eq("user_id", user?.id ?? "")
    .single();

  const { data: advisoryClass } = await supabase
    .from("classes")
    .select("*, school_year:school_years(name)")
    .eq("advisor_id", teacher?.id ?? "")
    .eq("status", "active")
    .maybeSingle();

  const roster = advisoryClass
    ? await getClassRosterForTeacher(user?.id ?? "", advisoryClass.id)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Advisory Class</h1>
        <p className="text-sm text-gray-500 mt-1">
          View your homeroom class and enrolled students.
        </p>
      </div>

      {!advisoryClass ? (
        <Card>
          <CardContent className="py-16 text-center">
            <School className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="font-medium text-gray-700">No advisory class assigned</p>
            <p className="text-sm text-gray-500 mt-1">
              Contact the administrator to assign you as a class advisor.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <School className="h-4 w-4 text-blue-600" />
                Class Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
              <div>
                <p className="text-gray-500">Grade & Section</p>
                <p className="font-semibold text-gray-900">
                  {advisoryClass.grade_level} — {advisoryClass.section}
                </p>
              </div>
              <div>
                <p className="text-gray-500">School Year</p>
                <p className="font-semibold text-gray-900">
                  {advisoryClass.school_year?.name ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <Badge variant="secondary" className="mt-0.5 capitalize">
                  {advisoryClass.status}
                </Badge>
              </div>
              <div>
                <p className="text-gray-500">Enrolled Students</p>
                <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-gray-400" />
                  {roster.length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Class Roster</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Student</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Student No.</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Enrolled</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {roster.length > 0 ? (
                    roster.map((row) => (
                      <tr key={row.enrollmentId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {row.fullName}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {row.studentNumber ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {row.email ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(row.enrolledAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                        No students enrolled in this class yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
