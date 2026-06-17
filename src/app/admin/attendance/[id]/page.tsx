import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import AttendanceSessionDetail from "./session-detail";

function relationOne<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

type AttendanceRecord = {
  id: string;
  status: string;
  remarks: string | null;
  student: {
    id: string;
    student_number: string | null;
    user: { full_name: string } | { full_name: string }[] | null;
  } | null;
};

export default async function AttendanceSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: session } = await supabase
    .from("attendance_sessions")
    .select(
      `*, 
      class_subject:class_subjects(
        id,
        subject:subjects(name, code),
        class:classes(id, grade_level, section),
        teacher:teachers(user:users(full_name))
      ),
      attendance_records(
        id, status, remarks,
        student:students(id, student_number, user:users(full_name))
      )`
    )
    .eq("id", id)
    .single();

  if (!session) notFound();

  const classSubject = relationOne(session.class_subject);
  const subject = relationOne(classSubject?.subject);
  const cls = relationOne(classSubject?.class);
  const teacher = relationOne(classSubject?.teacher);
  const teacherUser = relationOne(teacher?.user);

  const records = ((session.attendance_records ?? []) as AttendanceRecord[])
    .map((record) => {
      const student = relationOne(record.student);
      const user = relationOne(student?.user);
      return {
        id: record.id,
        status: record.status,
        remarks: record.remarks,
        studentId: student?.id ?? "",
        studentName: user?.full_name ?? "Unknown student",
        studentNumber: student?.student_number ?? null,
      };
    })
    .sort((a, b) => a.studentName.localeCompare(b.studentName));

  return (
    <AttendanceSessionDetail
      session={{
        id: session.id,
        date: session.date,
        createdAt: session.created_at,
      }}
      classInfo={{
        classSubjectId: classSubject?.id ?? "",
        classId: cls?.id ?? "",
        subjectName: subject?.name ?? "Unknown subject",
        subjectCode: subject?.code ?? "—",
        gradeLevel: cls?.grade_level ?? "—",
        section: cls?.section ?? "—",
        teacherName: teacherUser?.full_name ?? "No teacher assigned",
      }}
      records={records}
    />
  );
}
