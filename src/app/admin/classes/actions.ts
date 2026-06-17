"use server";

import { isAllowedGradeLevel } from "@/lib/constants/grade-levels";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createClass(formData: FormData) {
  const supabase = await createClient();

  const gradeLevel = (formData.get("grade_level") as string)?.trim();
  if (!gradeLevel || !isAllowedGradeLevel(gradeLevel)) {
    return { error: "Grade level must be Grade 7 through Grade 12." };
  }

  const { error } = await supabase.from("classes").insert({
    grade_level: gradeLevel,
    section: formData.get("section") as string,
    school_year_id: formData.get("school_year_id") as string,
    advisor_id: (formData.get("advisor_id") as string) || null,
    status: formData.get("status") as string || "active",
  });

  if (error) return { error: error.message };
  redirect("/classes");
}

export async function updateClass(id: string, formData: FormData) {
  const supabase = await createClient();

  const gradeLevel = (formData.get("grade_level") as string)?.trim();
  if (!gradeLevel || !isAllowedGradeLevel(gradeLevel)) {
    return { error: "Grade level must be Grade 7 through Grade 12." };
  }

  const { error } = await supabase.from("classes").update({
    grade_level: gradeLevel,
    section: formData.get("section") as string,
    school_year_id: formData.get("school_year_id") as string,
    advisor_id: (formData.get("advisor_id") as string) || null,
    status: formData.get("status") as string,
  }).eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}
