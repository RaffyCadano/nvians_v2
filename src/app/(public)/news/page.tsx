import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export default async function NewsPage() {
  const supabase = await createClient();

  const [{ data: news }, { data: events }] = await Promise.all([
    supabase
      .from("news")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(9),
    supabase
      .from("events")
      .select("*")
      .order("start_date", { ascending: true })
      .limit(6),
  ]);

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
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest News</h2>
          {news && news.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {news.map((article: any) => (
                <Link key={article.id} href={`/news/${article.id}`} className="group block">
                  <Card className="h-full overflow-hidden pt-0 transition-colors group-hover:border-blue-200 group-hover:shadow-md">
                    {article.cover_image ? (
                      <div className="h-48 overflow-hidden bg-gray-100">
                        <img
                          src={article.cover_image}
                          alt={article.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="flex h-48 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                        <Clock className="h-10 w-10 text-blue-200" />
                      </div>
                    )}
                    <CardContent className="pt-4">
                      <p className="mb-2 flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {article.published_at
                          ? format(new Date(article.published_at), "MMM d, yyyy")
                          : ""}
                      </p>
                      <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900 transition-colors group-hover:text-blue-700">
                        {article.title}
                      </h3>
                      {article.excerpt ? (
                        <p className="line-clamp-3 text-sm text-gray-600">{article.excerpt}</p>
                      ) : (
                        <p className="line-clamp-3 text-sm text-gray-600">{article.content}</p>
                      )}
                      <p className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                        Read article
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No news articles published yet.</p>
          )}
        </div>
      </section>

      {/* Events */}
      <section id="upcoming-events" className="scroll-mt-20 bg-gray-50 py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Upcoming Events</h2>
          {events && events.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event: any) => (
                <Link key={event.id} href={`/news/events/${event.id}`} className="group block">
                  <Card className={`h-full overflow-hidden transition-colors group-hover:border-blue-200 group-hover:shadow-md ${event.cover_image ? "pt-0" : ""}`}>
                    {event.cover_image ? (
                      <div className="relative h-40 overflow-hidden bg-gray-100">
                        <img
                          src={event.cover_image}
                          alt={event.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="flex h-40 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                        <Calendar className="h-10 w-10 text-blue-200" />
                      </div>
                    )}
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-blue-600">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(new Date(event.start_date), "MMM d, yyyy")}
                        </div>
                        <Badge
                          variant="secondary"
                          className={
                            event.status === "upcoming"
                              ? "bg-green-100 text-green-700"
                              : event.status === "ongoing"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }
                        >
                          {event.status}
                        </Badge>
                      </div>
                      <h3 className="mt-2 font-semibold text-gray-900 transition-colors group-hover:text-blue-700">
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-gray-600">{event.description}</p>
                      )}
                      {event.location && (
                        <p className="mt-2 text-xs text-gray-400">📍 {event.location}</p>
                      )}
                      <p className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                        View event
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No upcoming events.</p>
          )}
        </div>
      </section>
    </div>
  );
}
