"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ALLOWED_GRADE_LEVELS } from "@/lib/constants/grade-levels";
import { updateClass } from "../actions";

const GRADE_LEVELS = [...ALLOWED_GRADE_LEVELS];

export default function ClassEditForm({
  classData,
  schoolYears,
  teachers,
}: {
  classData: any;
  schoolYears: any[];
  teachers: any[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

    router.push("/admin/classes");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/classes" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Class</h1>
          <p className="text-sm text-gray-500">Update class section details.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="school_year_id">School Year *</Label>
              <select
                id="school_year_id"
                name="school_year_id"
                required
                defaultValue={classData.school_year_id}
                className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
              >
                <option value="">Select school year...</option>
                {schoolYears.map((sy) => (
                  <option key={sy.id} value={sy.id}>
                    {sy.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="grade_level">Grade Level *</Label>
                <select
                  id="grade_level"
                  name="grade_level"
                  required
                  defaultValue={classData.grade_level}
                  className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
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
                <Label htmlFor="section">Section *</Label>
                <Input
                  id="section"
                  name="section"
                  required
                  defaultValue={classData.section}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="advisor_id">Class Advisor</Label>
              <select
                id="advisor_id"
                name="advisor_id"
                defaultValue={classData.advisor_id ?? ""}
                className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
              >
                <option value="">No advisor</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.user?.full_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue={classData.status ?? "active"}
                className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/classes")}> 
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
