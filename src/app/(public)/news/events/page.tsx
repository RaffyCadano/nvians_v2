import { createClient } from "@/lib/supabase/server";
import { loadPublicEventsPage } from "@/lib/cms-events";
import { EventCard } from "@/components/public/event-card";
import {
  EventsToolbar,
  eventsHref,
  extractEventYears,
  parseEventStatus,
  sanitizeEventSearch,
} from "@/components/public/events-toolbar";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 12;

export default async function AllEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; year?: string; status?: string }>;
}) {
  const {
    page: pageParam,
    q: qParam = "",
    year: yearParam = "",
    status: statusParam = "",
  } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const q = qParam ?? "";
  const year = /^\d{4}$/.test(yearParam ?? "") ? yearParam : "";
  const status = parseEventStatus(statusParam ?? "");
  const searchTerm = sanitizeEventSearch(q);
  const hasFilters = Boolean(searchTerm || year || status);

  const supabase = await createClient();
  const [{ events, total }, { data: yearRows }] = await Promise.all([
    loadPublicEventsPage(supabase, page, PAGE_SIZE, { q: searchTerm, year, status }),
    supabase
      .from("events")
      .select("start_date")
      .eq("is_published", true)
      .not("start_date", "is", null),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const showingFrom = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(currentPage * PAGE_SIZE, total);
  const years = extractEventYears(yearRows ?? []);

  return (
    <div>
      <section className="relative flex min-h-[45vh] items-center overflow-hidden text-white sm:min-h-[42vh] lg:min-h-[40vh]">
        <Image
          src="/news-cover.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_40%] sm:object-center"
          aria-hidden
        />
        <div className="absolute inset-0 bg-blue-950/50" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-indigo-900/30" />
        <div className="container relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
          <p className="mb-2 text-xs font-medium tracking-wider text-yellow-400 uppercase sm:mb-3 sm:text-sm lg:text-base">
            School Events
          </p>
          <h1 className="mb-3 max-w-3xl text-2xl font-bold leading-tight sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
            All Events
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-blue-200 sm:text-base lg:text-lg">
            Browse every published event at Nueva Vizcaya Institute.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
            <Link
              href="#events"
              className="inline-flex h-11 w-full items-center justify-center rounded-md bg-yellow-500 px-6 text-sm font-semibold text-gray-900 transition-colors hover:bg-yellow-400 sm:w-auto sm:min-w-[160px]"
            >
              Browse Events
              <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
            </Link>
            <Link
              href="/news/articles"
              className="inline-flex h-11 w-full items-center justify-center rounded-md border border-white/60 bg-white/10 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/20 sm:w-auto sm:min-w-[160px]"
            >
              All Articles
            </Link>
          </div>
        </div>
      </section>

      <section id="events" className="scroll-mt-20 bg-gray-50 py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <EventsToolbar q={q} year={year} status={status} years={years} />

          {total > 0 ? (
            <>
              <p className="mb-8 text-sm text-gray-500">
                Showing {showingFrom}–{showingTo} of {total} event{total === 1 ? "" : "s"}
                {hasFilters ? " matching your filters" : ""}
              </p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 sm:flex-row">
                  <p className="text-sm text-gray-500">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    {currentPage > 1 ? (
                      <Button asChild variant="outline" size="sm">
                        <Link href={eventsHref({ page: currentPage - 1, q, year, status })}>
                          Previous
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        Previous
                      </Button>
                    )}
                    {currentPage < totalPages ? (
                      <Button asChild variant="outline" size="sm">
                        <Link href={eventsHref({ page: currentPage + 1, q, year, status })}>
                          Next
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        Next
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center">
              <p className="font-medium text-gray-700">
                {hasFilters ? "No events match your filters" : "No events published yet"}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {hasFilters
                  ? "Try a different search term or clear the filters."
                  : "Check back later for upcoming activities."}
              </p>
              {hasFilters && (
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link href="/news/events">Clear filters</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
