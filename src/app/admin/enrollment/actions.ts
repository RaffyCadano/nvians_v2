"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function enrollStudent(formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("enrollments").insert({
    student_id: formData.get("student_id") as string,
    class_id: formData.get("class_id") as string,
    school_year_id: formData.get("school_year_id") as string,
    status: "enrolled",
  });

  if (error) return { error: error.message };
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
