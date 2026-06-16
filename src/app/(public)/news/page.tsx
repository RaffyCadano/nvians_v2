import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

export default async function NewsPage() {
  const supabase = await createClient();

  const [{ data: news }, { data: events }] = await Promise.all([
    supabase
      .from("news")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(9),
    supabase
      .from("events")
      .select("*")
      .order("start_date", { ascending: true })
      .limit(6),
  ]);

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <h1 className="text-4xl font-bold mb-4">News & Events</h1>
          <p className="text-blue-200 max-w-2xl">
            Stay updated with the latest happenings, achievements, and upcoming events at NVIANS.
          </p>
        </div>
      </section>

      {/* News */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest News</h2>
          {news && news.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {news.map((article: any) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {article.cover_image && (
                    <div className="h-48 bg-gray-100">
                      <img
                        src={article.cover_image}
                        alt={article.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="pt-4">
                    <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.published_at
                        ? format(new Date(article.published_at), "MMM d, yyyy")
                        : ""}
                    </p>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{article.title}</h3>
                    {article.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-3">{article.excerpt}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No news articles published yet.</p>
          )}
        </div>
      </section>

      {/* Events */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Upcoming Events</h2>
          {events && events.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event: any) => (
                <Card key={event.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs text-blue-600 font-medium">
                        <Calendar className="h-3.5 w-3.5" />
                        {format(new Date(event.start_date), "MMM d, yyyy")}
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          event.status === "upcoming"
                            ? "bg-green-100 text-green-700"
                            : event.status === "ongoing"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }
                      >
                        {event.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mt-2">{event.title}</h3>
                    {event.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{event.description}</p>
                    )}
                    {event.location && (
                      <p className="text-xs text-gray-400 mt-2">📍 {event.location}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No upcoming events.</p>
          )}
        </div>
      </section>
    </div>
  );
}
