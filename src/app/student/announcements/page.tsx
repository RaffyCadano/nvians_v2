import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone } from "lucide-react";
import { format } from "date-fns";

export default async function StudentAnnouncementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get student's enrolled class
  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("user_id", user!.id)
    .single();

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("class_id")
    .eq("student_id", student?.id ?? "")
    .eq("status", "enrolled")
    .order("enrolled_at", { ascending: false })
    .limit(1)
    .single();

  // Fetch announcements: school-wide (no class) + class-specific
  const { data: announcements } = await supabase
    .from("announcements")
    .select(`
      id,
      title,
      content,
      created_at,
      class_id,
      author:users(full_name, role)
    `)
    .or(
      enrollment?.class_id
        ? `class_id.is.null,class_id.eq.${enrollment.class_id}`
        : `class_id.is.null`
    )
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        <p className="text-sm text-gray-500 mt-1">School-wide and class announcements.</p>
      </div>

      {(announcements ?? []).length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-gray-500">
            <Megaphone className="h-10 w-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No announcements yet</p>
            <p className="text-sm mt-1">Check back later for updates from your school.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {(announcements ?? []).map((a: any) => (
            <Card key={a.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{a.title}</h3>
                      <Badge
                        variant="secondary"
                        className={a.class_id ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}
                      >
                        {a.class_id ? "Class" : "School-wide"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{a.content}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Posted by {a.author?.full_name ?? "Staff"} · {format(new Date(a.created_at), "MMM d, yyyy h:mm a")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
