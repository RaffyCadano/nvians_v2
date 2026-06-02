"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function addClassSubject(formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("class_subjects").insert({
    class_id: formData.get("class_id") as string,
    subject_id: formData.get("subject_id") as string,
    teacher_id: (formData.get("teacher_id") as string) || null,
    term_id: formData.get("term_id") as string,
    schedule: (formData.get("schedule") as string) || null,
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function removeClassSubject(id: string) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("class_subjects").delete().eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function updateClassSubjectTeacher(id: string, teacherId: string | null) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("class_subjects")
    .update({ teacher_id: teacherId || null })
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}
