"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateStudent } from "../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("students")
        .select("*, user:users(id, full_name, email)")
        .eq("id", id)
        .single();
      if (error || !data) {
        setError("Student not found.");
      } else {
        setStudent(data);
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
    const result = await updateStudent(id, formData);
    if (result?.error) {
      setError(result.error);
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="max-w-2xl space-y-4">
        <p className="text-red-600">{error || "Student not found."}</p>
        <Link href="/admin/students" className="text-sm text-blue-600 hover:underline">
          ← Back to Students
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/students" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Student</h1>
          <p className="text-sm text-gray-500">Update student information.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="user_id" value={student.user?.id} />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  required
                  defaultValue={student.user?.full_name}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Email Address</Label>
                <Input value={student.user?.email} disabled className="bg-gray-50" />
                <p className="text-xs text-gray-400">Email cannot be changed here.</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="student_number">Student Number</Label>
                <Input
                  id="student_number"
                  name="student_number"
                  defaultValue={student.student_number ?? ""}
                  placeholder="2024-0001"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  defaultValue={student.date_of_birth ?? ""}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  name="gender"
                  defaultValue={student.gender ?? ""}
                  className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={student.status ?? "active"}
                  className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="parent_name">Parent / Guardian Name</Label>
                <Input
                  id="parent_name"
                  name="parent_name"
                  defaultValue={student.parent_name ?? ""}
                  placeholder="Pedro Santos"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="parent_contact">Parent Contact</Label>
                <Input
                  id="parent_contact"
                  name="parent_contact"
                  defaultValue={student.parent_contact ?? ""}
                  placeholder="09XX-XXX-XXXX"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                defaultValue={student.address ?? ""}
                placeholder="123 Main St, City"
              />
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
              <Button type="button" variant="outline" onClick={() => router.push("/admin/students")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
