import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, BarChart3, ClipboardList, UserCheck } from "lucide-react";

export default async function TeacherSubjectsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: classSubjects } = await supabase
    .from("class_subjects")
    .select(
      "*, subject:subjects(name, code), class:classes(grade_level, section), term:terms(name), teacher:teachers!inner(user_id)"
    )
    .eq("teachers.user_id", user?.id ?? "")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Subjects</h1>
        <p className="text-sm text-gray-500 mt-1">
          Classes and subjects assigned to you this school year.
        </p>
      </div>

      {classSubjects && classSubjects.length > 0 ? (
        <div className="grid gap-4">
          {classSubjects.map((cs: {
            id: string;
            schedule?: string;
            subject?: { name?: string; code?: string };
            class?: { grade_level?: string; section?: string };
            term?: { name?: string };
          }) => (
            <Card key={cs.id}>
              <CardContent className="py-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">{cs.subject?.name}</p>
                      {cs.subject?.code && (
                        <Badge variant="outline" className="text-xs">
                          {cs.subject.code}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {cs.class?.grade_level} — {cs.class?.section} · {cs.term?.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      Schedule: {cs.schedule ?? "Not set"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/teacher/attendance/new">
                        <UserCheck className="mr-1.5 h-3.5 w-3.5" />
                        Attendance
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/teacher/grades/${cs.id}/scores`}>
                        <BarChart3 className="mr-1.5 h-3.5 w-3.5" />
                        Grades
                      </Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href="/teacher/assignments">
                        <ClipboardList className="mr-1.5 h-3.5 w-3.5" />
                        Assignments
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No subjects assigned yet.</p>
            <p className="text-sm text-gray-400 mt-1">
              Subjects appear here once an administrator assigns you to a class.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
