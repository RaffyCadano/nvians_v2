import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { NewAssignmentForm } from "./new-assignment-form";

function relationOne<T>(value: T | T[] | null | undefined): T | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export default async function NewAssignmentPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: teacher } = await supabase
    .from("teachers")
    .select("id")
    .eq("user_id", user?.id ?? "")
    .single();

  const { data: classSubjects } = await supabase
    .from("class_subjects")
    .select("id, subject:subjects(name), class:classes(grade_level, section)")
    .eq("teacher_id", teacher?.id ?? "")
    .order("created_at", { ascending: true });

  const subjectOptions = (classSubjects ?? []).map((cs) => {
    const subject = relationOne(cs.subject);
    const cls = relationOne(cs.class);
    return {
      id: cs.id,
      label: `${subject?.name ?? "Subject"} · ${cls?.grade_level}-${cls?.section}`,
    };
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/teacher/assignments">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New assignment</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create an assignment for one of your subject classes.
          </p>
        </div>
      </div>

      <NewAssignmentForm classSubjects={subjectOptions} />
    </div>
  );
}
