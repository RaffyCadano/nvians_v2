import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone } from "lucide-react";
import { format } from "date-fns";
import { AnnouncementForm } from "./announcement-form";

/** Supabase embed types may be T or T[]; runtime is a single object for many-to-one joins. */
function relationOne<T>(value: T | T[] | null | undefined): T | undefined {
  if (value == null) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export default async function TeacherAnnouncementsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: teacher } = await supabase
    .from("teachers")
    .select("id")
    .eq("user_id", user?.id ?? "")
    .single();

  const [{ data: advisoryClasses }, { data: classSubjects }] = await Promise.all([
    supabase
      .from("classes")
      .select("id, grade_level, section")
      .eq("advisor_id", teacher?.id ?? "")
      .eq("status", "active"),
    supabase
      .from("class_subjects")
      .select("id, subject:subjects(name), class:classes(grade_level, section)")
      .eq("teacher_id", teacher?.id ?? ""),
  ]);

  const advisoryIds = (advisoryClasses ?? []).map((c) => c.id);
  const subjectIds = (classSubjects ?? []).map((cs) => cs.id);

  const orFilters = [`author_id.eq.${user?.id}`];
  if (advisoryIds.length > 0) {
    orFilters.push(`class_id.in.(${advisoryIds.join(",")})`);
  }
  if (subjectIds.length > 0) {
    orFilters.push(`class_subject_id.in.(${subjectIds.join(",")})`);
  }

  const { data: announcements } = await supabase
    .from("announcements")
    .select(
      `
      id,
      title,
      content,
      created_at,
      class_id,
      class_subject_id,
      author:users(full_name),
      class:classes(grade_level, section),
      class_subject:class_subjects(subject:subjects(name), class:classes(grade_level, section))
    `
    )
    .or(orFilters.join(","))
    .order("created_at", { ascending: false });

  const advisoryOptions = (advisoryClasses ?? []).map((c) => ({
    id: c.id,
    label: `${c.grade_level} — ${c.section}`,
  }));

  const subjectOptions = (classSubjects ?? []).map((cs) => {
    const subject = relationOne(cs.subject);
    const cls = relationOne(cs.class);
    return {
      id: cs.id,
      label: `${subject?.name ?? "Subject"} · ${cls?.grade_level}-${cls?.section}`,
    };
  });

  function audienceLabel(a: {
    class_id?: string | null;
    class_subject_id?: string | null;
  }) {
    if (a.class_subject_id) return "Subject class";
    if (a.class_id) return "Advisory";
    return "School-wide";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        <p className="text-sm text-gray-500 mt-1">
          Post updates for your advisory class, subjects, or the whole school.
        </p>
      </div>

      <AnnouncementForm
        advisoryClasses={advisoryOptions}
        classSubjects={subjectOptions}
      />

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Recent announcements</h2>
        {(announcements ?? []).length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <Megaphone className="h-10 w-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No announcements yet</p>
              <p className="text-sm mt-1">Post your first announcement above.</p>
            </CardContent>
          </Card>
        ) : (
          (announcements ?? []).map((a) => {
            const author = relationOne(a.author);
            const advisoryClass = relationOne(a.class);
            const classSubject = relationOne(a.class_subject);
            const subject = relationOne(classSubject?.subject);
            const subjectClass = relationOne(classSubject?.class);

            return (
              <Card key={a.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{a.title}</h3>
                        <Badge
                          variant="secondary"
                          className={
                            a.class_subject_id
                              ? "bg-green-100 text-green-700"
                              : a.class_id
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600"
                          }
                        >
                          {audienceLabel(a)}
                        </Badge>
                      </div>
                      {(advisoryClass || classSubject) && (
                        <p className="text-xs text-gray-500 mb-1">
                          {classSubject
                            ? `${subject?.name} · ${subjectClass?.grade_level}-${subjectClass?.section}`
                            : `${advisoryClass?.grade_level} — ${advisoryClass?.section}`}
                        </p>
                      )}
                      <p className="text-sm text-gray-700 whitespace-pre-line">{a.content}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Posted by {author?.full_name ?? "You"} ·{" "}
                        {format(new Date(a.created_at), "MMM d, yyyy h:mm a")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
