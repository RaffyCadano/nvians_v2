import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { assertSupabasePublicConfig } from "@/lib/supabase/env";
import { getDashboardUrl } from "@/lib/site-urls";

export async function POST(request: Request) {
  const configError = assertSupabasePublicConfig();
  if (configError) {
    return NextResponse.json({ error: configError }, { status: 503 });
  }

  let email = "";
  let password = "";

  try {
    const body = await request.json();
    email = String(body.email ?? "").trim();
    password = String(body.password ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return NextResponse.json({ error: signInError.message }, { status: 401 });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 500 });
  }

  if (!user) {
    return NextResponse.json(
      {
        error:
          "Sign in succeeded but your session could not be started. Try again or clear site cookies.",
      },
      { status: 500 }
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? (user.user_metadata?.role as string | undefined);

  if (profileError && !role) {
    return NextResponse.json(
      {
        error:
          "Your account could not be loaded. Contact the school office if this continues.",
      },
      { status: 500 }
    );
  }

  if (!role) {
    return NextResponse.json(
      { error: "Your account is missing a role. Contact the school office." },
      { status: 403 }
    );
  }

  return NextResponse.json({ redirectTo: getDashboardUrl(role, null) });
}
