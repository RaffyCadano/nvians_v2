import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { StatsLineChart } from "@/components/admin/stats-line-chart";
import { buildMonthlyTrend } from "@/lib/trend-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CalendarCheck,
} from "lucide-react";
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

  const [{ data: sessions }, { data: allSessions }, { data: classSubjects }, { data: allRecords }] =
    await Promise.all([
      query,
      supabase.from("attendance_sessions").select("id, date, created_at").order("date", { ascending: false }),
      supabase
        .from("class_subjects")
        .select("id, created_at, subject:subjects(name), class:classes(grade_level, section)")
        .order("created_at"),
      supabase.from("attendance_records").select("status, created_at"),
    ]);

  const rows = sessions ?? [];
  const sessionRows = allSessions ?? [];
  const recordRows = allRecords ?? [];
  const subjectRows = classSubjects ?? [];

  let totalPresent = 0;
  let totalAbsent = 0;
  recordRows.forEach((record) => {
    if (record.status === "present") totalPresent += 1;
    if (record.status === "absent") totalAbsent += 1;
  });

  const sessionDates = sessionRows
    .map((session) => session.created_at ?? session.date)
    .filter(Boolean) as string[];
  const presentDates = recordRows
    .filter((record) => record.status === "present")
    .map((record) => record.created_at)
    .filter(Boolean) as string[];
  const absentDates = recordRows
    .filter((record) => record.status === "absent")
    .map((record) => record.created_at)
    .filter(Boolean) as string[];
  const classSubjectDates = subjectRows
    .map((subject) => subject.created_at)
    .filter(Boolean) as string[];

  const trendSeries = [
    {
      title: "Sessions",
      stroke: "#0d9488",
      color: "text-teal-600",
      bg: "bg-teal-50",
      current: sessionRows.length,
      data: buildMonthlyTrend(sessionDates),
    },
    {
      title: "Present",
      stroke: "#16a34a",
      color: "text-green-600",
      bg: "bg-green-50",
      current: totalPresent,
      data: buildMonthlyTrend(presentDates),
    },
    {
      title: "Absent",
      stroke: "#dc2626",
      color: "text-red-600",
      bg: "bg-red-50",
      current: totalAbsent,
      data: buildMonthlyTrend(absentDates),
    },
    {
      title: "Class Subjects",
      stroke: "#2563eb",
      color: "text-blue-600",
      bg: "bg-blue-50",
      current: subjectRows.length,
      data: buildMonthlyTrend(classSubjectDates),
    },
  ];
  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-teal-900 to-cyan-800 px-6 py-6 text-white sm:px-8 sm:py-7">
        <div>
          <p className="text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">Daily Records</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Attendance</h1>
          <p className="mt-2 max-w-xl text-sm text-teal-100">
            View attendance sessions across all class subjects, filter by date or subject, and review
            present and absent counts.
          </p>
        </div>
      </section>

      <StatsLineChart series={trendSeries} />
      <form method="GET" className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <select name="class_subject" defaultValue={class_subject ?? ""} className="flex h-9 min-w-[220px] rounded-lg border border-input bg-white px-2.5 text-sm text-gray-900">
          <option value="">All class subjects</option>
          {(classSubjects ?? []).map((cs: any) => (            <option key={cs.id} value={cs.id}>{cs.subject?.name} — {cs.class?.grade_level} {cs.class?.section}</option>
          ))}
        </select>
        <input type="date" name="date" defaultValue={date ?? ""} className="flex h-9 rounded-lg border border-input bg-white px-2.5 text-sm text-gray-900" />
        <Button type="submit" variant="outline">Filter</Button>
        {(class_subject || date) && (
          <Button type="button" variant="ghost" asChild><Link href="/attendance">Clear</Link></Button>
        )}
      </form>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <section className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
            <h2 className="font-semibold text-gray-900">Attendance Sessions</h2>
            <p className="mt-0.5 text-sm text-gray-500">{rows.length} session{rows.length === 1 ? "" : "s"} found</p>
          </div>

          {rows.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {rows.map((session: any) => {
                const records: any[] = session.attendance_records ?? [];
                const present = records.filter((r) => r.status === "present").length;
                const absent = records.filter((r) => r.status === "absent").length;
                return (
                  <div key={session.id} className="px-5 py-5 transition-colors hover:bg-gray-50/60">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-lg font-semibold text-gray-900">{session.class_subject?.subject?.name}</p>
                        <p className="mt-1 text-sm text-gray-500">
                          {session.class_subject?.class?.grade_level} — {session.class_subject?.class?.section}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                          <span>{format(new Date(session.date), "MMM d, yyyy")}</span>
                          <span>{session.class_subject?.teacher?.user?.full_name ?? "No teacher"}</span>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Badge className="bg-green-100 text-green-700">{present} present</Badge>
                          <Badge className="bg-red-100 text-red-700">{absent} absent</Badge>
                        </div>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/attendance/${session.id}`}>View details <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <CalendarCheck className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-4 font-medium text-gray-700">No attendance sessions found</p>
              <p className="mt-1 text-sm text-gray-500">Sessions appear when teachers take attendance.</p>
            </div>
          )}
        </section>

        <aside className="rounded-xl border border-gray-200 bg-white p-5 lg:sticky lg:top-7">
          <h2 className="text-base font-bold text-gray-900">Quick Guide</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">1</span>
              <span>Teachers record attendance per class subject.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">2</span>
              <span>Filter by subject or date to find a session.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">3</span>
              <span>Open a session to review individual student records.</span>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
