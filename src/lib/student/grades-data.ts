import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function relationOne<T>(value: T | T[] | null | undefined): T | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export type StudentGradeRow = {
  id: string;
  score: number;
  itemName: string;
  maxScore: number;
  categoryName: string;
  subjectName: string;
  classLabel: string;
  termName: string;
};

export type StudentGradeGroup = {
  key: string;
  subject: string;
  class: string;
  term: string;
  items: StudentGradeRow[];
};

export async function loadStudentGrades(
  studentUserId: string
): Promise<StudentGradeGroup[]> {
  const supabase = await createClient();

  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("user_id", studentUserId)
    .maybeSingle();

  if (!student) return [];

  const admin = createAdminClient();
  const { data: scores, error } = await admin
    .from("grade_scores")
    .select(
      `id, score,
      grade_item:grade_items(
        name, max_score,
        category:grade_categories(
          name,
          class_subject:class_subjects(
            subject:subjects(name),
            class:classes(grade_level, section),
            term:terms(name)
          )
        )
      )`
    )
    .eq("student_id", student.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const bySubject: Record<string, StudentGradeGroup> = {};

  for (const row of scores ?? []) {
    const item = relationOne(row.grade_item);
    const category = relationOne(item?.category);
    const classSubject = relationOne(category?.class_subject);
    const subject = relationOne(classSubject?.subject);
    const cls = relationOne(classSubject?.class);
    const term = relationOne(classSubject?.term);

    const subjectName = subject?.name ?? "Subject";
    const classLabel = cls
      ? `${cls.grade_level} - ${cls.section}`
      : "Class";
    const termName = term?.name ?? "";
    const key = `${subjectName}|${classLabel}|${termName}`;

    if (!bySubject[key]) {
      bySubject[key] = {
        key,
        subject: subjectName,
        class: classLabel,
        term: termName,
        items: [],
      };
    }

    bySubject[key].items.push({
      id: row.id,
      score: Number(row.score),
      itemName: item?.name ?? "—",
      maxScore: Number(item?.max_score ?? 0),
      categoryName: category?.name ?? "—",
      subjectName,
      classLabel,
      termName,
    });
  }

  return Object.values(bySubject);
}
