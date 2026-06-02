import { createClient } from "@/lib/supabase/server";
import NewClassForm from "./form";

export default async function NewClassPage() {
  const supabase = await createClient();

  const [{ data: schoolYears }, { data: teachers }] = await Promise.all([
    supabase.from("school_years").select("id, name").order("start_date", { ascending: false }),
    supabase.from("teachers").select("id, user:users(full_name)").eq("status", "active"),
  ]);

  return <NewClassForm schoolYears={schoolYears ?? []} teachers={teachers ?? []} />;
}
