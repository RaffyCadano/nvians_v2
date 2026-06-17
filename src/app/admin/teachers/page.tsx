import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Plus, Search, UserCheck } from "lucide-react";

export default async function TeachersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("teachers")
    .select("*, user:users(full_name, email)")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.ilike("users.full_name", `%${q}%`);
  }

  const { data: teachers } = await query;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage teacher accounts and assignments.</p>
        </div>
        <Button asChild>
          <Link href="/teachers/new">
            <Plus className="mr-2 h-4 w-4" /> Add Teacher
          </Link>
        </Button>
      </div>

      {/* Search */}
      <form className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            name="q"
            defaultValue={q}
            placeholder="Search teachers..."
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="outline">Search</Button>
      </form>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Teacher</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Employee No.</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Department</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {teachers && teachers.length > 0 ? (
                  teachers.map((teacher: any) => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-medium text-xs">
                            {teacher.user?.full_name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{teacher.user?.full_name}</p>
                            <p className="text-xs text-gray-500">{teacher.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{teacher.employee_number}</td>
                      <td className="px-4 py-3 text-gray-700">{teacher.department}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className={
                            teacher.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        >
                          {teacher.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/teachers/${teacher.id}`}>Edit</Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center">
                      <UserCheck className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No teachers found.</p>
                      <Button asChild className="mt-3" size="sm">
                        <Link href="/teachers/new">Add First Teacher</Link>
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
