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
    return { error: "You do not have permission to manage subjects." as const };
  }

  return { user };
}

export async function createSubject(formData: FormData) {
  const access = await assertAdminAccess();
  if ("error" in access) return access;

  const name = (formData.get("name") as string)?.trim();
  const code = (formData.get("code") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;

  if (!name || !code) {
    return { error: "Subject name and code are required." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("subjects").insert({
    name,
    code,
    description,
    status: "active",
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function updateSubject(id: string, formData: FormData) {
  const access = await assertAdminAccess();
  if ("error" in access) return access;

  const name = (formData.get("name") as string)?.trim();
  const code = (formData.get("code") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const status = (formData.get("status") as string)?.trim();

  if (!name || !code) {
    return { error: "Subject name and code are required." };
  }

  if (status && !["active", "archived"].includes(status)) {
    return { error: "Status must be active or archived." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("subjects")
    .update({
      name,
      code,
      description,
      status: status || "active",
    })
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}
