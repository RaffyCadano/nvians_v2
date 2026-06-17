"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createNews(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const isPublished = formData.get("is_published") === "true";

  const { error } = await supabase.from("news").insert({
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    excerpt: (formData.get("excerpt") as string) || null,
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

  const { error } = await supabase.from("news").update({
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    excerpt: (formData.get("excerpt") as string) || null,
    is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
  }).eq("id", id);

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
