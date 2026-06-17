"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addClassSubject, removeClassSubject } from "./actions";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  Hash,
  Layers,
  Plus,
  School,
  Sparkles,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";

const TERM_STATUS = {
  active: { label: "Active", badge: "bg-green-100 text-green-700 hover:bg-green-100" },
  upcoming: { label: "Upcoming", badge: "bg-amber-100 text-amber-700 hover:bg-amber-100" },
  archived: { label: "Archived", badge: "bg-gray-100 text-gray-600 hover:bg-gray-100" },
} as const;

const SELECT_CLASS =
  "flex h-10 w-full rounded-lg border border-input bg-white px-3 text-sm text-gray-900 outline-none transition-colors focus:border-purple-400 focus:ring-2 focus:ring-purple-100";

function getGradeNumber(gradeLevel: string) {
  return gradeLevel.replace(/\D/g, "").slice(-2) || "?";
}

function getGradeColor(gradeLevel: string) {
  const grade = parseInt(getGradeNumber(gradeLevel), 10);
  if (grade <= 8) return { bg: "bg-blue-100", text: "text-blue-700" };
  if (grade <= 10) return { bg: "bg-purple-100", text: "text-purple-700" };
  return { bg: "bg-indigo-100", text: "text-indigo-700" };
}

function formatShortDate(value: string) {
  return new Date(value).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type ClassSubject = {
  id: string;
  termId: string;
  schedule: string | null;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  teacherId: string | null;
  teacherName: string | null;
};

export default function ClassSubjectsClient({
  cls,
  classSubjects,
  subjects,
  teachers,
  terms,
  stats,
}: {
  cls: {
    id: string;
    gradeLevel: string;
    section: string;
    status: string;
    schoolYearName: string;
    advisorName: string | null;
  };
  classSubjects: ClassSubject[];
  subjects: { id: string; name: string; code: string }[];
  teachers: { id: string; fullName: string }[];
  terms: { id: string; name: string; status: string; startDate: string; endDate: string }[];
  stats: { total: number; terms: number; withTeacher: number; enrollments: number };
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [assignSchedule, setAssignSchedule] = useState("");
  const [isPending, startTransition] = useTransition();

  const gradeColor = useMemo(() => getGradeColor(cls.gradeLevel), [cls.gradeLevel]);

  const byTerm = useMemo(() => {
    const map: Record<string, ClassSubject[]> = {};
    classSubjects.forEach((cs) => {
      if (!map[cs.termId]) map[cs.termId] = [];
      map[cs.termId].push(cs);
    });
    return map;
  }, [classSubjects]);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    formData.set("schedule", assignSchedule.trim());
    const result = await addClassSubject(formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setAssignSchedule("");
      setOpen(false);
      router.refresh();
    }
  }

  function handleRemove(id: string) {
    startTransition(async () => {
      await removeClassSubject(id);
      router.refresh();
    });
  }

  const statCards = [
    {
      label: "Assigned",
      value: stats.total,
      icon: BookOpen,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Terms",
      value: stats.terms,
      icon: Layers,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "With Teacher",
      value: stats.withTeacher,
      icon: UserCheck,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Enrolled",
      value: stats.enrollments,
      icon: Users,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-800 px-6 py-6 text-white sm:px-8 sm:py-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
              <Link
                href="/classes"
                className="inline-flex items-center gap-1 text-purple-200 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Classes
              </Link>
              <span className="text-purple-400">/</span>
              <Link
                href={`/classes/${cls.id}`}
                className="text-purple-200 transition-colors hover:text-white"
              >
                {cls.gradeLevel} — {cls.section}
              </Link>
              <span className="text-purple-400">/</span>
              <span className="font-medium text-white">Subjects</span>
            </div>
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold",
                  gradeColor.bg,
                  gradeColor.text
                )}
              >
                {getGradeNumber(cls.gradeLevel)}
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">
                  Class Subjects
                </p>
                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                  {cls.gradeLevel} — {cls.section}
                </h1>
                <p className="mt-2 text-sm text-purple-100">
                  {cls.schoolYearName}
                  {cls.advisorName ? ` · Advisor: ${cls.advisorName}` : " · No advisor"}
                </p>
              </div>
            </div>
          </div>

          <Dialog open={open} onOpenChange={(next) => {
            setOpen(next);
            if (!next) {
              setAssignSchedule("");
              setError("");
            }
          }}>
            <DialogTrigger
              render={
                <Button className="shrink-0 bg-yellow-400 font-semibold text-gray-900 hover:bg-yellow-300" />
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Assign Subject
            </DialogTrigger>
            <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
              <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
                <DialogHeader className="gap-1 text-left">
                  <DialogTitle>Assign Subject</DialogTitle>
                  <DialogDescription>
                    Link a subject to this class for a specific term.
                  </DialogDescription>
                </DialogHeader>
              </div>
              <form onSubmit={handleAdd} className="space-y-4 px-5 py-5">
                <input type="hidden" name="class_id" value={cls.id} />

                <div className="space-y-1.5">
                  <Label htmlFor="term_id">Term</Label>
                  <select id="term_id" name="term_id" required className={SELECT_CLASS}>
                    <option value="">Select term...</option>
                    {terms.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="subject_id">Subject</Label>
                  <select id="subject_id" name="subject_id" required className={SELECT_CLASS}>
                    <option value="">Select subject...</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="teacher_id">Teacher</Label>
                  <select id="teacher_id" name="teacher_id" className={SELECT_CLASS}>
                    <option value="">No teacher assigned</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="schedule">Schedule</Label>
                  <input
                    id="schedule"
                    name="schedule"
                    value={assignSchedule}
                    onChange={(e) => setAssignSchedule(e.target.value)}
                    placeholder="e.g. Mon/Wed 8:00–9:00 AM"
                    className={SELECT_CLASS}
                  />
                </div>

                {error && (
                  <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                    {error}
                  </p>
                )}

                <div className="flex gap-3 border-t border-gray-100 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-purple-700 hover:bg-purple-800"
                  >
                    {loading ? "Assigning..." : "Assign Subject"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">{stat.label}</p>
                  <p className="mt-1.5 text-2xl font-bold text-gray-900 sm:text-3xl">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={cn("rounded-xl p-2.5", stat.bg)}>
                  <Icon className={cn("h-5 w-5", stat.color)} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="flex min-w-0 flex-col gap-5">
          {terms.length === 0 ? (
            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-4 font-medium text-gray-700">No terms found</p>
              <p className="mt-1 text-sm text-gray-500">
                Add terms to this class&apos;s school year before assigning subjects.
              </p>
            </section>
          ) : (
            terms.map((term) => {
              const termSubjects = byTerm[term.id] ?? [];
              const termConfig =
                TERM_STATUS[term.status as keyof typeof TERM_STATUS] ?? TERM_STATUS.archived;

              return (
                <section
                  key={term.id}
                  className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white"
                >
                  <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-gray-900">{term.name}</h2>
                      <Badge className={termConfig.badge}>{termConfig.label}</Badge>
                      <span className="ml-auto text-xs text-gray-500">
                        {termSubjects.length} subject{termSubjects.length === 1 ? "" : "s"}
                      </span>
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatShortDate(term.startDate)} — {formatShortDate(term.endDate)}
                    </p>
                  </div>

                  {termSubjects.length === 0 ? (
                    <p className="px-5 py-8 text-sm text-gray-500">
                      No subjects assigned for this term yet.
                    </p>
                  ) : (
                    <>
                      <div className="hidden overflow-x-auto md:block">
                        <table className="w-full min-w-[640px] text-sm">
                          <thead className="border-b bg-gray-50/80">
                            <tr>
                              <th className="px-5 py-3 text-left font-medium text-gray-600">
                                Subject
                              </th>
                              <th className="px-5 py-3 text-left font-medium text-gray-600">
                                Teacher
                              </th>
                              <th className="px-5 py-3 text-left font-medium text-gray-600">
                                Schedule
                              </th>
                              <th className="px-5 py-3 text-right font-medium text-gray-600">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {termSubjects.map((cs) => (
                              <tr key={cs.id} className="transition-colors hover:bg-gray-50/60">
                                <td className="px-5 py-3.5">
                                  <p className="font-medium text-gray-900">{cs.subjectName}</p>
                                  <p className="font-mono text-xs text-gray-500">{cs.subjectCode}</p>
                                </td>
                                <td className="px-5 py-3.5 text-gray-700">
                                  {cs.teacherName ?? (
                                    <span className="italic text-gray-400">Unassigned</span>
                                  )}
                                </td>
                                <td className="px-5 py-3.5 text-gray-700">
                                  {cs.schedule ?? (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </td>
                                <td className="px-5 py-3.5 text-right">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 px-2 text-red-500 hover:bg-red-50 hover:text-red-700"
                                    disabled={isPending}
                                    onClick={() => handleRemove(cs.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="divide-y divide-gray-100 md:hidden">
                        {termSubjects.map((cs) => (
                          <div key={cs.id} className="flex items-start justify-between gap-3 px-5 py-4">
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900">{cs.subjectName}</p>
                              <p className="mt-0.5 font-mono text-xs text-gray-500">{cs.subjectCode}</p>
                              <p className="mt-2 text-sm text-gray-600">
                                {cs.teacherName ?? (
                                  <span className="italic text-gray-400">No teacher</span>
                                )}
                              </p>
                              {cs.schedule ? (
                                <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  {cs.schedule}
                                </p>
                              ) : null}
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="shrink-0 text-red-500 hover:text-red-700"
                              disabled={isPending}
                              onClick={() => handleRemove(cs.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </section>
              );
            })
          )}
        </div>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-7">
          <section className="rounded-xl border border-purple-200 bg-purple-50/40 p-5">
            <h2 className="text-base font-bold text-gray-900">Class Overview</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Section</span>
                <span className="font-medium text-gray-900">
                  {cls.gradeLevel} — {cls.section}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">School year</span>
                <span className="font-medium text-gray-900">{cls.schoolYearName}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Subjects</span>
                <span className="font-medium text-gray-900">{stats.total}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Enrolled</span>
                <span className="font-medium text-gray-900">{stats.enrollments}</span>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="mt-4 w-full bg-white">
              <Link href={`/classes/${cls.id}`}>
                <School className="mr-2 h-4 w-4" />
                Edit class
              </Link>
            </Button>
          </section>

          {stats.total > 0 && (
            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
                <h2 className="font-semibold text-gray-900">Coverage</h2>
                <p className="mt-0.5 text-sm text-gray-500">Teacher assignment progress</p>
              </div>
              <div className="p-5">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">With teacher</span>
                  <span className="text-gray-500">
                    {stats.withTeacher} / {stats.total}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{
                      width: `${stats.total > 0 ? Math.round((stats.withTeacher / stats.total) * 100) : 0}%`,
                    }}
                  />
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                  {stats.total - stats.withTeacher === 0
                    ? "All subjects have teachers assigned"
                    : `${stats.total - stats.withTeacher} subject${stats.total - stats.withTeacher === 1 ? "" : "s"} still need a teacher`}
                </p>
              </div>
            </section>
          )}

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="rounded-lg bg-purple-50 p-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Quick Guide</h2>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                  1
                </span>
                <span>Assign subjects per term for this class section.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                  2
                </span>
                <span>Link a teacher and schedule for each subject offering.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                  3
                </span>
                <span>Teachers use these links for attendance and grades.</span>
              </li>
            </ul>
            <Link
              href="/subjects"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700"
            >
              <Hash className="h-3.5 w-3.5" />
              Manage subject catalog
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
