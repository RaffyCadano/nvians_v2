import { createClient } from "@/lib/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Pencil, Newspaper, CalendarDays, Image } from "lucide-react";
import { format } from "date-fns";

export default async function AdminCMSPage() {
  const supabase = await createClient();

  const [{ data: news }, { data: events }] = await Promise.all([
    supabase.from("news").select("*").order("created_at", { ascending: false }),
    supabase.from("events").select("*").order("start_date", { ascending: false }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Website CMS</h1>
          <p className="text-sm text-gray-500 mt-1">Manage news, events, and gallery content.</p>
        </div>
      </div>

      <Tabs defaultValue="news">
        <TabsList>
          <TabsTrigger value="news" className="flex items-center gap-1.5">
            <Newspaper className="h-4 w-4" /> News
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" /> Events
          </TabsTrigger>
        </TabsList>

        {/* NEWS */}
        <TabsContent value="news" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button asChild>
              <Link href="/admin/cms/news/new">
                <Plus className="mr-2 h-4 w-4" /> New Article
              </Link>
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Title</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Published</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(news ?? []).length > 0 ? (
                    (news ?? []).map((n: any) => (
                      <tr key={n.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{n.title}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {n.published_at ? format(new Date(n.published_at), "MMM d, yyyy") : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className={n.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
                            {n.is_published ? "Published" : "Draft"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/admin/cms/news/${n.id}`}>
                              <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                        No articles yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* EVENTS */}
        <TabsContent value="events" className="mt-4">
          <div className="flex justify-end mb-4">
            <Button asChild>
              <Link href="/admin/cms/events/new">
                <Plus className="mr-2 h-4 w-4" /> New Event
              </Link>
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Title</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Start Date</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Location</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(events ?? []).length > 0 ? (
                    (events ?? []).map((ev: any) => (
                      <tr key={ev.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">{ev.title}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {ev.start_date ? format(new Date(ev.start_date), "MMM d, yyyy") : "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{ev.location ?? "—"}</td>
                        <td className="px-4 py-3">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/admin/cms/events/${ev.id}`}>
                              <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                        No events yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
