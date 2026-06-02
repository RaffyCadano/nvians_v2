"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createSchoolYear(formData: FormData) {
  const supabase = await createClient();

  const isActive = formData.get("is_active") === "true";
  const { error } = await supabase.from("school_years").insert({
    name: formData.get("name") as string,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
    status: isActive ? "active" : "upcoming",
  });

  if (error) return { error: error.message };
  redirect("/admin/school-years");
}

export async function updateSchoolYear(id: string, formData: FormData) {
  const supabase = await createClient();

  const isActive = formData.get("is_active") === "true";
  const { error } = await supabase.from("school_years").update({
    name: formData.get("name") as string,
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
    status: isActive ? "active" : "upcoming",
  }).eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}
