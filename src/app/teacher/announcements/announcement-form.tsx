"use client";

import { useState } from "react";
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
import { createAnnouncement } from "./actions";

type AdvisoryOption = { id: string; label: string };
type SubjectOption = { id: string; label: string };

export function AnnouncementForm({
  advisoryClasses,
  classSubjects,
}: {
  advisoryClasses: AdvisoryOption[];
  classSubjects: SubjectOption[];
}) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audience, setAudience] = useState("school");
  const [classId, setClassId] = useState(advisoryClasses[0]?.id ?? "");
  const [classSubjectId, setClassSubjectId] = useState(classSubjects[0]?.id ?? "");

  const advisoryItems = advisoryClasses.map((c) => ({ value: c.id, label: c.label }));
  const subjectItems = classSubjects.map((cs) => ({ value: cs.id, label: cs.label }));
  const selectedAdvisoryLabel = advisoryClasses.find((c) => c.id === classId)?.label;
  const selectedSubjectLabel = classSubjects.find((cs) => cs.id === classSubjectId)?.label;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    formData.set("audience", audience);
    if (audience === "advisory") formData.set("class_id", classId);
    if (audience === "subject") formData.set("class_subject_id", classSubjectId);

    const result = await createAnnouncement(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    e.currentTarget.reset();
    setAudience("school");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Post Announcement</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" name="title" placeholder="Announcement title" required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content">Message *</Label>
            <Textarea
              id="content"
              name="content"
              rows={4}
              placeholder="Write your announcement..."
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Audience</Label>
            <Select value={audience} onValueChange={(v) => v && setAudience(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="school">School-wide (all students)</SelectItem>
                <SelectItem value="advisory" disabled={advisoryClasses.length === 0}>
                  Advisory class
                </SelectItem>
                <SelectItem value="subject" disabled={classSubjects.length === 0}>
                  Subject class
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {audience === "advisory" && advisoryClasses.length > 0 && (
            <div className="space-y-1.5">
              <Label>Advisory class</Label>
              <Select value={classId} onValueChange={(v) => v && setClassId(v)} items={advisoryItems}>
                <SelectTrigger className="w-full min-w-[280px]">
                  <SelectValue placeholder="Select class">{selectedAdvisoryLabel}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {advisoryClasses.map((c) => (
                    <SelectItem key={c.id} value={c.id} label={c.label}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {audience === "subject" && classSubjects.length > 0 && (
            <div className="space-y-1.5">
              <Label>Subject</Label>
              <Select
                value={classSubjectId}
                onValueChange={(v) => v && setClassSubjectId(v)}
                items={subjectItems}
              >
                <SelectTrigger className="w-full min-w-[280px]">
                  <SelectValue placeholder="Select subject">{selectedSubjectLabel}</SelectValue>
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
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
              Announcement posted.
            </p>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "Posting…" : "Post Announcement"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
