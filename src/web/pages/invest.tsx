import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Footer } from "../components/footer";

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  dark:      "#21141A",
  teal:      "#8CB2C0",
  wine:      "#683D47",
  light:     "#FFFBF0",
  parchment: "#F5F3ED",
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
  return (<>

    <div style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 clamp(16px, 4vw, 48px)",
      ...style,
    }}>{children}
    </div>
  
  </>);
}

// ─── 12-col row ───────────────────────────────────────────────────────────────
function Row({ children, gap = 24, style }: { children: React.ReactNode; gap?: number; style?: React.CSSProperties }) {
  return (<>

    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(12, 1fr)",
      gap: `${gap}px`,
      ...style,
    }}>{children}
    </div>
  
  </>);
}

// ─── Column ───────────────────────────────────────────────────────────────────
function Col({
  span = 12, spanMd, children, style
}: {
  span?: number; spanMd?: number; children?: React.ReactNode; style?: React.CSSProperties;
}) {
  const isMobile = useIsMobile();
  const cols = isMobile ? 12 : (spanMd ?? span);
  return (<>

    <div style={{ gridColumn: `span ${cols}`, ...style }}>{children}
    </div>
  
  </>);
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
 { stat: "14.5%",  desc: "Max rental yield — top globally" },
 { stat: "#1",     desc: "World rank for rental profitability (Global Property Guide)" },
 { stat: "0%",     desc: "Property purchase tax for foreign buyers" },
 { stat: "1 day",  desc: "Title transfer via blockchain registry" },
 { stat: "$1,420", desc: "Average price per sqm — still far below European peers" },
 { stat: "1.7M",   desc: "Tourists visited in 2025" },
];

const strategies = [
  { tag: "Strategy 01", title: "Short-Term Rental",      yield: "9–14.5%",          horizon: "Immediate cash flow",   risk: "Low–Medium", icon: "🏖", desc: "Fully furnished apartments listed on Airbnb, Booking.com, and local platforms. Managed remotely via SITBO. Strongest returns in seafront and boulevard locations.",    ideal: "Investors seeking passive income from day one." },
  { tag: "Strategy 02", title: "Off-Plan Appreciation",  yield: "25–30%",            horizon: "18–36 months",          risk: "Medium",     icon: "📈", desc: "Buy at pre-construction pricing, exit at handover. Batumi developers consistently price below completion value. Capital gain locked before tenants even arrive.",          ideal: "Investors with 2–3 year horizon wanting capital growth." },
  { tag: "Strategy 03", title: "Residency Investment",   yield: "Residency + rental",horizon: "Long-term",             risk: "Low",        icon: "🛂", desc: "A $150,000+ qualifying purchase unlocks Georgian residency. Combine legal status with an income-generating asset — one of the most efficient residency-by-investment structures in Europe.", ideal: "Expats and digital nomads seeking legal status." },
  { tag: "Strategy 04", title: "TurnKey Renovation",     yield: "+2–4% yield uplift",horizon: "3–6 months fit-out",    risk: "Low",        icon: "🏛", desc: "SITBO designs and delivers premium interiors that justify 20–40% above-market rental rates. Fixed estimates. No cost overruns. You don't manage a single contractor.",      ideal: "Owners of raw units wanting premium positioning." },
];

const process = [
 { n: "01", title: "Discovery Call",       desc: "30-minute session to define your budget, goals, and timeline. We match you with the right strategy — no generic pitch." },
 { n: "02", title: "Curated Shortlist",    desc: "We filter the market to 3–5 properties that fit your exact criteria. Legal status, yield projections, and floor plans included." },
 { n: "03", title: "Site Tour",            desc: "Fly in for 2 days or join our Discovery Tour. View the units, meet the developers, and see the neighbourhood in person." },
 { n: "04", title: "Legal & Due Diligence",desc: "Our lawyers verify title, check developer track record, and review all contracts. No hidden encumbrances." },
 { n: "05", title: "Transaction",          desc: "Purchase registered on Georgia's blockchain land registry. Title transfer completed in 1 business day." },
 { n: "06", title: "Asset Management",     desc: "We furnish, list, and manage. Monthly reports, rent collection, and maintenance handled end-to-end." },
];

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
        <span style={{ fontFamily: "DM Sans", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: open ? C.teal : C.muted }}>{s.tag}</span>
        <span style={{ fontSize: "1.3rem", lineHeight: 1 }}>{s.icon}</span>
      </div>
      <h3 style={{ fontFamily: "Jun, serif", fontSize: "1.5rem", fontWeight: 600, color: open ? C.light : C.dark, marginBottom: "16px", lineHeight: 1.2 }}>{s.title}</h3>

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "16px" }}>
        <div>
          <div style={{ fontFamily: "DM Sans", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: open ? C.teal : C.muted, marginBottom: "4px" }}>Yield</div>
          <div style={{ fontFamily: "Jun, serif", fontSize: "1.1rem", fontWeight: 700, color: open ? C.teal : C.dark }}>{s.yield}</div>
        </div>
        <div>
          <div style={{ fontFamily: "DM Sans", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: open ? C.teal : C.muted, marginBottom: "4px" }}>Horizon</div>
          <div style={{ fontFamily: "Jun, serif", fontSize: "1.1rem", fontWeight: 700, color: open ? C.light : C.dark }}>{s.horizon}</div>
        </div>
        <div>
          <div style={{ fontFamily: "DM Sans", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: open ? C.teal : C.muted, marginBottom: "4px" }}>Risk</div>
          <div style={{ fontFamily: "Jun, serif", fontSize: "1.1rem", fontWeight: 700, color: open ? C.light : C.dark }}>{s.risk}</div>
        </div>
      </div>

          {open && (
        <div style={{ borderTop: "1px solid rgba(140,178,192,0.15)", paddingTop: "16px", marginTop: "4px" }}>
          <p style={{ fontFamily: "DM Sans", fontSize: "0.85rem", color: "rgba(255,251,240,0.75)", lineHeight: 1.7, marginBottom: "12px" }}>{s.desc}</p>
          <p style={{ fontFamily: "DM Sans", fontSize: "0.78rem", color: C.teal, lineHeight: 1.6, margin: 0 }}>
            <strong>Ideal for:</strong> {s.ideal}
          </p>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "16px" }}>
        <span style={{ fontFamily: "DM Sans", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: open ? C.teal : C.muted }}>
{open ? "Close" : "Learn more"}
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.3s" }}>
          <path d="M2 4l4 4 4-4" stroke={open ? C.teal : C.muted} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  
  </>);
}

function ProcessStep({ step, index }: { step: typeof process[0]; index: number }) {
  return (<>

    <div className="inv-reveal" style={{ transitionDelay: `${index * 80}ms`, display: "flex", gap: "20px", paddingBottom: "32px", borderBottom: "1px solid rgba(33,20,26,0.07)" }}>
      <div style={{ flexShrink: 0, width: "48px", height: "48px", borderRadius: "50%", border: `1.5px solid ${C.wine}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "Jun, serif", fontSize: "0.95rem", fontWeight: 700, color: C.wine }}>{step.n}</span>
      </div>
      <div style={{ paddingTop: "10px" }}>
        <p style={{ fontFamily: "DM Sans", fontSize: "0.9rem", fontWeight: 700, color: C.dark, marginBottom: "6px" }}>{step.title}</p>
        <p style={{ fontFamily: "DM Sans", fontSize: "0.83rem", color: C.muted, lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
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
  useReveal();

  return (<>

    <div style={{ background: C.light, minHeight: "100vh", color: C.dark }}>
{/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section>
        <Container>
          <Row style={{ minHeight: "88vh", alignItems: "center", paddingTop: "48px", paddingBottom: "64px" }}>

{/* Left: headline */}
            <Col span={7} spanMd={7} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div className="inv-reveal">
                <Eyebrow>Real Estate Investment · Batumi, Georgia</Eyebrow>
                <h1 style={{
                  fontFamily: "Jun, serif",
                  fontSize: "clamp(2.8rem, 6vw, 5.2rem)",
                  fontWeight: 400, lineHeight: 1.05,
                  color: C.dark, marginBottom: "28px",
                  letterSpacing: "-0.01em",
                }}>
                  Invest in one<br />
                  of Europe's<br />
                  <em style={{ fontStyle: "italic", color: C.teal }}>highest-yield</em><br />
                  markets.
                </h1>
                <p style={{ fontFamily: "DM Sans", fontSize: "clamp(0.9rem,1.8vw,1.05rem)", color: C.muted, lineHeight: 1.8, maxWidth: "460px", marginBottom: "40px" }}>
                  Georgia ranks #1 in the world for rental yield profitability. 0% purchase tax. 1-day ownership transfer. Full rights for foreign buyers.
                </p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <Link href="/#contact">
                    <a style={{ display: "inline-block", fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, background: C.dark, borderRadius: "8px", padding: "14px 32px", textDecoration: "none" }}>
                      Book a Consultation
                    </a>
                  </Link>
                  <a href="#strategies" style={{ display: "inline-block", fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark, background: "transparent", border: `1px solid ${C.dark}`, borderRadius: "8px", padding: "14px 32px", textDecoration: "none" }}>
                    View Strategies
                  </a>
                </div>
              </div>
            </Col>

{/* Right: hero image + floating stat */}
            <Col span={5} spanMd={5} style={{ position: "relative" }}>
              <div className="inv-reveal" style={{ transitionDelay: "150ms", borderRadius: "16px", overflow: "hidden", aspectRatio: "3/4", background: C.parchment }}>
                <img src="/hero2.png" alt="Batumi investment property"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
              </div>
{/* Floating badge */}
              <div style={{
                position: "absolute", bottom: "24px", left: "-20px",
                background: C.dark, borderRadius: "12px", padding: "16px 20px",
                boxShadow: "0 8px 32px rgba(33,20,26,0.18)",
              }}>
                <div style={{ fontFamily: "Jun, serif", fontSize: "2rem", fontWeight: 700, color: C.teal, lineHeight: 1 }}>14.5%</div>
                <div style={{ fontFamily: "DM Sans", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,251,240,0.5)", marginTop: "4px" }}>Max rental yield</div>
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
                <Eyebrow>Why Batumi</Eyebrow>
                <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: C.dark, lineHeight: 1.15 }}>
                  The numbers<br />speak first.
                </h2>
              </div>
            </Col>
            <Col span={7}>
              <div className="inv-reveal" style={{ transitionDelay: "100ms", paddingTop: isMobile ? "0" : "16px" }}>
                <p style={{ fontFamily: "DM Sans", fontSize: "1rem", color: C.muted, lineHeight: 1.8, maxWidth: "560px" }}>
                  While European capitals yield 2–4%, Batumi consistently delivers 9–14.5% on well-managed short-term rentals. A growing tourist infrastructure, blockchain property registry, and zero purchase tax make it structurally different from other emerging markets.
                </p>
              </div>
            </Col>
          </Row>

{/* Stats 6-col grid on desktop, full-width on mobile */}
          <Row gap={24}>
            {whyBatumi.map((item, i) => (
              <Col key={item.stat} span={4} style={{ marginBottom: isMobile ? "24px" : 0 }}>
                <StatCard stat={item.stat} desc={item.desc} delay={i * 70} />
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
      <section style={{ background: C.dark, padding: "56px 0" }}>
        <Container>
          <Row gap={0}>
{[
 { title: "0% Purchase Tax",          sub: "No stamp duty, no buyer's tax" },
 { title: "Full Foreign Ownership",    sub: "Same rights as Georgian citizens" },
 { title: "1-Day Registration",        sub: "Blockchain land registry" },
 { title: "Residency from $150K",      sub: "Qualifying real estate investment" },
            ].map((item, i) => (
              <Col key={item.title} span={3}>
                <div className="inv-reveal" style={{
                  transitionDelay: `${i * 80}ms`,
                  padding: "24px",
                  borderRight: i < 3 ? "1px solid rgba(140,178,192,0.1)" : "none",
                  textAlign: "center",
                }}>
                  <p style={{ fontFamily: "DM Sans", fontSize: "0.82rem", fontWeight: 700, color: C.light, marginBottom: "6px" }}>{item.title}</p>
                  <p style={{ fontFamily: "DM Sans", fontSize: "0.75rem", color: "rgba(255,251,240,0.45)", margin: 0 }}>{item.sub}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

{/* ── STRATEGIES ───────────────────────────────────────────────────────── */}
      <section id="strategies" style={{ padding: "96px 0" }}>
        <Container>
          <Row style={{ marginBottom: "56px" }}>
            <Col span={6}>
              <div className="inv-reveal">
                <Eyebrow>Investment Strategies</Eyebrow>
                <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: C.dark, lineHeight: 1.15 }}>
                  Four ways<br />to grow your<br />capital here.
                </h2>
              </div>
            </Col>
            <Col span={6}>
              <div className="inv-reveal" style={{ transitionDelay: "100ms", paddingTop: isMobile ? "0" : "20px" }}>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.95rem", color: C.muted, lineHeight: 1.8 }}>
                  Each strategy is validated by SITBO's own portfolio. Click any card to see the full breakdown — yield, timeline, risk profile, and who it's right for.
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
      <section style={{ padding: "96px 0", background: "#F5F3ED" }}>
        <Container>
          <Row gap={48}>
            <Col span={5}>
              <div className="inv-reveal">
                <Eyebrow>Market Context</Eyebrow>
                <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(1.8rem,3.5vw,3rem)", fontWeight: 400, color: C.dark, lineHeight: 1.2, marginBottom: "24px" }}>
                  Still early.<br />Still cheap.
                </h2>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.88rem", color: C.mutedDark, lineHeight: 1.8, marginBottom: "20px" }}>
                  At $1,420/sqm on average, Batumi trades at a fraction of comparable Black Sea and Mediterranean coastal cities. Warsaw is $3,200. Tbilisi is $1,900. Barcelona is $6,000+.
                </p>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.88rem", color: C.mutedDark, lineHeight: 1.8 }}>
                  Infrastructure investment — new boulevard, airport expansion, direct flight routes — is compressing the discount. Early buyers capture both current yield and long-term appreciation.
                </p>
              </div>
            </Col>
            <Col span={7}>
{/* Comparison bars */}
              <div className="inv-reveal" style={{ transitionDelay: "100ms" }}>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted, marginBottom: "24px" }}>
                  Price per sqm comparison · 2025
                </p>
{[
 { city: "Barcelona",  price: 6200, pct: 100 },
 { city: "Lisbon",     price: 4800, pct: 77 },
 { city: "Warsaw",     price: 3200, pct: 52 },
 { city: "Tbilisi",    price: 1900, pct: 31 },
 { city: "Batumi",     price: 1420, pct: 23, highlight: true },
                ].map((row, i) => (
                  <div key={row.city} style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontFamily: "DM Sans", fontSize: "0.82rem", color: row.highlight ? C.dark : C.muted, fontWeight: row.highlight ? 700 : 400 }}>{row.city}</span>
                      <span style={{ fontFamily: "Jun, serif", fontSize: "0.95rem", fontWeight: 600, color: row.highlight ? C.wine : C.muted }}>${row.price.toLocaleString()}</span>
                    </div>
                    <div style={{ height: "3px", background: "rgba(33,20,26,0.1)", borderRadius: "2px" }}>
                      <div style={{ height: "100%", width: `${row.pct}%`, background: row.highlight ? C.wine : "rgba(33,20,26,0.2)", borderRadius: "2px", transition: "width 1s ease" }} />
                    </div>
                  </div>
                ))}
              </div>

{/* Rental yield comparison */}
              <div className="inv-reveal" style={{ transitionDelay: "200ms", marginTop: "40px" }}>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted, marginBottom: "24px" }}>
                  Average gross rental yield · 2025
                </p>
{[
 { city: "Paris",   yield: "2.8%", pct: 19 },
 { city: "Berlin",  yield: "3.2%", pct: 22 },
 { city: "Lisbon",  yield: "4.1%", pct: 28 },
 { city: "Warsaw",  yield: "5.8%", pct: 40 },
 { city: "Batumi",  yield: "9–14.5%", pct: 100, highlight: true },
                ].map((row) => (
                  <div key={row.city} style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontFamily: "DM Sans", fontSize: "0.82rem", color: row.highlight ? C.dark : C.muted, fontWeight: row.highlight ? 700 : 400 }}>{row.city}</span>
                      <span style={{ fontFamily: "Jun, serif", fontSize: "0.95rem", fontWeight: 600, color: row.highlight ? C.wine : C.muted }}>{row.yield}</span>
                    </div>
                    <div style={{ height: "3px", background: "rgba(33,20,26,0.1)", borderRadius: "2px" }}>
                      <div style={{ height: "100%", width: `${row.pct}%`, background: row.highlight ? C.wine : "rgba(33,20,26,0.2)", borderRadius: "2px" }} />
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
                <Eyebrow>How It Works</Eyebrow>
                <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: C.dark, lineHeight: 1.15 }}>
                  From first call<br />to passive income.
                </h2>
              </div>
            </Col>
            <Col span={7}>
              <div className="inv-reveal" style={{ transitionDelay: "100ms", paddingTop: isMobile ? "0" : "20px" }}>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.95rem", color: C.muted, lineHeight: 1.8 }}>
                  We've compressed the entire investment journey into a clear sequence. Most clients go from first contact to title registered in under 30 days.
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
                <Eyebrow>FAQ</Eyebrow>
                <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: C.dark, lineHeight: 1.15 }}>
                  Common<br />questions.
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
                  <p style={{ fontFamily: "DM Sans", fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: C.teal, marginBottom: "16px" }}>Have more questions?</p>
                  <h3 style={{ fontFamily: "Jun, serif", fontSize: "1.6rem", fontWeight: 400, color: C.light, lineHeight: 1.3, marginBottom: "16px" }}>Talk to us directly.</h3>
                  <p style={{ fontFamily: "DM Sans", fontSize: "0.82rem", color: "rgba(255,251,240,0.55)", lineHeight: 1.7, marginBottom: "24px" }}>Our team has closed hundreds of deals for non-resident investors. No pitch — just straight answers.</p>
                  <Link href="/#contact">
                    <a style={{ display: "block", fontFamily: "DM Sans", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark, background: C.teal, borderRadius: "8px", padding: "13px", textDecoration: "none", textAlign: "center" }}>
                      Book a Call
                    </a>
                  </Link>
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
                <Eyebrow>Ready to invest?</Eyebrow>
                <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(2rem,5vw,3.8rem)", fontWeight: 400, color: C.light, lineHeight: 1.1, marginBottom: "24px" }}>
                  Your first property in Batumi<br />
                  <em style={{ fontStyle: "italic", color: C.teal }}>starts with one call.</em>
                </h2>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.95rem", color: "rgba(255,251,240,0.55)", lineHeight: 1.7, maxWidth: "500px", margin: "0 auto 40px" }}>
                  30 minutes. No obligation. We'll assess your budget, goals, and timeline — then tell you exactly what's possible right now.
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  <Link href="/#contact">
                    <a style={{ display: "inline-block", fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark, background: C.teal, borderRadius: "8px", padding: "15px 36px", textDecoration: "none" }}>
                      Book a Free Consultation
                    </a>
                  </Link>
                  <a href="https://wa.me/995555505288" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, background: "transparent", border: "1px solid rgba(140,178,192,0.35)", borderRadius: "8px", padding: "15px 36px", textDecoration: "none" }}>
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />

    </div>
  
  </>);
}
