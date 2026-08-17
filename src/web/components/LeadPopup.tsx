import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { useT } from "../i18n";

/**
 * Soft lead capture:
 * - never interrupts in the first ~20s
 * - waits until the visitor has scrolled meaningfully (or spent longer on page)
 * - on desktop, exit-intent can open it earlier after the quiet period
 * - dismissed for a week; submitted forever
 */
const QUIET_MS = 20_000;
const FALLBACK_MS = 45_000;
const SCROLL_RATIO = 0.42;
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000;
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
  background: "rgba(255,254,249,0.05)",
  border: "1px solid rgba(140,178,192,0.1)",
  borderRadius: 8,
  color: "#FFFEF9",
  fontFamily: "Inter, sans-serif",
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

    let opened = false;
    let quietDone = false;
    const openOnce = () => {
      if (opened || !shouldShow()) return;
      opened = true;
      setOpen(true);
      cleanup();
    };

    const onScroll = () => {
      if (!quietDone) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      if (window.scrollY / max >= SCROLL_RATIO) openOnce();
    };

    const onExit = (e: MouseEvent) => {
      if (!quietDone) return;
      if (e.clientY <= 8) openOnce();
    };

    const quietTimer = window.setTimeout(() => {
      quietDone = true;
      onScroll();
    }, QUIET_MS);

    const fallbackTimer = window.setTimeout(openOnce, FALLBACK_MS);

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onExit);

    const cleanup = () => {
      window.clearTimeout(quietTimer);
      window.clearTimeout(fallbackTimer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onExit);
    };

    return cleanup;
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.classList.add("sitbo-modal-open");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("sitbo-modal-open");
    };
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
          background: rgba(12, 7, 10, 0.86);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 16px;
          animation: leadPopupFade 0.3s ease;
        }
        .lead-popup-card {
          position: relative;
          width: 100%;
          max-width: 420px;
          background: #21141A;
          border: 1px solid rgba(140,178,192,0.1);
          border-radius: 16px;
          padding: 28px 24px 22px;
          box-shadow: 0 18px 48px rgba(0,0,0,0.35);
          animation: leadPopupRise 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
          margin-bottom: max(8px, env(safe-area-inset-bottom));
        }
        .lead-popup-close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: rgba(255,254,249,0.08);
          color: #FFFEF9;
          font-size: 18px;
          line-height: 1;
          cursor: pointer;
          transition: background 0.2s;
        }
        .lead-popup-close:hover { background: rgba(255,254,249,0.18); }
        .lead-popup-input:focus { border-color: #703C54 !important; }
        .lead-popup-submit:hover { opacity: 0.88; }
        @keyframes leadPopupFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes leadPopupRise {
          from { opacity: 0; transform: translateY(24px) }
          to { opacity: 1; transform: none }
        }
        @media (min-width: 720px) {
          .lead-popup-backdrop {
            align-items: center;
            background: rgba(12, 7, 10, 0.55);
          }
          .lead-popup-card {
            padding: 36px 32px 28px;
            margin-bottom: 0;
          }
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
          <div style={{ textAlign: "center", padding: "12px 8px 4px" }}>
            <h2
              style={{
                fontFamily: "Coolvetica, Inter, sans-serif",
                fontSize: 26,
                fontWeight: 400,
                color: "#FFFEF9",
                margin: "0 0 10px",
              }}
            >
              {t("popup.sentTitle")}
            </h2>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 15, color: "#FFFEF9", margin: 0 }}>
              {t("popup.sentBody")}
            </p>
          </div>
        ) : (
          <>
            <h2
              style={{
                fontFamily: "Coolvetica, Inter, sans-serif",
                fontSize: 24,
                fontWeight: 400,
                lineHeight: 1.15,
                color: "#FFFEF9",
                margin: "0 36px 10px 0",
              }}
            >
              {t("popup.title")}
            </h2>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                lineHeight: 1.4,
                color: "#FFFEF9",
                margin: "0 0 20px",
              }}
            >
              {t("popup.body")}
            </p>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
              <input
                className="lead-popup-input"
                style={inputStyle}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder={t("popup.namePlaceholder")}
                autoComplete="name"
              />
              <input
                className="lead-popup-input"
                style={inputStyle}
                value={form.contact}
                onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                placeholder={t("popup.contactPlaceholder")}
                autoComplete="tel"
              />
              {error ? (
                <p style={{ margin: 0, color: "#FFFEF9", fontSize: 13, fontFamily: "Inter, sans-serif" }}>
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                className="lead-popup-submit"
                disabled={loading}
                style={{
                  marginTop: 4,
                  border: "none",
                  borderRadius: 6,
                  background: "#FFFEF9",
                  color: "#21141A",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 15,
                  padding: "14px 18px",
                  cursor: loading ? "wait" : "pointer",
                }}
              >
                {loading ? "…" : t("popup.submit")}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
