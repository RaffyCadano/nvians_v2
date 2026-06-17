import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatsLineChart } from "@/components/admin/stats-line-chart";
import { buildStatusTrend } from "@/lib/trend-utils";
import { DeleteSchoolYearButton } from "./delete-school-year-button";
import {
  Archive,
  ArrowRight,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  Plus,
  Sparkles,
} from "lucide-react";

type SchoolYear = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: "active" | "upcoming" | "archived";
  created_at: string;
  terms: { count: number }[];
  classes: { count: number }[];
  enrollments: { count: number }[];
};

function formatShortDate(value: string) {
  return new Date(value).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getYearProgress(startDate: string, endDate: string) {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = Date.now();

  if (now <= start) return 0;
  if (now >= end) return 100;

  return Math.round(((now - start) / (end - start)) * 100);
}

function getDurationLabel(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months = Math.round(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );
  return months >= 12 ? `${Math.round(months / 12)} yr` : `${months} mo`;
}

const STATUS_CONFIG = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    badge: "bg-green-100 text-green-700 hover:bg-green-100",
    dot: "bg-green-500",
    accent: "border-green-200 bg-green-50/50",
    iconColor: "text-green-600",
    iconBg: "bg-green-100",
  },
  upcoming: {
    label: "Upcoming",
    icon: Clock,
    badge: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    dot: "bg-blue-500",
    accent: "border-blue-200 bg-blue-50/50",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
  },
  archived: {
    label: "Archived",
    icon: Archive,
    badge: "bg-gray-100 text-gray-600 hover:bg-gray-100",
    dot: "bg-gray-400",
    accent: "border-gray-200 bg-gray-50/80",
    iconColor: "text-gray-500",
    iconBg: "bg-gray-100",
  },
} as const;

export default async function SchoolYearsPage() {
  const supabase = createAdminClient();

  const { data: schoolYears, error } = await supabase
    .from("school_years")
    .select("*, terms(count), classes(count), enrollments(count)")
    .order("start_date", { ascending: false });

  const years = (error ? [] : (schoolYears ?? [])) as SchoolYear[];
  const activeYear = years.find((sy) => sy.status === "active");
  const upcomingCount = years.filter((sy) => sy.status === "upcoming").length;
  const archivedCount = years.filter((sy) => sy.status === "archived").length;

  const stats = [
    {
      label: "Total Years",
      value: years.length,
      stroke: "#2563eb",
      color: "text-blue-600",
      bg: "bg-blue-50",
      data: buildStatusTrend(years),
    },
    {
      label: "Active",
      value: activeYear ? 1 : 0,
      stroke: "#16a34a",
      color: "text-green-600",
      bg: "bg-green-50",
      data: buildStatusTrend(years, "active"),
    },
    {
      label: "Upcoming",
      value: upcomingCount,
      stroke: "#d97706",
      color: "text-amber-600",
      bg: "bg-amber-50",
      data: buildStatusTrend(years, "upcoming"),
    },
    {
      label: "Archived",
      value: archivedCount,
      stroke: "#6b7280",
      color: "text-gray-600",
      bg: "bg-gray-100",
      data: buildStatusTrend(years, "archived"),
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
      {/* Header */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-6 text-white sm:px-8 sm:py-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">
              Academic Calendar
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">School Years</h1>
            <p className="mt-2 max-w-xl text-sm text-blue-100">
              Manage academic years, track terms, and set which year is currently active for
              enrollment and classes.
            </p>
          </div>
          <Button
            asChild
            className="shrink-0 bg-yellow-400 font-semibold text-gray-900 hover:bg-yellow-300"
          >
            <Link href="/school-years/new">
              <Plus className="mr-2 h-4 w-4" />
              New School Year
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats */}
      <StatsLineChart series={trendSeries} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        {/* Main list */}
        <section className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
            <h2 className="font-semibold text-gray-900">All School Years</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              {years.length === 0
                ? "No school years configured yet"
                : `${years.length} school year${years.length === 1 ? "" : "s"} on record`}
            </p>
          </div>

          {years.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {years.map((sy) => {
                const config = STATUS_CONFIG[sy.status] ?? STATUS_CONFIG.upcoming;
                const StatusIcon = config.icon;
                const termCount = sy.terms?.[0]?.count ?? 0;
                const classCount = sy.classes?.[0]?.count ?? 0;
                const enrollmentCount = sy.enrollments?.[0]?.count ?? 0;
                const progress = getYearProgress(sy.start_date, sy.end_date);
                const isActive = sy.status === "active";

                return (
                  <div
                    key={sy.id}
                    className={`px-5 py-5 transition-colors hover:bg-gray-50/60 ${isActive ? "bg-blue-50/20" : ""}`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 flex-1 gap-4">
                        <div className={`rounded-xl p-3 ${config.iconBg} shrink-0`}>
                          <Calendar className={`h-5 w-5 ${config.iconColor}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900">{sy.name}</h3>
                            <Badge className={config.badge}>
                              <StatusIcon className="mr-1 h-3 w-3" />
                              {config.label}
                            </Badge>
                          </div>
                          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {formatShortDate(sy.start_date)} – {formatShortDate(sy.end_date)}
                            </span>
                            <span className="hidden text-gray-300 sm:inline">·</span>
                            <span>{getDurationLabel(sy.start_date, sy.end_date)}</span>
                            <span className="hidden text-gray-300 sm:inline">·</span>
                            <span>
                              {termCount} term{termCount === 1 ? "" : "s"}
                            </span>
                          </p>

                          {(isActive || sy.status === "upcoming") && (
                            <div className="mt-4 max-w-md">
                              <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
                                <span>Year progress</span>
                                <span className="font-medium text-gray-700">{progress}%</span>
                              </div>
                              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    isActive ? "bg-green-500" : "bg-blue-400"
                                  }`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/school-years/${sy.id}`}>Edit</Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm" className="text-blue-600">
                          <Link href={`/school-years/${sy.id}`}>
                            Manage
                            <ArrowRight className="ml-1 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        <DeleteSchoolYearButton
                          schoolYearId={sy.id}
                          schoolYearName={sy.name}
                          status={sy.status}
                          termCount={termCount}
                          classCount={classCount}
                          enrollmentCount={enrollmentCount}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                <Calendar className="h-8 w-8 text-blue-400" />
              </div>
              <p className="mt-5 text-lg font-semibold text-gray-900">No school years yet</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                Create your first academic year to start setting up classes, enrollment, and terms.
              </p>
              <Button asChild className="mt-6 bg-yellow-400 font-semibold text-gray-900 hover:bg-yellow-300">
                <Link href="/school-years/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create School Year
                </Link>
              </Button>
            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-7">
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="rounded-lg bg-blue-50 p-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Active Year</h2>
            </div>
            {activeYear ? (
              <div className={`rounded-xl border p-4 ${STATUS_CONFIG.active.accent}`}>
                <p className="text-lg font-semibold text-gray-900">{activeYear.name}</p>
                <p className="mt-1 text-sm text-gray-600">
                  {formatShortDate(activeYear.start_date)} –{" "}
                  {formatShortDate(activeYear.end_date)}
                </p>
                <div className="mt-3">
                  <Badge className={STATUS_CONFIG.active.badge}>Currently active</Badge>
                </div>
                <Link
                  href={`/school-years/${activeYear.id}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Edit active year
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-center">
                <p className="text-sm font-medium text-gray-700">No active school year</p>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
                  Mark a school year as active when enrollment opens.
                </p>
                <Button asChild size="sm" className="mt-4 bg-yellow-500 text-gray-900 hover:bg-yellow-400">
                  <Link href="/school-years/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Set Up Year
                  </Link>
                </Button>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-base font-bold text-gray-900">Quick Guide</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  1
                </span>
                <span>Create a school year with start and end dates.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  2
                </span>
                <span>Mark one year as active for current operations.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  3
                </span>
                <span>Add terms and link classes to the active year.</span>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
