import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";

export default async function StudentGradesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("user_id", user?.id)
    .single();

  const { data: scores } = await supabase
    .from("grade_scores")
    .select(
      "*, grade_item:grade_items(name, max_score, category:grade_categories(name, weight, class_subject:class_subjects(subject:subjects(name), class:classes(grade_level, section), term:terms(name))))"
    )
    .eq("student_id", student?.id);

  // Group by class_subject
  const bySubject: Record<string, any> = {};
  (scores ?? []).forEach((score: any) => {
    const cs = score.grade_item?.category?.class_subject;
    const key = cs?.subject?.name + "|" + cs?.class?.grade_level + "-" + cs?.class?.section;
    if (!bySubject[key]) {
      bySubject[key] = {
        subject: cs?.subject?.name,
        class: `${cs?.class?.grade_level} - ${cs?.class?.section}`,
        term: cs?.term?.name,
        items: [],
      };
    }
    bySubject[key].items.push(score);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Grades</h1>
        <p className="text-sm text-gray-500 mt-1">View your grade scores per subject.</p>
      </div>

      {Object.keys(bySubject).length > 0 ? (
        Object.values(bySubject).map((group: any) => (
          <Card key={group.subject + group.class}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{group.subject}</CardTitle>
                <Badge variant="secondary">{group.term}</Badge>
              </div>
              <p className="text-xs text-gray-500">{group.class}</p>
            </CardHeader>
            <CardContent>
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="py-2 text-left font-medium text-gray-600">Item</th>
                    <th className="py-2 text-left font-medium text-gray-600">Category</th>
                    <th className="py-2 text-right font-medium text-gray-600">Score</th>
                    <th className="py-2 text-right font-medium text-gray-600">Max</th>
                    <th className="py-2 text-right font-medium text-gray-600">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {group.items.map((score: any) => {
                    const pct = ((score.score / score.grade_item?.max_score) * 100).toFixed(1);
                    return (
                      <tr key={score.id}>
                        <td className="py-2 text-gray-800">{score.grade_item?.name}</td>
                        <td className="py-2 text-gray-500">{score.grade_item?.category?.name}</td>
                        <td className="py-2 text-right font-medium">{score.score}</td>
                        <td className="py-2 text-right text-gray-500">{score.grade_item?.max_score}</td>
                        <td className={`py-2 text-right font-semibold ${Number(pct) >= 75 ? "text-green-600" : "text-red-600"}`}>
                          {pct}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No grades posted yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
