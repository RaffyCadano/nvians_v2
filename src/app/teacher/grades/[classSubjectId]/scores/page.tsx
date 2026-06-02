import { createClient } from "@/lib/supabase/server";
import { getClassRosterForTeacher } from "@/lib/teacher/class-roster";
import {
  flattenGradeItems,
  loadGradeCategoriesForClassSubject,
  loadScoresForGradeItem,
} from "@/lib/teacher/grades-data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { ScoreEntryForm } from "./score-entry-form";

function relationOne<T>(value: T | T[] | null | undefined): T | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export default async function TeacherGradeScoresPage({
  params,
  searchParams,
}: {
  params: Promise<{ classSubjectId: string }>;
  searchParams: Promise<{ item?: string }>;
}) {
  const { classSubjectId } = await params;
  const { item: selectedItemId } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: classSubject } = await supabase
    .from("class_subjects")
    .select(
      `id, class_id,
      subject:subjects(name),
      class:classes(grade_level, section),
      term:terms(name),
      teacher:teachers!inner(user_id)`
    )
    .eq("id", classSubjectId)
    .eq("teachers.user_id", user?.id ?? "")
    .maybeSingle();

  if (!classSubject) notFound();

  const categories = await loadGradeCategoriesForClassSubject(classSubjectId);
  const gradeItems = flattenGradeItems(categories);
  const itemIds = gradeItems.map((i) => i.id);

  const roster = await getClassRosterForTeacher(user?.id ?? "", classSubject.class_id);

  const students = roster
    .map((row) => ({
      id: row.studentId,
      name: row.fullName,
      studentNumber: row.studentNumber,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const activeItemId =
    selectedItemId && itemIds.includes(selectedItemId) ? selectedItemId : gradeItems[0]?.id;

  const scoresByStudent = activeItemId
    ? await loadScoresForGradeItem(activeItemId)
    : {};

  const subject = relationOne(classSubject.subject);
  const cls = relationOne(classSubject.class);
  const term = relationOne(classSubject.term);
  const activeItem = gradeItems.find((i) => i.id === activeItemId);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/teacher/grades">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enter scores</h1>
          <p className="text-sm text-gray-500">
            {subject?.name} · {cls?.grade_level} - {cls?.section} · {term?.name}
          </p>
        </div>
      </div>

      {gradeItems.length > 0 ? (
        <ScoreEntryForm
          key={activeItemId}
          classSubjectId={classSubjectId}
          gradeItems={gradeItems}
          activeItemId={activeItemId ?? ""}
          activeItem={activeItem}
          students={students}
          scoresByStudent={scoresByStudent}
        />
      ) : (
        <div className="rounded-xl border bg-white p-8 text-center text-sm text-gray-500 space-y-4">
          <p>No grade items yet. Add categories and items before entering scores.</p>
          <Button asChild size="sm">
            <Link href={`/teacher/grades/${classSubjectId}/categories`}>
              Set up grade categories
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
