import { NextResponse } from "next/server";
import { assertSupabasePublicConfig } from "@/lib/supabase/env";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";
import { getDashboardUrl } from "@/lib/site-urls";

function wantsJson(request: Request) {
  return (request.headers.get("content-type") ?? "").includes("application/json");
}

async function parseCredentials(request: Request) {
  if (wantsJson(request)) {
    const body = await request.json();
    return {
      email: String(body.email ?? "").trim(),
      password: String(body.password ?? ""),
    };
  }

  const formData = await request.formData();
  return {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };
}

function loginErrorResponse(request: Request, message: string, status = 400) {
  if (wantsJson(request)) {
    return NextResponse.json({ error: message }, { status });
  }

  const params = new URLSearchParams({ error: message });
  return NextResponse.redirect(`/auth/login?${params.toString()}`, { status: 303 });
}

function redirectWithCookies(pathname: string, cookieSource: NextResponse) {
  const response = NextResponse.redirect(pathname, { status: 303 });
  cookieSource.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });
  return response;
}

export async function handleLoginPost(request: Request) {
  const configError = assertSupabasePublicConfig();
  if (configError) {
    return loginErrorResponse(request, configError, 503);
  }

  let email = "";
  let password = "";

  try {
    ({ email, password } = await parseCredentials(request));
  } catch {
    return loginErrorResponse(request, "Invalid request body.");
  }

  if (!email || !password) {
    return loginErrorResponse(request, "Email and password are required.");
  }

  let response = NextResponse.redirect("/dashboard", { status: 303 });
  const supabase = await createRouteHandlerClient(response);

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return loginErrorResponse(request, signInError.message, 401);
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return loginErrorResponse(request, userError.message, 500);
  }

  if (!user) {
    return loginErrorResponse(
      request,
      "Sign in succeeded but your session could not be started. Try again or clear site cookies.",
      500
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? (user.user_metadata?.role as string | undefined);

  if (profileError && !role) {
    return loginErrorResponse(
      request,
      "Your account could not be loaded. Contact the school office if this continues.",
      500
    );
  }

  if (!role) {
    return loginErrorResponse(
      request,
      "Your account is missing a role. Contact the school office.",
      403
    );
  }

  const destination = getDashboardUrl(role, null);

  if (wantsJson(request)) {
    const jsonResponse = NextResponse.json({ redirectTo: destination });
    response.cookies.getAll().forEach((cookie) => {
      jsonResponse.cookies.set(cookie);
    });
    return jsonResponse;
  }

  if (destination !== "/dashboard") {
    response = redirectWithCookies(destination, response);
  }

  return response;
}
