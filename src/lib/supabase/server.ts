import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { getRequestHost } from "@/lib/request-host";
import { getSupabaseCookieOptions } from "@/lib/supabase/cookie-options";

export async function createClient() {
  const cookieStore = await cookies();
  const host = getRequestHost(await headers());
  const cookieOptions = getSupabaseCookieOptions(host);

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component — cookies can only be set in Server Actions / Route Handlers
          }
        },
      },
      ...(cookieOptions ? { cookieOptions } : {}),
    }
  );
}
