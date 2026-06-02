"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { saveGradeScore } from "../../actions";

type GradeItemOption = {
  id: string;
  name: string;
  maxScore: number;
  categoryName: string;
};

type StudentRow = {
  id: string;
  name: string;
  studentNumber: string | null;
};

export function ScoreEntryForm({
  classSubjectId,
  gradeItems,
  activeItemId,
  activeItem,
  students,
  scoresByStudent,
}: {
  classSubjectId: string;
  gradeItems: GradeItemOption[];
  activeItemId: string;
  activeItem?: GradeItemOption;
  students: StudentRow[];
  scoresByStudent: Record<string, number>;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      students.map((s) => [
        s.id,
        scoresByStudent[s.id] !== undefined ? String(scoresByStudent[s.id]) : "",
      ])
    )
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const filteredStudents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.studentNumber?.toLowerCase().includes(q) ?? false)
    );
  }, [students, query]);

  function onItemChange(itemId: string) {
    router.push(`/teacher/grades/${classSubjectId}/scores?item=${itemId}`);
  }

  async function saveStudent(studentId: string) {
    const raw = drafts[studentId]?.trim();
    if (!raw) {
      setErrors((prev) => ({ ...prev, [studentId]: "Enter a score." }));
      return;
    }

    const score = Number(raw);
    if (Number.isNaN(score)) {
      setErrors((prev) => ({ ...prev, [studentId]: "Invalid number." }));
      return;
    }

    setSaving((prev) => ({ ...prev, [studentId]: true }));
    setErrors((prev) => ({ ...prev, [studentId]: "" }));

    const result = await saveGradeScore(activeItemId, studentId, score);

    setSaving((prev) => ({ ...prev, [studentId]: false }));

    if (result?.error) {
      setErrors((prev) => ({ ...prev, [studentId]: result.error! }));
      return;
    }

    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5 max-w-md">
        <Label htmlFor="grade_item">Grade item</Label>
        <select
          id="grade_item"
          value={activeItemId}
          onChange={(e) => onItemChange(e.target.value)}
          className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
        >
          {gradeItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.categoryName} — {item.name} (max {item.maxScore})
            </option>
          ))}
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {activeItem ? `${activeItem.name} — max ${activeItem.maxScore}` : "Scores"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {students.length > 0 ? (
            <div className="flex flex-col">
              <div className="border-b px-4 py-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search by name or student number…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-9"
                    aria-label="Search students"
                  />
                </div>
                {query.trim() && (
                  <p className="text-xs text-gray-500 mt-2">
                    Showing {filteredStudents.length} of {students.length} students
                  </p>
                )}
              </div>

              {filteredStudents.length > 0 ? (
                <div className="divide-y">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        {student.studentNumber && (
                          <p className="text-xs text-gray-500 font-mono">{student.studentNumber}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1 sm:items-end">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={0}
                            max={activeItem?.maxScore}
                            step={0.01}
                            className="w-24"
                            value={drafts[student.id] ?? ""}
                            onChange={(e) =>
                              setDrafts((prev) => ({ ...prev, [student.id]: e.target.value }))
                            }
                            aria-label={`Score for ${student.name}`}
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={saving[student.id]}
                            onClick={() => saveStudent(student.id)}
                          >
                            {saving[student.id] ? "Saving…" : "Save"}
                          </Button>
                        </div>
                        {errors[student.id] && (
                          <p className="text-xs text-red-600">{errors[student.id]}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="px-4 py-8 text-center text-gray-500 text-sm">
                  No students match &ldquo;{query.trim()}&rdquo;.
                </p>
              )}
            </div>
          ) : (
            <p className="px-4 py-8 text-center text-gray-500 text-sm">
              No enrolled students in this class. Run{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                node --env-file=.env.local scripts/seed-mock-teacher-data.mjs
              </code>{" "}
              to add demo students.
            </p>
          )}
        </CardContent>
      </Card>

      <Button asChild variant="outline" size="sm">
        <Link href={`/teacher/grades/${classSubjectId}/categories`}>Manage categories</Link>
      </Button>
    </div>
  );
}
