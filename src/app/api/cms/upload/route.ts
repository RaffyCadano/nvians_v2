import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  CMS_BUCKET,
  getCmsImageStoragePath,
  validateCoverImageFile,
} from "@/lib/cms-storage";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "staff"].includes(profile.role)) {
    return NextResponse.json({ error: "You do not have permission to upload CMS media." }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folderValue = formData.get("folder");
  const folder = folderValue === "events" ? "events" : "news";

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No image file provided." }, { status: 400 });
  }

  const validationError = validateCoverImageFile(file);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const admin = createAdminClient();
  const path = getCmsImageStoragePath(folder, file.name);
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await admin.storage.from(CMS_BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = admin.storage.from(CMS_BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
