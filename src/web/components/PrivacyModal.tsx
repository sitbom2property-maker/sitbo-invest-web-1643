import { useEffect } from "react";
import { useT } from "../i18n";

type PrivacyModalProps = {
  open: boolean;
  onClose: () => void;
};

/** Scrollable privacy policy popup — reused from /legal content. */
export function PrivacyModal({ open, onClose }: PrivacyModalProps) {
  const t = useT();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const sections = [
    {
      heading: t("legal.privacy.introduction.heading"),
      body: t("legal.privacy.introduction.body"),
    },
    {
      heading: t("legal.privacy.information.heading"),
      body: t("legal.privacy.information.body"),
    },
    {
      heading: t("legal.privacy.use.heading"),
      body: t("legal.privacy.use.body"),
      list: [
        t("legal.privacy.use.list1"),
        t("legal.privacy.use.list2"),
        t("legal.privacy.use.list3"),
        t("legal.privacy.use.list4"),
      ],
    },
    {
      heading: t("legal.privacy.sharing.heading"),
      body: t("legal.privacy.sharing.body"),
    },
    {
      heading: t("legal.privacy.rights.heading"),
      body: t("legal.privacy.rights.body"),
    },
    {
      heading: t("legal.privacy.changes.heading"),
      body: t("legal.privacy.changes.body"),
    },
  ];

  return (
    <div
      className="privacy-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      onClick={onClose}
    >
      <style>{`
        .privacy-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 3100;
          background: rgba(12, 7, 10, 0.62);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: privacyFade 0.25s ease;
        }
        .privacy-modal-card {
          position: relative;
          width: min(100%, 640px);
          max-height: min(82vh, 720px);
          background: #21141A;
          border: 1px solid rgba(140,178,192,0.1);
          border-radius: 10px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: privacyRise 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
        }
        .privacy-modal-head {
          flex: 0 0 auto;
          padding: 22px 52px 14px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .privacy-modal-head h2 {
          margin: 0 0 6px;
          font-family: JUN, Georgia, serif;
          font-size: clamp(22px, 3vw, 28px);
          font-weight: 600;
          color: #FFFEF9;
          line-height: 1.15;
        }
        .privacy-modal-head p {
          margin: 0;
          font-family: Nunito, sans-serif;
          font-size: 13px;
          color: #FFFEF9;
        }
        .privacy-modal-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: none;
          background: rgba(255,254,249,0.08);
          color: #FFFEF9;
          font-size: 20px;
          line-height: 1;
          cursor: pointer;
        }
        .privacy-modal-close:hover { background: rgba(255,254,249,0.18); }
        .privacy-modal-body {
          flex: 1 1 auto;
          overflow-y: auto;
          overscroll-behavior: contain;
          padding: 20px 24px 28px;
          -webkit-overflow-scrolling: touch;
        }
        .privacy-modal-section { margin: 0 0 22px; }
        .privacy-modal-section:last-child { margin-bottom: 0; }
        .privacy-modal-section h3 {
          margin: 0 0 8px;
          font-family: Nunito, sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #FFFEF9;
        }
        .privacy-modal-section p {
          margin: 0;
          font-family: Nunito, sans-serif;
          font-size: 14px;
          line-height: 1.55;
          color: #FFFEF9;
        }
        .privacy-modal-section ul {
          margin: 10px 0 0;
          padding-left: 18px;
          display: grid;
          gap: 6px;
        }
        .privacy-modal-section li {
          font-family: Nunito, sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: #FFFEF9;
        }
        @keyframes privacyFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes privacyRise {
          from { opacity: 0; transform: translateY(16px) scale(0.98) }
          to { opacity: 1; transform: none }
        }
        @media (max-width: 520px) {
          .privacy-modal-backdrop { align-items: flex-end; padding: 0; }
          .privacy-modal-card {
            width: 100%;
            max-height: 88vh;
            border-radius: 10px 10px 0 0;
          }
        }
      `}</style>

      <div className="privacy-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="privacy-modal-close"
          aria-label={t("popup.close")}
          onClick={onClose}
        >
          ×
        </button>
        <div className="privacy-modal-head">
          <h2 id="privacy-modal-title">{t("legal.privacyTitle")}</h2>
          <p>{t("legal.updated")}</p>
        </div>
        <div className="privacy-modal-body">
          {sections.map((s) => (
            <section key={s.heading} className="privacy-modal-section">
              <h3>{s.heading}</h3>
              <p>{s.body}</p>
              {s.list ? (
                <ul>
                  {s.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
