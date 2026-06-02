import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getClassRosterForTeacher, type ClassRosterRow } from "@/lib/teacher/class-roster";

function relationOne<T>(value: T | T[] | null | undefined): T | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export type AttendanceRecordRow = {
  id: string;
  status: "present" | "absent" | "excused";
  remarks: string | null;
  studentName: string;
  studentNumber: string | null;
};

export async function syncAttendanceRecordsForClass(
  sessionId: string,
  classId: string
): Promise<number> {
  const admin = createAdminClient();

  const { data: enrollments } = await admin
    .from("enrollments")
    .select("student_id")
    .eq("class_id", classId)
    .eq("status", "enrolled");

  if (!enrollments?.length) return 0;

  const { data: existing } = await admin
    .from("attendance_records")
    .select("student_id")
    .eq("session_id", sessionId);

  const existingIds = new Set((existing ?? []).map((r) => r.student_id));
  const toInsert = enrollments
    .filter((e) => !existingIds.has(e.student_id))
    .map((e) => ({
      session_id: sessionId,
      student_id: e.student_id,
      status: "present" as const,
    }));

  if (toInsert.length === 0) return 0;

  const { error } = await admin.from("attendance_records").insert(toInsert);
  if (error) throw new Error(error.message);

  return toInsert.length;
}

export async function loadTeacherAttendanceSession(
  sessionId: string,
  teacherUserId: string
): Promise<{
  session: {
    id: string;
    date: string;
    subjectName: string;
    gradeLevel: string;
    section: string;
    classId: string;
  };
  roster: ClassRosterRow[];
  records: AttendanceRecordRow[];
} | null> {
  const supabase = await createClient();

  const { data: sessionRow } = await supabase
    .from("attendance_sessions")
    .select(
      `id, date,
      class_subject:class_subjects(
        class_id,
        subject:subjects(name),
        class:classes(grade_level, section)
      )`
    )
    .eq("id", sessionId)
    .eq("created_by", teacherUserId)
    .maybeSingle();

  if (!sessionRow) return null;

  const classSubject = relationOne(sessionRow.class_subject);
  const classId = classSubject?.class_id as string | undefined;
  if (!classId) return null;

  const subject = relationOne(classSubject?.subject);
  const cls = relationOne(classSubject?.class);

  const roster = await getClassRosterForTeacher(teacherUserId, classId);

  if (roster.length > 0) {
    await syncAttendanceRecordsForClass(sessionId, classId);
  }

  const admin = createAdminClient();
  const { data: recordRows } = await admin
    .from("attendance_records")
    .select(
      "id, status, remarks, student:students(id, student_number, user:users(full_name))"
    )
    .eq("session_id", sessionId);

  const records: AttendanceRecordRow[] = (recordRows ?? [])
    .map((r) => ({
      id: r.id,
      status: r.status as "present" | "absent" | "excused",
      remarks: r.remarks,
      studentName: relationOne(relationOne(r.student)?.user)?.full_name ?? "Unknown",
      studentNumber: relationOne(r.student)?.student_number ?? null,
    }))
    .sort((a, b) => a.studentName.localeCompare(b.studentName));

  return {
    session: {
      id: sessionRow.id,
      date: sessionRow.date,
      subjectName: subject?.name ?? "Subject",
      gradeLevel: cls?.grade_level ?? "",
      section: cls?.section ?? "",
      classId,
    },
    roster,
    records,
  };
}
