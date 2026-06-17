import { createAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChart3, ChevronRight } from "lucide-react";

function relationOne<T>(value: T | T[] | null | undefined): T | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminGradesPage({
  searchParams,
}: {
  searchParams: Promise<{ class_subject?: string }>;
}) {
  const { class_subject } = await searchParams;
  const supabase = createAdminClient();

  const [{ data: classSubjects }, { data: scores }] = await Promise.all([
    supabase
      .from("class_subjects")
      .select(
        "id, subject:subjects(name), class:classes(grade_level, section), term:terms(name), teacher:teachers(user:users(full_name))"
      )
      .order("created_at"),
    class_subject
      ? supabase
          .from("grade_scores")
          .select(
            "*, grade_item:grade_items(name, max_score, category:grade_categories(name, weight, class_subject_id)), student:students(student_number, user:users(full_name))"
          )
          .eq("grade_items.grade_categories.class_subject_id", class_subject)
      : Promise.resolve({ data: [] }),
  ]);

  const selected = classSubjects?.find((cs: any) => cs.id === class_subject);

  // Group scores by student
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Grades</h1>
        <p className="text-sm text-gray-500 mt-1">View grade records by class subject.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(classSubjects ?? []).map((cs) => {
          const subject = relationOne(cs.subject);
          const cls = relationOne(cs.class);
          const term = relationOne(cs.term);
          const teacher = relationOne(cs.teacher);
          const teacherUser = relationOne(teacher?.user);
          return (
          <Card
            key={cs.id}
            className={`cursor-pointer transition-shadow hover:shadow-md ${class_subject === cs.id ? "ring-2 ring-blue-500" : ""}`}
          >
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <p className="font-semibold text-gray-900">{subject?.name}</p>
                <p className="text-sm text-gray-500">
                  {cls?.grade_level} - {cls?.section}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{term?.name} · {teacherUser?.full_name}</p>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/grades?class_subject=${cs.id}`}>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        );
        })}
        {(!classSubjects || classSubjects.length === 0) && (
          <div className="col-span-3 py-16 text-center text-gray-500">
            <BarChart3 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            No class subjects found. Assign subjects to classes first.
          </div>
        )}
      </div>

      {class_subject && selected && (() => {
        const subject = relationOne(selected.subject);
        const cls = relationOne(selected.class);
        return (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {subject?.name} — {cls?.grade_level} {cls?.section}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Student</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Student No.</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Items Scored</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {Object.values(byStudent).length > 0 ? (
                  Object.values(byStudent).map((st: any) => (
                    <tr key={st.studentNumber} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{st.name}</td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">{st.studentNumber ?? "—"}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{st.scores.length}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                      No scores recorded yet for this subject.
                    </td>
                  </tr>
                )}
              </tbody>
            </table></div>
          </CardContent>
        </Card>
        );
      })()}
    </div>
  );
}
