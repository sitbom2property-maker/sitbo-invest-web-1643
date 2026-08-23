import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { useT } from "../i18n";
import { trackLead } from "../lib/analytics";

export type RequestModalProps = {
  open: boolean;
  onClose: () => void;
  /** Shown as the modal heading. Falls back to the generic consultation title. */
  title?: string;
  subtitle?: string;
  /** Written to the Odoo lead so we know which button produced it. */
  source: string;
  /** Optional plan / project name attached to the lead. */
  topic?: string;
};

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(255,254,249,0.05)",
  border: "1px solid rgba(140,178,192,0.1)",
  borderRadius: 2,
  color: "#FFFEF9",
  fontFamily: "Inter, sans-serif",
  fontSize: 14,
  padding: "13px 15px",
  outline: "none",
  transition: "border-color 0.2s",
};

export function RequestModal({
  open,
  onClose,
  title,
  subtitle,
  source,
  topic,
}: RequestModalProps) {
  const t = useT();
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.classList.add("sitbo-modal-open");
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("sitbo-modal-open");
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setSubmitted(false);
      setError("");
    }
  }, [open]);

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
          message: form.message.trim() || undefined,
          budget: topic,
          project: topic,
          source,
          page: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });
      if (!res.ok) {
        setError(t("popup.errorGeneric"));
        return;
      }
      trackLead({ source, project: topic });
      setSubmitted(true);
      setForm({ name: "", contact: "", message: "" });
      window.setTimeout(onClose, 2600);
    } catch {
      setError(t("popup.errorNetwork"));
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="req-modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <style>{`
        .req-modal-backdrop {
          position: fixed; inset: 0; z-index: 3200;
          background: rgba(12,7,10,0.86);
          display: flex; align-items: flex-start; justify-content: center;
          padding: max(24px, 8vh) 16px 24px; animation: reqFade 0.2s ease;
          overflow-y: auto; -webkit-overflow-scrolling: touch;
        }
        .req-modal-card {
          position: relative; width: 100%; max-width: 470px;
          background: #21141A; border: 1px solid rgba(140,178,192,0.1);
          border-radius: 2px; padding: 40px 36px 32px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.45);
          animation: reqRise 0.28s cubic-bezier(0.16,1,0.3,1);
          box-sizing: border-box; margin: 0 auto;
          overscroll-behavior: contain;
        }
        .req-modal-close {
          position: absolute; top: 14px; right: 14px;
          width: 32px; height: 32px; border-radius: 50%; border: none;
          background: rgba(255,254,249,0.08); color: #FFFEF9;
          font-size: 18px; line-height: 1; cursor: pointer; transition: background 0.2s;
        }
        .req-modal-close:hover { background: rgba(255,254,249,0.18); }
        .req-modal-input:focus { border-color: #703C54 !important; }
        .req-modal-submit:hover { opacity: 0.88; }
        @keyframes reqFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes reqRise { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: none } }
        @media (max-width: 520px) { .req-modal-card { padding: 28px 20px 22px } }
        @media (min-width: 721px) {
          .req-modal-backdrop { align-items: center; padding: 24px; }
        }
      `}</style>

      <div className="req-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="req-modal-close"
          aria-label={t("popup.close")}
          onClick={onClose}
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
                border: "1px solid #FFFEF9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFEF9",
                fontSize: 22,
              }}
            >
              ✓
            </div>
            <h2
              style={{
                fontFamily: "Coolvetica, Inter, sans-serif",
                fontSize: 24,
                fontWeight: 400,
                color: "#FFFEF9",
                margin: "0 0 10px",
              }}
            >
              {t("popup.sentTitle")}
            </h2>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                lineHeight: 1.6,
                color: "#FFFEF9",
                margin: 0,
              }}
            >
              {t("popup.sentBody")}
            </p>
          </div>
        ) : (
          <>
            {topic ? (
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#FFFEF9",
                  margin: "0 0 14px",
                }}
              >
                {topic}
              </p>
            ) : null}
            <h2
              style={{
                fontFamily: "Coolvetica, Inter, sans-serif",
                fontSize: "clamp(23px, 5vw, 29px)",
                fontWeight: 400,
                lineHeight: 1.2,
                color: "#FFFEF9",
                margin: "0 0 12px",
              }}
            >
              {title || t("v2.modal.defaultTitle")}
            </h2>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                lineHeight: 1.65,
                color: "#FFFEF9",
                margin: "0 0 24px",
              }}
            >
              {subtitle || t("v2.modal.defaultBody")}
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                className="req-modal-input"
                type="text"
                autoComplete="name"
                placeholder={t("popup.namePlaceholder")}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
              />
              <input
                className="req-modal-input"
                type="text"
                autoComplete="tel"
                placeholder={t("popup.contactPlaceholder")}
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                style={inputStyle}
              />
              <textarea
                className="req-modal-input"
                rows={3}
                placeholder={t("v2.modal.messagePlaceholder")}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={{ ...inputStyle, resize: "none" }}
              />

              {error ? (
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#FFFEF9", margin: 0 }}>
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                className="req-modal-submit"
                disabled={loading}
                style={{
                  marginTop: 4,
                  padding: "15px 18px",
                  borderRadius: 2,
                  border: "none",
                  background: "#703C54",
                  color: "#FFFEF9",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  cursor: loading ? "wait" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                {loading ? "…" : t("cta.sendRequest")}
              </button>

              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 11,
                  lineHeight: 1.6,
                  color: "#FFFEF9",
                  margin: "6px 0 0",
                  textAlign: "center",
                }}
              >
                {t("v2.modal.direct")}{" "}
                <a
                  href="https://wa.me/995555505288"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#FFFEF9", fontWeight: 600, textDecoration: "none" }}
                >
                  +995 555 50 52 88
                </a>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
