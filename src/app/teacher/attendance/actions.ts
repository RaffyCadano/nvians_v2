"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("student_id")
    .eq("class_id", classSubject.class_id)
    .eq("status", "enrolled");

  if (enrollments && enrollments.length > 0) {
    const { error: recordsError } = await supabase.from("attendance_records").insert(
      enrollments.map((e) => ({
        session_id: session.id,
        student_id: e.student_id,
        status: "present" as const,
      }))
    );

    if (recordsError) {
      return { error: recordsError.message };
    }
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

  const { error } = await supabase
    .from("attendance_records")
    .update({ status, remarks: remarks?.trim() || null })
    .eq("id", recordId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/teacher/attendance/${record.session_id}`);
  return { success: true };
}
