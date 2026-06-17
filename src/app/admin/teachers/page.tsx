import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  Plus,
  School,
  Search,
  UserCheck,
  UserX,
} from "lucide-react";

type TeacherRow = {
  id: string;
  employee_number: string | null;
  department: string | null;
  specialization: string | null;
  status: "active" | "disabled";
  user: { full_name: string; email: string } | null;
};

const STATUS_CONFIG = {
  active: {
    label: "Active",
    badge: "bg-green-100 text-green-700 hover:bg-green-100",
    avatar: "bg-green-100 text-green-700",
  },
  disabled: {
    label: "Disabled",
    badge: "bg-red-100 text-red-700 hover:bg-red-100",
    avatar: "bg-red-100 text-red-600",
  },
} as const;

function getInitials(name: string | undefined) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function TeachersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: searchQuery } = await searchParams;
  const supabase = await createClient();

  const [{ data: teachers }, { data: advisorClasses }, { data: subjectAssignments }] =
    await Promise.all([
      supabase
        .from("teachers")
        .select("*, user:users(full_name, email)")
        .order("created_at", { ascending: false }),
      supabase.from("classes").select("advisor_id").not("advisor_id", "is", null),
      supabase.from("class_subjects").select("teacher_id").not("teacher_id", "is", null),
    ]);

  const term = searchQuery?.trim().toLowerCase();
  const rows = ((teachers ?? []) as TeacherRow[]).filter((teacher) => {
    if (!term) return true;
    return (
      teacher.user?.full_name?.toLowerCase().includes(term) ||
      teacher.user?.email?.toLowerCase().includes(term) ||
      teacher.employee_number?.toLowerCase().includes(term) ||
      teacher.department?.toLowerCase().includes(term)
    );
  });

  const advisorCountByTeacher = (advisorClasses ?? []).reduce<Record<string, number>>(
    (acc, row) => {
      if (row.advisor_id) acc[row.advisor_id] = (acc[row.advisor_id] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const subjectCountByTeacher = (subjectAssignments ?? []).reduce<Record<string, number>>(
    (acc, row) => {
      if (row.teacher_id) acc[row.teacher_id] = (acc[row.teacher_id] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const activeCount = rows.filter((t) => t.status === "active").length;
  const disabledCount = rows.filter((t) => t.status === "disabled").length;
  const withAdvisory = rows.filter((t) => (advisorCountByTeacher[t.id] ?? 0) > 0).length;
  const teachingSubjects = rows.filter((t) => (subjectCountByTeacher[t.id] ?? 0) > 0).length;

  const departmentCounts = Object.entries(
    rows.reduce<Record<string, number>>((acc, t) => {
      const dept = t.department?.trim() || "Unassigned";
      acc[dept] = (acc[dept] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const stats = [
    {
      label: "Total Teachers",
      value: rows.length,
      icon: UserCheck,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Active",
      value: activeCount,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Class Advisors",
      value: withAdvisory,
      icon: School,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Teaching Subjects",
      value: teachingSubjects,
      icon: BookOpen,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-green-900 to-emerald-800 px-6 py-6 text-white sm:px-8 sm:py-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">
              Faculty
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Teachers</h1>
            <p className="mt-2 max-w-xl text-sm text-green-100">
              Manage teacher accounts, departments, class advisories, and subject assignments.
            </p>
          </div>
          <Button
            asChild
            className="shrink-0 bg-yellow-400 font-semibold text-gray-900 hover:bg-yellow-300"
          >
            <Link href="/teachers/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Teacher
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
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
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

      {/* Search */}
      <form className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            name="q"
            defaultValue={searchQuery}
            placeholder="Search by name, email, or employee number..."
            className="bg-white pl-9"
          />
        </div>
        <Button type="submit" variant="outline" className="shrink-0">
          Search
        </Button>
        {searchQuery && (
          <Button asChild variant="ghost" className="shrink-0 text-gray-600">
            <Link href="/teachers">Clear</Link>
          </Button>
        )}
      </form>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        {/* Main list */}
        <section className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
            <h2 className="font-semibold text-gray-900">
              {searchQuery ? `Results for "${searchQuery}"` : "All Teachers"}
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">
              {rows.length === 0
                ? "No teachers found"
                : `${rows.length} teacher${rows.length === 1 ? "" : "s"}`}
            </p>
          </div>

          {rows.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {rows.map((teacher) => {
                const config = STATUS_CONFIG[teacher.status] ?? STATUS_CONFIG.active;
                const advisoryCount = advisorCountByTeacher[teacher.id] ?? 0;
                const subjectCount = subjectCountByTeacher[teacher.id] ?? 0;
                const name = teacher.user?.full_name ?? "Unknown";

                return (
                  <div
                    key={teacher.id}
                    className="px-5 py-5 transition-colors hover:bg-gray-50/60"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 flex-1 gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold ${config.avatar}`}
                        >
                          {getInitials(name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
                            <Badge className={config.badge}>{config.label}</Badge>
                          </div>
                          <p className="mt-0.5 truncate text-sm text-gray-500">
                            {teacher.user?.email}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                            {teacher.employee_number && (
                              <span className="font-mono text-xs text-gray-600">
                                #{teacher.employee_number}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1.5">
                              <Building2 className="h-3.5 w-3.5" />
                              {teacher.department ?? (
                                <span className="italic text-gray-400">No department</span>
                              )}
                            </span>
                            {teacher.specialization && (
                              <span className="inline-flex items-center gap-1.5">
                                <BookOpen className="h-3.5 w-3.5" />
                                {teacher.specialization}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {advisoryCount > 0 && (
                              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                {advisoryCount} advisory class{advisoryCount === 1 ? "" : "es"}
                              </Badge>
                            )}
                            {subjectCount > 0 && (
                              <Badge variant="secondary" className="bg-amber-50 text-amber-700">
                                {subjectCount} subject{subjectCount === 1 ? "" : "s"}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/teachers/${teacher.id}`}>Edit</Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm" className="text-green-600">
                          <Link href={`/teachers/${teacher.id}`}>
                            View
                            <ArrowRight className="ml-1 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
                <UserCheck className="h-8 w-8 text-green-400" />
              </div>
              <p className="mt-5 text-lg font-semibold text-gray-900">
                {searchQuery ? "No teachers match your search" : "No teachers yet"}
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                {searchQuery
                  ? "Try a different name, email, or employee number."
                  : "Add teachers to assign them as class advisors and subject instructors."}
              </p>
              {!searchQuery && (
                <Button
                  asChild
                  className="mt-6 bg-yellow-400 font-semibold text-gray-900 hover:bg-yellow-300"
                >
                  <Link href="/teachers/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Teacher
                  </Link>
                </Button>
              )}
            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-7">
          {disabledCount > 0 && (
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2.5">
                <UserX className="h-4 w-4 text-red-500" />
                <h2 className="text-base font-bold text-gray-900">Account Status</h2>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-green-100 bg-green-50/50 px-3 py-3 text-center">
                  <p className="text-2xl font-bold text-green-700">{activeCount}</p>
                  <p className="text-xs text-green-600">Active</p>
                </div>
                <div className="rounded-lg border border-red-100 bg-red-50/50 px-3 py-3 text-center">
                  <p className="text-2xl font-bold text-red-600">{disabledCount}</p>
                  <p className="text-xs text-red-500">Disabled</p>
                </div>
              </div>
            </section>
          )}

          {departmentCounts.length > 0 && (
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-gray-900">By Department</h2>
              <ul className="mt-4 space-y-2">
                {departmentCounts.slice(0, 6).map(([dept, count]) => (
                  <li
                    key={dept}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2.5"
                  >
                    <span className="truncate text-sm font-medium text-gray-800">{dept}</span>
                    <Badge variant="secondary" className="ml-2 shrink-0 bg-white text-gray-700">
                      {count}
                    </Badge>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900">Quick Guide</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                  1
                </span>
                <span>Add a teacher with employee number and department.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                  2
                </span>
                <span>Assign as class advisor from the Classes page.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                  3
                </span>
                <span>Link teachers to subjects per class section.</span>
              </li>
            </ul>
            <Link
              href="/classes"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700"
            >
              Manage classes
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
