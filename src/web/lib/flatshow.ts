export const FLATSHOW_LEAD_SOURCE = "sitbo-flatshow";
export const FLATSHOW_LEAD_EVENT = "request_call";

export function isFlatshowLeadMessage(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const msg = data as { source?: unknown; event?: unknown };
  return msg.source === FLATSHOW_LEAD_SOURCE && msg.event === FLATSHOW_LEAD_EVENT;
}

export function flatshowEmbedSrc(
  key: "piazza" | "parkline",
  lang: "en" | "ru",
  hash = "#/",
) {
  const parent = encodeURIComponent(window.location.href);
  const suffix = hash.startsWith("#") ? hash : `#${hash}`;
  return `/api/flatshow/embed/${key}?lang=${lang}&parent=${parent}${suffix}`;
}
