"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createClass(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("classes").insert({
    grade_level: formData.get("grade_level") as string,
    section: formData.get("section") as string,
    school_year_id: formData.get("school_year_id") as string,
    advisor_id: (formData.get("advisor_id") as string) || null,
    status: formData.get("status") as string || "active",
  });

  if (error) return { error: error.message };
  redirect("/admin/classes");
}

export async function updateClass(id: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("classes").update({
    grade_level: formData.get("grade_level") as string,
    section: formData.get("section") as string,
    school_year_id: formData.get("school_year_id") as string,
    advisor_id: (formData.get("advisor_id") as string) || null,
    status: formData.get("status") as string,
  }).eq("id", id);

  if (error) return { error: error.message };
  redirect("/admin/classes");
}
