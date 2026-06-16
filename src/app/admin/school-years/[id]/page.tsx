"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateSchoolYear } from "../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SchoolYearDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [schoolYear, setSchoolYear] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("school_years")
        .select("*")
        .eq("id", id)
        .single();
      if (error || !data) {
        setError("School year not found.");
      } else {
        setSchoolYear(data);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await updateSchoolYear(id, formData);
    if (result?.error) {
      setError(result.error);
      setSaving(false);
    } else {
      router.push("/admin/school-years");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading...
      </div>
    );
  }

  if (!schoolYear) {
    return (
      <div className="max-w-lg space-y-4">
        <p className="text-red-600">{error || "School year not found."}</p>
        <Link href="/admin/school-years" className="text-sm text-blue-600 hover:underline">
          ← Back to School Years
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/school-years" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit School Year</h1>
          <p className="text-sm text-gray-500">Update academic year details.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">School Year Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">School Year Name *</Label>
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
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  required
                  defaultValue={schoolYear.start_date}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="end_date">End Date *</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  required
                  defaultValue={schoolYear.end_date}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                value="true"
                defaultChecked={schoolYear.status === "active"}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="is_active">Set as active school year</Label>
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
              <Button type="button" variant="outline" onClick={() => router.push("/admin/school-years")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
