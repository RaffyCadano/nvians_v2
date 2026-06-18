import Link from "next/link";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsArticlesToolbar({
  q,
  year,
  years,
}: {
  q: string;
  year: string;
  years: number[];
}) {
  const hasFilters = Boolean(q.trim() || year);

  return (
    <form
      method="get"
      action="/news/articles"
      className="mb-8 flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50/80 p-4 sm:p-5 xl:flex-row xl:items-center"
    >
      <div className="relative min-w-0 w-full xl:min-w-[12rem] xl:flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          name="q"
          defaultValue={q}
          placeholder="Search articles..."
          className="h-10 w-full min-w-0 bg-white pl-9"
        />
      </div>

      <select
        name="year"
        defaultValue={year}
        className="h-10 w-full min-w-0 rounded-lg border border-input bg-white px-2.5 text-sm text-gray-900 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:max-w-none md:max-w-[10rem] xl:w-36 xl:shrink-0"
      >
        <option value="">All years</option>
        {years.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>

      <div
        className={`grid gap-2 sm:flex sm:w-full sm:justify-end xl:w-auto xl:shrink-0 ${hasFilters ? "grid-cols-2" : "grid-cols-1"}`}
      >
        <Button type="submit" size="sm" className="h-10 w-full sm:min-w-[5.5rem]">
          Search
        </Button>
        {hasFilters && (
          <Button asChild type="button" variant="outline" size="sm" className="h-10 w-full sm:min-w-[5.5rem]">
            <Link href="/news/articles">
              <X className="mr-1.5 h-4 w-4" />
              Clear
            </Link>
          </Button>
        )}
      </div>
    </form>
  );
}

export function articlesHref({
  page,
  q,
  year,
}: {
  page?: number;
  q?: string;
  year?: string;
}) {
  const params = new URLSearchParams();
  const trimmedQ = q?.trim();

  if (page && page > 1) params.set("page", String(page));
  if (trimmedQ) params.set("q", trimmedQ);
  if (year) params.set("year", year);

  const qs = params.toString();
  return qs ? `/news/articles?${qs}` : "/news/articles";
}

export function sanitizeNewsSearch(term: string) {
  return term.replace(/[%_,]/g, " ").trim();
}

export function extractPublishedYears(
  rows: { published_at: string | null }[]
): number[] {
  const years = new Set<number>();

  for (const row of rows) {
    if (!row.published_at) continue;
    years.add(new Date(row.published_at).getFullYear());
  }

  return [...years].sort((a, b) => b - a);
}
