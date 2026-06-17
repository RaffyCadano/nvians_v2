import { normalizeHost } from "@/lib/site-urls";

type HeaderSource = { get(name: string): string | null };

/** Resolve the public hostname (supports proxies / App Hosting). */
export function getRequestHost(headerSource: HeaderSource) {
  const forwarded = headerSource.get("x-forwarded-host");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.toLowerCase();
  }
  return (headerSource.get("host") ?? "").toLowerCase();
}

export function getNormalizedRequestHost(headerSource: HeaderSource) {
  return normalizeHost(getRequestHost(headerSource));
}
