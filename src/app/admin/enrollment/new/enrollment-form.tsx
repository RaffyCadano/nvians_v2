"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { enrollStudent } from "../actions";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  School,
  UserPlus,
  Users,
} from "lucide-react";

const SELECT_CLASS =
  "flex h-10 w-full rounded-lg border border-input bg-white px-3 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

function getInitials(name: string | undefined) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function EnrollmentForm({
  students,
  classes,
  schoolYears,
  stats,
}: {
  students: any[];
  classes: any[];
  schoolYears: any[];
  stats: { students: number; classes: number; schoolYears: number };
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [autoSchoolYear, setAutoSchoolYear] = useState("");

  const student = useMemo(
    () => students.find((s) => s.id === selectedStudent),
    [students, selectedStudent],
  );
  const cls = useMemo(
    () => classes.find((c) => c.id === selectedClass),
    [classes, selectedClass],
  );
  const schoolYear = useMemo(
    () => schoolYears.find((sy) => sy.id === autoSchoolYear),
    [schoolYears, autoSchoolYear],
  );

  const previewReady = Boolean(selectedStudent && selectedClass && autoSchoolYear);

  function handleClassChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const classId = e.target.value;
    setSelectedClass(classId);
    const match = classes.find((c: any) => c.id === classId);
    if (match?.school_year?.id) setAutoSchoolYear(match.school_year.id);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await enrollStudent(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    router.push("/enrollment");
  }

  const statCards = [
    {
      label: "Active Students",
      value: stats.students,
      icon: GraduationCap,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Active Classes",
      value: stats.classes,
      icon: School,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "School Years",
      value: stats.schoolYears,
      icon: Calendar,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 to-violet-800 px-6 py-6 text-white sm:px-8 sm:py-7">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-2 mb-4 text-indigo-200 hover:bg-white/10 hover:text-white"
        >
          <Link href="/enrollment">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Enrollment
          </Link>
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">
              New Record
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Enroll Student</h1>
            <p className="mt-2 max-w-xl text-sm text-indigo-100">
              Assign an active student to a class for the selected school year. The school year
              auto-fills when you pick a class.
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <UserPlus className="h-6 w-6 text-yellow-400" />
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
            <h2 className="font-semibold text-gray-900">Enrollment Details</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              All fields are required to complete enrollment.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            {students.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">
                <Users className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-4 font-medium text-gray-700">No active students found</p>
                <p className="mt-1 text-sm text-gray-500">
                  Add a student before creating an enrollment.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/students/new">Add Student</Link>
                </Button>
              </div>
            ) : classes.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">
                <School className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-4 font-medium text-gray-700">No active classes found</p>
                <p className="mt-1 text-sm text-gray-500">
                  Create a class before enrolling students.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/classes/new">Create Class</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                      1
                    </span>
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <Label htmlFor="student_id">Student</Label>
                      <select
                        id="student_id"
                        name="student_id"
                        required
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        className={SELECT_CLASS}
                      >
                        <option value="">Select student...</option>
                        {students.map((s: any) => (
                          <option key={s.id} value={s.id}>
                            {s.user?.full_name}
                            {s.student_number ? ` (${s.student_number})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                      2
                    </span>
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <Label htmlFor="class_id">Class</Label>
                      <select
                        id="class_id"
                        name="class_id"
                        required
                        value={selectedClass}
                        onChange={handleClassChange}
                        className={SELECT_CLASS}
                      >
                        <option value="">Select class...</option>
                        {classes.map((c: any) => (
                          <option key={c.id} value={c.id}>
                            {c.grade_level} — {c.section}
                            {c.school_year?.name ? ` (${c.school_year.name})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                      3
                    </span>
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <Label htmlFor="school_year_id">School Year</Label>
                      <select
                        id="school_year_id"
                        name="school_year_id"
                        required
                        value={autoSchoolYear}
                        onChange={(e) => setAutoSchoolYear(e.target.value)}
                        className={SELECT_CLASS}
                      >
                        <option value="">Select school year...</option>
                        {schoolYears.map((sy: any) => (
                          <option key={sy.id} value={sy.id}>
                            {sy.name}
                          </option>
                        ))}
                      </select>
                      {selectedClass && cls?.school_year?.name && (
                        <p className="text-xs text-gray-500">
                          Auto-filled from selected class ({cls.school_year.name}). You can change
                          it if needed.
                        </p>
                      )}
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
                    {loading ? "Enrolling..." : "Enroll Student"}
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/enrollment">Cancel</Link>
                  </Button>
                </div>
              </form>
            )}
          </div>
        </section>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-7">
          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
              <h2 className="font-semibold text-gray-900">Preview</h2>
              <p className="mt-0.5 text-sm text-gray-500">Review before submitting</p>
            </div>
            <div className="p-5">
              {previewReady ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                      {getInitials(student?.user?.full_name)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">{student?.user?.full_name}</p>
                      <p className="text-xs text-gray-500">
                        {student?.student_number ? `#${student.student_number}` : "No student number"}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">Class</span>
                      <span className="font-medium text-gray-900">
                        {cls?.grade_level} — {cls?.section}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">School year</span>
                      <span className="font-medium text-gray-900">{schoolYear?.name}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">Status</span>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Enrolled</Badge>
                    </div>
                  </div>
                  <p className="flex items-center gap-1.5 text-xs text-green-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Ready to enroll
                  </p>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <ClipboardList className="mx-auto h-9 w-9 text-gray-300" />
                  <p className="mt-3 text-sm font-medium text-gray-600">No preview yet</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Select a student, class, and school year to see a summary.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-base font-bold text-gray-900">Quick Guide</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                  1
                </span>
                <span>Choose an active student from the registry.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                  2
                </span>
                <span>Pick the class section — school year fills automatically.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                  3
                </span>
                <span>Confirm the preview, then submit to enroll.</span>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
