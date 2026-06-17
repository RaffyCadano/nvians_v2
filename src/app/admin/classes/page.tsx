import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ALLOWED_GRADE_LEVELS } from "@/lib/constants/grade-levels";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteClassButton } from "./delete-class-button";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Layers,
  Plus,
  School,
  UserCheck,
  Users,
} from "lucide-react";

type ClassRow = {
  id: string;
  grade_level: string;
  section: string;
  status: "active" | "archived";
  school_year: { name: string } | null;
  advisor: { user: { full_name: string } | null } | null;
  enrollments: { count: number }[];
  class_subjects: { count: number }[];
};

const STATUS_CONFIG = {
  active: {
    label: "Active",
    badge: "bg-green-100 text-green-700 hover:bg-green-100",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  archived: {
    label: "Archived",
    badge: "bg-gray-100 text-gray-600 hover:bg-gray-100",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-500",
  },
} as const;

function getGradeNumber(gradeLevel: string) {
  return gradeLevel.replace(/\D/g, "").slice(-2) || "?";
}

function getGradeColor(gradeLevel: string) {
  const grade = parseInt(getGradeNumber(gradeLevel), 10);
  if (grade <= 8) return { bg: "bg-blue-100", text: "text-blue-700", bar: "bg-blue-500" };
  if (grade <= 10) return { bg: "bg-purple-100", text: "text-purple-700", bar: "bg-purple-500" };
  return { bg: "bg-indigo-100", text: "text-indigo-700", bar: "bg-indigo-500" };
}

export default async function ClassesPage() {
  const supabase = await createClient();

  const [{ data: classes }, { data: activeSchoolYear }] = await Promise.all([
    supabase
      .from("classes")
      .select(
        "*, school_year:school_years(name), advisor:teachers(user:users(full_name)), enrollments(count), class_subjects(count)"
      )
      .order("grade_level")
      .order("section"),
    supabase
      .from("school_years")
      .select("id, name, start_date, end_date")
      .eq("status", "active")
      .maybeSingle(),
  ]);

  const rows = (classes ?? []) as ClassRow[];
  const activeCount = rows.filter((c) => c.status === "active").length;
  const withAdvisor = rows.filter((c) => c.advisor?.user?.full_name).length;
  const totalStudents = rows.reduce(
    (sum, c) => sum + (c.enrollments?.[0]?.count ?? 0),
    0
  );

  const gradeCounts = ALLOWED_GRADE_LEVELS.map((grade) => ({
    grade,
    count: rows.filter((c) => c.grade_level === grade).length,
  })).filter((g) => g.count > 0);

  const stats = [
    {
      label: "Total Classes",
      value: rows.length,
      icon: School,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Active",
      value: activeCount,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "With Advisor",
      value: withAdvisor,
      icon: UserCheck,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Enrolled Students",
      value: totalStudents,
      icon: Users,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-800 px-6 py-6 text-white sm:px-8 sm:py-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">
              Class Management
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Classes</h1>
            <p className="mt-2 max-w-xl text-sm text-purple-100">
              Manage grade sections, assign class advisors, link subjects, and track enrolled
              students per class.
            </p>
          </div>
          <Button
            asChild
            className="shrink-0 bg-yellow-400 font-semibold text-gray-900 hover:bg-yellow-300"
          >
            <Link href="/classes/new">
              <Plus className="mr-2 h-4 w-4" />
              New Class
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">{stat.label}</p>
                  <p className="mt-1.5 text-2xl font-bold text-gray-900 sm:text-3xl">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`rounded-xl p-2.5 ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        {/* Main list */}
        <section className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
            <h2 className="font-semibold text-gray-900">All Classes</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              {rows.length === 0
                ? "No classes created yet"
                : `${rows.length} class section${rows.length === 1 ? "" : "s"} across all school years`}
            </p>
          </div>

          {rows.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {rows.map((cls) => {
                const config = STATUS_CONFIG[cls.status] ?? STATUS_CONFIG.active;
                const gradeColor = getGradeColor(cls.grade_level);
                const studentCount = cls.enrollments?.[0]?.count ?? 0;
                const subjectCount = cls.class_subjects?.[0]?.count ?? 0;
                const advisorName = cls.advisor?.user?.full_name;

                return (
                  <div
                    key={cls.id}
                    className="px-5 py-5 transition-colors hover:bg-gray-50/60"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex min-w-0 flex-1 gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${gradeColor.bg} ${gradeColor.text}`}
                        >
                          {getGradeNumber(cls.grade_level)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {cls.grade_level} — {cls.section}
                            </h3>
                            <Badge className={config.badge}>{config.label}</Badge>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                            <span className="inline-flex items-center gap-1.5">
                              <Layers className="h-3.5 w-3.5" />
                              {cls.school_year?.name ?? "No school year"}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <UserCheck className="h-3.5 w-3.5" />
                              {advisorName ?? (
                                <span className="italic text-gray-400">No advisor</span>
                              )}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <GraduationCap className="h-3.5 w-3.5" />
                              {studentCount} student{studentCount === 1 ? "" : "s"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/classes/${cls.id}`}>Edit</Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/classes/${cls.id}/subjects`}>
                            <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                            Subjects
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm" className="text-blue-600">
                          <Link href={`/enrollment?class=${cls.id}`}>
                            <Users className="mr-1.5 h-3.5 w-3.5" />
                            Students
                          </Link>
                        </Button>
                        <DeleteClassButton
                          classId={cls.id}
                          gradeLevel={cls.grade_level}
                          section={cls.section}
                          schoolYearName={cls.school_year?.name ?? "No school year"}
                          studentCount={studentCount}
                          subjectCount={subjectCount}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50">
                <School className="h-8 w-8 text-purple-400" />
              </div>
              <p className="mt-5 text-lg font-semibold text-gray-900">No classes yet</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                Create class sections for each grade level and assign advisors to get started.
              </p>
              <Button
                asChild
                className="mt-6 bg-yellow-400 font-semibold text-gray-900 hover:bg-yellow-300"
              >
                <Link href="/classes/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Class
                </Link>
              </Button>
            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-7">
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="rounded-lg bg-purple-50 p-2">
                <Layers className="h-4 w-4 text-purple-600" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Active School Year</h2>
            </div>
            {activeSchoolYear ? (
              <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-4">
                <p className="text-lg font-semibold text-gray-900">{activeSchoolYear.name}</p>
                <p className="mt-1 text-sm text-gray-600">
                  Classes are linked to their school year when created.
                </p>
                <Link
                  href="/school-years"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                  Manage school years
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-center">
                <p className="text-sm font-medium text-gray-700">No active school year</p>
                <Button asChild size="sm" className="mt-4 bg-yellow-500 text-gray-900 hover:bg-yellow-400">
                  <Link href="/school-years/new">Set Up School Year</Link>
                </Button>
              </div>
            )}
          </section>

          {gradeCounts.length > 0 && (
            <section className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-base font-bold text-gray-900">By Grade Level</h2>
              <ul className="mt-4 space-y-2">
                {gradeCounts.map(({ grade, count }) => {
                  const colors = getGradeColor(grade);
                  return (
                    <li
                      key={grade}
                      className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2.5"
                    >
                      <span className="flex items-center gap-2.5 text-sm font-medium text-gray-800">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold ${colors.bg} ${colors.text}`}
                        >
                          {getGradeNumber(grade)}
                        </span>
                        {grade}
                      </span>
                      <Badge variant="secondary" className="bg-white text-gray-700">
                        {count}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-base font-bold text-gray-900">Quick Guide</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                  1
                </span>
                <span>Create a class with grade level, section, and school year.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                  2
                </span>
                <span>Assign a class advisor and link subjects to the section.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                  3
                </span>
                <span>Enroll students into the class from the Enrollment page.</span>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
