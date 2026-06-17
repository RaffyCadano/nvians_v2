"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createNews } from "../../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewNewsPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await createNews(formData);
    if (result?.error) { setError(result.error); setLoading(false); }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm"><Link href="/cms"><ArrowLeft className="h-4 w-4" /></Link></Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Article</h1>
          <p className="text-sm text-gray-500">Create a news article for the public website.</p>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Article Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Input id="excerpt" name="excerpt" placeholder="Short summary shown in listings..." />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="content">Content *</Label>
              <Textarea id="content" name="content" rows={10} required />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_published" name="is_published" value="true" className="h-4 w-4 rounded border-gray-300" />
              <Label htmlFor="is_published">Publish immediately</Label>
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>}
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Article"}</Button>
              <Button asChild variant="outline"><Link href="/cms">Cancel</Link></Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
