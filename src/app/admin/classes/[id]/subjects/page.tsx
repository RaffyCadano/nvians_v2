import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ClassSubjectsClient from "./client";

export default async function ClassSubjectsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [
    { data: cls },
    { data: classSubjects },
    { data: subjects },
    { data: teachers },
  ] = await Promise.all([
    supabase
      .from("classes")
      .select(
        "id, grade_level, section, school_year_id, school_year:school_years(id, name), advisor:teachers(user:users(full_name))"
      )
      .eq("id", id)
      .single(),
    supabase
      .from("class_subjects")
      .select(
        "id, term_id, schedule, subject:subjects(id, name, code), teacher:teachers(id, user:users(full_name))"
      )
      .eq("class_id", id)
      .order("created_at"),
    supabase
      .from("subjects")
      .select("id, name, code")
      .eq("status", "active")
      .order("name"),
    supabase
      .from("teachers")
      .select("id, user:users(full_name)")
      .eq("status", "active")
      .order("created_at"),
  ]);

  if (!cls) notFound();

  // Fetch terms for this class's school year
  const { data: terms } = await supabase
    .from("terms")
    .select("id, name, status, start_date, end_date")
    .eq("school_year_id", cls.school_year_id)
    .order("start_date");

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/classes">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Classes
          </Link>
        </Button>
        <span>/</span>
        <span className="text-gray-900 font-medium">
          {cls.grade_level} - {cls.section}
        </span>
        <span>/</span>
        <span>Subjects</span>
      </div>

      <ClassSubjectsClient
        cls={cls}
        classSubjects={classSubjects ?? []}
        subjects={subjects ?? []}
        teachers={teachers ?? []}
        terms={terms ?? []}
      />
    </div>
  );
}
