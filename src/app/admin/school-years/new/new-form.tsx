"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { createSchoolYear } from "../actions";
import {
  ArrowLeft,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  Layers,
  Plus,
  Sparkles,
} from "lucide-react";

function formatShortDate(value: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDurationLabel(startDate: string, endDate: string) {
  if (!startDate || !endDate) return "—";
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return "—";
  }
  const months = Math.round(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30),
  );
  return months >= 12 ? `${Math.round(months / 12)} yr` : `${months} mo`;
}

export default function NewSchoolYearForm({
  stats,
}: {
  stats: {
    total: number;
    hasActive: boolean;
    upcoming: number;
  };
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(false);

  const previewReady = Boolean(name && startDate && endDate);
  const duration = useMemo(
    () => getDurationLabel(startDate, endDate),
    [startDate, endDate],
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await createSchoolYear(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  const statCards = [
    {
      label: "Total Years",
      value: stats.total,
      icon: Layers,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active Year",
      value: stats.hasActive ? 1 : 0,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Upcoming",
      value: stats.upcoming,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-6 text-white sm:px-8 sm:py-7">
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
              Academic Calendar
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">New School Year</h1>
            <p className="mt-2 max-w-xl text-sm text-blue-100">
              Create a new academic year with start and end dates. Optionally mark it as the active
              year for enrollment and classes.
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <Plus className="h-6 w-6 text-yellow-400" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3 sm:gap-4">
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
            <h2 className="font-semibold text-gray-900">School Year Details</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              All fields marked with dates are required.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  1
                </span>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Label htmlFor="name">School Year Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="2024-2025"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Use the standard format, e.g. 2024-2025 or SY 2024-2025.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  2
                </span>
                <div className="min-w-0 flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="date"
                      required
                      min={startDate || undefined}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  3
                </span>
                <div className="min-w-0 flex-1">
                  <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
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
                        <p className="text-sm font-semibold text-gray-900">
                          Set as active school year
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-gray-600">
                          {stats.hasActive
                            ? "Another year is currently active. Saving will replace it as the active year."
                            : "No active year yet — check this to use this year for enrollment and classes."}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row">
                <Button type="submit" disabled={loading} className="sm:min-w-[160px]">
                  {loading ? "Creating..." : "Create School Year"}
                </Button>
                <Button asChild variant="outline">
                  <Link href="/school-years">Cancel</Link>
                </Button>
              </div>
            </form>
          </div>
        </section>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-7">
          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
              <h2 className="font-semibold text-gray-900">Preview</h2>
              <p className="mt-0.5 text-sm text-gray-500">Review before creating</p>
            </div>
            <div className="p-5">
              {previewReady ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">{name}</p>
                      <p className="text-xs text-gray-500">{duration} duration</p>
                    </div>
                  </div>
                  <div className="space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">Start</span>
                      <span className="font-medium text-gray-900">{formatShortDate(startDate)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">End</span>
                      <span className="font-medium text-gray-900">{formatShortDate(endDate)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">Status</span>
                      {isActive ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                          Upcoming
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="flex items-center gap-1.5 text-xs text-green-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Ready to create
                  </p>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <CalendarDays className="mx-auto h-9 w-9 text-gray-300" />
                  <p className="mt-3 text-sm font-medium text-gray-600">No preview yet</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter a name and date range to see a summary.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="rounded-lg bg-blue-50 p-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Quick Guide</h2>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  1
                </span>
                <span>Name the year to match your academic calendar.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  2
                </span>
                <span>Set start and end dates for the full school year.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  3
                </span>
                <span>Mark as active when enrollment and classes should begin.</span>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
