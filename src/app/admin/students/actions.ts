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
    return { error: "You do not have permission to manage students." as const };
  }

  return { user };
}

export async function createStudent(formData: FormData) {
  const access = await assertAdminAccess();
  if ("error" in access) return access;

  const fullName = (formData.get("full_name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const studentNumber = (formData.get("student_number") as string)?.trim();
  const dateOfBirth = (formData.get("date_of_birth") as string)?.trim();
  const gender = (formData.get("gender") as string)?.trim();
  const address = (formData.get("address") as string)?.trim();
  const parentName = (formData.get("parent_name") as string)?.trim();
  const parentContact = (formData.get("parent_contact") as string)?.trim();

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
    user_metadata: { full_name: fullName, role: "student" },
  });

  if (authError) return { error: authError.message };

  const { error: userError } = await adminClient.from("users").upsert(
    {
      id: authData.user.id,
      email,
      full_name: fullName,
      role: "student",
      is_active: true,
    },
    { onConflict: "id" }
  );

  if (userError) {
    await adminClient.auth.admin.deleteUser(authData.user.id);
    return { error: userError.message };
  }

  const { error: studentError } = await adminClient.from("students").insert({
    user_id: authData.user.id,
    student_number: studentNumber || null,
    date_of_birth: dateOfBirth || null,
    gender: gender || null,
    address: address || null,
    parent_name: parentName || null,
    parent_contact: parentContact || null,
    status: "active",
  });

  if (studentError) {
    await adminClient.auth.admin.deleteUser(authData.user.id);
    return { error: studentError.message };
  }

  return { success: true };
}

export async function updateStudent(id: string, formData: FormData) {
  const access = await assertAdminAccess();
  if ("error" in access) return access;

  const fullName = (formData.get("full_name") as string)?.trim();
  const userId = (formData.get("user_id") as string)?.trim();
  const status = (formData.get("status") as string)?.trim();

  if (!fullName || !userId) {
    return { error: "Full name is required." };
  }

  if (status && !["active", "disabled"].includes(status)) {
    return { error: "Status must be active or disabled." };
  }

  const adminClient = createAdminClient();

  const { error: userError } = await adminClient
    .from("users")
    .update({ full_name: fullName })
    .eq("id", userId);

  if (userError) return { error: userError.message };

  const { error } = await adminClient
    .from("students")
    .update({
      student_number: ((formData.get("student_number") as string) ?? "").trim() || null,
      date_of_birth: ((formData.get("date_of_birth") as string) ?? "").trim() || null,
      gender: ((formData.get("gender") as string) ?? "").trim() || null,
      address: ((formData.get("address") as string) ?? "").trim() || null,
      parent_name: ((formData.get("parent_name") as string) ?? "").trim() || null,
      parent_contact: ((formData.get("parent_contact") as string) ?? "").trim() || null,
      status: status || "active",
    })
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteStudent(id: string) {
  const access = await assertAdminAccess();
  if ("error" in access) return access;

  const adminClient = createAdminClient();

  const { data: student, error: fetchError } = await adminClient
    .from("students")
    .select("id, user_id, user:users(full_name, email)")
    .eq("id", id)
    .single();

  if (fetchError || !student) {
    return { error: fetchError?.message ?? "Student not found." };
  }

  const { count: enrollmentCount, error: countError } = await adminClient
    .from("enrollments")
    .select("*", { count: "exact", head: true })
    .eq("student_id", id);

  if (countError) return { error: countError.message };

  const { error: authError } = await adminClient.auth.admin.deleteUser(student.user_id);

  if (authError) return { error: authError.message };

  return { success: true, removedEnrollments: enrollmentCount ?? 0 };
}
