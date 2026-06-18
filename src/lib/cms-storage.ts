export const CMS_BUCKET = "cms";
export const MAX_COVER_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function validateCoverImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Cover image must be JPEG, PNG, WebP, or GIF.";
  }
  if (file.size > MAX_COVER_IMAGE_BYTES) {
    return "Cover image must be 5 MB or smaller.";
  }
  return null;
}

export function getCmsImageStoragePath(folder: "news" | "events", fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
  return `${folder}/${crypto.randomUUID()}.${safeExt}`;
}

export function getCoverImageStoragePath(fileName: string) {
  return getCmsImageStoragePath("news", fileName);
}
