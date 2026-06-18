import Link from "next/link";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "past", label: "Past" },
] as const;

export function EventsToolbar({
  q,
  year,
  status,
  years,
}: {
  q: string;
  year: string;
  status: string;
  years: number[];
}) {
  const hasFilters = Boolean(q.trim() || year || status);

  return (
    <form
      method="get"
      action="/news/events"
      className="mb-8 rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-3">
        <div className="relative min-w-0 w-full lg:min-w-[12rem] lg:flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            name="q"
            defaultValue={q}
            placeholder="Search events..."
            className="h-10 w-full min-w-0 bg-white pl-9"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:flex lg:w-auto lg:shrink-0 lg:gap-3">
          <select
            name="status"
            defaultValue={status}
            className="h-10 w-full min-w-0 rounded-lg border border-input bg-white px-2.5 text-sm text-gray-900 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 lg:w-40"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            name="year"
            defaultValue={year}
            className="h-10 w-full min-w-0 rounded-lg border border-input bg-white px-2.5 text-sm text-gray-900 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 lg:w-32"
          >
            <option value="">All years</option>
            {years.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div
          className={`grid w-full gap-2 min-[480px]:grid-cols-2 lg:flex lg:w-auto lg:shrink-0 ${hasFilters ? "" : "min-[480px]:grid-cols-1"}`}
        >
          <Button type="submit" size="sm" className="h-10 w-full lg:min-w-[5.5rem]">
            Search
          </Button>
          {hasFilters && (
            <Button
              asChild
              type="button"
              variant="outline"
              size="sm"
              className="h-10 w-full lg:min-w-[5.5rem]"
            >
              <Link href="/news/events">
                <X className="mr-1.5 h-4 w-4" />
                Clear
              </Link>
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

export function eventsHref({
  page,
  q,
  year,
  status,
}: {
  page?: number;
  q?: string;
  year?: string;
  status?: string;
}) {
  const params = new URLSearchParams();
  const trimmedQ = q?.trim();

  if (page && page > 1) params.set("page", String(page));
  if (trimmedQ) params.set("q", trimmedQ);
  if (year) params.set("year", year);
  if (status === "upcoming" || status === "ongoing" || status === "past") {
    params.set("status", status);
  }

  const qs = params.toString();
  return qs ? `/news/events?${qs}` : "/news/events";
}

export function sanitizeEventSearch(term: string) {
  return term.replace(/[%_,]/g, " ").trim();
}

export function parseEventStatus(status: string) {
  return status === "upcoming" || status === "ongoing" || status === "past"
    ? status
    : "";
}

export function extractEventYears(rows: { start_date: string | null }[]): number[] {
  const years = new Set<number>();

  for (const row of rows) {
    if (!row.start_date) continue;
    years.add(new Date(`${row.start_date}T00:00:00`).getFullYear());
  }

  return [...years].sort((a, b) => b - a);
}
