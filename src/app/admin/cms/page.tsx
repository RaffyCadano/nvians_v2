import { createClient } from "@/lib/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarDays, Globe, Newspaper, Pencil, Plus } from "lucide-react";
import { format } from "date-fns";

export default async function AdminCMSPage() {
  const supabase = await createClient();

  const [{ data: news }, { data: events }] = await Promise.all([
    supabase.from("news").select("*").order("created_at", { ascending: false }),
    supabase.from("events").select("*").order("start_date", { ascending: false }),
  ]);

  const newsRows = news ?? [];
  const eventRows = events ?? [];
  const publishedNews = newsRows.filter((n: any) => n.is_published).length;
  const draftNews = newsRows.length - publishedNews;
  const upcomingEvents = eventRows.filter((ev: any) => ev.start_date && new Date(ev.start_date) >= new Date()).length;

  const stats = [
    { label: "News Articles", value: newsRows.length, icon: Newspaper, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Published", value: publishedNews, icon: Globe, color: "text-green-600", bg: "bg-green-50" },
    { label: "Drafts", value: draftNews, icon: Pencil, color: "text-gray-600", bg: "bg-gray-100" },
    { label: "Upcoming Events", value: upcomingEvents, icon: CalendarDays, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-rose-900 to-pink-800 px-6 py-6 text-white sm:px-8 sm:py-7">
        <div>
          <p className="text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">Public Website</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Website CMS</h1>
          <p className="mt-2 max-w-xl text-sm text-rose-100">
            Manage news articles and events displayed on the public Nueva Vizcaya Institute website.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">{stat.label}</p>
                  <p className="mt-1.5 text-2xl font-bold text-gray-900 sm:text-3xl">{stat.value.toLocaleString()}</p>
                </div>
                <div className={`rounded-xl p-2.5 ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
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
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
                <p className="text-sm text-gray-500">{newsRows.length} article{newsRows.length === 1 ? "" : "s"}</p>
                <Button asChild size="sm">
                  <Link href="/cms/news/new">
                    <Plus className="mr-1.5 h-4 w-4" /> New Article
                  </Link>
                </Button>
              </div>
              {newsRows.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {newsRows.map((n: any) => (
                    <div key={n.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900">{n.title}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {n.published_at ? format(new Date(n.published_at), "MMM d, yyyy") : "Not published"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={n.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}
                        >
                          {n.is_published ? "Published" : "Draft"}
                        </Badge>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/cms/news/${n.id}`}>
                            <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
                <p className="text-sm text-gray-500">{eventRows.length} event{eventRows.length === 1 ? "" : "s"}</p>
                <Button asChild size="sm">
                  <Link href="/cms/events/new">
                    <Plus className="mr-1.5 h-4 w-4" /> New Event
                  </Link>
                </Button>
              </div>
              {eventRows.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {eventRows.map((ev: any) => (
                    <div key={ev.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900">{ev.title}</p>
                        <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-gray-500">
                          <span>{ev.start_date ? format(new Date(ev.start_date), "MMM d, yyyy") : "—"}</span>
                          {ev.location && <span>{ev.location}</span>}
                        </div>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/cms/events/${ev.id}`}>
                          <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
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

        <aside className="rounded-xl border border-gray-200 bg-white p-5 lg:sticky lg:top-7">
          <h2 className="text-base font-bold text-gray-900">Quick Guide</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">1</span>
              <span>Write news articles and publish when ready.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">2</span>
              <span>Add events with dates and locations.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">3</span>
              <span>Published content appears on the public website.</span>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
