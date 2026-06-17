import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDashboardUrl } from "@/lib/site-urls";
import { getRequestHost } from "@/lib/request-host";

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; next?: string }>;
}) {
  const { code, next } = await searchParams;

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  if (next) {
    redirect(next);
  }

  const host = getRequestHost(await headers());
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const adminClient = createAdminClient();
    const { data: profile } = await adminClient
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    const role = profile?.role ?? (user.user_metadata?.role as string | undefined);
    redirect(getDashboardUrl(role ?? "student", host));
  }

  redirect(getDashboardUrl("student", host));
}
