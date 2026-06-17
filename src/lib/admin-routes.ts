export const ADMIN_ROUTE_SEGMENTS = [
  "dashboard",
  "school-years",
  "classes",
  "subjects",
  "teachers",
  "students",
  "enrollment",
  "attendance",
  "grades",
  "reports",
  "cms",
  "settings",
] as const;

export function isAdminPortalPublicPath(pathname: string) {
  const segment = pathname.split("/").filter(Boolean)[0];
  return ADMIN_ROUTE_SEGMENTS.includes(segment as (typeof ADMIN_ROUTE_SEGMENTS)[number]);
}

/** Strip /admin prefix (e.g. /admin/dashboard → /dashboard). */
export function toAdminPublicPath(internalPath: string) {
  const publicPath = internalPath.replace(/^\/admin\/?/, "/");
  return publicPath === "/" ? "/dashboard" : publicPath;
}

/** Map clean URL to internal app route (e.g. /dashboard → /admin/dashboard). */
export function toAdminInternalPath(publicPath: string) {
  if (publicPath === "/" || publicPath === "") return "/admin/dashboard";
  if (publicPath.startsWith("/admin")) return publicPath;
  return `/admin${publicPath}`;
}

export function isAdminAreaPath(pathname: string, _host: string | null) {
  return isAdminPortalPublicPath(pathname) || pathname.startsWith("/admin");
}

export function getAdminDashboardPath(_host: string | null) {
  return "/dashboard";
}

export function getAdminDashboardUrl(_host: string | null) {
  return "/dashboard";
}

/**
 * Resolve an admin route for links/redirects.
 * Accepts either /admin/students or /students — returns the correct href.
 */
export function adminPath(path: string, _host: string | null) {
  const clean = path.startsWith("/admin") ? toAdminPublicPath(path) : path;
  return clean;
}

export function adminNavHref(internalPath: string, host: string | null) {
  return adminPath(internalPath, host);
}

export function adminNavActive(
  pathname: string,
  routePath: string,
  host: string | null
) {
  const clean = routePath.startsWith("/admin") ? toAdminPublicPath(routePath) : routePath;
  const internal = toAdminInternalPath(clean);
  return (
    pathname === clean ||
    pathname.startsWith(`${clean}/`) ||
    pathname === internal ||
    pathname.startsWith(`${internal}/`)
  );
}

/** Canonical clean paths for sidebar navigation. */
export const ADMIN_NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/school-years", label: "School Years" },
  { href: "/classes", label: "Classes" },
  { href: "/subjects", label: "Subjects" },
  { href: "/teachers", label: "Teachers" },
  { href: "/students", label: "Students" },
  { href: "/enrollment", label: "Enrollment" },
  { href: "/attendance", label: "Attendance" },
  { href: "/grades", label: "Grades" },
  { href: "/reports", label: "Reports" },
  { href: "/cms", label: "Website CMS" },
  { href: "/settings", label: "Settings" },
] as const;
