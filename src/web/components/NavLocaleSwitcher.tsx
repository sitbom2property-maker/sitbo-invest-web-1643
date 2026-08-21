import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useLocale, type SupportedCurrency } from "../context/LocaleContext";
import { useT } from "../i18n";
import { CURRENCY_SYMBOLS } from "../lib/money";

const LANGS = [
  { code: "en" as const, label: "EN" },
  { code: "ru" as const, label: "RU" },
];

const CURRENCIES: SupportedCurrency[] = ["USD", "EUR", "GEL", "RUB"];

type NavLocaleSwitcherProps = {
  compact?: boolean;
};

export function NavLocaleSwitcher({ compact = false }: NavLocaleSwitcherProps) {
  const { language, currency, setLocale } = useLocale();
  const t = useT();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const chipBase: CSSProperties = {
    fontFamily: "Inter, sans-serif",
    fontSize: compact ? 10 : 11,
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    border: "none",
    background: "transparent",
    color: "#FFFEF9",
    cursor: "pointer",
    padding: compact ? "6px 4px" : "6px 7px",
    lineHeight: 1,
    transition: "opacity 0.15s, color 0.15s",
  };

  return (
    <div
      ref={rootRef}
      style={{
        display: "flex",
        alignItems: "center",
        gap: compact ? 2 : 6,
        position: "relative",
      }}
      aria-label={t("nav.language")}
    >
      {/* One-tap language toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        {LANGS.map((lang, i) => {
          const active = language === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLocale({ language: lang.code })}
              aria-pressed={active}
              style={{
                ...chipBase,
                opacity: active ? 1 : 0.45,
                color: active ? "#703C54" : "#FFFEF9",
                paddingLeft: i === 0 ? (compact ? 4 : 6) : 4,
                paddingRight: i === LANGS.length - 1 ? (compact ? 4 : 6) : 4,
              }}
            >
              {lang.label}
            </button>
          );
        })}
      </div>

      <span
        aria-hidden
        style={{
          width: 1,
          height: 12,
          background: "rgba(255,254,249,0.25)",
          margin: "0 2px",
          flexShrink: 0,
        }}
      />

      {/* Currency — applies immediately */}
      <div style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={t("locale.currency")}
          style={{
            ...chipBase,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            opacity: 0.9,
            paddingRight: compact ? 2 : 4,
          }}
        >
          <span>
            {CURRENCY_SYMBOLS[currency] ?? ""}
            {currency}
          </span>
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path
              d="M2 3.5 5 6.5 8 3.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {open && (
          <div
            role="listbox"
            aria-label={t("locale.currency")}
            style={{
              position: "absolute",
              top: "calc(100% + 10px)",
              right: 0,
              minWidth: 128,
              background: "#21141A",
              border: "1px solid rgba(255,254,249,0.12)",
              borderRadius: 2,
              padding: 6,
              boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
              zIndex: 200,
            }}
          >
            {CURRENCIES.map((code) => {
              const active = currency === code;
              return (
                <button
                  key={code}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setLocale({ currency: code });
                    setOpen(false);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    border: "none",
                    background: active ? "rgba(140,178,192,0.1)" : "transparent",
                    color: active ? "#703C54" : "#FFFEF9",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    padding: "10px 12px",
                    borderRadius: 2,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span>
                    {CURRENCY_SYMBOLS[code]} {code}
                  </span>
                  {active ? "✓" : ""}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
