import { createAdminClient } from "@/lib/supabase/admin";
import NewSchoolYearForm from "./new-form";

export default async function NewSchoolYearPage() {
  const supabase = createAdminClient();

  const { data: schoolYears } = await supabase.from("school_years").select("id, status");

  const years = schoolYears ?? [];

  return (
    <NewSchoolYearForm
      stats={{
        total: years.length,
        hasActive: years.some((y) => y.status === "active"),
        upcoming: years.filter((y) => y.status === "upcoming").length,
      }}
    />
  );
}
