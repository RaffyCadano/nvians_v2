"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { adminPath } from "@/lib/admin-routes";

type AdminLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

/** Link that resolves /admin/* paths to clean URLs on the admin subdomain. */
export function AdminLink({ href, ...props }: AdminLinkProps) {
  const host = typeof window !== "undefined" ? window.location.hostname : null;
  return <Link href={adminPath(href, host)} {...props} />;
}
