"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createAttendanceSession } from "../actions";

type ClassSubjectOption = { id: string; label: string };

export function NewSessionForm({ classSubjects }: { classSubjects: ClassSubjectOption[] }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [classSubjectId, setClassSubjectId] = useState(classSubjects[0]?.id ?? "");

  const today = new Date().toISOString().slice(0, 10);
  const selectItems = classSubjects.map((cs) => ({ value: cs.id, label: cs.label }));
  const selectedLabel = classSubjects.find((cs) => cs.id === classSubjectId)?.label;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.set("class_subject_id", classSubjectId);

    const result = await createAttendanceSession(formData);

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
            Ask an administrator to assign subjects before taking attendance.
          </p>
          <Button asChild variant="outline" className="mt-4" size="sm">
            <Link href="/teacher/attendance">Back to Attendance</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Session details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <Label htmlFor="class_subject_id">Subject class *</Label>
            <Select
              value={classSubjectId}
              onValueChange={(v) => v && setClassSubjectId(v)}
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

          <div className="space-y-1.5">
            <Label htmlFor="date">Date *</Label>
            <Input id="date" name="date" type="date" defaultValue={today} required />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating…" : "Create session"}
            </Button>
            <Button asChild type="button" variant="outline">
              <Link href="/teacher/attendance">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
