import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type GradeCategoryRow = {
  id: string;
  name: string;
  weight: number;
  items: { id: string; name: string; maxScore: number }[];
};

export type GradeItemOption = {
  id: string;
  name: string;
  maxScore: number;
  categoryName: string;
};

export async function verifyTeacherOwnsClassSubject(
  teacherUserId: string,
  classSubjectId: string
): Promise<{ id: string; class_id: string } | null> {
  const supabase = await createClient();

  const { data: teacher } = await supabase
    .from("teachers")
    .select("id")
    .eq("user_id", teacherUserId)
    .maybeSingle();

  if (!teacher) return null;

  const { data: classSubject } = await supabase
    .from("class_subjects")
    .select("id, class_id")
    .eq("id", classSubjectId)
    .eq("teacher_id", teacher.id)
    .maybeSingle();

  return classSubject;
}

export async function loadGradeCategoriesForClassSubject(
  classSubjectId: string
): Promise<GradeCategoryRow[]> {
  const admin = createAdminClient();

  const { data: categories, error } = await admin
    .from("grade_categories")
    .select("id, name, weight, grade_items(id, name, max_score)")
    .eq("class_subject_id", classSubjectId)
    .order("name");

  if (error) throw new Error(error.message);

  return (categories ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    weight: Number(c.weight),
    items: (c.grade_items ?? []).map((item: { id: string; name: string; max_score: number }) => ({
      id: item.id,
      name: item.name,
      maxScore: Number(item.max_score),
    })),
  }));
}

export function flattenGradeItems(categories: GradeCategoryRow[]): GradeItemOption[] {
  return categories.flatMap((c) =>
    c.items.map((item) => ({
      id: item.id,
      name: item.name,
      maxScore: item.maxScore,
      categoryName: c.name,
    }))
  );
}

export async function loadScoresForGradeItem(
  gradeItemId: string
): Promise<Record<string, number>> {
  const admin = createAdminClient();

  const { data: scores, error } = await admin
    .from("grade_scores")
    .select("student_id, score")
    .eq("grade_item_id", gradeItemId);

  if (error) throw new Error(error.message);

  return Object.fromEntries((scores ?? []).map((s) => [s.student_id, Number(s.score)]));
}
