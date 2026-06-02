import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";

export default async function SubjectsPage() {
  const supabase = await createClient();

  const { data: subjects } = await supabase
    .from("subjects")
    .select("*")
    .order("name");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subjects</h1>
          <p className="text-sm text-gray-500 mt-1">Manage school subjects and subject codes.</p>
        </div>
        <Button asChild>
          <Link href="/admin/subjects/new">
            <Plus className="mr-2 h-4 w-4" /> New Subject
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Subject</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Code</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Description</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {subjects && subjects.length > 0 ? (
                  subjects.map((subject: any) => (
                    <tr key={subject.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{subject.name}</td>
                      <td className="px-4 py-3 font-mono text-sm text-blue-700 font-medium">{subject.code}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                        {subject.description ?? <span className="text-gray-400 italic">No description</span>}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className={
                            subject.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }
                        >
                          {subject.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/subjects/${subject.id}`}>Edit</Link>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center">
                      <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No subjects yet.</p>
                      <Button asChild className="mt-3" size="sm">
                        <Link href="/admin/subjects/new">Add First Subject</Link>
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
