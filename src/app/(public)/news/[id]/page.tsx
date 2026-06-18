import { createClient } from "@/lib/supabase/server";
import { getNewsPublisherName } from "@/lib/cms-news";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Clock, User } from "lucide-react";

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("news")
    .select(
      "id, title, content, excerpt, cover_image, published_at, author:author_id(full_name), publisher:published_by(full_name)",
    )
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (!article) {
    notFound();
  }

  const publishedLabel = article.published_at
    ? format(new Date(article.published_at), "MMMM d, yyyy")
    : null;
  const publisherName = getNewsPublisherName(article);

  return (
    <div>
      <section className="relative flex min-h-[40vh] items-end overflow-hidden text-white sm:min-h-[38vh]">
        {article.cover_image ? (
          <Image
            src={article.cover_image}
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
        <div className="absolute inset-0 bg-blue-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/40 to-transparent" />
        <div className="container relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <Link
            href="/news"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-blue-200 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to News & Events
          </Link>
          {(publishedLabel || publisherName) && (
            <p className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">
              {publishedLabel && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {publishedLabel}
                </span>
              )}
              {publisherName && (
                <span className="inline-flex items-center gap-1.5 normal-case tracking-normal text-blue-100">
                  <User className="h-3.5 w-3.5" />
                  Published by {publisherName}
                </span>
              )}
            </p>
          )}
          <h1 className="max-w-3xl text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-blue-100 sm:text-base">
              {article.excerpt}
            </p>
          )}
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <article className="prose prose-gray max-w-none">
            <div className="whitespace-pre-wrap text-base leading-relaxed text-gray-700 sm:text-lg">
              {article.content}
            </div>
          </article>

          <div className="mt-10 border-t border-gray-200 pt-8">
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 transition-colors hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all news
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
