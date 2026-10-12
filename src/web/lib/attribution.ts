/**
 * Remembers where a visitor came from (UTM tags, ad click ids, referrer and
 * landing page) for the browser session, so lead forms can send it along.
 * First touch wins: later internal navigation does not overwrite it.
 */

const KEY = "sitbo_attribution";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"] as const;

export type Attribution = Partial<Record<(typeof PARAMS)[number] | "referrer" | "landing", string>>;

export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const data: Attribution = {};
    for (const p of PARAMS) {
      const v = params.get(p);
      if (v) data[p] = v.slice(0, 200);
    }
    const ref = document.referrer;
    if (ref && !ref.startsWith(window.location.origin)) data.referrer = ref.slice(0, 200);
    data.landing = window.location.pathname;
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable (private mode) — attribution is optional */
  }
}

export function getAttribution(): Attribution | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : undefined;
  } catch {
    return undefined;
  }
}
