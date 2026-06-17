import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Archive,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Hash,
  Layers,
  Plus,
  School,
} from "lucide-react";

type SubjectRow = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  status: "active" | "archived";
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

function getCodeColor(code: string) {
  const hash = code.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const palette = [
    { bg: "bg-teal-100", text: "text-teal-700" },
    { bg: "bg-emerald-100", text: "text-emerald-700" },
    { bg: "bg-cyan-100", text: "text-cyan-700" },
    { bg: "bg-sky-100", text: "text-sky-700" },
    { bg: "bg-blue-100", text: "text-blue-700" },
  ];
  return palette[hash % palette.length];
}

export default async function SubjectsPage() {
  const supabase = await createClient();

  const { data: subjects } = await supabase
    .from("subjects")
    .select("*, class_subjects(count)")
    .order("name");

  const rows = (subjects ?? []) as SubjectRow[];
  const activeCount = rows.filter((s) => s.status === "active").length;
  const archivedCount = rows.filter((s) => s.status === "archived").length;
  const assignedCount = rows.filter((s) => (s.class_subjects?.[0]?.count ?? 0) > 0).length;
  const totalClassLinks = rows.reduce(
    (sum, s) => sum + (s.class_subjects?.[0]?.count ?? 0),
    0
  );

  const stats = [
    {
      label: "Total Subjects",
      value: rows.length,
      icon: BookOpen,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      label: "Active",
      value: activeCount,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "In Classes",
      value: assignedCount,
      icon: School,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Class Assignments",
      value: totalClassLinks,
      icon: Layers,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  const topAssigned = [...rows]
    .sort(
      (a, b) =>
        (b.class_subjects?.[0]?.count ?? 0) - (a.class_subjects?.[0]?.count ?? 0)
    )
    .filter((s) => (s.class_subjects?.[0]?.count ?? 0) > 0)
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-teal-900 to-emerald-800 px-6 py-6 text-white sm:px-8 sm:py-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">
              Curriculum
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Subjects</h1>
            <p className="mt-2 max-w-xl text-sm text-teal-100">
              Manage subject catalog, codes, and descriptions. Assign subjects to class sections
              from each class&apos;s Subjects page.
            </p>
          </div>
          <Button
            asChild
            className="shrink-0 bg-yellow-400 font-semibold text-gray-900 hover:bg-yellow-300"
          >
            <Link href="/subjects/new">
              <Plus className="mr-2 h-4 w-4" />
              New Subject
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        {/* Main list */}
        <section className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
            <h2 className="font-semibold text-gray-900">Subject Catalog</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              {rows.length === 0
                ? "No subjects in the catalog yet"
                : `${rows.length} subject${rows.length === 1 ? "" : "s"} available school-wide`}
            </p>
          </div>

          {rows.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {rows.map((subject) => {
                const config = STATUS_CONFIG[subject.status] ?? STATUS_CONFIG.active;
                const codeColor = getCodeColor(subject.code);
                const classCount = subject.class_subjects?.[0]?.count ?? 0;

                return (
                  <div
                    key={subject.id}
                    className="px-5 py-5 transition-colors hover:bg-gray-50/60"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 flex-1 gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl ${codeColor.bg}`}
                        >
                          <BookOpen className={`h-4 w-4 ${codeColor.text}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                            <Badge className={config.badge}>{config.label}</Badge>
                          </div>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-xs font-semibold ${codeColor.bg} ${codeColor.text}`}
                            >
                              <Hash className="h-3 w-3" />
                              {subject.code}
                            </span>
                            <span className="text-sm text-gray-500">
                              {classCount} class{classCount === 1 ? "" : "es"}
                            </span>
                          </div>
                          <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                            {subject.description ?? (
                              <span className="italic text-gray-400">No description provided</span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end lg:flex-row">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/subjects/${subject.id}`}>Edit</Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm" className="text-teal-600">
                          <Link href={`/subjects/${subject.id}`}>
                            Manage
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
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50">
                <BookOpen className="h-8 w-8 text-teal-400" />
              </div>
              <p className="mt-5 text-lg font-semibold text-gray-900">No subjects yet</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                Build your subject catalog with names and codes, then assign them to class sections.
              </p>
              <Button
                asChild
                className="mt-6 bg-yellow-400 font-semibold text-gray-900 hover:bg-yellow-300"
              >
                <Link href="/subjects/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Subject
                </Link>
              </Button>
            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-7">
          {archivedCount > 0 && (
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">Catalog Status</h2>
                <Archive className="h-4 w-4 text-gray-400" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-green-100 bg-green-50/50 px-3 py-3 text-center">
                  <p className="text-2xl font-bold text-green-700">{activeCount}</p>
                  <p className="text-xs text-green-600">Active</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-center">
                  <p className="text-2xl font-bold text-gray-600">{archivedCount}</p>
                  <p className="text-xs text-gray-500">Archived</p>
                </div>
              </div>
            </section>
          )}

          {topAssigned.length > 0 && (
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-gray-900">Most Assigned</h2>
              <p className="mt-0.5 text-sm text-gray-500">Subjects linked to the most classes</p>
              <ul className="mt-4 space-y-2">
                {topAssigned.map((subject) => (
                  <li key={subject.id}>
                    <Link
                      href={`/subjects/${subject.id}`}
                      className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2.5 transition-colors hover:border-teal-200 hover:bg-teal-50/40"
                    >
                      <span className="min-w-0 truncate text-sm font-medium text-gray-800">
                        {subject.name}
                      </span>
                      <Badge variant="secondary" className="ml-2 shrink-0 bg-white text-gray-700">
                        {subject.class_subjects?.[0]?.count ?? 0}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900">Quick Guide</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                  1
                </span>
                <span>Add subjects with a unique code and description.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                  2
                </span>
                <span>Go to a class and open Subjects to link offerings.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                  3
                </span>
                <span>Archive subjects that are no longer offered.</span>
              </li>
            </ul>
            <Link
              href="/classes"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              View classes
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
