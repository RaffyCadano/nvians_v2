"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { enrollStudent } from "../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EnrollmentForm({
  students,
  classes,
  schoolYears,
}: {
  students: any[];
  classes: any[];
  schoolYears: any[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [autoSchoolYear, setAutoSchoolYear] = useState("");

  function handleClassChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const classId = e.target.value;
    setSelectedClass(classId);
    const cls = classes.find((c: any) => c.id === classId);
    if (cls?.school_year?.id) setAutoSchoolYear(cls.school_year.id);
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

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/enrollment"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enroll Student</h1>
          <p className="text-sm text-gray-500">Assign a student to a class for a school year.</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Enrollment Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="student_id">Student *</Label>
              <select
                id="student_id"
                name="student_id"
                required
                className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
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

            <div className="space-y-1.5">
              <Label htmlFor="class_id">Class *</Label>
              <select
                id="class_id"
                name="class_id"
                required
                value={selectedClass}
                onChange={handleClassChange}
                className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
              >
                <option value="">Select class...</option>
                {classes.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.grade_level} - {c.section}
                    {c.school_year?.name ? ` (${c.school_year.name})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="school_year_id">School Year *</Label>
              <select
                id="school_year_id"
                name="school_year_id"
                required
                value={autoSchoolYear}
                onChange={(e) => setAutoSchoolYear(e.target.value)}
                className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
              >
                <option value="">Select school year...</option>
                {schoolYears.map((sy: any) => (
                  <option key={sy.id} value={sy.id}>{sy.name}</option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Enrolling..." : "Enroll Student"}
              </Button>
              <Button asChild variant="outline">
                <Link href="/enrollment">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
