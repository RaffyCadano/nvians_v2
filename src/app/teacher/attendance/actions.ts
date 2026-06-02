"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function syncAttendanceRecordsForClass(
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
  if (error) {
    throw new Error(error.message);
  }

  return toInsert.length;
}

/** Backfill attendance rows for enrolled students (e.g. session created before enrollments). */
export async function ensureAttendanceRecordsForSession(sessionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be signed in." };

  const { data: session } = await supabase
    .from("attendance_sessions")
    .select("id, class_subject:class_subjects(class_id)")
    .eq("id", sessionId)
    .eq("created_by", user.id)
    .maybeSingle();

  if (!session) return { error: "Session not found." };

  const classSubject = Array.isArray(session.class_subject)
    ? session.class_subject[0]
    : session.class_subject;
  const classId = classSubject?.class_id as string | undefined;

  if (!classId) return { error: "Class not found for this session." };

  try {
    const added = await syncAttendanceRecordsForClass(sessionId, classId);
    if (added > 0) {
      revalidatePath(`/teacher/attendance/${sessionId}`);
    }
    return { success: true, added };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to sync roster." };
  }
}

export async function createAttendanceSession(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const classSubjectId = (formData.get("class_subject_id") as string)?.trim();
  const date = (formData.get("date") as string)?.trim();

  if (!classSubjectId || !date) {
    return { error: "Subject class and date are required." };
  }

  const { data: teacher } = await supabase
    .from("teachers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!teacher) {
    return { error: "Teacher profile not found." };
  }

  const { data: classSubject } = await supabase
    .from("class_subjects")
    .select("id, class_id")
    .eq("id", classSubjectId)
    .eq("teacher_id", teacher.id)
    .maybeSingle();

  if (!classSubject) {
    return { error: "You are not assigned to this subject class." };
  }

  const { data: session, error: sessionError } = await supabase
    .from("attendance_sessions")
    .insert({
      class_subject_id: classSubjectId,
      date,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (sessionError) {
    if (sessionError.code === "23505") {
      return { error: "An attendance session already exists for this class on that date." };
    }
    return { error: sessionError.message };
  }

  try {
    await syncAttendanceRecordsForClass(session.id, classSubject.class_id);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to create attendance records.",
    };
  }

  revalidatePath("/teacher/attendance");
  redirect(`/teacher/attendance/${session.id}`);
}

export async function updateAttendanceRecord(
  recordId: string,
  status: "present" | "absent" | "excused",
  remarks?: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { data: record } = await supabase
    .from("attendance_records")
    .select("id, session_id")
    .eq("id", recordId)
    .single();

  if (!record) {
    return { error: "Record not found." };
  }

  const { data: session } = await supabase
    .from("attendance_sessions")
    .select("id")
    .eq("id", record.session_id)
    .eq("created_by", user.id)
    .maybeSingle();

  if (!session) {
    return { error: "You cannot edit this session." };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("attendance_records")
    .update({ status, remarks: remarks?.trim() || null })
    .eq("id", recordId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/teacher/attendance/${record.session_id}`);
  return { success: true };
}
