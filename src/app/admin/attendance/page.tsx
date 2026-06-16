import { createAdminClient } from "@/lib/supabase/admin";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarCheck, ChevronRight } from "lucide-react";
import { format } from "date-fns";

export default async function AdminAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ class_subject?: string; date?: string }>;
}) {
  const { class_subject, date } = await searchParams;
  const supabase = createAdminClient();

  let query = supabase
    .from("attendance_sessions")
    .select(
      `*, 
      class_subject:class_subjects(
        subject:subjects(name),
        class:classes(grade_level, section),
        teacher:teachers(user:users(full_name))
      ),
      attendance_records(id, status)`
    )
    .order("date", { ascending: false });

  if (class_subject) query = query.eq("class_subject_id", class_subject);
  if (date) query = query.eq("date", date);

  const [{ data: sessions }, { data: classSubjects }] = await Promise.all([
    query,
    supabase
      .from("class_subjects")
      .select("id, subject:subjects(name), class:classes(grade_level, section)")
      .order("created_at"),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-sm text-gray-500 mt-1">View all attendance sessions across classes.</p>
        </div>
      </div>

      {/* Filters */}
      <form method="GET" className="flex gap-2 flex-wrap">
        <select
          name="class_subject"
          defaultValue={class_subject ?? ""}
          className="flex h-8 rounded-lg border border-input bg-background px-2.5 text-sm min-w-[220px]"
        >
          <option value="">All class subjects</option>
          {(classSubjects ?? []).map((cs: any) => (
            <option key={cs.id} value={cs.id}>
              {cs.subject?.name} — {cs.class?.grade_level} {cs.class?.section}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="date"
          defaultValue={date ?? ""}
          className="flex h-8 rounded-lg border border-input bg-background px-2.5 text-sm"
        />
        <Button type="submit" variant="outline" size="sm">Filter</Button>
        <Button type="button" variant="ghost" size="sm" asChild>
          <Link href="/admin/attendance">Clear</Link>
        </Button>
      </form>

      {/* Sessions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Subject</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Class</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Teacher</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Present</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Absent</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sessions && sessions.length > 0 ? (
                sessions.map((session: any) => {
                  const records: any[] = session.attendance_records ?? [];
                  const present = records.filter((r) => r.status === "present").length;
                  const absent = records.filter((r) => r.status === "absent").length;
                  return (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700 font-medium">
                        {format(new Date(session.date), "MMM d, yyyy")}
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        {session.class_subject?.subject?.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {session.class_subject?.class?.grade_level} - {session.class_subject?.class?.section}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {session.class_subject?.teacher?.user?.full_name ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {present}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="bg-red-100 text-red-700">
                          {absent}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/attendance/${session.id}`}>
                            View <ChevronRight className="ml-1 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <CalendarCheck className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No attendance sessions found.</p>
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
