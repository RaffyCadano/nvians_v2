import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCheck } from "lucide-react";

export default async function StudentAttendancePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("user_id", user?.id)
    .single();

  const { data: records } = await supabase
    .from("attendance_records")
    .select(
      "*, session:attendance_sessions(date, class_subject:class_subjects(subject:subjects(name), class:classes(grade_level, section)))"
    )
    .eq("student_id", student?.id)
    .order("session.date", { ascending: false });

  const present = records?.filter((r: any) => r.status === "present").length ?? 0;
  const absent = records?.filter((r: any) => r.status === "absent").length ?? 0;
  const excused = records?.filter((r: any) => r.status === "excused").length ?? 0;
  const total = records?.length ?? 0;
  const attendanceRate = total > 0 ? ((present / total) * 100).toFixed(1) : "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
        <p className="text-sm text-gray-500 mt-1">View your attendance record.</p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {[
          { label: "Present", value: present, color: "text-green-700", bg: "bg-green-50" },
          { label: "Absent", value: absent, color: "text-red-700", bg: "bg-red-50" },
          { label: "Excused", value: excused, color: "text-yellow-700", bg: "bg-yellow-50" },
          { label: "Rate", value: `${attendanceRate}%`, color: "text-blue-700", bg: "bg-blue-50" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl ${s.bg} p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Record */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Attendance History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Subject</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Class</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {records && records.length > 0 ? (
                records.map((record: any) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(record.session?.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{record.session?.class_subject?.subject?.name}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {record.session?.class_subject?.class?.grade_level} - {record.session?.class_subject?.class?.section}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="secondary"
                        className={
                          record.status === "present"
                            ? "bg-green-100 text-green-700"
                            : record.status === "absent"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {record.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center">
                    <UserCheck className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No attendance records yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
