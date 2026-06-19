"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { assertSupabasePublicConfig } from "@/lib/supabase/env";
import { getAuthBaseUrl, getDashboardUrl } from "@/lib/site-urls";
import { getRequestHost } from "@/lib/request-host";

export async function login(formData: FormData) {
  const configError = assertSupabasePublicConfig();
  if (configError) {
    return { error: configError };
  }

  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error: signInError } = await supabase.auth.signInWithPassword(data);

  if (signInError) {
    return { error: signInError.message };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return { error: userError.message };
  }

  if (!user) {
    return {
      error:
        "Sign in succeeded but your session could not be started. Try again or clear site cookies.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? (user.user_metadata?.role as string | undefined);

  if (profileError && !role) {
    return {
      error:
        "Your account could not be loaded. Contact the school office if this continues.",
    };
  }

  if (!role) {
    return {
      error: "Your account is missing a role. Contact the school office.",
    };
  }

  revalidatePath("/", "layout");

  const host = getRequestHost(await headers());
  return { success: true, redirectTo: getDashboardUrl(role, host) };
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
  const host = getRequestHost(await headers());
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
