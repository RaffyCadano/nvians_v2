"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createAssignment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const classSubjectId = (formData.get("class_subject_id") as string)?.trim();
  const dueDate = (formData.get("due_date") as string)?.trim();
  const maxScoreRaw = (formData.get("max_score") as string)?.trim();

  if (!title || !classSubjectId || !dueDate) {
    return { error: "Title, subject class, and due date are required." };
  }

  const maxScore = maxScoreRaw ? Number(maxScoreRaw) : 100;
  if (Number.isNaN(maxScore) || maxScore <= 0) {
    return { error: "Max score must be a positive number." };
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
    .select("id")
    .eq("id", classSubjectId)
    .eq("teacher_id", teacher.id)
    .maybeSingle();

  if (!classSubject) {
    return { error: "You are not assigned to this subject class." };
  }

  const dueDateIso = dueDate.includes("T") ? new Date(dueDate).toISOString() : `${dueDate}T23:59:59`;

  const { error } = await supabase.from("assignments").insert({
    class_subject_id: classSubjectId,
    title,
    description: description || null,
    due_date: dueDateIso,
    max_score: maxScore,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/teacher/assignments");
  redirect("/teacher/assignments");
}
