"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

const CMS_BUCKET = "cms";
const MAX_COVER_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

async function uploadNewsCoverImage(file: File) {
  if (!(file instanceof File) || file.size === 0) {
    return { url: null as string | null };
  }

  if (file.size > MAX_COVER_IMAGE_BYTES) {
    return { error: "Cover image must be 5 MB or smaller." };
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { error: "Cover image must be JPEG, PNG, WebP, or GIF." };
  }

  const admin = createAdminClient();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
  const path = `news/${crypto.randomUUID()}.${safeExt}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await admin.storage.from(CMS_BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    return { error: error.message };
  }

  const { data } = admin.storage.from(CMS_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function createNews(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublished = formData.get("is_published") === "true";
  const coverFile = formData.get("cover_image");
  let coverImage: string | null = null;

  if (coverFile instanceof File && coverFile.size > 0) {
    const upload = await uploadNewsCoverImage(coverFile);
    if (upload.error) return { error: upload.error };
    coverImage = upload.url;
  }

  const { error } = await supabase.from("news").insert({
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    excerpt: (formData.get("excerpt") as string) || null,
    cover_image: coverImage,
    is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
    author_id: user?.id,
  });

  if (error) return { error: error.message };
  redirect("/cms");
}

export async function updateNews(id: string, formData: FormData) {
  const supabase = await createClient();
  const isPublished = formData.get("is_published") === "true";
  const coverFile = formData.get("cover_image");
  const updates: Record<string, unknown> = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    excerpt: (formData.get("excerpt") as string) || null,
    is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
  };

  if (coverFile instanceof File && coverFile.size > 0) {
    const upload = await uploadNewsCoverImage(coverFile);
    if (upload.error) return { error: upload.error };
    updates.cover_image = upload.url;
  }

  const { error } = await supabase.from("news").update(updates).eq("id", id);

  if (error) return { error: error.message };
  redirect("/cms");
}

export async function createEvent(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("events").insert({
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    start_date: formData.get("start_date") as string,
    end_date: (formData.get("end_date") as string) || null,
    location: (formData.get("location") as string) || null,
  });

  if (error) return { error: error.message };
  redirect("/cms");
}

export async function updateEvent(id: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("events").update({
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    start_date: formData.get("start_date") as string,
    end_date: (formData.get("end_date") as string) || null,
    location: (formData.get("location") as string) || null,
  }).eq("id", id);

  if (error) return { error: error.message };
  redirect("/cms");
}
