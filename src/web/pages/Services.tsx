import { useState, useEffect, useRef } from "react";
import { AppLink } from "../components/app-link";
import { useT, type MessageKey } from "../i18n";

const C = {
  dark: "#21141A",
  light: "#FAF7F0",
  teal: "#8CB2C0",
  plum: "#694153",
  muted: "rgba(33,20,26,0.45)",
  border: "rgba(140,178,192,0.15)",
};

const PAGE_STYLES = `
  .services-page {
    background: ${C.light};
    min-height: 100vh;
  }
  .services-narrow {
    max-width: 860px;
    margin: 0 auto;
    padding-left: clamp(24px, 5vw, 0px);
    padding-right: clamp(24px, 5vw, 0px);
    box-sizing: border-box;
  }
  .services-accordion-panel {
    overflow: hidden;
    transition: max-height 0.4s ease;
  }
  .services-accordion-toggle {
    transition: transform 0.3s ease;
    display: inline-block;
    line-height: 1;
  }
  .services-accordion-toggle.open {
    transform: rotate(45deg);
  }
  .services-cta-btn {
    transition: background 0.25s ease, color 0.25s ease;
  }
  .services-cta-btn:hover {
    background: ${C.dark} !important;
    color: ${C.light} !important;
  }
  .services-limits-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px 48px;
  }
  @media (max-width: 768px) {
    .services-hero {
      padding: 100px 24px 64px !important;
    }
    .services-hero h1 {
      font-size: 36px !important;
    }
    .services-section-pad {
      padding: 64px 24px !important;
    }
    .services-accordion-num {
      display: none !important;
    }
    .services-accordion-head {
      padding: 20px 0 !important;
    }
    .services-accordion-title {
      font-size: 18px !important;
    }
    .services-accordion-body {
      padding: 0 0 24px 0 !important;
    }
    .services-limits-grid {
      grid-template-columns: 1fr;
      gap: 28px;
    }
    .services-cta-btn {
      width: 100%;
      text-align: center;
      box-sizing: border-box;
    }
    .services-limits h2 {
      font-size: 26px !important;
    }
    .services-cta h2 {
      font-size: 28px !important;
    }
  }
`;

type ServiceItem = {
  num: string;
  titleKey: MessageKey;
  descriptionKey: MessageKey;
  bullets: string[];
};

const SERVICES: ServiceItem[] = [
  {
    num: "01",
    titleKey: "services.item1.title",
    descriptionKey: "services.item1.desc",
    bullets: [
      "Title history and ownership chain verification",
      "Developer track record: completed projects, delivery timelines, litigation history",
      "Land plot category, encumbrances, and master plan compliance",
      "Contract review: flagging dangerous clauses, requiring amendments before signing",
      "Written due diligence report delivered to the client (3–5 pages)",
      "Developers and projects we decline: unresolved litigation, delays exceeding 18 months, opaque land ownership structures",
    ],
  },
  {
    num: "02",
    titleKey: "services.item2.title",
    descriptionKey: "services.item2.desc",
    bullets: [
      "Goal mapping: rental income / resale / residency / capital preservation",
      "District comparison: Batumi centre, Gonio, Chakvi, Makhinjauri — yield vs risk vs liquidity",
      "Access to off-market and first-release developer inventory only",
      "ROI model per object: conservative, base, and optimistic scenarios",
      "Capacity: twelve client mandates per quarter — your case receives full attention",
    ],
  },
  {
    num: "03",
    titleKey: "services.item3.title",
    descriptionKey: "services.item3.desc",
    bullets: [
      "Design concept tailored to target tenant profile (tourists, expats, long-term)",
      "Detailed cost estimate provided before work begins",
      "Weekly photo progress reports sent to the client",
      "Full furnishing and fit-out included — ready to occupy on handover",
      "Timeline: 45–90 days depending on scope",
    ],
  },
  {
    num: "04",
    titleKey: "services.item4.title",
    descriptionKey: "services.item4.desc",
    bullets: [
      "Bank selection: TBC Bank, Bank of Georgia, Credo Bank",
      "Programme matching for non-resident buyers — a distinct expertise",
      "Rate, deposit, and term negotiation on behalf of the client",
      "Full documentation support for the bank submission process",
      "We represent the client's interest exclusively",
    ],
  },
  {
    num: "05",
    titleKey: "services.item5.title",
    descriptionKey: "services.item5.desc",
    bullets: [
      "Properties shown: due diligence completed before your arrival",
      "Meetings arranged: legal counsel, notary, developer where relevant",
      "Transfer, accommodation, and programme logistics handled in full",
      "Format: a working session with a decision outcome — not a sightseeing tour",
    ],
  },
  {
    num: "06",
    titleKey: "services.item6.title",
    descriptionKey: "services.item6.desc",
    bullets: [
      "Rental strategy: short-term (Airbnb / Booking) or long-term — client's choice",
      "Management model selection: in-house oversight or management company",
      "Monthly statement: occupancy, revenue, and operating costs",
      "Maintenance coordination and tenant issue resolution",
      "Designed for non-resident owners who require full hands-off operation",
    ],
  },
  {
    num: "07",
    titleKey: "services.item7.title",
    descriptionKey: "services.item7.desc",
    bullets: [
      "Residency permit via real estate purchase from $100,000",
      "Georgian tax residency structure: flat-rate framework and cross-border considerations",
      "Georgian bank account opening — before and after purchase",
      "Company registration in Georgia for relocating business owners",
      "Verified referral network: legal, accounting, and tax advisory partners",
    ],
  },
];

const LIMITS = [
  {
    titleKey: "services.limit1.title",
    textKey: "services.limit1.text",
  },
  {
    titleKey: "services.limit2.title",
    textKey: "services.limit2.text",
  },
  {
    titleKey: "services.limit3.title",
    textKey: "services.limit3.text",
  },
  {
    titleKey: "services.limit4.title",
    textKey: "services.limit4.text",
  },
] satisfies { titleKey: MessageKey; textKey: MessageKey }[];

function useIsMobile(bp = 768) {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < bp : false
  );
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < bp);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [bp]);
  return mobile;
}

function AccordionItem({
  service,
  isOpen,
  onToggle,
  isMobile,
}: {
  service: ServiceItem;
  isOpen: boolean;
  onToggle: () => void;
  isMobile: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(isOpen ? 2000 : 0);
  const t = useT();

  useEffect(() => {
    if (panelRef.current) {
      setMaxHeight(isOpen ? panelRef.current.scrollHeight : 0);
    }
  }, [isOpen, isMobile]);

  return (
    <div>
      <button
        type="button"
        className="services-accordion-head"
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "28px 0",
          border: "none",
          borderBottom: `1px solid rgba(140,178,192,0.2)`,
          background: "transparent",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
          <span
            className="services-accordion-num"
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "0.7rem",
              color: C.teal,
              marginRight: "24px",
              opacity: 0.6,
              letterSpacing: "0.1em",
              flexShrink: 0,
            }}
          >
            {service.num}
          </span>
          <span
            className="services-accordion-title"
            style={{
              fontFamily: "Jun, Georgia, serif",
              fontSize: isMobile ? "18px" : "22px",
              color: C.dark,
              fontWeight: 400,
            }}
          >
            {t(service.titleKey)}
          </span>
        </div>
        <span
          className={`services-accordion-toggle${isOpen ? " open" : ""}`}
          style={{
            fontFamily: "Manrope, sans-serif",
            fontSize: "20px",
            color: C.teal,
            flexShrink: 0,
            marginLeft: "16px",
          }}
          aria-hidden
        >
          +
        </span>
      </button>

      <div className="services-accordion-panel" style={{ maxHeight }}>
        <div
          ref={panelRef}
          className="services-accordion-body"
          style={{
            padding: isMobile ? "0 0 24px 0" : "0 0 32px 46px",
          }}
        >
          <p
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "15px",
              color: "rgba(33,20,26,0.65)",
              lineHeight: 1.8,
              maxWidth: "640px",
              margin: "0 0 20px",
            }}
          >
            {t(service.descriptionKey)}
          </p>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {service.bullets.map((item) => (
              <li
                key={item}
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  marginBottom: "10px",
                }}
              >
                <span style={{ color: C.teal, flexShrink: 0, fontFamily: "Manrope, sans-serif" }}>—</span>
                <span
                  style={{
                    fontFamily: "Manrope, sans-serif",
                    fontSize: "14px",
                    color: "rgba(33,20,26,0.7)",
                    lineHeight: 1.7,
                  }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const isMobile = useIsMobile();
  const [openIndex, setOpenIndex] = useState(0);
  const t = useT();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <style>{PAGE_STYLES}</style>
      <div className="services-page">
        {/* ── Hero ── */}
        <section
          className="services-hero"
          style={{
            background: C.dark,
            padding: isMobile ? "100px 24px 64px" : "140px 24px 100px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: C.teal,
              margin: "0 0 20px",
            }}
          >
            {t("services.hero.eyebrow")}
          </p>
          <h1
            style={{
              fontFamily: "Jun, Georgia, serif",
              fontSize: isMobile ? "36px" : "56px",
              color: C.light,
              lineHeight: 1.1,
              fontWeight: 400,
              margin: 0,
            }}
          >
            {t("services.hero.title")}
            <br />
            <em style={{ fontStyle: "italic", color: C.teal }}>{t("services.hero.titleEm")}</em>
          </h1>
          <p
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "17px",
              color: "rgba(250,247,240,0.55)",
              maxWidth: "520px",
              margin: "24px auto 0",
              lineHeight: 1.7,
            }}
          >
            {t("services.hero.body")}
          </p>
        </section>

        {/* ── Accordion services ── */}
        <section
          className="services-section-pad"
          style={{
            background: C.light,
            padding: isMobile ? "64px 24px" : "100px 0",
          }}
        >
          <div className="services-narrow">
            {SERVICES.map((service, index) => (
              <AccordionItem
                key={service.num}
                service={service}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
          </div>
        </section>

        {/* ── What we don't do ── */}
        <section
          className="services-limits services-section-pad"
          style={{
            background: C.dark,
            padding: isMobile ? "64px 24px" : "80px 0",
          }}
        >
          <div className="services-narrow">
            <p
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: C.teal,
                margin: "0 0 16px",
              }}
            >
              {t("services.limits.eyebrow")}
            </p>
            <h2
              style={{
                fontFamily: "Jun, Georgia, serif",
                fontSize: isMobile ? "26px" : "36px",
                color: C.light,
                fontWeight: 400,
                margin: "0 0 40px",
                lineHeight: 1.15,
              }}
            >
              {t("services.limits.title")}
            </h2>
            <div className="services-limits-grid">
              {LIMITS.map((item) => (
                <div
                  key={item.titleKey}
                  style={{
                    borderLeft: `1px solid rgba(140,178,192,0.25)`,
                    paddingLeft: "20px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      fontSize: "13px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: C.light,
                      margin: "0 0 8px",
                      fontWeight: 600,
                    }}
                  >
                    {t(item.titleKey)}
                  </p>
                  <p
                    style={{
                      fontFamily: "Manrope, sans-serif",
                      fontSize: "14px",
                      color: "rgba(250,247,240,0.5)",
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {t(item.textKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section
          className="services-cta services-section-pad"
          style={{
            background: C.light,
            padding: isMobile ? "64px 24px" : "100px 24px 120px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "Jun, Georgia, serif",
              fontSize: isMobile ? "28px" : "42px",
              color: C.dark,
              fontWeight: 400,
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            {t("services.cta.title")}
          </h2>
          <p
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "16px",
              color: "rgba(33,20,26,0.55)",
              margin: "16px auto 40px",
              maxWidth: "460px",
              lineHeight: 1.7,
            }}
          >
            {t("services.cta.body")}
          </p>
          <AppLink
            href="/#contact"
            className="services-cta-btn"
            style={{
              display: "inline-block",
              background: C.teal,
              color: C.dark,
              fontFamily: "Manrope, sans-serif",
              fontSize: "0.72rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              padding: "18px 48px",
              border: "none",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            {t("cta.requestPrivateConsultation")}
          </AppLink>
        </section>
      </div>
    </>
  );
}
