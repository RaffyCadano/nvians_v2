"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSchoolInfo(formData: FormData) {
  // School info is stored in env/config — for now just revalidate
  revalidatePath("/admin/settings");
  return { success: true };
}

export async function changePassword(formData: FormData) {
  const supabase = await createClient();
  const newPassword = formData.get("new_password") as string;
  const confirm = formData.get("confirm_password") as string;

  if (newPassword !== confirm) return { error: "Passwords do not match." };
  if (newPassword.length < 8) return { error: "Password must be at least 8 characters." };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: error.message };

  return { success: true };
}
