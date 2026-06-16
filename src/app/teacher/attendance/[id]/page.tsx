import { createClient } from "@/lib/supabase/server";
import { loadTeacherAttendanceSession } from "@/lib/teacher/attendance-session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { AttendanceRecordList } from "./attendance-record-list";

export default async function TeacherAttendanceSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const data = user?.id ? await loadTeacherAttendanceSession(id, user.id) : null;
  if (!data) notFound();

  const { session, roster, records } = data;

  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const excused = records.filter((r) => r.status === "excused").length;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/teacher/attendance">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {session.subjectName} — Attendance
          </h1>
          <p className="text-sm text-gray-500">
            {session.gradeLevel} - {session.section} ·{" "}
            {format(new Date(session.date), "MMMM d, yyyy")}
          </p>
        </div>
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Student records ({records.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <AttendanceRecordList
            records={records}
            emptyEnrollmentMessage={
              <p>
                No students are enrolled in {session.gradeLevel} — {session.section} (
                {roster.length} in school records for this class). Enroll students in Admin →
                Classes, then refresh this page.
              </p>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
