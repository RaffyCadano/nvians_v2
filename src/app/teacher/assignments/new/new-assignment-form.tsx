"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createAssignment } from "../actions";

type ClassSubjectOption = { id: string; label: string };

export function NewAssignmentForm({ classSubjects }: { classSubjects: ClassSubjectOption[] }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [classSubjectId, setClassSubjectId] = useState(classSubjects[0]?.id ?? "");

  const selectItems = classSubjects.map((cs) => ({ value: cs.id, label: cs.label }));
  const selectedLabel = classSubjects.find((cs) => cs.id === classSubjectId)?.label;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.set("class_subject_id", classSubjectId);

    const result = await createAssignment(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  if (classSubjects.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-gray-500">
          <p className="font-medium">No subject classes assigned</p>
          <p className="text-sm mt-1">
            Ask an administrator to assign subjects before creating assignments.
          </p>
          <Button asChild variant="outline" className="mt-4" size="sm">
            <Link href="/teacher/assignments">Back to Assignments</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Assignment details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" name="title" placeholder="e.g. Chapter 5 Problem Set" required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Instructions for students…"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="class_subject_id">Subject class *</Label>
            <Select
              value={classSubjectId}
              onValueChange={(value) => {
                if (value != null) setClassSubjectId(value);
              }}
              items={selectItems}
              required
            >
              <SelectTrigger id="class_subject_id" className="w-full min-w-0">
                <SelectValue placeholder="Select class">{selectedLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {classSubjects.map((cs) => (
                  <SelectItem key={cs.id} value={cs.id} label={cs.label}>
                    {cs.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="due_date">Due date *</Label>
              <Input id="due_date" name="due_date" type="datetime-local" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="max_score">Max score</Label>
              <Input
                id="max_score"
                name="max_score"
                type="number"
                min={1}
                step={0.01}
                defaultValue={100}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating…" : "Create assignment"}
            </Button>
            <Button asChild type="button" variant="outline">
              <Link href="/teacher/assignments">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
