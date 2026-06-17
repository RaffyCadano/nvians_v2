import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import SchoolYearDetailForm from "./detail-form";

export default async function SchoolYearDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: schoolYear, error },
    { count: termCount },
    { count: classCount },
    { count: enrollmentCount },
  ] = await Promise.all([
    supabase.from("school_years").select("*").eq("id", id).single(),
    supabase.from("terms").select("*", { count: "exact", head: true }).eq("school_year_id", id),
    supabase.from("classes").select("*", { count: "exact", head: true }).eq("school_year_id", id),
    supabase
      .from("enrollments")
      .select("*", { count: "exact", head: true })
      .eq("school_year_id", id),
  ]);

  if (error || !schoolYear) {
    notFound();
  }

  return (
    <SchoolYearDetailForm
      schoolYear={schoolYear}
      stats={{
        terms: termCount ?? 0,
        classes: classCount ?? 0,
        enrollments: enrollmentCount ?? 0,
      }}
    />
  );
}
