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
import { updateClass } from "../actions";
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  School,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";

const GRADE_LEVELS = [...ALLOWED_GRADE_LEVELS];

const STATUS_CONFIG = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    badge: "bg-green-100 text-green-700 hover:bg-green-100",
    accent: "border-purple-200 bg-purple-50/50",
    header: "from-purple-900 to-indigo-800",
  },
  archived: {
    label: "Archived",
    icon: Archive,
    badge: "bg-gray-100 text-gray-600 hover:bg-gray-100",
    accent: "border-gray-200 bg-gray-50/80",
    header: "from-slate-800 to-slate-700",
  },
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

type ClassStatus = keyof typeof STATUS_CONFIG;

export default function ClassEditForm({
  classData,
  schoolYears,
  teachers,
  stats,
}: {
  classData: {
    id: string;
    grade_level: string;
    section: string;
    school_year_id: string;
    advisor_id: string | null;
    status: ClassStatus;
    schoolYearName: string;
    advisorName: string | null;
  };
  schoolYears: { id: string; name: string }[];
  teachers: { id: string; fullName: string }[];
  stats: { enrollments: number; subjects: number };
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [schoolYearId, setSchoolYearId] = useState(classData.school_year_id);
  const [gradeLevel, setGradeLevel] = useState(classData.grade_level);
  const [section, setSection] = useState(classData.section);
  const [advisorId, setAdvisorId] = useState(classData.advisor_id ?? "");
  const [status, setStatus] = useState<ClassStatus>(classData.status);

  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.active;
  const StatusIcon = config.icon;
  const gradeColor = useMemo(() => getGradeColor(gradeLevel), [gradeLevel]);
  const selectedSchoolYear = schoolYears.find((sy) => sy.id === schoolYearId)?.name ?? classData.schoolYearName;
  const selectedAdvisor = teachers.find((t) => t.id === advisorId)?.fullName ?? classData.advisorName;

  const hasChanges = useMemo(
    () =>
      schoolYearId !== classData.school_year_id ||
      gradeLevel !== classData.grade_level ||
      section.trim() !== classData.section ||
      (advisorId || null) !== (classData.advisor_id || null) ||
      status !== classData.status,
    [schoolYearId, gradeLevel, section, advisorId, status, classData]
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await updateClass(classData.id, formData);

    if (result?.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    router.push("/classes");
    router.refresh();
  }

  const statCards = [
    {
      label: "Enrolled",
      value: stats.enrollments,
      icon: Users,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Subjects",
      value: stats.subjects,
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Advisor",
      value: classData.advisorName ? "Assigned" : "None",
      icon: UserCheck,
      color: "text-green-600",
      bg: "bg-green-50",
      isText: true,
    },
    {
      label: "Status",
      value: config.label,
      icon: StatusIcon,
      color: status === "active" ? "text-green-600" : "text-gray-500",
      bg: status === "active" ? "bg-green-50" : "bg-gray-50",
      isText: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section
        className={cn(
          "overflow-hidden rounded-2xl bg-gradient-to-r px-6 py-6 text-white sm:px-8 sm:py-7",
          config.header
        )}
      >
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
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-bold",
                gradeColor.bg,
                gradeColor.text
              )}
            >
              {getGradeNumber(gradeLevel)}
            </div>
            <div>
              <p className="text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">
                Class Section
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold sm:text-3xl">
                  {gradeLevel} — {section}
                </h1>
                <Badge className={cn(config.badge, "border-0")}>
                  <StatusIcon className="mr-1 h-3 w-3" />
                  {config.label}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-purple-100">
                {selectedSchoolYear}
                {selectedAdvisor ? ` · Advisor: ${selectedAdvisor}` : " · No advisor assigned"}
              </p>
            </div>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <School className="h-6 w-6 text-yellow-400" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">{stat.label}</p>
                  <p
                    className={cn(
                      "mt-1.5 font-bold text-gray-900",
                      stat.isText ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl"
                    )}
                  >
                    {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                  </p>
                </div>
                <div className={cn("shrink-0 rounded-xl p-2.5", stat.bg)}>
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
            <h2 className="font-semibold text-gray-900">Edit Class</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Update school year, grade level, section, advisor, or status.
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
                      </option>
                    ))}
                  </select>
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
                      required
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      placeholder="Rizal"
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
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                  4
                </span>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ClassStatus)}
                    className={SELECT_CLASS}
                  >
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                  {status === "archived" && stats.enrollments > 0 && (
                    <p className="text-xs text-amber-700">
                      This class still has {stats.enrollments} enrolled student
                      {stats.enrollments === 1 ? "" : "s"}.
                    </p>
                  )}
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
                  disabled={saving || !hasChanges}
                  className="bg-purple-700 hover:bg-purple-800 sm:min-w-[140px]"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/classes")}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </section>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-7">
          <section className={cn("rounded-xl border p-5", config.accent)}>
            <h2 className="text-base font-bold text-gray-900">Class Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Section</span>
                <span className="font-medium text-gray-900">
                  {gradeLevel} — {section}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">School year</span>
                <span className="font-medium text-gray-900">{selectedSchoolYear}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Advisor</span>
                <span className="text-right font-medium text-gray-900">
                  {selectedAdvisor ?? "—"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Enrolled</span>
                <span className="font-medium text-gray-900">{stats.enrollments}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Subjects</span>
                <span className="font-medium text-gray-900">{stats.subjects}</span>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
              <h2 className="font-semibold text-gray-900">Quick Actions</h2>
              <p className="mt-0.5 text-sm text-gray-500">Manage this class section</p>
            </div>
            <div className="space-y-2 p-3">
              <Link
                href={`/classes/${classData.id}/subjects`}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-3 transition-colors hover:border-purple-200 hover:bg-purple-50/40"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Subjects</p>
                    <p className="text-xs text-gray-500">{stats.subjects} linked</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
              <Link
                href="/enrollment"
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-3 transition-colors hover:border-purple-200 hover:bg-purple-50/40"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                    <ClipboardList className="h-4 w-4 text-amber-600" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Enrollment</p>
                    <p className="text-xs text-gray-500">{stats.enrollments} students</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </Link>
            </div>
          </section>

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
                <span>Assign a class advisor who oversees the section.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                  2
                </span>
                <span>Link subjects and teachers from the Subjects page.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                  3
                </span>
                <span>Archive classes that are no longer in use.</span>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
