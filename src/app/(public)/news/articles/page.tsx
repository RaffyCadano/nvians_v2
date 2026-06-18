import { createClient } from "@/lib/supabase/server";
import { NewsArticleCard } from "@/components/public/news-article-card";
import {
  articlesHref,
  extractPublishedYears,
  NewsArticlesToolbar,
  sanitizeNewsSearch,
} from "@/components/public/news-articles-toolbar";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 12;

export default async function AllNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; year?: string }>;
}) {
  const { page: pageParam, q: qParam = "", year: yearParam = "" } = await searchParams;
  const page = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);
  const q = qParam ?? "";
  const year = /^\d{4}$/.test(yearParam ?? "") ? yearParam : "";
  const searchTerm = sanitizeNewsSearch(q);
  const hasFilters = Boolean(searchTerm || year);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  let articlesQuery = supabase
    .from("news")
    .select("id, title, excerpt, content, cover_image, published_at", { count: "exact" })
    .eq("is_published", true);

  if (searchTerm) {
    const pattern = `%${searchTerm}%`;
    articlesQuery = articlesQuery.or(
      `title.ilike.${pattern},excerpt.ilike.${pattern},content.ilike.${pattern}`
    );
  }

  if (year) {
    articlesQuery = articlesQuery
      .gte("published_at", `${year}-01-01T00:00:00.000Z`)
      .lt("published_at", `${Number(year) + 1}-01-01T00:00:00.000Z`);
  }

  const [{ data: articles, count }, { data: yearRows }] = await Promise.all([
    articlesQuery.order("published_at", { ascending: false }).range(from, to),
    supabase
      .from("news")
      .select("published_at")
      .eq("is_published", true)
      .not("published_at", "is", null),
  ]);

  const newsRows = articles ?? [];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const showingFrom = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(currentPage * PAGE_SIZE, total);
  const years = extractPublishedYears(yearRows ?? []);

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
            Campus News
          </p>
          <h1 className="mb-3 max-w-3xl text-2xl font-bold leading-tight sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
            All News Articles
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-blue-200 sm:text-base lg:text-lg">
            Browse every published story from Nueva Vizcaya Institute.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
            <Link
              href="#articles"
              className="inline-flex h-11 w-full items-center justify-center rounded-md bg-yellow-500 px-6 text-sm font-semibold text-gray-900 transition-colors hover:bg-yellow-400 sm:w-auto sm:min-w-[160px]"
            >
              Browse Articles
              <ArrowRight className="ml-2 h-4 w-4 shrink-0" />
            </Link>
            <Link
              href="/news/events"
              className="inline-flex h-11 w-full items-center justify-center rounded-md border border-white/60 bg-white/10 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/20 sm:w-auto sm:min-w-[160px]"
            >
              All Events
            </Link>
          </div>
        </div>
      </section>

      <section id="articles" className="scroll-mt-20 bg-white py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <NewsArticlesToolbar q={q} year={year} years={years} />

          {total > 0 ? (
            <>
              <p className="mb-8 text-sm text-gray-500">
                Showing {showingFrom}–{showingTo} of {total} article{total === 1 ? "" : "s"}
                {hasFilters ? " matching your filters" : ""}
              </p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {newsRows.map((article) => (
                  <NewsArticleCard key={article.id} article={article} />
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
                        <Link href={articlesHref({ page: currentPage - 1, q, year })}>
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
                        <Link href={articlesHref({ page: currentPage + 1, q, year })}>
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
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">
              <p className="font-medium text-gray-700">
                {hasFilters ? "No articles match your filters" : "No news articles published yet"}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {hasFilters
                  ? "Try a different search term or clear the filters."
                  : "Check back later for new stories."}
              </p>
              {hasFilters && (
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link href="/news/articles">Clear filters</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
