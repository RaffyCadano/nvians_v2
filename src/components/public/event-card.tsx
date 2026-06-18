import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar } from "lucide-react";
import { formatCalendarDate } from "@/lib/format-date";

export type PublicEvent = {
  id: string;
  title: string;
  description?: string | null;
  start_date: string;
  location?: string | null;
  cover_image?: string | null;
  status?: string | null;
};

export function EventCard({ event }: { event: PublicEvent }) {
  const status = event.status ?? "upcoming";

  return (
    <Link href={`/events/${event.id}`} className="group block">
      <Card
        className={`h-full overflow-hidden transition-colors group-hover:border-blue-200 group-hover:shadow-md ${event.cover_image ? "pt-0" : ""}`}
      >
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
              {formatCalendarDate(event.start_date)}
            </div>
            <Badge
              variant="secondary"
              className={
                status === "upcoming"
                  ? "bg-green-100 text-green-700"
                  : status === "ongoing"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600"
              }
            >
              {status}
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
  );
}
