"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { updateSchoolYear } from "../actions";
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  ClipboardList,
  Layers,
  School,
} from "lucide-react";

type SchoolYearStatus = "active" | "upcoming" | "archived";

const STATUS_CONFIG = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    badge: "bg-green-100 text-green-700 hover:bg-green-100",
    accent: "border-green-200 bg-green-50/50",
    iconColor: "text-green-600",
    iconBg: "bg-green-100",
    header: "from-blue-900 to-blue-700",
  },
  upcoming: {
    label: "Upcoming",
    icon: Clock,
    badge: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    accent: "border-blue-200 bg-blue-50/50",
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
    header: "from-blue-900 to-indigo-800",
  },
  archived: {
    label: "Archived",
    icon: Archive,
    badge: "bg-gray-100 text-gray-600 hover:bg-gray-100",
    accent: "border-gray-200 bg-gray-50/80",
    iconColor: "text-gray-500",
    iconBg: "bg-gray-100",
    header: "from-slate-800 to-slate-700",
  },
} as const;

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
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30),
  );
  return months >= 12 ? `${Math.round(months / 12)} yr` : `${months} mo`;
}

export default function SchoolYearDetailForm({
  schoolYear,
  stats,
}: {
  schoolYear: {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    status: SchoolYearStatus;
    created_at: string;
  };
  stats: {
    terms: number;
    classes: number;
    enrollments: number;
  };
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isActive, setIsActive] = useState(schoolYear.status === "active");

  const status = schoolYear.status;
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.upcoming;
  const StatusIcon = config.icon;
  const progress = useMemo(
    () => getYearProgress(schoolYear.start_date, schoolYear.end_date),
    [schoolYear.start_date, schoolYear.end_date],
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await updateSchoolYear(schoolYear.id, formData);
    if (result?.error) {
      setError(result.error);
      setSaving(false);
    } else {
      router.push("/school-years");
    }
  }

  const statCards = [
    {
      label: "Terms",
      value: stats.terms,
      icon: Layers,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Classes",
      value: stats.classes,
      icon: School,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Enrollments",
      value: stats.enrollments,
      icon: ClipboardList,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Progress",
      value: `${progress}%`,
      icon: Calendar,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section
        className={`overflow-hidden rounded-2xl bg-gradient-to-r ${config.header} px-6 py-6 text-white sm:px-8 sm:py-7`}
      >
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-2 mb-4 text-blue-200 hover:bg-white/10 hover:text-white"
        >
          <Link href="/school-years">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to School Years
          </Link>
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">
              Academic Year
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold sm:text-3xl">{schoolYear.name}</h1>
              <Badge className={`${config.badge} border-0`}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {config.label}
              </Badge>
            </div>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-blue-100">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 shrink-0" />
                {formatShortDate(schoolYear.start_date)} — {formatShortDate(schoolYear.end_date)}
              </span>
              <span className="hidden text-blue-300 sm:inline">·</span>
              <span>{getDurationLabel(schoolYear.start_date, schoolYear.end_date)}</span>
            </p>
          </div>
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${config.iconBg}`}>
            <Calendar className={`h-6 w-6 ${config.iconColor}`} />
          </div>
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
                    {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <section className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
            <h2 className="font-semibold text-gray-900">Edit School Year</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Update dates, name, or active status for this academic year.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <Label htmlFor="name">School Year Name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  defaultValue={schoolYear.name}
                  placeholder="2024-2025"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    required
                    defaultValue={schoolYear.start_date}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    required
                    defaultValue={schoolYear.end_date}
                  />
                </div>
              </div>

              <div className={`rounded-xl border p-4 ${config.accent}`}>
                <label htmlFor="is_active" className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    value="true"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Set as active school year</p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-600">
                      Only one year should be active at a time. Active years are used for enrollment
                      and class operations.
                    </p>
                  </div>
                </label>
              </div>

              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row">
                <Button type="submit" disabled={saving} className="sm:min-w-[140px]">
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/school-years")}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </section>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-7">
          <section className={`rounded-xl border p-5 ${config.accent}`}>
            <h2 className="text-base font-bold text-gray-900">Year Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Status</span>
                <Badge className={config.badge}>{config.label}</Badge>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium text-gray-900">
                  {getDurationLabel(schoolYear.start_date, schoolYear.end_date)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Created</span>
                <span className="font-medium text-gray-900">
                  {formatShortDate(schoolYear.created_at)}
                </span>
              </div>
            </div>

            {(status === "active" || status === "upcoming") && (
              <div className="mt-5 border-t border-gray-200/80 pt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
                  <span>Year progress</span>
                  <span className="font-medium text-gray-700">{progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/80">
                  <div
                    className={`h-full rounded-full transition-all ${
                      status === "active" ? "bg-green-500" : "bg-blue-400"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-base font-bold text-gray-900">Related</h2>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/classes"
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <span className="inline-flex items-center gap-2">
                    <School className="h-4 w-4 text-purple-600" />
                    Classes ({stats.classes})
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                </Link>
              </li>
              <li>
                <Link
                  href="/enrollment"
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <span className="inline-flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-indigo-600" />
                    Enrollments ({stats.enrollments})
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                </Link>
              </li>
              <li>
                <Link
                  href="/subjects"
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <span className="inline-flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    Subjects
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                </Link>
              </li>
            </ul>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-base font-bold text-gray-900">Quick Guide</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  1
                </span>
                <span>Keep start and end dates aligned with the actual academic calendar.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  2
                </span>
                <span>Mark the current year as active when enrollment opens.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  3
                </span>
                <span>Link classes and terms to this year before enrolling students.</span>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
