import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { useT } from "../i18n";

/** Delay before the popup appears on a fresh visit. */
const SHOW_AFTER_MS = 5000;
/** Suppress for this long after the visitor closes it without submitting. */
const DISMISS_TTL_MS = 24 * 60 * 60 * 1000;
const STORAGE_KEY = "sitbo_lead_popup";

type StoredState = { dismissedAt?: number; submitted?: boolean };

function readState(): StoredState {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as StoredState;
  } catch {
    return {};
  }
}

function writeState(next: StoredState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readState(), ...next }));
  } catch {
    /* ignore quota errors */
  }
}

function shouldShow(): boolean {
  const state = readState();
  if (state.submitted) return false;
  if (state.dismissedAt && Date.now() - state.dismissedAt < DISMISS_TTL_MS) return false;
  return true;
}

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(250,247,240,0.05)",
  border: "1px solid rgba(140,178,192,0.25)",
  borderRadius: 8,
  color: "#FAF7F0",
  fontFamily: "Manrope, sans-serif",
  fontSize: 14,
  padding: "13px 15px",
  outline: "none",
  transition: "border-color 0.2s",
};

export function LeadPopup() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!shouldShow()) return;
    const timer = window.setTimeout(() => setOpen(true), SHOW_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const close = () => {
    setOpen(false);
    if (!submitted) writeState({ dismissedAt: Date.now() });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.contact.trim()) {
      setError(t("popup.errorRequired"));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          contact: form.contact.trim(),
          source: "Website popup",
          page: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });
      if (!res.ok) {
        setError(t("popup.errorGeneric"));
        return;
      }
      setSubmitted(true);
      writeState({ submitted: true });
      window.setTimeout(() => setOpen(false), 2600);
    } catch {
      setError(t("popup.errorNetwork"));
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="lead-popup-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={t("popup.title")}
      onClick={close}
    >
      <style>{`
        .lead-popup-backdrop {
          position: fixed;
          inset: 0;
          z-index: 3000;
          background: rgba(12, 7, 10, 0.72);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: leadPopupFade 0.35s ease;
        }
        .lead-popup-card {
          position: relative;
          width: 100%;
          max-width: 460px;
          background: #21141A;
          border: 1px solid rgba(140,178,192,0.22);
          border-radius: 16px;
          padding: 40px 36px 34px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.45);
          animation: leadPopupRise 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
        }
        .lead-popup-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: rgba(250,247,240,0.08);
          color: #FAF7F0;
          font-size: 18px;
          line-height: 1;
          cursor: pointer;
          transition: background 0.2s;
        }
        .lead-popup-close:hover { background: rgba(250,247,240,0.18); }
        .lead-popup-input:focus { border-color: #8CB2C0 !important; }
        .lead-popup-submit:hover { opacity: 0.88; }
        @keyframes leadPopupFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes leadPopupRise {
          from { opacity: 0; transform: translateY(18px) scale(0.98) }
          to { opacity: 1; transform: none }
        }
        @media (max-width: 520px) {
          .lead-popup-card { padding: 34px 22px 26px; border-radius: 14px; }
        }
      `}</style>

      <div className="lead-popup-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="lead-popup-close"
          aria-label={t("popup.close")}
          onClick={close}
        >
          ×
        </button>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "18px 0 8px" }}>
            <div
              style={{
                width: 54,
                height: 54,
                margin: "0 auto 20px",
                borderRadius: "50%",
                border: "1px solid #8CB2C0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8CB2C0",
                fontSize: 22,
              }}
            >
              ✓
            </div>
            <h2
              style={{
                fontFamily: "Jun, Georgia, serif",
                fontSize: 24,
                fontWeight: 400,
                color: "#FAF7F0",
                margin: "0 0 10px",
              }}
            >
              {t("popup.sentTitle")}
            </h2>
            <p
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: 14,
                lineHeight: 1.6,
                color: "rgba(250,247,240,0.6)",
                margin: 0,
              }}
            >
              {t("popup.sentBody")}
            </p>
          </div>
        ) : (
          <>
            <p
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#8CB2C0",
                margin: "0 0 14px",
              }}
            >
              {t("popup.eyebrow")}
            </p>
            <h2
              style={{
                fontFamily: "Jun, Georgia, serif",
                fontSize: "clamp(24px, 5vw, 30px)",
                fontWeight: 400,
                lineHeight: 1.2,
                color: "#FAF7F0",
                margin: "0 0 12px",
              }}
            >
              {t("popup.title")}
            </h2>
            <p
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: 14,
                lineHeight: 1.65,
                color: "rgba(250,247,240,0.6)",
                margin: "0 0 26px",
              }}
            >
              {t("popup.body")}
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                className="lead-popup-input"
                type="text"
                autoComplete="name"
                placeholder={t("popup.namePlaceholder")}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
              />
              <input
                className="lead-popup-input"
                type="text"
                autoComplete="tel"
                placeholder={t("popup.contactPlaceholder")}
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                style={inputStyle}
              />

              {error ? (
                <p
                  style={{
                    fontFamily: "Manrope, sans-serif",
                    fontSize: 13,
                    color: "#e57373",
                    margin: 0,
                  }}
                >
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                className="lead-popup-submit"
                disabled={loading}
                style={{
                  marginTop: 4,
                  padding: "15px 18px",
                  borderRadius: 8,
                  border: "none",
                  background: "#8CB2C0",
                  color: "#21141A",
                  fontFamily: "Manrope, sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  cursor: loading ? "wait" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                {loading ? "…" : t("popup.submit")}
              </button>

              <p
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: 11,
                  lineHeight: 1.6,
                  color: "rgba(250,247,240,0.4)",
                  margin: "6px 0 0",
                  textAlign: "center",
                }}
              >
                {t("popup.privacy")}
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
