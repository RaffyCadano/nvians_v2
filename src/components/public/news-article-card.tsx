import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Clock } from "lucide-react";
import { format } from "date-fns";

export type PublicNewsArticle = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  published_at: string | null;
};

export function NewsArticleCard({ article }: { article: PublicNewsArticle }) {
  return (
    <Link href={`/news/${article.id}`} className="group block">
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
  );
}
