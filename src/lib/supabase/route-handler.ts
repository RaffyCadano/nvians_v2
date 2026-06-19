import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseCookieOptions } from "@/lib/supabase/cookie-options";
import { getSupabasePublicConfig } from "@/lib/supabase/env";

export async function createRouteHandlerClient(response: NextResponse) {
  const cookieStore = await cookies();
  const cookieOptions = getSupabaseCookieOptions(null);
  const { url, key } = getSupabasePublicConfig();

  return createServerClient(url!, key!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
          response.cookies.set(name, value, options);
        });
      },
    },
    ...(cookieOptions ? { cookieOptions } : {}),
  });
}
