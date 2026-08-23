export type CookiePrefs = {
  necessary: boolean;
  performance: boolean;
  targeting: boolean;
  functionality: boolean;
  unclassified: boolean;
};

export const CONSENT_STORAGE_KEY = "sitbo_cookie_consent";

/** Fired on `window` whenever the visitor's cookie preferences are saved. */
export const CONSENT_CHANGE_EVENT = "sitbo:consent-change";

export const CONSENT_ALL_ON: CookiePrefs = {
  necessary: true,
  performance: true,
  targeting: true,
  functionality: true,
  unclassified: true,
};

export const CONSENT_NECESSARY_ONLY: CookiePrefs = {
  necessary: true,
  performance: false,
  targeting: false,
  functionality: false,
  unclassified: false,
};

export function readConsent(): CookiePrefs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookiePrefs>;
    return { ...CONSENT_NECESSARY_ONLY, ...parsed, necessary: true };
  } catch {
    return null;
  }
}

export function writeConsent(prefs: CookiePrefs): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Private mode / storage disabled — consent still applies for this page view.
  }
  window.dispatchEvent(new CustomEvent<CookiePrefs>(CONSENT_CHANGE_EVENT, { detail: prefs }));
}
