export const FLATSHOW_LEAD_SOURCE = "sitbo-flatshow";
export const FLATSHOW_LEAD_EVENT = "request_call";

export function isFlatshowLeadMessage(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const msg = data as { source?: unknown; event?: unknown };
  return msg.source === FLATSHOW_LEAD_SOURCE && msg.event === FLATSHOW_LEAD_EVENT;
}

/** Fetch URL for the proxied widget HTML (XHR/fetch, not a document navigation). */
export function flatshowEmbedFetchUrl(key: "piazza" | "parkline", lang: "en" | "ru") {
  return `/api/flatshow/embed/${key}?lang=${lang}`;
}
