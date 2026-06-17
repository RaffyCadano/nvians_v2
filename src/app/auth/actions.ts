"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthBaseUrl } from "@/lib/site-urls";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  // Get user role via admin client (bypasses RLS)
  const { data: { user } } = await supabase.auth.getUser();
  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from("users")
    .select("role")
    .eq("id", user?.id)
    .single();

  const role = profile?.role ?? (user?.user_metadata?.role as string | undefined);

  revalidatePath("/", "layout");

  switch (role) {
    case "admin":
    case "staff":
      redirect("/admin/dashboard");
    case "teacher":
      redirect("/teacher/dashboard");
    case "student":
      redirect("/student/dashboard");
    default:
      redirect("/student/dashboard");
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: formData.get("full_name") as string,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/auth/verify-email");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/auth/login");
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();
  const host = (await headers()).get("host");
  const authBaseUrl = getAuthBaseUrl(host);

  const { error } = await supabase.auth.resetPasswordForEmail(
    formData.get("email") as string,
    { redirectTo: `${authBaseUrl}/auth/reset-password` }
  );

  if (error) {
    return { error: error.message };
  }

  return { success: "Check your email for the password reset link." };
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: formData.get("password") as string,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/auth/login?message=Password updated successfully");
}
