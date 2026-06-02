"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function getTeacherClassSubject(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, classSubjectId: string) {
  const { data: teacher } = await supabase
    .from("teachers")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (!teacher) return null;

  const { data: classSubject } = await supabase
    .from("class_subjects")
    .select("id, class_id")
    .eq("id", classSubjectId)
    .eq("teacher_id", teacher.id)
    .maybeSingle();

  return classSubject;
}

function gradesPaths(classSubjectId: string) {
  return {
    categories: `/teacher/grades/${classSubjectId}/categories`,
    scores: `/teacher/grades/${classSubjectId}/scores`,
  };
}

export async function createGradeCategory(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be signed in." };

  const classSubjectId = (formData.get("class_subject_id") as string)?.trim();
  const name = (formData.get("name") as string)?.trim();
  const weightRaw = (formData.get("weight") as string)?.trim();

  if (!classSubjectId || !name) {
    return { error: "Name is required." };
  }

  const weight = weightRaw ? Number(weightRaw) : 0;
  if (Number.isNaN(weight) || weight < 0) {
    return { error: "Weight must be a non-negative number." };
  }

  const classSubject = await getTeacherClassSubject(supabase, user.id, classSubjectId);
  if (!classSubject) {
    return { error: "You are not assigned to this subject class." };
  }

  const { error } = await supabase.from("grade_categories").insert({
    class_subject_id: classSubjectId,
    name,
    weight,
  });

  if (error) return { error: error.message };

  revalidatePath(gradesPaths(classSubjectId).categories);
  revalidatePath(gradesPaths(classSubjectId).scores);
  return { success: true };
}

export async function createGradeItem(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be signed in." };

  const classSubjectId = (formData.get("class_subject_id") as string)?.trim();
  const categoryId = (formData.get("category_id") as string)?.trim();
  const name = (formData.get("name") as string)?.trim();
  const maxScoreRaw = (formData.get("max_score") as string)?.trim();

  if (!classSubjectId || !categoryId || !name) {
    return { error: "Category and item name are required." };
  }

  const maxScore = maxScoreRaw ? Number(maxScoreRaw) : 100;
  if (Number.isNaN(maxScore) || maxScore <= 0) {
    return { error: "Max score must be a positive number." };
  }

  const classSubject = await getTeacherClassSubject(supabase, user.id, classSubjectId);
  if (!classSubject) {
    return { error: "You are not assigned to this subject class." };
  }

  const { data: category } = await supabase
    .from("grade_categories")
    .select("id")
    .eq("id", categoryId)
    .eq("class_subject_id", classSubjectId)
    .maybeSingle();

  if (!category) {
    return { error: "Category not found for this class." };
  }

  const { error } = await supabase.from("grade_items").insert({
    category_id: categoryId,
    name,
    max_score: maxScore,
  });

  if (error) return { error: error.message };

  revalidatePath(gradesPaths(classSubjectId).categories);
  revalidatePath(gradesPaths(classSubjectId).scores);
  return { success: true };
}

export async function saveGradeScore(gradeItemId: string, studentId: string, score: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be signed in." };

  if (Number.isNaN(score) || score < 0) {
    return { error: "Score must be a non-negative number." };
  }

  const { data: item } = await supabase
    .from("grade_items")
    .select("id, max_score, category:grade_categories(class_subject_id)")
    .eq("id", gradeItemId)
    .single();

  if (!item) {
    return { error: "Grade item not found." };
  }

  const category = Array.isArray(item.category) ? item.category[0] : item.category;
  const classSubjectId = category?.class_subject_id as string | undefined;

  if (!classSubjectId) {
    return { error: "Grade item not found." };
  }

  const classSubject = await getTeacherClassSubject(supabase, user.id, classSubjectId);
  if (!classSubject) {
    return { error: "You cannot edit scores for this class." };
  }

  if (score > Number(item.max_score)) {
    return { error: `Score cannot exceed ${item.max_score}.` };
  }

  const { error } = await supabase.from("grade_scores").upsert(
    {
      grade_item_id: gradeItemId,
      student_id: studentId,
      score,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "grade_item_id,student_id" }
  );

  if (error) return { error: error.message };

  revalidatePath(gradesPaths(classSubjectId).scores);
  return { success: true };
}
