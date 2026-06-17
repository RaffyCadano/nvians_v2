import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  getAdminAppUrl,
  getPublicAppUrl,
  isAdminHost,
  isLocalHost,
} from "@/lib/site-urls";

const PUBLIC_SITE_PREFIXES = [
  "/about",
  "/programs",
  "/admissions",
  "/student-life",
  "/facilities",
  "/news",
  "/contact",
];

function redirectWithCookies(url: string, cookieSource?: NextResponse) {
  const response = NextResponse.redirect(url);
  cookieSource?.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });
  return response;
}

function applyHostRouting(request: NextRequest, cookieSource?: NextResponse) {
  const host = request.headers.get("host");
  const { pathname, search } = request.nextUrl;
  const onAdminHost = isAdminHost(host);
  const onLocal = isLocalHost(host);

  if (onLocal) return null;

  if (onAdminHost) {
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/dashboard";
      return redirectWithCookies(url.toString(), cookieSource);
    }

    if (
      PUBLIC_SITE_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
      )
    ) {
      return redirectWithCookies(`${getPublicAppUrl()}${pathname}${search}`, cookieSource);
    }

    if (pathname.startsWith("/teacher") || pathname.startsWith("/student")) {
      return redirectWithCookies(`${getPublicAppUrl()}${pathname}${search}`, cookieSource);
    }

    return null;
  }

  if (pathname.startsWith("/admin")) {
    return redirectWithCookies(`${getAdminAppUrl()}${pathname}${search}`, cookieSource);
  }

  return null;
}

export async function updateSession(request: NextRequest) {
  const hostRedirect = applyHostRouting(request);
  if (hostRedirect) return hostRedirect;

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { pathname } = request.nextUrl;

  const publicPaths = [
    "/",
    "/about",
    "/programs",
    "/admissions",
    "/student-life",
    "/facilities",
    "/news",
    "/contact",
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/callback",
    "/auth/signout",
  ];

  const isPublic =
    publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/public");

  let user = null;

  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    if (!isPublic) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // Not logged in — redirect to login
  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  // Logged in — enforce role-based access for portal routes
  if (user && (pathname.startsWith("/admin") || pathname.startsWith("/teacher") || pathname.startsWith("/student"))) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role as string | undefined;

    // If we can't determine the role (DB error, missing row), allow through
    if (!role) return supabaseResponse;

    // Helper to build redirect response (preserving cookies)
    const redirectTo = (path: string) => {
      const url = request.nextUrl.clone();
      url.pathname = path;
      return redirectWithCookies(url.toString(), supabaseResponse);
    };

    // Admin/staff → only /admin
    if (role === "admin" || role === "staff") {
      if (!pathname.startsWith("/admin")) return redirectTo("/admin/dashboard");
    }
    // Teacher → only /teacher
    else if (role === "teacher") {
      if (!pathname.startsWith("/teacher")) return redirectTo("/teacher/dashboard");
    }
    // Student → only /student
    else if (role === "student") {
      if (!pathname.startsWith("/student")) return redirectTo("/student/dashboard");
    }
  }

  return supabaseResponse;
}
