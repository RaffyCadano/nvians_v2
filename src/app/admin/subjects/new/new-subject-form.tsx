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
import { createSubject } from "../actions";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Hash,
  Layers,
  Plus,
  School,
  Sparkles,
} from "lucide-react";

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

export default function NewSubjectForm({
  stats,
  topAssigned,
}: {
  stats: { total: number; active: number; assigned: number };
  topAssigned: { id: string; name: string; code: string; classCount: number }[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const previewReady = Boolean(name.trim() && code.trim());
  const codeColor = useMemo(() => getCodeColor(code.trim() || "NEW"), [code]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await createSubject(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    router.push("/subjects");
    router.refresh();
  }

  const statCards = [
    {
      label: "Total Subjects",
      value: stats.total,
      icon: BookOpen,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      label: "Active",
      value: stats.active,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "In Classes",
      value: stats.assigned,
      icon: School,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-teal-900 to-emerald-800 px-6 py-6 text-white sm:px-8 sm:py-7">
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
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">New Subject</h1>
            <p className="mt-2 max-w-xl text-sm text-teal-100">
              Add a subject to the catalog with a unique code. After creating, assign it to class
              sections from each class&apos;s Subjects page.
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <Plus className="h-6 w-6 text-yellow-400" />
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
                <div className={`rounded-xl p-2.5 ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <section className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
            <h2 className="font-semibold text-gray-900">Subject Details</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Name and code are required. Codes must be unique across the catalog.
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
                    placeholder="Mathematics"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Use the full official name as it appears on report cards.
                  </p>
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
                    placeholder="MATH-7"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                  />
                  <p className="text-xs text-gray-500">
                    Short unique identifier, e.g. MATH-7, ENG-10, SCI-G11.
                  </p>
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
                    placeholder="Brief description of the subject, scope, or grade level..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">Optional — helps admins identify similar subjects.</p>
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
                  className="bg-teal-700 hover:bg-teal-800 sm:min-w-[160px]"
                >
                  {loading ? "Creating..." : "Create Subject"}
                </Button>
                <Button asChild variant="outline">
                  <Link href="/subjects">Cancel</Link>
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
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${codeColor.bg}`}
                    >
                      <Hash className={`h-5 w-5 ${codeColor.text}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900">{name.trim()}</p>
                      <Badge className={cn("mt-1.5 font-mono text-xs", codeColor.bg, codeColor.text)}>
                        {code.trim().toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <span className="shrink-0 text-gray-500">Description</span>
                      <span className="text-right font-medium text-gray-900">
                        {description.trim() || "—"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">Status</span>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">Class links</span>
                      <span className="font-medium text-gray-900">0 (assign later)</span>
                    </div>
                  </div>

                  <p className="flex items-center gap-1.5 text-xs text-green-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Ready to create
                  </p>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <BookOpen className="mx-auto h-9 w-9 text-gray-300" />
                  <p className="mt-3 text-sm font-medium text-gray-600">No preview yet</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter a name and code to see how this subject will appear.
                  </p>
                </div>
              )}
            </div>
          </section>

          {topAssigned.length > 0 && (
            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
                <h2 className="font-semibold text-gray-900">Most Assigned</h2>
                <p className="mt-0.5 text-sm text-gray-500">Popular subjects in classes</p>
              </div>
              <ul className="divide-y divide-gray-100 p-2">
                {topAssigned.map((subject) => (
                  <li key={subject.id}>
                    <Link
                      href={`/subjects/${subject.id}`}
                      className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-800">{subject.name}</p>
                        <p className="truncate font-mono text-xs text-gray-500">{subject.code}</p>
                      </div>
                      <Badge variant="secondary" className="ml-2 shrink-0 bg-white text-gray-700">
                        {subject.classCount}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

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
                <span>Add the subject with a unique code and optional description.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                  2
                </span>
                <span>Open a class and go to Subjects to link this offering.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                  3
                </span>
                <span>Assign a teacher and schedule for each class subject.</span>
              </li>
            </ul>
            <Link
              href="/classes"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              View classes
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </section>

          <section className="rounded-xl border border-dashed border-teal-200 bg-teal-50/40 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-white p-2 ring-1 ring-teal-100">
                <Layers className="h-4 w-4 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">After creating</p>
                <p className="mt-1 text-xs leading-relaxed text-gray-600">
                  New subjects start as active. They won&apos;t appear in class schedules until you
                  assign them from a class section.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
