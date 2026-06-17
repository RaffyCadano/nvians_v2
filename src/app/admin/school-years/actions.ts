"use server";

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
    return { error: "You do not have permission to manage school years." as const };
  }

  return { user };
}

export async function createSchoolYear(formData: FormData) {
  const access = await assertAdminAccess();
  if ("error" in access) return access;

  const name = (formData.get("name") as string)?.trim();
  const startDate = (formData.get("start_date") as string)?.trim();
  const endDate = (formData.get("end_date") as string)?.trim();
  const isActive = formData.get("is_active") === "true";

  if (!name || !startDate || !endDate) {
    return { error: "School year name, start date, and end date are required." };
  }

  if (new Date(endDate) <= new Date(startDate)) {
    return { error: "End date must be after start date." };
  }

  const supabase = createAdminClient();

  if (isActive) {
    const { error: archiveError } = await supabase
      .from("school_years")
      .update({ status: "archived" })
      .eq("status", "active");

    if (archiveError) return { error: archiveError.message };
  }

  const { data, error } = await supabase
    .from("school_years")
    .insert({
      name,
      start_date: startDate,
      end_date: endDate,
      status: isActive ? "active" : "upcoming",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  if (!data) return { error: "School year was not created. Please try again." };
  return { success: true, id: data.id };
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

export async function deleteSchoolYear(id: string) {
  const access = await assertAdminAccess();
  if ("error" in access) return access;

  const supabase = createAdminClient();

  const { data: year, error: fetchError } = await supabase
    .from("school_years")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) return { error: fetchError.message };
  if (!year) return { error: "School year not found." };

  const { error } = await supabase.from("school_years").delete().eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}
