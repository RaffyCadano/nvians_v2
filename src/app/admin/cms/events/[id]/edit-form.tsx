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
import { updateEvent } from "../../actions";
import {
  ALLOWED_IMAGE_TYPES,
  validateCoverImageFile,
} from "@/lib/cms-storage";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ImagePlus,
  MapPin,
  Pencil,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";

type EventRecord = {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  location: string | null;
  cover_image: string | null;
};

function toDateInputValue(value: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
}

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
  coverImageUrl: string | null,
  removeCover: boolean,
) {
  const formData = new FormData();
  formData.set("title", title.trim());
  formData.set("start_date", startDate);
  if (endDate) formData.set("end_date", endDate);
  if (location.trim()) formData.set("location", location.trim());
  if (description.trim()) formData.set("description", description.trim());
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

export default function EditEventForm({ event }: { event: EventRecord }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(event.title);
  const [startDate, setStartDate] = useState(toDateInputValue(event.start_date));
  const [endDate, setEndDate] = useState(toDateInputValue(event.end_date));
  const [location, setLocation] = useState(event.location ?? "");
  const [description, setDescription] = useState(event.description ?? "");
  const [existingCoverUrl, setExistingCoverUrl] = useState(event.cover_image);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(event.cover_image);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewReady = Boolean(title.trim() && startDate);
  const dateRange = useMemo(
    () => formatDateRange(startDate, endDate),
    [startDate, endDate],
  );

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

  async function saveChanges() {
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
      const result = await updateEvent(
        event.id,
        buildFormData(
          title,
          startDate,
          endDate,
          location,
          description,
          coverImageUrl,
          removeCover,
        ),
      );

      if (result?.error) {
        setError(result.error);
        return;
      }

      if (!result || !("success" in result)) {
        setError("Failed to save event. Please try again.");
        return;
      }

      if (coverImageUrl) {
        setExistingCoverUrl(coverImageUrl);
        setCoverPreview(coverImageUrl);
        setCoverImage(null);
      } else if (removeCover) {
        setExistingCoverUrl(null);
      }

      setSaved(true);
      router.refresh();
    } catch {
      setError("Failed to save event. Please try again.");
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
    if (!title.trim() || !startDate) {
      setError("Title and start date are required.");
      return;
    }
    if (endDate && new Date(endDate) < new Date(startDate)) {
      setError("End date must be on or after the start date.");
      return;
    }
    if (imageError) {
      setError(imageError);
      return;
    }

    await saveChanges();
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
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Edit Event</h1>
            <p className="mt-2 max-w-xl text-sm text-blue-100">
              Update event details shown on the public news and events page.
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
            <h2 className="font-semibold text-gray-900">Event Details</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Title and start date are required.
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
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
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
                      required
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[120px] resize-y"
                  />
                </div>
              </div>

              {saved && !error && (
                <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-700">
                  Changes saved successfully.
                </p>
              )}

              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row">
                <Button type="submit" className="sm:min-w-[160px]" disabled={saving}>
                  {saving ? "Saving…" : "Save Changes"}
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
                    <div className="flex h-24 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                      <CalendarDays className="h-8 w-8 text-blue-200" />
                    </div>
                  )}
                  <div className="space-y-2 p-4">
                    <p className="text-xs font-medium text-blue-600">{dateRange}</p>
                    <p className="line-clamp-2 font-semibold text-gray-900">{title.trim()}</p>
                    {description.trim() && (
                      <p className="line-clamp-3 text-sm text-gray-600">{description.trim()}</p>
                    )}
                    {location.trim() && (
                      <p className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        {location.trim()}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <CalendarDays className="mx-auto h-9 w-9 text-gray-300" />
                  <p className="mt-3 text-sm font-medium text-gray-600">No preview yet</p>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-base font-bold text-gray-900">Quick Guide</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  1
                </span>
                <span>Update the title, dates, or location as needed.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  2
                </span>
                <span>Click Save Changes to update the public event.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                <span>Changes appear on the public site right away.</span>
              </li>
            </ul>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-green-700">
              <Sparkles className="h-3.5 w-3.5" />
              {saved ? "Saved" : "Ready to save"}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
