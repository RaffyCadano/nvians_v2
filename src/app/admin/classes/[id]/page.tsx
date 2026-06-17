import { createAdminClient } from "@/lib/supabase/admin";
import ClassEditForm from "./edit-form";
import Link from "next/link";

export default async function ClassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [{ data: classData, error: classError }, { data: schoolYears, error: schoolYearError }, { data: teachers, error: teacherError }] = await Promise.all([
    supabase
      .from("classes")
      .select("*, school_year:school_years(id, name), advisor:teachers(id, user:users(id, full_name))")
      .eq("id", id)
      .single(),
    supabase.from("school_years").select("id, name").order("name"),
    supabase.from("teachers").select("id, user:users(id, full_name)").order("id"),
  ]);

  if (classError || !classData) {
    return (
      <div className="max-w-2xl space-y-4">
        <p className="text-red-600">Class not found.</p>
        <Link href="/classes" className="text-sm text-blue-600 hover:underline">
          ← Back to Classes
        </Link>
      </div>
    );
  }

  if (schoolYearError || teacherError) {
    return (
      <div className="max-w-2xl space-y-4">
        <p className="text-red-600">Failed to load class data.</p>
        <Link href="/classes" className="text-sm text-blue-600 hover:underline">
          ← Back to Classes
        </Link>
      </div>
    );
  }

  return <ClassEditForm classData={classData} schoolYears={schoolYears ?? []} teachers={teachers ?? []} />;
}
