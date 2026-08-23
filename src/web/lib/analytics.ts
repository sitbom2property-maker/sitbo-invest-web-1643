import { CONSENT_CHANGE_EVENT, readConsent, type CookiePrefs } from "./consent";

/**
 * GA4 measurement ID of the `sitboinvest.ge` web data stream. Override per
 * environment with `VITE_GA_MEASUREMENT_ID` (empty value disables tracking).
 */
export const GA_MEASUREMENT_ID = (
  import.meta.env.VITE_GA_MEASUREMENT_ID ?? "G-17F8GJ7K0P"
).trim();

/** `?ga_debug=1` forces tracking on (incl. localhost) and streams to GA DebugView. */
const DEBUG_QUERY_FLAG = "ga_debug";
const DEBUG_SESSION_KEY = "sitbo_ga_debug";

/** How long gtag.js holds events while waiting for the cookie banner decision. */
const CONSENT_WAIT_MS = 500;

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1", "[::1]"]);

type GtagFn = (...args: unknown[]) => void;
type ConsentSignal = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}

let started = false;

export function initAnalytics(): void {
  if (started || typeof window === "undefined") return;
  if (!GA_MEASUREMENT_ID || !isMeasurementAllowed()) return;
  started = true;

  const dataLayer = (window.dataLayer = window.dataLayer ?? []);
  function gtag() {
    // gtag.js expects the raw `arguments` object, so it must not be spread.
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments);
  }
  window.gtag = gtag as GtagFn;

  applyConsent(readConsent(), "default");

  window.gtag("js", new Date());
  // No `send_page_view: false` here: GA4 enhanced measurement already reports
  // both page loads and wouter's history-based SPA navigations, so sending our
  // own page_view events would double-count them.
  window.gtag("config", GA_MEASUREMENT_ID, isDebugRequested() ? { debug_mode: true } : {});

  loadTagScript();

  window.addEventListener(CONSENT_CHANGE_EVENT, (event) => {
    applyConsent((event as CustomEvent<CookiePrefs>).detail ?? readConsent(), "update");
  });
  document.addEventListener("click", handleContactClick, true);
}

export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  window.gtag?.("event", name, params);
}

export type LeadEventDetails = {
  /** Which form produced the lead, e.g. "Website popup" or "Catalog request". */
  source: string;
  budget?: string;
  project?: string;
};

/** GA4 recommended conversion event for a submitted contact/lead form. */
export function trackLead({ source, budget, project }: LeadEventDetails): void {
  trackEvent("generate_lead", {
    lead_source: source,
    ...(budget ? { lead_budget: budget } : {}),
    ...(project ? { lead_project: project } : {}),
  });
}

function consentPayload(prefs: CookiePrefs | null) {
  const analytics: ConsentSignal = prefs?.performance ? "granted" : "denied";
  const ads: ConsentSignal = prefs?.targeting ? "granted" : "denied";
  const functional: ConsentSignal = prefs?.functionality ? "granted" : "denied";
  return {
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
    analytics_storage: analytics,
    functionality_storage: functional,
    personalization_storage: functional,
    security_storage: "granted" as ConsentSignal,
  };
}

/**
 * Google Consent Mode v2. Until the visitor accepts, storage stays denied and
 * gtag.js sends cookieless pings, so traffic is still measured without cookies.
 */
function applyConsent(prefs: CookiePrefs | null, mode: "default" | "update"): void {
  const send = window.gtag;
  if (!send) return;
  const payload = consentPayload(prefs);
  const awaitingChoice = mode === "default" && !prefs;
  send("consent", mode, awaitingChoice ? { ...payload, wait_for_update: CONSENT_WAIT_MS } : payload);
  send("set", "ads_data_redaction", payload.ad_storage !== "granted");
}

function loadTagScript(): void {
  const src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  if (document.querySelector(`script[src="${src}"]`)) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

type ContactMethod = "whatsapp" | "telegram" | "phone" | "email";

function contactMethod(href: string): ContactMethod | null {
  const value = href.trim().toLowerCase();
  if (value.startsWith("mailto:")) return "email";
  if (value.startsWith("tel:")) return "phone";
  if (/^https?:\/\/([a-z0-9-]+\.)?(wa\.me|whatsapp\.com)\//.test(value)) return "whatsapp";
  if (/^https?:\/\/(t\.me|telegram\.me)\//.test(value)) return "telegram";
  return null;
}

function handleContactClick(event: Event): void {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const link = target.closest("a[href]");
  if (!(link instanceof HTMLAnchorElement)) return;
  const method = contactMethod(link.getAttribute("href") ?? "");
  if (!method) return;
  trackEvent("contact_click", { contact_method: method, link_url: link.href });
}

function isDebugRequested(): boolean {
  try {
    const flag = new URLSearchParams(window.location.search).get(DEBUG_QUERY_FLAG);
    if (flag === "0") {
      window.sessionStorage.removeItem(DEBUG_SESSION_KEY);
      return false;
    }
    if (flag !== null) {
      window.sessionStorage.setItem(DEBUG_SESSION_KEY, "1");
      return true;
    }
    return window.sessionStorage.getItem(DEBUG_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

/** Keeps local development out of the production property. */
function isMeasurementAllowed(): boolean {
  if (isDebugRequested()) return true;
  const { hostname } = window.location;
  return !LOCAL_HOSTNAMES.has(hostname) && !hostname.endsWith(".local");
}
