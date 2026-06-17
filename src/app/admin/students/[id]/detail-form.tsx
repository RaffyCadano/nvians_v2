"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { updateStudent } from "../actions";
import { DeleteStudentButton } from "../delete-student-button";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Sparkles,
  UserRound,
  UserX,
  Users,
} from "lucide-react";

const SELECT_CLASS =
  "flex h-10 w-full rounded-lg border border-input bg-white px-3 text-sm text-gray-900 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

const STATUS_CONFIG = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    badge: "bg-green-100 text-green-700 hover:bg-green-100",
    header: "from-blue-900 to-indigo-800",
    avatar: "bg-blue-100 text-blue-700",
  },
  disabled: {
    label: "Disabled",
    icon: UserX,
    badge: "bg-red-100 text-red-700 hover:bg-red-100",
    header: "from-slate-800 to-slate-700",
    avatar: "bg-red-100 text-red-600",
  },
} as const;

type StudentStatus = keyof typeof STATUS_CONFIG;

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function normalizeGender(value: string | null) {
  if (!value) return "";
  const lower = value.toLowerCase();
  if (lower === "male") return "male";
  if (lower === "female") return "female";
  return value;
}

export default function StudentDetailForm({
  student,
  enrollments,
  stats,
}: {
  student: {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    studentNumber: string | null;
    dateOfBirth: string | null;
    gender: string | null;
    address: string | null;
    parentName: string | null;
    parentContact: string | null;
    status: StudentStatus;
    createdAt: string;
  };
  enrollments: {
    id: string;
    gradeLevel: string;
    section: string;
    schoolYearName: string;
  }[];
  stats: { enrollments: number; hasParent: boolean; hasContact: boolean };
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState(student.fullName);
  const [studentNumber, setStudentNumber] = useState(student.studentNumber ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(student.dateOfBirth ?? "");
  const [gender, setGender] = useState(normalizeGender(student.gender));
  const [status, setStatus] = useState<StudentStatus>(student.status);
  const [parentName, setParentName] = useState(student.parentName ?? "");
  const [parentContact, setParentContact] = useState(student.parentContact ?? "");
  const [address, setAddress] = useState(student.address ?? "");

  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.active;
  const StatusIcon = config.icon;
  const initials = useMemo(() => getInitials(fullName), [fullName]);

  const hasChanges = useMemo(
    () =>
      fullName.trim() !== student.fullName ||
      studentNumber.trim() !== (student.studentNumber ?? "") ||
      dateOfBirth !== (student.dateOfBirth ?? "") ||
      gender !== normalizeGender(student.gender) ||
      status !== student.status ||
      parentName.trim() !== (student.parentName ?? "") ||
      parentContact.trim() !== (student.parentContact ?? "") ||
      address.trim() !== (student.address ?? ""),
    [
      fullName,
      studentNumber,
      dateOfBirth,
      gender,
      status,
      parentName,
      parentContact,
      address,
      student,
    ]
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const result = await updateStudent(student.id, new FormData(e.currentTarget));

    if (result?.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    router.push("/students");
    router.refresh();
  }

  const statCards = [
    {
      label: "Enrollments",
      value: stats.enrollments,
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Guardian",
      value: stats.hasParent ? "On file" : "Missing",
      icon: UserRound,
      color: stats.hasParent ? "text-green-600" : "text-amber-600",
      bg: stats.hasParent ? "bg-green-50" : "bg-amber-50",
      isText: true,
    },
    {
      label: "Contact",
      value: stats.hasContact ? "On file" : "Missing",
      icon: ClipboardList,
      color: stats.hasContact ? "text-blue-600" : "text-amber-600",
      bg: stats.hasContact ? "bg-blue-50" : "bg-amber-50",
      isText: true,
    },
    {
      label: "Status",
      value: config.label,
      icon: StatusIcon,
      color: status === "active" ? "text-green-600" : "text-red-600",
      bg: status === "active" ? "bg-green-50" : "bg-red-50",
      isText: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section
        className={cn(
          "overflow-hidden rounded-2xl bg-gradient-to-r px-6 py-6 text-white sm:px-8 sm:py-7",
          config.header
        )}
      >
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
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold",
                config.avatar
              )}
            >
              {initials}
            </div>
            <div>
              <p className="text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">
                Student Record
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold sm:text-3xl">{fullName}</h1>
                <Badge className={cn(config.badge, "border-0")}>
                  <StatusIcon className="mr-1 h-3 w-3" />
                  {config.label}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-blue-100">
                {student.email}
                {student.studentNumber ? ` · #${student.studentNumber}` : ""}
              </p>
            </div>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <GraduationCap className="h-6 w-6 text-yellow-400" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 sm:text-sm">{stat.label}</p>
                  <p
                    className={cn(
                      "mt-1.5 font-bold text-gray-900",
                      stat.isText ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl"
                    )}
                  >
                    {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                  </p>
                </div>
                <div className={cn("shrink-0 rounded-xl p-2.5", stat.bg)}>
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
            <h2 className="font-semibold text-gray-900">Edit Student</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Update profile, guardian details, and account status.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="hidden" name="user_id" value={student.userId} />

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  1
                </span>
                <div className="min-w-0 flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Email Address</Label>
                    <Input value={student.email} disabled className="bg-gray-50" />
                    <p className="text-xs text-gray-500">Email cannot be changed here.</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      name="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as StudentStatus)}
                      className={SELECT_CLASS}
                    >
                      <option value="active">Active</option>
                      <option value="disabled">Disabled</option>
                    </select>
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
                    <Input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
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
                    <Input
                      id="address"
                      name="address"
                      placeholder="123 Main St, City"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
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
                      value={parentContact}
                      onChange={(e) => setParentContact(e.target.value)}
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
                  disabled={saving || !hasChanges}
                  className="bg-blue-700 hover:bg-blue-800 sm:min-w-[160px]"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button asChild variant="outline">
                  <Link href="/students">Cancel</Link>
                </Button>
              </div>
            </form>
          </div>
        </section>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-7">
          <section className="rounded-xl border border-blue-200 bg-blue-50/40 p-5">
            <h2 className="text-base font-bold text-gray-900">Student Overview</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Added</span>
                <span className="font-medium text-gray-900">{formatDate(student.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Enrollments</span>
                <span className="font-medium text-gray-900">{stats.enrollments}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Guardian</span>
                <span className="font-medium text-gray-900">
                  {parentName.trim() || "—"}
                </span>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="mt-4 w-full bg-white">
              <Link href={`/enrollment/new?student=${student.id}`}>
                Enroll in class
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </section>

          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
              <h2 className="font-semibold text-gray-900">Class Enrollments</h2>
              <p className="mt-0.5 text-sm text-gray-500">Active class sections</p>
            </div>
            {enrollments.length > 0 ? (
              <ul className="divide-y divide-gray-100 p-2">
                {enrollments.map((enrollment) => (
                  <li
                    key={enrollment.id}
                    className="rounded-lg px-3 py-2.5 text-sm"
                  >
                    <p className="font-medium text-gray-900">
                      {enrollment.gradeLevel} — {enrollment.section}
                    </p>
                    <p className="text-xs text-gray-500">{enrollment.schoolYearName}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-6 text-sm text-gray-500">Not enrolled in any class yet.</p>
            )}
          </section>

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
                <span>Keep guardian contact info up to date for notices.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  2
                </span>
                <span>Enroll the student into a class for the active school year.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  3
                </span>
                <span>Disable accounts instead of deleting when a student leaves.</span>
              </li>
            </ul>
          </section>

          <section className="rounded-xl border border-red-200 bg-red-50/30 p-5">
            <h2 className="text-base font-bold text-gray-900">Danger Zone</h2>
            <p className="mt-1 text-sm text-gray-600">
              Permanently remove this student and their account.
            </p>
            <div className="mt-4">
              <DeleteStudentButton
                studentId={student.id}
                studentName={student.fullName}
                studentEmail={student.email}
                studentNumber={student.studentNumber}
                enrollmentCount={stats.enrollments}
              />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
