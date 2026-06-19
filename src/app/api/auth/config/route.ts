import { NextResponse } from "next/server";
import { getSupabasePublicConfig } from "@/lib/supabase/env";

export async function GET() {
  const { url, key } = getSupabasePublicConfig();

  if (!url || !key) {
    return NextResponse.json(
      { configured: false },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    { configured: true, url, key },
    { headers: { "Cache-Control": "no-store" } }
  );
}
