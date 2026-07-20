import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "sitbo_locale";

export type LanguageCode = "en" | "ru";
export type UnitsCode = "sqm" | "sqft";
export type SupportedCurrency = "USD" | "EUR" | "GBP" | "GEL" | "RUB" | "AED" | "TRY";

export type LocaleState = {
  language: LanguageCode;
  currency: SupportedCurrency;
  units: UnitsCode;
};

export function normalizeLanguage(code: string): LanguageCode {
  return code === "ru" ? "ru" : "en";
}

const SUPPORTED_CURRENCIES: SupportedCurrency[] = [
  "USD",
  "EUR",
  "GBP",
  "GEL",
  "RUB",
  "AED",
  "TRY",
];

const DEFAULT_LOCALE: LocaleState = {
  language: "en",
  currency: "USD",
  units: "sqm",
};

function normalizeCurrency(code: string | undefined): SupportedCurrency {
  const upper = (code ?? "USD").toUpperCase();
  return (SUPPORTED_CURRENCIES.includes(upper as SupportedCurrency)
    ? upper
    : "USD") as SupportedCurrency;
}

type LocaleContextValue = LocaleState & {
  setLocale: (next: Partial<LocaleState>) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStoredLocale(): LocaleState {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LOCALE;
    const parsed = JSON.parse(raw) as Partial<LocaleState>;
    return {
      language: normalizeLanguage(parsed.language ?? DEFAULT_LOCALE.language),
      currency: normalizeCurrency(parsed.currency),
      units: parsed.units === "sqft" ? "sqft" : "sqm",
    };
  } catch {
    return DEFAULT_LOCALE;
  }
}

function applyDocumentLocale(locale: LocaleState) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale.language;
  document.documentElement.dataset.lang = locale.language;
  document.documentElement.dataset.currency = locale.currency;
  document.documentElement.dataset.units = locale.units;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleState>(readStoredLocale);

  useEffect(() => {
    applyDocumentLocale(locale);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(locale));
    } catch {
      /* ignore quota errors */
    }
  }, [locale]);

  const setLocale = useCallback((next: Partial<LocaleState>) => {
    setLocaleState((prev) => ({
      language: next.language
        ? normalizeLanguage(next.language)
        : prev.language,
      currency: next.currency ? normalizeCurrency(next.currency) : prev.currency,
      units: next.units ?? prev.units,
    }));
  }, []);

  const value = useMemo(
    () => ({
      ...locale,
      setLocale,
    }),
    [locale, setLocale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
