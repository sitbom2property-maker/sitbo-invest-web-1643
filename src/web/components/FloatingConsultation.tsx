import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { RequestModal } from "./RequestModal";
import { useT } from "../i18n";

const SHOW_AFTER_Y = 280;

/**
 * Compact corner CTA — appears after the visitor scrolls,
 * opens the lead form without blocking the page like a sticky bar.
 */
export function FloatingConsultation() {
  const t = useT();
  const [location] = useLocation();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (location.startsWith("/admin")) {
      setVisible(false);
      return;
    }
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_Y);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location]);

  if (location.startsWith("/admin")) return null;

  return (
    <>
      <style>{`
        .float-consult {
          position: fixed;
          right: max(16px, env(safe-area-inset-right));
          bottom: calc(var(--cookie-banner-height, 0px) + max(20px, env(safe-area-inset-bottom)));
          z-index: 850;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 20px;
          border: none;
          border-radius: 999px;
          background: #FFFFFF;
          color: #21141A;
          font-family: Inter, 'DM Sans', Manrope, sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.01em;
          cursor: pointer;
          box-shadow: 0 10px 28px rgba(0,0,0,.28);
          transition: opacity .25s ease, transform .25s ease, box-shadow .2s ease;
        }
        .float-consult.is-hidden {
          opacity: 0;
          pointer-events: none;
          transform: translateY(12px) scale(0.96);
        }
        .float-consult.is-visible {
          opacity: 1;
          pointer-events: auto;
          transform: none;
        }
        .float-consult:hover {
          box-shadow: 0 14px 34px rgba(0,0,0,.34);
        }
        .float-consult-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #48674D; flex-shrink: 0;
          box-shadow: 0 0 0 0 rgba(72,103,77,.45);
          animation: floatConsultPulse 2s ease-in-out infinite;
        }
        @keyframes floatConsultPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(72,103,77,.4); }
          50% { box-shadow: 0 0 0 6px rgba(72,103,77,0); }
        }
        @media (max-width: 640px) {
          .float-consult {
            right: max(12px, env(safe-area-inset-right));
            bottom: calc(var(--cookie-banner-height, 0px) + max(16px, env(safe-area-inset-bottom)));
            padding: 13px 18px;
            font-size: 13px;
          }
        }
      `}</style>

      <button
        type="button"
        className={`float-consult${visible && !open ? " is-visible" : " is-hidden"}`}
        onClick={() => setOpen(true)}
        aria-label={t("float.consult")}
      >
        <span className="float-consult-dot" aria-hidden="true" />
        {t("float.consult")}
      </button>

      <RequestModal
        open={open}
        onClose={() => setOpen(false)}
        source="Floating consultation button"
        title={t("float.consult")}
      />
    </>
  );
}
