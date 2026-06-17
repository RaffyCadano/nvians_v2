import { createClient } from "@/lib/supabase/server";
import NewSubjectForm from "./new-subject-form";

type SubjectRow = {
  id: string;
  name: string;
  code: string;
  status: string;
  class_subjects: { count: number }[];
};

export default async function NewSubjectPage() {
  const supabase = await createClient();

  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, name, code, status, class_subjects(count)")
    .order("name");

  const rows = (subjects ?? []) as SubjectRow[];
  const activeCount = rows.filter((s) => s.status === "active").length;
  const assignedCount = rows.filter((s) => (s.class_subjects?.[0]?.count ?? 0) > 0).length;

  const topAssigned = [...rows]
    .sort(
      (a, b) =>
        (b.class_subjects?.[0]?.count ?? 0) - (a.class_subjects?.[0]?.count ?? 0)
    )
    .filter((s) => (s.class_subjects?.[0]?.count ?? 0) > 0)
    .slice(0, 5);

  return (
    <NewSubjectForm
      stats={{
        total: rows.length,
        active: activeCount,
        assigned: assignedCount,
      }}
      topAssigned={topAssigned.map((s) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        classCount: s.class_subjects?.[0]?.count ?? 0,
      }))}
    />
  );
}
