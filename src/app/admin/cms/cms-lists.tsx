"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteNewsButton } from "./delete-news-button";
import { DeleteEventButton } from "./delete-event-button";
import { formatCalendarDate } from "@/lib/format-date";
import { getNewsPublisherName } from "@/lib/cms-news";
import {
  CalendarDays,
  ExternalLink,
  Newspaper,
  Pencil,
  Plus,
  Search,
  User,
  X,
} from "lucide-react";

type NewsRow = {
  id: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  is_published: boolean;
  published_at: string | null;
  author?: { full_name: string } | { full_name: string }[] | null;
  publisher?: { full_name: string } | { full_name: string }[] | null;
};

type EventRow = {
  id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  location: string | null;
  cover_image: string | null;
  status: string | null;
  is_published: boolean;
};

type NewsFilter = "all" | "published" | "draft";
type EventFilter = "all" | "published" | "draft" | "upcoming" | "ongoing" | "past";

const PAGE_SIZE = 10;

function paginate<T>(items: T[], page: number) {
  const start = (page - 1) * PAGE_SIZE;
  return items.slice(start, start + PAGE_SIZE);
}

function CmsListPagination({
  page,
  total,
  onPageChange,
}: {
  page: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);

  if (total <= PAGE_SIZE) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-500">
        Showing {start}–{end} of {total}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <span className="min-w-[5.5rem] text-center text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function matchesQuery(query: string, ...fields: (string | null | undefined)[]) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return fields.some((field) => field?.toLowerCase().includes(normalized));
}

export function CmsLists({
  newsRows,
  eventRows,
}: {
  newsRows: NewsRow[];
  eventRows: EventRow[];
}) {
  const [newsQuery, setNewsQuery] = useState("");
  const [newsFilter, setNewsFilter] = useState<NewsFilter>("all");
  const [eventQuery, setEventQuery] = useState("");
  const [eventFilter, setEventFilter] = useState<EventFilter>("all");
  const [newsPage, setNewsPage] = useState(1);
  const [eventPage, setEventPage] = useState(1);

  useEffect(() => {
    setNewsPage(1);
  }, [newsQuery, newsFilter]);

  useEffect(() => {
    setEventPage(1);
  }, [eventQuery, eventFilter]);

  const filteredNews = useMemo(() => {
    return newsRows.filter((article) => {
      if (newsFilter === "published" && !article.is_published) return false;
      if (newsFilter === "draft" && article.is_published) return false;

      return matchesQuery(
        newsQuery,
        article.title,
        article.excerpt,
        getNewsPublisherName(article),
      );
    });
  }, [newsRows, newsQuery, newsFilter]);

  const filteredEvents = useMemo(() => {
    return eventRows.filter((event) => {
      if (eventFilter === "published" && !event.is_published) return false;
      if (eventFilter === "draft" && event.is_published) return false;

      const status = (event.status ?? "upcoming") as "upcoming" | "ongoing" | "past";
      if (
        (eventFilter === "upcoming" || eventFilter === "ongoing" || eventFilter === "past") &&
        (status !== eventFilter || !event.is_published)
      ) {
        return false;
      }

      return matchesQuery(
        eventQuery,
        event.title,
        event.description,
        event.location,
      );
    });
  }, [eventRows, eventQuery, eventFilter]);

  const paginatedNews = useMemo(
    () => paginate(filteredNews, newsPage),
    [filteredNews, newsPage],
  );
  const paginatedEvents = useMemo(
    () => paginate(filteredEvents, eventPage),
    [filteredEvents, eventPage],
  );

  const newsHasFilters = Boolean(newsQuery.trim()) || newsFilter !== "all";
  const eventsHasFilters = Boolean(eventQuery.trim()) || eventFilter !== "all";

  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
      <Tabs defaultValue="news">
        <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
          <TabsList className="bg-white">
            <TabsTrigger value="news" className="flex items-center gap-1.5">
              <Newspaper className="h-4 w-4" /> News
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" /> Events
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="news" className="mt-0">
          <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              {filteredNews.length} of {newsRows.length} article
              {newsRows.length === 1 ? "" : "s"}
              {filteredNews.length > PAGE_SIZE &&
                ` · page ${newsPage} of ${Math.ceil(filteredNews.length / PAGE_SIZE)}`}
            </p>
            <Button asChild size="sm">
              <Link href="/cms/news/new">
                <Plus className="mr-1.5 h-4 w-4" /> New Article
              </Link>
            </Button>
          </div>

          <div className="flex flex-col gap-3 border-b border-gray-100 bg-gray-50/50 px-5 py-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={newsQuery}
                onChange={(e) => setNewsQuery(e.target.value)}
                placeholder="Search by title, excerpt, or publisher..."
                className="bg-white pl-9"
              />
            </div>
            <select
              value={newsFilter}
              onChange={(e) => setNewsFilter(e.target.value as NewsFilter)}
              className="flex h-9 min-w-[160px] rounded-lg border border-input bg-white px-2.5 text-sm text-gray-900"
            >
              <option value="all">All articles</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
            {newsHasFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="shrink-0 text-gray-600"
                onClick={() => {
                  setNewsQuery("");
                  setNewsFilter("all");
                }}
              >
                <X className="mr-1 h-3.5 w-3.5" />
                Clear
              </Button>
            )}
          </div>

          {newsRows.length > 0 ? (
            filteredNews.length > 0 ? (
              <div>
              <div className="divide-y divide-gray-100">
                {paginatedNews.map((n) => (
                  <div
                    key={n.id}
                    className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 sm:h-20 sm:w-32">
                        {n.cover_image ? (
                          <Image
                            src={n.cover_image}
                            alt={n.title}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
                            <Newspaper className="h-6 w-6 text-rose-300" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 font-semibold text-gray-900">{n.title}</p>
                        {n.excerpt && (
                          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{n.excerpt}</p>
                        )}
                        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-500">
                          <span>
                            {n.published_at
                              ? format(new Date(n.published_at), "MMM d, yyyy")
                              : "Not published"}
                          </span>
                          {n.is_published && getNewsPublisherName(n) && (
                            <>
                              <span aria-hidden>·</span>
                              <span className="inline-flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {getNewsPublisherName(n)}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:shrink-0">
                      <Badge
                        variant="secondary"
                        className={
                          n.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        }
                      >
                        {n.is_published ? "Published" : "Draft"}
                      </Badge>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/cms/news/${n.id}`}>
                          <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                        </Link>
                      </Button>
                      {n.is_published && (
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/news/${n.id}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-1 h-3.5 w-3.5" /> View
                          </Link>
                        </Button>
                      )}
                      <DeleteNewsButton
                        articleId={n.id}
                        articleTitle={n.title}
                        isPublished={n.is_published}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <CmsListPagination
                page={newsPage}
                total={filteredNews.length}
                onPageChange={setNewsPage}
              />
              </div>
            ) : (
              <div className="px-6 py-16 text-center">
                <Search className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-4 font-medium text-gray-700">No articles match your filters</p>
                <p className="mt-1 text-sm text-gray-500">Try a different search or clear the filters.</p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setNewsQuery("");
                    setNewsFilter("all");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )
          ) : (
            <div className="px-6 py-16 text-center">
              <Newspaper className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-4 font-medium text-gray-700">No articles yet</p>
              <p className="mt-1 text-sm text-gray-500">Create your first news article for the public site.</p>
              <Button asChild className="mt-4">
                <Link href="/cms/news/new">
                  <Plus className="mr-1.5 h-4 w-4" /> New Article
                </Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="events" className="mt-0">
          <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              {filteredEvents.length} of {eventRows.length} event
              {eventRows.length === 1 ? "" : "s"}
              {filteredEvents.length > PAGE_SIZE &&
                ` · page ${eventPage} of ${Math.ceil(filteredEvents.length / PAGE_SIZE)}`}
            </p>
            <Button asChild size="sm">
              <Link href="/cms/events/new">
                <Plus className="mr-1.5 h-4 w-4" /> New Event
              </Link>
            </Button>
          </div>

          <div className="flex flex-col gap-3 border-b border-gray-100 bg-gray-50/50 px-5 py-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={eventQuery}
                onChange={(e) => setEventQuery(e.target.value)}
                placeholder="Search by title, description, or location..."
                className="bg-white pl-9"
              />
            </div>
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value as EventFilter)}
              className="flex h-9 min-w-[160px] rounded-lg border border-input bg-white px-2.5 text-sm text-gray-900"
            >
              <option value="all">All events</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="past">Past</option>
            </select>
            {eventsHasFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="shrink-0 text-gray-600"
                onClick={() => {
                  setEventQuery("");
                  setEventFilter("all");
                }}
              >
                <X className="mr-1 h-3.5 w-3.5" />
                Clear
              </Button>
            )}
          </div>

          {eventRows.length > 0 ? (
            filteredEvents.length > 0 ? (
              <div>
              <div className="divide-y divide-gray-100">
                {paginatedEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 sm:h-20 sm:w-32">
                        {ev.cover_image ? (
                          <Image
                            src={ev.cover_image}
                            alt={ev.title}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                            <CalendarDays className="h-6 w-6 text-blue-300" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 font-semibold text-gray-900">{ev.title}</p>
                        <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-gray-500">
                          <span>{ev.start_date ? formatCalendarDate(ev.start_date) : "—"}</span>
                          {ev.location && <span>{ev.location}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:shrink-0">
                      <Badge
                        variant="secondary"
                        className={
                          ev.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        }
                      >
                        {ev.is_published ? "Published" : "Draft"}
                      </Badge>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/cms/events/${ev.id}`}>
                          <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                        </Link>
                      </Button>
                      {ev.is_published && (
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/events/${ev.id}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-1 h-3.5 w-3.5" /> View
                          </Link>
                        </Button>
                      )}
                      <DeleteEventButton
                          eventId={ev.id}
                          eventTitle={ev.title}
                          isPublished={ev.is_published}
                        />
                    </div>
                  </div>
                ))}
              </div>
              <CmsListPagination
                page={eventPage}
                total={filteredEvents.length}
                onPageChange={setEventPage}
              />
              </div>
            ) : (
              <div className="px-6 py-16 text-center">
                <Search className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-4 font-medium text-gray-700">No events match your filters</p>
                <p className="mt-1 text-sm text-gray-500">Try a different search or clear the filters.</p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setEventQuery("");
                    setEventFilter("all");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )
          ) : (
            <div className="px-6 py-16 text-center">
              <CalendarDays className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-4 font-medium text-gray-700">No events yet</p>
              <p className="mt-1 text-sm text-gray-500">Add school events to display on the public site.</p>
              <Button asChild className="mt-4">
                <Link href="/cms/events/new">
                  <Plus className="mr-1.5 h-4 w-4" /> New Event
                </Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
