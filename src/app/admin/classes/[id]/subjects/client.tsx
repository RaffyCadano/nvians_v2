"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addClassSubject, removeClassSubject } from "./actions";
import { Plus, Trash2, BookOpen } from "lucide-react";

const TERM_STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  archived: "bg-gray-100 text-gray-600",
  upcoming: "bg-yellow-100 text-yellow-700",
};

export default function ClassSubjectsClient({
  cls,
  classSubjects,
  subjects,
  teachers,
  terms,
}: {
  cls: any;
  classSubjects: any[];
  subjects: any[];
  teachers: any[];
  terms: any[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Group class subjects by term
  const byTerm: Record<string, any[]> = {};
  classSubjects.forEach((cs) => {
    const termId = cs.term_id;
    if (!byTerm[termId]) byTerm[termId] = [];
    byTerm[termId].push(cs);
  });

  // Already assigned subject+term combos
  const assigned = new Set(classSubjects.map((cs) => `${cs.subject_id}_${cs.term_id}`));

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await addClassSubject(formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setOpen(false);
      router.refresh();
    }
  }

  function handleRemove(id: string) {
    startTransition(async () => {
      await removeClassSubject(id);
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {cls.grade_level} - {cls.section}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {cls.school_year?.name} · Advisor: {cls.advisor?.user?.full_name ?? "None"}
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}>
            <Plus className="mr-2 h-4 w-4" /> Assign Subject
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Assign Subject to Class</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 pt-2">
              <input type="hidden" name="class_id" value={cls.id} />

              <div className="space-y-1.5">
                <Label htmlFor="term_id">Term *</Label>
                <select
                  id="term_id"
                  name="term_id"
                  required
                  className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                >
                  <option value="">Select term...</option>
                  {terms.map((t: any) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subject_id">Subject *</Label>
                <select
                  id="subject_id"
                  name="subject_id"
                  required
                  className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                >
                  <option value="">Select subject...</option>
                  {subjects.map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="teacher_id">Teacher</Label>
                <select
                  id="teacher_id"
                  name="teacher_id"
                  className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                >
                  <option value="">No teacher assigned</option>
                  {teachers.map((t: any) => (
                    <option key={t.id} value={t.id}>
                      {t.user?.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="schedule">Schedule</Label>
                <input
                  id="schedule"
                  name="schedule"
                  placeholder="e.g. Mon/Wed 8:00–9:00 AM"
                  className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm placeholder:text-muted-foreground"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <Button type="submit" disabled={loading}>
                  {loading ? "Assigning..." : "Assign"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Subjects grouped by term */}
      {terms.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-gray-500">
            <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p>No terms found for this school year.</p>
          </CardContent>
        </Card>
      ) : (
        terms.map((term: any) => {
          const termSubjects = byTerm[term.id] ?? [];
          return (
            <Card key={term.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">{term.name}</CardTitle>
                  <Badge
                    className={`text-xs font-normal ${TERM_STATUS_COLORS[term.status] ?? ""}`}
                  >
                    {term.status}
                  </Badge>
                  <span className="text-xs text-gray-400 ml-auto">
                    {termSubjects.length} subject{termSubjects.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {termSubjects.length === 0 ? (
                  <p className="text-sm text-gray-400 px-6 pb-5">No subjects assigned for this term.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="border-t border-b bg-gray-50">
                      <tr>
                        <th className="px-4 py-2.5 text-left font-medium text-gray-600">Subject</th>
                        <th className="px-4 py-2.5 text-left font-medium text-gray-600">Teacher</th>
                        <th className="px-4 py-2.5 text-left font-medium text-gray-600">Schedule</th>
                        <th className="px-4 py-2.5 text-left font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {termSubjects.map((cs: any) => (
                        <tr key={cs.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-900">{cs.subject?.name}</p>
                            <p className="text-xs text-gray-400">{cs.subject?.code}</p>
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {cs.teacher?.user?.full_name ?? (
                              <span className="text-gray-400 italic">Unassigned</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {cs.schedule ?? <span className="text-gray-400 italic">—</span>}
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 h-7 px-2"
                              disabled={isPending}
                              onClick={() => handleRemove(cs.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
