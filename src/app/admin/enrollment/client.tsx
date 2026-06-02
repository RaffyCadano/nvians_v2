"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { enrollStudent, updateEnrollmentStatus } from "./actions";
import { Plus, Search, Users } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  enrolled: "bg-green-100 text-green-700",
  dropped: "bg-red-100 text-red-700",
  transferred: "bg-yellow-100 text-yellow-700",
  completed: "bg-blue-100 text-blue-700",
};

export default function EnrollmentClient({
  enrollments,
  classes,
  students,
  schoolYears,
  filterClass,
  filterQ,
}: {
  enrollments: any[];
  classes: any[];
  students: any[];
  schoolYears: any[];
  filterClass: string;
  filterQ: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEnroll(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await enrollStudent(formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setOpen(false);
      router.refresh();
    }
  }

  function handleFilter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    const q = fd.get("q") as string;
    const cls = fd.get("class") as string;
    if (q) params.set("q", q);
    if (cls) params.set("class", cls);
    router.push(`/admin/enrollment?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enrollment</h1>
          <p className="text-sm text-gray-500 mt-1">
            {enrollments.length} enrollment{enrollments.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}>
            <Plus className="mr-2 h-4 w-4" /> Enroll Student
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Enroll Student</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEnroll} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="student_id">Student *</Label>
                <select
                  id="student_id"
                  name="student_id"
                  required
                  className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                >
                  <option value="">Select student...</option>
                  {students.map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {s.user?.full_name}
                      {s.student_number ? ` (${s.student_number})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="class_id">Class *</Label>
                <select
                  id="class_id"
                  name="class_id"
                  required
                  className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                >
                  <option value="">Select class...</option>
                  {classes.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.grade_level} - {c.section} ({c.school_year?.name})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="school_year_id">School Year *</Label>
                <select
                  id="school_year_id"
                  name="school_year_id"
                  required
                  className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                >
                  <option value="">Select school year...</option>
                  {schoolYears.map((sy: any) => (
                    <option key={sy.id} value={sy.id}>{sy.name}</option>
                  ))}
                </select>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <Button type="submit" disabled={loading}>
                  {loading ? "Enrolling..." : "Enroll"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <form onSubmit={handleFilter} className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input name="q" defaultValue={filterQ} placeholder="Search by name or student number..." className="pl-9" />
        </div>
        <select
          name="class"
          defaultValue={filterClass}
          className="flex h-8 rounded-lg border border-input bg-background px-2.5 text-sm min-w-[200px]"
        >
          <option value="">All classes</option>
          {classes.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.grade_level} - {c.section}
            </option>
          ))}
        </select>
        <Button type="submit" variant="outline" size="sm">Filter</Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.push("/admin/enrollment")}
        >
          Clear
        </Button>
      </form>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Student</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Student No.</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Class</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">School Year</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {enrollments.length > 0 ? (
                enrollments.map((e: any) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {e.student?.user?.full_name}
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                      {e.student?.student_number ?? "â€”"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {e.class?.grade_level} - {e.class?.section}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {e.class?.school_year?.name}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="secondary"
                        className={STATUS_COLORS[e.status] ?? "bg-gray-100 text-gray-600"}
                      >
                        {e.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {e.status === "enrolled" && (
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={async () => { await updateEnrollmentStatus(e.id, "dropped"); router.refresh(); }}
                          >
                            Drop
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-yellow-600 hover:text-yellow-700"
                            onClick={async () => { await updateEnrollmentStatus(e.id, "transferred"); router.refresh(); }}
                          >
                            Transfer
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No enrollments found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
