"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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
    return { error: "You do not have permission to manage teachers." as const };
  }

  return { user };
}

export async function createTeacher(formData: FormData) {
  const access = await assertAdminAccess();
  if ("error" in access) return access;

  const fullName = (formData.get("full_name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const employeeNumber = (formData.get("employee_number") as string)?.trim();
  const department = (formData.get("department") as string)?.trim();
  const specialization = (formData.get("specialization") as string)?.trim();

  if (!fullName || !email || !password) {
    return { error: "Full name, email, and password are required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const adminClient = createAdminClient();

  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role: "teacher" },
  });

  if (authError) {
    return { error: authError.message };
  }

  const { error: userError } = await adminClient.from("users").upsert(
    {
      id: authData.user.id,
      email,
      full_name: fullName,
      role: "teacher",
      is_active: true,
    },
    { onConflict: "id" }
  );

  if (userError) return { error: userError.message };

  await adminClient
    .from("users")
    .update({ role: "teacher", full_name: fullName, email })
    .eq("id", authData.user.id);

  const { error: teacherError } = await adminClient.from("teachers").insert({
    user_id: authData.user.id,
    employee_number: employeeNumber || null,
    department: department || null,
    specialization: specialization || null,
    status: "active",
  });

  if (teacherError) {
    return { error: teacherError.message };
  }

  return { success: true };
}

export async function updateTeacher(id: string, formData: FormData) {
  const supabase = await createClient();

  const employeeNumber = formData.get("employee_number") as string;
  const department = formData.get("department") as string;
  const specialization = formData.get("specialization") as string;
  const status = formData.get("status") as string;
  const fullName = formData.get("full_name") as string;
  const userId = formData.get("user_id") as string;

  await supabase.from("users").update({ full_name: fullName }).eq("id", userId);

  const { error } = await supabase.from("teachers").update({
    employee_number: employeeNumber || null,
    department: department || null,
    specialization: specialization || null,
    status,
  }).eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}
