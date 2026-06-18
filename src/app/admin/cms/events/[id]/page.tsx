import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import EditEventForm from "./edit-form";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: event, error } = await supabase
    .from("events")
    .select("id, title, description, start_date, end_date, location, cover_image, is_published")
    .eq("id", id)
    .single();

  if (error || !event) {
    notFound();
  }

  return <EditEventForm event={event} />;
}
