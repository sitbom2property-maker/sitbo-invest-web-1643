import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { AppLink } from "../components/app-link";
import { useT, type MessageKey } from "../i18n";

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  dark:      "#21141A",
  teal:      "#8CB2C0",
  wine:      "#683D47",
  light:     "#FFFBF0",
  parchment: "#FFFBF0",
  muted:     "#7a7a7a",
  mutedDark: "#4a4a4a",
};

// ─── 12-col grid system ───────────────────────────────────────────────────────
// Max content width: 1200px, gutters: 24px, margin: auto
// On mobile (< 768px): all cols collapse to 12/12 (full width)
// Classes: col-N (desktop), span helpers via inline style colSpan

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

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".inv-reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity = "1";
          (e.target as HTMLElement).style.transform = "translateY(0)";
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.08 }
    );
    els.forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "translateY(28px)";
      (el as HTMLElement).style.transition = "opacity 0.6s ease, transform 0.6s ease";
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
}

// ─── Grid container ───────────────────────────────────────────────────────────
function Container({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 clamp(16px, 4vw, 64px)",
      width: "100%",
      boxSizing: "border-box",
      ...style,
    }}>{children}
    </div>
  );
}

// ─── 12-col row ───────────────────────────────────────────────────────────────
function Row({ children, gap = 24, style }: { children: React.ReactNode; gap?: number; style?: React.CSSProperties }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(12, 1fr)",
      gap: `${gap}px`,
      width: "100%",
      minWidth: 0,
      ...style,
    }}>{children}
    </div>
  );
}

// ─── Column ───────────────────────────────────────────────────────────────────
function Col({
  span = 12, spanMd, children, style
}: {
  span?: number; spanMd?: number; children?: React.ReactNode; style?: React.CSSProperties;
}) {
  const isMobile = useIsMobile();
  const cols = isMobile ? 12 : (spanMd ?? span);
  return (
    <div style={{ gridColumn: `span ${cols}`, minWidth: 0, maxWidth: "100%", ...style }}>{children}
    </div>
  );
}

// ─── Eyebrow ──────────────────────────────────────────────────────────────────
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (<>

    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
      <div style={{ width: "28px", height: "1px", background: C.wine, flexShrink: 0 }} />
      <span style={{ fontFamily: "DM Sans", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted }}>{children}
      </span>
    </div>
  
  </>);
}

// ─── Divider ─────────────────────────────────────────────────────────────────
function Divider() {
  return <div style={{ height: "1px", background: "rgba(33,20,26,0.08)", margin: "0" }} />;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const whyBatumi = [
 { stat: "14.5%",  descKey: "invest.why.stat1" },
 { stat: "#1",     descKey: "invest.why.stat2" },
 { stat: "0%",     descKey: "invest.why.stat3" },
 { stat: "1 day",  descKey: "invest.why.stat4" },
 { stat: "$1,420", descKey: "invest.why.stat5" },
 { stat: "1.7M",   descKey: "invest.why.stat6" },
] satisfies { stat: string; descKey: MessageKey }[];

const strategies = [
  { tagKey: "invest.strategy1.tag", titleKey: "invest.strategy1.title", yield: "9–14.5%", horizonKey: "invest.strategy1.horizon", riskKey: "invest.strategy1.risk", icon: "🏖", descKey: "invest.strategy1.desc", idealKey: "invest.strategy1.ideal" },
  { tagKey: "invest.strategy2.tag", titleKey: "invest.strategy2.title", yield: "25–30%", horizonKey: "invest.strategy2.horizon", riskKey: "invest.strategy2.risk", icon: "📈", descKey: "invest.strategy2.desc", idealKey: "invest.strategy2.ideal" },
  { tagKey: "invest.strategy3.tag", titleKey: "invest.strategy3.title", yieldKey: "invest.strategy3.yield", horizonKey: "invest.strategy3.horizon", riskKey: "invest.strategy3.risk", icon: "🛂", descKey: "invest.strategy3.desc", idealKey: "invest.strategy3.ideal" },
  { tagKey: "invest.strategy4.tag", titleKey: "invest.strategy4.title", yieldKey: "invest.strategy4.yield", horizonKey: "invest.strategy4.horizon", riskKey: "invest.strategy4.risk", icon: "🏛", descKey: "invest.strategy4.desc", idealKey: "invest.strategy4.ideal" },
] satisfies {
  tagKey: MessageKey;
  titleKey: MessageKey;
  yield?: string;
  yieldKey?: MessageKey;
  horizonKey: MessageKey;
  riskKey: MessageKey;
  icon: string;
  descKey: MessageKey;
  idealKey: MessageKey;
}[];

const process = [
 { n: "01", titleKey: "invest.process1.title", descKey: "invest.process1.desc" },
 { n: "02", titleKey: "invest.process2.title", descKey: "invest.process2.desc" },
 { n: "03", titleKey: "invest.process3.title", descKey: "invest.process3.desc" },
 { n: "04", titleKey: "invest.process4.title", descKey: "invest.process4.desc" },
 { n: "05", titleKey: "invest.process5.title", descKey: "invest.process5.desc" },
 { n: "06", titleKey: "invest.process6.title", descKey: "invest.process6.desc" },
] satisfies { n: string; titleKey: MessageKey; descKey: MessageKey }[];

const faqs = [
 { q: "Can foreigners buy property in Georgia?", a: "Yes. Foreign nationals have the same property rights as Georgian citizens — purchase, own, and transfer with zero restrictions." },
 { q: "Is rental income taxed?", a: "Rental income is subject to a 5% flat tax in Georgia (20% if not separately declared). One of the lowest rates in Europe." },
 { q: "What's the minimum budget to invest?", a: "Viable investments start from $60,000–$80,000 for a studio. Residency-qualifying investments require $150,000+." },
 { q: "Do I need to be in Georgia to buy?", a: "No. We can handle the full process remotely, including notarised power of attorney. Many clients close deals without visiting first." },
 { q: "What is the typical rental yield?", a: "Well-located, professionally managed units in Batumi yield 9–14.5% annually. TurnKey-finished units with premium positioning can exceed this." },
 { q: "How long does the purchase take?", a: "From signed offer to registered title: 1–3 business days. Due diligence and property selection take 2–4 weeks typically." },
];

// ─── Components ──────────────────────────────────────────────────────────────

function StatCard({ stat, desc, delay = 0 }: { stat: string; desc: string; delay?: number }) {
  return (<>

    <div className="inv-reveal" style={{ transitionDelay: `${delay}ms`, borderTop: `2px solid ${C.wine}`, paddingTop: "20px" }}>
      <div style={{ fontFamily: "Jun, serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: C.dark, lineHeight: 1, marginBottom: "8px" }}>
        {stat}
      </div>
      <p style={{ fontFamily: "DM Sans", fontSize: "0.8rem", color: C.muted, lineHeight: 1.5, margin: 0 }}>{desc}</p>
    </div>
  
  </>);
}

function StrategyCard({ s, index }: { s: typeof strategies[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const t = useT();
  const yieldText = s.yieldKey ? t(s.yieldKey) : s.yield;
  return (<>

    <div
      className="inv-reveal"
      style={{
        transitionDelay: `${index * 80}ms`,
        background: open ? C.dark : C.light,
        border: `1px solid ${open ? "rgba(140,178,192,0.2)" : "rgba(33,20,26,0.1)"}`,
        borderRadius: "12px",
        padding: "28px 24px",
        cursor: "pointer",
        transition: "background 0.3s, border-color 0.3s",
      }}
      onClick={() => setOpen(!open)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
        <span style={{ fontFamily: "DM Sans", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: open ? C.teal : C.muted }}>{t(s.tagKey)}</span>
        <span style={{ fontSize: "1.3rem", lineHeight: 1 }}>{s.icon}</span>
      </div>
      <h3 style={{ fontFamily: "Jun, serif", fontSize: "1.5rem", fontWeight: 600, color: open ? C.light : C.dark, marginBottom: "16px", lineHeight: 1.2 }}>{t(s.titleKey)}</h3>

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "16px" }}>
        <div>
          <div style={{ fontFamily: "DM Sans", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: open ? C.teal : C.muted, marginBottom: "4px" }}>{t("invest.strategy.yield")}</div>
          <div style={{ fontFamily: "Jun, serif", fontSize: "1.1rem", fontWeight: 700, color: open ? C.teal : C.dark }}>{yieldText}</div>
        </div>
        <div>
          <div style={{ fontFamily: "DM Sans", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: open ? C.teal : C.muted, marginBottom: "4px" }}>{t("invest.strategy.horizon")}</div>
          <div style={{ fontFamily: "Jun, serif", fontSize: "1.1rem", fontWeight: 700, color: open ? C.light : C.dark }}>{t(s.horizonKey)}</div>
        </div>
        <div>
          <div style={{ fontFamily: "DM Sans", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: open ? C.teal : C.muted, marginBottom: "4px" }}>{t("invest.strategy.risk")}</div>
          <div style={{ fontFamily: "Jun, serif", fontSize: "1.1rem", fontWeight: 700, color: open ? C.light : C.dark }}>{t(s.riskKey)}</div>
        </div>
      </div>

          {open && (
        <div style={{ borderTop: "1px solid rgba(140,178,192,0.15)", paddingTop: "16px", marginTop: "4px" }}>
          <p style={{ fontFamily: "DM Sans", fontSize: "0.85rem", color: "rgba(255,251,240,0.75)", lineHeight: 1.7, marginBottom: "12px" }}>{t(s.descKey)}</p>
          <p style={{ fontFamily: "DM Sans", fontSize: "0.78rem", color: C.teal, lineHeight: 1.6, margin: 0 }}>
            <strong>{t("invest.strategy.idealFor")}</strong> {t(s.idealKey)}
          </p>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "16px" }}>
        <span style={{ fontFamily: "DM Sans", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: open ? C.teal : C.muted }}>
            {open ? t("cta.close") : t("cta.learnMore")}
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}>
          <path d="M2 4l4 4 4-4" stroke={open ? C.teal : C.muted} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  
  </>);
}

function ProcessStep({ step, index }: { step: typeof process[0]; index: number }) {
  const t = useT();
  return (<>

    <div className="inv-reveal" style={{ transitionDelay: `${index * 80}ms`, display: "flex", gap: "20px", paddingBottom: "32px", borderBottom: "1px solid rgba(33,20,26,0.07)" }}>
      <div style={{ flexShrink: 0, width: "48px", height: "48px", borderRadius: "50%", border: `1.5px solid ${C.wine}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "Jun, serif", fontSize: "0.95rem", fontWeight: 700, color: C.wine }}>{step.n}</span>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <p style={{ fontFamily: "DM Sans", fontSize: "0.9rem", fontWeight: 700, color: C.dark, marginBottom: "6px" }}>{t(step.titleKey)}</p>
        <p style={{ fontFamily: "DM Sans", fontSize: "0.83rem", color: C.muted, lineHeight: 1.7, margin: 0 }}>{t(step.descKey)}</p>
      </div>
    </div>
  
  </>);
}

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false);
  return (<>

    <div style={{ borderBottom: "1px solid rgba(33,20,26,0.08)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "22px 0", gap: "16px", textAlign: "left",
        }}
      >
        <span style={{ fontFamily: "DM Sans", fontSize: "0.92rem", fontWeight: 600, color: C.dark, lineHeight: 1.4 }}>{faq.q}</span>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}>
          <path d="M4 7l5 5 5-5" stroke={C.wine} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
          {open && (
        <p style={{ fontFamily: "DM Sans", fontSize: "0.85rem", color: C.muted, lineHeight: 1.7, margin: "0 0 20px", paddingRight: "32px" }}>{faq.a}</p>
      )}
    </div>
  
  </>);
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function InvestPage() {
  const isMobile = useIsMobile();
  const t = useT();
  useReveal();

  return (<>

    <div className="invest-page" style={{ background: C.light, minHeight: "100vh", color: C.dark, overflowX: "hidden", width: "100%" }}>
      <style>{`
        .invest-page p, .invest-page h1, .invest-page h2, .invest-page h3 {
          overflow-wrap: anywhere;
          word-break: break-word;
        }
        @media (max-width: 767px) {
          .invest-hero-cta {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
            width: 100% !important;
          }
          .invest-hero-cta a {
            text-align: center !important;
            padding: 14px 10px !important;
            font-size: 0.68rem !important;
            letter-spacing: 0.08em !important;
            box-sizing: border-box !important;
            width: 100% !important;
          }
          .invest-float-badge {
            left: 12px !important;
            right: auto !important;
            bottom: 12px !important;
          }
          .invest-chart-wrap {
            width: 100% !important;
            max-width: 100% !important;
            overflow: hidden !important;
          }
        }
      `}</style>
{/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section>
        <Container>
          <Row style={{ minHeight: isMobile ? "auto" : "88vh", alignItems: "center", paddingTop: isMobile ? "24px" : "48px", paddingBottom: isMobile ? "40px" : "64px" }}>

{/* Left: headline */}
            <Col span={7} spanMd={7} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div className="inv-reveal">
                <h1 style={{
                  fontFamily: "Jun, serif",
                  fontSize: "clamp(2.2rem, 8vw, 5.2rem)",
                  fontWeight: 400, lineHeight: 1.05,
                  color: C.dark, marginBottom: "28px",
                  letterSpacing: "-0.01em",
                  maxWidth: "100%",
                }}>
                  {t("invest.hero.line1")}<br />
                  {t("invest.hero.line2")}<br />
                  <em style={{ fontStyle: "italic", color: C.teal }}>{t("invest.hero.line3")}</em><br />
                  {t("invest.hero.line4")}
                </h1>
                <div className="invest-hero-cta" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <AppLink href="/#contact" style={{ display: "inline-block", fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, background: C.dark, borderRadius: "8px", padding: "14px 32px", textDecoration: "none" }}>
                    {t("invest.hero.ctaConsultation")}
                  </AppLink>
                  <a href="#strategies" style={{ display: "inline-block", fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark, background: "transparent", border: `1px solid ${C.dark}`, borderRadius: "8px", padding: "14px 32px", textDecoration: "none" }}>
                    {t("invest.hero.ctaStrategies")}
                  </a>
                </div>
              </div>
            </Col>

{/* Right: hero image + floating stat */}
            <Col span={5} spanMd={5} style={{ position: "relative" }}>
              <div className="inv-reveal" style={{ transitionDelay: "150ms", borderRadius: "16px", overflow: "hidden", aspectRatio: isMobile ? "4/5" : "3/4", background: C.light }}>
                <img src="/hero2.png" alt={t("invest.hero.imageAlt")}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
              </div>
{/* Floating badge */}
              <div
                className="invest-float-badge"
                style={{
                position: "absolute", bottom: "24px", left: isMobile ? "12px" : "-20px",
                background: C.dark, borderRadius: "12px", padding: "16px 20px",
                boxShadow: "0 8px 32px rgba(33,20,26,0.18)",
              }}>
                <div style={{ fontFamily: "Jun, serif", fontSize: "2rem", fontWeight: 700, color: C.teal, lineHeight: 1 }}>14.5%</div>
                <div style={{ fontFamily: "DM Sans", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,251,240,0.5)", marginTop: "4px" }}>{t("invest.hero.badgeLabel")}</div>
              </div>
            </Col>

          </Row>
        </Container>
      </section>

      <Divider />

{/* ── WHY BATUMI ───────────────────────────────────────────────────────── */}
      <section id="why-batumi" style={{ padding: "96px 0" }}>
        <Container>
          <Row style={{ marginBottom: "64px" }}>
            <Col span={5}>
              <div className="inv-reveal">
                <Eyebrow>{t("invest.why.eyebrow")}</Eyebrow>
                <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: C.dark, lineHeight: 1.15 }}>
                  {t("invest.why.title")}
                </h2>
              </div>
            </Col>
            <Col span={7}>
              <div className="inv-reveal" style={{ transitionDelay: "100ms", paddingTop: isMobile ? "0" : "16px" }}>
                <p style={{ fontFamily: "DM Sans", fontSize: "1rem", color: C.muted, lineHeight: 1.8, maxWidth: "560px" }}>
                  {t("invest.why.body")}
                </p>
              </div>
            </Col>
          </Row>

{/* Stats 6-col grid on desktop, full-width on mobile */}
          <Row gap={24}>
            {whyBatumi.map((item, i) => (
              <Col key={item.stat} span={4} style={{ marginBottom: isMobile ? "24px" : 0 }}>
                <StatCard stat={item.stat} desc={t(item.descKey)} delay={i * 70} />
              </Col>
            ))}
          </Row>

{/* Forbes quote */}
          <Row style={{ marginTop: "80px" }}>
            <Col span={8} spanMd={8} style={{ margin: isMobile ? "0" : "0 auto" }}>
              <div className="inv-reveal" style={{ borderLeft: `2px solid ${C.teal}`, paddingLeft: "24px" }}>
                <p style={{ fontFamily: "Jun, serif", fontSize: "clamp(1.2rem,2.5vw,1.8rem)", fontWeight: 300, fontStyle: "italic", color: C.dark, lineHeight: 1.5, marginBottom: "12px" }}>
                  "Georgia is a country with an extraordinary landscape and a promising path toward prosperity. We see immense potential here."
                </p>
                <span style={{ fontFamily: "DM Sans", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.teal }}>
                  Mohamed Alabbar — Eagle Hills, UAE
                </span>
              </div>
            </Col>
          </Row>

        </Container>
      </section>

      <Divider />

{/* ── ADVANTAGES STRIP ─────────────────────────────────────────────────── */}
      <section style={{ background: C.dark, padding: isMobile ? "40px 0" : "56px 0" }}>
        <Container>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
            gap: isMobile ? 0 : 0,
            width: "100%",
          }}>
{[
 { title: t("invest.advantage.purchaseTax.title"), sub: t("invest.advantage.purchaseTax.sub") },
 { title: t("invest.advantage.ownership.title"), sub: t("invest.advantage.ownership.sub") },
 { title: t("invest.advantage.registration.title"), sub: t("invest.advantage.registration.sub") },
 { title: t("invest.advantage.residency.title"), sub: t("invest.advantage.residency.sub") },
            ].map((item, i) => (
                <div key={item.title} className="inv-reveal" style={{
                  transitionDelay: `${i * 80}ms`,
                  padding: isMobile ? "20px 12px" : "24px",
                  borderRight: !isMobile && i < 3 ? "1px solid rgba(140,178,192,0.1)" : "none",
                  borderBottom: isMobile && i < 2 ? "1px solid rgba(140,178,192,0.1)" : "none",
                  textAlign: "center",
                  minWidth: 0,
                }}>
                  <p style={{ fontFamily: "DM Sans", fontSize: isMobile ? "0.72rem" : "0.82rem", fontWeight: 700, color: C.light, marginBottom: "6px", lineHeight: 1.35 }}>{item.title}</p>
                  <p style={{ fontFamily: "DM Sans", fontSize: "0.72rem", color: "rgba(255,251,240,0.45)", margin: 0, lineHeight: 1.4 }}>{item.sub}</p>
                </div>
            ))}
          </div>
        </Container>
      </section>

{/* ── STRATEGIES ───────────────────────────────────────────────────────── */}
      <section id="strategies" className="scroll-mt-24" style={{ padding: "96px 0" }}>
        <Container>
          <Row style={{ marginBottom: "56px" }}>
            <Col span={6}>
              <div className="inv-reveal">
                <Eyebrow>{t("invest.strategies.eyebrow")}</Eyebrow>
                <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: C.dark, lineHeight: 1.15 }}>
                  {t("invest.strategies.title")}
                </h2>
              </div>
            </Col>
            <Col span={6}>
              <div className="inv-reveal" style={{ transitionDelay: "100ms", paddingTop: isMobile ? "0" : "20px" }}>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.95rem", color: C.muted, lineHeight: 1.8 }}>
                  {t("invest.strategies.body")}
                </p>
              </div>
            </Col>
          </Row>

          <Row gap={20}>
            {strategies.map((s, i) => (
              <Col key={s.tag} span={6}>
                <StrategyCard s={s} index={i} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <Divider />

{/* ── MARKET CONTEXT ───────────────────────────────────────────────────── */}
      <section style={{ padding: isMobile ? "64px 0" : "96px 0", background: "#FFFBF0" }}>
        <Container>
          <Row gap={isMobile ? 32 : 48}>
            <Col span={5}>
              <div className="inv-reveal">
                <Eyebrow>{t("invest.market.eyebrow")}</Eyebrow>
                <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(1.8rem,3.5vw,3rem)", fontWeight: 400, color: C.dark, lineHeight: 1.2, marginBottom: 0 }}>
                  {t("invest.market.title")}
                </h2>
              </div>
            </Col>
            <Col span={7}>
{/* Comparison bars */}
              <div className="inv-reveal invest-chart-wrap" style={{ transitionDelay: "100ms" }}>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted, marginBottom: "24px" }}>
                  {t("invest.market.priceComparison")}
                </p>
{[
 { city: "Barcelona",  price: 6200, pct: 100 },
 { city: "Lisbon",     price: 4800, pct: 77 },
 { city: "Warsaw",     price: 3200, pct: 52 },
 { city: "Tbilisi",    price: 1900, pct: 31 },
 { city: "Batumi",     price: 1420, pct: 23, highlight: true },
                ].map((row) => (
                  <div key={row.city} style={{ marginBottom: "16px", minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: "6px" }}>
                      <span style={{ fontFamily: "DM Sans", fontSize: "0.82rem", color: row.highlight ? C.dark : C.muted, fontWeight: row.highlight ? 700 : 400 }}>{row.city}</span>
                      <span style={{ fontFamily: "Jun, serif", fontSize: "0.95rem", fontWeight: 600, color: row.highlight ? C.wine : C.muted, flexShrink: 0 }}>${row.price.toLocaleString()}</span>
                    </div>
                    <div style={{ height: "3px", background: "rgba(33,20,26,0.1)", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${row.pct}%`, maxWidth: "100%", background: row.highlight ? C.wine : "rgba(33,20,26,0.2)", borderRadius: "2px", transition: "width 1s ease" }} />
                    </div>
                  </div>
                ))}
              </div>

{/* Rental yield comparison */}
              <div className="inv-reveal invest-chart-wrap" style={{ transitionDelay: "200ms", marginTop: "40px" }}>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted, marginBottom: "24px" }}>
                  {t("invest.market.yieldComparison")}
                </p>
{[
 { city: "Paris",   yield: "2.8%", pct: 19 },
 { city: "Berlin",  yield: "3.2%", pct: 22 },
 { city: "Lisbon",  yield: "4.1%", pct: 28 },
 { city: "Warsaw",  yield: "5.8%", pct: 40 },
 { city: "Batumi",  yield: "9–14.5%", pct: 100, highlight: true },
                ].map((row) => (
                  <div key={row.city} style={{ marginBottom: "16px", minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: "6px" }}>
                      <span style={{ fontFamily: "DM Sans", fontSize: "0.82rem", color: row.highlight ? C.dark : C.muted, fontWeight: row.highlight ? 700 : 400 }}>{row.city}</span>
                      <span style={{ fontFamily: "Jun, serif", fontSize: "0.95rem", fontWeight: 600, color: row.highlight ? C.wine : C.muted, flexShrink: 0 }}>{row.yield}</span>
                    </div>
                    <div style={{ height: "3px", background: "rgba(33,20,26,0.1)", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${row.pct}%`, maxWidth: "100%", background: row.highlight ? C.wine : "rgba(33,20,26,0.2)", borderRadius: "2px" }} />
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

{/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section id="process" style={{ padding: "96px 0" }}>
        <Container>
          <Row style={{ marginBottom: "64px" }}>
            <Col span={5}>
              <div className="inv-reveal">
                <Eyebrow>{t("invest.process.eyebrow")}</Eyebrow>
                <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: C.dark, lineHeight: 1.15 }}>
                  {t("invest.process.title")}
                </h2>
              </div>
            </Col>
            <Col span={7}>
              <div className="inv-reveal" style={{ transitionDelay: "100ms", paddingTop: isMobile ? "0" : "20px" }}>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.95rem", color: C.muted, lineHeight: 1.8 }}>
                  {t("invest.process.body")}
                </p>
              </div>
            </Col>
          </Row>

          <Row gap={48}>
            <Col span={6}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {process.slice(0, 3).map((step, i) => (
                  <ProcessStep key={step.n} step={step} index={i} />
                ))}
              </div>
            </Col>
            <Col span={6}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {process.slice(3).map((step, i) => (
                  <ProcessStep key={step.n} step={step} index={i + 3} />
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Divider />

{/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section style={{ padding: "96px 0", background: C.light }}>
        <Container>
          <Row style={{ marginBottom: "56px" }}>
            <Col span={5}>
              <div className="inv-reveal">
                <Eyebrow>{t("invest.faq.eyebrow")}</Eyebrow>
                <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: C.dark, lineHeight: 1.15 }}>
                  {t("invest.faq.title")}
                </h2>
              </div>
            </Col>
          </Row>

          <Row>
            <Col span={8} style={{ margin: "0" }}>
              {faqs.map((faq, i) => (
                <FAQItem key={faq.q} faq={faq} index={i} />
              ))}
            </Col>
            <Col span={4}>
              {!isMobile && (
                <div className="inv-reveal" style={{ position: "sticky", top: "96px", background: C.dark, borderRadius: "16px", padding: "32px 28px" }}>
                  <p style={{ fontFamily: "DM Sans", fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: C.teal, marginBottom: "16px" }}>{t("invest.faq.moreQuestions")}</p>
                  <h3 style={{ fontFamily: "Jun, serif", fontSize: "1.6rem", fontWeight: 400, color: C.light, lineHeight: 1.3, marginBottom: "16px" }}>{t("invest.faq.talkDirectly")}</h3>
                  <p style={{ fontFamily: "DM Sans", fontSize: "0.82rem", color: "rgba(255,251,240,0.55)", lineHeight: 1.7, marginBottom: "24px" }}>{t("invest.faq.body")}</p>
                  <AppLink href="/#contact" style={{ display: "block", fontFamily: "DM Sans", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark, background: C.teal, borderRadius: "8px", padding: "13px", textDecoration: "none", textAlign: "center" }}>
                    {t("cta.bookCall")}
                  </AppLink>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>

{/* ── CTA FOOTER ───────────────────────────────────────────────────────── */}
      <section style={{ background: C.dark, padding: "96px 0" }}>
        <Container>
          <Row>
            <Col span={8} style={{ margin: "0 auto", textAlign: "center" }}>
              <div className="inv-reveal">
                <Eyebrow>{t("invest.cta.eyebrow")}</Eyebrow>
                <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(2rem,5vw,3.8rem)", fontWeight: 400, color: C.light, lineHeight: 1.1, marginBottom: "24px" }}>
                  {t("invest.cta.title")}
                </h2>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.95rem", color: "rgba(255,251,240,0.55)", lineHeight: 1.7, maxWidth: "500px", margin: "0 auto 40px" }}>
                  {t("invest.cta.body")}
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  <AppLink href="/#contact" style={{ display: "inline-block", fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark, background: C.teal, borderRadius: "8px", padding: "15px 36px", textDecoration: "none" }}>
                    {t("cta.bookFreeConsultation")}
                  </AppLink>
                  <a href="https://wa.me/995555505288" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, background: "transparent", border: "1px solid rgba(140,178,192,0.35)", borderRadius: "8px", padding: "15px 36px", textDecoration: "none" }}>
                    {t("cta.whatsappUs")}
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

    </div>
  
  </>);
}
