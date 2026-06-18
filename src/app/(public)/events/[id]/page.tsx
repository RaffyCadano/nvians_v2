import { createClient } from "@/lib/supabase/server";
import { loadPublicEventById } from "@/lib/cms-events";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatCalendarDateRange } from "@/lib/format-date";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function formatEventDateRange(startDate: string, endDate: string | null) {
  return formatCalendarDateRange(startDate, endDate);
}

const STATUS_STYLES = {
  upcoming: "bg-green-100 text-green-700",
  ongoing: "bg-blue-100 text-blue-700",
  past: "bg-gray-100 text-gray-600",
} as const;

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const event = await loadPublicEventById(supabase, id);

  if (!event) {
    notFound();
  }

  const dateLabel = event.start_date
    ? formatEventDateRange(event.start_date, event.end_date)
    : "Date to be announced";
  const status = (event.status ?? "upcoming") as keyof typeof STATUS_STYLES;

  return (
    <div>
      <section className="relative flex min-h-[40vh] items-end overflow-hidden text-white sm:min-h-[38vh]">
        {event.cover_image ? (
          <Image
            src={event.cover_image}
            alt=""
            fill
            priority
            sizes="100vw"
            unoptimized
            className="object-cover"
            aria-hidden
          />
        ) : (
          <Image
            src="/news-cover.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_40%] sm:object-center"
            aria-hidden
          />
        )}
        <div className="absolute inset-0 bg-indigo-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-indigo-950/40 to-transparent" />
        <div className="container relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <Link
            href="/news#upcoming-events"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-blue-200 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to News & Events
          </Link>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <p className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">
              <CalendarDays className="h-3.5 w-3.5" />
              {dateLabel}
            </p>
            <Badge className={`${STATUS_STYLES[status] ?? STATUS_STYLES.upcoming} hover:${STATUS_STYLES[status] ?? STATUS_STYLES.upcoming}`}>
              {status}
            </Badge>
          </div>
          <h1 className="max-w-3xl text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl">
            {event.title}
          </h1>
          {event.location && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-blue-100 sm:text-base">
              <MapPin className="h-4 w-4 shrink-0" />
              {event.location}
            </p>
          )}
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          {event.description ? (
            <article className="prose prose-gray max-w-none">
              <div className="whitespace-pre-wrap text-base leading-relaxed text-gray-700 sm:text-lg">
                {event.description}
              </div>
            </article>
          ) : (
            <p className="text-gray-500">More details for this event will be posted soon.</p>
          )}

          <div className="mt-10 space-y-4 rounded-xl border border-gray-200 bg-gray-50/80 p-5 text-sm">
            <div className="flex items-start justify-between gap-4">
              <span className="text-gray-500">Date</span>
              <span className="font-medium text-gray-900 text-right">{dateLabel}</span>
            </div>
            {event.location && (
              <div className="flex items-start justify-between gap-4 border-t border-gray-200 pt-4">
                <span className="text-gray-500">Location</span>
                <span className="font-medium text-gray-900 text-right">{event.location}</span>
              </div>
            )}
          </div>

          <div className="mt-10 border-t border-gray-200 pt-8">
            <Link
              href="/news#upcoming-events"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
