import React, { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { Reviews } from "../components/reviews";
import { Partners } from "../components/partners";
import { projects as catalogProjects, type Project } from "../data/projects";
import { localizeProjects } from "../data/projects-locale";
import { useLocale } from "../context/LocaleContext";
import { useT } from "../i18n";
import { trackLead } from "../lib/analytics";

// ─── Palette ──────────────────────────────────────────────────────────────────
// #21141A  → primary dark
// #FFFEF9  → light
// #703C54  → wine accent
// #8CB2C0  → teal, only at 10%
const C = {
  light:     "#FFFEF9",
  parchment: "#FFFEF9",
  teal:      "#703C54",
  teal2:     "#703C54",
  wine:      "#703C54",
  dark:      "#21141A",
  darkTeal:  "#21141A",
  muted:     "rgba(33,20,26,0.55)",
};

// ─── Mobile hook ─────────────────────────────────────────────────────────────
function useIsMobile(bp = 768) {
  const [mobile, setMobile] = useState(() => typeof window !== "undefined" ? window.innerWidth < bp : false);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < bp);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [bp]);
  return mobile;
}

// ─── Scroll reveal ────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const stats = [
  { value: "1.7M",   labelKey: "home.analytics.stat.tourists" },
  { value: "$1,420", labelKey: "home.analytics.stat.avgPrice" },
  { value: "14.5%",  labelKey: "home.analytics.stat.maxYield" },
  { value: "0%",     labelKey: "home.analytics.stat.purchaseTax" },
] as const;

const triggers = [
  "home.analytics.trigger1.title",
  "home.analytics.trigger2.title",
  "home.analytics.trigger3.title",
  "home.analytics.trigger4.title",
  "home.analytics.trigger5.title",
  "home.analytics.trigger6.title",
] as const;

// ─── Insight slider data ──────────────────────────────────────────────────────
const insightSlides = [
  {
    id: "global-rank",
    eyebrow: "Global Recognition",
    headline: ["Georgia ranks", " 1st in the world", " for rental yield profitability."],
    accentIndex: [1], // index 1 in headline array gets 7D9FBB
    source: "Global Property Guide",
    sourceAccent: true,
    body: "According to Global Property Guide research, Georgia ranks first in the world for rental yields.",
    badge: "#1",
  },
  {
    id: "t1", eyebrow: "Residency", headline: ["Residency permit", " from $150,000", " investment."], accentIndex: [1], source: "Georgian Law · 2024", sourceAccent: false, body: "Foreign investors can obtain Georgian residency with a qualifying real estate investment starting at $150,000.", badge: null,
  },
  {
    id: "t2", eyebrow: "Off-Plan Returns", headline: ["25–30% profit", " on off-plan", " projects."], accentIndex: [0], source: "Sitbo Market Analysis", sourceAccent: false, body: "Off-plan buyers consistently realise 25–30% capital appreciation before handover as development completes.", badge: null,
  },
  {
    id: "t3", eyebrow: "Speed of Ownership", headline: ["1-day registration", " via blockchain."], accentIndex: [0], source: "National Agency of Public Registry", sourceAccent: false, body: "Georgia's blockchain-powered land registry enables property title transfer in a single business day.", badge: null,
  },
  {
    id: "t4", eyebrow: "Forbes Recognition", headline: ["Top-5 European", " investment city."], accentIndex: [1], source: "Forbes, 2025", sourceAccent: false, body: "Forbes ranked Batumi among the top 5 European cities for real estate investment in 2025.", badge: null,
  },
  {
    id: "t5", eyebrow: "Open Market", headline: ["No restrictions", " for foreign buyers."], accentIndex: [0], source: "Georgian Civil Code", sourceAccent: false, body: "Foreign nationals can purchase, own, and transfer Georgian real estate with the same rights as citizens.", badge: null,
  },
  {
    id: "t6", eyebrow: "Tax Advantages", headline: ["Free economic", " zone benefits."], accentIndex: [0], source: "Georgian Tax Code", sourceAccent: false, body: "Qualifying investments in Georgia's free economic zones benefit from reduced corporate and income tax rates.", badge: null,
  },
];

const bloomCalendar = [
  { monthKey: "home.lifestyle.bloom.janFeb.month", flowersKey: "home.lifestyle.bloom.janFeb.flowers" },
  { monthKey: "home.lifestyle.bloom.mar.month", flowersKey: "home.lifestyle.bloom.mar.flowers" },
  { monthKey: "home.lifestyle.bloom.apr.month", flowersKey: "home.lifestyle.bloom.apr.flowers" },
  { monthKey: "home.lifestyle.bloom.mayJun.month", flowersKey: "home.lifestyle.bloom.mayJun.flowers" },
  { monthKey: "home.lifestyle.bloom.julAug.month", flowersKey: "home.lifestyle.bloom.julAug.flowers" },
  { monthKey: "home.lifestyle.bloom.sepOct.month", flowersKey: "home.lifestyle.bloom.sepOct.flowers" },
  { monthKey: "home.lifestyle.bloom.novDec.month", flowersKey: "home.lifestyle.bloom.novDec.flowers" },
] as const;

const cardImages = [
  "/projects/parkline/for-sale/ext-park-hero.jpg",
  "/projects/silk/for-sale/card.jpg",
  "/projects/rogantini/for-sale/card.jpg",
  "/projects/ambassadori/for-sale/card.png",
  "/projects/gonio/for-sale/card.png",
];

const HERO_STYLES = `
  .hero-video-section .hero-gradient {
    background: linear-gradient(
      to top,
      rgba(20,14,18,0.72) 0%,
      rgba(20,14,18,0.35) 42%,
      rgba(20,14,18,0.08) 70%,
      rgba(20,14,18,0.0) 100%
    );
  }
  .hero-video-section .hero-outline-btn:hover {
    border-color: #703C54 !important;
    color: #FFFEF9 !important;
  }
  .hero-video-section .hero-roulette {
    font-family: 'JUN, Georgia, serif';
    font-style: italic;
    font-weight: 400;
    color: #FFFEF9;
  }
  .hero-video-section .hero-cta-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: stretch;
    gap: 12px;
    width: 100%;
    max-width: 420px;
    margin: 0 auto;
  }
  .hero-video-section .hero-cta-row .hero-cta-btn {
    flex: 1 1 0;
    text-align: center;
    box-sizing: border-box;
    border-radius: 0;
    padding: 16px 18px;
    font-family: Nunito, sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    text-decoration: none;
    color: #FFFEF9;
    background: transparent;
    border: 1px solid rgba(255,254,249, 0.35);
    transition: border-color 0.2s, color 0.2s;
    cursor: pointer;
  }
  .hero-video-section .hero-scroll-hint {
    position: absolute;
    left: 50%;
    bottom: 28px;
    transform: translateX(-50%);
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    font-family: Nunito, sans-serif;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #FFFEF9;
    text-decoration: none;
    white-space: nowrap;
    animation: heroScrollPulse 2.4s ease-in-out infinite;
  }
  .hero-video-section .hero-scroll-hint:hover {
    color: #FFFEF9;
  }
  .hero-video-section .hero-scroll-hint .hero-scroll-arrow {
    display: block;
    width: 14px;
    height: 14px;
    margin-top: 0;
  }
  .hero-video-section .hero-scroll-hint .hero-scroll-arrow svg {
    display: block;
    width: 100%;
    height: 100%;
  }
  @keyframes heroScrollPulse {
    0%, 100% { opacity: 0.25; }
    50% { opacity: 1; }
  }
  .hero-video-section .hero-copy {
    position: absolute;
    left: 50%;
    top: 22%;
    transform: translate(-50%, 0);
    z-index: 2;
    max-width: 780px;
    width: 90%;
    text-align: center;
  }
  .hero-video-section .hero-reviews {
    position: absolute;
    left: 50%;
    bottom: 18%;
    transform: translateX(-50%);
    z-index: 2;
    width: 90%;
    max-width: 420px;
    text-align: center;
  }
  @media (max-width: 768px) {
    .hero-video-section {
      height: 100svh !important;
      min-height: 640px !important;
    }
    .hero-video-section .hero-copy {
      top: calc(var(--nav-height, 72px) + 28px) !important;
      width: min(92%, 420px) !important;
    }
    .hero-video-section .hero-reviews {
      bottom: 108px !important;
      width: min(92%, 420px) !important;
    }
    .hero-video-section .hero-h1-video {
      font-size: clamp(40px, 11vw, 56px) !important;
      margin-bottom: 28px !important;
    }
    .hero-video-section .hero-cta-row .hero-cta-btn {
      padding: 15px 12px !important;
      font-size: 10px !important;
      letter-spacing: 0.14em !important;
    }
    .hero-video-section .hero-scroll-hint {
      bottom: 22px;
    }
  }
`;

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const t = useT();
  return (
    <>
      <style>{HERO_STYLES}</style>
      <section
        id="hero"
        className="hero-video-section snap-screen"
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          minHeight: "100vh",
          overflow: "hidden",
          marginTop: "calc(-1 * var(--nav-height, 88px))",
          marginLeft: "calc(-50vw + 50%)",
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload nofullscreen noremoteplayback"
          onContextMenu={(e) => e.preventDefault()}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <source src="/home/hero-video.webm" type="video/webm" />
          <source src="/home/hero-video.mp4" type="video/mp4" />
        </video>

        <div
          className="hero-gradient"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* Headline + CTAs — raised into the sky area */}
        <div className="hero-copy">
          <h1
            className="hero-h1-video"
            style={{
              fontFamily: "JUN, Georgia, serif",
              fontSize: "clamp(48px, 6.5vw, 92px)",
              fontWeight: 400,
              color: "#FFFEF9",
              lineHeight: 1.02,
              margin: "0 0 32px",
              letterSpacing: "-0.01em",
            }}
          >
            {t("home.hero.line1")}
            <br />
            <em className="hero-roulette">{t("home.hero.line2")}</em>
            <br />
            {t("home.hero.line3")}
            <br />
            {t("home.hero.line4")}
          </h1>

          <div className="hero-cta-row">
            <a href="#portfolio" className="hero-outline-btn hero-cta-btn">
              {t("home.hero.ctaProjects")}
            </a>
            <a href="#contact" className="hero-outline-btn hero-cta-btn">
              {t("home.hero.ctaContact")}
            </a>
          </div>
        </div>

        {/* Google Reviews stay in the lower hero position */}
        <a
          className="hero-reviews"
          href="https://g.page/r/CR1_vKWcSyUNEAI/review"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            color: C.light,
            textDecoration: "none",
            fontFamily: "Nunito, sans-serif",
            fontSize: "13px",
            letterSpacing: "0.08em",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.light)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.light)}
        >
          {t("home.hero.googleReviews")}
        </a>

        <a href="#founder-note" className="hero-scroll-hint" aria-label={t("home.hero.scroll")}>
          <span>{t("home.hero.scrollLabel")}</span>
          <span className="hero-scroll-arrow" aria-hidden="true">
            <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4.5L7 9.5L12 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </a>
      </section>
    </>
  );
}

// ─── Founder Note ─────────────────────────────────────────────────────────────
function FounderNote() {
  const isMobile = useIsMobile();
  const t = useT();
  return (
    <section id="founder-note" className="snap-screen" style={{ background: "#21141A", padding: "10px" }}>
      <div style={{ background: "#FFFEF9", borderRadius: "10px", overflow: "hidden", padding: "clamp(48px,8vw,80px) 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(24px, 4vw, 64px)", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "40px" : "80px", alignItems: "center" }}>

          {/* Left: photo */}
          <div className="reveal">
            <div style={{ aspectRatio: "3/4", overflow: "hidden", borderRadius: "4px", background: "#FFFEF9" }}>
              <img
                src="/home/arthur-founder.jpg"
                alt={t("home.founder.imageAlt")}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
              />
            </div>
          </div>

          {/* Right: quote */}
          <div className="reveal reveal-delay-2">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
              <div style={{ width: "28px", height: "1px", background: "#703C54" }} />
              <span style={{ fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(33,20,26,0.5)", fontFamily: "Nunito, sans-serif" }}>
                {t("home.founder.eyebrow")}
              </span>
            </div>

            <blockquote style={{ margin: "0 0 32px", padding: 0, fontFamily: "Nunito, sans-serif", fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)", fontWeight: 400, fontStyle: "italic", color: "#21141A", lineHeight: 1.25 }}>
              &ldquo;{t("home.founder.quote")}&rdquo;
            </blockquote>

            <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.88rem", color: "rgba(33,20,26,0.6)", lineHeight: 1.8, marginBottom: "20px" }}>
              {t("home.founder.body1")}
            </p>
            <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.88rem", color: "rgba(33,20,26,0.6)", lineHeight: 1.8, marginBottom: "20px" }}>
              {t("home.founder.body2")}
            </p>
            <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.88rem", color: "rgba(33,20,26,0.6)", lineHeight: 1.8, marginBottom: "28px" }}>
              {t("home.founder.body3")}
            </p>

            <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontStyle: "italic", color: "#21141A", margin: "0 0 28px" }}>
              {t("home.founder.signature")}
            </p>

            <Link
              href="/services"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: "Nunito, sans-serif",
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                lineHeight: 1,
                color: "#FFFEF9",
                background: "#21141A",
                padding: "14px 28px",
                textDecoration: "none",
                borderRadius: "8px",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#703C54";
                e.currentTarget.style.color = "#FFFEF9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#21141A";
                e.currentTarget.style.color = "#FFFEF9";
              }}
            >
              <span style={{ lineHeight: 1 }}>{t("cta.seeWhatWeDo")}</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
                style={{ display: "block", flexShrink: 0 }}
              >
                <path
                  d="M1.5 6h8M6.25 2.75 9.5 6 6.25 9.25"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
function Divider() {
  return <div style={{ padding: "0 10px" }}><div className="gold-line" /></div>;
}

// ─── Founder ──────────────────────────────────────────────────────────────────
function Founder() {
  const t = useT();
  return (
    <section id="about" className="scroll-mt-24" style={{ background: "#21141A", padding: "10px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", right: "-20px", transform: "translateY(-50%)", fontSize: "clamp(60px,15vw,180px)", fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "rgba(140,178,192,0.06)", lineHeight: 1, userSelect: "none", pointerEvents: "none", whiteSpace: "nowrap" }}>{t("catalog.city.batumi").toUpperCase()}</div>

      {/* Big frame card */}
      <div style={{ background: "#FFFEF9", borderRadius: "10px", position: "relative", zIndex: 2, border: "1px solid rgba(140,178,192,0.1)", overflow: "hidden", padding: "80px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(24px, 4vw, 64px)" }}>
      <div className="founder-grid">

        {/* Photo — 30–35% width, padded, aligned top */}
        <div className="reveal" style={{ alignSelf: "flex-start", marginLeft: "0" }}>
          <div style={{ position: "relative" }}>
            <img src="/home/arthur-founder.jpg" alt={t("home.founder.imageAlt")}
              style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", objectPosition: "center top", display: "block" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px", background: "linear-gradient(transparent, rgba(33,20,26,0.92))" }}>
              <p style={{ color: "#FFFEF9", fontFamily: "Nunito, sans-serif", fontSize: "1.3rem", fontWeight: 500, margin: 0 }}>Arthur Arutuniyan</p>
              <p style={{ color: C.light, fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", margin: "4px 0 0", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>{t("home.founder.eyebrow")}</p>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="reveal reveal-delay-2 founder-text-pad">
          {/* Header */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{ width: "28px", height: "1px", background: C.wine }} />
              <span style={{ fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: C.muted, fontFamily: "Nunito, sans-serif" }}>{t("home.founder.aboutEyebrow")}</span>
            </div>
            <h2 style={{ fontFamily: "JUN, Georgia, serif", fontSize: "clamp(1.8rem, 3.2vw, 2.8rem)", fontWeight: 400, color: C.dark, lineHeight: 1.1, marginBottom: "40px" }}>
              {t("home.founder.aboutHeadline")}<br /><em style={{ fontStyle: "italic", color: C.teal }}>{t("home.founder.aboutHeadlineEm")}</em>
            </h2>
            <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.9rem", color: "rgba(33,20,26,0.7)", lineHeight: 1.85, marginBottom: "60px" }}>
              {t("home.founder.aboutBody")}
            </p>
          </div>

          {/* 2×2 service grid */}
          <div className="founder-pillars">
            {[
              { label: t("home.founder.pillar1.title"),  desc: t("home.founder.pillar1.desc") },
              { label: t("home.founder.pillar2.title"),  desc: t("home.founder.pillar2.desc") },
              { label: t("home.founder.pillar3.title"),  desc: t("home.founder.pillar3.desc") },
              { label: t("home.founder.pillar4.title"),  desc: t("home.founder.pillar4.desc") },
            ].map((item) => (
              <div key={item.label} style={{ borderLeft: "2px solid #703C54", paddingLeft: "18px", paddingTop: "4px", paddingBottom: "4px" }}>
                <p style={{ color: C.dark, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Nunito, sans-serif", marginBottom: "8px", fontWeight: 700 }}>{item.label}</p>
                <p style={{ color: "rgba(33,20,26,0.7)", fontSize: "0.84rem", fontFamily: "Nunito, sans-serif", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
      </div>{/* /maxWidth */}
      </div>{/* /frame card */}
    </section>
  );
}

// ─── Analytics ────────────────────────────────────────────────────────────────
function Analytics() {
  const isMobile = useIsMobile();
  const t = useT();
  return (
    <section id="analytics" style={{ background: "#21141A", padding: "10px", overflow: "hidden" }}>
      <div style={{ background: "#FFFEF9", borderRadius: "10px", overflow: "hidden", padding: "clamp(40px,5vw,72px) 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(24px, 4vw, 64px)" }}>
        <div className="reveal" style={{ marginBottom: isMobile ? "20px" : "56px" }}>
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "28px", height: "1px", background: C.wine }} />
              <span style={{ fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: C.muted, fontFamily: "Nunito, sans-serif" }}>{t("home.analytics.eyebrow")}</span>
            </div>
          )}
          <h2 style={{ fontFamily: "JUN, Georgia, serif", fontSize: "clamp(1.8rem,4vw,3.4rem)", fontWeight: 400, color: C.dark, lineHeight: 1.1, marginBottom: isMobile ? "4px" : "8px" }}>
            {isMobile ? (
              <>
                {t("home.analytics.headline")}
                <br />
                <span style={{ whiteSpace: "nowrap" }}>{t("home.analytics.headlineEm")}</span>
              </>
            ) : (
              <>
                {t("home.analytics.headline")}
                <br />
                {t("home.analytics.headlineEm")}
              </>
            )}
          </h2>
          <p style={{ fontSize: "0.82rem", color: C.muted, fontFamily: "Nunito, sans-serif", marginBottom: isMobile ? "12px" : "24px" }}>{t("home.analytics.source")}</p>
        </div>

        {/* Stats */}
        <div className="stats-grid reveal reveal-delay-1">
          {stats.map((s) => (
            <div key={s.value} className="stat-tile"
              onMouseEnter={(e) => (e.currentTarget.style.borderBottomColor = C.teal)}
              onMouseLeave={(e) => (e.currentTarget.style.borderBottomColor = "transparent")}
            >
              <p className="stat-number">{s.value}</p>
              <p style={{ color: C.muted, fontSize: "0.78rem", fontFamily: "Nunito, sans-serif", marginTop: "6px" }}>{t(s.labelKey)}</p>
            </div>
          ))}
        </div>

        {/* Triggers + Chart */}
        <div className="analytics-grid" style={{ marginTop: isMobile ? "20px" : "56px" }}>
          <div className="reveal">
            <h3 style={{ fontFamily: "JUN, Georgia, serif", fontSize: "clamp(1.4rem,2.5vw,2rem)", fontWeight: 400, color: C.dark, marginBottom: "28px", lineHeight: 1.2 }}>
              {t("home.analytics.whyTitle")}<br /><em style={{ fontStyle: "italic", color: C.teal }}>{t("home.analytics.whyTitleEm")}</em>
            </h3>
            {triggers.map((triggerKey) => (
              <div key={triggerKey} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "6px" }}>
                <div style={{ width: "6px", height: "6px", background: "#703C54", flexShrink: 0, marginTop: "6px", borderRadius: "50%" }} />
                <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.88rem", color: C.muted, lineHeight: 1.6, margin: 0 }}>{t(triggerKey)}</p>
              </div>
            ))}
          </div>

          <div className="reveal reveal-delay-2">
            <div style={{ background: "#FFFEF9", padding: "32px", maxWidth: "420px", border: "2px solid #21141A" }}>
              <p style={{ color: "#21141A", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "Nunito, sans-serif", fontWeight: 600, marginBottom: "24px" }}>{t("home.analytics.rentalYieldComparison")}</p>
              {[
                { city: t("home.analytics.city.batumiFirstLine"), pct: 87, label: "8–14.5%" },
                { city: t("home.analytics.city.tbilisi"),   pct: 60, label: "5–8%" },
                { city: t("home.analytics.city.dubai"),     pct: 55, label: "5–7%" },
                { city: t("home.analytics.city.istanbul"),  pct: 50, label: "4–6%" },
                { city: t("home.analytics.city.barcelona"), pct: 40, label: "3–5%" },
              ].map((row, i) => (
                <div key={row.city} style={{ marginBottom: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ color: "#21141A", fontSize: "0.75rem", fontFamily: "Nunito, sans-serif", fontWeight: 500 }}>{row.city}</span>
                    <span style={{ color: i === 0 ? "#21141A" : "#21141A", fontSize: "0.75rem", fontFamily: "Nunito, sans-serif", fontWeight: 500 }}>{row.label}</span>
                  </div>
                  <div style={{ height: "2px", background: "rgba(33,20,26,0.12)" }}>
                    <div style={{ height: "100%", width: `${row.pct}%`, background: i === 0 ? "#21141A" : "rgba(33,20,26,0.25)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

// ─── Portfolio ────────────────────────────────────────────────────────────────
function Portfolio() {
  const isMobile = useIsMobile();
  const t = useT();
  const { language } = useLocale();
  const portfolioProjects = useMemo(
    () => localizeProjects(catalogProjects, language),
    [language],
  );
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showArrow, setShowArrow] = useState(true);

  // Hide arrow after user scrolls
  const handleScroll = () => { if (scrollRef.current && scrollRef.current.scrollLeft > 20) setShowArrow(false); };

  // Scroll to next card on arrow click
  const scrollNext = () => {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = 276; // card width (260) + gap (16) on mobile
    el.scrollBy({ left: cardW, behavior: "smooth" });
    setShowArrow(false);
  };

  return (
    <section id="portfolio" style={{ background: C.darkTeal, padding: "20px 0 20px" }}>
      {/* Big frame card */}
      <div style={{ margin: "0 10px", background: "#FFFEF9", borderRadius: "10px", padding: "50px 20px", position: "relative", zIndex: 2, border: "1px solid rgba(140,178,192,0.1)", overflow: "visible" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto 8px", padding: "0 clamp(24px, 4vw, 64px)" }}>
        <div className="reveal">
          <h2 style={{ fontFamily: "JUN, Georgia, serif", fontSize: "clamp(1.8rem,4vw,3.2rem)", fontWeight: 400, color: C.dark, lineHeight: 1.1 }}>
            {t("home.portfolio.headline")}<br /><em style={{ fontStyle: "italic", color: C.teal }}>{t("home.portfolio.headlineEm")}</em>
          </h2>
        </div>
      </div>

      {/* Scrollable cards — wrapper is relative so arrow can be positioned inside */}
      <div style={{ position: "relative" }}>
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="portfolio-outer"
          style={{ overflowX: "auto", overflowY: "visible", width: "100%", WebkitOverflowScrolling: "touch", marginTop: "30px" }}
        >
          <div
            className="portfolio-scroll"
            style={{
              display: "flex",
              gap: isMobile ? "16px" : "24px",
              // On mobile: left pad = 20px, right pad leaves ~40px so next card peeks
              paddingLeft: isMobile ? "20px" : "30px",
              paddingRight: isMobile ? "40px" : "30px",
              paddingTop: "30px",
              paddingBottom: "30px",
              scrollSnapType: "x mandatory",
              width: "max-content",
              minWidth: "100%",
            }}
          >
            {portfolioProjects.map((p, i) => <ProjectCard key={p.slug} project={p} index={i} isMobile={isMobile} />)}
          </div>
        </div>

        {/* Mobile-only scroll arrow */}
        {isMobile && showArrow && (
          <button
            onClick={scrollNext}
            aria-label={t("home.portfolio.scrollNext")}
            className="portfolio-arrow-hint"
            style={{
              position: "absolute",
              right: "6px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              background: "rgba(255,254,249,0.85)",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 12px rgba(14,55,57,0.15)",
              backdropFilter: "blur(4px)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3l5 5-5 5" stroke="#703C54" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Alabbar quote + Request Access under it */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(24px, 4vw, 64px)" }}>
        <div className="reveal" style={{ padding: isMobile ? "40px 0 8px" : "56px 0 25px", maxWidth: "860px", margin: "0 auto" }}>
          <div style={{ borderLeft: `2px solid ${C.teal}`, paddingLeft: "24px" }}>
            <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "clamp(1.2rem,2.2vw,1.8rem)", fontWeight: 300, fontStyle: "italic", color: "#21141A", lineHeight: 1.5, marginBottom: "16px" }}>
              {t("home.portfolio.quote")}
            </p>
            <p style={{ color: C.teal, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Nunito, sans-serif", margin: 0 }}>
              {t("home.portfolio.quoteAttr")}
            </p>
          </div>

          <a
            href="#contact"
            className="btn-outline-gold"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: isMobile ? "28px" : "32px",
              color: C.dark,
              borderColor: C.dark,
              width: isMobile ? "100%" : "auto",
              boxSizing: "border-box",
            }}
          >
            {t("cta.requestAccess")}
          </a>
        </div>
      </div>
      </div>{/* /frame card */}
    </section>
  );
}


function ProjectCard({ project, index, isMobile }: { project: Project; index: number; isMobile?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const t = useT();
  const cardW = isMobile ? "260px" : "300px";

  const firstSentence = project.desc.match(/^[^.!?]+[.!?]/)?.[0] ?? project.desc;
  const teaser = firstSentence.length > 110
    ? firstSentence.slice(0, 108).trimEnd() + "…"
    : firstSentence;

  return (
    <Link href={`/project/${project.slug}`}>
      <a style={{ textDecoration: "none", display: "block" }}>
        <div className="property-card" style={{ width: cardW, minWidth: cardW, flexShrink: 0, scrollSnapAlign: "start", cursor: "pointer", borderRadius: "10px", overflow: "hidden", position: "relative" }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <img src={project.cardImage || cardImages[index]} alt={project.name}
            style={{ width: "100%", height: "460px", objectFit: "cover", display: "block", transition: "transform 0.6s ease", transform: hovered ? "scale(1.06)" : "scale(1)" }} />

          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 38%, rgba(0,0,0,0.08) 65%, transparent 100%)" }} />

          <div style={{ position: "absolute", top: "14px", right: "14px", background: "#FFFEF9", color: "#21141A", padding: "4px 10px", fontSize: "0.62rem", fontFamily: "Nunito, sans-serif", fontWeight: 700, letterSpacing: "0.06em" }}>
            {project.yield} {t("catalog.roi")}
          </div>

          <div style={{
            position: "absolute", top: "14px", left: "14px",
            background: "rgba(255,254,249,0.12)", backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,254,249,0.2)", borderRadius: "6px",
            padding: "4px 10px", fontSize: "0.58rem", fontFamily: "Nunito, sans-serif",
            color: "#FFFEF9", letterSpacing: "0.08em", textTransform: "uppercase",
            opacity: hovered ? 1 : 0, transition: "opacity 0.3s",
          }}>{t("cta.viewProject")}</div>

          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 18px 24px", minHeight: "140px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <p style={{ color: C.light, fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: "Nunito, sans-serif", marginBottom: "6px" }}>{project.tag}</p>
            <h3 style={{ fontFamily: "JUN, Georgia, serif", fontSize: "1.45rem", fontWeight: 500, color: "#FFFEF9", margin: "0 0 8px" }}>{project.name}</h3>
            <p style={{ color: C.light, fontSize: "0.75rem", fontFamily: "Nunito, sans-serif", lineHeight: 1.55, margin: 0 }}>{teaser}</p>
          </div>
        </div>
      </a>
    </Link>
  );
}

// ─── Lifestyle ────────────────────────────────────────────────────────────────
function Lifestyle() {
  const isMobile = useIsMobile();
  const t = useT();
  return (
    <section style={{ background: "#21141A", padding: isMobile ? "80px 0" : "120px 0", overflow: "hidden" }}>
      <div className="lifestyle-grid" style={{ alignItems: "stretch" }}>
        {/* Left — photo bleeds to left edge */}
        <div className="reveal lifestyle-photo-col">
          <img
            src="/home/lifestyle-botanical.jpg"
            alt={t("home.lifestyle.imageAlt")}
            style={{
              width: "100%",
              height: "100%",
              minHeight: isMobile ? "520px" : "560px",
              objectFit: "cover",
              objectPosition: isMobile ? "center 45%" : "center center",
              display: "block",
            }}
          />
        </div>

        {/* Right — text + calendar, padded */}
        <div
          className="reveal reveal-delay-2 lifestyle-text-col"
          style={{
            padding: "0 clamp(24px,5vw,72px) 0 clamp(32px,4vw,64px)",
            // Mobile: shift whole text block down 30px
            ...(isMobile ? { marginTop: 30 } : {}),
          }}
        >
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "28px", height: "1px", background: "#703C54" }} />
              <span style={{ fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: C.light, fontFamily: "Nunito, sans-serif" }}>{t("home.lifestyle.eyebrow")}</span>
            </div>
          )}
          <h2 style={{ fontFamily: "JUN, Georgia, serif", fontSize: "clamp(1.8rem,3.5vw,3rem)", fontWeight: 400, color: "#FFFEF9", lineHeight: 1.1, marginBottom: "20px" }}>
            {t("home.lifestyle.headline")}<br /><em style={{ fontStyle: "italic", color: C.light }}>{t("home.lifestyle.headlineEm")}</em>
          </h2>
          <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.9rem", color: C.light, lineHeight: 1.8, marginBottom: isMobile ? "52px" : "32px" }}>
            {t("home.lifestyle.body")}
          </p>
          <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: C.light, marginBottom: "20px" }}>{t("home.lifestyle.calendar")}</p>
          {bloomCalendar.map((item, i) => (
            <div key={item.monthKey} style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "16px", alignItems: "center", padding: "11px 0", borderBottom: i < bloomCalendar.length - 1 ? "1px solid rgba(255,254,249,0.08)" : "none" }}>
              <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.95rem", fontWeight: 600, color: C.light }}>{t(item.monthKey)}</span>
              <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.82rem", color: C.light }}>{t(item.flowersKey)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Turn Key ─────────────────────────────────────────────────────────────────
// ─── Discovery Tour ───────────────────────────────────────────────────────────
function DiscoveryTour() {
  const isMobile = useIsMobile();
  const t = useT();
  const [visible, setVisible] = React.useState(false);
  const [countUp, setCountUp] = React.useState(0);
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!visible) return;
    let start = 0;
    const end = 2000;
    const step = Math.ceil(end / (1800 / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCountUp(end); clearInterval(timer); }
      else setCountUp(start);
    }, 16);
    return () => clearInterval(timer);
  }, [visible]);

  const inclusions = [
    { label: t("home.discovery.vip.title"),
      desc: t("home.discovery.vip.desc"),
      svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#703C54" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>,
    },
    { label: t("home.discovery.stay.title"),
      desc: t("home.discovery.stay.desc"),
      svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#703C54" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    },
    { label: t("home.discovery.viewings.title"),
      desc: t("home.discovery.viewings.desc"),
      svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#703C54" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    },
    { label: t("home.discovery.gastro.title"),
      desc: t("home.discovery.gastro.desc"),
      svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#703C54" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
    },
    { label: t("home.discovery.briefing.title"),
      desc: t("home.discovery.briefing.desc"),
      svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#703C54" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    },
    { label: t("home.discovery.legal.title"),
      desc: t("home.discovery.legal.desc"),
      svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#703C54" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    },
  ];

  return (
    <section ref={ref} id="discovery-tour" style={{
      background: "#21141A", minHeight: isMobile ? "auto" : "100vh",
      display: "flex", alignItems: "center",
      padding: "10px", position: "relative", overflow: "hidden",
    }}>





      <div style={{ width: "100%", position: "relative", zIndex: 1, background: "#FFFEF9", borderRadius: "10px", paddingTop: isMobile ? "40px" : "clamp(60px,7vw,100px)", paddingBottom: isMobile ? "40px" : "clamp(60px,7vw,100px)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(24px, 4vw, 64px)" }}>

          {/* HEADER: centered */}
          <div style={{
            textAlign: "center", marginBottom: isMobile ? "24px" : "clamp(48px,5vw,72px)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.9s ease, transform 0.9s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "24px" }}>
              <div style={{ width: "28px", height: "1px", background: C.wine }} />
              <span style={{ fontSize: "0.6rem", letterSpacing: "0.24em", textTransform: "uppercase", color: C.muted, fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>{t("home.discovery.eyebrow")}</span>
              <div style={{ width: "28px", height: "1px", background: C.wine }} />
            </div>
            <h2 style={{ fontFamily: "JUN, Georgia, serif", fontSize: "clamp(2.6rem, 5.5vw, 4.4rem)", fontWeight: 400, color: C.dark, lineHeight: 1.05, margin: "0", letterSpacing: "-0.02em", display: "inline" }}>
              {t("home.discovery.headline")}{" "}
            </h2>
            <h2 style={{ fontFamily: "JUN, Georgia, serif", fontSize: "clamp(2.6rem, 5.5vw, 4.4rem)", fontWeight: 400, fontStyle: "italic", color: "#703C54", lineHeight: 1.05, margin: "0", letterSpacing: "-0.02em", display: "inline" }}>
              {t("home.discovery.headlineEm")}
            </h2>
            <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.2rem", color: C.muted, lineHeight: 1.7, margin: "20px 0 0", fontStyle: "italic" }}>
              {t("home.discovery.subheadline")}
            </p>
          </div>

          {/* 3x2 Services Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr",
            gap: isMobile ? "8px" : "52px 56px",
            marginBottom: isMobile ? "24px" : "clamp(48px,5vw,72px)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.9s ease 0.15s, transform 0.9s ease 0.15s",
          }}>
            {inclusions.map((item, i) => (
              <div key={item.label} style={{
                textAlign: "left",
                padding: isMobile ? "16px 14px" : "28px 24px",
                background: isMobile ? "#FFFEF9" : "rgba(140,178,192,0.05)",
                border: isMobile ? "none" : "1px solid rgba(140,178,192,0.1)",
                borderRadius: isMobile ? "10px" : "10px",
                boxShadow: isMobile ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.7s ease, transform 0.7s ease, box-shadow 0.3s ease, border-color 0.3s ease",
                transitionDelay: `${0.2 + i * 0.07}s`,
                cursor: "default",
              }}
              onMouseEnter={isMobile ? undefined : e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(140,178,192,0.1)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(140,178,192,0.1)"; }}
              onMouseLeave={isMobile ? undefined : e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(140,178,192,0.1)"; }}
              >
                <div style={{ marginBottom: isMobile ? "10px" : "20px" }}>
                  {isMobile ? (
                    React.cloneElement(item.svg, {
                      width: 24,
                      height: 24,
                      stroke: "#703C54",
                      strokeWidth: 1,
                    })
                  ) : (
                    <div style={{ width: "52px", height: "52px", borderRadius: "10px", background: "rgba(140,178,192,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {React.cloneElement(item.svg, { width: 28, height: 28 })}
                    </div>
                  )}
                </div>
                <p style={{
                  fontFamily: "Nunito, sans-serif",
                  fontSize: isMobile ? "0.7rem" : "0.82rem",
                  fontWeight: isMobile ? 600 : 700,
                  color: isMobile ? "#21141A" : C.dark,
                  margin: isMobile ? "0 0 4px" : "0 0 8px",
                  letterSpacing: isMobile ? "0.12em" : "0.04em",
                  textTransform: "uppercase",
                }}>{item.label}</p>
                <p style={{
                  fontFamily: "Nunito, sans-serif",
                  fontSize: isMobile ? "0.72rem" : "0.8rem",
                  color: isMobile ? "rgba(33,20,26,0.55)" : C.muted,
                  margin: 0,
                  lineHeight: isMobile ? 1.5 : 1.7,
                }}>{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Trust & Booking bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "20px",
            background: "rgba(140,178,192,0.08)",
            border: "1px solid rgba(140,178,192,0.1)",
            borderRadius: "10px", padding: "24px 32px",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.9s ease 0.4s",
          }}>
            <div>
              <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.6rem", fontWeight: 700, color: C.dark, marginRight: "10px" }}>
                $2,000
              </span>
              <span style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted }}>{t("home.discovery.deposit")}</span>
              <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.78rem", color: C.muted, margin: "6px 0 0", lineHeight: 1.5 }}>
                {t("home.discovery.depositBody")}
              </p>
            </div>
            <a href="#contact" style={{
              display: "inline-block", padding: "14px 32px", flexShrink: 0,
              background: "#703C54", borderRadius: "6px", textDecoration: "none",
              fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", fontWeight: 700,
              color: "#FFFEF9", letterSpacing: "0.1em", textTransform: "uppercase",
              transition: "opacity 0.2s, transform 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {t("home.discovery.cta")}
            </a>
          </div>

        </div>{/* /maxWidth container */}

        {/* ── Auto-scrolling photo gallery ── */}
        <div style={{ position: "relative", overflow: "hidden", marginTop: isMobile ? "24px" : "clamp(48px,5vw,80px)" }}>
          <style>{`
            @keyframes gallery-scroll {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }
            .gallery-track {
              display: flex;
              gap: 8px;
              width: max-content;
              animation: gallery-scroll 30s linear infinite;
            }
          `}</style>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "120px", background: "linear-gradient(to right, #FFFEF9, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "120px", background: "linear-gradient(to left, #FFFEF9, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div className="gallery-track">
            {[
              "/home/turnkey-new.png",
              "/home/turnkey-web.png",
              "/home/lifestyle-coast.png",
              "/home/interior-bedroom.png",
              "/home/hero2.png",
              "/home/card1.png",
              "/home/card2.png",
              "/home/turnkey-new.png",
              "/home/turnkey-web.png",
              "/home/lifestyle-coast.png",
              "/home/interior-bedroom.png",
              "/home/hero2.png",
              "/home/card1.png",
              "/home/card2.png",
            ].map((src, i) => (
              <div key={i} style={{ width: "280px", height: "280px", flexShrink: 0, overflow: "hidden", borderRadius: "10px" }}>
                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                />
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}

// ─── Payment ──────────────────────────────────────────────────────────────────
const PAYMENT_ICON = {
  stroke: "#703C54",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Payment() {
  const t = useT();
  const cards = [
    {
      icon: (
        // Bank building
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" {...PAYMENT_ICON}>
          <path d="M3 10.5 12 4l9 6.5" />
          <path d="M5 10.5v7.5M9.5 10.5v7.5M14.5 10.5v7.5M19 10.5v7.5" />
          <path d="M3.5 18h17" />
          <path d="M2.5 21h19" />
        </svg>
      ),
      title: t("home.payment.bank.title"),
      body: t("home.payment.bank.body"),
      sub: t("home.payment.bank.sub"),
    },
    {
      icon: (
        // USDT / Tether mark
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" {...PAYMENT_ICON}>
          <circle cx="12" cy="12" r="9.25" />
          <path d="M8.25 9h7.5" />
          <path d="M12 9v7" />
          <path d="M9.5 13.25h5" />
        </svg>
      ),
      title: t("home.payment.crypto.title"),
      body: t("home.payment.crypto.body"),
      sub: t("home.payment.crypto.sub"),
    },
  ];

  const features = [
    {
      icon: (
        <span
          style={{
            fontFamily: "Nunito, sans-serif",
            fontSize: "0.95rem",
            fontWeight: 700,
            color: C.light,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          0%
        </span>
      ),
      title: t("home.payment.installment.title"),
      desc: t("home.payment.installment.desc"),
    },
    {
      icon: (
        // Right arrow over left arrow
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...PAYMENT_ICON}>
          <path d="M5 8h12" />
          <path d="M13.5 4.5 17 8l-3.5 3.5" />
          <path d="M19 16H7" />
          <path d="M10.5 12.5 7 16l3.5 3.5" />
        </svg>
      ),
      title: t("home.payment.remote.title"),
      desc: t("home.payment.remote.desc"),
    },
    {
      icon: (
        <span
          style={{
            fontFamily: "Nunito, sans-serif",
            fontSize: "0.62rem",
            fontWeight: 700,
            color: C.light,
            letterSpacing: "0.14em",
            lineHeight: 1,
          }}
        >
          SWIFT
        </span>
      ),
      title: t("home.payment.swift.title"),
      desc: t("home.payment.swift.desc"),
    },
  ];

  return (
    <section id="payment" style={{ background: "#21141A", padding: "clamp(60px,8vw,220px) 10px clamp(50px,6vw,200px)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(24px, 4vw, 64px)" }}>
        {/* Header */}
        <div className="reveal" style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ width: "28px", height: "1px", background: "#703C54" }} />
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: C.light, fontFamily: "Nunito, sans-serif" }}>{t("home.payment.eyebrow")}</span>
          </div>
          <h2 style={{ fontFamily: "JUN, Georgia, serif", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 400, color: "#FFFEF9", lineHeight: 1.1 }}>
            {t("home.payment.headline")}<br /><em style={{ fontStyle: "italic", color: C.light }}>{t("home.payment.headlineEm")}</em>
          </h2>
        </div>

        {/* Two cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "48px" }}>
          {cards.map((card) => (
            <div key={card.title} className="reveal"
              style={{ background: "#FFFEF9", borderRadius: "10px", padding: "56px 32px", border: "1px solid rgba(140,178,192,0.1)", transition: "transform 0.3s, box-shadow 0.3s", cursor: "default" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.3)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
            >
              <div style={{ width: "52px", height: "52px", background: "rgba(140,178,192,0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "28px" }}>
                {card.icon}
              </div>
              <h3 style={{ fontFamily: "JUN, Georgia, serif", fontSize: "1.6rem", fontWeight: 500, color: "#21141A", marginBottom: "16px", lineHeight: 1.2 }}>{card.title}</h3>
              <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.88rem", color: "rgba(33,20,26,0.7)", lineHeight: 1.8, marginBottom: "20px" }}>{card.body}</p>
              <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.78rem", color: "#703C54", lineHeight: 1.6, borderTop: "1px solid rgba(140,178,192,0.1)", paddingTop: "16px" }}>{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Three features — in boxes */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", borderTop: "1px solid rgba(140,178,192,0.1)", paddingTop: "40px" }}>
          {features.map((f) => (
            <div key={f.title} className="reveal" style={{ display: "flex", flexDirection: "column", gap: "18px", padding: "28px 24px", background: "rgba(255,254,249,0.07)", borderRadius: "10px", border: "1px solid rgba(255,254,249,0.1)", textAlign: "center", alignItems: "center" }}>
              <div style={{ width: "48px", height: "48px", background: "rgba(140,178,192,0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <p style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "#FFFEF9", marginBottom: "8px" }}>{f.title}</p>
                <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.8rem", color: C.light, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Calculator ───────────────────────────────────────────────────────────────
function Calculator() {
  const isMobile = useIsMobile();
  const t = useT();
  // Top-level mode: installment vs mortgage
  const [mode, setMode] = React.useState<"installment" | "mortgage">("installment");

  // ── Installment state ──
  const [instPrice, setInstPrice] = React.useState(80000);
  const [instDown, setInstDown] = React.useState(30);
  const [instMonths, setInstMonths] = React.useState(36);

  // ── Mortgage sub-tab ──
  const [mortTab, setMortTab] = React.useState<"amount" | "income">("amount");
  const [mortCurrency, setMortCurrency] = React.useState<"USD" | "EUR" | "GEL">("USD");

  // By Amount
  const [mortAmount, setMortAmount] = React.useState(50000);
  const [mortYears, setMortYears] = React.useState(10);

  // By Income
  const [mortIncome, setMortIncome] = React.useState(3000);
  const [mortIncomeYears, setMortIncomeYears] = React.useState(10);


  // Rates (TBC Bank reference)
  const NIR = 12.1; // %
  const EIR = 14.21; // %

  // ── Calculations ──
  const instLoan = instPrice * (1 - instDown / 100);
  const instMonthly = instLoan / instMonths;

  function annuity(principal: number, annualRate: number, years: number) {
    const r = annualRate / 100 / 12;
    const n = years * 12;
    if (r === 0) return principal / n;
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  const mortMonthly = annuity(mortAmount, NIR, mortYears);
  // By Income: max loan where monthly = 50% of income
  const maxMonthlyPayment = mortIncome * 0.5;
  const r = NIR / 100 / 12;
  const n = mortIncomeYears * 12;
  const maxLoan = maxMonthlyPayment * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));


  const currencySymbol = mortCurrency === "GEL" ? "₾" : mortCurrency === "EUR" ? "€" : "$";
  const fmt = (n: number, cur = "$") => cur + Math.round(n).toLocaleString("en-US");
  const fmtInst = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(33,20,26,0.06)", border: "1px solid rgba(33,20,26,0.2)", padding: "10px 14px", color: "#21141A", fontFamily: "Nunito, sans-serif",
    fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase",
    color: "rgba(33,20,26,0.7)", fontFamily: "Nunito, sans-serif", marginBottom: "6px",
  };
  const statRow = (label: string, value: string, label2?: string, value2?: string) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", padding: "12px 0", borderBottom: "1px solid rgba(33,20,26,0.1)" }}>
      <div>
        <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.6rem", color: "rgba(33,20,26,0.5)", margin: "0 0 4px", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</p>
        <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.05rem", color: "#21141A", margin: 0, fontWeight: 600 }}>{value}</p>
      </div>
      {label2 && (
        <div>
          <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.6rem", color: "rgba(33,20,26,0.5)", margin: "0 0 4px", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label2}</p>
          <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.05rem", color: "#21141A", margin: 0, fontWeight: 600 }}>{value2}</p>
        </div>
      )}
    </div>
  );

  return (
    <section id="calculator" className="scroll-mt-24" style={{ background: "#21141A", padding: "clamp(60px,8vw,120px) 10px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(24px, 4vw, 64px)" }}>

        {/* Header */}
        <div className="reveal" style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ width: "28px", height: "1px", background: "#703C54" }} />
            <span style={{ fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: C.light, fontFamily: "Nunito, sans-serif" }}>{t("home.calculator.eyebrow")}</span>
          </div>
          <h2 style={{ fontFamily: "JUN, Georgia, serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 400, color: "#FFFEF9", margin: 0, lineHeight: 1.1 }}>
            {t("home.calculator.headline")}<br /><em style={{ fontStyle: "italic", color: C.light }}>{t("home.calculator.headlineEm")}</em>
          </h2>
        </div>

        {/* Mode toggle */}
        <div style={{ display: isMobile ? "flex" : "inline-flex", width: isMobile ? "100%" : "auto", background: "rgba(255,254,249,0.07)", borderRadius: "10px", padding: "4px", marginBottom: "32px", border: "1px solid rgba(255,254,249,0.1)" }}>
          {(["installment", "mortgage"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: isMobile ? 1 : undefined,
              padding: "9px 22px", borderRadius: "7px", border: "none", cursor: "pointer",
              fontFamily: "Nunito, sans-serif", fontSize: isMobile ? "0.68rem" : "0.78rem", letterSpacing: "0.04em", fontWeight: 600,
              transition: "all 0.2s",
              background: mode === m ? "#703C54" : "transparent",
              color: mode === m ? "#FFFEF9" : C.light,
            }}>
              {m === "installment" ? t("home.calculator.installmentTab") : t("home.calculator.mortgageTab")}
            </button>
          ))}
        </div>

        {/* Main layout */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 360px", gap: "32px", alignItems: "start" }}>

          {/* ── LEFT: Inputs ── */}
          <div style={{ background: "#FFFEF9", borderRadius: "10px", padding: "36px", border: "1px solid rgba(33,20,26,0.12)" }}>

            {mode === "installment" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div>
                  <label style={labelStyle}>{t("home.calculator.propertyPrice")}</label>
                  <input type="number" value={instPrice || ""} onChange={e => setInstPrice(e.target.value === "" ? 0 : +e.target.value)} onFocus={e => e.target.select()} style={inputStyle} min={10000} step={5000} />
                </div>
                <div>
                  <label style={labelStyle}>{t("home.calculator.downPayment")} — {instDown}%&nbsp;&nbsp;<span style={{ color: "#703C54" }}>{fmtInst(instPrice * instDown / 100)}</span></label>
                  <input type="range" min={10} max={70} value={instDown} onChange={e => setInstDown(+e.target.value)}
                    style={{ width: "100%", accentColor: "#703C54", cursor: "pointer" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.62rem", color: "rgba(33,20,26,0.4)", fontFamily: "Nunito, sans-serif", marginTop: "4px" }}>
                    <span>10%</span><span>70%</span>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>{t("home.calculator.durationMonths", { months: instMonths })}</label>
                  <input type="range" min={24} max={48} step={6} value={instMonths} onChange={e => setInstMonths(+e.target.value)}
                    style={{ width: "100%", accentColor: "#703C54", cursor: "pointer" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.62rem", color: "rgba(33,20,26,0.4)", fontFamily: "Nunito, sans-serif", marginTop: "4px" }}>
                    <span>24</span><span>48</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {/* Mortgage sub-tabs */}
                <div style={{ display: "flex", gap: "4px", marginBottom: "28px", background: "rgba(33,20,26,0.06)", padding: "4px" }}>
                  {(["amount", "income"] as const).map((tab) => (
                    <button key={tab} onClick={() => setMortTab(tab)} style={{
                      flex: 1, padding: "8px 4px", border: "none", cursor: "pointer",
                      fontFamily: "Nunito, sans-serif", fontSize: "0.7rem", fontWeight: 600, transition: "all 0.2s",
                      background: mortTab === tab ? "#21141A" : "transparent",
                      color: mortTab === tab ? "#FFFEF9" : "rgba(33,20,26,0.5)",
                    }}>
                      {tab === "amount" ? t("home.calculator.byAmount") : t("home.calculator.byIncome")}
                    </button>
                  ))}
                </div>


                {/* By Amount */}
                {mortTab === "amount" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div>
                      <label style={labelStyle}>{t("home.calculator.loanAmount", { currency: mortCurrency })}</label>
                      <input type="number" value={mortAmount || ""} onChange={e => setMortAmount(e.target.value === "" ? 0 : +e.target.value)} onFocus={e => e.target.select()} style={inputStyle} min={3000} step={5000} />
                    </div>
                    <div>
                      <label style={labelStyle}>{t("home.calculator.periodYears", { years: mortYears })}</label>
                      <input type="range" min={1} max={20} value={mortYears} onChange={e => setMortYears(+e.target.value)}
                        style={{ width: "100%", accentColor: "#703C54", cursor: "pointer" }} />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.62rem", color: "rgba(33,20,26,0.4)", fontFamily: "Nunito, sans-serif", marginTop: "4px" }}>
                        {[1,5,9,13,17,20].map(v => <span key={v}>{v}</span>)}
                      </div>
                    </div>
                  </div>
                )}

                {/* By Income */}
                {mortTab === "income" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div>
                      <label style={labelStyle}>{t("home.calculator.monthlyIncome", { currency: mortCurrency })}</label>
                      <input type="number" value={mortIncome || ""} onChange={e => setMortIncome(e.target.value === "" ? 0 : +e.target.value)} onFocus={e => e.target.select()} style={inputStyle} min={500} step={500} />
                    </div>
                    <div>
                      <label style={labelStyle}>{t("home.calculator.periodYears", { years: mortIncomeYears })}</label>
                      <input type="range" min={1} max={20} value={mortIncomeYears} onChange={e => setMortIncomeYears(+e.target.value)}
                        style={{ width: "100%", accentColor: "#703C54", cursor: "pointer" }} />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.62rem", color: "rgba(33,20,26,0.4)", fontFamily: "Nunito, sans-serif", marginTop: "4px" }}>
                        {[1,5,9,13,17,20].map(v => <span key={v}>{v}</span>)}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* ── RIGHT: Results ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Result card */}
            <div style={{ background: "#FFFEF9", borderRadius: "10px", border: "1px solid rgba(33,20,26,0.15)", padding: "28px" }}>

              {mode === "installment" ? (
                <>
                  <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(33,20,26,0.7)", margin: "0 0 10px" }}>{t("home.calculator.monthlyPayment")}</p>
                  <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "2.6rem", fontWeight: 600, color: "#703C54", margin: "0 0 4px", lineHeight: 1 }}>
                    {fmtInst(instMonthly)}
                  </p>
                  <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.7rem", color: "rgba(33,20,26,0.5)", margin: "0 0 16px" }}>{t("home.calculator.interestFreeNote", { months: instMonths })}</p>
                  {statRow(t("home.calculator.loanAmount", { currency: "USD" }), fmtInst(instLoan), t("home.calculator.downPayment"), fmtInst(instPrice * instDown / 100))}
                  {statRow(t("home.calculator.totalPrice"), fmtInst(instPrice), t("home.calculator.duration"), t("home.calculator.durationMonths", { months: instMonths }))}
                </>
              ) : mortTab === "amount" ? (
                <>
                  <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(33,20,26,0.7)", margin: "0 0 10px" }}>{t("home.calculator.monthlyContribution")}</p>
                  <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "2.6rem", fontWeight: 600, color: "#703C54", margin: "0 0 4px", lineHeight: 1 }}>
                    {fmt(mortMonthly, currencySymbol)}
                  </p>
                  <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.7rem", color: "rgba(33,20,26,0.5)", margin: "0 0 16px" }}>{t("home.calculator.annuityPayment")}</p>
                  {statRow(t("home.calculator.amount"), fmt(mortAmount, currencySymbol), t("home.calculator.period"), t("home.calculator.periodYears", { years: mortYears }))}
                  {statRow(t("home.calculator.interestRateNir"), NIR + "%", t("home.calculator.effectiveRateEir"), EIR + "%")}
                </>
              ) : (
                <>
                  <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(33,20,26,0.7)", margin: "0 0 10px" }}>{t("home.calculator.maxLoanAmount")}</p>
                  <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "2.6rem", fontWeight: 600, color: "#703C54", margin: "0 0 4px", lineHeight: 1 }}>
                    {fmt(maxLoan, currencySymbol)}
                  </p>
                  <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.7rem", color: "rgba(33,20,26,0.5)", margin: "0 0 16px" }}>{t("home.calculator.basedOnIncome")}</p>
                  {statRow(t("home.calculator.monthlyContribution"), fmt(maxMonthlyPayment, currencySymbol), t("home.calculator.period"), t("home.calculator.periodYears", { years: mortIncomeYears }))}
                  {statRow(t("home.calculator.interestRateNir"), NIR + "%", t("home.calculator.effectiveRateEir"), EIR + "%")}
                </>
              )}

            </div>

            {/* ROI Preview */}
            <div style={{ background: "#FFFEF9", borderRadius: "10px", border: "1px solid rgba(33,20,26,0.15)", padding: "20px" }}>
              <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(33,20,26,0.5)", margin: "0 0 6px" }}>{t("home.calculator.roiPreview")}</p>
              <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.8rem", fontWeight: 600, color: "#703C54", margin: "0 0 4px" }}>9–14%</p>
              <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.7rem", color: "rgba(33,20,26,0.5)", margin: 0, lineHeight: 1.6 }}>
                {t("home.calculator.roiPreviewBody")}
              </p>
            </div>

            {/* CTA */}
            <a href="#contact" style={{
              display: "block", textAlign: "center", padding: "14px 20px",
              background: "#703C54", borderRadius: "10px", textDecoration: "none",
              fontFamily: "Nunito, sans-serif", fontSize: "0.78rem", fontWeight: 700,
              color: "#FFFEF9", letterSpacing: "0.04em", transition: "opacity 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              {t("home.calculator.cta")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  const t = useT();
  const [form, setForm] = useState({ name: "", contact: "", budget: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.contact.trim()) { setError(t("home.contact.errorRequired")); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: "Homepage Contact",
          page: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });
      if (res.ok) {
        trackLead({ source: "Homepage Contact" });
        setSubmitted(true);
      } else setError(t("home.contact.errorGeneric"));
    } catch { setError(t("home.contact.errorNetwork")); }
    finally { setLoading(false); }
  };

  const contactLabelStyle: React.CSSProperties = {
    display: "block",
    color: C.light,
    fontSize: "0.65rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontFamily: "Nunito, sans-serif",
    marginBottom: "6px",
  };
  const contactInputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    background: "rgba(255,254,249,0.08)",
    border: "1px solid rgba(255,254,249,0.15)",
    color: "#FFFEF9",
    fontFamily: "Nunito, sans-serif",
    fontSize: "0.9rem",
    padding: "12px 14px",
    outline: "none",
    borderRadius: "0",
  };

  return (
    <section id="contact" className="scroll-mt-24 border-t border-[rgba(140,178,192,0.1)] bg-[#21141A] py-[clamp(64px,8vw,120px)]">
      <style>{`
        #contact .contact-input::placeholder { color: #FFFEF9; }
        #contact select.contact-input option { background: #21141A; color: #FFFEF9; }
      `}</style>
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
      <div className="mx-auto max-w-[680px]">
        <div className="reveal" style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ width: "28px", height: "1px", background: "rgba(255,254,249,0.3)" }} />
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: C.light, fontFamily: "Nunito, sans-serif" }}>{t("home.contact.eyebrow")}</span>
            <div style={{ width: "28px", height: "1px", background: "rgba(255,254,249,0.3)" }} />
          </div>
          <h2 style={{ fontFamily: "JUN, Georgia, serif", fontSize: "clamp(1.8rem,4vw,3.4rem)", fontWeight: 400, color: "#FFFEF9", lineHeight: 1.1, marginBottom: "16px" }}>
            {t("home.contact.headline")}<br /><em style={{ fontStyle: "italic", color: C.light }}>{t("home.contact.headlineEm")}</em>
          </h2>
          <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.9rem", color: C.light, lineHeight: 1.7 }}>
            {t("home.contact.body")}
          </p>
        </div>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ width: "64px", height: "64px", border: `1px solid ${C.teal}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <span style={{ color: C.light, fontSize: "1.4rem" }}>✓</span>
            </div>
            <h3 style={{ fontFamily: "JUN, Georgia, serif", fontSize: "1.8rem", color: "#FFFEF9", marginBottom: "12px" }}>{t("home.contact.sentTitle")}</h3>
            <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.88rem", color: C.light, lineHeight: 1.7 }}>
              {t("home.contact.sentBody")}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="reveal reveal-delay-1" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div className="form-row">
              <div>
                <label style={contactLabelStyle}>{t("home.contact.nameRequired")}</label>
                <input className="contact-input" type="text" placeholder={t("home.contact.namePlaceholder")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={contactInputStyle} />
              </div>
              <div>
                <label style={contactLabelStyle}>{t("home.contact.phoneRequired")}</label>
                <input className="contact-input" type="text" placeholder={t("home.contact.phonePlaceholder")} value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} required style={contactInputStyle} />
              </div>
            </div>
            <div>
              <label style={contactLabelStyle}>{t("home.contact.budget")}</label>
              <select className="contact-input" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} style={{ ...contactInputStyle, cursor: "pointer" }}>
                <option value="">{t("home.contact.budgetPlaceholder")}</option>
                <option value="50-100k">{t("home.contact.budget.50_100")}</option>
                <option value="100-200k">{t("home.contact.budget.100_200")}</option>
                <option value="200-500k">{t("home.contact.budget.200_500")}</option>
                <option value="500k+">{t("home.contact.budget.500plus")}</option>
              </select>
            </div>
            {error && <p style={{ color: C.light, fontSize: "0.8rem", fontFamily: "Nunito, sans-serif" }}>{error}</p>}
            <button type="submit" className="btn-gold" disabled={loading}
              style={{ marginTop: "6px", width: "100%", padding: "16px", fontSize: "0.78rem", opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer", color: "#FFFEF9", background: "#703C54" }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.opacity = "0.9"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = loading ? "0.7" : "1"; }}>
              {loading ? t("home.contact.loading") : t("home.contact.submit")}
            </button>
            <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", color: C.light, textAlign: "center" }}>
              {t("home.contact.disclaimer")}
            </p>
          </form>
        )}
      </div>
      </div>
    </section>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
function Index() {
  useReveal();
  return (
    <div className="home-page">
      <Hero />
      <FounderNote />
      <Analytics />
      <Lifestyle />
      <Portfolio />
      <DiscoveryTour />
      <Payment />
      <Reviews />
      <Partners />
      <Contact />
      <SocialProofToast />
    </div>
  );
}

// ─── Social Proof Toast ───────────────────────────────────────────────────────
type SocialProofMsg =
  | { kind: "activity"; key: "home.socialProof.peopleViewing" | "home.socialProof.investorsBrowsing"; count: number }
  | { kind: "consultation"; at: Date };

function formatTimeAgo(date: Date, t: ReturnType<typeof useT>, refMs = Date.now()): string {
  const diff = refMs - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return t("home.socialProof.justNow");
  if (minutes < 60) return t("home.socialProof.minAgo", { count: minutes });
  if (hours < 24) return t(hours === 1 ? "home.socialProof.hourAgo" : "home.socialProof.hoursAgo", { count: hours });
  if (days < 7) return t(days === 1 ? "home.socialProof.dayAgo" : "home.socialProof.daysAgo", { count: days });
  return t("home.socialProof.thisWeek");
}

function randomConsultationAt(): Date {
  const minutesAgo = Math.floor(Math.random() * 180) + 5;
  return new Date(Date.now() - minutesAgo * 60000);
}

function SocialProofPulse() {
  return (
    <div style={{ position: "relative", width: 8, height: 8, flexShrink: 0 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "#703C54",
          animation: "sitboPulse 2s ease-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "#703C54",
        }}
      />
    </div>
  );
}

function SocialProofToast() {
  const t = useT();
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [msg, setMsg] = useState<SocialProofMsg>({
    kind: "activity",
    key: "home.socialProof.peopleViewing",
    count: 0,
  });
  const [now, setNow] = useState(() => new Date());
  const [isNarrow, setIsNarrow] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 640 : false
  );

  const viewers = () => Math.floor(Math.random() * 10) + 3;

  const toasts: (() => SocialProofMsg)[] = [
    () => ({ kind: "activity", key: "home.socialProof.peopleViewing", count: viewers() }),
    () => ({ kind: "activity", key: "home.socialProof.investorsBrowsing", count: viewers() }),
    () => ({ kind: "consultation", at: randomConsultationAt() }),
  ];

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth <= 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const show = () => {
      const t = toasts[Math.floor(Math.random() * toasts.length)]();
      setMsg(t);
      setLeaving(false);
      setVisible(true);

      timeout = setTimeout(() => {
        setLeaving(true);
        setTimeout(() => {
          setVisible(false);
          timeout = setTimeout(show, 6000 + Math.random() * 6000);
        }, 400);
      }, 4000);
    };

    timeout = setTimeout(show, 5000);
    return () => clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  const timeAgo = msg.kind === "consultation" ? formatTimeAgo(msg.at, t, now.getTime()) : null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: isNarrow ? 12 : 24,
        left: isNarrow ? 12 : 24,
        right: isNarrow ? 12 : undefined,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: isNarrow ? "10px 14px" : "12px 18px 12px 16px",
        background: "rgba(33, 20, 26, 0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(140,178,192,0.1)",
        borderRadius: 999,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.24)",
        fontFamily: "Nunito, sans-serif",
        fontSize: isNarrow ? 11 : 12,
        fontWeight: 400,
        letterSpacing: "0.04em",
        color: "#FFFEF9",
        cursor: "default",
        maxWidth: isNarrow ? "calc(100vw - 32px)" : 320,
        opacity: leaving ? 0 : 1,
        transform: leaving ? "translateY(8px)" : "translateY(0)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
        animation: leaving ? "none" : "sitboBadgeFadeIn 0.6s ease-out 1.2s both",
      }}
    >
      <SocialProofPulse />
      {msg.kind === "consultation" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 2, lineHeight: 1.3 }}>
          <span
            style={{
              fontSize: isNarrow ? 11 : 12,
              fontWeight: 500,
              color: "#FFFEF9",
              letterSpacing: "0.02em",
            }}
          >
            {t("home.socialProof.lastConsultation")}
          </span>
          <span
            style={{
              fontSize: isNarrow ? 9 : 10,
              fontWeight: 400,
              color: "#FFFEF9",
              opacity: 0.55,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {timeAgo}
          </span>
        </div>
      ) : (
        <span
          style={{
            fontSize: isNarrow ? 11 : 12,
            fontWeight: 500,
            color: "#FFFEF9",
            letterSpacing: "0.02em",
            lineHeight: 1.3,
          }}
        >
          {t(msg.key, { count: msg.count })}
        </span>
      )}
    </div>
  );
}



export default Index;
