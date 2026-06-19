import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/lib/supabase/env";

let browserClient: SupabaseClient | null = null;
let browserClientPromise: Promise<SupabaseClient> | null = null;

async function loadRuntimeConfig() {
  const local = getSupabasePublicConfig();
  if (local.url && local.key) {
    return { url: local.url, key: local.key };
  }

  const response = await fetch("/api/auth/config", { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Authentication is not configured on this site.");
  }

  const data = (await response.json()) as { url?: string; key?: string };
  if (!data.url || !data.key) {
    throw new Error("Authentication is not configured on this site.");
  }

  return { url: data.url, key: data.key };
}

export async function createClient() {
  if (browserClient) {
    return browserClient;
  }

  if (!browserClientPromise) {
    browserClientPromise = loadRuntimeConfig().then(({ url, key }) => {
      browserClient = createBrowserClient(url, key);
      return browserClient;
    });
  }

  return browserClientPromise;
}
