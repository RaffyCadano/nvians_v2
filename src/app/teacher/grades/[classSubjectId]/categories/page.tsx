import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { loadGradeCategoriesForClassSubject } from "@/lib/teacher/grades-data";
import { CategoriesManager } from "./categories-manager";

function relationOne<T>(value: T | T[] | null | undefined): T | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export default async function TeacherGradeCategoriesPage({
  params,
}: {
  params: Promise<{ classSubjectId: string }>;
}) {
  const { classSubjectId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: classSubject } = await supabase
    .from("class_subjects")
    .select(
      `id,
      subject:subjects(name),
      class:classes(grade_level, section),
      term:terms(name),
      teacher:teachers!inner(user_id)`
    )
    .eq("id", classSubjectId)
    .eq("teachers.user_id", user?.id ?? "")
    .maybeSingle();

  if (!classSubject) notFound();

  const subject = relationOne(classSubject.subject);
  const cls = relationOne(classSubject.class);
  const term = relationOne(classSubject.term);

  const normalizedCategories = await loadGradeCategoriesForClassSubject(classSubjectId);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/teacher/grades">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grade categories</h1>
          <p className="text-sm text-gray-500">
            {subject?.name} · {cls?.grade_level} - {cls?.section} · {term?.name}
          </p>
        </div>
      </div>

      <CategoriesManager
        classSubjectId={classSubjectId}
        categories={normalizedCategories}
      />
    </div>
  );
}
