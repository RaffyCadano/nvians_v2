"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { AttendanceRecordEditor } from "./attendance-record-editor";
import type { AttendanceRecordRow } from "@/lib/teacher/attendance-session";

export function AttendanceRecordList({
  records,
  emptyEnrollmentMessage,
}: {
  records: AttendanceRecordRow[];
  emptyEnrollmentMessage?: React.ReactNode;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return records;
    return records.filter(
      (r) =>
        r.studentName.toLowerCase().includes(q) ||
        (r.studentNumber?.toLowerCase().includes(q) ?? false)
    );
  }, [records, query]);

  if (records.length === 0) {
    return <div className="px-4 py-8 text-center text-gray-500 text-sm">{emptyEnrollmentMessage}</div>;
  }

  return (
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
            Showing {filtered.length} of {records.length} students
          </p>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="divide-y">
          {filtered.map((record) => (
            <AttendanceRecordEditor key={record.id} record={record} />
          ))}
        </div>
      ) : (
        <p className="px-4 py-8 text-center text-gray-500 text-sm">
          No students match &ldquo;{query.trim()}&rdquo;.
        </p>
      )}
    </div>
  );
}
