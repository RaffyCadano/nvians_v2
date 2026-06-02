import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChart3, Plus } from "lucide-react";

export default async function TeacherGradesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: classSubjects } = await supabase
    .from("class_subjects")
    .select("*, subject:subjects(name), class:classes(grade_level, section), term:terms(name), teacher:teachers!inner(user_id)")
    .eq("teachers.user_id", user?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Grades</h1>
        <p className="text-sm text-gray-500 mt-1">Manage grade categories, items, and student scores.</p>
      </div>

      <div className="grid gap-4">
        {classSubjects && classSubjects.length > 0 ? (
          classSubjects.map((cs: any) => (
            <Card key={cs.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-semibold text-gray-900">{cs.subject?.name}</p>
                  <p className="text-sm text-gray-500">
                    {cs.class?.grade_level} - {cs.class?.section} · {cs.term?.name}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/teacher/grades/${cs.id}/categories`}>
                      <Plus className="mr-1.5 h-3.5 w-3.5" /> Grade Categories
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href={`/teacher/grades/${cs.id}/scores`}>
                      <BarChart3 className="mr-1.5 h-3.5 w-3.5" /> Enter Scores
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No subjects assigned yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
