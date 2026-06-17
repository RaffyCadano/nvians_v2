import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  School,
  Sparkles,
  User,
  UserCheck,
  UserX,
} from "lucide-react";

type AttendanceRecord = {
  id: string;
  status: string;
  remarks: string | null;
  studentId: string;
  studentName: string;
  studentNumber: string | null;
};

const STATUS_CONFIG = {
  present: {
    label: "Present",
    badge: "bg-green-100 text-green-700 hover:bg-green-100",
    dot: "bg-green-500",
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  absent: {
    label: "Absent",
    badge: "bg-red-100 text-red-700 hover:bg-red-100",
    dot: "bg-red-500",
    icon: UserX,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  excused: {
    label: "Excused",
    badge: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    dot: "bg-amber-500",
    icon: CalendarCheck,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
} as const;

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? {
    label: status,
    badge: "bg-gray-100 text-gray-600 hover:bg-gray-100",
    dot: "bg-gray-400",
    icon: User,
    color: "text-gray-600",
    bg: "bg-gray-50",
  };
}

export default function AttendanceSessionDetail({
  session,
  classInfo,
  records,
}: {
  session: { id: string; date: string; createdAt: string };
  classInfo: {
    classSubjectId: string;
    classId: string;
    subjectName: string;
    subjectCode: string;
    gradeLevel: string;
    section: string;
    teacherName: string;
  };
  records: AttendanceRecord[];
}) {
  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const excused = records.filter((r) => r.status === "excused").length;
  const total = records.length;
  const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

  const statCards = [
    {
      label: "Total Students",
      value: total,
      icon: ClipboardList,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      label: "Present",
      value: present,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Absent",
      value: absent,
      icon: UserX,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Attendance Rate",
      value: `${attendanceRate}%`,
      icon: UserCheck,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      isText: true,
    },
  ];

  const breakdown = [
    { key: "present", count: present },
    { key: "absent", count: absent },
    { key: "excused", count: excused },
  ].filter((item) => item.count > 0);

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-teal-900 to-cyan-800 px-6 py-6 text-white sm:px-8 sm:py-7">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-2 mb-4 text-teal-200 hover:bg-white/10 hover:text-white"
        >
          <Link href="/attendance">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Attendance
          </Link>
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">
              Attendance Session
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{classInfo.subjectName}</h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-teal-100">
              <span className="inline-flex items-center gap-1.5">
                <School className="h-4 w-4 shrink-0" />
                {classInfo.gradeLevel} — {classInfo.section}
              </span>
              <span className="hidden text-teal-300 sm:inline">·</span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 shrink-0" />
                {format(new Date(session.date), "MMMM d, yyyy")}
              </span>
            </p>
            <p className="mt-1 text-sm text-teal-200/90">
              Recorded by {classInfo.teacherName}
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <CalendarCheck className="h-6 w-6 text-yellow-400" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">{stat.label}</p>
                  <p
                    className={cn(
                      "mt-1.5 font-bold text-gray-900",
                      stat.isText ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
                    )}
                  >
                    {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                  </p>
                </div>
                <div className={cn("shrink-0 rounded-xl p-2.5", stat.bg)}>
                  <Icon className={cn("h-5 w-5", stat.color)} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <section className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
            <h2 className="font-semibold text-gray-900">Student Records</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              {total} student{total === 1 ? "" : "s"} in this session
            </p>
          </div>

          {records.length > 0 ? (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="border-b bg-gray-50/80">
                    <tr>
                      <th className="px-5 py-3 text-left font-medium text-gray-600">Student</th>
                      <th className="px-5 py-3 text-left font-medium text-gray-600">Student No.</th>
                      <th className="px-5 py-3 text-left font-medium text-gray-600">Status</th>
                      <th className="px-5 py-3 text-left font-medium text-gray-600">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {records.map((record) => {
                      const config = getStatusConfig(record.status);
                      return (
                        <tr key={record.id} className="transition-colors hover:bg-gray-50/60">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-700">
                                {getInitials(record.studentName)}
                              </div>
                              <span className="font-medium text-gray-900">{record.studentName}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-mono text-xs text-gray-500">
                            {record.studentNumber ?? "—"}
                          </td>
                          <td className="px-5 py-3.5">
                            <Badge variant="secondary" className={config.badge}>
                              {config.label}
                            </Badge>
                          </td>
                          <td className="px-5 py-3.5 text-gray-500">{record.remarks ?? "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-gray-100 md:hidden">
                {records.map((record) => {
                  const config = getStatusConfig(record.status);
                  return (
                    <div key={record.id} className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">
                          {getInitials(record.studentName)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium text-gray-900">{record.studentName}</p>
                            <Badge variant="secondary" className={config.badge}>
                              {config.label}
                            </Badge>
                          </div>
                          <p className="mt-1 font-mono text-xs text-gray-500">
                            {record.studentNumber ?? "No student number"}
                          </p>
                          {record.remarks && (
                            <p className="mt-2 text-sm text-gray-600">{record.remarks}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="px-6 py-16 text-center">
              <ClipboardList className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-4 font-medium text-gray-700">No records in this session</p>
              <p className="mt-1 text-sm text-gray-500">
                Students appear here once attendance is recorded.
              </p>
            </div>
          )}
        </section>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-7">
          <section className="rounded-xl border border-teal-200 bg-teal-50/40 p-5">
            <h2 className="text-base font-bold text-gray-900">Session Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Date</span>
                <span className="font-medium text-gray-900">
                  {format(new Date(session.date), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Subject</span>
                <span className="text-right font-medium text-gray-900">{classInfo.subjectName}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Class</span>
                <span className="font-medium text-gray-900">
                  {classInfo.gradeLevel} — {classInfo.section}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Teacher</span>
                <span className="text-right font-medium text-gray-900">{classInfo.teacherName}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Code</span>
                <Badge className="bg-white font-mono text-gray-700 hover:bg-white">
                  {classInfo.subjectCode}
                </Badge>
              </div>
            </div>
          </section>

          {total > 0 && (
            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
                <h2 className="font-semibold text-gray-900">Breakdown</h2>
                <p className="mt-0.5 text-sm text-gray-500">{attendanceRate}% present rate</p>
              </div>
              <div className="space-y-4 p-5">
                {breakdown.map((item) => {
                  const config = getStatusConfig(item.key);
                  const pct = Math.round((item.count / total) * 100);
                  return (
                    <div key={item.key}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">{config.label}</span>
                        <span className="text-gray-500">
                          {item.count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={cn("h-full rounded-full", config.dot)}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {classInfo.classId && (
            <section className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-2.5">
                <div className="rounded-lg bg-teal-50 p-2">
                  <BookOpen className="h-4 w-4 text-teal-600" />
                </div>
                <h2 className="text-base font-bold text-gray-900">Class Context</h2>
              </div>
              <p className="text-sm text-gray-600">
                This session belongs to {classInfo.subjectName} for {classInfo.gradeLevel} —{" "}
                {classInfo.section}.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                <Link href={`/classes/${classInfo.classId}/subjects`}>
                  View class subjects
                </Link>
              </Button>
            </section>
          )}

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="rounded-lg bg-teal-50 p-2">
                <Sparkles className="h-4 w-4 text-teal-600" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Quick Guide</h2>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                  1
                </span>
                <span>Teachers record attendance once per class subject per day.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                  2
                </span>
                <span>Present, absent, and excused statuses are tracked per student.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                  3
                </span>
                <span>Use remarks for notes about late arrivals or excused absences.</span>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
