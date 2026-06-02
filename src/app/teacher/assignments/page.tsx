import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, ClipboardList } from "lucide-react";
import { format } from "date-fns";

export default async function TeacherAssignmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: assignments } = await supabase
    .from("assignments")
    .select(
      "*, class_subject:class_subjects(subject:subjects(name), class:classes(grade_level, section), teacher:teachers!inner(user_id))"
    )
    .eq("class_subjects.teachers.user_id", user?.id)
    .order("due_date", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage assignments for your classes.</p>
        </div>
        <Button asChild>
          <Link href="/teacher/assignments/new">
            <Plus className="mr-2 h-4 w-4" /> New Assignment
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Assignment</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Subject / Class</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Due Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Max Score</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {assignments && assignments.length > 0 ? (
                assignments.map((a: any) => {
                  const isPast = new Date(a.due_date) < new Date();
                  return (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{a.title}</td>
                      <td className="px-4 py-3 text-gray-600">
                        <p>{a.class_subject?.subject?.name}</p>
                        <p className="text-xs text-gray-400">
                          {a.class_subject?.class?.grade_level} - {a.class_subject?.class?.section}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={isPast ? "text-red-600" : "text-gray-700"}>
                            {format(new Date(a.due_date), "MMM d, yyyy")}
                          </span>
                          {isPast && <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">Past due</Badge>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{a.max_score}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/teacher/assignments/${a.id}`}>Edit</Link>
                          </Button>
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/teacher/assignments/${a.id}/submissions`}>Submissions</Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center">
                    <ClipboardList className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No assignments yet.</p>
                    <Button asChild className="mt-3" size="sm">
                      <Link href="/teacher/assignments/new">Create First Assignment</Link>
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
