import { useEffect } from "react";
import {
  FEATURE_CATEGORY_ORDER,
  normalizeProjectFeatures,
  type FeatureCategory,
  type FeatureIconId,
  type ProjectFeatureItem,
} from "../data/feature-meta";
import { useT, type MessageKey } from "../i18n";

const C = {
  dark: "#21141A",
  light: "#FFFEF9",
  teal: "#48674D",
  line: "rgba(33,20,26,0.14)",
  muted: "rgba(33,20,26,0.55)",
};

const CATEGORY_KEYS: Record<FeatureCategory, MessageKey> = {
  lot: "project.features.lot",
  indoor: "project.features.indoor",
  outdoor: "project.features.outdoor",
};

function FeatureIcon({ id }: { id: FeatureIconId }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: C.dark,
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (id) {
    case "sea":
      return (
        <svg {...common}>
          <path d="M3 15c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0" />
          <path d="M3 19c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0" />
          <circle cx="12" cy="7" r="2.5" />
        </svg>
      );
    case "mountain":
      return (
        <svg {...common}>
          <path d="m3 18 5.5-8 3.5 5 2.5-3.5L21 18Z" />
          <path d="m10 12 2-2.5 2 2" />
        </svg>
      );
    case "beach":
      return (
        <svg {...common}>
          <path d="M12 4v9" />
          <path d="M7 9c2.5-2.5 7.5-2.5 10 0" />
          <path d="M4 18h16" />
          <path d="M6 18c1-2 2.5-3 6-3s5 1 6 3" />
        </svg>
      );
    case "panorama":
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="12" rx="1" />
          <path d="M3 14l4-3 3 2 4-4 7 5" />
        </svg>
      );
    case "pool":
      return (
        <svg {...common}>
          <path d="M4 10h16v5H4z" />
          <path d="M7 10V8a2 2 0 0 1 2-2h0" />
          <path d="M4 17c1.2-.8 2.4-.8 3.6 0s2.4.8 3.6 0 2.4-.8 3.6 0 2.4.8 3.6 0" />
        </svg>
      );
    case "gym":
      return (
        <svg {...common}>
          <path d="M6 9v6M18 9v6M9 8v8M15 8v8M9 12h6" />
          <path d="M4 10.5v3M20 10.5v3" />
        </svg>
      );
    case "cinema":
      return (
        <svg {...common}>
          <circle cx="8" cy="12" r="3" />
          <circle cx="16" cy="12" r="3" />
          <path d="M11 12h2" />
        </svg>
      );
    case "elevator":
      return (
        <svg {...common}>
          <rect x="5" y="3" width="14" height="18" rx="1" />
          <path d="m9 10 3-3 3 3M9 14l3 3 3-3" />
        </svg>
      );
    case "parking":
      return (
        <svg {...common}>
          <rect x="4" y="3" width="16" height="18" rx="1" />
          <path d="M9 17V7h4.2a3 3 0 0 1 0 6H9" />
        </svg>
      );
    case "balcony":
      return (
        <svg {...common}>
          <path d="M4 14h16v5H4z" />
          <path d="M6 14V9h12v5" />
          <path d="M8 19v2M12 19v2M16 19v2" />
        </svg>
      );
    case "court":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4v16M4 12h16" />
          <path d="M7 7c2 2 8 2 10 0M7 17c2-2 8-2 10 0" />
        </svg>
      );
    case "park":
      return (
        <svg {...common}>
          <path d="M12 21V11" />
          <path d="M12 11c-3 0-5-2.2-5-5 3 0 5 2.2 5 5Z" />
          <path d="M12 11c3 0 5-2.2 5-5-3 0-5 2.2-5 5Z" />
          <path d="M8 21h8" />
        </svg>
      );
    case "security":
      return (
        <svg {...common}>
          <path d="M12 3 5 6v5c0 4.5 3 8.2 7 9.5 4-1.3 7-5 7-9.5V6l-7-3Z" />
          <path d="m9.5 12 1.8 1.8L15 10" />
        </svg>
      );
    case "hotel":
      return (
        <svg {...common}>
          <path d="M4 19V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12" />
          <path d="M16 11h2a2 2 0 0 1 2 2v6" />
          <path d="M8 19v-4h6v4M8 9h.01M12 9h.01" />
        </svg>
      );
    case "shop":
      return (
        <svg {...common}>
          <path d="M4 8h16l-1.2 11H5.2L4 8Z" />
          <path d="M8 8V6a4 4 0 0 1 8 0v2" />
        </svg>
      );
    case "kids":
      return (
        <svg {...common}>
          <circle cx="12" cy="7" r="2.5" />
          <path d="M8 20v-5a4 4 0 0 1 8 0v5" />
          <path d="M6 12h12" />
        </svg>
      );
    case "spa":
      return (
        <svg {...common}>
          <path d="M8 14c0-3 2-6 4-8 2 2 4 5 4 8a4 4 0 0 1-8 0Z" />
          <path d="M9 18h6" />
        </svg>
      );
    case "office":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="1" />
          <path d="M8 8h3v3H8zM13 8h3v3h-3zM8 13h3v3H8zM13 13h3v3h-3z" />
        </svg>
      );
    case "yacht":
      return (
        <svg {...common}>
          <path d="M4 16h14l-2 3H7l-3-3Z" />
          <path d="M7 16V8l7 3v5" />
          <path d="M14 11h4" />
        </svg>
      );
    case "building":
      return (
        <svg {...common}>
          <path d="M5 20V6l7-3 7 3v14" />
          <path d="M9 20v-5h6v5M9 9h.01M12 9h.01M15 9h.01M9 12h.01M12 12h.01M15 12h.01" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="7" />
          <path d="m10 12 1.5 1.5L14.5 10" />
        </svg>
      );
  }
}

function FeatureRow({ item }: { item: ProjectFeatureItem }) {
  return (
    <div className="pf-item">
      <span className="pf-icon">
        <FeatureIcon id={item.icon} />
      </span>
      <span className="pf-label" title={item.label}>
        {item.label}
      </span>
    </div>
  );
}

type Props = {
  features: string[];
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  isMobile?: boolean;
};

export function ProjectFeatures({ features, open, onOpen, onClose, isMobile }: Props) {
  const t = useT();
  const items = normalizeProjectFeatures(features);
  const previewCount = isMobile ? 6 : 9;
  const preview = items.slice(0, previewCount);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const grouped = FEATURE_CATEGORY_ORDER.map((category) => ({
    category,
    items: items.filter((f) => f.category === category),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      <style>{PF_CSS}</style>
      <div className="pf-block pr-reveal">
        <h3 className="pf-title">{t("project.features")}</h3>
        <div className="pf-grid">
          {preview.map((item) => (
            <FeatureRow key={item.id} item={item} />
          ))}
        </div>
        {items.length > previewCount ? (
          <button type="button" className="pf-view-all" onClick={onOpen}>
            {t("project.features.viewAll", { count: items.length })}
          </button>
        ) : items.length > 0 ? (
          <button type="button" className="pf-view-all" onClick={onOpen}>
            {t("project.features.viewAll", { count: items.length })}
          </button>
        ) : null}
      </div>

      {open ? (
        <div className="pf-overlay" role="presentation" onClick={onClose}>
          <div
            className="pf-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pf-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pf-modal-head">
              <h2 id="pf-modal-title">{t("project.features")}</h2>
              <button type="button" className="pf-close" aria-label={t("cookie.close")} onClick={onClose}>
                ✕
              </button>
            </div>
            <div className="pf-modal-body">
              {grouped.map((group) => (
                <section key={group.category} className="pf-section">
                  <h3>{t(CATEGORY_KEYS[group.category])}</h3>
                  <div className="pf-grid pf-grid-modal">
                    {group.items.map((item) => (
                      <FeatureRow key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

const PF_CSS = `
.pf-block { margin: 40px 0; }
.pf-title {
  font-family: Coolvetica, Inter, sans-serif;
  font-size: clamp(1.35rem, 2.2vw, 1.7rem);
  font-weight: 500;
  color: ${C.dark};
  line-height: 1.25;
  margin: 0 0 28px;
}
.pf-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px 36px;
}
.pf-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
}
.pf-icon {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}
.pf-label {
  font-family: Inter, sans-serif;
  font-size: 16px;
  line-height: 1.35;
  color: ${C.dark};
  border-bottom: 1px solid ${C.line};
  padding-bottom: 2px;
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
  word-break: break-word;
  min-width: 0;
}
.pf-view-all {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 28px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: ${C.teal};
}
.pf-view-all::after { content: " ›"; font-size: 1.1em; line-height: 1; }
.pf-view-all:hover { opacity: .75; }
.pf-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(33,20,26,.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  box-sizing: border-box;
}
.pf-modal {
  width: min(920px, 100%);
  max-height: min(82vh, 860px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: ${C.light};
  color: ${C.dark};
  border-radius: 2px;
  box-shadow: 0 24px 80px rgba(0,0,0,.28);
}
.pf-modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 28px 16px;
  border-bottom: 1px solid ${C.line};
  flex-shrink: 0;
}
.pf-modal-head h2 {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: ${C.dark};
}
.pf-close {
  width: 36px; height: 36px;
  border: none; border-radius: 2px;
  background: transparent; color: ${C.dark};
  font-size: 20px; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
}
.pf-close:hover { background: rgba(33,20,26,.06); }
.pf-modal-body {
  padding: 8px 28px 28px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.pf-section {
  padding: 20px 0;
  border-bottom: 1px solid ${C.line};
}
.pf-section:last-child { border-bottom: none; padding-bottom: 8px; }
.pf-section h3 {
  margin: 0 0 18px;
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: ${C.dark};
}
.pf-grid-modal { gap: 18px 28px; }
@media (max-width: 768px) {
  .pf-grid { grid-template-columns: 1fr; gap: 16px; }
  .pf-overlay {
    align-items: flex-end;
    padding: 0;
  }
  .pf-modal {
    width: 100%;
    max-height: 50vh;
    border-radius: 2px 2px 0 0;
  }
  .pf-modal-head { padding: 18px 18px 14px; }
  .pf-modal-body { padding: 4px 18px 20px; }
  .pf-grid-modal { grid-template-columns: 1fr; gap: 14px; }
}
@media (min-width: 769px) and (max-width: 980px) {
  .pf-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .pf-grid-modal { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
`;
