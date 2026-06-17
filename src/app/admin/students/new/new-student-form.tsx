"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { createStudent } from "../actions";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Mail,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";

const SELECT_CLASS =
  "flex h-10 w-full rounded-lg border border-input bg-white px-3 text-sm text-gray-900 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function NewStudentForm({
  stats,
  recentStudents,
}: {
  stats: { total: number; active: number; enrolled: number };
  recentStudents: {
    id: string;
    fullName: string;
    email: string;
    studentNumber: string | null;
  }[];
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [gender, setGender] = useState("");
  const [parentName, setParentName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const previewReady = Boolean(fullName.trim() && email.trim());
  const initials = useMemo(() => getInitials(fullName.trim() || "NS"), [fullName]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }
    setError("");
    setConfirmOpen(true);
  }

  async function handleConfirmCreate() {
    if (!formRef.current) return;

    setCreating(true);
    setError("");

    try {
      const result = await createStudent(new FormData(formRef.current));

      if (!result || "error" in result) {
        setError(result?.error ?? "Failed to create student. Please try again.");
        return;
      }

      setConfirmOpen(false);
      router.push("/students");
      router.refresh();
    } catch {
      setError("Failed to create student. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  function handleConfirmOpenChange(open: boolean) {
    if (creating) return;
    setConfirmOpen(open);
    if (!open) setError("");
  }

  const statCards = [
    {
      label: "Total Students",
      value: stats.total,
      icon: GraduationCap,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active",
      value: stats.active,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Enrolled",
      value: stats.enrolled,
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-800 px-6 py-6 text-white sm:px-8 sm:py-7">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-2 mb-4 text-blue-200 hover:bg-white/10 hover:text-white"
        >
          <Link href="/students">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Students
          </Link>
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">
              Student Records
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Add Student</h1>
            <p className="mt-2 max-w-xl text-sm text-blue-100">
              Create a student account with login credentials and guardian details. Enroll them
              into a class after creation.
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <UserPlus className="h-6 w-6 text-yellow-400" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3 sm:gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">{stat.label}</p>
                  <p className="mt-1.5 text-2xl font-bold text-gray-900 sm:text-3xl">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={cn("rounded-xl p-2.5", stat.bg)}>
                  <Icon className={cn("h-5 w-5", stat.color)} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <section className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
            <h2 className="font-semibold text-gray-900">Student Information</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Account credentials are required. Profile and guardian fields are optional.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  1
                </span>
                <div className="min-w-0 flex-1 space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      placeholder="Maria Santos"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="student@nvians.edu"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimum 8 characters"
                        minLength={8}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      The student will use this to sign in to the portal.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  2
                </span>
                <div className="min-w-0 flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="student_number">Student Number</Label>
                    <Input
                      id="student_number"
                      name="student_number"
                      placeholder="2024-0001"
                      value={studentNumber}
                      onChange={(e) => setStudentNumber(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input id="date_of_birth" name="date_of_birth" type="date" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      name="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className={SELECT_CLASS}
                    >
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" placeholder="123 Main St, City" />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  3
                </span>
                <div className="min-w-0 flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="parent_name">Parent / Guardian Name</Label>
                    <Input
                      id="parent_name"
                      name="parent_name"
                      placeholder="Pedro Santos"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="parent_contact">Parent Contact</Label>
                    <Input
                      id="parent_contact"
                      name="parent_contact"
                      placeholder="09XX-XXX-XXXX"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row">
                <Button
                  type="submit"
                  disabled={creating}
                  className="bg-blue-700 hover:bg-blue-800 sm:min-w-[160px]"
                >
                  Create Student
                </Button>
                <Button asChild variant="outline">
                  <Link href="/students">Cancel</Link>
                </Button>
              </div>
            </form>
          </div>
        </section>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-7">
          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
              <h2 className="font-semibold text-gray-900">Preview</h2>
              <p className="mt-0.5 text-sm text-gray-500">Review before creating</p>
            </div>
            <div className="p-5">
              {previewReady ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900">{fullName.trim()}</p>
                      <p className="mt-0.5 truncate text-sm text-gray-500">{email.trim()}</p>
                      <Badge className="mt-1.5 bg-green-100 text-green-700 hover:bg-green-100">
                        Active
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">Student no.</span>
                      <span className="font-mono font-medium text-gray-900">
                        {studentNumber.trim() || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">Gender</span>
                      <span className="font-medium capitalize text-gray-900">
                        {gender || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">Guardian</span>
                      <span className="font-medium text-gray-900">
                        {parentName.trim() || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">Enrollment</span>
                      <span className="font-medium text-gray-900">Not enrolled yet</span>
                    </div>
                  </div>

                  <p className="flex items-center gap-1.5 text-xs text-green-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Ready to create
                  </p>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <GraduationCap className="mx-auto h-9 w-9 text-gray-300" />
                  <p className="mt-3 text-sm font-medium text-gray-600">No preview yet</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter a name and email to preview the student profile.
                  </p>
                </div>
              )}
            </div>
          </section>

          {recentStudents.length > 0 && (
            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
                <h2 className="font-semibold text-gray-900">Recently Added</h2>
                <p className="mt-0.5 text-sm text-gray-500">Latest student accounts</p>
              </div>
              <ul className="divide-y divide-gray-100 p-2">
                {recentStudents.map((student) => (
                  <li key={student.id}>
                    <Link
                      href={`/students/${student.id}`}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                        {getInitials(student.fullName)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {student.fullName}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {student.studentNumber
                            ? `#${student.studentNumber}`
                            : student.email}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="rounded-lg bg-blue-50 p-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Quick Guide</h2>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  1
                </span>
                <span>Create the account with name, email, and password.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  2
                </span>
                <span>Add student number and parent/guardian contact info.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  3
                </span>
                <span>Enroll the student into a class from the Enrollment page.</span>
              </li>
            </ul>
            <Link
              href="/enrollment"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Go to enrollment
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </section>

          <section className="rounded-xl border border-dashed border-blue-200 bg-blue-50/40 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-white p-2 ring-1 ring-blue-100">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">After creating</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-600">
                  The student can sign in immediately. Share credentials securely, then enroll
                  them in a class for the active school year.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>

      <Dialog open={confirmOpen} onOpenChange={handleConfirmOpenChange}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
          <div className="border-b border-blue-100 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 ring-1 ring-blue-400/25">
                <UserPlus className="h-5 w-5 text-blue-300" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-white">
                  Create student?
                </DialogTitle>
                <p className="mt-0.5 text-xs text-blue-200/80">
                  Review the details before creating the account
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{fullName.trim()}</p>
                <p className="truncate text-xs text-gray-500">{email.trim()}</p>
                {studentNumber.trim() ? (
                  <p className="truncate font-mono text-xs text-gray-500">
                    #{studentNumber.trim()}
                  </p>
                ) : null}
              </div>
            </div>

            <DialogDescription className="mt-4 text-sm leading-relaxed text-gray-600">
              A new student account will be created for{" "}
              <span className="font-medium text-gray-900">{fullName.trim()}</span>. They can sign
              in immediately with the email and password you set.
            </DialogDescription>

            <div className="mt-4 space-y-2 rounded-xl border border-gray-100 bg-gray-50/80 p-3.5 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">Gender</span>
                <span className="font-medium capitalize text-gray-900">{gender || "—"}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">Guardian</span>
                <span className="font-medium text-gray-900">{parentName.trim() || "—"}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">Enrollment</span>
                <span className="font-medium text-gray-900">Not enrolled yet</span>
              </div>
            </div>

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
              onClick={() => handleConfirmOpenChange(false)}
              disabled={creating}
            >
              Go back
            </Button>
            <Button
              type="button"
              className="w-full bg-blue-700 hover:bg-blue-800 sm:w-auto"
              onClick={handleConfirmCreate}
              disabled={creating}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {creating ? "Creating..." : "Create student"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
