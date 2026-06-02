"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export async function createTeacher(formData: FormData) {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const fullName = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const employeeNumber = formData.get("employee_number") as string;
  const department = formData.get("department") as string;
  const specialization = formData.get("specialization") as string;

  // Create auth user using service role key
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role: "teacher" },
  });

  if (authError) {
    return { error: authError.message };
  }

  // Upsert the users row (may not exist yet if no trigger)
  const { error: userError } = await adminClient.from("users").upsert({
    id: authData.user.id,
    email,
    full_name: fullName,
    role: "teacher",
  }, { onConflict: "id" });

  if (userError) return { error: userError.message };

  // Create teacher profile
  const { error: teacherError } = await supabase.from("teachers").insert({
    user_id: authData.user.id,
    employee_number: employeeNumber || null,
    department: department || null,
    specialization: specialization || null,
  });

  if (teacherError) {
    return { error: teacherError.message };
  }

  redirect("/admin/teachers");
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
