const DEFAULT_PUBLIC_URL = "https://nvians.com";

export function getPublicAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? DEFAULT_PUBLIC_URL;
}

export function normalizeHost(host: string | null) {
  return (host ?? "").split(":")[0].toLowerCase();
}

export function isLocalHost(host: string | null) {
  const normalized = normalizeHost(host);
  return normalized === "localhost" || normalized === "127.0.0.1";
}

/** Admin portal on the main domain. */
export function getAdminPortalUrl() {
  return `${getPublicAppUrl()}/dashboard`;
}

/** Dashboard URL for a role. */
export function getDashboardUrl(role: string, _host: string | null) {
  if (role === "admin" || role === "staff") {
    return "/dashboard";
  }

  if (role === "teacher") return "/teacher/dashboard";
  return "/student/dashboard";
}

/** Base URL for auth emails/callbacks. */
export function getAuthBaseUrl(host: string | null) {
  if (isLocalHost(host)) return "http://localhost:3000";
  return getPublicAppUrl();
}
