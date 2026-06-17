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
import { createNews } from "../../actions";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Globe,
  ImagePlus,
  Newspaper,
  Plus,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";

const EXCERPT_MAX = 160;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function buildFormData(
  title: string,
  excerpt: string,
  content: string,
  isPublished: boolean,
  coverImage: File | null,
) {
  const formData = new FormData();
  formData.set("title", title.trim());
  formData.set("excerpt", excerpt.trim());
  formData.set("content", content.trim());
  if (isPublished) formData.set("is_published", "true");
  if (coverImage) formData.set("cover_image", coverImage);
  return formData;
}

function validateCoverImage(file: File) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Cover image must be JPEG, PNG, WebP, or GIF.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Cover image must be 5 MB or smaller.";
  }
  return null;
}

export default function NewNewsPage() {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewReady = Boolean(title.trim() && content.trim());
  const wordCount = useMemo(
    () => (content.trim() ? content.trim().split(/\s+/).length : 0),
    [content],
  );
  const excerptCount = excerpt.length;

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [coverPreview]);

  function handleImageSelect(file: File | null) {
    if (!file) return;

    const validationError = validateCoverImage(file);
    if (validationError) {
      setImageError(validationError);
      return;
    }

    setImageError("");
    setCoverImage(file);
    setCoverPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
  }

  function handleImageInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    handleImageSelect(file);
  }

  function removeCoverImage() {
    setCoverImage(null);
    setImageError("");
    setCoverPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    setConfirmOpen(true);
  }

  async function handleConfirmSave() {
    setSaving(true);
    setError("");

    try {
      const result = await createNews(
        buildFormData(title, excerpt, content, isPublished, coverImage),
      );
      if (result?.error) {
        setError(result.error);
      }
    } catch {
      setError("Failed to save article. Please try again.");
    } finally {
      setSaving(false);
    }
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
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">New Article</h1>
            <p className="mt-2 max-w-xl text-sm text-rose-100">
              Write a news article for the public site. Save as a draft or publish it immediately
              when ready.
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <Plus className="h-6 w-6 text-yellow-400" />
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
                    placeholder="NVI Students Win Regional Science Fair"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Keep it clear and specific — this is the headline visitors see first.
                  </p>
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
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    className="sr-only"
                    onChange={handleImageInputChange}
                  />

                  {coverPreview ? (
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                      <div className="relative aspect-[16/9] w-full bg-gray-100">
                        <Image
                          src={coverPreview}
                          alt="Cover preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-3 border-t border-gray-200 px-4 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {coverImage?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {coverImage
                              ? `${(coverImage.size / 1024 / 1024).toFixed(2)} MB`
                              : ""}
                          </p>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={removeCoverImage}>
                          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-rose-200 bg-rose-50/40 px-6 py-10 text-center transition-colors hover:border-rose-300 hover:bg-rose-50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100">
                        <ImagePlus className="h-6 w-6 text-rose-600" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-gray-900">Upload cover image</p>
                      <p className="mt-1 text-xs text-gray-500">
                        JPEG, PNG, WebP, or GIF up to 5 MB
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700">
                        <Upload className="h-3.5 w-3.5" />
                        Choose file
                      </span>
                    </button>
                  )}

                  {imageError && (
                    <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                      {imageError}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Optional hero image shown at the top of the article card on the news page.
                  </p>
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
                    placeholder="Short summary shown in listings..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    maxLength={EXCERPT_MAX + 40}
                  />
                  <p className="text-xs text-gray-500">
                    Optional teaser for the news grid. Leave blank to use the opening lines of
                    your content.
                  </p>
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
                    placeholder="Write the full article here..."
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
                        <p className="text-sm font-semibold text-gray-900">Publish immediately</p>
                        <p className="mt-1 text-xs leading-relaxed text-gray-600">
                          {isPublished
                            ? "This article will go live on the public news page right after saving."
                            : "Leave unchecked to save as a draft. You can publish it later from the CMS."}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {error && !confirmOpen && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row">
                <Button type="submit" className="sm:min-w-[160px]">
                  {isPublished ? "Publish Article" : "Save Draft"}
                </Button>
                <Button asChild variant="outline">
                  <Link href="/cms">Cancel</Link>
                </Button>
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
                          {format(new Date(), "MMM d, yyyy")}
                        </span>
                      </div>
                      <p className="line-clamp-2 font-semibold text-gray-900">{title.trim()}</p>
                      <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
                        {excerpt.trim() || content.trim().slice(0, 160)}
                        {!excerpt.trim() && content.trim().length > 160 ? "…" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">Status</span>
                      {isPublished ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          Live on site
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">
                          Draft only
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">Length</span>
                      <span className="font-medium text-gray-900">
                        {wordCount} word{wordCount === 1 ? "" : "s"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">Cover image</span>
                      <span className="font-medium text-gray-900">
                        {coverImage ? "Attached" : "None"}
                      </span>
                    </div>
                  </div>

                  <p className="flex items-center gap-1.5 text-xs text-green-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Ready to {isPublished ? "publish" : "save"}
                  </p>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <FileText className="mx-auto h-9 w-9 text-gray-300" />
                  <p className="mt-3 text-sm font-medium text-gray-600">No preview yet</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter a title and content to see how the article will look.
                  </p>
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
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
                  1
                </span>
                <span>Write a clear headline that summarizes the story.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
                  2
                </span>
                <span>Add a cover image to make article cards stand out on the news page.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
                  3
                </span>
                <span>Add an excerpt so listings look polished on the news page.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
                  4
                </span>
                <span>Save as draft to review first, or publish when you are ready.</span>
              </li>
            </ul>
          </section>
        </aside>
      </div>

      <Dialog open={confirmOpen} onOpenChange={handleConfirmOpenChange}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
          <div className="border-b border-rose-100 bg-gradient-to-r from-rose-950 via-rose-900 to-pink-900 px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 ring-1 ring-rose-400/25">
                <Newspaper className="h-5 w-5 text-rose-300" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-white">
                  {isPublished ? "Publish article?" : "Save draft?"}
                </DialogTitle>
                <p className="mt-0.5 text-xs text-rose-200/80">
                  Review the details before {isPublished ? "publishing" : "saving"}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-100">
                <Newspaper className="h-5 w-5 text-rose-700" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{title.trim()}</p>
                <p className="truncate text-xs text-gray-500">
                  {wordCount} word{wordCount === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <DialogDescription className="mt-4 text-sm leading-relaxed text-gray-600">
              {isPublished ? (
                <>
                  <span className="font-medium text-gray-900">{title.trim()}</span> will be
                  published on the public news page immediately.
                </>
              ) : (
                <>
                  <span className="font-medium text-gray-900">{title.trim()}</span> will be saved
                  as a draft. You can publish it later from the CMS.
                </>
              )}
            </DialogDescription>

            <div className="mt-4 space-y-2 rounded-xl border border-gray-100 bg-gray-50/80 p-3.5 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">Status</span>
                {isPublished ? (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    <Globe className="mr-1 h-3 w-3" />
                    Published
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">Draft</Badge>
                )}
              </div>
              {excerpt.trim() && (
                <div className="border-t border-gray-100 pt-2">
                  <p className="text-xs text-gray-500">Excerpt</p>
                  <p className="mt-1 text-sm text-gray-700">{excerpt.trim()}</p>
                </div>
              )}
              <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-2">
                <span className="text-gray-500">Cover image</span>
                <span className="font-medium text-gray-900">
                  {coverImage ? coverImage.name : "None"}
                </span>
              </div>
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
            <Button type="button" onClick={handleConfirmSave} disabled={saving}>
              {saving
                ? isPublished
                  ? "Publishing…"
                  : "Saving…"
                : isPublished
                  ? "Publish"
                  : "Save Draft"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
