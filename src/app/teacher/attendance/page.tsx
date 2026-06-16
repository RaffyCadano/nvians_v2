import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserCheck, Plus } from "lucide-react";

export default async function TeacherAttendancePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: teacher } = await supabase
    .from("teachers")
    .select("id")
    .eq("user_id", user?.id)
    .single();

  const { data: sessions } = await supabase
    .from("attendance_sessions")
    .select("*, class_subject:class_subjects(subject:subjects(name), class:classes(grade_level, section))")
    .eq("created_by", user?.id)
    .order("date", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-sm text-gray-500 mt-1">Manage attendance sessions for your classes.</p>
        </div>
        <Button asChild>
          <Link href="/teacher/attendance/new">
            <Plus className="mr-2 h-4 w-4" /> New Session
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Attendance Sessions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Subject</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Class</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sessions && sessions.length > 0 ? (
                sessions.map((session: any) => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{session.class_subject?.subject?.name}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {session.class_subject?.class?.grade_level} - {session.class_subject?.class?.section}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(session.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/teacher/attendance/${session.id}`}>View / Edit</Link>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center">
                    <UserCheck className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No attendance sessions yet.</p>
                    <Button asChild className="mt-3" size="sm">
                      <Link href="/teacher/attendance/new">Create First Session</Link>
                    </Button>
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
