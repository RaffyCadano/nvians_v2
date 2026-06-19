import { getSupabasePublicConfig } from "@/lib/supabase/env";

/** Host-only auth cookies avoid cross-domain issues on App Hosting. */
export function getSharedCookieDomain(_host: string | null) {
  return undefined;
}

export function getSupabaseCookieOptions(_host: string | null) {
  return undefined;
}

export function isSupabaseConfigured() {
  const { url, key } = getSupabasePublicConfig();
  return Boolean(url && key);
}
