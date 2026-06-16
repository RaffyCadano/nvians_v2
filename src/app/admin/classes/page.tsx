import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Plus, School } from "lucide-react";

export default async function ClassesPage() {
  const supabase = await createClient();

  const { data: classes } = await supabase
    .from("classes")
    .select("*, school_year:school_years(name), advisor:teachers(user:users(full_name))")
    .order("grade_level")
    .order("section");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="text-sm text-gray-500 mt-1">Manage class sections and advisors.</p>
        </div>
        <Button asChild>
          <Link href="/admin/classes/new">
            <Plus className="mr-2 h-4 w-4" /> New Class
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Class</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">School Year</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Class Advisor</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {classes && classes.length > 0 ? (
                  classes.map((cls: any) => (
                    <tr key={cls.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-700 font-bold text-xs">
                            {cls.grade_level.replace(/\D/g, "").slice(-2)}
                          </div>
                          <p className="font-medium text-gray-900">
                            {cls.grade_level} - {cls.section}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{cls.school_year?.name}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {cls.advisor?.user?.full_name ?? (
                          <span className="text-gray-400 italic">No advisor</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className={
                            cls.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }
                        >
                          {cls.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/admin/classes/${cls.id}`}>Edit</Link>
                          </Button>
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/admin/classes/${cls.id}/subjects`}>Subjects</Link>
                          </Button>
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/admin/enrollment?class=${cls.id}`}>Students</Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center">
                      <School className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No classes yet.</p>
                      <Button asChild className="mt-3" size="sm">
                        <Link href="/admin/classes/new">Create First Class</Link>
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
