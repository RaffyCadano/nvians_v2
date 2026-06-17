const DEFAULT_ADMIN_HOST = "admin.dashboard.nvians.com";
const DEFAULT_PUBLIC_URL = "https://nvians.com";

export function getAdminHost() {
  return process.env.NEXT_PUBLIC_ADMIN_HOST ?? DEFAULT_ADMIN_HOST;
}

export function getPublicAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? DEFAULT_PUBLIC_URL;
}

export function getAdminAppUrl() {
  return process.env.NEXT_PUBLIC_ADMIN_URL ?? `https://${getAdminHost()}`;
}

export function normalizeHost(host: string | null) {
  return (host ?? "").split(":")[0].toLowerCase();
}

export function isAdminHost(host: string | null) {
  const normalized = normalizeHost(host);
  const adminHost = getAdminHost();
  return normalized === adminHost || normalized === `www.${adminHost}`;
}

export function isLocalHost(host: string | null) {
  const normalized = normalizeHost(host);
  return normalized === "localhost" || normalized === "127.0.0.1";
}

/** Base URL for auth emails/callbacks when the request originates from the admin host. */
export function getAuthBaseUrl(host: string | null) {
  if (isAdminHost(host) || isLocalHost(host)) {
    return isLocalHost(host) ? "http://localhost:3000" : getAdminAppUrl();
  }
  return getPublicAppUrl();
}
