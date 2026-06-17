"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  enrollStudent,
  transferEnrollment as transferEnrollmentAction,
  updateEnrollmentStatus,
} from "./actions";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Plus,
  Search,
  Shuffle,
  UserX,
  Users,
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; badge: string }> = {
  enrolled: { label: "Enrolled", badge: "bg-green-100 text-green-700" },
  dropped: { label: "Dropped", badge: "bg-red-100 text-red-700" },
  transferred: { label: "Transferred", badge: "bg-amber-100 text-amber-700" },
};

function getInitials(name: string | undefined) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function EnrollmentClient({
  enrollments,
  stats,
  classes,
  students,
  schoolYears,
  filterClass,
  filterQ,
}: {
  enrollments: any[];
  stats: { total: number; enrolled: number; dropped: number; transferred: number };
  classes: any[];
  students: any[];
  schoolYears: any[];
  filterClass: string;
  filterQ: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [selectedTransferEnrollment, setSelectedTransferEnrollment] = useState<any>(null);
  const [transferClassId, setTransferClassId] = useState("");
  const [transferSchoolYearId, setTransferSchoolYearId] = useState("");
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
      router.push("/enrollment");
    }
  }

  async function handleTransfer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!selectedTransferEnrollment) {
      setError("Please pick an enrollment to transfer.");
      setLoading(false);
      return;
    }
    const formData = new FormData(e.currentTarget);
    formData.append("enrollment_id", selectedTransferEnrollment.id);
    const result = await transferEnrollmentAction(formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      setTransferOpen(false);
      setSelectedTransferEnrollment(null);
      setTransferClassId("");
      setTransferSchoolYearId("");
      router.push("/enrollment");
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
    router.push(`/enrollment?${params.toString()}`);
  }

  const statCards = [
    { label: "Total Records", value: stats.total, icon: ClipboardList, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Enrolled", value: stats.enrolled, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Transferred", value: stats.transferred, icon: Shuffle, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Dropped", value: stats.dropped, icon: UserX, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 to-violet-800 px-6 py-6 text-white sm:px-8 sm:py-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">
              Student Placement
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Enrollment</h1>
            <p className="mt-2 max-w-xl text-sm text-indigo-100">
              Enroll students into class sections, transfer between classes, and track enrollment
              status.
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button className="shrink-0 bg-yellow-400 font-semibold text-gray-900 hover:bg-yellow-300" />}>
              <Plus className="mr-2 h-4 w-4" />
              Enroll Student
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Enroll Student</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEnroll} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="student_id">Student *</Label>
                  <select id="student_id" name="student_id" required className="flex h-9 w-full rounded-lg border border-input bg-white px-2.5 text-sm text-gray-900">
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
                  <select id="class_id" name="class_id" required className="flex h-9 w-full rounded-lg border border-input bg-white px-2.5 text-sm text-gray-900">
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
                  <select id="school_year_id" name="school_year_id" required className="flex h-9 w-full rounded-lg border border-input bg-white px-2.5 text-sm text-gray-900">
                    <option value="">Select school year...</option>
                    {schoolYears.map((sy: any) => (
                      <option key={sy.id} value={sy.id}>{sy.name}</option>
                    ))}
                  </select>
                </div>
                {error && <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
                <div className="flex gap-3 pt-1">
                  <Button type="submit" disabled={loading}>{loading ? "Enrolling..." : "Enroll"}</Button>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">{stat.label}</p>
                  <p className="mt-1.5 text-2xl font-bold text-gray-900 sm:text-3xl">{stat.value.toLocaleString()}</p>
                </div>
                <div className={`rounded-xl p-2.5 ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <form onSubmit={handleFilter} className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="relative min-w-0 flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input name="q" defaultValue={filterQ} placeholder="Search by name or student number..." className="bg-white pl-9" />
        </div>
        <select name="class" defaultValue={filterClass} className="flex h-9 min-w-[200px] rounded-lg border border-input bg-white px-2.5 text-sm text-gray-900">
          <option value="">All classes</option>
          {classes.map((c: any) => (
            <option key={c.id} value={c.id}>{c.grade_level} - {c.section}</option>
          ))}
        </select>
        <Button type="submit" variant="outline">Filter</Button>
        {(filterClass || filterQ) && (
          <Button type="button" variant="ghost" onClick={() => router.push("/enrollment")}>Clear</Button>
        )}
      </form>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <section className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
            <h2 className="font-semibold text-gray-900">
              {filterQ || filterClass ? "Filtered Results" : "All Enrollments"}
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">
              {enrollments.length} record{enrollments.length === 1 ? "" : "s"} shown
            </p>
          </div>

          {enrollments.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {enrollments.map((e: any) => {
                const status = STATUS_CONFIG[e.status] ?? { label: e.status, badge: "bg-gray-100 text-gray-600" };
                const name = e.student?.user?.full_name ?? "Unknown";
                return (
                  <div key={e.id} className="px-5 py-5 transition-colors hover:bg-gray-50/60">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 flex-1 gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                          {getInitials(name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{name}</h3>
                            <Badge className={status.badge}>{status.label}</Badge>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {e.student?.student_number ? `#${e.student.student_number}` : "No student number"}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                            <span className="inline-flex items-center gap-1.5">
                              <GraduationCap className="h-3.5 w-3.5" />
                              {e.class?.grade_level} — {e.class?.section}
                            </span>
                            <span>{e.class?.school_year?.name}</span>
                          </div>
                        </div>
                      </div>
                      {e.status === "enrolled" && (
                        <div className="flex shrink-0 gap-2">
                          <Button type="button" variant="outline" size="sm" className="text-red-600" onClick={async () => { await updateEnrollmentStatus(e.id, "dropped"); router.refresh(); }}>
                            Drop
                          </Button>
                          <Button type="button" variant="ghost" size="sm" className="text-amber-600" onClick={() => { setSelectedTransferEnrollment(e); setTransferClassId(""); setTransferSchoolYearId(""); setTransferOpen(true); }}>
                            Transfer
                          </Button>
                        </div>
                      )}
                      {e.status === "transferred" && (
                        <Button type="button" variant="ghost" size="sm" className="text-amber-600" onClick={() => { setSelectedTransferEnrollment(e); setTransferClassId(""); setTransferSchoolYearId(""); setTransferOpen(true); }}>
                          Transfer Again
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <Users className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-4 font-medium text-gray-700">No enrollments found</p>
              <p className="mt-1 text-sm text-gray-500">Enroll a student or adjust your filters.</p>
            </div>
          )}
        </section>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-7">
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900">Quick Actions</h2>
            <div className="mt-4 space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/enrollment/new"><Plus className="mr-2 h-4 w-4" /> New enrollment form</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/students"><Users className="mr-2 h-4 w-4" /> Manage students</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/classes"><GraduationCap className="mr-2 h-4 w-4" /> Manage classes</Link>
              </Button>
            </div>
          </section>
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900">Quick Guide</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">1</span>
                <span>Select a student, class, and school year to enroll.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">2</span>
                <span>Use Transfer to move a student to another section.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">3</span>
                <span>Drop removes a student from the class roster.</span>
              </li>
            </ul>
            <Link href="/students" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
              View unenrolled students
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </section>
        </aside>
      </div>

      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Transfer Enrollment</DialogTitle></DialogHeader>
          <form onSubmit={handleTransfer} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Student</Label>
              <div className="rounded-lg border border-input bg-gray-50 px-3 py-2 text-sm text-gray-900">
                {selectedTransferEnrollment?.student?.user?.full_name ?? "Select an enrollment"}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="transfer_class_id">New Class *</Label>
              <select id="transfer_class_id" name="class_id" required value={transferClassId} onChange={(event) => { setTransferClassId(event.target.value); const selected = classes.find((cls: any) => cls.id === event.target.value); setTransferSchoolYearId(selected?.school_year?.id ?? ""); }} className="flex h-9 w-full rounded-lg border border-input bg-white px-2.5 text-sm text-gray-900">
                <option value="">Select a class...</option>
                {classes.filter((cls: any) => cls.id !== selectedTransferEnrollment?.class_id).map((cls: any) => (
                  <option key={cls.id} value={cls.id}>{cls.grade_level} - {cls.section} ({cls.school_year?.name})</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="transfer_school_year_id">School Year</Label>
              <input id="transfer_school_year_id" name="school_year_id" value={transferSchoolYearId} readOnly className="flex h-9 w-full rounded-lg border border-input bg-gray-100 px-2.5 text-sm text-gray-900" placeholder="Select a class first" />
            </div>
            {error && <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading || !transferClassId}>{loading ? "Transferring..." : "Transfer"}</Button>
              <Button type="button" variant="outline" onClick={() => setTransferOpen(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
