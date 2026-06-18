"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import { createEvent } from "../../actions";
import {
  ALLOWED_IMAGE_TYPES,
  validateCoverImageFile,
} from "@/lib/cms-storage";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Globe,
  ImagePlus,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";

function formatShortDate(value: string) {
  if (!value) return "—";
  return format(new Date(value), "MMM d, yyyy");
}

function formatDateRange(startDate: string, endDate: string) {
  if (!startDate) return "—";
  if (!endDate || endDate === startDate) return formatShortDate(startDate);
  return `${formatShortDate(startDate)} – ${formatShortDate(endDate)}`;
}

function buildFormData(
  title: string,
  startDate: string,
  endDate: string,
  location: string,
  description: string,
  isPublished: boolean,
  coverImageUrl: string | null,
) {
  const formData = new FormData();
  formData.set("title", title.trim());
  if (startDate) formData.set("start_date", startDate);
  if (endDate) formData.set("end_date", endDate);
  if (location.trim()) formData.set("location", location.trim());
  if (description.trim()) formData.set("description", description.trim());
  if (isPublished) formData.set("is_published", "true");
  if (coverImageUrl) formData.set("cover_image", coverImageUrl);
  return formData;
}

function hasDraftContent(
  title: string,
  startDate: string,
  endDate: string,
  location: string,
  description: string,
  coverImage: File | null,
) {
  return Boolean(
    title.trim() ||
      startDate ||
      endDate ||
      location.trim() ||
      description.trim() ||
      coverImage,
  );
}

async function uploadCoverImage(file: File) {
  const validationError = validateCoverImageFile(file);
  if (validationError) {
    return { error: validationError };
  }

  const formData = new FormData();
  formData.set("file", file);
  formData.set("folder", "events");

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

export default function NewEventPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewReady = Boolean(
    title.trim() || startDate || location.trim() || description.trim() || coverPreview,
  );
  const dateRange = useMemo(
    () => formatDateRange(startDate, endDate),
    [startDate, endDate],
  );

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
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

  function resetForm() {
    setTitle("");
    setStartDate("");
    setEndDate("");
    setLocation("");
    setDescription("");
    setIsPublished(false);
    setCoverImage(null);
    setImageError("");
    setCoverPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError("");
    setConfirmOpen(false);
  }

  async function saveEvent(publish: boolean) {
    setSaving(true);
    setError("");

    try {
      let coverImageUrl: string | null = null;

      if (coverImage) {
        const upload = await uploadCoverImage(coverImage);
        if (upload.error) {
          setError(upload.error);
          return;
        }
        coverImageUrl = upload.url ?? null;
      }

      const result = await createEvent(
        buildFormData(
          title,
          startDate,
          endDate,
          location,
          description,
          publish,
          coverImageUrl,
        ),
      );

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (!result || !("success" in result)) {
        setError(
          publish
            ? "Failed to publish event. Please try again."
            : "Failed to save event. Please try again.",
        );
        return;
      }

      resetForm();
      router.refresh();
    } catch {
      setError(
        publish
          ? "Failed to publish event. Please try again."
          : "Failed to save event. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (imageError) {
      setError(imageError);
      return;
    }
    if (endDate && startDate && new Date(endDate) < new Date(startDate)) {
      setError("End date must be on or after the start date.");
      return;
    }
    setError("");

    if (isPublished) {
      if (!title.trim() || !startDate) {
        setError("Title and start date are required to publish.");
        return;
      }
      setConfirmOpen(true);
      return;
    }

    if (!hasDraftContent(title, startDate, endDate, location, description, coverImage)) {
      setError("Add at least one event detail before saving a draft.");
      return;
    }

    await saveEvent(false);
  }

  async function handleConfirmPublish() {
    await saveEvent(true);
  }

  function handleConfirmOpenChange(open: boolean) {
    if (saving) return;
    setConfirmOpen(open);
    if (!open) setError("");
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-800 px-6 py-6 text-white sm:px-8 sm:py-7">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-2 mb-4 text-blue-200 hover:bg-white/10 hover:text-white"
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
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">New Event</h1>
            <p className="mt-2 max-w-xl text-sm text-blue-100">
              Add a school event with dates and location. Save as a draft or publish when ready.
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
            <h2 className="font-semibold text-gray-900">Event Details</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Fill in what you have now and save a draft, or publish when title and start date are
              set.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  1
                </span>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Foundation Day Celebration"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Use a clear event name visitors will recognize.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
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
                      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {coverImage?.name ?? "Cover image"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {coverImage
                              ? `${(coverImage.size / 1024 / 1024).toFixed(2)} MB`
                              : "Ready to upload"}
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
                      className="flex w-full max-w-md items-center gap-3 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/40 px-4 py-4 text-left transition-colors hover:border-blue-300 hover:bg-blue-50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                        <ImagePlus className="h-5 w-5 text-blue-600" />
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
                  <p className="text-xs text-gray-500">
                    Optional image shown on the event card on the public site.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  3
                </span>
                <div className="min-w-0 flex-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="date"
                      min={startDate || undefined}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-gray-500 sm:col-span-2">
                    Leave end date blank for single-day events.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  4
                </span>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="School Gymnasium"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  5
                </span>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={5}
                    placeholder="What is this event about?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[120px] resize-y"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  6
                </span>
                <div className="min-w-0 flex-1">
                  <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
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
                            ? "This event will go live on the public site after you confirm. Title and start date are required."
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
                <Button type="submit" className="sm:min-w-[160px]" disabled={saving}>
                  {saving
                    ? isPublished
                      ? "Publishing…"
                      : "Saving…"
                    : isPublished
                      ? "Publish Event"
                      : "Save Draft"}
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
                      <div className="relative h-24 bg-gray-100">
                        <Image
                          src={coverPreview}
                          alt="Event cover preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-24 items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-50">
                        <CalendarDays className="h-10 w-10 text-blue-300" />
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
                      </div>
                      <p className="line-clamp-2 font-semibold text-gray-900">
                        {title.trim() || "Untitled event"}
                      </p>
                      <div className="space-y-1.5 text-sm text-gray-600">
                        {startDate && (
                          <p className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                            {dateRange}
                          </p>
                        )}
                        {location.trim() && (
                          <p className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                            {location.trim()}
                          </p>
                        )}
                      </div>
                      {description.trim() && (
                        <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
                          {description.trim()}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="flex items-center gap-1.5 text-xs text-green-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Ready to {isPublished ? "publish" : "save"}
                  </p>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <CalendarDays className="mx-auto h-9 w-9 text-gray-300" />
                  <p className="mt-3 text-sm font-medium text-gray-600">No preview yet</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Start filling in event details to see a preview.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="rounded-lg bg-blue-50 p-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </div>
              <h2 className="text-base font-bold text-gray-900">Quick Guide</h2>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  1
                </span>
                <span>Name the event clearly so families know what to expect.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  2
                </span>
                <span>Add a cover image so the event stands out on the public page.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  3
                </span>
                <span>Set the start date and an end date for multi-day events.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  4
                </span>
                <span>Add the venue and a short description for the public page.</span>
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
                  Publish event?
                </DialogTitle>
                <p className="mt-0.5 text-xs text-green-200/80">
                  Confirm before making this event live on the public website
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            {coverPreview && (
              <div className="relative mb-4 h-24 w-full max-w-xs overflow-hidden rounded-xl border border-gray-100 bg-gray-100">
                <Image
                  src={coverPreview}
                  alt="Event cover"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                <CalendarDays className="h-5 w-5 text-blue-700" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{title.trim()}</p>
                <p className="truncate text-xs text-gray-500">
                  {dateRange}
                  {coverImage ? " · Cover image attached" : ""}
                </p>
              </div>
            </div>

            <DialogDescription className="mt-4 text-sm leading-relaxed text-gray-600">
              <span className="font-medium text-gray-900">{title.trim()}</span> will appear on the
              public news and events page immediately after you confirm.
            </DialogDescription>

            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-sm text-amber-900">
              <p className="flex items-center gap-2 font-medium">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                This event will be visible to everyone
              </p>
              <p className="mt-1 text-xs leading-relaxed text-amber-800/90">
                Visitors can see it on the public website right away. Double-check the dates,
                location, and cover image before publishing.
              </p>
            </div>

            <div className="mt-4 space-y-2 rounded-xl border border-gray-100 bg-gray-50/80 p-3.5 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-500">Status</span>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  <Globe className="mr-1 h-3 w-3" />
                  Going live
                </Badge>
              </div>
              {location.trim() && (
                <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-2">
                  <span className="text-gray-500">Location</span>
                  <span className="font-medium text-gray-900">{location.trim()}</span>
                </div>
              )}
              {description.trim() && (
                <div className="border-t border-gray-100 pt-2">
                  <p className="text-xs text-gray-500">Description</p>
                  <p className="mt-1 line-clamp-3 text-sm text-gray-700">{description.trim()}</p>
                </div>
              )}
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
