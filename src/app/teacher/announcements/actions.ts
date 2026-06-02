"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createAnnouncement(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const audience = formData.get("audience") as string;

  if (!title || !content) {
    return { error: "Title and content are required." };
  }

  const payload: {
    author_id: string;
    title: string;
    content: string;
    class_id?: string;
    class_subject_id?: string;
  } = {
    author_id: user.id,
    title,
    content,
  };

  if (audience === "advisory") {
    const classId = formData.get("class_id") as string;
    if (!classId) {
      return { error: "No advisory class selected." };
    }
    payload.class_id = classId;
  } else if (audience === "subject") {
    const classSubjectId = formData.get("class_subject_id") as string;
    if (!classSubjectId) {
      return { error: "Select a subject class." };
    }
    payload.class_subject_id = classSubjectId;
  }

  const { error } = await supabase.from("announcements").insert(payload);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/teacher/announcements");
  return { success: true };
}
