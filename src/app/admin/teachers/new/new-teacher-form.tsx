"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { createTeacher } from "../actions";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Mail,
  Plus,
  Sparkles,
  UserCheck,
  UserPlus,
} from "lucide-react";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function NewTeacherForm({
  stats,
  recentTeachers,
  topDepartments,
}: {
  stats: { total: number; active: number };
  recentTeachers: {
    id: string;
    fullName: string;
    email: string;
    department: string | null;
    employeeNumber: string | null;
  }[];
  topDepartments: { name: string; count: number }[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [specialization, setSpecialization] = useState("");

  const previewReady = Boolean(fullName.trim() && email.trim());
  const initials = useMemo(() => getInitials(fullName.trim() || "NT"), [fullName]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await createTeacher(new FormData(e.currentTarget));
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    router.push("/teachers");
    router.refresh();
  }

  const statCards = [
    {
      label: "Total Teachers",
      value: stats.total,
      icon: UserCheck,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Active",
      value: stats.active,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Departments",
      value: topDepartments.length,
      icon: Building2,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-green-900 to-emerald-800 px-6 py-6 text-white sm:px-8 sm:py-7">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-2 mb-4 text-green-200 hover:bg-white/10 hover:text-white"
        >
          <Link href="/teachers">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Teachers
          </Link>
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">
              Faculty
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Add Teacher</h1>
            <p className="mt-2 max-w-xl text-sm text-green-100">
              Create a teacher account with login credentials. They can be assigned as class
              advisors or subject teachers after creation.
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
            <h2 className="font-semibold text-gray-900">Teacher Information</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Account credentials are required. Department and specialization are optional.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                  1
                </span>
                <div className="min-w-0 flex-1 space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      placeholder="Juan dela Cruz"
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
                      placeholder="teacher@nvians.edu"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Minimum 8 characters"
                      minLength={8}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      The teacher will use this to sign in to the portal.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                  2
                </span>
                <div className="min-w-0 flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="employee_number">Employee Number</Label>
                    <Input
                      id="employee_number"
                      name="employee_number"
                      placeholder="EMP-2024-001"
                      value={employeeNumber}
                      onChange={(e) => setEmployeeNumber(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      name="department"
                      placeholder="Mathematics"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      name="specialization"
                      placeholder="Algebra, Calculus"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
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
                  disabled={loading}
                  className="bg-green-700 hover:bg-green-800 sm:min-w-[160px]"
                >
                  {loading ? "Creating..." : "Create Teacher"}
                </Button>
                <Button asChild variant="outline">
                  <Link href="/teachers">Cancel</Link>
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
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
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
                      <span className="text-gray-500">Employee no.</span>
                      <span className="font-medium text-gray-900">
                        {employeeNumber.trim() || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">Department</span>
                      <span className="font-medium text-gray-900">
                        {department.trim() || "—"}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <span className="shrink-0 text-gray-500">Specialization</span>
                      <span className="text-right font-medium text-gray-900">
                        {specialization.trim() || "—"}
                      </span>
                    </div>
                  </div>

                  <p className="flex items-center gap-1.5 text-xs text-green-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Ready to create
                  </p>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <UserCheck className="mx-auto h-9 w-9 text-gray-300" />
                  <p className="mt-3 text-sm font-medium text-gray-600">No preview yet</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter a name and email to preview the teacher profile.
                  </p>
                </div>
              )}
            </div>
          </section>

          {recentTeachers.length > 0 && (
            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
                <h2 className="font-semibold text-gray-900">Recently Added</h2>
                <p className="mt-0.5 text-sm text-gray-500">Latest teacher accounts</p>
              </div>
              <ul className="divide-y divide-gray-100 p-2">
                {recentTeachers.map((teacher) => (
                  <li key={teacher.id}>
                    <Link
                      href={`/teachers/${teacher.id}`}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                        {getInitials(teacher.fullName)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {teacher.fullName}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {teacher.department ?? teacher.email}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {topDepartments.length > 0 && (
            <section className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-base font-bold text-gray-900">Departments</h2>
              <p className="mt-0.5 text-sm text-gray-500">Teachers by department</p>
              <ul className="mt-4 space-y-2">
                {topDepartments.map((dept) => (
                  <li
                    key={dept.name}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2.5"
                  >
                    <span className="text-sm font-medium text-gray-800">{dept.name}</span>
                    <Badge variant="secondary" className="bg-white text-gray-700">
                      {dept.count}
                    </Badge>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="rounded-lg bg-green-50 p-2">
                <Sparkles className="h-4 w-4 text-green-600" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Quick Guide</h2>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                  1
                </span>
                <span>Create the account with name, email, and password.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                  2
                </span>
                <span>Assign as class advisor from the class edit page.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                  3
                </span>
                <span>Link subjects to classes with teacher assignments.</span>
              </li>
            </ul>
            <Link
              href="/classes"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700"
            >
              View classes
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </section>

          <section className="rounded-xl border border-dashed border-green-200 bg-green-50/40 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-white p-2 ring-1 ring-green-100">
                <Mail className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">After creating</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-600">
                  The teacher can sign in immediately with the email and password you set. Share
                  credentials securely.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
