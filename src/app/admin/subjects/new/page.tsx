"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { createSubject } from "../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewSubjectPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await createSubject(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/subjects"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Subject</h1>
          <p className="text-sm text-gray-500">Add a new subject to the curriculum.</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Subject Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="name">Subject Name *</Label>
                <Input id="name" name="name" placeholder="Mathematics" required />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="code">Subject Code *</Label>
                <Input id="code" name="code" placeholder="MATH-101" required />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Brief description of the subject..." rows={3} />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Subject"}
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/subjects">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
