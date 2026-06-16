"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

export function DevDisclaimerModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("dev-disclaimer-dismissed");
    if (!dismissed) setOpen(true);
  }, []);

  function handleClose() {
    sessionStorage.setItem("dev-disclaimer-dismissed", "1");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          </div>
          <DialogTitle className="text-center">Website Under Development</DialogTitle>
          <DialogDescription className="text-center">
            This website is currently in development. The content, images, and
            information displayed may not be accurate and are subject to change.
          </DialogDescription>
        </DialogHeader>
        <button
          onClick={handleClose}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          I Understand
        </button>
      </DialogContent>
    </Dialog>
  );
}
