import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Plus,
  Search,
  UserRound,
  Users,
  UserX,
} from "lucide-react";

type StudentRow = {
  id: string;
  student_number: string | null;
  gender: string | null;
  parent_name: string | null;
  parent_contact: string | null;
  status: "active" | "disabled";
  user: { full_name: string; email: string } | null;
};

type EnrollmentRow = {
  student_id: string;
  status: string;
  class: { grade_level: string; section: string } | null;
};

const STATUS_CONFIG = {
  active: {
    label: "Active",
    badge: "bg-green-100 text-green-700 hover:bg-green-100",
    avatar: "bg-blue-100 text-blue-700",
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

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: searchQuery } = await searchParams;
  const supabase = await createClient();

  const [{ data: students }, { data: enrollments }] = await Promise.all([
    supabase
      .from("students")
      .select("*, user:users(full_name, email)")
      .order("created_at", { ascending: false }),
    supabase
      .from("enrollments")
      .select("student_id, status, class:classes(grade_level, section)")
      .eq("status", "enrolled"),
  ]);

  const term = searchQuery?.trim().toLowerCase();
  const rows = ((students ?? []) as StudentRow[]).filter((student) => {
    if (!term) return true;
    return (
      student.user?.full_name?.toLowerCase().includes(term) ||
      student.user?.email?.toLowerCase().includes(term) ||
      student.student_number?.toLowerCase().includes(term) ||
      student.parent_name?.toLowerCase().includes(term)
    );
  });

  const enrollmentByStudent = ((enrollments ?? []) as EnrollmentRow[]).reduce<
    Record<string, EnrollmentRow[]>
  >((acc, row) => {
    if (!acc[row.student_id]) acc[row.student_id] = [];
    acc[row.student_id].push(row);
    return acc;
  }, {});

  const activeCount = rows.filter((s) => s.status === "active").length;
  const disabledCount = rows.filter((s) => s.status === "disabled").length;
  const enrolledCount = rows.filter((s) => (enrollmentByStudent[s.id]?.length ?? 0) > 0).length;
  const unenrolledCount = rows.length - enrolledCount;

  const genderCounts = Object.entries(
    rows.reduce<Record<string, number>>((acc, s) => {
      const gender = s.gender?.trim() || "Not specified";
      acc[gender] = (acc[gender] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const stats = [
    {
      label: "Total Students",
      value: rows.length,
      icon: GraduationCap,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active",
      value: activeCount,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Enrolled",
      value: enrolledCount,
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Not Enrolled",
      value: unenrolledCount,
      icon: ClipboardList,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-800 px-6 py-6 text-white sm:px-8 sm:py-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">
              Student Records
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Students</h1>
            <p className="mt-2 max-w-xl text-sm text-blue-100">
              Manage student profiles, guardian information, and class enrollments across the
              school.
            </p>
          </div>
          <Button
            asChild
            className="shrink-0 bg-yellow-400 font-semibold text-gray-900 hover:bg-yellow-300"
          >
            <Link href="/students/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Student
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

      {/* Search */}
      <form className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            name="q"
            defaultValue={searchQuery}
            placeholder="Search by name, email, student no., or parent..."
            className="bg-white pl-9"
          />
        </div>
        <Button type="submit" variant="outline" className="shrink-0">
          Search
        </Button>
        {searchQuery && (
          <Button asChild variant="ghost" className="shrink-0 text-gray-600">
            <Link href="/students">Clear</Link>
          </Button>
        )}
      </form>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        {/* Main list */}
        <section className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
            <h2 className="font-semibold text-gray-900">
              {searchQuery ? `Results for "${searchQuery}"` : "All Students"}
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">
              {rows.length === 0
                ? "No students found"
                : `${rows.length} student${rows.length === 1 ? "" : "s"}`}
            </p>
          </div>

          {rows.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {rows.map((student) => {
                const config = STATUS_CONFIG[student.status] ?? STATUS_CONFIG.active;
                const name = student.user?.full_name ?? "Unknown";
                const studentEnrollments = enrollmentByStudent[student.id] ?? [];
                const primaryClass = studentEnrollments[0]?.class;

                return (
                  <div
                    key={student.id}
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
                            {student.user?.email}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                            {student.student_number && (
                              <span className="font-mono text-xs text-gray-600">
                                #{student.student_number}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1.5">
                              <UserRound className="h-3.5 w-3.5" />
                              {student.parent_name ?? (
                                <span className="italic text-gray-400">No parent on file</span>
                              )}
                            </span>
                            {student.gender && <span>{student.gender}</span>}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {primaryClass ? (
                              <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
                                {primaryClass.grade_level} — {primaryClass.section}
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-amber-50 text-amber-700">
                                Not enrolled
                              </Badge>
                            )}
                            {studentEnrollments.length > 1 && (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                                +{studentEnrollments.length - 1} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/students/${student.id}`}>View</Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm" className="text-blue-600">
                          <Link href={`/enrollment/new?student=${student.id}`}>
                            Enroll
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
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                <GraduationCap className="h-8 w-8 text-blue-400" />
              </div>
              <p className="mt-5 text-lg font-semibold text-gray-900">
                {searchQuery ? "No students match your search" : "No students yet"}
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                {searchQuery
                  ? "Try a different name, student number, or parent name."
                  : "Add students to the system, then enroll them into class sections."}
              </p>
              {!searchQuery && (
                <Button
                  asChild
                  className="mt-6 bg-yellow-400 font-semibold text-gray-900 hover:bg-yellow-300"
                >
                  <Link href="/students/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Student
                  </Link>
                </Button>
              )}
            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-7">
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-base font-bold text-gray-900">Enrollment Overview</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 px-3 py-3 text-center">
                <p className="text-2xl font-bold text-indigo-700">{enrolledCount}</p>
                <p className="text-xs text-indigo-600">Enrolled</p>
              </div>
              <div className="rounded-lg border border-amber-100 bg-amber-50/50 px-3 py-3 text-center">
                <p className="text-2xl font-bold text-amber-700">{unenrolledCount}</p>
                <p className="text-xs text-amber-600">Pending</p>
              </div>
            </div>
            <Link
              href="/enrollment"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Open enrollment
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </section>

          {disabledCount > 0 && (
            <section className="rounded-xl border border-gray-200 bg-white p-5">
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

          {genderCounts.length > 0 && genderCounts.some(([g]) => g !== "Not specified") && (
            <section className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-base font-bold text-gray-900">By Gender</h2>
              <ul className="mt-4 space-y-2">
                {genderCounts.slice(0, 5).map(([gender, count]) => (
                  <li
                    key={gender}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2.5"
                  >
                    <span className="text-sm font-medium text-gray-800">{gender}</span>
                    <Badge variant="secondary" className="bg-white text-gray-700">
                      {count}
                    </Badge>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-base font-bold text-gray-900">Quick Guide</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  1
                </span>
                <span>Add a student with profile and parent/guardian details.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  2
                </span>
                <span>Enroll the student into a class for the active school year.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  3
                </span>
                <span>View the student record for grades and attendance history.</span>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
