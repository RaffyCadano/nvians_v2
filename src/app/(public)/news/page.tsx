import { createClient } from "@/lib/supabase/server";
import { countPublicEvents, loadPublicEvents } from "@/lib/cms-events";
import { NewsArticleCard } from "@/components/public/news-article-card";
import { EventCard } from "@/components/public/event-card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const PREVIEW_NEWS_LIMIT = 9;
const PREVIEW_EVENTS_LIMIT = 6;

export default async function NewsPage() {
  const supabase = await createClient();

  const [{ data: news }, { count: newsCount }, events, totalEvents] = await Promise.all([
    supabase
      .from("news")
      .select("id, title, excerpt, content, cover_image, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(PREVIEW_NEWS_LIMIT),
    supabase
      .from("news")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    loadPublicEvents(supabase, PREVIEW_EVENTS_LIMIT),
    countPublicEvents(supabase),
  ]);

  const totalNews = newsCount ?? 0;
  const hasMoreNews = totalNews > PREVIEW_NEWS_LIMIT;
  const hasMoreEvents = totalEvents > PREVIEW_EVENTS_LIMIT;

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
            Latest Updates
          </p>
          <h1 className="mb-3 max-w-3xl text-2xl font-bold leading-tight sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
            News & Events
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-blue-200 sm:text-base lg:text-lg">
            Stay updated with the latest happenings, achievements, and upcoming events at Nueva Vizcaya Institute.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
            <Link
              href="#latest-news"
              className="inline-flex h-11 w-full items-center justify-center rounded-md bg-yellow-500 px-6 text-sm font-semibold text-gray-900 transition-colors hover:bg-yellow-400 sm:w-auto sm:min-w-[160px]"
            >
              Latest News
              <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
            </Link>
            <Link
              href="#upcoming-events"
              className="inline-flex h-11 w-full items-center justify-center rounded-md border border-white/60 bg-white/10 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/20 sm:w-auto sm:min-w-[160px]"
            >
              Upcoming Events
            </Link>
          </div>
        </div>
      </section>

      {/* News */}
      <section id="latest-news" className="scroll-mt-20 bg-white py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
              {hasMoreNews && (
                <p className="mt-1 text-sm text-gray-500">
                  Showing the {PREVIEW_NEWS_LIMIT} most recent of {totalNews} articles
                </p>
              )}
            </div>
            {hasMoreNews && (
              <Link
                href="/news/articles"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800"
              >
                View all news
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
          {news && news.length > 0 ? (
            <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {news.map((article) => (
                <NewsArticleCard key={article.id} article={article} />
              ))}
            </div>
            {hasMoreNews && (
              <div className="mt-10 text-center">
                <Link
                  href="/news/articles"
                  className="inline-flex h-11 items-center justify-center rounded-md border border-blue-200 bg-blue-50 px-8 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                >
                  View all {totalNews} articles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            )}
            </>
          ) : (
            <p className="text-gray-500 text-sm">No news articles published yet.</p>
          )}
        </div>
      </section>

      {/* Events */}
      <section id="upcoming-events" className="scroll-mt-20 bg-gray-50 py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
              {hasMoreEvents && (
                <p className="mt-1 text-sm text-gray-500">
                  Showing the next {PREVIEW_EVENTS_LIMIT} of {totalEvents} events
                </p>
              )}
            </div>
            {hasMoreEvents && (
              <Link
                href="/news/events"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800"
              >
                View all events
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
          {events && events.length > 0 ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              {hasMoreEvents && (
                <div className="mt-10 text-center">
                  <Link
                    href="/news/events"
                    className="inline-flex h-11 items-center justify-center rounded-md border border-blue-200 bg-blue-50 px-8 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    View all {totalEvents} events
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-sm">No upcoming events.</p>
          )}
        </div>
      </section>
    </div>
  );
}
