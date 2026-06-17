"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteClass } from "./actions";
import { AlertTriangle, School, Trash2 } from "lucide-react";

export function DeleteClassButton({
  classId,
  gradeLevel,
  section,
  schoolYearName,
  studentCount,
  subjectCount,
}: {
  classId: string;
  gradeLevel: string;
  section: string;
  schoolYearName: string;
  studentCount: number;
  subjectCount: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const classLabel = `${gradeLevel} — ${section}`;
  const hasLinkedData = studentCount > 0 || subjectCount > 0;

  async function handleDelete() {
    setLoading(true);
    setError("");
    const result = await deleteClass(classId);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-red-500 hover:bg-red-50 hover:text-red-700"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
      >
        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
        Delete
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
          <div className="border-b border-red-100 bg-gradient-to-r from-red-950 via-red-900 to-rose-900 px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/15 ring-1 ring-red-400/25">
                <Trash2 className="h-5 w-5 text-red-300" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-white">
                  Delete class?
                </DialogTitle>
                <p className="mt-0.5 text-xs text-red-200/80">This action cannot be undone</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100">
                <School className="h-5 w-5 text-purple-700" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{classLabel}</p>
                <p className="truncate text-xs text-gray-500">{schoolYearName}</p>
              </div>
            </div>

            <DialogDescription className="mt-4 text-sm leading-relaxed text-gray-600">
              {hasLinkedData ? (
                <>
                  <span className="font-medium text-gray-900">{classLabel}</span> will be permanently
                  removed along with its enrollments and subject assignments.
                </>
              ) : (
                <>
                  <span className="font-medium text-gray-900">{classLabel}</span> will be permanently
                  removed from the class list.
                </>
              )}
            </DialogDescription>

            {hasLinkedData && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 p-3.5">
                <div className="flex gap-2.5">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <div className="min-w-0 text-sm text-amber-900">
                    <p className="font-medium">This class has linked records</p>
                    <ul className="mt-1.5 space-y-1 text-xs leading-relaxed text-amber-800/90">
                      {studentCount > 0 && (
                        <li>
                          {studentCount} enrolled student{studentCount === 1 ? "" : "s"}
                        </li>
                      )}
                      {subjectCount > 0 && (
                        <li>
                          {subjectCount} subject assignment{subjectCount === 1 ? "" : "s"}
                        </li>
                      )}
                      <li>Related schedules, attendance, and grade records will also be deleted</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          <DialogFooter className="!m-0 gap-2.5 border-t border-gray-100 bg-gray-50/80 px-6 py-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Keep class
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={handleDelete}
              disabled={loading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {loading ? "Deleting..." : "Delete class"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
