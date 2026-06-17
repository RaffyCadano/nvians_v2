import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Calendar,
  ClipboardList,
  GraduationCap,
  Newspaper,
  Plus,
  School,
  UserCheck,
  Users,
} from "lucide-react";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate() {
  return new Date().toLocaleDateString("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatShortDate(value: string) {
  return new Date(value).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const QUICK_ACTIONS = [
  {
    label: "Enroll Student",
    href: "/enrollment/new",
    icon: ClipboardList,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Add Teacher",
    href: "/teachers/new",
    icon: UserCheck,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    label: "Create Class",
    href: "/classes/new",
    icon: School,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    label: "Post News",
    href: "/cms/news/new",
    icon: Newspaper,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

const MANAGEMENT_LINKS = [
  { label: "Students", href: "/students", icon: GraduationCap, countKey: "students" as const },
  { label: "Teachers", href: "/teachers", icon: UserCheck, countKey: "teachers" as const },
  { label: "Classes", href: "/classes", icon: School, countKey: "classes" as const },
  { label: "Subjects", href: "/subjects", icon: BookOpen, countKey: "subjects" as const },
  { label: "Enrollment", href: "/enrollment", icon: ClipboardList, countKey: "enrollments" as const },
  { label: "Reports", href: "/reports", icon: BarChart3, countKey: null },
];

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const { data: profile } = authUser
    ? await supabase.from("users").select("full_name").eq("id", authUser.id).single()
    : { data: null };

  const displayName = profile?.full_name?.split(" ")[0] ?? "Admin";

  const [
    { count: studentCount },
    { count: teacherCount },
    { count: classCount },
    { count: subjectCount },
    { count: enrollmentCount },
    { data: activeSchoolYear },
    { data: recentEnrollments },
  ] = await Promise.all([
    supabase.from("students").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("teachers").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("classes").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("subjects").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("status", "enrolled"),
    supabase
      .from("school_years")
      .select("id, name, start_date, end_date, status")
      .eq("status", "active")
      .order("start_date", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("enrollments")
      .select(
        "enrolled_at, student:students(user:users(full_name)), class:classes(grade_level, section)",
      )
      .eq("status", "enrolled")
      .order("enrolled_at", { ascending: false })
      .limit(5),
  ]);

  const counts = {
    students: studentCount ?? 0,
    teachers: teacherCount ?? 0,
    classes: classCount ?? 0,
    subjects: subjectCount ?? 0,
    enrollments: enrollmentCount ?? 0,
  };

  const stats = [
    {
      title: "Students",
      value: counts.students,
      href: "/students",
      icon: GraduationCap,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Teachers",
      value: counts.teachers,
      href: "/teachers",
      icon: UserCheck,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Classes",
      value: counts.classes,
      href: "/classes",
      icon: School,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Enrollments",
      value: counts.enrollments,
      href: "/enrollment",
      icon: Users,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-6 text-white sm:px-8 sm:py-7">
        <p className="text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">
          Admin Dashboard
        </p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
          {getGreeting()}, {displayName}
        </h1>
        <p className="mt-2 flex items-center gap-2 text-sm text-blue-100">
          <Calendar className="h-4 w-4 shrink-0" />
          {formatDate()}
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="group rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-200 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">{stat.title}</p>
                  <p className="mt-1.5 text-2xl font-bold text-gray-900 sm:text-3xl">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`rounded-xl p-2.5 ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_400px] 2xl:grid-cols-[minmax(0,1fr)_440px] xl:gap-10 lg:items-start">
        {/* Main column */}
        <div className="flex min-w-0 flex-col gap-6">
          {/* Quick actions */}
          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
              <h2 className="font-semibold text-gray-900">Quick Actions</h2>
              <p className="mt-0.5 text-sm text-gray-500">Frequently used admin tasks</p>
            </div>
            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 transition-all hover:border-gray-200"
                  >
                    <div className={`rounded-lg p-2.5 ${action.bg}`}>
                      <Icon className={`h-5 w-5 ${action.color}`} />
                    </div>
                    <span className="flex-1 text-sm font-semibold text-gray-900">{action.label}</span>
                    <ArrowRight className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-500" />
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Management */}
          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
              <h2 className="font-semibold text-gray-900">Manage</h2>
              <p className="mt-0.5 text-sm text-gray-500">Browse all admin sections</p>
            </div>
            <div className="grid grid-cols-1 gap-px bg-gray-100 sm:grid-cols-2 lg:grid-cols-3">
              {MANAGEMENT_LINKS.map((item) => {
                const Icon = item.icon;
                const count = item.countKey ? counts[item.countKey] : null;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center justify-between gap-3 bg-white px-5 py-4 transition-colors hover:bg-blue-50/40"
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <div className="rounded-lg bg-gray-100 p-2 transition-colors group-hover:bg-blue-100">
                        <Icon className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{item.label}</span>
                    </span>
                    {count !== null ? (
                      <Badge variant="secondary" className="shrink-0 bg-gray-100 text-gray-700">
                        {count.toLocaleString()}
                      </Badge>
                    ) : (
                      <ArrowRight className="h-4 w-4 shrink-0 text-gray-300 group-hover:text-blue-500" />
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="flex w-full min-w-0 flex-col gap-5 lg:sticky lg:top-7">
          {/* School year */}
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="rounded-lg bg-blue-50 p-2">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <h2 className="text-base font-bold text-gray-900">School Year</h2>
            </div>
            {activeSchoolYear ? (
              <div className="space-y-3">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{activeSchoolYear.name}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {formatShortDate(activeSchoolYear.start_date)} –{" "}
                    {formatShortDate(activeSchoolYear.end_date)}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                <Link
                  href={`/school-years/${activeSchoolYear.id}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Manage school year
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-center">
                <p className="text-sm font-medium text-gray-700">No active school year</p>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                  Set up a school year to start enrollment and classes.
                </p>
                <Button asChild size="sm" className="mt-4 bg-yellow-500 text-gray-900 hover:bg-yellow-400">
                  <Link href="/school-years/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create School Year
                  </Link>
                </Button>
              </div>
            )}
          </section>

          {/* At a glance */}
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-base font-bold text-gray-900">At a Glance</h2>
            <ul className="mt-4 divide-y divide-gray-100">
              <li className="flex items-center justify-between gap-4 py-3 text-sm first:pt-0">
                <span className="text-gray-600">Subjects offered</span>
                <span className="font-semibold text-gray-900">{counts.subjects}</span>
              </li>
              <li className="flex items-center justify-between gap-4 py-3 text-sm">
                <span className="text-gray-600">Enrollments</span>
                <span className="font-semibold text-gray-900">{counts.enrollments}</span>
              </li>
              <li className="flex items-center justify-between gap-4 py-3 text-sm last:pb-0">
                <span className="text-gray-600">Teacher–student ratio</span>
                <span className="font-semibold text-gray-900">
                  {counts.teachers > 0
                    ? `1:${Math.round(counts.students / counts.teachers)}`
                    : "—"}
                </span>
              </li>
            </ul>
            <Button asChild variant="outline" size="sm" className="mt-4 h-10 w-full">
              <Link href="/reports">
                <BarChart3 className="mr-2 h-4 w-4" />
                View full reports
              </Link>
            </Button>
          </section>

          {/* Recent enrollments */}
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-base font-bold text-gray-900">Recent Enrollments</h2>
              <Link
                href="/enrollment"
                className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                View all
              </Link>
            </div>
            {recentEnrollments && recentEnrollments.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {recentEnrollments.map((entry, index) => {
                  const student = entry.student as { user?: { full_name?: string } } | null;
                  const classInfo = entry.class as { grade_level?: string; section?: string } | null;
                  return (
                    <li
                      key={`${entry.enrolled_at}-${index}`}
                      className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                        {(student?.user?.full_name ?? "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {student?.user?.full_name ?? "Unknown student"}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          Grade {classInfo?.grade_level} – {classInfo?.section}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-gray-400">
                        {formatShortDate(entry.enrolled_at)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="rounded-lg bg-gray-50 px-4 py-8 text-center">
                <ClipboardList className="mx-auto h-8 w-8 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">No enrollments yet</p>
                <Button asChild size="sm" variant="link" className="mt-1 text-blue-600">
                  <Link href="/enrollment/new">Enroll a student</Link>
                </Button>
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
