"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function enrollStudent(formData: FormData) {
  const supabase = createAdminClient();

  const studentId = formData.get("student_id") as string;
  const classId = formData.get("class_id") as string;
  const schoolYearId = formData.get("school_year_id") as string;

  const { data: existingEnrollment, error: existingError } = await supabase
    .from("enrollments")
    .select("id, status")
    .eq("student_id", studentId)
    .eq("class_id", classId)
    .eq("school_year_id", schoolYearId)
    .maybeSingle();

  if (existingError) {
    return { error: existingError.message };
  }

  if (existingEnrollment) {
    if (existingEnrollment.status === "dropped" || existingEnrollment.status === "transferred") {
      const { error: updateError } = await supabase
        .from("enrollments")
        .update({ status: "enrolled" })
        .eq("id", existingEnrollment.id);

      if (updateError) {
        return { error: updateError.message };
      }

      return { success: true };
    }

    return {
      error:
        "This student is already enrolled in the selected class and school year.",
    };
  }

  const { error } = await supabase.from("enrollments").insert({
    student_id: studentId,
    class_id: classId,
    school_year_id: schoolYearId,
    status: "enrolled",
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function transferEnrollment(formData: FormData) {
  const supabase = createAdminClient();

  const enrollmentId = formData.get("enrollment_id") as string;
  const classId = formData.get("class_id") as string;

  const { data: targetClass, error: targetError } = await supabase
    .from("classes")
    .select("school_year_id")
    .eq("id", classId)
    .single();

  if (targetError || !targetClass) {
    return { error: targetError?.message || "Invalid class selected." };
  }

  const { error: updateError } = await supabase
    .from("enrollments")
    .update({
      class_id: classId,
      school_year_id: targetClass.school_year_id,
      status: "transferred",
    })
    .eq("id", enrollmentId);

  if (updateError) return { error: updateError.message };
  return { success: true };
}
export async function updateEnrollmentStatus(id: string, status: string) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("enrollments")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}
