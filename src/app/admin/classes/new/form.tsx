"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ALLOWED_GRADE_LEVELS } from "@/lib/constants/grade-levels";
import { createClass } from "../actions";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Layers,
  Plus,
  School,
  Sparkles,
  UserCheck,
} from "lucide-react";

const GRADE_LEVELS = [...ALLOWED_GRADE_LEVELS];

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

export default function NewClassForm({
  schoolYears,
  teachers,
  activeSchoolYearId,
  stats,
  recentClasses,
}: {
  schoolYears: { id: string; name: string; status: string }[];
  teachers: { id: string; fullName: string }[];
  activeSchoolYearId: string | null;
  stats: { total: number; active: number; teachers: number };
  recentClasses: {
    id: string;
    gradeLevel: string;
    section: string;
    schoolYearName: string;
    studentCount: number;
  }[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [schoolYearId, setSchoolYearId] = useState(activeSchoolYearId ?? "");
  const [gradeLevel, setGradeLevel] = useState("");
  const [section, setSection] = useState("");
  const [advisorId, setAdvisorId] = useState("");

  const previewReady = Boolean(schoolYearId && gradeLevel && section.trim());
  const gradeColor = useMemo(() => getGradeColor(gradeLevel || "Grade 7"), [gradeLevel]);
  const selectedSchoolYear = schoolYears.find((sy) => sy.id === schoolYearId)?.name;
  const selectedAdvisor = teachers.find((t) => t.id === advisorId)?.fullName;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await createClass(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    router.push("/classes");
    router.refresh();
  }

  const statCards = [
    {
      label: "Total Classes",
      value: stats.total,
      icon: School,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Active",
      value: stats.active,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Teachers",
      value: stats.teachers,
      icon: UserCheck,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-800 px-6 py-6 text-white sm:px-8 sm:py-7">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-2 mb-4 text-purple-200 hover:bg-white/10 hover:text-white"
        >
          <Link href="/classes">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Classes
          </Link>
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">
              Class Management
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">New Class</h1>
            <p className="mt-2 max-w-xl text-sm text-purple-100">
              Create a grade section for a school year. After creating, assign subjects, enroll
              students, and set a class advisor.
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
                <div className={cn("rounded-xl p-2.5", stat.bg)}>
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
            <h2 className="font-semibold text-gray-900">Class Details</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              School year, grade level, and section are required. Each section must be unique per
              school year.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                  1
                </span>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Label htmlFor="school_year_id">School Year</Label>
                  <select
                    id="school_year_id"
                    name="school_year_id"
                    required
                    value={schoolYearId}
                    onChange={(e) => setSchoolYearId(e.target.value)}
                    className={SELECT_CLASS}
                  >
                    <option value="">Select school year...</option>
                    {schoolYears.map((sy) => (
                      <option key={sy.id} value={sy.id}>
                        {sy.name}
                        {sy.status === "active" ? " (Active)" : ""}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500">
                    Classes are scoped to a single school year.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                  2
                </span>
                <div className="min-w-0 flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="grade_level">Grade Level</Label>
                    <select
                      id="grade_level"
                      name="grade_level"
                      required
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className={SELECT_CLASS}
                    >
                      <option value="">Select...</option>
                      {GRADE_LEVELS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="section">Section</Label>
                    <Input
                      id="section"
                      name="section"
                      placeholder="Rizal"
                      required
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                  3
                </span>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Label htmlFor="advisor_id">Class Advisor</Label>
                  <select
                    id="advisor_id"
                    name="advisor_id"
                    value={advisorId}
                    onChange={(e) => setAdvisorId(e.target.value)}
                    className={SELECT_CLASS}
                  >
                    <option value="">No advisor</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500">
                    Optional — you can assign an advisor later from the class edit page.
                  </p>
                </div>
              </div>

              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-700 hover:bg-purple-800 sm:min-w-[160px]"
                >
                  {loading ? "Creating..." : "Create Class"}
                </Button>
                <Button asChild variant="outline">
                  <Link href="/classes">Cancel</Link>
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
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
                        gradeColor.bg,
                        gradeColor.text
                      )}
                    >
                      {getGradeNumber(gradeLevel)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900">
                        {gradeLevel} — {section.trim()}
                      </p>
                      <Badge className="mt-1.5 bg-green-100 text-green-700 hover:bg-green-100">
                        Active
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">School year</span>
                      <span className="font-medium text-gray-900">{selectedSchoolYear}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">Advisor</span>
                      <span className="font-medium text-gray-900">
                        {selectedAdvisor ?? "None"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">Students</span>
                      <span className="font-medium text-gray-900">0 (enroll later)</span>
                    </div>
                  </div>

                  <p className="flex items-center gap-1.5 text-xs text-green-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Ready to create
                  </p>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <School className="mx-auto h-9 w-9 text-gray-300" />
                  <p className="mt-3 text-sm font-medium text-gray-600">No preview yet</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Select a school year, grade level, and section to preview.
                  </p>
                </div>
              )}
            </div>
          </section>

          {recentClasses.length > 0 && (
            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
                <h2 className="font-semibold text-gray-900">Recent Classes</h2>
                <p className="mt-0.5 text-sm text-gray-500">Latest class sections</p>
              </div>
              <ul className="divide-y divide-gray-100 p-2">
                {recentClasses.map((cls) => (
                  <li key={cls.id}>
                    <Link
                      href={`/classes/${cls.id}`}
                      className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {cls.gradeLevel} — {cls.section}
                        </p>
                        <p className="truncate text-xs text-gray-500">{cls.schoolYearName}</p>
                      </div>
                      <Badge variant="secondary" className="ml-2 shrink-0 bg-white text-gray-700">
                        {cls.studentCount}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
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
                <span>Create the class with grade level, section, and school year.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                  2
                </span>
                <span>Assign subjects and schedules from the class Subjects page.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                  3
                </span>
                <span>Enroll students from the Enrollment page.</span>
              </li>
            </ul>
            <Link
              href="/enrollment"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700"
            >
              Go to enrollment
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </section>

          <section className="rounded-xl border border-dashed border-purple-200 bg-purple-50/40 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-white p-2 ring-1 ring-purple-100">
                <Layers className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">After creating</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-600">
                  New classes start as active. Add subject offerings and enroll students before the
                  term begins.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
