"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ALLOWED_GRADE_LEVELS } from "@/lib/constants/grade-levels";
import { createClass } from "../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const GRADE_LEVELS = [...ALLOWED_GRADE_LEVELS];

export default function NewClassForm({
  schoolYears,
  teachers,
}: {
  schoolYears: any[];
  teachers: any[];
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await createClass(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/classes"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Class</h1>
          <p className="text-sm text-gray-500">Create a new class section.</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Class Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="school_year_id">School Year *</Label>
              <select id="school_year_id" name="school_year_id" required
                className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm">
                <option value="">Select school year...</option>
                {schoolYears.map((sy: any) => (
                  <option key={sy.id} value={sy.id}>{sy.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="grade_level">Grade Level *</Label>
                <select id="grade_level" name="grade_level" required
                  className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm">
                  <option value="">Select...</option>
                  {GRADE_LEVELS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="section">Section *</Label>
                <Input id="section" name="section" placeholder="Rizal" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="advisor_id">Class Advisor</Label>
              <select id="advisor_id" name="advisor_id"
                className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm">
                <option value="">No advisor</option>
                {teachers.map((t: any) => (
                  <option key={t.id} value={t.id}>{t.user?.full_name}</option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Class"}
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/classes">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
