"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSchoolYear } from "../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewSchoolYearPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await createSchoolYear(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/school-years"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New School Year</h1>
          <p className="text-sm text-gray-500">Create a new academic year.</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">School Year Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">School Year Name *</Label>
              <Input id="name" name="name" placeholder="2024-2025" required />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input id="start_date" name="start_date" type="date" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="end_date">End Date *</Label>
                <Input id="end_date" name="end_date" type="date" required />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_active" name="is_active" value="true" className="h-4 w-4 rounded border-gray-300" />
              <Label htmlFor="is_active">Set as active school year</Label>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create School Year"}
              </Button>
              <Button asChild variant="outline">
                <Link href="/school-years">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
