import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { notFound } from "next/navigation";

export default async function AttendanceSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: session } = await supabase
    .from("attendance_sessions")
    .select(
      `*, 
      class_subject:class_subjects(
        subject:subjects(name),
        class:classes(grade_level, section)
      ),
      attendance_records(
        id, status, remarks,
        student:students(id, student_number, user:users(full_name))
      )`
    )
    .eq("id", id)
    .single();

  if (!session) notFound();

  const records: any[] = session.attendance_records ?? [];
  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const excused = records.filter((r) => r.status === "excused").length;

  const STATUS_COLORS: Record<string, string> = {
    present: "bg-green-100 text-green-700",
    absent: "bg-red-100 text-red-700",
    excused: "bg-yellow-100 text-yellow-700",
    late: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/attendance"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {session.class_subject?.subject?.name} — Attendance
          </h1>
          <p className="text-sm text-gray-500">
            {session.class_subject?.class?.grade_level} - {session.class_subject?.class?.section} ·{" "}
            {format(new Date(session.date), "MMMM d, yyyy")}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Present", value: present, color: "text-green-700", bg: "bg-green-50" },
          { label: "Absent", value: absent, color: "text-red-700", bg: "bg-red-50" },
          { label: "Excused", value: excused, color: "text-yellow-700", bg: "bg-yellow-50" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl ${s.bg} p-4 text-center`}>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Records */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Student Records ({records.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Student</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Student No.</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {records.length > 0 ? (
                records
                  .sort((a, b) =>
                    a.student?.user?.full_name?.localeCompare(b.student?.user?.full_name)
                  )
                  .map((record: any) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {record.student?.user?.full_name}
                      </td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                        {record.student?.student_number ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className={STATUS_COLORS[record.status] ?? "bg-gray-100 text-gray-600"}
                        >
                          {record.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{record.remarks ?? "—"}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No records in this session.
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
