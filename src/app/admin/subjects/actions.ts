"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createSubject(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("subjects").insert({
    name: formData.get("name") as string,
    code: formData.get("code") as string,
    description: (formData.get("description") as string) || null,
  });

  if (error) return { error: error.message };
  redirect("/subjects");
}

export async function updateSubject(id: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("subjects").update({
    name: formData.get("name") as string,
    code: formData.get("code") as string,
    description: (formData.get("description") as string) || null,
    status: formData.get("status") as string,
  }).eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}
