"use server";

import { isAllowedGradeLevel } from "@/lib/constants/grade-levels";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function assertAdminAccess() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." as const };
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "staff"].includes(profile.role)) {
    return { error: "You do not have permission to manage classes." as const };
  }

  return { user };
}

export async function createClass(formData: FormData) {
  const access = await assertAdminAccess();
  if ("error" in access) return access;

  const gradeLevel = (formData.get("grade_level") as string)?.trim();
  const section = (formData.get("section") as string)?.trim();
  const schoolYearId = (formData.get("school_year_id") as string)?.trim();

  if (!schoolYearId) {
    return { error: "School year is required." };
  }

  if (!gradeLevel || !isAllowedGradeLevel(gradeLevel)) {
    return { error: "Grade level must be Grade 7 through Grade 12." };
  }

  if (!section) {
    return { error: "Section is required." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("classes").insert({
    grade_level: gradeLevel,
    section,
    school_year_id: schoolYearId,
    advisor_id: (formData.get("advisor_id") as string) || null,
    status: "active",
  });

  if (error) return { error: error.message };
  return { success: true };
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

export async function deleteClass(id: string) {
  const access = await assertAdminAccess();
  if ("error" in access) return access;

  const supabase = createAdminClient();

  const [{ count: enrollmentCount, error: enrollmentError }, { count: subjectCount, error: subjectError }] =
    await Promise.all([
      supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("class_id", id),
      supabase
        .from("class_subjects")
        .select("*", { count: "exact", head: true })
        .eq("class_id", id),
    ]);

  if (enrollmentError) return { error: enrollmentError.message };
  if (subjectError) return { error: subjectError.message };

  const { error } = await supabase.from("classes").delete().eq("id", id);

  if (error) return { error: error.message };
  return {
    success: true,
    removedEnrollments: enrollmentCount ?? 0,
    removedSubjects: subjectCount ?? 0,
  };
}
