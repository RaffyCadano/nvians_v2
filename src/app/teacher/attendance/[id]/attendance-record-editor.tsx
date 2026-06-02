"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateAttendanceRecord } from "../actions";

const STATUS_COLORS: Record<string, string> = {
  present: "bg-green-100 text-green-700",
  absent: "bg-red-100 text-red-700",
  excused: "bg-yellow-100 text-yellow-700",
};

const STATUS_LABELS: Record<"present" | "absent" | "excused", string> = {
  present: "Present",
  absent: "Absent",
  excused: "Excused",
};

type RecordRow = {
  id: string;
  status: "present" | "absent" | "excused";
  remarks: string | null;
  studentName: string;
  studentNumber: string | null;
};

export function AttendanceRecordEditor({ record }: { record: RecordRow }) {
  const router = useRouter();
  const [status, setStatus] = useState(record.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function setRecordStatus(next: "present" | "absent" | "excused") {
    if (next === status || saving) return;

    const previous = status;
    setSaving(true);
    setError(null);
    setStatus(next);

    const result = await updateAttendanceRecord(record.id, next);

    if (result?.error) {
      setStatus(previous);
      setError(result.error);
      setSaving(false);
      return;
    }

    setSaving(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-gray-900">{record.studentName}</p>
        {record.studentNumber && (
          <p className="text-xs text-gray-500 font-mono">{record.studentNumber}</p>
        )}
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="secondary" className={STATUS_COLORS[status]}>
          {STATUS_LABELS[status]}
        </Badge>
        {(["present", "absent", "excused"] as const).map((s) => (
          <Button
            key={s}
            type="button"
            size="sm"
            variant={status === s ? "default" : "outline"}
            disabled={saving}
            onClick={() => setRecordStatus(s)}
          >
            {STATUS_LABELS[s]}
          </Button>
        ))}
      </div>
    </div>
  );
}
