import { loadStudentGrades } from "@/lib/student/grades-data";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";

export default async function StudentGradesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const groups = user?.id ? await loadStudentGrades(user.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Grades</h1>
        <p className="text-sm text-gray-500 mt-1">View your grade scores per subject.</p>
      </div>

      {groups.length > 0 ? (
        groups.map((group) => (
          <Card key={group.key}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{group.subject}</CardTitle>
                {group.term && <Badge variant="secondary">{group.term}</Badge>}
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
                  {group.items.map((score) => {
                    const pct =
                      score.maxScore > 0
                        ? ((score.score / score.maxScore) * 100).toFixed(1)
                        : "—";
                    return (
                      <tr key={score.id}>
                        <td className="py-2 text-gray-800">{score.itemName}</td>
                        <td className="py-2 text-gray-500">{score.categoryName}</td>
                        <td className="py-2 text-right font-medium">{score.score}</td>
                        <td className="py-2 text-right text-gray-500">{score.maxScore}</td>
                        <td
                          className={`py-2 text-right font-semibold ${
                            pct !== "—" && Number(pct) >= 75
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {pct === "—" ? "—" : `${pct}%`}
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
            <p className="text-xs text-gray-400 mt-2">
              Scores appear here after your teacher enters them for your class.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
