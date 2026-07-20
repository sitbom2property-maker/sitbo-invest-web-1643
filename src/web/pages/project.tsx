import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { projects, type Project } from "../data/projects";
import { AppLink } from "../components/app-link";
import { useRates } from "../context/RatesContext";
import { useT } from "../i18n";

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

function useIsMobile(bp = 768) {
  const [m, setM] = useState(() => typeof window !== "undefined" ? window.innerWidth < bp : false);
  useEffect(() => {
    const h = () => setM(window.innerWidth < bp);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [bp]);
  return m;
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".pr-reveal");
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) {
        (e.target as HTMLElement).style.opacity = "1";
        (e.target as HTMLElement).style.transform = "translateY(0)";
        io.unobserve(e.target);
      }
    }), { threshold: 0.06 });
    els.forEach(el => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "translateY(20px)";
      (el as HTMLElement).style.transition = "opacity 0.55s ease, transform 0.55s ease";
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
}

// ─── Grid ─────────────────────────────────────────────────────────────────────
function Container({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(16px,4vw,48px)", width: "100%", boxSizing: "border-box", ...style }}>{children}</div>;
}
function Row({ children, gap = 24, style }: { children: React.ReactNode; gap?: number; style?: React.CSSProperties }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: `${gap}px`, width: "100%", minWidth: 0, ...style }}>{children}</div>;
}
function Col({ span = 12, spanMd, children, style }: { span?: number; spanMd?: number; children?: React.ReactNode; style?: React.CSSProperties }) {
  const isMobile = useIsMobile();
  return <div style={{ gridColumn: `span ${isMobile ? 12 : (spanMd ?? span)}`, minWidth: 0, maxWidth: "100%", ...style }}>{children}</div>;
}
function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (<>

    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
      <div style={{ width: "24px", height: "1px", background: C.wine, flexShrink: 0 }} />
      <span style={{ fontFamily: "DM Sans", fontSize: "0.63rem", letterSpacing: "0.18em", textTransform: "uppercase", color: light ? "rgba(255,251,240,0.5)" : C.muted }}>{children}</span>
    </div>
  
  </>);
}
function Divider() {
  return <div style={{ height: "1px", background: "rgba(33,20,26,0.08)", margin: "0" }} />;
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
function Gallery({ photos, name }: { photos: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const isMobile = useIsMobile();

  return (<>

    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "8px", height: isMobile ? "auto" : "70vh", maxHeight: "600px" }}>
{/* Main image */}
      <div style={{ flex: "1 1 0", position: "relative", overflow: "hidden", borderRadius: "12px", background: C.dark, minHeight: isMobile ? "280px" : "auto" }}>
        <img
          key={active}
          src={photos[active] || photos[0]}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", animation: "fadeIn 0.3s ease" }}
        />
{/* Navigation arrows */}
          {photos.length > 1 && (
          <>
            <button onClick={() => setActive(i => (i - 1 + photos.length) % photos.length)}
              style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "40px", height: "40px", borderRadius: "50%", background: "rgba(33,20,26,0.55)", border: "1px solid rgba(255,251,240,0.2)", color: C.light, fontSize: "1.1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
              ‹
            </button>
            <button onClick={() => setActive(i => (i + 1) % photos.length)}
              style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", width: "40px", height: "40px", borderRadius: "50%", background: "rgba(33,20,26,0.55)", border: "1px solid rgba(255,251,240,0.2)", color: C.light, fontSize: "1.1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
              ›
            </button>
          </>
        )}
{/* Counter */}
        <div style={{ position: "absolute", bottom: "14px", right: "14px", background: "rgba(33,20,26,0.6)", backdropFilter: "blur(6px)", borderRadius: "20px", padding: "4px 12px", fontFamily: "DM Sans", fontSize: "0.72rem", color: C.light }}>
          {active + 1} / {photos.length}
        </div>
      </div>

{/* Thumbnails column */}
        {photos.length > 1 && (
        <div style={{ display: "flex", flexDirection: isMobile ? "row" : "column", gap: "8px", width: isMobile ? "100%" : "140px", flexShrink: 0, overflowX: isMobile ? "auto" : "visible", overflowY: isMobile ? "visible" : "auto" }}>
          {photos.map((src, i) => (
            <div key={i} onClick={() => setActive(i)}
              style={{ flexShrink: 0, width: isMobile ? "80px" : "100%", height: isMobile ? "56px" : "calc((560px - 16px) / 3)", borderRadius: "8px", overflow: "hidden", cursor: "pointer", border: `2px solid ${i === active ? C.teal : "transparent"}`, transition: "border-color 0.2s", background: C.dark }}>
              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: i === active ? 1 : 0.6, transition: "opacity 0.2s" }} />
            </div>
          ))}
        </div>
      )}
    </div>
  
  </>);
}

// ─── ROI Calculator ───────────────────────────────────────────────────────────
function ROICalc() {
  const [budget, setBudget]   = useState(150000);
  const [yieldPct, setYield]  = useState(11);
  const [horizon, setHorizon] = useState(5);
  const [occupancy, setOccupancy] = useState(75);

  const annualRental = budget * (yieldPct / 100) * (occupancy / 100);
  const totalRental  = annualRental * horizon;
  // Off-plan appreciation assumption: 25% at handover, 8%/yr after
  const appreciation = budget * 0.25 + budget * 0.08 * Math.max(0, horizon - 1);
  const totalReturn  = totalRental + appreciation;
  const roi          = (totalReturn / budget) * 100;

  const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

  const fieldLabel: React.CSSProperties = {
    display: "block", fontFamily: "DM Sans", fontSize: "0.68rem",
    letterSpacing: "0.1em", textTransform: "uppercase",
    color: C.muted, marginBottom: "6px",
  };

  return (<>

    <div style={{ background: C.light, borderRadius: "16px", padding: "32px 28px" }}>
      <Eyebrow>Investment Calculator</Eyebrow>
      <h3 style={{ fontFamily: "Jun, serif", fontSize: "1.8rem", fontWeight: 400, color: C.dark, marginBottom: "28px" }}>
        Model your returns
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>
{/* Budget */}
        <div style={{ gridColumn: "span 2" }}>
          <label style={fieldLabel}>Investment Budget · <strong style={{ color: C.dark }}>{fmt(budget)}</strong></label>
          <input type="range" min="50000" max="500000" step="5000" value={budget} onChange={e => setBudget(+e.target.value)}
            style={{ width: "100%", accentColor: C.wine, cursor: "pointer" }} />
        </div>
{/* Yield */}
        <div>
          <label style={fieldLabel}>Annual Yield · <strong style={{ color: C.dark }}>{yieldPct}%</strong></label>
          <input type="range" min="8" max="15" step="0.5" value={yieldPct} onChange={e => setYield(+e.target.value)}
            style={{ width: "100%", accentColor: C.wine, cursor: "pointer" }} />
        </div>
{/* Occupancy */}
        <div>
          <label style={fieldLabel}>Occupancy · <strong style={{ color: C.dark }}>{occupancy}%</strong></label>
          <input type="range" min="50" max="95" step="5" value={occupancy} onChange={e => setOccupancy(+e.target.value)}
            style={{ width: "100%", accentColor: C.wine, cursor: "pointer" }} />
        </div>
{/* Horizon */}
        <div style={{ gridColumn: "span 2" }}>
          <label style={fieldLabel}>Investment Horizon · <strong style={{ color: C.dark }}>{horizon} years</strong></label>
          <input type="range" min="1" max="10" step="1" value={horizon} onChange={e => setHorizon(+e.target.value)}
            style={{ width: "100%", accentColor: C.wine, cursor: "pointer" }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
{[
    { label: "Annual Rental Income", value: fmt(annualRental), accent: false },
 { label: `Rental over ${horizon} yrs`,  value: fmt(totalRental),  accent: false },
    { label: "Est. Appreciation",   value: fmt(appreciation), accent: false },
 { label: `Total Return`,         value: fmt(totalReturn),  accent: true },
        ].map(item => (
          <div key={item.label} style={{
            background: item.accent ? C.dark : C.light,
            borderRadius: "10px", padding: "18px 16px",
            borderTop: `2px solid ${item.accent ? C.teal : C.wine}`,
          }}>
            <div style={{ fontFamily: "Jun, serif", fontSize: "1.5rem", fontWeight: 700, color: item.accent ? C.teal : C.dark, lineHeight: 1 }}>{item.value}</div>
            <div style={{ fontFamily: "DM Sans", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: item.accent ? "rgba(255,251,240,0.45)" : C.muted, marginTop: "6px" }}>{item.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "16px", textAlign: "center", background: C.dark, borderRadius: "10px", padding: "16px" }}>
        <span style={{ fontFamily: "Jun, serif", fontSize: "2.4rem", fontWeight: 700, color: C.teal }}>{roi.toFixed(0)}%</span>
        <span style={{ fontFamily: "DM Sans", fontSize: "0.72rem", color: "rgba(255,251,240,0.45)", letterSpacing: "0.12em", textTransform: "uppercase", display: "block", marginTop: "2px" }}>
          Estimated Total ROI over {horizon} years
        </span>
      </div>

      <p style={{ fontFamily: "DM Sans", fontSize: "0.68rem", color: C.muted, marginTop: "12px", lineHeight: 1.5 }}>
        * Indicative model. Assumes {yieldPct}% gross yield at {occupancy}% occupancy + 25% off-plan uplift + 8%/yr appreciation.
      </p>
    </div>
  
  </>);
}

// ─── Map ──────────────────────────────────────────────────────────────────────
function MapEmbed({ project }: { project: Project }) {
  const mapUrl = `https://maps.google.com/maps?q=${project.lat},${project.lng}&z=15&output=embed`;
  return (<>

    <div style={{ borderRadius: "16px", overflow: "hidden", height: "340px", background: C.light }}>
      <iframe
        title={`${project.name} location`}
        src={mapUrl}
        width="100%" height="100%"
        style={{ border: "none", display: "block" }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  
  </>);
}

// ─── Diamond bullet ───────────────────────────────────────────────────────────
function Diamond() {
  return (<>

    <svg width="7" height="7" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0, marginTop: "5px" }}>
      <rect x="5" y="0.5" width="6.36" height="6.36" rx="0" transform="rotate(45 5 0.5)" fill={C.wine} />
    </svg>
  
  </>);
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectPage() {
  const params = useParams<{ slug: string }>();
  const isMobile = useIsMobile();
  const { formatFromUSD } = useRates();
  const t = useT();
  useReveal();
  const [modalSrc, setModalSrc] = useState<string | null>(null);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerFormData, setOfferFormData] = useState({ name: "", phone: "", email: "" });

  const idx    = projects.findIndex(p => p.slug === params.slug);
  const project = projects[idx];

  // Scroll to top on mount
  useEffect(() => { window.scrollTo(0, 0); }, [params.slug]);

  if (!project) {
    return (<>

      <div style={{ background: C.light, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "Jun, serif", fontSize: "2rem", color: C.dark }}>{t("project.notFound")}</h1>
          <Link href="/"><a style={{ fontFamily: "DM Sans", color: C.teal }}>{t("project.backHome")}</a></Link>
        </div>
      </div>
    
  </>);
  }

  const priceLabel = formatFromUSD(project.priceUSD, { prefix: t("cta.from") });

  const p = project;
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];

  return (<>

    <div className="project-page" style={{ background: C.light, minHeight: "100vh", color: C.dark, overflowX: "hidden", width: "100%" }}>

{/* ── CSS fadeIn keyframe ── */}
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        .project-page p, .project-page h2, .project-page h3 {
          overflow-wrap: anywhere;
          word-break: break-word;
        }
        @media (max-width: 767px) {
          .project-specs-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .project-developer-card {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .project-payment-bar {
            flex-direction: column !important;
          }
          .project-payment-bar > div:first-child {
            flex: none !important;
            width: 100% !important;
          }
        }
      `}</style>

{/* ── GALLERY — Full width ── */}
      <section style={{ paddingTop: isMobile ? "24px" : "120px" }}>
        <Container>
          <Gallery photos={p.photos} name={p.name} />
        </Container>
      </section>

{/* ── MAIN CONTENT ── */}
      <section style={{ padding: isMobile ? "36px 0 0" : "64px 0 0" }}>
        <Container>
          <Row gap={isMobile ? 28 : 48}>

{/* ── LEFT col (8) ── */}
            <Col span={8}>

{/* Overview */}
              <div className="pr-reveal" style={{ marginBottom: isMobile ? "36px" : "48px" }}>
                <Eyebrow>Overview</Eyebrow>
                <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 400, color: C.dark, lineHeight: 1.15, marginBottom: "10px" }}>
{p.name}
                </h2>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.83rem", color: C.muted, display: "flex", alignItems: "flex-start", gap: "6px", marginBottom: "20px", lineHeight: 1.5 }}>
                  <svg width="11" height="13" viewBox="0 0 12 14" fill="none" style={{ flexShrink: 0, marginTop: 2 }}><path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5c-.83 0-1.5-.67-1.5-1.5S5.17 3.5 6 3.5 7.5 4.17 7.5 5 6.83 6.5 6 6.5z" fill="currentColor"/></svg>
                  <span>{p.address} · {p.seaDistance}</span>
                </p>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.95rem", color: C.muted, lineHeight: 1.85 }}>{p.desc}</p>

                {/* Developer block */}
                <div
                  className="project-developer-card"
                  style={{ marginTop: "28px", display: "flex", alignItems: "flex-start", gap: "20px", padding: isMobile ? "18px" : "20px 22px", background: C.light, borderRadius: "12px", border: `1px solid rgba(33,20,26,0.07)` }}
                >
                  {/* Logo placeholder */}
                  <div style={{ flexShrink: 0, width: "64px", height: "64px", borderRadius: "8px", background: "rgba(33,20,26,0.06)", border: "1.5px dashed rgba(33,20,26,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "DM Sans", fontSize: "0.52rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(33,20,26,0.3)", textAlign: "center", lineHeight: 1.3 }}>Logo</span>
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontFamily: "DM Sans", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.muted, margin: "0 0 6px" }}>Developer</p>
                    <p style={{ fontFamily: "Jun, serif", fontSize: "1rem", fontWeight: 400, color: C.dark, margin: "0 0 8px" }}>{p.developer}</p>
                    <p style={{ fontFamily: "DM Sans", fontSize: "0.82rem", color: C.muted, lineHeight: 1.7, margin: 0 }}>
                      A construction company founded in 2015, which has established itself as a reliable partner in residential construction. It actively develops projects, including residential complexes in Batumi.
                    </p>
                  </div>
                </div>
              </div>

              <Divider />

{/* Specs grid */}
              <div className="pr-reveal" style={{ margin: "40px 0" }}>
                <Eyebrow>Technical Specifications</Eyebrow>
                <div className="project-specs-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "rgba(33,20,26,0.08)", borderRadius: "12px", overflow: "hidden" }}>
{[
    { label: "Area",           value: p.area },
    { label: "Ceiling Height", value: p.ceilingHeight },
    { label: "Floors",         value: p.floors },
    { label: "Buildings",      value: p.buildings },
    { label: "Finishing",      value: p.finishing },
    { label: "Developer",      value: p.developer },
                  ].map(s => (
                    <div key={s.label} style={{ background: C.light, padding: isMobile ? "14px 12px" : "16px 14px", minWidth: 0 }}>
                      <p style={{ fontFamily: "Manrope, sans-serif", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted, margin: "0 0 5px" }}>{s.label}</p>
                      <p style={{ fontFamily: "Manrope, sans-serif", fontSize: isMobile ? "0.92rem" : "1rem", fontWeight: 600, color: C.dark, margin: 0, lineHeight: 1.3 }}>{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Divider />

{/* Key Features */}
              <div className="pr-reveal" style={{ margin: "40px 0" }}>
                <Eyebrow>Key Features</Eyebrow>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "12px 32px" }}>
                  {p.features.map(f => (
                    <div key={f} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <Diamond />
                      <span style={{ fontFamily: "DM Sans", fontSize: "0.88rem", color: C.mutedDark, lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Divider />

{/* Materials */}
              <div className="pr-reveal" style={{ margin: "40px 0" }}>
                <Eyebrow>Materials & Construction</Eyebrow>
                <div style={{ background: C.light, borderRadius: "12px", padding: "20px 22px", display: "flex", flexDirection: "column", gap: "14px" }}>
                  {p.materials.split(". ").filter(Boolean).map((sentence, i) => {
                    const colonIdx = sentence.indexOf(":");
                    const hasTitle = colonIdx > 0 && colonIdx < 40;
                    return (<>
                      <p key={i} style={{ fontFamily: "DM Sans", fontSize: "0.88rem", color: C.mutedDark, lineHeight: 1.8, margin: 0 }}>
                        {hasTitle ? (
                          <><strong style={{ color: C.dark }}>{sentence.slice(0, colonIdx)}</strong>{sentence.slice(colonIdx)}</>
                        ) : sentence + (sentence.endsWith(".") ? "" : ".")}
                      </p>
                    </>);
                  })}
                </div>
              </div>

              <Divider />

{/* Payment */}
              <div className="pr-reveal" style={{ margin: "40px 0 0" }}>
                <Eyebrow>Payment & Installment</Eyebrow>
                {/* Bar visual: left block = down payment, right block = installment remainder */}
                <div className="project-payment-bar" style={{ display: "flex", borderRadius: "12px", overflow: "hidden", background: C.light, border: `1px solid rgba(33,20,26,0.08)` }}>
                  {/* Filled / down payment portion */}
                  <div style={{ flex: "0 0 30%", background: C.dark, padding: "22px 20px" }}>
                    <p style={{ fontFamily: "Jun, serif", fontSize: "1.8rem", fontWeight: 700, color: C.teal, margin: "0 0 4px", lineHeight: 1 }}>30%</p>
                    <p style={{ fontFamily: "DM Sans", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,251,240,0.5)", margin: 0 }}>Down Payment</p>
                  </div>
                  {/* Remainder / installment portion */}
                  <div style={{ flex: 1, padding: "22px 20px", minWidth: 0 }}>
                    <p style={{ fontFamily: "Jun, serif", fontSize: "1.8rem", fontWeight: 700, color: C.dark, margin: "0 0 4px", lineHeight: 1 }}>70%</p>
                    <p style={{ fontFamily: "DM Sans", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.muted, margin: "0 0 8px" }}>Installment</p>
                    <p style={{ fontFamily: "DM Sans", fontSize: "0.82rem", color: C.mutedDark, margin: 0 }}>{p.installment}</p>
                  </div>
                </div>
              </div>

            </Col>

{/* ── RIGHT col (4) — sticky sidebar ── */}
            <Col span={4}>
              <div style={{ position: isMobile ? "relative" : "sticky", top: isMobile ? undefined : "80px", display: "flex", flexDirection: "column", gap: "16px" }}>

{/* CTA card */}
                <div className="pr-reveal" style={{ background: C.dark, borderRadius: "16px", padding: "28px 24px" }}>
                  <p style={{ fontFamily: "DM Sans", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.teal, marginBottom: "10px" }}>Interested?</p>
                  <h3 style={{ fontFamily: "Jun, serif", fontSize: "1.6rem", fontWeight: 400, color: C.light, lineHeight: 1.25, marginBottom: "8px" }}>
                    Get a personal offer
                  </h3>
                  <p style={{ fontFamily: "Jun, serif", fontSize: "1.4rem", fontWeight: 700, color: C.teal, marginBottom: "16px" }}>{priceLabel}</p>
                  <p style={{ fontFamily: "DM Sans", fontSize: "0.8rem", color: "rgba(255,251,240,0.5)", lineHeight: 1.6, marginBottom: "20px" }}>
                    We'll prepare a detailed cost estimate and floor plan selection for this project.
                  </p>
                  <button onClick={() => setShowOfferForm(true)} style={{ display: "block", width: "100%", fontFamily: "DM Sans", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark, background: C.teal, border: "none", borderRadius: "8px", padding: "14px", textDecoration: "none", textAlign: "center", cursor: "pointer", transition: "opacity 0.2s" }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                    Request Details
                  </button>
                </div>

{/* Quick facts */}
                <div className="pr-reveal" style={{ transitionDelay: "80ms", background: C.light, borderRadius: "12px", padding: "20px 18px" }}>
{[
    { label: t("project.estRoi"), value: p.yield },
    { label: t("project.from"), value: priceLabel },
    { label: t("project.ready"), value: p.completion },
    { label: t("project.sea"), value: p.seaDistance },
                  ].map((row, i) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 3 ? "1px solid rgba(33,20,26,0.07)" : "none" }}>
                      <span style={{ fontFamily: "DM Sans", fontSize: "0.78rem", color: C.muted }}>{row.label}</span>
                      <span style={{ fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 700, color: C.dark }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="pr-reveal" style={{ transitionDelay: "120ms" }}>
                  <ROICalc />
                </div>

{/* Live Camera Card */}
                  {p.liveCameraUrl && (
                  <a href={p.liveCameraUrl} target="_blank" rel="noopener noreferrer" className="pr-reveal" style={{ transitionDelay: "160ms", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: C.dark, borderRadius: "16px", padding: "20px 24px", border: "1px solid rgba(255,60,60,0.3)", textDecoration: "none", transition: "border-color 0.2s, box-shadow 0.2s" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,60,60,0.6)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 12px rgba(255,60,60,0.2)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,60,60,0.3)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff3c3c", flexShrink: 0, boxShadow: "0 0 8px #ff3c3c" }} />
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff3c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="15" height="10" rx="1"/><polyline points="17 9 22 6 22 18 17 15"/></svg>
                    <span style={{ fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light }}>Live Camera</span>
                  </a>
                )}

              </div>
            </Col>

          </Row>
        </Container>
      </section>



{/* ── MAP ── */}
{/* ── FLOOR PLANS ── */}
      <section style={{ padding: "80px 0 0" }}>
        <Container>
          <div className="pr-reveal" style={{ marginBottom: "40px" }}>
            <Eyebrow>Floor Plans</Eyebrow>
            <h3 style={{ fontFamily: "Jun, serif", fontSize: "clamp(1.6rem,2.5vw,2.2rem)", fontWeight: 400, color: C.dark }}>
              Available Layouts
            </h3>
          </div>
          <div className="pr-reveal" style={{ transitionDelay: "80ms", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
            {(p.floorPlans && p.floorPlans.length > 0 ? p.floorPlans : [null, null, null]).map((src, n) => (
              src ? (
                <div key={n} onClick={() => setModalSrc(src)} style={{ borderRadius: "12px", overflow: "hidden", background: "#FFFBF0", border: "1px solid rgba(33,20,26,0.08)", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                  <img src={src} alt={`Layout ${n + 1}`} style={{ width: "100%", display: "block", objectFit: "contain" }} />
                    {p.floorPlanLabels?.[n] && (
                    <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(33,20,26,0.08)", textAlign: "center" }}>
                      <span style={{ fontFamily: "Manrope, sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark }}>{p.floorPlanLabels[n]}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div key={n} style={{ border: "1.5px dashed rgba(33,20,26,0.15)", borderRadius: "12px", aspectRatio: "3/4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", background: "#FFFBF0" }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(33,20,26,0.2)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="1"/>
                    <path d="M3 9h18M9 9v12M3 15h6"/>
                  </svg>
                  <span style={{ fontFamily: "DM Sans", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(33,20,26,0.3)" }}>
                    Layout {n + 1} — Coming Soon
                  </span>
                </div>
              )
            ))}
          </div>
        </Container>
      </section>

{/* ── MAP ── */}
      <section style={{ padding: "80px 0 0" }}>
        <Container>
          <div className="pr-reveal" style={{ marginBottom: "24px" }}>
            <Eyebrow>Location</Eyebrow>
            <h3 style={{ fontFamily: "Jun, serif", fontSize: "clamp(1.6rem,2.5vw,2.2rem)", fontWeight: 400, color: C.dark }}>
{p.location}
            </h3>
          </div>
          <div className="pr-reveal" style={{ transitionDelay: "80ms" }}>
            <MapEmbed project={p} />
          </div>
          {/* District description */}
          <div className="pr-reveal" style={{ transitionDelay: "140ms", marginTop: "32px", background: C.light, borderRadius: "12px", padding: "28px 28px" }}>
            <h4 style={{ fontFamily: "Jun, serif", fontSize: "1.2rem", fontWeight: 400, color: C.dark, marginBottom: "12px" }}>Новый Бульвар</h4>
            <p style={{ fontFamily: "DM Sans", fontSize: "0.9rem", color: C.mutedDark, lineHeight: 1.85, margin: 0 }}>
              Современный район у моря с развитой инфраструктурой и красивым парком у набережной. Объект расположен на юго-западной окраине города Батуми, вдоль побережья Черного моря. Этот район является символом нового, современного Батуми с его инновационной архитектурой и зелеными зонами для отдыха.
              <br /><br />
              До Международного аэропорта Батуми можно добраться всего за 8 минут, что удобно для тех, кто часто путешествует. В непосредственной близости расположены важные социальные объекты: школа и дельфинарий находятся в 11 минутах езды, детский сад — в 12 минутах. Такое расположение делает жилой объект Артекс удобным для семей с детьми и для активной городской жизни резидентов.
            </p>
          </div>
        </Container>
      </section>

{/* ── CTA FOOTER ── */}
      <div style={{ background: C.dark, padding: "80px 0" }}>
        <Container>
          <Row>
            <Col span={8} style={{ margin: "0 auto", textAlign: "center" }}>
              <div className="pr-reveal">
                <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 400, color: C.light, marginBottom: "16px", lineHeight: 1.1, textAlign: "center" }}>
                  Ready to invest in<br />
                  <em style={{ color: C.teal, fontStyle: "italic" }}>{p.name}?</em>
                </h2>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.88rem", color: "rgba(255,251,240,0.5)", lineHeight: 1.7, maxWidth: "420px", margin: "0 auto 32px" }}>
                  We'll prepare a personal offer with floor plan selection, payment schedule, and projected returns.
                </p>
                <AppLink href="/#contact" style={{ display: "inline-block", fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark, background: C.teal, borderRadius: "8px", padding: "15px 36px", textDecoration: "none" }}>
                  Get a Free Offer
                </AppLink>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

{/* ── NEXT / PREV projects ── */}
      <section style={{ padding: "80px 0" }}>
        <Container>
          <div style={{ marginBottom: "32px" }}>
            <Eyebrow>Other Projects</Eyebrow>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px" }}>
{[prev, next].map((proj) => (
              <Link key={proj.slug} href={`/project/${proj.slug}`}>
                <a style={{ display: "block", textDecoration: "none", borderRadius: "12px", overflow: "hidden", position: "relative", height: "200px", background: C.dark }}>
                  <img src={proj.cardImage} alt={proj.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(33,20,26,0.8) 0%, transparent 60%)" }} />
                  <div style={{ position: "absolute", bottom: "16px", left: "20px" }}>
                    <p style={{ fontFamily: "DM Sans", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,251,240,0.55)", marginBottom: "4px" }}>{proj.tag}</p>
                    <p style={{ fontFamily: "Jun, serif", fontSize: "1.3rem", color: C.light, margin: 0 }}>{proj.name}</p>
                  </div>
                  <div style={{ position: "absolute", top: "14px", right: "14px", background: C.light, borderRadius: "4px", padding: "3px 10px", fontFamily: "DM Sans", fontSize: "0.6rem", fontWeight: 700, color: C.dark }}>
                    {proj.yield} ROI
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </Container>
      </section>

{/* Modal */}
      {modalSrc && (
        <div onClick={() => setModalSrc(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)", cursor: "pointer" }}>
          <div onClick={e => e.stopPropagation()} style={{ position: "relative", maxWidth: "60vw", maxHeight: "70vh", cursor: "default" }}>
            <img src={modalSrc} alt="Layout preview" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "12px" }} />
            <button onClick={() => setModalSrc(null)} style={{ position: "absolute", top: "-40px", right: "0", width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,251,240,0.1)", border: "1px solid rgba(255,251,240,0.25)", color: "#FFFBF0", fontSize: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,251,240,0.2)")} onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,251,240,0.1)")}>
              ✕
            </button>
          </div>
        </div>
      )}

{/* Offer Form Modal */}
      {showOfferForm && (
        <div onClick={() => setShowOfferForm(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, backdropFilter: "blur(4px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ position: "relative", background: C.dark, borderRadius: "16px", padding: "40px", maxWidth: "500px", width: "90%", cursor: "default", border: `1px solid rgba(140,178,192,0.2)` }}>
            <button onClick={() => setShowOfferForm(false)} style={{ position: "absolute", top: "16px", right: "16px", width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,251,240,0.1)", border: "none", color: C.light, fontSize: "20px", cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,251,240,0.2)")} onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,251,240,0.1)")}>
              ✕
            </button>

            <h2 style={{ fontFamily: "Jun, serif", fontSize: "2rem", fontWeight: 400, color: C.light, marginBottom: "8px" }}>
              Request Details
            </h2>
            <p style={{ fontFamily: "DM Sans", fontSize: "0.85rem", color: "rgba(255,251,240,0.6)", marginBottom: "28px" }}>
              Tell us about your interest in {project.name}. We'll prepare a personalized offer.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <input
                type="text"
                placeholder="Your Name"
                value={offerFormData.name}
                onChange={e => setOfferFormData({ ...offerFormData, name: e.target.value })}
                style={{ fontFamily: "DM Sans", fontSize: "0.9rem", background: "rgba(255,251,240,0.05)", border: "1px solid rgba(255,251,240,0.12)", borderRadius: "8px", color: C.light, padding: "12px", transition: "border-color 0.2s" }}
                onFocus={e => (e.target.style.borderColor = C.teal)}
                onBlur={e => (e.target.style.borderColor = "rgba(255,251,240,0.12)")}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={offerFormData.phone}
                onChange={e => setOfferFormData({ ...offerFormData, phone: e.target.value })}
                style={{ fontFamily: "DM Sans", fontSize: "0.9rem", background: "rgba(255,251,240,0.05)", border: "1px solid rgba(255,251,240,0.12)", borderRadius: "8px", color: C.light, padding: "12px", transition: "border-color 0.2s" }}
                onFocus={e => (e.target.style.borderColor = C.teal)}
                onBlur={e => (e.target.style.borderColor = "rgba(255,251,240,0.12)")}
              />
              <input
                type="email"
                placeholder="Email Address"
                value={offerFormData.email}
                onChange={e => setOfferFormData({ ...offerFormData, email: e.target.value })}
                style={{ fontFamily: "DM Sans", fontSize: "0.9rem", background: "rgba(255,251,240,0.05)", border: "1px solid rgba(255,251,240,0.12)", borderRadius: "8px", color: C.light, padding: "12px", transition: "border-color 0.2s" }}
                onFocus={e => (e.target.style.borderColor = C.teal)}
                onBlur={e => (e.target.style.borderColor = "rgba(255,251,240,0.12)")}
              />
              <button onClick={() => { setShowOfferForm(false); setOfferFormData({ name: "", phone: "", email: "" }); }} style={{ fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark, background: C.teal, border: "none", borderRadius: "8px", padding: "14px", cursor: "pointer", marginTop: "8px", transition: "opacity 0.2s" }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                Send Request
              </button>
              <p style={{ fontFamily: "DM Sans", fontSize: "0.75rem", color: "rgba(255,251,240,0.5)", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,251,240,0.1)", margin: "16px 0 0", textAlign: "center" }}>
                Contact us directly at: <span style={{ color: C.teal, fontWeight: 600 }}>+995 555 50 52 88</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  </>);
}
