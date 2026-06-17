"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateTeacher } from "../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TeacherDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("teachers")
        .select("*, user:users(id, full_name, email)")
        .eq("id", id)
        .single();
      if (error || !data) {
        setError("Teacher not found.");
      } else {
        setTeacher(data);
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
    const result = await updateTeacher(id, formData);
    if (result?.error) {
      setError(result.error);
      setSaving(false);
    } else {
      router.push("/teachers");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading...
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="max-w-2xl space-y-4">
        <p className="text-red-600">{error || "Teacher not found."}</p>
        <Link href="/teachers" className="text-sm text-blue-600 hover:underline">
          ← Back to Teachers
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/teachers" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Teacher</h1>
          <p className="text-sm text-gray-500">Update teacher profile information.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teacher Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="user_id" value={teacher.user?.id} />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  required
                  defaultValue={teacher.user?.full_name}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Email Address</Label>
                <Input value={teacher.user?.email} disabled className="bg-gray-50" />
                <p className="text-xs text-gray-400">Email cannot be changed here.</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="employee_number">Employee Number</Label>
                <Input
                  id="employee_number"
                  name="employee_number"
                  defaultValue={teacher.employee_number ?? ""}
                  placeholder="EMP-2024-001"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  name="department"
                  defaultValue={teacher.department ?? ""}
                  placeholder="Mathematics"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  name="specialization"
                  defaultValue={teacher.specialization ?? ""}
                  placeholder="Algebra, Calculus"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={teacher.status ?? "active"}
                  className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
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
              <Button type="button" variant="outline" onClick={() => router.push("/teachers")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
