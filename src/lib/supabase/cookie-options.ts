import { isLocalHost, normalizeHost } from "@/lib/site-urls";

export function getSharedCookieDomain(host: string | null) {
  const normalized = normalizeHost(host);
  if (!normalized || isLocalHost(normalized)) return undefined;
  if (normalized === "nvians.com" || normalized.endsWith(".nvians.com")) {
    return ".nvians.com";
  }
  return undefined;
}

export function getSupabaseCookieOptions(host: string | null) {
  const domain = getSharedCookieDomain(host);
  if (!domain) return undefined;

  return {
    domain,
    path: "/",
    sameSite: "lax" as const,
    secure: true,
  };
}
