import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export type PublicEventsFilters = {
  q?: string;
  year?: string;
  status?: "upcoming" | "ongoing" | "past" | "";
};

function applyPublicEventFilters<T extends { or: Function; gte: Function; lte: Function; eq: Function }>(
  query: T,
  filters: PublicEventsFilters
): T {
  let next = query;

  const searchTerm = filters.q?.replace(/[%_,]/g, " ").trim();
  if (searchTerm) {
    const pattern = `%${searchTerm}%`;
    next = next.or(
      `title.ilike.${pattern},description.ilike.${pattern},location.ilike.${pattern}`
    ) as T;
  }

  if (filters.year && /^\d{4}$/.test(filters.year)) {
    next = next
      .gte("start_date", `${filters.year}-01-01`)
      .lte("start_date", `${filters.year}-12-31`) as T;
  }

  if (filters.status === "upcoming" || filters.status === "ongoing" || filters.status === "past") {
    next = next.eq("status", filters.status) as T;
  }

  return next;
}

export async function loadPublicEvents(supabase: SupabaseServerClient, limit = 6) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("start_date", { ascending: true })
    .limit(limit);

  if (!error) {
    return data ?? [];
  }

  if (error.message.includes("is_published")) {
    const { data: fallback } = await supabase
      .from("events")
      .select("*")
      .order("start_date", { ascending: true })
      .limit(limit);
    return fallback ?? [];
  }

  return [];
}

export async function countPublicEvents(supabase: SupabaseServerClient) {
  const { count, error } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true);

  if (!error) {
    return count ?? 0;
  }

  if (error.message.includes("is_published")) {
    const { count: fallback } = await supabase
      .from("events")
      .select("*", { count: "exact", head: true });
    return fallback ?? 0;
  }

  return 0;
}

export async function loadPublicEventsPage(
  supabase: SupabaseServerClient,
  page: number,
  pageSize: number,
  filters: PublicEventsFilters = {}
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = applyPublicEventFilters(
    supabase.from("events").select("*", { count: "exact" }).eq("is_published", true),
    filters
  );

  const { data, count, error } = await query
    .order("start_date", { ascending: true })
    .range(from, to);

  if (!error) {
    return { events: data ?? [], total: count ?? 0 };
  }

  if (error.message.includes("is_published")) {
    let fallbackQuery = applyPublicEventFilters(
      supabase.from("events").select("*", { count: "exact" }),
      filters
    );

    const { data: fallback, count: fallbackCount } = await fallbackQuery
      .order("start_date", { ascending: true })
      .range(from, to);
    return { events: fallback ?? [], total: fallbackCount ?? 0 };
  }

  return { events: [], total: 0 };
}

export async function loadPublicEventById(supabase: SupabaseServerClient, id: string) {
  const { data, error } = await supabase
    .from("events")
    .select("id, title, description, start_date, end_date, location, cover_image, status")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (!error && data) {
    return data;
  }

  if (error?.message.includes("is_published")) {
    const { data: fallback } = await supabase
      .from("events")
      .select("id, title, description, start_date, end_date, location, cover_image, status")
      .eq("id", id)
      .single();
    return fallback ?? null;
  }

  return null;
}
