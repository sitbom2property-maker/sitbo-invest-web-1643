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

  const rowH = compact ? 28 : 32;
  const fontSize = compact ? 10 : 11;

  const chipBase: CSSProperties = {
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: rowH,
    margin: 0,
    fontFamily: "Inter, sans-serif",
    fontSize,
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    border: "none",
    background: "transparent",
    color: "#FFFEF9",
    cursor: "pointer",
    padding: compact ? "0 5px" : "0 7px",
    lineHeight: 1,
    verticalAlign: "middle",
    transition: "opacity 0.15s, color 0.15s",
  };

  return (
    <div
      ref={rootRef}
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: rowH,
        gap: compact ? 4 : 8,
        position: "relative",
        flexWrap: "nowrap",
      }}
      aria-label={t("nav.language")}
    >
      {/* Language */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          height: rowH,
          gap: 0,
          flexShrink: 0,
        }}
      >
        {LANGS.map((lang) => {
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
          flexShrink: 0,
          alignSelf: "center",
        }}
      />

      {/* Currency */}
      <div
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          height: rowH,
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={t("locale.currency")}
          style={{
            ...chipBase,
            gap: 5,
            opacity: 0.9,
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", lineHeight: 1 }}>
            {CURRENCY_SYMBOLS[currency] ?? ""}
            {currency}
          </span>
          <svg
            width="8"
            height="8"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden
            style={{ display: "block", flexShrink: 0 }}
          >
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
              left: 0,
              minWidth: 128,
              background: "#21141A",
              border: "1px solid rgba(255,254,249,0.12)",
              borderRadius: 10,
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
                    borderRadius: 8,
                    cursor: "pointer",
                    textAlign: "left",
                    lineHeight: 1,
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
