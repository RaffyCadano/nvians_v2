import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ClipboardList, Upload } from "lucide-react";
import { format } from "date-fns";

export default async function StudentAssignmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("user_id", user?.id)
    .single();

  // Get enrolled class subjects
  const { data: assignments } = await supabase
    .from("assignments")
    .select(
      "*, class_subject:class_subjects(subject:subjects(name), class:classes(grade_level, section)), submissions(id, submitted_at, score)"
    )
    .order("due_date", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
        <p className="text-sm text-gray-500 mt-1">View and submit your assignments.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Assignment</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Subject</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Due Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {assignments && assignments.length > 0 ? (
                assignments.map((a: any) => {
                  const submission = a.submissions?.[0];
                  const isPast = new Date(a.due_date) < new Date();
                  return (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{a.title}</td>
                      <td className="px-4 py-3 text-gray-600">{a.class_subject?.subject?.name}</td>
                      <td className="px-4 py-3">
                        <span className={isPast && !submission ? "text-red-600 font-medium" : "text-gray-700"}>
                          {format(new Date(a.due_date), "MMM d, yyyy")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {submission ? (
                          <Badge className="bg-green-100 text-green-700" variant="secondary">
                            Submitted {submission.score != null ? `· ${submission.score}/${a.max_score}` : ""}
                          </Badge>
                        ) : isPast ? (
                          <Badge className="bg-red-100 text-red-700" variant="secondary">Overdue</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-700" variant="secondary">Pending</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {!submission && (
                          <Button asChild size="sm" variant="ghost">
                            <Link href={`/student/assignments/${a.id}/submit`}>
                              <Upload className="mr-1.5 h-3.5 w-3.5" /> Submit
                            </Link>
                          </Button>
                        )}
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/student/assignments/${a.id}`}>View</Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <ClipboardList className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No assignments yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table></div>
        </CardContent>
      </Card>
    </div>
  );
}
