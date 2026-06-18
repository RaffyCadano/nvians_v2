"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createNews(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const isPublished = formData.get("is_published") === "true";
  const coverImage = (formData.get("cover_image") as string) || null;

  const admin = createAdminClient();
  const { error } = await admin.from("news").insert({
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    excerpt: (formData.get("excerpt") as string) || null,
    cover_image: coverImage,
    is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
    published_by: isPublished ? user.id : null,
    author_id: user.id,
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function updateNews(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const isPublished = formData.get("is_published") === "true";
  const coverImage = (formData.get("cover_image") as string) || null;
  const removeCover = formData.get("remove_cover_image") === "true";
  const wasPublished = formData.get("was_published") === "true";

  const updates: Record<string, unknown> = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    excerpt: (formData.get("excerpt") as string) || null,
    is_published: isPublished,
    updated_at: new Date().toISOString(),
  };

  if (isPublished && !wasPublished) {
    updates.published_at = new Date().toISOString();
    updates.published_by = user.id;
  } else if (!isPublished) {
    updates.published_at = null;
    updates.published_by = null;
  }

  if (removeCover) {
    updates.cover_image = null;
  } else if (coverImage) {
    updates.cover_image = coverImage;
  }

  const admin = createAdminClient();
  const { error } = await admin.from("news").update(updates).eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}

function extractCmsStoragePath(url: string) {
  const marker = "/storage/v1/object/public/cms/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}

export async function deleteNews(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const admin = createAdminClient();
  const { data: article, error: fetchError } = await admin
    .from("news")
    .select("id, cover_image")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) return { error: fetchError.message };
  if (!article) return { error: "Article not found." };

  const { error } = await admin.from("news").delete().eq("id", id);
  if (error) return { error: error.message };

  if (article.cover_image) {
    const path = extractCmsStoragePath(article.cover_image);
    if (path) {
      await admin.storage.from("cms").remove([path]);
    }
  }

  return { success: true };
}

export async function createEvent(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const admin = createAdminClient();
  const coverImage = (formData.get("cover_image") as string) || null;
  const { error } = await admin.from("events").insert({
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    start_date: formData.get("start_date") as string,
    end_date: (formData.get("end_date") as string) || null,
    location: (formData.get("location") as string) || null,
    cover_image: coverImage,
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function updateEvent(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const admin = createAdminClient();
  const coverImage = (formData.get("cover_image") as string) || null;
  const removeCover = formData.get("remove_cover_image") === "true";
  const updates: Record<string, unknown> = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || null,
    start_date: formData.get("start_date") as string,
    end_date: (formData.get("end_date") as string) || null,
    location: (formData.get("location") as string) || null,
  };

  if (removeCover) {
    updates.cover_image = null;
  } else if (coverImage) {
    updates.cover_image = coverImage;
  }

  const { error } = await admin.from("events").update(updates).eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}
