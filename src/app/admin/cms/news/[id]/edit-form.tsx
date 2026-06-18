"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateNews } from "../../actions";
import { DeleteNewsButton } from "../../delete-news-button";
import {
  ALLOWED_IMAGE_TYPES,
  validateCoverImageFile,
} from "@/lib/cms-storage";
import {
  AlertTriangle,
  ArrowLeft,
  FileText,
  Globe,
  ImagePlus,
  Newspaper,
  Pencil,
  Sparkles,
  Trash2,
  Upload,
  User,
} from "lucide-react";

const EXCERPT_MAX = 160;

type NewsArticle = {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  is_published: boolean;
  published_at: string | null;
  publisher_name: string | null;
};

function buildFormData(
  title: string,
  excerpt: string,
  content: string,
  isPublished: boolean,
  wasPublished: boolean,
  coverImageUrl: string | null,
  removeCover: boolean,
) {
  const formData = new FormData();
  formData.set("title", title.trim());
  formData.set("excerpt", excerpt.trim());
  formData.set("content", content.trim());
  if (isPublished) formData.set("is_published", "true");
  if (wasPublished) formData.set("was_published", "true");
  if (removeCover) formData.set("remove_cover_image", "true");
  if (coverImageUrl) formData.set("cover_image", coverImageUrl);
  return formData;
}

async function uploadCoverImage(file: File) {
  const validationError = validateCoverImageFile(file);
  if (validationError) {
    return { error: validationError };
  }

  const formData = new FormData();
  formData.set("file", file);

  const response = await fetch("/api/cms/upload", {
    method: "POST",
    body: formData,
  });

  const payload = (await response.json()) as { url?: string; error?: string };
  if (!response.ok) {
    return { error: payload.error ?? "Failed to upload cover image." };
  }

  return { url: payload.url };
}

export default function EditNewsForm({
  article,
  currentUserName,
}: {
  article: NewsArticle;
  currentUserName: string | null;
}) {
  const [wasPublished, setWasPublished] = useState(article.is_published);
  const [publisherName, setPublisherName] = useState(article.publisher_name);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [title, setTitle] = useState(article.title);
  const [excerpt, setExcerpt] = useState(article.excerpt ?? "");
  const [content, setContent] = useState(article.content);
  const [isPublished, setIsPublished] = useState(article.is_published);
  const [existingCoverUrl, setExistingCoverUrl] = useState(article.cover_image);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(article.cover_image);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewReady = Boolean(title.trim() && content.trim());
  const wordCount = useMemo(
    () => (content.trim() ? content.trim().split(/\s+/).length : 0),
    [content],
  );
  const excerptCount = excerpt.length;
  const isNewlyPublishing = isPublished && !wasPublished;
  const submitLabel = saving
    ? isNewlyPublishing
      ? "Publishing…"
      : "Saving…"
    : isPublished
      ? wasPublished
        ? "Save Changes"
        : "Publish Article"
      : "Save Draft";

  useEffect(() => {
    return () => {
      if (coverPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [coverPreview]);

  function handleImageSelect(file: File | null) {
    if (!file) return;

    const validationError = validateCoverImageFile(file);
    if (validationError) {
      setImageError(validationError);
      return;
    }

    setImageError("");
    setCoverImage(file);
    setCoverPreview((current) => {
      if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
  }

  function handleImageInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    handleImageSelect(file);
  }

  function removeCoverImage() {
    setCoverImage(null);
    setExistingCoverUrl(null);
    setImageError("");
    setCoverPreview((current) => {
      if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
      return null;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function saveArticle(publish: boolean) {
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      let coverImageUrl: string | null = null;

      if (coverImage) {
        const upload = await uploadCoverImage(coverImage);
        if (upload.error) {
          setError(upload.error);
          return;
        }
        coverImageUrl = upload.url ?? null;
      } else if (existingCoverUrl) {
        coverImageUrl = existingCoverUrl;
      }

      const removeCover = !coverImageUrl && !coverPreview;
      const result = await updateNews(
        article.id,
        buildFormData(
          title,
          excerpt,
          content,
          publish,
          wasPublished,
          coverImageUrl,
          removeCover,
        ),
      );

      if (result?.error) {
        setError(result.error);
        return;
      }

      setConfirmOpen(false);
      if (coverImageUrl) {
        setExistingCoverUrl(coverImageUrl);
        setCoverPreview(coverImageUrl);
        setCoverImage(null);
      } else if (removeCover) {
        setExistingCoverUrl(null);
      }
      if (publish) {
        setWasPublished(true);
        if (currentUserName) {
          setPublisherName(currentUserName);
        }
      } else {
        setWasPublished(false);
        setPublisherName(null);
      }
      setSaved(true);
    } catch {
      setError(
        publish && isNewlyPublishing
          ? "Failed to publish article. Please try again."
          : "Failed to save article. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }
    if (imageError) {
      setError(imageError);
      return;
    }
    setError("");

    if (isNewlyPublishing) {
      setConfirmOpen(true);
      return;
    }

    await saveArticle(isPublished);
  }

  async function handleConfirmPublish() {
    await saveArticle(true);
  }

  function handleConfirmOpenChange(open: boolean) {
    if (saving) return;
    setConfirmOpen(open);
    if (!open) setError("");
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-rose-900 to-pink-800 px-6 py-6 text-white sm:px-8 sm:py-7">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-2 mb-4 text-rose-200 hover:bg-white/10 hover:text-white"
        >
          <Link href="/cms">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to CMS
          </Link>
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-yellow-400 uppercase sm:text-sm">
              Public Website
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Edit Article</h1>
            <p className="mt-2 max-w-xl text-sm text-rose-100">
              Update this news article, change its cover image, or publish it when ready.
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <Pencil className="h-6 w-6 text-yellow-400" />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <section className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
            <h2 className="font-semibold text-gray-900">Article Details</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Title and content are required. Add an optional cover image and excerpt for listings.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
                  1
                </span>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
                  2
                </span>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Label htmlFor="cover_image">Cover Image</Label>
                  <input
                    ref={fileInputRef}
                    id="cover_image"
                    name="cover_image"
                    type="file"
                    accept={Array.from(ALLOWED_IMAGE_TYPES).join(",")}
                    className="sr-only"
                    onChange={handleImageInputChange}
                  />

                  {coverPreview ? (
                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                      <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                        <Image
                          src={coverPreview}
                          alt="Cover preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {coverImage?.name ?? "Current cover image"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {coverImage
                              ? `${(coverImage.size / 1024 / 1024).toFixed(2)} MB`
                              : "Uploaded image"}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Replace
                          </Button>
                          <Button type="button" variant="outline" size="sm" onClick={removeCoverImage}>
                            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full max-w-md items-center gap-3 rounded-xl border-2 border-dashed border-rose-200 bg-rose-50/40 px-4 py-4 text-left transition-colors hover:border-rose-300 hover:bg-rose-50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-100">
                        <ImagePlus className="h-5 w-5 text-rose-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900">Upload cover image</p>
                        <p className="text-xs text-gray-500">JPEG, PNG, WebP, or GIF up to 5 MB</p>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700">
                        <Upload className="h-3.5 w-3.5" />
                        Choose
                      </span>
                    </button>
                  )}

                  {imageError && (
                    <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                      {imageError}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
                  3
                </span>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <span
                      className={`text-xs ${
                        excerptCount > EXCERPT_MAX ? "text-amber-600" : "text-gray-400"
                      }`}
                    >
                      {excerptCount}/{EXCERPT_MAX}
                    </span>
                  </div>
                  <Input
                    id="excerpt"
                    name="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    maxLength={EXCERPT_MAX + 40}
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
                  4
                </span>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="content">Content</Label>
                    <span className="text-xs text-gray-400">
                      {wordCount} word{wordCount === 1 ? "" : "s"}
                    </span>
                  </div>
                  <Textarea
                    id="content"
                    name="content"
                    rows={12}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[240px] resize-y"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
                  5
                </span>
                <div className="min-w-0 flex-1">
                  <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4">
                    <label htmlFor="is_published" className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        id="is_published"
                        name="is_published"
                        value="true"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {wasPublished ? "Published on website" : "Publish on website"}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-gray-600">
                          {isPublished
                            ? wasPublished
                              ? "This article is live on the public news page."
                              : "This article will go live on the public news page after saving."
                            : "Keep as draft until you are ready to publish."}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {saved && !error && (
                <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-700">
                  Changes saved successfully.
                </p>
              )}

              {error && !confirmOpen && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button type="submit" className="sm:min-w-[160px]" disabled={saving}>
                    {submitLabel}
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/cms">Cancel</Link>
                  </Button>
                </div>
                <DeleteNewsButton
                  articleId={article.id}
                  articleTitle={title.trim() || article.title}
                  isPublished={wasPublished}
                />
              </div>
            </form>
          </div>
        </section>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-7">
          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4">
              <h2 className="font-semibold text-gray-900">Preview</h2>
              <p className="mt-0.5 text-sm text-gray-500">How it may appear on the site</p>
            </div>
            <div className="p-5">
              {previewReady ? (
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                    {coverPreview ? (
                      <div className="relative h-28 bg-gray-100">
                        <Image
                          src={coverPreview}
                          alt="Article cover preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-28 items-center justify-center bg-gradient-to-br from-rose-100 to-pink-50">
                        <Newspaper className="h-10 w-10 text-rose-300" />
                      </div>
                    )}
                    <div className="space-y-3 p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {isPublished ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            Published
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">
                            Draft
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {article.published_at
                            ? format(new Date(article.published_at), "MMM d, yyyy")
                            : format(new Date(), "MMM d, yyyy")}
                        </span>
                        {isPublished && publisherName && (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                            <User className="h-3 w-3" />
                            {publisherName}
                          </span>
                        )}
                      </div>
                      <p className="line-clamp-2 font-semibold text-gray-900">{title.trim()}</p>
                      <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
                        {excerpt.trim() || content.trim().slice(0, 160)}
                        {!excerpt.trim() && content.trim().length > 160 ? "…" : ""}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <FileText className="mx-auto h-9 w-9 text-gray-300" />
                  <p className="mt-3 text-sm font-medium text-gray-600">No preview yet</p>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="rounded-lg bg-rose-50 p-2">
                <Sparkles className="h-4 w-4 text-rose-600" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Quick Guide</h2>
            </div>
            {wasPublished && publisherName && (
              <div className="mb-4 rounded-lg border border-gray-100 bg-gray-50/80 px-3.5 py-3 text-sm">
                <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                  Published by
                </p>
                <p className="mt-1 inline-flex items-center gap-1.5 font-medium text-gray-900">
                  <User className="h-3.5 w-3.5 text-rose-600" />
                  {publisherName}
                </p>
              </div>
            )}
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
                  1
                </span>
                <span>Update the headline and content as needed.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
                  2
                </span>
                <span>Replace or remove the cover image from the upload area.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
                  3
                </span>
                <span>Check publish when you want the article live on the public site.</span>
              </li>
            </ul>
          </section>
        </aside>
      </div>

      <Dialog open={confirmOpen} onOpenChange={handleConfirmOpenChange}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
          <div className="border-b border-green-100 bg-gradient-to-r from-green-950 via-emerald-900 to-teal-900 px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/15 ring-1 ring-green-400/25">
                <Globe className="h-5 w-5 text-green-300" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-white">
                  Publish article?
                </DialogTitle>
                <p className="mt-0.5 text-xs text-green-200/80">
                  Confirm before making this article live on the public website
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            {coverPreview && (
              <div className="relative mb-4 h-24 w-full max-w-xs overflow-hidden rounded-xl border border-gray-100 bg-gray-100">
                <Image
                  src={coverPreview}
                  alt="Article cover"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            )}

            <DialogDescription className="text-sm leading-relaxed text-gray-600">
              <span className="font-medium text-gray-900">{title.trim()}</span> will appear on the
              public news page immediately after you confirm.
            </DialogDescription>

            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-sm text-amber-900">
              <p className="flex items-center gap-2 font-medium">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                This article will be visible to everyone
              </p>
            </div>

            {error && (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          <DialogFooter className="!m-0 gap-2.5 border-t border-gray-100 bg-gray-50/80 px-6 py-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleConfirmOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmPublish}
              disabled={saving}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {saving ? "Publishing…" : "Publish Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
