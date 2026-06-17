"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminPath } from "@/lib/admin-routes";

export async function redirectAdmin(internalPath: string) {
  const host = (await headers()).get("host");
  redirect(adminPath(internalPath, host));
}
