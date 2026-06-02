"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export async function createStudent(formData: FormData) {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const fullName = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const studentNumber = formData.get("student_number") as string;
  const dateOfBirth = formData.get("date_of_birth") as string;
  const gender = formData.get("gender") as string;
  const address = formData.get("address") as string;
  const parentName = formData.get("parent_name") as string;
  const parentContact = formData.get("parent_contact") as string;

  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role: "student" },
  });

  if (authError) return { error: authError.message };

  // Upsert the users row (may not exist yet if no trigger)
  const { error: userError } = await adminClient.from("users").upsert({
    id: authData.user.id,
    email,
    full_name: fullName,
    role: "student",
  }, { onConflict: "id" });

  if (userError) return { error: userError.message };

  const { error: studentError } = await supabase.from("students").insert({
    user_id: authData.user.id,
    student_number: studentNumber || null,
    date_of_birth: dateOfBirth || null,
    gender: gender || null,
    address: address || null,
    parent_name: parentName || null,
    parent_contact: parentContact || null,
  });

  if (studentError) return { error: studentError.message };

  redirect("/admin/students");
}

export async function updateStudent(id: string, formData: FormData) {
  const supabase = await createClient();

  const fullName = formData.get("full_name") as string;
  const userId = formData.get("user_id") as string;
  const status = formData.get("status") as string;

  await supabase.from("users").update({ full_name: fullName }).eq("id", userId);

  const { error } = await supabase.from("students").update({
    student_number: formData.get("student_number") as string || null,
    date_of_birth: formData.get("date_of_birth") as string || null,
    gender: formData.get("gender") as string || null,
    address: formData.get("address") as string || null,
    parent_name: formData.get("parent_name") as string || null,
    parent_contact: formData.get("parent_contact") as string || null,
    status,
  }).eq("id", id);

  if (error) return { error: error.message };
  redirect("/admin/students");
}
