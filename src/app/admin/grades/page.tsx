import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { StatsLineChart } from "@/components/admin/stats-line-chart";
import { buildMonthlyTrend } from "@/lib/trend-utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3 } from "lucide-react";

function relationOne<T>(value: T | T[] | null | undefined): T | undefined {  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminGradesPage({
  searchParams,
}: {
  searchParams: Promise<{ class_subject?: string }>;
}) {
  const { class_subject } = await searchParams;
  const supabase = createAdminClient();

  const [{ data: classSubjects }, { data: scores }, { data: allScores }, { data: gradeCategories }] =
    await Promise.all([
      supabase
        .from("class_subjects")
        .select(
          "id, created_at, subject:subjects(name), class:classes(grade_level, section), term:terms(name), teacher:teachers(user:users(full_name))",
        )
        .order("created_at"),
      class_subject
        ? supabase
            .from("grade_scores")
            .select(
              "*, grade_item:grade_items(name, max_score, category:grade_categories(name, weight, class_subject_id)), student:students(student_number, user:users(full_name))",
            )
            .eq("grade_items.grade_categories.class_subject_id", class_subject)
        : Promise.resolve({ data: [] }),
      supabase.from("grade_scores").select("id, student_id, created_at"),
      supabase.from("grade_categories").select("id, class_subject_id, created_at"),
    ]);

  const subjects = classSubjects ?? [];
  const selected = subjects.find((cs: any) => cs.id === class_subject);
  const scoreRows = allScores ?? [];
  const categoryRows = gradeCategories ?? [];

  const firstGradeOpenBySubject = categoryRows.reduce<Record<string, string>>((acc, category) => {
    const existing = acc[category.class_subject_id];
    if (!existing || category.created_at < existing) {
      acc[category.class_subject_id] = category.created_at;
    }
    return acc;
  }, {});

  const firstScoreByStudent = scoreRows.reduce<Record<string, string>>((acc, score) => {
    const existing = acc[score.student_id];
    if (!existing || score.created_at < existing) {
      acc[score.student_id] = score.created_at;
    }
    return acc;
  }, {});

  const classSubjectDates = subjects
    .map((subject) => subject.created_at)
    .filter(Boolean) as string[];
  const gradesOpenDates = Object.values(firstGradeOpenBySubject);
  const studentsScoredDates = Object.values(firstScoreByStudent);
  const gradeItemDates = scoreRows.map((score) => score.created_at).filter(Boolean) as string[];

  const trendSeries = [
    {
      title: "Class Subjects",
      stroke: "#7c3aed",
      color: "text-violet-600",
      bg: "bg-violet-50",
      current: subjects.length,
      data: buildMonthlyTrend(classSubjectDates),
    },
    {
      title: "With Grades Open",
      stroke: "#2563eb",
      color: "text-blue-600",
      bg: "bg-blue-50",
      current: gradesOpenDates.length,
      data: buildMonthlyTrend(gradesOpenDates),
    },
    {
      title: "Students Scored",
      stroke: "#16a34a",
      color: "text-green-600",
      bg: "bg-green-50",
      current: studentsScoredDates.length,
      data: buildMonthlyTrend(studentsScoredDates),
    },
    {
      title: "Grade Items",
      stroke: "#d97706",
      color: "text-amber-600",
      bg: "bg-amber-50",
      current: scoreRows.length,
      data: buildMonthlyTrend(gradeItemDates),
    },
  ];

  const byStudent: Record<string, any> = {};
  (scores ?? []).forEach((s: any) => {
    const key = s.student_id;
    if (!byStudent[key]) {
      byStudent[key] = {
        name: s.student?.user?.full_name,
        studentNumber: s.student?.student_number,
        scores: [],
      };
    }
    byStudent[key].scores.push(s);
  });

  return (    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-violet-900 to-purple-800 px-6 py-6 text-white sm:px-8 sm:py-7">
        <div>
          <p className="text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">Academic Performance</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Grades</h1>
          <p className="mt-2 max-w-xl text-sm text-violet-100">
            Browse grade records by class subject. Select a subject to view student scores and
            grading progress.
          </p>
        </div>
      </section>

      <StatsLineChart series={trendSeries} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="flex min-w-0 flex-col gap-6">
          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
              <h2 className="font-semibold text-gray-900">Class Subjects</h2>
              <p className="mt-0.5 text-sm text-gray-500">Select a subject to view grades</p>
            </div>
            {subjects.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {subjects.map((cs) => {
                  const subject = relationOne(cs.subject);
                  const cls = relationOne(cs.class);
                  const term = relationOne(cs.term);
                  const teacher = relationOne(cs.teacher);
                  const teacherUser = relationOne(teacher?.user);
                  const isSelected = class_subject === cs.id;
                  return (
                    <Link
                      key={cs.id}
                      href={`/grades?class_subject=${cs.id}`}
                      className={`flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-violet-50/40 ${isSelected ? "bg-violet-50/60 ring-1 ring-inset ring-violet-200" : ""}`}
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900">{subject?.name}</p>
                        <p className="text-sm text-gray-500">{cls?.grade_level} — {cls?.section}</p>
                        <p className="mt-1 text-xs text-gray-400">{term?.name} · {teacherUser?.full_name ?? "No teacher"}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-gray-400" />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="px-6 py-16 text-center">
                <BarChart3 className="mx-auto h-10 w-10 text-gray-300" />
                <p className="mt-4 font-medium text-gray-700">No class subjects found</p>
                <p className="mt-1 text-sm text-gray-500">Assign subjects to classes first.</p>
                <Button asChild className="mt-4" variant="outline"><Link href="/classes">Go to Classes</Link></Button>
              </div>
            )}
          </section>

          {class_subject && selected && (() => {
            const subject = relationOne(selected.subject);
            const cls = relationOne(selected.class);
            const studentRows = Object.values(byStudent);
            return (
              <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
                  <h2 className="font-semibold text-gray-900">{subject?.name} — {cls?.grade_level} {cls?.section}</h2>
                  <p className="mt-0.5 text-sm text-gray-500">{studentRows.length} student{studentRows.length === 1 ? "" : "s"} with scores</p>
                </div>
                {studentRows.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {studentRows.map((st: any) => (
                      <div key={st.studentNumber ?? st.name} className="flex items-center justify-between px-5 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{st.name}</p>
                          <p className="text-xs font-mono text-gray-500">{st.studentNumber ?? "—"}</p>
                        </div>
                        <Badge variant="secondary" className="bg-violet-50 text-violet-700">{st.scores.length} items</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center text-sm text-gray-500">No scores recorded yet for this subject.</div>
                )}
              </section>
            );
          })()}
        </div>

        <aside className="rounded-xl border border-gray-200 bg-white p-5 lg:sticky lg:top-7">
          <h2 className="text-base font-bold text-gray-900">Quick Guide</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">1</span>
              <span>Assign subjects to classes with teachers.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">2</span>
              <span>Teachers enter scores per grading category.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">3</span>
              <span>Select a class subject here to review records.</span>
            </li>
          </ul>
          <Link href="/classes" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700">
            Manage class subjects
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
