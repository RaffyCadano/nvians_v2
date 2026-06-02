import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { AttendanceRecordEditor } from "./attendance-record-editor";
import { ensureAttendanceRecordsForSession } from "../actions";

function relationOne<T>(value: T | T[] | null | undefined): T | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

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

  let { data: session } = await supabase
    .from("attendance_sessions")
    .select(
      `*, 
      class_subject:class_subjects(
        class_id,
        subject:subjects(name),
        class:classes(grade_level, section)
      ),
      attendance_records(
        id, status, remarks,
        student:students(id, student_number, user:users(full_name))
      )`
    )
    .eq("id", id)
    .eq("created_by", user?.id ?? "")
    .maybeSingle();

  if (!session) notFound();

  if ((session.attendance_records ?? []).length === 0) {
    await ensureAttendanceRecordsForSession(id);
    const { data: refreshed } = await supabase
      .from("attendance_sessions")
      .select(
        `*, 
        class_subject:class_subjects(
          class_id,
          subject:subjects(name),
          class:classes(grade_level, section)
        ),
        attendance_records(
          id, status, remarks,
          student:students(id, student_number, user:users(full_name))
        )`
      )
      .eq("id", id)
      .eq("created_by", user?.id ?? "")
      .maybeSingle();
    if (refreshed) session = refreshed;
  }

  const classSubject = relationOne(session.class_subject);
  const subject = relationOne(classSubject?.subject);
  const cls = relationOne(classSubject?.class);

  const records = (session.attendance_records ?? []).map((r) => ({
    id: r.id,
    status: r.status as "present" | "absent" | "excused",
    remarks: r.remarks,
    studentName: relationOne(relationOne(r.student)?.user)?.full_name ?? "Unknown",
    studentNumber: relationOne(r.student)?.student_number ?? null,
  }));

  records.sort((a, b) => a.studentName.localeCompare(b.studentName));

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
            {subject?.name ?? "Subject"} — Attendance
          </h1>
          <p className="text-sm text-gray-500">
            {cls?.grade_level} - {cls?.section} · {format(new Date(session.date), "MMMM d, yyyy")}
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
          {records.length > 0 ? (
            <div className="divide-y">
              {records.map((record) => (
                <AttendanceRecordEditor key={record.id} record={record} />
              ))}
            </div>
          ) : (
            <p className="px-4 py-8 text-center text-gray-500 text-sm">
              No students enrolled in this class. Enroll students in{" "}
              {cls?.grade_level} — {cls?.section}, then refresh this page.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
