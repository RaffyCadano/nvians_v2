"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { updateSubject } from "../actions";
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Hash,
  Layers,
  Pencil,
  School,
  Sparkles,
} from "lucide-react";

type SubjectStatus = "active" | "archived";

const STATUS_CONFIG = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    badge: "bg-green-100 text-green-700 hover:bg-green-100",
    accent: "border-teal-200 bg-teal-50/50",
    iconColor: "text-teal-600",
    iconBg: "bg-teal-100",
    header: "from-teal-900 to-emerald-800",
  },
  archived: {
    label: "Archived",
    icon: Archive,
    badge: "bg-gray-100 text-gray-600 hover:bg-gray-100",
    accent: "border-gray-200 bg-gray-50/80",
    iconColor: "text-gray-500",
    iconBg: "bg-gray-100",
    header: "from-slate-800 to-slate-700",
  },
} as const;

const SELECT_CLASS =
  "flex h-10 w-full rounded-lg border border-input bg-white px-3 text-sm text-gray-900 outline-none transition-colors focus:border-teal-400 focus:ring-2 focus:ring-teal-100";

function getCodeColor(code: string) {
  const hash = code.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const palette = [
    { bg: "bg-teal-100", text: "text-teal-700" },
    { bg: "bg-emerald-100", text: "text-emerald-700" },
    { bg: "bg-cyan-100", text: "text-cyan-700" },
    { bg: "bg-sky-100", text: "text-sky-700" },
    { bg: "bg-blue-100", text: "text-blue-700" },
  ];
  return palette[hash % palette.length];
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function SubjectDetailForm({
  subject,
  classLinks,
}: {
  subject: {
    id: string;
    name: string;
    code: string;
    description: string | null;
    status: SubjectStatus;
    created_at: string;
  };
  classLinks: {
    id: string;
    classId: string;
    gradeLevel: string;
    section: string;
    schoolYear: string;
  }[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState(subject.name);
  const [code, setCode] = useState(subject.code);
  const [description, setDescription] = useState(subject.description ?? "");
  const [status, setStatus] = useState<SubjectStatus>(subject.status);

  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.active;
  const StatusIcon = config.icon;
  const codeColor = useMemo(() => getCodeColor(code.trim() || subject.code), [code, subject.code]);
  const hasChanges = useMemo(
    () =>
      name.trim() !== subject.name ||
      code.trim() !== subject.code ||
      description.trim() !== (subject.description ?? "") ||
      status !== subject.status,
    [name, code, description, status, subject]
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await updateSubject(subject.id, formData);
    if (result?.error) {
      setError(result.error);
      setSaving(false);
      return;
    }
    router.push("/subjects");
    router.refresh();
  }

  const statCards = [
    {
      label: "Class Links",
      value: classLinks.length,
      icon: Layers,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      label: "Status",
      value: config.label,
      icon: StatusIcon,
      color: config.iconColor,
      bg: config.iconBg,
      isText: true,
    },
    {
      label: "Code",
      value: subject.code,
      icon: Hash,
      color: codeColor.text,
      bg: codeColor.bg,
      isText: true,
    },
    {
      label: "Added",
      value: formatDate(subject.created_at),
      icon: CalendarDays,
      color: "text-blue-600",
      bg: "bg-blue-50",
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
          className="-ml-2 mb-4 text-teal-200 hover:bg-white/10 hover:text-white"
        >
          <Link href="/subjects">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Subjects
          </Link>
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">
              Curriculum
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold sm:text-3xl">{subject.name}</h1>
              <Badge className={cn(config.badge, "border-0")}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {config.label}
              </Badge>
            </div>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-teal-100">
              <span className="inline-flex items-center gap-1.5 font-mono">
                <Hash className="h-4 w-4 shrink-0" />
                {subject.code}
              </span>
              <span className="hidden text-teal-300 sm:inline">·</span>
              <span>Added {formatDate(subject.created_at)}</span>
            </p>
          </div>
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
              codeColor.bg
            )}
          >
            <BookOpen className={cn("h-6 w-6", codeColor.text)} />
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
                      stat.isText ? "truncate text-lg sm:text-xl" : "text-2xl sm:text-3xl"
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
            <h2 className="font-semibold text-gray-900">Edit Subject</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Update name, code, description, or archive this subject.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                  1
                </span>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Label htmlFor="name">Subject Name</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Mathematics"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                  2
                </span>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Label htmlFor="code">Subject Code</Label>
                  <Input
                    id="code"
                    name="code"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="MATH-7"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                  3
                </span>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of this subject..."
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                  4
                </span>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as SubjectStatus)}
                    className={SELECT_CLASS}
                  >
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                  {status === "archived" && classLinks.length > 0 && (
                    <p className="text-xs text-amber-700">
                      This subject is still linked to {classLinks.length} class
                      {classLinks.length === 1 ? "" : "es"}. Existing links remain until removed
                      from each class.
                    </p>
                  )}
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
                  className="bg-teal-700 hover:bg-teal-800 sm:min-w-[140px]"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/subjects")}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </section>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-7">
          <section className={cn("rounded-xl border p-5", config.accent)}>
            <h2 className="text-base font-bold text-gray-900">Subject Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Status</span>
                <Badge className={config.badge}>{config.label}</Badge>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Code</span>
                <Badge className={cn("font-mono", codeColor.bg, codeColor.text)}>
                  {code.trim().toUpperCase() || subject.code}
                </Badge>
              </div>
              <div className="flex items-start justify-between gap-3">
                <span className="shrink-0 text-gray-600">Description</span>
                <span className="text-right font-medium text-gray-900">
                  {description.trim() || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">Class links</span>
                <span className="font-medium text-gray-900">{classLinks.length}</span>
              </div>
            </div>
            {hasChanges && (
              <p className="mt-4 flex items-center gap-1.5 text-xs text-amber-700">
                <Pencil className="h-3.5 w-3.5" />
                Unsaved changes
              </p>
            )}
          </section>

          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
              <h2 className="font-semibold text-gray-900">Linked Classes</h2>
              <p className="mt-0.5 text-sm text-gray-500">
                {classLinks.length > 0
                  ? "Sections using this subject"
                  : "Not assigned to any class yet"}
              </p>
            </div>
            {classLinks.length > 0 ? (
              <ul className="divide-y divide-gray-100 p-2">
                {classLinks.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.classId ? `/classes/${link.classId}/subjects` : "/classes"}
                      className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50"
                    >
                      <p className="text-sm font-medium text-gray-800">
                        {link.gradeLevel} — {link.section}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">{link.schoolYear}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-5 text-center">
                <School className="mx-auto h-9 w-9 text-gray-300" />
                <p className="mt-3 text-sm font-medium text-gray-600">No class assignments</p>
                <p className="mt-1 text-xs text-gray-500">
                  Assign this subject from a class&apos;s Subjects page.
                </p>
                <Link
                  href="/classes"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700"
                >
                  View classes
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="rounded-lg bg-teal-50 p-2">
                <Sparkles className="h-4 w-4 text-teal-600" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Quick Guide</h2>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                  1
                </span>
                <span>Keep codes unique — they identify subjects across the system.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                  2
                </span>
                <span>Archive subjects no longer offered instead of deleting them.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                  3
                </span>
                <span>Manage class assignments from each class&apos;s Subjects page.</span>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
