import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "wouter";
import { projects, type Project } from "../data/projects";
import { localizeProjects } from "../data/projects-locale";
import { AppLink } from "../components/app-link";
import { PiazzaViewer } from "../components/PiazzaViewer";
import { ParklineViewer } from "../components/ParklineViewer";
import { RequestModal } from "../components/RequestModal";
import { ProjectFeatures } from "../components/ProjectFeatures";
import { useRates } from "../context/RatesContext";
import { useLocale } from "../context/LocaleContext";
import { useT } from "../i18n";

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  dark:      "#21141A",
  teal:      "#703C54",
  wine:      "#703C54",
  light:     "#FFFEF9",
  parchment: "#FFFEF9",
  muted:     "rgba(33,20,26,0.55)",
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
  return <div className="site-wrap" style={{ width: "100%", ...style }}>{children}</div>;
}
function Row({ children, gap = 24, style }: { children: React.ReactNode; gap?: number; style?: React.CSSProperties }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: `${gap}px`, width: "100%", minWidth: 0, ...style }}>{children}</div>;
}
function Col({ span = 12, spanMd, children, style }: { span?: number; spanMd?: number; children?: React.ReactNode; style?: React.CSSProperties }) {
  const isMobile = useIsMobile();
  return <div style={{ gridColumn: `span ${isMobile ? 12 : (spanMd ?? span)}`, minWidth: 0, maxWidth: "100%", ...style }}>{children}</div>;
}
function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <h3 style={{
      fontFamily: "Coolvetica, Inter, sans-serif",
      fontSize: "clamp(1.35rem, 2.2vw, 1.7rem)",
      fontWeight: 500,
      color: light ? C.light : C.dark,
      lineHeight: 1.25,
      letterSpacing: "0.01em",
      margin: "0 0 20px",
    }}>
      {children}
    </h3>
  );
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
      <div style={{ flex: "1 1 0", position: "relative", overflow: "hidden", borderRadius: "2px", background: C.dark, minHeight: isMobile ? "280px" : "auto" }}>
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
              style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "40px", height: "40px", borderRadius: "50%", background: "rgba(33,20,26,0.55)", border: "1px solid rgba(255,254,249,0.2)", color: C.light, fontSize: "1.1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
              ‹
            </button>
            <button onClick={() => setActive(i => (i + 1) % photos.length)}
              style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", width: "40px", height: "40px", borderRadius: "50%", background: "rgba(33,20,26,0.55)", border: "1px solid rgba(255,254,249,0.2)", color: C.light, fontSize: "1.1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
              ›
            </button>
          </>
        )}
{/* Counter */}
        <div style={{ position: "absolute", bottom: "14px", right: "14px", background: "rgba(33,20,26,0.6)", backdropFilter: "blur(6px)", borderRadius: "2px", padding: "4px 12px", fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: C.light }}>
          {active + 1} / {photos.length}
        </div>
      </div>

{/* Thumbnails column */}
        {photos.length > 1 && (
        <div style={{ display: "flex", flexDirection: isMobile ? "row" : "column", gap: "8px", width: isMobile ? "100%" : "140px", flexShrink: 0, overflowX: isMobile ? "auto" : "visible", overflowY: isMobile ? "visible" : "auto" }}>
          {photos.map((src, i) => (
            <div key={i} onClick={() => setActive(i)}
              style={{ flexShrink: 0, width: isMobile ? "80px" : "100%", height: isMobile ? "56px" : "calc((560px - 16px) / 3)", borderRadius: "2px", overflow: "hidden", cursor: "pointer", border: `2px solid ${i === active ? C.teal : "transparent"}`, transition: "border-color 0.2s", background: C.dark }}>
              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: i === active ? 1 : 0.6, transition: "opacity 0.2s" }} />
            </div>
          ))}
        </div>
      )}
    </div>
  
  </>);
}

// ─── Layout carousel ──────────────────────────────────────────────────────────
function LayoutCarousel({
  plans,
  labels,
  areas,
  onOpen,
}: {
  plans: string[];
  labels?: string[];
  areas?: string[];
  onOpen?: (src: string) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ x: 0, moved: false });
  const [active, setActive] = useState(0);
  const isMobile = useIsMobile();

  const goTo = (index: number) => {
    const el = scrollerRef.current;
    const slide = el?.children[index] as HTMLElement | undefined;
    if (!el || !slide) return;
    const left = slide.offsetLeft - (el.clientWidth - slide.offsetWidth) / 2;
    el.scrollTo({ left, behavior: "smooth" });
  };

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(el.children).forEach((node, i) => {
      const s = node as HTMLElement;
      const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
  };

  return (
    <div className="pr-reveal layout-carousel-wrap" style={{ transitionDelay: "80ms" }}>
      {labels && labels.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            marginBottom: isMobile ? "16px" : "20px",
            paddingBottom: "2px",
          }}
        >
          {labels.map((label, i) => {
            const on = i === active;
            return (
              <button
                key={label + i}
                type="button"
                onClick={() => goTo(i)}
                style={{
                  flexShrink: 0,
                  border: on ? "none" : "1px solid rgba(33,20,26,0.12)",
                  background: on ? C.dark : "transparent",
                  color: on ? C.light : C.dark,
                  borderRadius: "2px",
                  padding: isMobile ? "8px 14px" : "8px 16px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: isMobile ? "0.68rem" : "0.75rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "background 0.25s ease, color 0.25s ease, border-color 0.25s ease",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      <div style={{ position: "relative" }}>
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className="layout-carousel"
          style={{
            display: "flex",
            gap: isMobile ? "12px" : "18px",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            padding: isMobile ? "0 6% 6px" : "0 11% 8px",
          }}
        >
          {plans.map((src, i) => (
            <article
              key={src + i}
              style={{
                flex: isMobile ? "0 0 88%" : "0 0 min(720px, 78%)",
                scrollSnapAlign: "center",
                scrollSnapStop: "always",
                borderRadius: "2px",
                overflow: "hidden",
                background: "#FFFEF9",
                border: "1px solid rgba(33,20,26,0.08)",
                boxShadow: i === active ? "0 10px 28px rgba(33,20,26,0.08)" : "none",
                transition: "box-shadow 0.3s ease",
                cursor: onOpen ? "pointer" : "default",
              }}
              onPointerDown={(e) => {
                dragRef.current = { x: e.clientX, moved: false };
              }}
              onPointerMove={(e) => {
                if (Math.abs(e.clientX - dragRef.current.x) > 10) dragRef.current.moved = true;
              }}
              onClick={() => {
                if (!dragRef.current.moved) onOpen?.(src);
              }}
            >
              <div
                style={{
                  aspectRatio: "16 / 10",
                  background: "#FFFEF9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: isMobile ? "10px" : "18px",
                }}
              >
                <img
                  src={src}
                  alt={labels?.[i] || `Layout ${i + 1}`}
                  draggable={false}
                  style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", pointerEvents: "none" }}
                />
              </div>
              {(labels?.[i] || areas?.[i]) && (
                <div style={{ padding: isMobile ? "12px 14px 14px" : "14px 18px 16px", borderTop: "1px solid rgba(33,20,26,0.08)", textAlign: "center", background: "#FFFEF9" }}>
                  {labels?.[i] && (
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: isMobile ? "0.72rem" : "0.8rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: C.dark }}>
                      {labels[i]}
                    </div>
                  )}
                  {areas?.[i] && (
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: isMobile ? "0.78rem" : "0.88rem", fontWeight: 500, marginTop: "4px", color: C.mutedDark }}>
                      {areas[i]}
                    </div>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>

        {!isMobile && plans.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous layout"
              onClick={() => goTo((active - 1 + plans.length) % plans.length)}
              style={{
                position: "absolute",
                left: "8px",
                top: "42%",
                transform: "translateY(-50%)",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "1px solid rgba(33,20,26,0.12)",
                background: "rgba(255,254,249,0.92)",
                color: C.dark,
                fontSize: "1.25rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(33,20,26,0.1)",
              }}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next layout"
              onClick={() => goTo((active + 1) % plans.length)}
              style={{
                position: "absolute",
                right: "8px",
                top: "42%",
                transform: "translateY(-50%)",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "1px solid rgba(33,20,26,0.12)",
                background: "rgba(255,254,249,0.92)",
                color: C.dark,
                fontSize: "1.25rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(33,20,26,0.1)",
              }}
            >
              ›
            </button>
          </>
        )}
      </div>

      {plans.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
          {plans.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={labels?.[i] || `Layout ${i + 1}`}
              onClick={() => goTo(i)}
              style={{
                width: i === active ? "22px" : "8px",
                height: "8px",
                borderRadius: "2px",
                border: "none",
                padding: 0,
                background: i === active ? C.dark : "rgba(33,20,26,0.18)",
                cursor: "pointer",
                transition: "width 0.25s ease, background 0.25s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Map ──────────────────────────────────────────────────────────────────────
function MapEmbed({ project }: { project: Project }) {
  const q = project.mapsQuery
    ? encodeURIComponent(project.mapsQuery)
    : `${project.lat},${project.lng}`;
  const mapUrl = `https://maps.google.com/maps?q=${q}&z=16&output=embed`;
  return (<>

    <div style={{ borderRadius: "2px", overflow: "hidden", height: "340px", background: C.light }}>
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectPage() {
  const params = useParams<{ slug: string }>();
  const isMobile = useIsMobile();
  const { formatFromUSD } = useRates();
  const { language } = useLocale();
  const t = useT();
  useReveal();
  const [modalSrc, setModalSrc] = useState<string | null>(null);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);

  const localizedList = localizeProjects(projects, language);
  const idx    = localizedList.findIndex(p => p.slug === params.slug);
  const project = localizedList[idx];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    setFeaturesOpen(false);
  }, [params.slug]);

  if (!project) {
    return (<>

      <div style={{ background: C.light, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "2rem", color: C.dark }}>{t("project.notFound")}</h1>
          <Link href="/"><a style={{ fontFamily: "Inter, sans-serif", color: C.teal }}>{t("project.backHome")}</a></Link>
        </div>
      </div>
    
  </>);
  }

  const priceLabel = formatFromUSD(project.priceUSD, { prefix: t("cta.from") });
  const downPct = project.downPaymentPct ?? 30;
  const restPct = 100 - downPct;

  const p = project;
  const propertyType = p.propertyType ?? "apartment";
  const typeKey =
    propertyType === "residence"
      ? "project.propertyType.residence"
      : propertyType === "villa"
        ? "project.propertyType.villa"
        : propertyType === "townhouse"
          ? "project.propertyType.townhouse"
          : "project.propertyType.apartment";
  const prev = localizedList[(idx - 1 + localizedList.length) % localizedList.length];
  const next = localizedList[(idx + 1) % localizedList.length];

  return (<>

    <div className="project-page" style={{ background: C.light, minHeight: "100vh", color: C.dark, overflowX: "hidden", width: "100%" }}>

{/* ── CSS fadeIn keyframe ── */}
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        .project-page p, .project-page h2, .project-page h3 {
          overflow-wrap: break-word;
        }
        .layout-carousel::-webkit-scrollbar { display: none; }
        .layout-carousel { -ms-overflow-style: none; scrollbar-width: none; }
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
      <section style={{ paddingTop: 60 }}>
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
                <h2 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 400, color: C.dark, lineHeight: 1.15, marginBottom: "12px" }}>
{p.name}
                </h2>

                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: C.mutedDark, display: "flex", alignItems: "flex-start", gap: "6px", marginBottom: "20px", lineHeight: 1.5 }}>
                  <svg width="11" height="13" viewBox="0 0 12 14" fill="none" style={{ flexShrink: 0, marginTop: 2 }}><path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5c-.83 0-1.5-.67-1.5-1.5S5.17 3.5 6 3.5 7.5 4.17 7.5 5 6.83 6.5 6 6.5z" fill="currentColor"/></svg>
                  <span>{p.address} · {p.seaDistance}</span>
                </p>

                {/* Key params: property type / price per sqm */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr 1fr" : "minmax(140px, max-content) minmax(140px, max-content)",
                    columnGap: isMobile ? "24px" : "64px",
                    rowGap: "16px",
                    marginBottom: "22px",
                  }}
                >
                  <div>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "rgba(33,20,26,0.45)", margin: "0 0 6px", lineHeight: 1.3 }}>
                      {t("project.propertyType")}
                    </p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 700, color: C.dark, margin: 0, lineHeight: 1.3 }}>
                      {t(typeKey)}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", color: "rgba(33,20,26,0.45)", margin: "0 0 6px", lineHeight: 1.3 }}>
                      {t("project.pricePerSqm")}
                    </p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: 700, color: C.dark, margin: 0, lineHeight: 1.3 }}>
                      {p.pricePerSqm ?? "—"}
                    </p>
                  </div>
                </div>

                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "1.05rem", color: C.mutedDark, lineHeight: 1.75 }}>{p.desc}</p>

                {/* Developer block */}
                <div
                  className="project-developer-card"
                  style={{ marginTop: "28px", display: "flex", alignItems: "flex-start", gap: "20px", padding: isMobile ? "18px" : "20px 22px", background: C.light, borderRadius: "2px", border: `1px solid rgba(33,20,26,0.07)` }}
                >
                  {p.developerLogo ? (
                    <div style={{ flexShrink: 0, width: isMobile ? "132px" : "160px", height: "64px", borderRadius: "2px", background: "#FFFEF9", border: "1px solid rgba(33,20,26,0.08)", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 12px" }}>
                      <img src={p.developerLogo} alt={p.developer} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
                    </div>
                  ) : (
                  <div style={{ flexShrink: 0, width: "64px", height: "64px", borderRadius: "2px", background: "rgba(33,20,26,0.06)", border: "1.5px dashed rgba(33,20,26,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.52rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(33,20,26,0.3)", textAlign: "center", lineHeight: 1.3 }}>{t("project.developerLogo")}</span>
                  </div>
                  )}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", letterSpacing: "0.06em", textTransform: "uppercase", color: C.muted, margin: "0 0 6px" }}>{t("project.developer")}</p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "1.15rem", fontWeight: 600, color: C.dark, margin: "0 0 8px" }}>{p.developer}</p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: C.mutedDark, lineHeight: 1.7, margin: 0 }}>
                      {p.developerBody ?? t("project.developerBody")}
                    </p>
                  </div>
                </div>
              </div>

              <Divider />

{/* Specs grid */}
              <div className="pr-reveal" style={{ margin: "40px 0" }}>
                <Eyebrow>{t("project.specs")}</Eyebrow>
                <div className="project-specs-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: isMobile ? "10px" : "12px" }}>
{[
    { label: t("project.spec.area"), value: p.area },
    { label: t("project.spec.ceilingHeight"), value: p.ceilingHeight },
    { label: t("project.spec.floors"), value: p.floors },
    { label: t("project.spec.buildings"), value: p.buildings },
    { label: t("project.spec.finishing"), value: p.finishing },
    { label: t("project.developer"), value: p.developer },
                  ].map(s => (
                    <div key={s.label} style={{ background: "#FFFEF9", border: "1px solid rgba(33,20,26,0.08)", borderRadius: "2px", padding: isMobile ? "16px 14px" : "20px 18px", minWidth: 0 }}>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", fontWeight: 500, color: "#5c5558", margin: "0 0 8px", lineHeight: 1.35 }}>{s.label}</p>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: isMobile ? "1.05rem" : "1.15rem", fontWeight: 600, color: C.dark, margin: 0, lineHeight: 1.35 }}>{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Divider />

{/* Features */}
              <ProjectFeatures
                features={p.features}
                open={featuresOpen}
                onOpen={() => setFeaturesOpen(true)}
                onClose={() => setFeaturesOpen(false)}
                isMobile={isMobile}
              />

              <Divider />

{/* Materials */}
              <div className="pr-reveal" style={{ margin: "40px 0" }}>
                <Eyebrow>{t("project.materials")}</Eyebrow>
                <div style={{ background: "#FFFEF9", borderRadius: "2px", padding: isMobile ? "20px 18px" : "24px 26px", border: "1px solid rgba(33,20,26,0.08)", display: "flex", flexDirection: "column", gap: "16px" }}>
                  {p.materials.split(". ").filter(Boolean).map((sentence, i) => {
                    const colonIdx = sentence.indexOf(":");
                    const hasTitle = colonIdx > 0 && colonIdx < 40;
                    return (
                      <p key={i} style={{ fontFamily: "Inter, sans-serif", fontSize: "1rem", color: C.mutedDark, lineHeight: 1.75, margin: 0 }}>
                        {hasTitle ? (
                          <><strong style={{ color: C.dark, fontWeight: 600 }}>{sentence.slice(0, colonIdx)}</strong>{sentence.slice(colonIdx)}</>
                        ) : sentence + (sentence.endsWith(".") ? "" : ".")}
                      </p>
                    );
                  })}
                </div>
              </div>

              <Divider />

{/* Payment */}
              <div className="pr-reveal" style={{ margin: "40px 0 0" }}>
                <Eyebrow>{t("project.payment")}</Eyebrow>
                {/* Bar visual: left block = down payment, right block = installment remainder */}
                <div className="project-payment-bar" style={{ display: "flex", borderRadius: "2px", overflow: "hidden", background: C.light, border: `1px solid rgba(33,20,26,0.08)` }}>
                  {/* Filled / down payment portion */}
                  <div style={{ flex: `0 0 ${downPct}%`, background: C.dark, padding: "22px 20px" }}>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "1.8rem", fontWeight: 700, color: C.light, margin: "0 0 4px", lineHeight: 1 }}>{downPct}%</p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, margin: 0 }}>{t("project.downPayment")}</p>
                  </div>
                  {/* Remainder / installment portion */}
                  <div style={{ flex: 1, padding: "22px 20px", minWidth: 0 }}>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "1.8rem", fontWeight: 700, color: C.dark, margin: "0 0 4px", lineHeight: 1 }}>{restPct}%</p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.muted, margin: "0 0 8px" }}>{t("project.installment")}</p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: C.mutedDark, margin: 0 }}>{p.installment}</p>
                  </div>
                </div>
              </div>

            </Col>

{/* ── RIGHT col (4) — sticky sidebar ── */}
            <Col span={4}>
              <div style={{ position: isMobile ? "relative" : "sticky", top: isMobile ? undefined : "80px", display: "flex", flexDirection: "column", gap: "16px" }}>

{/* CTA card */}
                <div className="pr-reveal" style={{ background: C.dark, borderRadius: "2px", padding: "28px 24px" }}>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.light, marginBottom: "10px" }}>{t("project.interested")}</p>
                  <h3 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "1.6rem", fontWeight: 400, color: C.light, lineHeight: 1.25, marginBottom: "8px" }}>
                    {t("project.offerTitle")}
                  </h3>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "1.4rem", fontWeight: 700, color: C.light, marginBottom: "16px" }}>{priceLabel}</p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: C.light, lineHeight: 1.6, marginBottom: "20px" }}>
                    {t("project.offerBody")}
                  </p>
                  <button onClick={() => setShowOfferForm(true)} style={{ display: "block", width: "100%", fontFamily: "Inter, sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, background: C.teal, border: "none", borderRadius: "2px", padding: "14px", textDecoration: "none", textAlign: "center", cursor: "pointer", transition: "opacity 0.2s" }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                    {t("project.offerModal.title")}
                  </button>
                  {p.apartmentsKey && (
                    <a href="#apartments" style={{ display: "block", width: "100%", marginTop: 10, fontFamily: "Inter, sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, background: "transparent", border: "1px solid rgba(255,254,249,0.2)", borderRadius: "2px", padding: "14px", textDecoration: "none", textAlign: "center" }}>
                      {t("chess.chooseCta")}
                    </a>
                  )}
                </div>

{/* Quick facts */}
                <div className="pr-reveal" style={{ transitionDelay: "80ms", background: C.light, borderRadius: "2px", padding: "20px 18px" }}>
{[
    { label: t("project.estRoi"), value: p.yield },
    { label: t("project.from"), value: priceLabel },
    { label: t("project.ready"), value: p.completion },
    { label: t("project.sea"), value: p.seaDistance },
                  ].map((row, i) => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 3 ? "1px solid rgba(33,20,26,0.07)" : "none" }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", color: C.muted }}>{row.label}</span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 700, color: C.dark }}>{row.value}</span>
                    </div>
                  ))}
                </div>

{/* Live Camera Card */}
                  {p.liveCameraUrl && (
                  <a href={p.liveCameraUrl} target="_blank" rel="noopener noreferrer" className="pr-reveal" style={{ transitionDelay: "160ms", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: C.dark, borderRadius: "2px", padding: "20px 24px", border: "1px solid rgba(255,60,60,0.3)", textDecoration: "none", transition: "border-color 0.2s, box-shadow 0.2s" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,60,60,0.6)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 12px rgba(255,60,60,0.2)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,60,60,0.3)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff3c3c", flexShrink: 0, boxShadow: "0 0 8px #ff3c3c" }} />
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff3c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="15" height="10" rx="1"/><polyline points="17 9 22 6 22 18 17 15"/></svg>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light }}>{t("project.liveCamera")}</span>
                  </a>
                )}
                {p.tourUrl && (
                  <a href="#apartments" className="pr-reveal" style={{ transitionDelay: "200ms", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: C.dark, borderRadius: "2px", padding: "20px 24px", border: "1px solid rgba(140,178,192,0.1)", textDecoration: "none" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light }}>{t("chess.view3d")}</span>
                  </a>
                )}
                {p.panoramaUrl && (
                  <a href={p.panoramaUrl} target="_blank" rel="noopener noreferrer" className="pr-reveal" style={{ transitionDelay: "240ms", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: C.dark, borderRadius: "2px", padding: "20px 24px", border: "1px solid rgba(140,178,192,0.1)", textDecoration: "none" }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light }}>{t("chess.viewPanorama")}</span>
                  </a>
                )}

              </div>
            </Col>

          </Row>
        </Container>
      </section>



{/* ── APARTMENT SELECTOR ── */}
      {p.apartmentsKey === "piazza" && (
        <section style={{ padding: "80px 0 0" }}>
          <Container>
            <div className="pr-reveal">
              <PiazzaViewer projectName={p.name} />
            </div>
          </Container>
        </section>
      )}
      {p.apartmentsKey === "parkline" && p.tourUrl && (
        <section style={{ padding: "80px 0 0" }}>
          <Container>
            <div className="pr-reveal">
              <ParklineViewer projectName={p.name} tourUrl={p.tourUrl} panoramaUrl={p.panoramaUrl} />
            </div>
          </Container>
        </section>
      )}

{/* ── FLOOR PLANS ── */}
      <section style={{ padding: "80px 0 0" }}>
        <Container>
          <div className="pr-reveal" style={{ marginBottom: "40px" }}>
            <h3 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "clamp(1.6rem,2.5vw,2.2rem)", fontWeight: 400, color: C.dark, margin: 0 }}>
              {t("project.availableLayouts")}
            </h3>
          </div>
          {p.floorPlans && p.floorPlans.length > 0 ? (
            <LayoutCarousel
              plans={p.floorPlans}
              labels={p.floorPlanLabels}
              areas={p.floorPlanAreas}
              onOpen={setModalSrc}
            />
          ) : (
          <div className="pr-reveal pr-layouts" style={{ transitionDelay: "80ms", display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, minmax(0, 1fr))", gap: isMobile ? "10px" : "16px" }}>
            {[null, null, null].map((_, n) => (
                <div key={n} style={{ border: "1.5px dashed rgba(33,20,26,0.15)", borderRadius: "2px", aspectRatio: "3/4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", background: "#FFFEF9" }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(33,20,26,0.2)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="1"/>
                    <path d="M3 9h18M9 9v12M3 15h6"/>
                  </svg>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(33,20,26,0.3)" }}>
                    {t("project.layoutComingSoon", { number: n + 1 })}
                  </span>
                </div>
            ))}
          </div>
          )}
        </Container>
      </section>

{/* ── MAP ── */}
      <section style={{ padding: "80px 0 0" }}>
        <Container>
          <div className="pr-reveal" style={{ marginBottom: "24px" }}>
            <h3 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "clamp(1.6rem,2.5vw,2.2rem)", fontWeight: 400, color: C.dark }}>
{p.location}
            </h3>
          </div>
          <div className="pr-reveal" style={{ transitionDelay: "80ms" }}>
            <MapEmbed project={p} />
          </div>
          {/* District description */}
          <div className="pr-reveal" style={{ transitionDelay: "140ms", marginTop: "32px", background: C.light, borderRadius: "2px", padding: "28px 28px" }}>
            <h4 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "1.2rem", fontWeight: 400, color: C.dark, marginBottom: "12px" }}>{p.districtTitle ?? t("project.district.newBoulevard.title")}</h4>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "1rem", color: C.mutedDark, lineHeight: 1.8, margin: 0 }}>
              {p.districtBody ?? t("project.district.newBoulevard.body")}
              <br /><br />
              {p.districtBody2 ?? t("project.district.newBoulevard.body2")}
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
                <h2 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 400, color: C.light, marginBottom: "16px", lineHeight: 1.1, textAlign: "center" }}>
                  {t("project.cta.title")}<br />
                  <em style={{ color: C.light, fontStyle: "italic" }}>{p.name}?</em>
                </h2>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", color: C.light, lineHeight: 1.7, maxWidth: "420px", margin: "0 auto 32px" }}>
                  {t("project.cta.body")}
                </p>
                <AppLink href="/#contact" style={{ display: "inline-block", fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, background: C.teal, borderRadius: "2px", padding: "15px 36px", textDecoration: "none" }}>
                  {t("cta.getFreeOffer")}
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
            <Eyebrow>{t("project.otherProjects")}</Eyebrow>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px" }}>
{[prev, next].map((proj) => (
              <Link key={proj.slug} href={`/project/${proj.slug}`}>
                <a style={{ display: "block", textDecoration: "none", borderRadius: "2px", overflow: "hidden", position: "relative", height: "200px", background: C.dark }}>
                  <img src={proj.cardImage} alt={proj.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(33,20,26,0.8) 0%, transparent 60%)" }} />
                  <div style={{ position: "absolute", bottom: "16px", left: "20px" }}>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.light, marginBottom: "4px" }}>{proj.tag}</p>
                    <h3 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "1.3rem", fontWeight: 400, color: C.light, margin: 0 }}>{proj.name}</h3>
                  </div>
                  <div style={{ position: "absolute", top: "14px", right: "14px", background: C.light, borderRadius: "2px", padding: "3px 10px", fontFamily: "Inter, sans-serif", fontSize: "0.6rem", fontWeight: 700, color: C.dark }}>
                    {proj.yield} {t("catalog.roi")}
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
            <img src={modalSrc} alt={t("project.modal.layoutPreview")} style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "2px" }} />
            <button onClick={() => setModalSrc(null)} style={{ position: "absolute", top: "-40px", right: "0", width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,254,249,0.1)", border: "1px solid rgba(255,254,249,0.25)", color: "#FFFEF9", fontSize: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,254,249,0.2)")} onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,254,249,0.1)")}>
              ✕
            </button>
          </div>
        </div>
      )}

{/* Offer Form Modal */}
      <RequestModal
        open={showOfferForm}
        onClose={() => setShowOfferForm(false)}
        title={t("popup.submit")}
        subtitle={t("project.offerModal.body", { project: project.name })}
        source="Project page"
        topic={project.name}
      />
    </div>
  </>);
}
