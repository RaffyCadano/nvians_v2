import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock } from "lucide-react";

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function StudentSchedulePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get student record
  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("user_id", user!.id)
    .single();

  // Get active enrollment
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("class_id, school_year:school_years(name)")
    .eq("student_id", student?.id ?? "")
    .eq("status", "enrolled")
    .order("enrolled_at", { ascending: false })
    .limit(1)
    .single();

  // Get class subjects with schedule info
  const { data: classSubjects } = enrollment
    ? await supabase
        .from("class_subjects")
        .select(`
          id,
          schedule,
          subject:subjects(name, code),
          teacher:teachers(user:users(full_name))
        `)
        .eq("class_id", enrollment.class_id)
    : { data: [] };

  // Parse schedule strings like "Monday 07:30-08:30"
  type ScheduleEntry = {
    day: string;
    time: string;
    subjectName: string;
    subjectCode: string;
    teacherName: string;
  };

  const scheduleByDay: Record<string, ScheduleEntry[]> = {};

  for (const cs of classSubjects ?? []) {
    if (!cs.schedule) continue;
    const parts = cs.schedule.split(" ");
    const day = parts[0];
    const time = parts.slice(1).join(" ");
    if (!scheduleByDay[day]) scheduleByDay[day] = [];
    scheduleByDay[day].push({
      day,
      time,
      subjectName: (cs.subject as any)?.name ?? "—",
      subjectCode: (cs.subject as any)?.code ?? "",
      teacherName: (cs.teacher as any)?.user?.full_name ?? "—",
    });
  }

  // Sort each day's entries by time
  for (const day of Object.keys(scheduleByDay)) {
    scheduleByDay[day].sort((a, b) => a.time.localeCompare(b.time));
  }

  const activeDays = DAY_ORDER.filter((d) => scheduleByDay[d]?.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
        <p className="text-sm text-gray-500 mt-1">
          {(enrollment as any)?.school_year?.name
            ? `School Year: ${(enrollment as any).school_year.name}`
            : "Your weekly class schedule"}
        </p>
      </div>

      {activeDays.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-gray-500">
            <BookOpen className="h-10 w-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No schedule available</p>
            <p className="text-sm mt-1">Your class subjects have no schedule assigned yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {activeDays.map((day) => (
            <Card key={day}>
              <CardContent className="p-0">
                <div className="flex items-center gap-2 px-4 py-3 border-b bg-gray-50 rounded-t-xl">
                  <span className="font-semibold text-gray-800">{day}</span>
                  <Badge variant="secondary" className="text-xs">
                    {scheduleByDay[day].length} {scheduleByDay[day].length === 1 ? "class" : "classes"}
                  </Badge>
                </div>
                <div className="divide-y">
                  {scheduleByDay[day].map((entry, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 w-32 shrink-0">
                        <Clock className="h-3.5 w-3.5" />
                        {entry.time || "—"}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{entry.subjectName}</p>
                        <p className="text-xs text-gray-500">{entry.teacherName}</p>
                      </div>
                      {entry.subjectCode && (
                        <Badge variant="outline" className="text-xs">{entry.subjectCode}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
