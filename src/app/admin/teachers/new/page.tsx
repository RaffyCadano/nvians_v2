"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createTeacher } from "../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewTeacherPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await createTeacher(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/teachers"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Teacher</h1>
          <p className="text-sm text-gray-500">Create a new teacher account.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Teacher Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input id="full_name" name="full_name" placeholder="Juan dela Cruz" required />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" name="email" type="email" placeholder="teacher@nvians.edu" required />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="password">Password *</Label>
                <Input id="password" name="password" type="password" placeholder="Minimum 8 characters" minLength={8} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="employee_number">Employee Number</Label>
                <Input id="employee_number" name="employee_number" placeholder="EMP-001" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="department">Department</Label>
                <Input id="department" name="department" placeholder="Science" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="specialization">Specialization</Label>
                <Input id="specialization" name="specialization" placeholder="Mathematics, Physics" />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Teacher"}
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/teachers">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
