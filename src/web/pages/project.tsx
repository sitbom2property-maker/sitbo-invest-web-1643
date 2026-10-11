import { useState, useEffect, useRef, type CSSProperties } from "react";
import { Link, useParams } from "wouter";
import { projects, catalogListedProjects, resolvePaymentPlans, type Project } from "../data/projects";
import { localizeProjects } from "../data/projects-locale";
import { RequestModal } from "../components/RequestModal";
import { ProjectFeatures } from "../components/ProjectFeatures";
import { useRates } from "../context/RatesContext";
import { useLocale } from "../context/LocaleContext";
import { useT } from "../i18n";
import { allowShareCopy } from "../lib/content-protection";

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
      fontFamily: "JUN, Georgia, serif",
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
  return <div style={{ height: "1px", background: "rgba(33,20,26,0.08)", margin: "8px 0" }} />;
}

// ─── Gallery (JamesEdition-style mosaic + lightbox) ───────────────────────────
function Gallery({
  photos,
  preview,
  name,
}: {
  photos: string[];
  preview?: string[];
  name: string;
}) {
  const t = useT();
  const isMobile = useIsMobile();
  const [lightbox, setLightbox] = useState<number | null>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const thumbDragRef = useRef<{
    pointerId: number;
    startX: number;
    startScroll: number;
    moved: boolean;
  } | null>(null);
  const suppressThumbClickRef = useRef(false);
  const list = photos.length > 0 ? photos : [];
  const reel = (preview && preview.length > 0 ? preview : list).slice(0, 5);
  const hero = reel[0];
  const mosaic = reel.slice(1, 5);
  const openSrc = (src: string) => {
    const idx = list.indexOf(src);
    setLightbox(idx >= 0 ? idx : 0);
  };
  const openAll = () => setLightbox(0);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % list.length));
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? i : (i - 1 + list.length) % list.length));
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, list.length]);

  useEffect(() => {
    if (lightbox === null || !thumbsRef.current) return;
    const rail = thumbsRef.current;
    const active = rail.querySelector<HTMLElement>(`[data-thumb-index="${lightbox}"]`);
    if (!active) return;
    const left = active.offsetLeft - (rail.clientWidth - active.offsetWidth) / 2;
    const max = Math.max(0, rail.scrollWidth - rail.clientWidth);
    rail.scrollTo({ left: Math.min(max, Math.max(0, left)), behavior: "smooth" });
  }, [lightbox]);

  // Desktop: drag-to-scroll + map vertical wheel to horizontal scroll.
  useEffect(() => {
    if (lightbox === null) return;
    const rail = thumbsRef.current;
    if (!rail) return;

    const onWheel = (e: WheelEvent) => {
      const max = rail.scrollWidth - rail.clientWidth;
      if (max <= 0) return;
      const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (dx === 0) return;
      e.preventDefault();
      rail.scrollLeft += dx;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      if (e.button !== 0) return;
      thumbDragRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startScroll: rail.scrollLeft,
        moved: false,
      };
      // Do not capture yet — capturing immediately steals click from thumb buttons.
      rail.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      const drag = thumbDragRef.current;
      if (!drag || drag.pointerId !== e.pointerId) return;
      const dx = e.clientX - drag.startX;
      if (Math.abs(dx) <= 4) return;
      if (!drag.moved) {
        drag.moved = true;
        try {
          rail.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }
      e.preventDefault();
      rail.scrollLeft = drag.startScroll - dx;
    };

    const endDrag = (e: PointerEvent) => {
      const drag = thumbDragRef.current;
      if (!drag || drag.pointerId !== e.pointerId) return;
      if (drag.moved) suppressThumbClickRef.current = true;
      thumbDragRef.current = null;
      try {
        if (rail.hasPointerCapture?.(e.pointerId)) rail.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      rail.style.cursor = "grab";
    };

    rail.addEventListener("wheel", onWheel, { passive: false });
    rail.addEventListener("pointerdown", onPointerDown);
    rail.addEventListener("pointermove", onPointerMove);
    rail.addEventListener("pointerup", endDrag);
    rail.addEventListener("pointercancel", endDrag);
    return () => {
      rail.removeEventListener("wheel", onWheel);
      rail.removeEventListener("pointerdown", onPointerDown);
      rail.removeEventListener("pointermove", onPointerMove);
      rail.removeEventListener("pointerup", endDrag);
      rail.removeEventListener("pointercancel", endDrag);
    };
  }, [lightbox]);

  if (!hero) return null;

  const cellBtn: CSSProperties = {
    position: "relative",
    display: "block",
    width: "100%",
    height: "100%",
    margin: 0,
    padding: 0,
    border: "none",
    background: C.dark,
    borderRadius: 2,
    overflow: "hidden",
    cursor: "pointer",
  };

  const cellImg: CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.45s ease",
  };

  return (
    <>
      <div
        className="pr-gallery"
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: isMobile || mosaic.length === 0 ? "1fr" : "1.15fr 1fr",
          gridTemplateRows: isMobile
            ? mosaic.length > 0
              ? "minmax(220px, 42vw) minmax(160px, 28vw)"
              : "minmax(240px, 48vw)"
            : "1fr",
          gap: 6,
          height: isMobile ? "auto" : "clamp(380px, 48vw, 560px)",
          borderRadius: 2,
          overflow: "hidden",
          background: C.light,
        }}
      >
        <button type="button" onClick={() => openSrc(hero)} style={{ ...cellBtn, gridRow: isMobile ? "1" : "1 / -1" }} aria-label={name}>
          <img
            src={hero}
            alt={name}
            style={cellImg}
            onMouseEnter={(e) => {
              if (!isMobile) e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          />
        </button>

        {mosaic.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              gap: 6,
              minHeight: isMobile ? 160 : 0,
            }}
          >
            {mosaic.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => openSrc(src)}
                style={cellBtn}
                aria-label={`${name} ${i + 2}`}
              >
                <img
                  src={src}
                  alt=""
                  style={cellImg}
                  onMouseEnter={(e) => {
                    if (!isMobile) e.currentTarget.style.transform = "scale(1.03)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                />
              </button>
            ))}
            {!isMobile && mosaic.length < 4
              ? Array.from({ length: 4 - mosaic.length }).map((_, i) => (
                  <div key={`empty-${i}`} style={{ background: "rgba(33,20,26,0.04)", borderRadius: 2 }} />
                ))
              : null}
          </div>
        ) : null}

        <button
          type="button"
          onClick={openAll}
          style={{
            position: "absolute",
            right: isMobile ? 12 : 16,
            bottom: isMobile ? 12 : 16,
            zIndex: 2,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: isMobile ? "10px 14px" : "11px 16px",
            borderRadius: 2,
            border: "1px solid rgba(33,20,26,0.08)",
            background: "#FFFEF9",
            color: C.dark,
            boxShadow: "0 8px 24px rgba(33,20,26,0.16)",
            cursor: "pointer",
            fontFamily: "Nunito, sans-serif",
            fontSize: isMobile ? "0.78rem" : "0.84rem",
            fontWeight: 600,
            letterSpacing: "0.01em",
            lineHeight: 1,
          }}
        >
          {t("project.showAllPhotos")}
        </button>
      </div>

      {lightbox !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("project.showAllPhotos")}
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1200,
            background: "rgba(17,10,13,0.92)",
            backdropFilter: "blur(8px)",
            display: "flex",
            flexDirection: "column",
            cursor: "zoom-out",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: isMobile ? "16px 18px" : "20px 28px",
              color: C.light,
              flexShrink: 0,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ margin: 0, fontFamily: "Nunito, sans-serif", fontSize: "0.85rem", fontWeight: 500, opacity: 0.85 }}>
              {lightbox + 1} / {list.length}
            </p>
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label={t("cookie.close")}
              style={{
                width: 44,
                height: 44,
                border: "none",
                background: "transparent",
                color: C.light,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                opacity: 0.9,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: isMobile ? 0 : 12,
              padding: isMobile ? "0 12px 20px" : "0 20px 28px",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {list.length > 1 ? (
              <button
                type="button"
                onClick={() => setLightbox((lightbox - 1 + list.length) % list.length)}
                aria-label="Previous"
                style={{
                  display: isMobile ? "none" : "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 48,
                  height: 48,
                  border: "none",
                  background: "transparent",
                  color: C.light,
                  cursor: "pointer",
                  padding: 0,
                  flexShrink: 0,
                  opacity: 0.9,
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : null}

            <div
              style={{
                flex: 1,
                height: "100%",
                maxWidth: "min(1100px, 92vw)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "default",
              }}
            >
              <img
                key={list[lightbox]}
                src={list[lightbox]}
                alt={`${name} ${lightbox + 1}`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: 2,
                  display: "block",
                  boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
                  animation: "fadeIn 0.25s ease",
                }}
              />
            </div>

            {list.length > 1 ? (
              <button
                type="button"
                onClick={() => setLightbox((lightbox + 1) % list.length)}
                aria-label="Next"
                style={{
                  display: isMobile ? "none" : "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 48,
                  height: 48,
                  border: "none",
                  background: "transparent",
                  color: C.light,
                  cursor: "pointer",
                  padding: 0,
                  flexShrink: 0,
                  opacity: 0.9,
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : null}
          </div>

          {list.length > 1 ? (
            <div
              ref={thumbsRef}
              onClick={(e) => e.stopPropagation()}
              className="pr-lightbox-thumbs"
              style={{
                flexShrink: 0,
                width: "100%",
                maxWidth: "100%",
                minWidth: 0,
                display: "flex",
                gap: 8,
                overflowX: "auto",
                overflowY: "hidden",
                WebkitOverflowScrolling: "touch",
                overscrollBehaviorX: "contain",
                touchAction: "pan-x",
                scrollSnapType: "x proximity",
                padding: isMobile ? "0 16px 20px" : "0 28px 28px",
                cursor: "grab",
                userSelect: "none",
              }}
            >
              {list.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  data-thumb-index={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (suppressThumbClickRef.current) {
                      suppressThumbClickRef.current = false;
                      e.preventDefault();
                      return;
                    }
                    setLightbox(i);
                  }}
                  onPointerUp={(e) => {
                    // Touch / delayed-click fallback if click is swallowed by drag handlers.
                    if (e.pointerType === "mouse") return;
                    if (suppressThumbClickRef.current || thumbDragRef.current?.moved) return;
                    setLightbox(i);
                  }}
                  style={{
                    flex: "0 0 auto",
                    width: isMobile ? 64 : 78,
                    height: isMobile ? 48 : 56,
                    padding: 0,
                    borderRadius: 2,
                    border: i === lightbox ? `1.5px solid ${C.light}` : "1.5px solid transparent",
                    overflow: "hidden",
                    cursor: "inherit",
                    opacity: i === lightbox ? 1 : 0.55,
                    background: C.dark,
                    scrollSnapAlign: "center",
                    touchAction: "pan-x",
                  }}
                >
                  <img src={src} alt="" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }} />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

// ─── Map ──────────────────────────────────────────────────────────────────────
function MapEmbed({ project }: { project: Project }) {
  const q = project.mapsQuery
    ? encodeURIComponent(project.mapsQuery)
    : `${project.lat},${project.lng}`;
  const mapUrl = `https://maps.google.com/maps?q=${q}&z=16&output=embed`;
  return (<>

    <div style={{ borderRadius: "2px", overflow: "hidden", height: "clamp(280px, 42vw, 420px)", background: C.light }}>
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
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showCtaForm, setShowCtaForm] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [ownershipOpen, setOwnershipOpen] = useState(false);
  const [propertyTypeInfoOpen, setPropertyTypeInfoOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const localizedList = localizeProjects(projects, language);
  const listedList = localizeProjects(catalogListedProjects(projects), language);
  const idx    = localizedList.findIndex(p => p.slug === params.slug);
  const project = localizedList[idx];

  // Always open a project at the top — never jump to the apartment selector.
  useEffect(() => {
    const hash = window.location.hash.replace(/^#\/?/, "").toLowerCase();
    if (/(apartments|2d|360|chess|floors|tour|pano|^3d$)/.test(hash)) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    const toTop = () => window.scrollTo(0, 0);
    toTop();
    // Beat delayed ScrollToHash / ScrollRestore timers
    const t1 = window.setTimeout(toTop, 100);
    const t2 = window.setTimeout(toTop, 320);
    setFeaturesOpen(false);
    setOwnershipOpen(false);
    setPropertyTypeInfoOpen(false);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [params.slug]);

  useEffect(() => {
    if (!ownershipOpen && !propertyTypeInfoOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOwnershipOpen(false);
        setPropertyTypeInfoOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [ownershipOpen, propertyTypeInfoOpen]);

  if (!project) {
    return (<>

      <div style={{ background: C.light, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "JUN, Georgia, serif", fontSize: "2rem", color: C.dark }}>{t("project.notFound")}</h1>
          <Link href="/"><a style={{ fontFamily: "Nunito, sans-serif", color: C.teal }}>{t("project.backHome")}</a></Link>
        </div>
      </div>
    
  </>);
  }

  const priceLabel = formatFromUSD(project.priceUSD, { prefix: t("cta.from") });
  const paymentPlans = resolvePaymentPlans(project);

  const p = project;
  const propertyType = p.propertyType ?? "apartment";
  const typeKey =
    propertyType === "residence"
      ? "project.propertyType.residence"
      : propertyType === "villa"
        ? "project.propertyType.villa"
        : propertyType === "townhouse"
          ? "project.propertyType.townhouse"
          : propertyType === "aparthotel"
            ? "project.propertyType.aparthotel"
            : propertyType === "apartment-aparthotel"
              ? "project.propertyType.apartmentAparthotel"
              : "project.propertyType.apartment";
  const listedIdx = listedList.findIndex((x) => x.slug === p.slug);
  const navIdx = listedIdx >= 0 ? listedIdx : 0;
  const prev = listedList[(navIdx - 1 + listedList.length) % listedList.length];
  const next = listedList[(navIdx + 1) % listedList.length];
  const metaLabel: CSSProperties = {
    fontFamily: "Nunito, sans-serif",
    fontSize: "13px",
    color: "rgba(33,20,26,0.45)",
    margin: 0,
    lineHeight: "16px",
    height: 16,
    display: "flex",
    alignItems: "center",
    gap: 6,
  };
  const metaValue: CSSProperties = {
    fontFamily: "Nunito, sans-serif",
    fontSize: "16px",
    fontWeight: 700,
    color: C.dark,
    margin: 0,
    lineHeight: 1.3,
  };
  const metaCol: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    alignItems: "flex-start",
  };

  return (<>

    <div className="project-page" style={{ background: C.light, minHeight: "100vh", color: C.dark, overflowX: "hidden", width: "100%" }}>

{/* ── CSS fadeIn keyframe ── */}
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        .project-page p, .project-page h2, .project-page h3 {
          overflow-wrap: break-word;
        }
        .pr-lightbox-thumbs {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .pr-lightbox-thumbs::-webkit-scrollbar {
          display: none;
          height: 0;
        }
      `}</style>

{/* ── GALLERY — Full width ── */}
      <section style={{ paddingTop: 60 }}>
        <Container>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 10,
            }}
          >
            <Link href="/catalog">
              <a
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "Nunito, sans-serif",
                  fontSize: isMobile ? "0.78rem" : "0.85rem",
                  fontWeight: 500,
                  color: C.dark,
                  textDecoration: "none",
                  opacity: 0.75,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.75")}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M10 3.5 5.5 8 10 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t("project.backToSearch")}
              </a>
            </Link>

            <button
              type="button"
              onClick={async () => {
                const url = typeof window !== "undefined" ? window.location.href : "";
                allowShareCopy();
                try {
                  if (navigator.clipboard?.writeText) {
                    await navigator.clipboard.writeText(url);
                  } else {
                    const input = document.createElement("input");
                    input.value = url;
                    document.body.appendChild(input);
                    input.select();
                    document.execCommand("copy");
                    document.body.removeChild(input);
                  }
                  setLinkCopied(true);
                  window.setTimeout(() => setLinkCopied(false), 2000);
                } catch {
                  /* ignore */
                }
              }}
              data-share-link="true"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "Nunito, sans-serif",
                fontSize: isMobile ? "0.78rem" : "0.85rem",
                fontWeight: 500,
                color: C.dark,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "6px 0",
                opacity: 0.75,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.75")}
              aria-live="polite"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.6" />
                <path d="M8.6 10.7 15.4 6.8M8.6 13.3l6.8 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              {linkCopied ? t("project.linkCopied") : t("project.share")}
            </button>
          </div>
          <Gallery photos={p.photos} preview={p.galleryPreview} name={p.name} />
        </Container>
      </section>

{/* ── MAIN CONTENT ── */}
      <section style={{ padding: isMobile ? "36px 0 0" : "64px 0 0" }}>
        <Container>
          <Row gap={isMobile ? 28 : 48}>

{/* ── LEFT col (8) ── */}
            <Col span={8}>

{/* Overview */}
              <div className="pr-reveal" style={{ marginBottom: isMobile ? "48px" : "72px" }}>
                <h2 style={{ fontFamily: "JUN, Georgia, serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 400, color: C.dark, lineHeight: 1.15, marginBottom: "12px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20 }}>
                  <span>{p.name}</span>
                  {p.trophyProperty ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        alignSelf: "center",
                        gap: 6,
                        fontFamily: "Nunito, sans-serif",
                        fontSize: isMobile ? "0.62rem" : "0.68rem",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: C.light,
                        background: C.dark,
                        borderRadius: 2,
                        padding: isMobile ? "6px 10px" : "7px 12px",
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M7 4h10v3a5 5 0 0 1-4 4.9V15h3v2H8v-2h3v-3.1A5 5 0 0 1 7 7V4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                        <path d="M7 5H4v1a3 3 0 0 0 3 3M17 5h3v1a3 3 0 0 1-3 3M8 19h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                      {t("project.trophyProperty")}
                    </span>
                  ) : null}
                </h2>

                <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.95rem", color: C.mutedDark, display: "flex", alignItems: "flex-start", gap: "6px", marginBottom: "20px", lineHeight: 1.5 }}>
                  <svg width="11" height="13" viewBox="0 0 12 14" fill="none" style={{ flexShrink: 0, marginTop: 2 }}><path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5c-.83 0-1.5-.67-1.5-1.5S5.17 3.5 6 3.5 7.5 4.17 7.5 5 6.83 6.5 6 6.5z" fill="currentColor"/></svg>
                  <span>{p.address} · {p.seaDistance}</span>
                </p>

                {/* Key params: property type / price per sqm / ready */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, minmax(120px, max-content))",
                    columnGap: isMobile ? "24px" : "48px",
                    rowGap: "16px",
                    paddingTop: 30,
                    paddingBottom: 30,
                    marginBottom: 0,
                    alignItems: "start",
                  }}
                >
                  <div style={metaCol}>
                    <p style={metaLabel}>
                      {t("project.propertyType")}
                      <button
                        type="button"
                        onClick={() => setPropertyTypeInfoOpen(true)}
                        aria-label={t("project.propertyType.infoAria")}
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          border: "1px solid rgba(33,20,26,0.35)",
                          background: "transparent",
                          color: "rgba(33,20,26,0.55)",
                          cursor: "pointer",
                          padding: 0,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "Nunito, sans-serif",
                          fontSize: 10,
                          fontWeight: 600,
                          lineHeight: 1,
                          flexShrink: 0,
                        }}
                      >
                        i
                      </button>
                    </p>
                    <p style={metaValue}>{t(typeKey)}</p>
                  </div>
                  <div style={metaCol}>
                    <p style={metaLabel}>{t("project.pricePerSqm")}</p>
                    <p style={metaValue}>{p.pricePerSqm ?? "—"}</p>
                  </div>
                  <div style={metaCol}>
                    <p style={metaLabel}>{t("project.ready")}</p>
                    <p style={metaValue}>{p.completion}</p>
                  </div>
                </div>

                <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.05rem", color: C.mutedDark, lineHeight: 1.75 }}>{p.desc}</p>

                {/* Developer / Architecture — minimal */}
                <div
                  style={{
                    marginTop: isMobile ? "36px" : "44px",
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "minmax(140px, max-content) minmax(140px, max-content)",
                    columnGap: isMobile ? 0 : 64,
                    rowGap: 20,
                  }}
                >
                  <div>
                    <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "13px", color: "rgba(33,20,26,0.45)", margin: "0 0 6px", lineHeight: 1.3 }}>
                      {t("project.developer")}
                    </p>
                    <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "16px", fontWeight: 600, color: C.dark, margin: 0, lineHeight: 1.3 }}>
                      {p.developer}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "13px", color: "rgba(33,20,26,0.45)", margin: "0 0 6px", lineHeight: 1.3 }}>
                      {t("project.architecture")}
                    </p>
                    <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "16px", fontWeight: 600, color: C.dark, margin: 0, lineHeight: 1.3 }}>
                      {p.architect && p.architect !== "TBA" ? p.architect : t("project.architectPlaceholder")}
                    </p>
                  </div>
                </div>
              </div>

              <Divider />

{/* Specs — 3×2 stacked label/value grid (no dividers) */}
              <div className="pr-reveal" style={{ margin: isMobile ? "56px 0" : "72px 0" }}>
                <h3 style={{ fontFamily: "JUN, Georgia, serif", fontSize: "clamp(1.35rem, 2.2vw, 1.7rem)", fontWeight: 500, color: C.dark, lineHeight: 1.25, margin: "0 0 28px" }}>
                  {t("project.specs")}
                </h3>
                {(() => {
                  const specs = [
                    { label: t("project.spec.buildings"), value: p.buildings },
                    { label: t("project.spec.floors"), value: p.floors },
                    { label: t("project.spec.ceilingHeight"), value: p.ceilingHeight },
                    { label: t("project.spec.area"), value: p.area },
                    { label: t("project.spec.finishing"), value: p.finishing },
                    { label: t("project.spec.climateAdaptation"), value: p.climateAdaptation ?? t("project.spec.climateYes") },
                  ];
                  return (
                    <div
                      className="project-specs-grid"
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, minmax(0, 1fr))",
                        columnGap: isMobile ? 24 : 48,
                        rowGap: isMobile ? 20 : 28,
                        alignItems: "start",
                      }}
                    >
                      {specs.map((s) => (
                        <div key={s.label} style={{ minWidth: 0 }}>
                          <p
                            style={{
                              fontFamily: "Nunito, sans-serif",
                              fontSize: "13px",
                              fontWeight: 400,
                              color: "rgba(33,20,26,0.45)",
                              lineHeight: 1.3,
                              margin: "0 0 6px",
                            }}
                          >
                            {s.label}
                          </p>
                          <p
                            style={{
                              fontFamily: "Nunito, sans-serif",
                              fontSize: "16px",
                              fontWeight: 700,
                              color: C.dark,
                              lineHeight: 1.3,
                              margin: 0,
                            }}
                          >
                            {s.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              <Divider />

{/* Features */}
              <div style={{ margin: isMobile ? "56px 0" : "72px 0" }}>
              <ProjectFeatures
                features={p.features}
                materials={p.materials}
                open={featuresOpen}
                onOpen={() => setFeaturesOpen(true)}
                onClose={() => setFeaturesOpen(false)}
                isMobile={isMobile}
              />
              </div>

{/* Ownership benefits — optional (e.g. Silk Rewards) */}
              {p.ownershipBenefits ? (
              <>
              <Divider />
              <div className="pr-reveal" style={{ margin: isMobile ? "56px 0" : "72px 0" }}>
                <h3 style={{ fontFamily: "JUN, Georgia, serif", fontSize: "clamp(1.35rem, 2.2vw, 1.7rem)", fontWeight: 500, color: C.dark, lineHeight: 1.25, margin: "0 0 28px" }}>
                  {t("project.ownershipBenefits")}
                </h3>
                <h4 style={{ fontFamily: "Nunito, sans-serif", fontSize: isMobile ? "1.05rem" : "1.15rem", fontWeight: 700, color: C.dark, lineHeight: 1.3, margin: "0 0 14px" }}>
                  {p.ownershipBenefits.title}
                </h4>
                {p.ownershipBenefits.body.split(/\n\n+/).map((para, i) => (
                  <p
                    key={i}
                    style={{
                      fontFamily: "Nunito, sans-serif",
                      fontSize: isMobile ? "0.95rem" : "1.05rem",
                      color: C.mutedDark,
                      lineHeight: 1.7,
                      margin: "0 0 14px",
                      maxWidth: 640,
                    }}
                  >
                    {para}
                  </p>
                ))}
                <button
                  type="button"
                  onClick={() => setOwnershipOpen(true)}
                  style={{
                    display: "inline",
                    marginTop: 4,
                    padding: 0,
                    border: "none",
                    background: "none",
                    color: "#2B6CB0",
                    fontFamily: "Nunito, sans-serif",
                    fontSize: isMobile ? "0.95rem" : "1.05rem",
                    fontWeight: 500,
                    lineHeight: 1.5,
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                    cursor: "pointer",
                  }}
                >
                  {p.ownershipBenefits.linkLabel}
                </button>
              </div>
              </>
              ) : null}

{/* Payment — optional, depends on developer terms */}
              {paymentPlans.length > 0 ? (
              <>
              <Divider />
              <div className="pr-reveal" style={{ margin: isMobile ? "56px 0" : "72px 0" }}>
                <h3 style={{ fontFamily: "JUN, Georgia, serif", fontSize: "clamp(1.35rem, 2.2vw, 1.7rem)", fontWeight: 500, color: C.dark, lineHeight: 1.25, margin: "0 0 28px" }}>
                  {t("project.payment")}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 14 : 16 }}>
                  {paymentPlans.map((plan, planIdx) => (
                    <div
                      key={`plan-${planIdx}`}
                      className="project-payment-bar"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: isMobile ? 6 : 8,
                        alignItems: "stretch",
                      }}
                    >
                      {plan.map((seg, segIdx) => {
                        const isDown = seg.stage === "down";
                        const label =
                          seg.stage === "down"
                            ? t("project.payment.down")
                            : seg.stage === "handover"
                              ? t("project.payment.handover")
                              : t("project.payment.construction");
                        return (
                          <div
                            key={`${planIdx}-${segIdx}-${seg.stage}`}
                            style={{
                              flex: `${seg.pct} 1 0`,
                              minWidth: 0,
                              boxSizing: "border-box",
                              borderRadius: 2,
                              padding: isMobile ? "14px 12px" : "20px 18px",
                              background: isDown ? C.teal : C.light,
                              border: `1px solid ${C.teal}`,
                              color: isDown ? C.light : C.dark,
                            }}
                          >
                            <p style={{ fontFamily: "Nunito, sans-serif", fontSize: isMobile ? "1.35rem" : "1.75rem", fontWeight: 700, margin: "0 0 6px", lineHeight: 1, color: "inherit" }}>
                              {seg.pct}%
                            </p>
                            <p style={{ fontFamily: "Nunito, sans-serif", fontSize: isMobile ? "0.68rem" : "0.78rem", fontWeight: 500, margin: 0, lineHeight: 1.25, color: "inherit", opacity: isDown ? 0.95 : 0.85 }}>
                              {label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
                <p
                  style={{
                    fontFamily: "Nunito, sans-serif",
                    fontSize: isMobile ? "0.84rem" : "0.9rem",
                    fontWeight: 400,
                    color: "rgba(33,20,26,0.5)",
                    lineHeight: 1.45,
                    margin: "20px 0 0",
                    maxWidth: 560,
                  }}
                >
                  {t("project.payment.note")}
                </p>
              </div>
              </>
              ) : null}

            </Col>

{/* ── RIGHT col (4) — sticky sidebar ── */}
            <Col span={4}>
              <div style={{ position: isMobile ? "relative" : "sticky", top: isMobile ? undefined : "80px", display: "flex", flexDirection: "column" }}>

{/* CTA card */}
                <div className="pr-reveal" style={{ background: C.dark, borderRadius: "2px", padding: "28px 24px" }}>
                  <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.light, marginBottom: "10px" }}>{t("project.interested")}</p>
                  <h3 style={{ fontFamily: "JUN, Georgia, serif", fontSize: "1.6rem", fontWeight: 400, color: C.light, lineHeight: 1.25, marginBottom: "8px" }}>
                    {t("project.offerTitle")}
                  </h3>
                  <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.4rem", fontWeight: 700, color: C.light, marginBottom: "16px" }}>{priceLabel}</p>
                  <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.8rem", color: C.light, lineHeight: 1.6, marginBottom: "20px" }}>
                    {t("project.offerBody")}
                  </p>
                  <button onClick={() => setShowOfferForm(true)} style={{ display: "block", width: "100%", fontFamily: "Nunito, sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, background: C.teal, border: "none", borderRadius: "2px", padding: "14px", textDecoration: "none", textAlign: "center", cursor: "pointer", transition: "opacity 0.2s" }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                    {t("project.offerModal.title")}
                  </button>
                </div>

                {(p.liveCameraUrl || p.tourUrl || p.panoramaUrl) ? (
                  <>
                    <div
                      style={{
                        height: 100,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <button
                        type="button"
                        aria-label={t("project.moreActions")}
                        onClick={() => {
                          document.getElementById("project-sidebar-actions")?.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                          });
                        }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          border: "1px solid rgba(33,20,26,0.18)",
                          background: C.light,
                          color: C.dark,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          padding: 0,
                          transition: "border-color 0.2s, opacity 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "rgba(33,20,26,0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "rgba(33,20,26,0.18)";
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                          <path d="M3.5 6.25 8 10.75l4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>

                    <div id="project-sidebar-actions" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {p.liveCameraUrl && (
                        <a href={p.liveCameraUrl} target="_blank" rel="noopener noreferrer" className="pr-reveal" style={{ transitionDelay: "160ms", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: C.light, borderRadius: "2px", padding: "20px 24px", border: "1px solid rgba(33,20,26,0.18)", textDecoration: "none", transition: "border-color 0.2s, background 0.2s" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(33,20,26,0.4)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(33,20,26,0.18)"; }}>
                          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff3c3c", flexShrink: 0, boxShadow: "0 0 8px rgba(255,60,60,0.45)" }} />
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.dark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="15" height="10" rx="1"/><polyline points="17 9 22 6 22 18 17 15"/></svg>
                          <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark }}>{t("project.liveCamera")}</span>
                        </a>
                      )}
                      {p.tourUrl && (
                        <a href={p.tourUrl} target="_blank" rel="noopener noreferrer" className="pr-reveal" style={{ transitionDelay: "200ms", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: C.light, borderRadius: "2px", padding: "20px 24px", border: "1px solid rgba(33,20,26,0.18)", textDecoration: "none", transition: "border-color 0.2s" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(33,20,26,0.4)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(33,20,26,0.18)"; }}>
                          <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark }}>{t("chess.view3d")}</span>
                        </a>
                      )}
                      {p.panoramaUrl && (
                        <a href={p.panoramaUrl} target="_blank" rel="noopener noreferrer" className="pr-reveal" style={{ transitionDelay: "240ms", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", background: C.light, borderRadius: "2px", padding: "20px 24px", border: "1px solid rgba(33,20,26,0.18)", textDecoration: "none", transition: "border-color 0.2s" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(33,20,26,0.4)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(33,20,26,0.18)"; }}>
                          <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark }}>{t("chess.viewPanorama")}</span>
                        </a>
                      )}
                    </div>
                  </>
                ) : null}

              </div>
            </Col>

          </Row>
        </Container>
      </section>




{/* ── LOCATION & LIFESTYLE ── */}
      <section style={{ padding: "0 0 clamp(56px, 7vw, 100px)" }}>
        <Container>
          <Divider />
          <div className="pr-reveal" style={{ margin: isMobile ? "56px 0 0" : "72px 0 0" }}>
            <h3
              style={{
                fontFamily: "JUN, Georgia, serif",
                fontSize: "clamp(1.35rem, 2.2vw, 1.7rem)",
                fontWeight: 500,
                color: C.dark,
                lineHeight: 1.25,
                margin: "0 0 28px",
              }}
            >
              {t("project.locationLifestyle")}
            </h3>
            <h4
              style={{
                fontFamily: "Nunito, sans-serif",
                fontSize: isMobile ? "1.15rem" : "1.25rem",
                fontWeight: 700,
                color: C.dark,
                lineHeight: 1.3,
                margin: "0 0 14px",
              }}
            >
              {p.districtTitle ?? t("project.district.newBoulevard.title")}
            </h4>
            <p
              style={{
                fontFamily: "Nunito, sans-serif",
                fontSize: "1.05rem",
                color: C.mutedDark,
                lineHeight: 1.7,
                margin: "0 0 clamp(28px, 3.5vw, 40px)",
                maxWidth: 820,
              }}
            >
              {[p.districtBody ?? t("project.district.newBoulevard.body"), p.districtBody2]
                .filter(Boolean)
                .join(" ")}
            </p>
            <div style={{ transitionDelay: "80ms" }}>
              <MapEmbed project={p} />
            </div>
          </div>
        </Container>
      </section>

{/* ── CTA (same as About / Catalog, bg #412834) ── */}
      <section className="pr-cta-outer">
        <style>{`
          .pr-cta-outer {
            max-width: var(--site-max, 1680px);
            margin: 0 auto;
            padding: 0 var(--site-gutter, clamp(16px, 2.8vw, 40px)) clamp(56px, 7vw, 100px);
            box-sizing: border-box;
            background: ${C.light};
          }
          .pr-cta {
            border-radius: 2px;
            overflow: hidden;
            background:
              radial-gradient(100% 140% at 90% 50%, rgba(112,60,84,.55) 0%, rgba(33,20,26,0) 55%),
              #412834;
            padding: clamp(40px, 5vw, 72px) clamp(24px, 4vw, 64px);
            text-align: center;
            color: ${C.light};
          }
          .pr-cta h2 {
            font-family: JUN, Georgia, serif;
            font-weight: 600;
            margin: 0 0 14px;
            font-size: clamp(28px, 3.6vw, 48px);
            line-height: 1.12;
            color: ${C.light};
          }
          .pr-cta p {
            margin: 0 auto 28px;
            max-width: 480px;
            font-family: Nunito, sans-serif;
            font-size: clamp(15px, 1.3vw, 17px);
            line-height: 1.5;
            color: ${C.light};
          }
          .pr-cta-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-family: Nunito, sans-serif;
            font-size: 15px;
            font-weight: 400;
            padding: 15px 30px;
            border-radius: 2px;
            border: 1px solid transparent;
            cursor: pointer;
            background: ${C.light};
            color: ${C.dark};
            transition: opacity .2s;
          }
          .pr-cta-btn:hover { opacity: .88; }
        `}</style>
        <div className="pr-cta pr-reveal">
          <h2>{t("services.cta.title")}</h2>
          <p>{t("services.cta.body")}</p>
          <button type="button" className="pr-cta-btn" onClick={() => setShowCtaForm(true)}>
            {t("services.cta.button")}
          </button>
        </div>
      </section>

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
                  {proj.cardImage ? (
                    <img src={proj.cardImage} alt={proj.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s" }}
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  ) : null}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(33,20,26,0.8) 0%, transparent 60%)" }} />
                  <div style={{ position: "absolute", bottom: "16px", left: "20px" }}>
                    <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.light, marginBottom: "4px" }}>{proj.tag}</p>
                    <h3 style={{ fontFamily: "JUN, Georgia, serif", fontSize: "1.3rem", fontWeight: 400, color: C.light, margin: 0 }}>{proj.name}</h3>
                  </div>
                  <div style={{ position: "absolute", top: "14px", right: "14px", background: C.light, borderRadius: "2px", padding: "3px 10px", fontFamily: "Nunito, sans-serif", fontSize: "0.6rem", fontWeight: 700, color: C.dark }}>
                    {proj.yield} {t("catalog.roi")}
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </Container>
      </section>

{/* Offer Form Modal */}
      <RequestModal
        open={showOfferForm}
        onClose={() => setShowOfferForm(false)}
        title={t("popup.submit")}
        subtitle={t("project.offerModal.body", { project: project.name })}
        source="Project page"
        topic={project.name}
      />
      <RequestModal
        open={showCtaForm}
        onClose={() => setShowCtaForm(false)}
        source="Project page CTA"
        title={t("services.cta.button")}
        topic={project.name}
      />

      {ownershipOpen && p.ownershipBenefits ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={p.ownershipBenefits.title}
          onClick={() => setOwnershipOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1300,
            background: "rgba(33,20,26,0.55)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: isMobile ? 20 : 32,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 520,
              maxHeight: "min(80vh, 640px)",
              overflowY: "auto",
              background: C.light,
              borderRadius: 2,
              padding: isMobile ? "28px 22px 24px" : "36px 32px 28px",
              boxShadow: "0 24px 64px rgba(33,20,26,0.28)",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
              <h3
                style={{
                  fontFamily: "JUN, Georgia, serif",
                  fontSize: isMobile ? "1.35rem" : "1.55rem",
                  fontWeight: 500,
                  color: C.dark,
                  margin: 0,
                  lineHeight: 1.25,
                }}
              >
                {p.ownershipBenefits.title}
              </h3>
              <button
                type="button"
                onClick={() => setOwnershipOpen(false)}
                aria-label={t("project.ownershipBenefits.close")}
                style={{
                  width: 36,
                  height: 36,
                  border: "none",
                  background: "transparent",
                  color: C.dark,
                  cursor: "pointer",
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  opacity: 0.7,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "grid",
                gap: 14,
              }}
            >
              {p.ownershipBenefits.popupItems.map((item) => (
                <li
                  key={item}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "18px 1fr",
                    gap: 12,
                    alignItems: "start",
                    fontFamily: "Nunito, sans-serif",
                    fontSize: isMobile ? "0.92rem" : "0.98rem",
                    lineHeight: 1.5,
                    color: C.dark,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#2B6CB0",
                      marginTop: 8,
                      display: "block",
                    }}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {propertyTypeInfoOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("project.propertyType.infoTitle")}
          onClick={() => setPropertyTypeInfoOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1300,
            background: "rgba(33,20,26,0.55)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: isMobile ? 20 : 32,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 560,
              maxHeight: "min(80vh, 720px)",
              overflowY: "auto",
              background: C.light,
              borderRadius: 2,
              padding: isMobile ? "28px 22px 24px" : "36px 32px 28px",
              boxShadow: "0 24px 64px rgba(33,20,26,0.28)",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 22 }}>
              <h3
                style={{
                  fontFamily: "JUN, Georgia, serif",
                  fontSize: isMobile ? "1.35rem" : "1.55rem",
                  fontWeight: 500,
                  color: C.dark,
                  margin: 0,
                  lineHeight: 1.25,
                }}
              >
                {t("project.propertyType.infoTitle")}
              </h3>
              <button
                type="button"
                onClick={() => setPropertyTypeInfoOpen(false)}
                aria-label={t("project.propertyType.infoClose")}
                style={{
                  width: 36,
                  height: 36,
                  border: "none",
                  background: "transparent",
                  color: C.dark,
                  cursor: "pointer",
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  opacity: 0.7,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {([
              {
                title: "project.propertyType.residentialTitle",
                lines: [
                  "project.propertyType.residentialStatus",
                  "project.propertyType.residentialUtilities",
                  "project.propertyType.residentialTaxes",
                ],
              },
              {
                title: "project.propertyType.commercialTitle",
                lines: [
                  "project.propertyType.commercialStatus",
                  "project.propertyType.commercialUtilities",
                  "project.propertyType.commercialTaxes",
                ],
              },
            ] as const).map((block) => (
              <div key={block.title} style={{ marginBottom: 22 }}>
                <h4
                  style={{
                    fontFamily: "Nunito, sans-serif",
                    fontSize: isMobile ? "0.98rem" : "1.05rem",
                    fontWeight: 700,
                    color: C.dark,
                    margin: "0 0 10px",
                    lineHeight: 1.35,
                  }}
                >
                  {t(block.title)}
                </h4>
                <div style={{ display: "grid", gap: 8 }}>
                  {block.lines.map((line) => (
                    <p
                      key={line}
                      style={{
                        fontFamily: "Nunito, sans-serif",
                        fontSize: isMobile ? "0.9rem" : "0.95rem",
                        lineHeight: 1.55,
                        color: C.mutedDark,
                        margin: 0,
                      }}
                    >
                      {t(line)}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  </>);
}
