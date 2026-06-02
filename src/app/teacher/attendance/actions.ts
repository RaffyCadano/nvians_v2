"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { syncAttendanceRecordsForClass } from "@/lib/teacher/attendance-session";

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

  const admin = createAdminClient();
  const { data: record, error: recordError } = await admin
    .from("attendance_records")
    .select("id, session_id, session:attendance_sessions(created_by)")
    .eq("id", recordId)
    .maybeSingle();

  if (recordError) {
    return { error: recordError.message };
  }

  if (!record) {
    return { error: "Record not found." };
  }

  const session = Array.isArray(record.session) ? record.session[0] : record.session;
  if (session?.created_by !== user.id) {
    return { error: "You cannot edit this session." };
  }

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
