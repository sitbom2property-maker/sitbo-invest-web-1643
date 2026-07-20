import { useEffect, useState, type CSSProperties } from "react";
import { useLocale } from "../context/LocaleContext";
import { useRates } from "../context/RatesContext";
import { useT } from "../i18n";
import { LocaleSelect } from "./LocaleSelect";

const LANGUAGE_OPTIONS = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
] as const;

const CURRENCY_OPTIONS = [
  { code: "USD", label: "USD $" },
  { code: "EUR", label: "EUR €" },
  { code: "GEL", label: "GEL ₾" },
  { code: "RUB", label: "RUB ₽" },
  { code: "GBP", label: "GBP £" },
  { code: "AED", label: "AED د.إ" },
  { code: "TRY", label: "TRY ₺" },
] as const;

const FIELD_LABEL: CSSProperties = {
  fontFamily: "Manrope, sans-serif",
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: "#21141A",
  margin: "0 0 12px",
  display: "block",
};

type LocaleModalProps = {
  open: boolean;
  onClose: () => void;
};

export function LocaleModal({ open, onClose }: LocaleModalProps) {
  const { language, currency, setLocale } = useLocale();
  const { date, source } = useRates();
  const t = useT();
  const [draftLang, setDraftLang] = useState(language);
  const [draftCurrency, setDraftCurrency] = useState(currency);

  useEffect(() => {
    if (open) {
      setDraftLang(language);
      setDraftCurrency(currency);
    }
  }, [open, language, currency]);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSave = () => {
    setLocale({
      language: draftLang as "en" | "ru",
      currency: draftCurrency as typeof currency,
    });
    onClose();
  };

  return (
    <div className="locale-modal-root" role="presentation">
      <div className="locale-modal-backdrop" onClick={onClose} aria-hidden />
      <div
        className="locale-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="locale-modal-title"
      >
        <button
          type="button"
          className="locale-modal-close"
          onClick={onClose}
          aria-label={t("locale.close")}
        >
          ×
        </button>

        <div className="locale-modal-fields">
          <div>
            <span id="locale-modal-title" style={FIELD_LABEL}>
              {t("locale.language")}
            </span>
            <LocaleSelect
              id="locale-language"
              value={draftLang}
              options={[...LANGUAGE_OPTIONS]}
              onChange={setDraftLang}
            />
          </div>

          <div>
            <span style={FIELD_LABEL}>{t("locale.currency")}</span>
            <LocaleSelect
              value={draftCurrency}
              options={[...CURRENCY_OPTIONS]}
              onChange={setDraftCurrency}
            />
            <p
              style={{
                margin: "10px 0 0",
                fontFamily: "Manrope, sans-serif",
                fontSize: 11,
                color: "rgba(33,20,26,0.55)",
                lineHeight: 1.45,
              }}
            >
              {date
                ? t("locale.ratesAsOf", { date })
                : t("locale.ratesNote")}
              {source === "fallback" ? " *" : ""}
            </p>
          </div>

          <button
            type="button"
            className="locale-modal-save"
            onClick={handleSave}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#694153";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#21141A";
            }}
          >
            {t("locale.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
