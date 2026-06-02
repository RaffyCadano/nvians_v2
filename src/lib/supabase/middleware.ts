import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Public paths that don't require auth
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

    // Helper to build redirect response (preserving cookies)
    const redirectTo = (path: string) => {
      const url = request.nextUrl.clone();
      url.pathname = path;
      const res = NextResponse.redirect(url);
      // Forward cookies so session isn't broken
      supabaseResponse.cookies.getAll().forEach((c) => res.cookies.set(c));
      return res;
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
    // Unknown role → back to login
    else {
      return redirectTo("/auth/login");
    }
  }

  return supabaseResponse;
}
