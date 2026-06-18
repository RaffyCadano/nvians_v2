import { createClient } from "@/lib/supabase/server";
import { CmsLists } from "./cms-lists";
import { StatsLineChart } from "@/components/admin/stats-line-chart";
import { buildMonthlyTrend } from "@/lib/trend-utils";

export default async function AdminCMSPage() {
  const supabase = await createClient();

  const [{ data: news }, { data: events }] = await Promise.all([
    supabase
      .from("news")
      .select("*, author:author_id(full_name), publisher:published_by(full_name)")
      .order("created_at", { ascending: false }),
    supabase.from("events").select("*").order("start_date", { ascending: false }),
  ]);

  const newsRows = news ?? [];
  const eventRows = events ?? [];
  const publishedNews = newsRows.filter((n) => n.is_published).length;
  const draftNews = newsRows.length - publishedNews;
  const publishedEvents = eventRows.filter((ev) => ev.is_published).length;
  const draftEvents = eventRows.length - publishedEvents;
  const upcomingEvents = eventRows.filter(
    (ev) =>
      ev.is_published &&
      ev.start_date &&
      new Date(ev.start_date) >= new Date(new Date().toDateString()),
  ).length;

  const publishedDates = [
    ...newsRows
      .filter((n) => n.is_published)
      .map((n) => n.published_at ?? n.created_at),
    ...eventRows.filter((ev) => ev.is_published).map((ev) => ev.created_at),
  ].filter(Boolean) as string[];

  const draftDates = [
    ...newsRows.filter((n) => !n.is_published).map((n) => n.created_at),
    ...eventRows.filter((ev) => !ev.is_published).map((ev) => ev.created_at),
  ].filter(Boolean) as string[];

  const trendSeries = [
    {
      title: "News Articles",
      stroke: "#e11d48",
      color: "text-rose-600",
      bg: "bg-rose-50",
      current: newsRows.length,
      data: buildMonthlyTrend(newsRows.map((n) => n.created_at).filter(Boolean) as string[]),
    },
    {
      title: "Published",
      stroke: "#16a34a",
      color: "text-green-600",
      bg: "bg-green-50",
      current: publishedNews + publishedEvents,
      data: buildMonthlyTrend(publishedDates),
    },
    {
      title: "Drafts",
      stroke: "#6b7280",
      color: "text-gray-600",
      bg: "bg-gray-100",
      current: draftNews + draftEvents,
      data: buildMonthlyTrend(draftDates),
    },
    {
      title: "Upcoming Events",
      stroke: "#2563eb",
      color: "text-blue-600",
      bg: "bg-blue-50",
      current: upcomingEvents,
      data: buildMonthlyTrend(
        eventRows
          .filter((ev) => ev.is_published)
          .map((ev) => ev.created_at)
          .filter(Boolean) as string[],
      ),
    },
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

      <StatsLineChart series={trendSeries} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <CmsLists newsRows={newsRows} eventRows={eventRows} />

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
