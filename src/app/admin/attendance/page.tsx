import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  UserX,
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

  const [{ data: sessions }, { data: classSubjects }] = await Promise.all([
    query,
    supabase
      .from("class_subjects")
      .select("id, subject:subjects(name), class:classes(grade_level, section)")
      .order("created_at"),
  ]);

  const rows = sessions ?? [];
  let totalPresent = 0;
  let totalAbsent = 0;
  rows.forEach((session: any) => {
    const records: any[] = session.attendance_records ?? [];
    totalPresent += records.filter((r) => r.status === "present").length;
    totalAbsent += records.filter((r) => r.status === "absent").length;
  });

  const stats = [
    { label: "Sessions", value: rows.length, icon: CalendarCheck, color: "text-teal-600", bg: "bg-teal-50" },
    { label: "Present", value: totalPresent, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Absent", value: totalAbsent, icon: UserX, color: "text-red-600", bg: "bg-red-50" },
    { label: "Class Subjects", value: (classSubjects ?? []).length, icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-50" },
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

      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">{stat.label}</p>
                  <p className="mt-1.5 text-2xl font-bold text-gray-900 sm:text-3xl">{stat.value.toLocaleString()}</p>
                </div>
                <div className={`rounded-xl p-2.5 ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <form method="GET" className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <select name="class_subject" defaultValue={class_subject ?? ""} className="flex h-9 min-w-[220px] rounded-lg border border-input bg-white px-2.5 text-sm text-gray-900">
          <option value="">All class subjects</option>
          {(classSubjects ?? []).map((cs: any) => (
            <option key={cs.id} value={cs.id}>{cs.subject?.name} — {cs.class?.grade_level} {cs.class?.section}</option>
          ))}
        </select>
        <input type="date" name="date" defaultValue={date ?? ""} className="flex h-9 rounded-lg border border-input bg-white px-2.5 text-sm text-gray-900" />
        <Button type="submit" variant="outline">Filter</Button>
        {(class_subject || date) && (
          <Button type="button" variant="ghost" asChild><Link href="/attendance">Clear</Link></Button>
        )}
      </form>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <section className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
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

        <aside className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-7">
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
