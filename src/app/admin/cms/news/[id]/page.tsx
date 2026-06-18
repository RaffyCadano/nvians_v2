import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { getNewsPublisherName } from "@/lib/cms-news";
import EditNewsForm from "./edit-form";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();
  const auth = await createClient();

  const [
    { data: article, error },
    {
      data: { user },
    },
  ] = await Promise.all([
    supabase
      .from("news")
      .select(
        "id, title, content, excerpt, cover_image, is_published, published_at, author:author_id(full_name), publisher:published_by(full_name)",
      )
      .eq("id", id)
      .single(),
    auth.auth.getUser(),
  ]);

  if (error || !article) {
    notFound();
  }

  let currentUserName: string | null = null;
  if (user) {
    const { data: profile } = await auth
      .from("users")
      .select("full_name")
      .eq("id", user.id)
      .single();
    currentUserName = profile?.full_name ?? null;
  }

  return (
    <EditNewsForm
      article={{
        id: article.id,
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        cover_image: article.cover_image,
        is_published: article.is_published,
        published_at: article.published_at,
        publisher_name: getNewsPublisherName(article),
      }}
      currentUserName={currentUserName}
    />
  );
}
