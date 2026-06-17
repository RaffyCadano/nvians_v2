"use client";

import { adminPath } from "@/lib/admin-routes";

export function useAdminPath() {
  const host = typeof window !== "undefined" ? window.location.hostname : null;
  return (path: string) => adminPath(path, host);
}
