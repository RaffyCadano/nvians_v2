export function getSupabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim();

  return { url, key };
}

export function assertSupabasePublicConfig() {
  const { url, key } = getSupabasePublicConfig();

  if (!url || !key) {
    return "Authentication is not configured on the server. Contact the administrator.";
  }

  return null;
}
