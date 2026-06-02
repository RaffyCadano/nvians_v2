import { createClient } from "@/lib/supabase/server";
import EnrollmentForm from "./enrollment-form";

export default async function NewEnrollmentPage() {
  const supabase = await createClient();

  const [{ data: students }, { data: classes }, { data: schoolYears }] = await Promise.all([
    supabase
      .from("students")
      .select("id, student_number, user:users(full_name)")
      .eq("status", "active")
      .order("created_at", { ascending: false }),
    supabase
      .from("classes")
      .select("id, grade_level, section, school_year:school_years(id, name)")
      .eq("status", "active")
      .order("grade_level"),
    supabase
      .from("school_years")
      .select("id, name")
      .order("start_date", { ascending: false }),
  ]);

  return (
    <EnrollmentForm
      students={students ?? []}
      classes={classes ?? []}
      schoolYears={schoolYears ?? []}
    />
  );
}
