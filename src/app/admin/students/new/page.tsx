"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createStudent } from "../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewStudentPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await createStudent(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/students"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Student</h1>
          <p className="text-sm text-gray-500">Create a new student account.</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Student Information</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input id="full_name" name="full_name" placeholder="Maria Santos" required />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" name="email" type="email" placeholder="student@nvians.edu" required />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="password">Password *</Label>
                <Input id="password" name="password" type="password" minLength={8} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="student_number">Student Number</Label>
                <Input id="student_number" name="student_number" placeholder="2024-0001" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input id="date_of_birth" name="date_of_birth" type="date" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  name="gender"
                  className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="parent_name">Parent / Guardian Name</Label>
                <Input id="parent_name" name="parent_name" placeholder="Pedro Santos" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="parent_contact">Parent Contact</Label>
                <Input id="parent_contact" name="parent_contact" placeholder="09XX-XXX-XXXX" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" placeholder="123 Main St, City" />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Student"}
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/students">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
