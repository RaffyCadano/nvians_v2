"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteNews } from "./actions";
import { AlertTriangle, Newspaper, Trash2 } from "lucide-react";

export function DeleteNewsButton({
  articleId,
  articleTitle,
  isPublished,
  redirectTo = "/cms",
}: {
  articleId: string;
  articleTitle: string;
  isPublished: boolean;
  redirectTo?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleOpenChange(next: boolean) {
    if (loading) return;
    setOpen(next);
    if (!next) setError("");
  }

  async function handleDelete() {
    setLoading(true);
    setError("");

    try {
      const result = await deleteNews(articleId);

      if (result?.error) {
        setError(result.error);
        return;
      }

      setOpen(false);

      const target = redirectTo.replace(/\/$/, "") || "/";
      const current = pathname.replace(/\/$/, "") || "/";

      if (current === target) {
        window.location.reload();
        return;
      }

      router.push(redirectTo);
    } catch {
      setError("Failed to delete article. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-red-500 hover:bg-red-50 hover:text-red-700"
        onClick={() => {
          setError("");
          setOpen(true);
        }}
      >
        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
        Delete
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
          <div className="border-b border-red-100 bg-gradient-to-r from-red-950 via-red-900 to-rose-900 px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/15 ring-1 ring-red-400/25">
                <Trash2 className="h-5 w-5 text-red-300" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-white">
                  Delete article?
                </DialogTitle>
                <p className="mt-0.5 text-xs text-red-200/80">This action cannot be undone</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-100">
                <Newspaper className="h-5 w-5 text-rose-700" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{articleTitle}</p>
                <p className="truncate text-xs text-gray-500">
                  {isPublished ? "Published article" : "Draft article"}
                </p>
              </div>
            </div>

            <DialogDescription className="mt-4 text-sm leading-relaxed text-gray-600">
              <span className="font-medium text-gray-900">{articleTitle}</span> will be permanently
              removed from the CMS.
            </DialogDescription>

            {isPublished && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 p-3.5">
                <div className="flex gap-2.5">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <div className="min-w-0 text-sm text-amber-900">
                    <p className="font-medium">Currently live on the public site</p>
                    <p className="mt-1 text-xs leading-relaxed text-amber-800/90">
                      Deleting this article will remove it from the public news page immediately.
                    </p>
                  </div>
                </div>
              </div>
            )}

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
              className="w-full sm:w-auto"
              onClick={() => handleOpenChange(false)}
              disabled={loading}
            >
              Keep article
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={handleDelete}
              disabled={loading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {loading ? "Deleting..." : "Delete article"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
