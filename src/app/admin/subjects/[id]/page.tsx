import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import SubjectDetailForm from "./detail-form";

function relationOne<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

type ClassLink = {
  id: string;
  class: {
    id: string;
    grade_level: string;
    section: string;
    school_year: { name: string } | null;
  } | null;
};

export default async function SubjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: subject, error } = await supabase
    .from("subjects")
    .select(
      `
      *,
      class_subjects(
        id,
        class:classes(
          id,
          grade_level,
          section,
          school_year:school_years(name)
        )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !subject) {
    notFound();
  }

  const classLinks = (subject.class_subjects ?? []) as ClassLink[];

  return (
    <SubjectDetailForm
      subject={{
        id: subject.id,
        name: subject.name,
        code: subject.code,
        description: subject.description,
        status: subject.status as "active" | "archived",
        created_at: subject.created_at,
      }}
      classLinks={classLinks.map((link) => {
        const cls = relationOne(link.class);
        const schoolYear = relationOne(cls?.school_year);
        return {
          id: link.id,
          classId: cls?.id ?? "",
          gradeLevel: cls?.grade_level ?? "—",
          section: cls?.section ?? "—",
          schoolYear: schoolYear?.name ?? "—",
        };
      })}
    />
  );
}
