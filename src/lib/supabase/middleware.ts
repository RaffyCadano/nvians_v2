import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  getAdminDashboardPath,
  isAdminAreaPath,
  isAdminPortalPublicPath,
  toAdminInternalPath,
  toAdminPublicPath,
} from "@/lib/admin-routes";
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

function applyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie);
  });
  return to;
}

function applyHostRouting(request: NextRequest, cookieSource?: NextResponse) {
  const host = request.headers.get("host");
  const { pathname, search } = request.nextUrl;
  const onAdminHost = isAdminHost(host);
  const onLocal = isLocalHost(host);

  if (onLocal) {
    if (pathname.startsWith("/admin/") || pathname === "/admin") {
      return redirectWithCookies(
        `${request.nextUrl.origin}${toAdminPublicPath(pathname)}${search}`,
        cookieSource
      );
    }
    return null;
  }

  if (onAdminHost) {
    if (pathname === "/" || pathname === "/admin" || pathname === "/admin/") {
      return redirectWithCookies(
        `${request.nextUrl.origin}/dashboard${search}`,
        cookieSource
      );
    }

    if (pathname.startsWith("/admin/") || pathname === "/admin") {
      return redirectWithCookies(
        `${request.nextUrl.origin}${toAdminPublicPath(pathname)}${search}`,
        cookieSource
      );
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
    return redirectWithCookies(
      `${getAdminAppUrl()}${toAdminPublicPath(pathname)}${search}`,
      cookieSource
    );
  }

  if (isAdminPortalPublicPath(pathname)) {
    return redirectWithCookies(
      `${getAdminAppUrl()}${pathname}${search}`,
      cookieSource
    );
  }

  return null;
}

export async function updateSession(request: NextRequest) {
  const host = request.headers.get("host");
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
    return finalizeAdminRewrite(request, supabaseResponse, host);
  }

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  const inPortal =
    isAdminAreaPath(pathname, host) ||
    pathname.startsWith("/teacher") ||
    pathname.startsWith("/student");

  if (user && inPortal) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role as string | undefined;

    if (!role) return finalizeAdminRewrite(request, supabaseResponse, host);

    const redirectTo = (path: string) => {
      const url = request.nextUrl.clone();
      url.pathname = path;
      return redirectWithCookies(url.toString(), supabaseResponse);
    };

    if (role === "admin" || role === "staff") {
      if (!isAdminAreaPath(pathname, host)) {
        return redirectTo(getAdminDashboardPath(host));
      }
    } else if (role === "teacher") {
      if (!pathname.startsWith("/teacher")) return redirectTo("/teacher/dashboard");
    } else if (role === "student") {
      if (!pathname.startsWith("/student")) return redirectTo("/student/dashboard");
    }
  }

  return finalizeAdminRewrite(request, supabaseResponse, host);
}

function finalizeAdminRewrite(
  request: NextRequest,
  supabaseResponse: NextResponse,
  host: string | null
) {
  const { pathname } = request.nextUrl;

  if (
    (isAdminHost(host) || isLocalHost(host)) &&
    isAdminPortalPublicPath(pathname)
  ) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = toAdminInternalPath(pathname);
    return applyCookies(supabaseResponse, NextResponse.rewrite(rewriteUrl, { request }));
  }

  return supabaseResponse;
}
