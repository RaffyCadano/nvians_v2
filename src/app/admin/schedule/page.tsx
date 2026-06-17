import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatsLineChart } from "@/components/admin/stats-line-chart";
import { buildMonthlyTrend } from "@/lib/trend-utils";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  CalendarDays,
  Clock,
} from "lucide-react";

function relationOne<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function getGradeNumber(gradeLevel: string) {
  return gradeLevel.replace(/\D/g, "").slice(-2) || "?";
}

function getGradeColor(gradeLevel: string) {
  const grade = parseInt(getGradeNumber(gradeLevel), 10);
  if (grade <= 8) return { bg: "bg-blue-100", text: "text-blue-700" };
  if (grade <= 10) return { bg: "bg-purple-100", text: "text-purple-700" };
  return { bg: "bg-indigo-100", text: "text-indigo-700" };
}

type ScheduleRow = {
  id: string;
  schedule: string | null;
  createdAt: string;
  subjectName: string;
  subjectCode: string;
  teacherName: string | null;
  termName: string;
  classId: string;
  gradeLevel: string;
  section: string;
  schoolYearName: string;
};

export default async function AdminSchedulePage() {
  const supabase = createAdminClient();

  const [{ data: classSubjects }, { data: activeSchoolYear }] = await Promise.all([
    supabase
      .from("class_subjects")
      .select(
        `id, schedule, created_at,
        subject:subjects(name, code),
        teacher:teachers(user:users(full_name)),
        term:terms(name),
        class:classes(id, grade_level, section, school_year:school_years(name))`,
      )
      .order("created_at"),
    supabase.from("school_years").select("name").eq("status", "active").maybeSingle(),
  ]);

  const rows: ScheduleRow[] = (classSubjects ?? []).map((cs) => {
    const subject = relationOne(cs.subject);
    const teacher = relationOne(cs.teacher);
    const teacherUser = relationOne(teacher?.user);
    const term = relationOne(cs.term);
    const cls = relationOne(cs.class);
    const schoolYear = relationOne(cls?.school_year);

    return {
      id: cs.id,
      schedule: cs.schedule,
      createdAt: cs.created_at,
      subjectName: subject?.name ?? "Unknown subject",
      subjectCode: subject?.code ?? "—",
      teacherName: teacherUser?.full_name ?? null,
      termName: term?.name ?? "—",
      classId: cls?.id ?? "",
      gradeLevel: cls?.grade_level ?? "—",
      section: cls?.section ?? "—",
      schoolYearName: schoolYear?.name ?? "—",
    };
  });

  const withSchedule = rows.filter((r) => r.schedule).length;
  const withTeacher = rows.filter((r) => r.teacherName).length;
  const classIds = new Set(rows.map((r) => r.classId).filter(Boolean));

  const byClass = rows.reduce<Record<string, ScheduleRow[]>>((acc, row) => {
    if (!row.classId) return acc;
    if (!acc[row.classId]) acc[row.classId] = [];
    acc[row.classId].push(row);
    return acc;
  }, {});

  const classGroups = Object.entries(byClass)
    .map(([classId, items]) => ({
      classId,
      gradeLevel: items[0]?.gradeLevel ?? "—",
      section: items[0]?.section ?? "—",
      schoolYearName: items[0]?.schoolYearName ?? "—",
      items: items.sort((a, b) => a.subjectName.localeCompare(b.subjectName)),
    }))
    .sort((a, b) => {
      const gradeCmp = a.gradeLevel.localeCompare(b.gradeLevel, undefined, { numeric: true });
      return gradeCmp !== 0 ? gradeCmp : a.section.localeCompare(b.section);
    });

  const classFirstDates = Object.values(byClass)
    .map((items) => items.map((item) => item.createdAt).sort()[0])
    .filter(Boolean);

  const stats = [
    {
      label: "Assignments",
      value: rows.length,
      stroke: "#9333ea",
      color: "text-purple-600",
      bg: "bg-purple-50",
      data: buildMonthlyTrend(rows.map((r) => r.createdAt)),
    },
    {
      label: "With Schedule",
      value: withSchedule,
      stroke: "#2563eb",
      color: "text-blue-600",
      bg: "bg-blue-50",
      data: buildMonthlyTrend(rows.filter((r) => r.schedule).map((r) => r.createdAt)),
    },
    {
      label: "With Teacher",
      value: withTeacher,
      stroke: "#16a34a",
      color: "text-green-600",
      bg: "bg-green-50",
      data: buildMonthlyTrend(rows.filter((r) => r.teacherName).map((r) => r.createdAt)),
    },
    {
      label: "Classes",
      value: classIds.size,
      stroke: "#d97706",
      color: "text-amber-600",
      bg: "bg-amber-50",
      data: buildMonthlyTrend(classFirstDates),
    },
  ];

  const trendSeries = stats.map((stat) => ({
    title: stat.label,
    stroke: stat.stroke,
    color: stat.color,
    bg: stat.bg,
    current: stat.value,
    data: stat.data,
  }));

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-800 px-6 py-6 text-white sm:px-8 sm:py-7">
        <div>
          <p className="text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">
            Class Timetables
          </p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Schedule</h1>
          <p className="mt-2 max-w-xl text-sm text-purple-100">
            View subject schedules across all classes
            {activeSchoolYear?.name ? ` for ${activeSchoolYear.name}` : ""}. Assign or update
            schedules from each class&apos;s subjects page.
          </p>
        </div>
      </section>

      <StatsLineChart series={trendSeries} />

      {classGroups.length === 0 ? (
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
          <CalendarDays className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-4 font-medium text-gray-700">No class subjects yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Assign subjects to classes to build schedules.
          </p>
          <Button asChild className="mt-5 bg-purple-700 hover:bg-purple-800">
            <Link href="/classes">Go to Classes</Link>
          </Button>
        </section>
      ) : (
        <div className="flex flex-col gap-5">
          {classGroups.map((group) => {
            const gradeColor = getGradeColor(group.gradeLevel);
            const scheduledCount = group.items.filter((item) => item.schedule).length;

            return (
              <section
                key={group.classId}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                        gradeColor.bg,
                        gradeColor.text
                      )}
                    >
                      {getGradeNumber(group.gradeLevel)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-semibold text-gray-900">
                        {group.gradeLevel} — {group.section}
                      </h2>
                      <p className="text-xs text-gray-500">{group.schoolYearName}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {scheduledCount}/{group.items.length} scheduled
                    </Badge>
                    <Button asChild variant="outline" size="sm" className="bg-white">
                      <Link href={`/classes/${group.classId}/subjects`}>
                        Manage
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead className="border-b bg-gray-50/80">
                      <tr>
                        <th className="px-5 py-3 text-left font-medium text-gray-600">Subject</th>
                        <th className="px-5 py-3 text-left font-medium text-gray-600">Teacher</th>
                        <th className="px-5 py-3 text-left font-medium text-gray-600">Term</th>
                        <th className="px-5 py-3 text-left font-medium text-gray-600">Schedule</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {group.items.map((item) => (
                        <tr key={item.id} className="transition-colors hover:bg-gray-50/60">
                          <td className="px-5 py-3.5">
                            <p className="font-medium text-gray-900">{item.subjectName}</p>
                            <p className="font-mono text-xs text-gray-500">{item.subjectCode}</p>
                          </td>
                          <td className="px-5 py-3.5 text-gray-700">
                            {item.teacherName ?? (
                              <span className="italic text-gray-400">Unassigned</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-gray-600">{item.termName}</td>
                          <td className="px-5 py-3.5 text-gray-700">
                            {item.schedule ? (
                              <span className="inline-flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-gray-400" />
                                {item.schedule}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="divide-y divide-gray-100 md:hidden">
                  {group.items.map((item) => (
                    <div key={item.id} className="px-5 py-4">
                      <p className="font-medium text-gray-900">{item.subjectName}</p>
                      <p className="mt-0.5 font-mono text-xs text-gray-500">{item.subjectCode}</p>
                      <p className="mt-2 text-sm text-gray-600">
                        {item.teacherName ?? (
                          <span className="italic text-gray-400">No teacher</span>
                        )}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">{item.termName}</p>
                      {item.schedule ? (
                        <p className="mt-2 flex items-center gap-1 text-sm text-gray-700">
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          {item.schedule}
                        </p>
                      ) : (
                        <p className="mt-2 text-sm text-gray-400">No schedule</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
