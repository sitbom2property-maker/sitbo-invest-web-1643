import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Reviews } from "../components/reviews";
import { Partners } from "../components/partners";
import { Footer } from "../components/footer";

// ─── Palette ──────────────────────────────────────────────────────────────────
// #21141A  → primary dark (dark bg, main headers, serif text)
// #8CB2C0  → main accent (buttons, CTAs, highlights, icons)
// #683D47  → secondary accent (decorative diamonds, dividers)
// #FFFBF0  → background light (warm off-white)
const C = {
  light:     "#FFFBF0",
  parchment: "#FFFBF0",
  teal:      "#8CB2C0",
  teal2:     "#8CB2C0",
  wine:      "#683D47",
  dark:      "#21141A",
  darkTeal:  "#21141A",
  muted:     "#7a7a7a",
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
const projects = [
  {
    name: "Artex Parkline", tag: "New Boulevard · Park Front",
    address: "New Boulevard St, 12", seaDistance: "12 minutes to the sea", seaMeters: "950 m",
    location: "New Boulevard, Batumi City Centre · Park frontage",
    desc: "Contemporary high-rise facing the new park avenue. Architecturally optimized layouts deliver strong rental yields driven by high demand from digital nomads and short-term tourists.",
    yield: "9–11%",
    developer: "Placeholder Developer",
    priceFrom: "From $75,000",
    completion: "Q2 2026",
    area: "32–85 m²",
    ceilingHeight: "2.9 m",
    floors: "22 floors",
    buildings: "1 building",
    finishing: "White frame, Turnkey",
    installment: "30% down / 70% quarterly",
    features: ["Park-front location", "High rental demand", "Concierge & reception", "Rooftop terrace", "Boulevard views"],
    materials: "Contemporary monolithic frame, energy-efficient double glazing, ventilated facade cladding.",
    photos: ["/artex-parkline.png"],
  },
  {
    name: "Queen's Residence", tag: "Gated Community",
    address: "Adlia St, 53", seaDistance: "8 minutes to the sea", seaMeters: "620 m",
    location: "Adlia St, 53 · 8 minutes to the sea",
    desc: "A private, gated community offering the sophisticated infrastructure of a 5-star hotel. Architecturally optimized floor plans designed for maximum comfort and style — the perfect blend of exclusivity and coastal convenience.",
    yield: "9–12.6%",
    developer: "Placeholder Developer",
    priceFrom: "From $95,000",
    completion: "Q1 2027",
    area: "45–130 m²",
    ceilingHeight: "3.1 m",
    floors: "18 floors",
    buildings: "4 buildings",
    finishing: "White frame, Turnkey",
    installment: "30% down / 70% quarterly",
    features: ["Gated private community", "5-star hotel infrastructure", "Reception & concierge", "Pool & wellness centre", "Personal Property Manager"],
    materials: "Premium reinforced concrete frame, Italian facade cladding, smart home pre-wiring.",
    photos: ["/queens-residence.png"],
  },
  {
    name: "Silk Towers", tag: "First Line · Sea View",
    address: "Black Sea Blvd, 1", seaDistance: "2 minutes to the beach", seaMeters: "150 m",
    location: "Black Sea Boulevard, First Line · 2 min to beach",
    desc: "Luxury living meets ecological innovation on the historic first line. Featuring the region's grandest casino and a 20,000 m² private park by Masu Planning — the last of its kind on the Batumi coastline.",
    yield: "10–13%",
    developer: "Placeholder Developer",
    priceFrom: "From $120,000",
    completion: "Q4 2026",
    area: "50–200 m²",
    ceilingHeight: "3.2 m",
    floors: "45 floors",
    buildings: "2 towers",
    finishing: "White frame, Turnkey, Designer",
    installment: "40% down / 60% quarterly",
    features: ["20,000 m² private park", "Region's largest casino", "Direct Black Sea access", "Masu Planning landscaping", "Swiss-grade construction"],
    materials: "High-grade monolithic concrete, floor-to-ceiling glazing, Swiss engineering standards.",
    photos: ["/silk-towers.png"],
  },
  {
    name: "Rogantini Swiss Village", tag: "Chakvi · Alpine Quality",
    address: "Chakvi village, 30 km from Batumi", seaDistance: "5 minutes to the beach", seaMeters: "400 m",
    location: "Chakvi village, 30 km from Batumi · Mountain & Sea views",
    desc: "A self-contained Swiss-standard village with breathtaking mountain and sea panoramas. From a private poker room and luxury spa to tennis courts and medical facilities — seclusion without compromise.",
    yield: "8–11%",
    developer: "Placeholder Developer",
    priceFrom: "From €55,000",
    completion: "Q3 2026",
    area: "38–110 m²",
    ceilingHeight: "2.85 m",
    floors: "5 floors",
    buildings: "12 buildings",
    finishing: "White frame, Turnkey",
    installment: "25% down / 75% quarterly",
    features: ["Swiss moisture-resistant concrete", "Private poker room & luxury spa", "Tennis courts & medical centre", "Beach shuttle service", "Mountain & sea panoramic views"],
    materials: "Swiss-standard moisture-resistant reinforced concrete, alpine timber facade accents.",
    photos: ["/rogantini.png"],
  },
  {
    name: "Ambassadori Island", tag: "Off-Shore Island · Marina",
    address: "Batumi Bay, off-shore island", seaDistance: "Waterfront", seaMeters: "0 m",
    location: "Off-shore island, Batumi Bay · Private marina access",
    desc: "An 87-hectare man-made archipelago redefining luxury through eco-futurism. With 49% green infrastructure, a premier yacht club, and an elite private university — a sustainable sanctuary where technology meets nature.",
    yield: "12–14.5%",
    developer: "Placeholder Developer",
    priceFrom: "From $180,000",
    completion: "Q2 2027",
    area: "60–350 m²",
    ceilingHeight: "3.3 m",
    floors: "30 floors",
    buildings: "8 buildings",
    finishing: "White frame, Turnkey, Designer",
    installment: "35% down / 65% quarterly",
    features: ["87-ha man-made archipelago", "49% green infrastructure", "Premier yacht club", "Elite private university", "High-end global brand retail"],
    materials: "Eco-certified materials, solar infrastructure, smart building systems throughout.",
    photos: ["/ambassadori.png"],
  },
  {
    name: "Gonio Yachts & Marina", tag: "Gonio · Waterfront",
    address: "Gonio, 15 km from Batumi", seaDistance: "Direct waterfront", seaMeters: "0 m",
    location: "Gonio, 15 km from Batumi · Direct waterfront",
    desc: "A private marina complex combining branded residences with resort hospitality infrastructure. Berths, a yacht club, and a waterfront promenade in one of Georgia's most scenic coastal settings.",
    yield: "11–14%",
    developer: "Placeholder Developer",
    priceFrom: "From $150,000",
    completion: "Q1 2028",
    area: "55–180 m²",
    ceilingHeight: "3.0 m",
    floors: "14 floors",
    buildings: "3 buildings",
    finishing: "White frame, Turnkey",
    installment: "30% down / 70% quarterly",
    features: ["Private marina with berths", "Branded residences", "Yacht club membership", "Waterfront promenade", "Resort hospitality services"],
    materials: "Marine-grade materials, teak decking, panoramic floor-to-ceiling facades.",
    photos: ["/gonio_final_v1.png"],
  },
];

type Project = typeof projects[0];

const stats = [
  { value: "1.7M",   label: "Tourists in 2025" },
  { value: "$1,420", label: "Avg. price/sqm" },
  { value: "14.5%",  label: "Max rental yield" },
  { value: "0%",     label: "Purchase tax" },
];

const triggers = [
  "Residency permit from $150,000 investment",
  "25–30% profit on off-plan projects",
  "1-day registration via blockchain",
  "Top-5 European investment city — Forbes",
  "No restrictions for foreign buyers",
  "Free economic zone benefits",
];

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
  { month: "Jan–Feb",  bloom: "Camellia, mimosa, snowdrops" },
  { month: "Mar",      bloom: "Magnolia, almond, daffodils, tulips" },
  { month: "Apr",      bloom: "Wisteria, sakura, lilac, irises" },
  { month: "May–Jun",  bloom: "Roses (100+ varieties), jasmine, oleander" },
  { month: "Jul–Aug",  bloom: "Hydrangea, hibiscus, lavender" },
  { month: "Sep–Oct",  bloom: "Second bloom of roses & camellias" },
  { month: "Nov–Dec",  bloom: "Loquat, snowdrops, evergreen palms" },
];

const cardImages = [
  "/artex-parkline.png",
  "/queens-residence.png",
  "/silk-towers.png",
  "/rogantini.png",
  "/ambassadori.png",
  "/gonio_final_v1.png",
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
    border-color: #8CB2C0 !important;
    color: #8CB2C0 !important;
  }
  .hero-video-section .hero-roulette {
    font-family: 'ZT Neue Ralewe', 'Jun', Georgia, serif;
    font-style: italic;
    font-weight: 400;
    color: #FFFFFF;
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
    font-family: Manrope, sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    text-decoration: none;
    color: #FAF7F0;
    background: transparent;
    border: 1px solid rgba(250, 247, 240, 0.35);
    transition: border-color 0.2s, color 0.2s;
    cursor: pointer;
  }
  .hero-video-section .hero-scroll-hint {
    position: absolute;
    left: 50%;
    bottom: 28px;
    transform: translateX(-50%);
    z-index: 3;
    font-family: Manrope, sans-serif;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.72);
    text-decoration: none;
    white-space: nowrap;
  }
  .hero-video-section .hero-scroll-hint:hover {
    color: #8CB2C0;
  }
  @media (max-width: 768px) {
    .hero-video-section {
      height: 100svh !important;
      min-height: 640px !important;
    }
    .hero-video-section .hero-content {
      top: auto !important;
      bottom: 108px !important;
      transform: translate(-50%, 0) !important;
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
          <source src="/hero-video.webm" type="video/webm" />
          <source src="/hero-video.mp4" type="video/mp4" />
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

        <div
          className="hero-content"
          style={{
            position: "absolute",
            top: "auto",
            bottom: "18%",
            left: "50%",
            transform: "translate(-50%, 0)",
            zIndex: 2,
            maxWidth: 780,
            width: "90%",
            textAlign: "center",
            margin: "0 auto",
          }}
        >
          <div>
            <h1
              className="hero-h1-video"
              style={{
                fontFamily: "Jun, Georgia, serif",
                fontSize: "clamp(48px, 6.5vw, 92px)",
                fontWeight: 400,
                color: "#FFFFFF",
                lineHeight: 1.02,
                margin: "0 0 32px",
                letterSpacing: "-0.01em",
              }}
            >
              Don&apos;t play
              <br />
              <em className="hero-roulette">roulette</em>
              <br />
              with real estate
              <br />
              in Georgia.
            </h1>

            <div className="hero-cta-row">
              <a href="#portfolio" className="hero-outline-btn hero-cta-btn">
                View Projects
              </a>
              <a href="#contact" className="hero-outline-btn hero-cta-btn">
                Contact
              </a>
            </div>

            <a
              href="https://g.page/r/CR1_vKWcSyUNEAI/review"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                color: "rgba(255,255,255,0.65)",
                textDecoration: "none",
                fontFamily: "Manrope, sans-serif",
                fontSize: "13px",
                letterSpacing: "0.08em",
                marginTop: "24px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#8CB2C0")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
            >
              ★★★★★ &nbsp; 5 / 5 · GOOGLE REVIEWS
            </a>
          </div>
        </div>

        <a href="#founder-note" className="hero-scroll-hint">
          SCROLL TO EXPLORE
        </a>
      </section>
    </>
  );
}

// ─── Founder Note ─────────────────────────────────────────────────────────────
function FounderNote() {
  const isMobile = useIsMobile();
  return (
    <section id="founder-note" className="snap-screen" style={{ background: "#21141A", padding: "10px" }}>
      <div style={{ background: "#FFFBF0", borderRadius: "16px", overflow: "hidden", padding: "clamp(48px,8vw,80px) 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(24px, 4vw, 64px)", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "40px" : "80px", alignItems: "center" }}>

          {/* Left: photo */}
          <div className="reveal">
            <div style={{ aspectRatio: "3/4", overflow: "hidden", borderRadius: "4px", background: "#FFFBF0" }}>
              <img
                src="/arthur-founder.jpg"
                alt="Arthur Arutyunyan, Founder"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
              />
            </div>
          </div>

          {/* Right: quote */}
          <div className="reveal reveal-delay-2">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
              <div style={{ width: "28px", height: "1px", background: "#683D47" }} />
              <span style={{ fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(33,20,26,0.5)", fontFamily: "DM Sans" }}>
                The Founder&apos;s Note
              </span>
            </div>

            <blockquote style={{ margin: "0 0 32px", padding: 0, fontFamily: "Jun, serif", fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)", fontWeight: 400, fontStyle: "italic", color: "#21141A", lineHeight: 1.25 }}>
              &ldquo;I close every deal personally.
              <br />
              Seven years in Batumi. Twelve
              <br />
              client mandates per quarter,
              <br />
              maximum.&rdquo;
            </blockquote>

            <p style={{ fontFamily: "DM Sans", fontSize: "0.88rem", color: "rgba(33,20,26,0.6)", lineHeight: 1.8, marginBottom: "20px" }}>
              Every transaction carries my personal signature. Born and raised in Batumi, I have spent seven years mastering this market — uncovering the critical insights that never make it into public domain.
            </p>
            <p style={{ fontFamily: "DM Sans", fontSize: "0.88rem", color: "rgba(33,20,26,0.6)", lineHeight: 1.8, marginBottom: "20px" }}>
              Real estate in Georgia isn&apos;t a spreadsheet exercise. It&apos;s a network. Who builds with integrity, who cuts corners, which developer finishes on time, and which plot has title issues no broker will ever mention.
            </p>
            <p style={{ fontFamily: "DM Sans", fontSize: "0.88rem", color: "rgba(33,20,26,0.6)", lineHeight: 1.8, marginBottom: "24px" }}>
              I&apos;ve spent seven years in Batumi learning who to trust — and exactly who to walk away from. When you partner with SITBO, you deploy that exact leverage. I personally oversee every turnkey renovation and sign off on every purchase. To guarantee this level of developer precision, I intentionally limit my capacity to twelve client mandates per quarter.
            </p>

            <p style={{ fontFamily: "Jun, serif", fontSize: "1.05rem", fontStyle: "italic", color: "#21141A", margin: "0 0 28px" }}>
              That&apos;s the math of total accountability.
            </p>

            <p style={{ fontFamily: "Jun, serif", fontSize: "1.1rem", fontStyle: "italic", color: "#21141A", margin: 0 }}>
              — Arthur Arutyunyan, Founder
            </p>
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

// ─── Philosophy ───────────────────────────────────────────────────────────────
function Philosophy() {
  return (
    <section style={{ background: "#21141A", padding: "clamp(60px,12vw,350px) 10px", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(24px, 4vw, 64px)" }}>
      <div className="reveal" style={{ maxWidth: "860px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>



        {/* Headline */}
        <div style={{ display: "inline-block", marginBottom: "40px" }}>
          <h2 style={{
            fontFamily: "Jun, serif",
            fontSize: "clamp(2.8rem, 6vw, 5rem)",
            fontWeight: 400,
            color: "#FFFBF0",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            margin: 0,
          }}>
            All-in Ownership
          </h2>
          {/* 7D9FBB accent underline */}
          <div style={{ height: "20px", background: "#8CB2C0", borderRadius: "2px", marginTop: "12px", width: "60%", margin: "12px auto 0" }} />
        </div>

        {/* Body */}
        <p style={{
          fontFamily: "DM Sans",
          fontSize: "clamp(0.95rem, 1.6vw, 1.05rem)",
          color: "#FFFBF0",
          lineHeight: 1.85,
          maxWidth: "720px",
          margin: "0 auto 24px",
          opacity: 0.75,
        }}>
          At Sitbo, we don't just broker deals; we take full accountability for every asset we manage. Ownership is our mindset. We plan with a developer's precision, analyze like investment managers, and act like long-term stakeholders.
        </p>
        <p style={{
          fontFamily: "DM Sans",
          fontSize: "clamp(0.95rem, 1.6vw, 1.05rem)",
          color: "#FFFBF0",
          lineHeight: 1.85,
          maxWidth: "720px",
          margin: "0 auto",
          opacity: 0.75,
        }}>
          This means we anticipate market shifts, sweat the legal and financial details early, and align every partner to protect your capital. No shortcuts, no excuses — just total commitment to your investment from start to finish.
        </p>

      </div>
      </div>
    </section>
  );
}

// ─── Founder ──────────────────────────────────────────────────────────────────
function Founder() {
  return (
    <section id="about" className="scroll-mt-24" style={{ background: "#21141A", padding: "10px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", right: "-20px", transform: "translateY(-50%)", fontSize: "clamp(60px,15vw,180px)", fontFamily: "Jun, serif", fontWeight: 700, color: "rgba(140,178,192,0.06)", lineHeight: 1, userSelect: "none", pointerEvents: "none", whiteSpace: "nowrap" }}>BATUMI</div>

      {/* Big frame card */}
      <div style={{ background: "#FFFBF0", borderRadius: "16px", position: "relative", zIndex: 2, border: "1px solid rgba(140,178,192,0.12)", overflow: "hidden", padding: "80px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(24px, 4vw, 64px)" }}>
      <div className="founder-grid">

        {/* Photo — 30–35% width, padded, aligned top */}
        <div className="reveal" style={{ alignSelf: "flex-start", marginLeft: "0" }}>
          <div style={{ position: "relative" }}>
            <img src="/arthur-founder.jpg" alt="Arthur Arutyunyan"
              style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", objectPosition: "center top", display: "block" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px", background: "linear-gradient(transparent, rgba(33,20,26,0.92))" }}>
              <p style={{ color: "#FFFBF0", fontFamily: "Jun, serif", fontSize: "1.3rem", fontWeight: 500, margin: 0 }}>Arthur Arutuniyan</p>
              <p style={{ color: "rgba(255,250,236,0.7)", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", margin: "4px 0 0", fontFamily: "DM Sans", fontWeight: 600 }}>Founder & Sales Expert</p>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="reveal reveal-delay-2 founder-text-pad">
          {/* Header */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{ width: "28px", height: "1px", background: C.wine }} />
              <span style={{ fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: C.muted, fontFamily: "DM Sans" }}>About & Services</span>
            </div>
            <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(1.8rem, 3.2vw, 2.8rem)", fontWeight: 400, color: C.dark, lineHeight: 1.1, marginBottom: "40px" }}>
              Market Expertise.<br /><em style={{ fontStyle: "italic", color: C.teal }}>Personal Service.</em>
            </h2>
            <p style={{ fontFamily: "DM Sans", fontSize: "0.9rem", color: "#666", lineHeight: 1.85, marginBottom: "60px" }}>
              From confusing paperwork to 'ghost' agents, the risks are real. With hundreds of successful deals behind us, we verify the legality, assess true value, and secure your ROI. Focus on the lifestyle; let us handle the complexity.
            </p>
          </div>

          {/* 2×2 service grid */}
          <div className="founder-pillars">
            {[
              { label: "Investment & Access",  desc: "Exclusive deals unavailable to the public, backed by honest projection analysis." },
              { label: "Legal & Residency",    desc: "Full title due diligence and complete guidance through Georgia residency." },
              { label: "Turnkey & Care",       desc: "From raw unit to fully furnished rental, with ongoing property management." },
              { label: "Business & Setup",     desc: "Company registration, bank setup, and complete end-to-end relocation support." },
            ].map((item) => (
              <div key={item.label} style={{ borderLeft: "2px solid #8CB2C0", paddingLeft: "18px", paddingTop: "4px", paddingBottom: "4px" }}>
                <p style={{ color: C.dark, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "DM Sans", marginBottom: "8px", fontWeight: 700 }}>{item.label}</p>
                <p style={{ color: "#666", fontSize: "0.84rem", fontFamily: "DM Sans", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
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
  return (
    <section id="analytics" style={{ background: "#21141A", padding: "10px", overflow: "hidden" }}>
      <div style={{ background: "#FFFBF0", borderRadius: "16px", overflow: "hidden", padding: "clamp(40px,5vw,72px) 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(24px, 4vw, 64px)" }}>
        <div className="reveal" style={{ marginBottom: isMobile ? "20px" : "56px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: isMobile ? "8px" : "16px" }}>
            <div style={{ width: "28px", height: "1px", background: C.wine }} />
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: C.muted, fontFamily: "DM Sans" }}>Market Intelligence · 2026</span>
          </div>
          <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(1.8rem,4vw,3.4rem)", fontWeight: 400, color: C.dark, lineHeight: 1.1, marginBottom: isMobile ? "4px" : "8px" }}>
            Batumi is now a Top-5 European<br />investment city.
          </h2>
          <p style={{ fontSize: "0.82rem", color: C.muted, fontFamily: "DM Sans", marginBottom: isMobile ? "12px" : "24px" }}>— Forbes, 2025</p>
        </div>

        {/* Stats */}
        <div className="stats-grid reveal reveal-delay-1">
          {stats.map((s) => (
            <div key={s.value} className="stat-tile"
              onMouseEnter={(e) => (e.currentTarget.style.borderBottomColor = C.teal)}
              onMouseLeave={(e) => (e.currentTarget.style.borderBottomColor = "transparent")}
            >
              <p className="stat-number">{s.value}</p>
              <p style={{ color: C.muted, fontSize: "0.78rem", fontFamily: "DM Sans", marginTop: "6px" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Triggers + Chart */}
        <div className="analytics-grid" style={{ marginTop: isMobile ? "20px" : "56px" }}>
          <div className="reveal">
            <h3 style={{ fontFamily: "Jun, serif", fontSize: "clamp(1.4rem,2.5vw,2rem)", fontWeight: 400, color: C.dark, marginBottom: "28px", lineHeight: 1.2 }}>
              Why investors choose<br /><em style={{ fontStyle: "italic", color: C.teal }}>Georgia right now.</em>
            </h3>
            {triggers.map((t) => (
              <div key={t} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "6px" }}>
                <div style={{ width: "6px", height: "6px", background: "#683D47", flexShrink: 0, marginTop: "6px", borderRadius: "50%" }} />
                <p style={{ fontFamily: "DM Sans", fontSize: "0.88rem", color: C.muted, lineHeight: 1.6, margin: 0 }}>{t}</p>
              </div>
            ))}
          </div>

          <div className="reveal reveal-delay-2">
            <div style={{ background: "#FFFBF0", padding: "32px", maxWidth: "420px", border: "2px solid #21141A" }}>
              <p style={{ color: "#21141A", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "DM Sans", fontWeight: 600, marginBottom: "24px" }}>Rental Yield Comparison</p>
              {[
                { city: "Batumi (first line)", pct: 87, label: "8–14.5%" },
                { city: "Tbilisi",   pct: 60, label: "5–8%" },
                { city: "Dubai",     pct: 55, label: "5–7%" },
                { city: "Istanbul",  pct: 50, label: "4–6%" },
                { city: "Barcelona", pct: 40, label: "3–5%" },
              ].map((row, i) => (
                <div key={row.city} style={{ marginBottom: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ color: "#21141A", fontSize: "0.75rem", fontFamily: "DM Sans", fontWeight: 500 }}>{row.city}</span>
                    <span style={{ color: i === 0 ? "#21141A" : "#21141A", fontSize: "0.75rem", fontFamily: "DM Sans", fontWeight: 500 }}>{row.label}</span>
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
      <div style={{ margin: "0 10px", background: "#FFFBF0", borderRadius: "16px", padding: "clamp(28px,4vw,64px) 20px clamp(28px,4vw,56px)", position: "relative", zIndex: 2, border: "1px solid rgba(140,178,192,0.12)", overflow: "visible" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto 8px", padding: "0 clamp(24px, 4vw, 64px)" }}>
        <div className="reveal" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <div style={{ width: "28px", height: "1px", background: C.wine }} />
              <span style={{ fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: C.muted, fontFamily: "DM Sans" }}>Selected Projects</span>
            </div>
            <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(1.8rem,4vw,3.2rem)", fontWeight: 400, color: C.dark, lineHeight: 1.1 }}>
              Premium projects,<br /><em style={{ fontStyle: "italic", color: C.teal }}>filtered by us.</em>
            </h2>
          </div>
          <a href="#contact" className="btn-outline-gold" style={{ color: C.dark, borderColor: C.dark, flexShrink: 0 }}>Request Access</a>
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
            {projects.map((p, i) => <ProjectCard key={p.name} project={p} index={i} isMobile={isMobile} />)}
          </div>
        </div>

        {/* Mobile-only scroll arrow */}
        {isMobile && showArrow && (
          <button
            onClick={scrollNext}
            aria-label="Scroll to next project"
            className="portfolio-arrow-hint"
            style={{
              position: "absolute",
              right: "6px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              background: "rgba(255,250,236,0.85)",
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
              <path d="M6 3l5 5-5 5" stroke="#8CB2C0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Alabbar quote */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(24px, 4vw, 64px)" }}>
      <div className="reveal" style={{ padding: "56px 0 25px", maxWidth: "860px", margin: "0 auto" }}>
        <div style={{ borderLeft: `2px solid ${C.teal}`, paddingLeft: "24px" }}>
          <p style={{ fontFamily: "Jun, serif", fontSize: "clamp(1.2rem,2.2vw,1.8rem)", fontWeight: 300, fontStyle: "italic", color: "#21141A", lineHeight: 1.5, marginBottom: "16px" }}>
            "Georgia is a country with an extraordinary landscape and a promising path toward prosperity. We see immense potential here."
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <p style={{ color: C.teal, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "DM Sans", margin: 0 }}>
              Mohamed Alabbar — Eagle Hills, UAE
            </p>
          </div>
        </div>
      </div>
      </div>
      </div>{/* /frame card */}
    </section>
  );
}


function ProjectCard({ project, index, isMobile }: { project: typeof projects[0]; index: number; isMobile?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const cardW = isMobile ? "260px" : "300px";
  const slug = project.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const firstSentence = project.desc.match(/^[^.!?]+[.!?]/)?.[0] ?? project.desc;
  const teaser = firstSentence.length > 110
    ? firstSentence.slice(0, 108).trimEnd() + "…"
    : firstSentence;

  return (
    <Link href={`/project/${slug}`}>
      <a style={{ textDecoration: "none", display: "block" }}>
        <div className="property-card" style={{ width: cardW, minWidth: cardW, flexShrink: 0, scrollSnapAlign: "start", cursor: "pointer", borderRadius: "16px", overflow: "hidden", position: "relative" }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <img src={cardImages[index]} alt={project.name}
            style={{ width: "100%", height: "460px", objectFit: "cover", display: "block", transition: "transform 0.6s ease", transform: hovered ? "scale(1.06)" : "scale(1)" }} />

          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 38%, rgba(0,0,0,0.08) 65%, transparent 100%)" }} />

          <div style={{ position: "absolute", top: "14px", right: "14px", background: "#FFFBF0", color: "#21141A", padding: "4px 10px", fontSize: "0.62rem", fontFamily: "DM Sans", fontWeight: 700, letterSpacing: "0.06em" }}>
            {project.yield} ROI
          </div>

          <div style={{
            position: "absolute", top: "14px", left: "14px",
            background: "rgba(255,250,236,0.12)", backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,250,236,0.2)", borderRadius: "6px",
            padding: "4px 10px", fontSize: "0.58rem", fontFamily: "DM Sans",
            color: "#FFFBF0", letterSpacing: "0.08em", textTransform: "uppercase",
            opacity: hovered ? 1 : 0, transition: "opacity 0.3s",
          }}>View Project</div>

          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 18px 24px", minHeight: "140px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <p style={{ color: "rgba(255,250,236,0.55)", fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: "DM Sans", marginBottom: "6px" }}>{project.tag}</p>
            <h3 style={{ fontFamily: "Jun, serif", fontSize: "1.45rem", fontWeight: 500, color: "#FFFBF0", margin: "0 0 8px" }}>{project.name}</h3>
            <p style={{ color: "rgba(255,250,236,0.65)", fontSize: "0.75rem", fontFamily: "DM Sans", lineHeight: 1.55, margin: 0 }}>{teaser}</p>
          </div>
        </div>
      </a>
    </Link>
  );
}

// ─── Lifestyle ────────────────────────────────────────────────────────────────
function Lifestyle() {
  return (
    <section style={{ background: "#21141A", padding: "120px 0", overflow: "hidden" }}>
      <div className="lifestyle-grid" style={{ alignItems: "stretch" }}>
        {/* Left — photo bleeds to left edge */}
        <div className="reveal lifestyle-photo-col">
          <img src="/lifestyle-coast.png" alt="Batumi coast" style={{ width: "100%", height: "100%", minHeight: "480px", objectFit: "cover", objectPosition: "center", display: "block" }} />
        </div>

        {/* Right — text + calendar, padded */}
        <div className="reveal reveal-delay-2 lifestyle-text-col" style={{ padding: "0 clamp(24px,5vw,72px) 0 clamp(32px,4vw,64px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ width: "28px", height: "1px", background: "#683D47" }} />
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(33,20,26,0.55)", fontFamily: "DM Sans" }}>The Climate Paradise</span>
          </div>
          <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(1.8rem,3.5vw,3rem)", fontWeight: 400, color: "#FFFBF0", lineHeight: 1.1, marginBottom: "20px" }}>
            Subtropical beauty.<br /><em style={{ fontStyle: "italic", color: "#8CB2C0" }}>Eternal bloom.</em>
          </h2>
          <p style={{ fontFamily: "DM Sans", fontSize: "0.9rem", color: "rgba(255,250,236,0.65)", lineHeight: 1.8, marginBottom: "32px" }}>
            Batumi enjoys a humid subtropical climate — 300+ sunny days, palm-lined boulevards, and a Black Sea breeze that never turns hostile. Unlike most European resort cities, Batumi blooms all year round.
          </p>
          <p style={{ fontFamily: "DM Sans", fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#8CB2C0", marginBottom: "20px" }}>Eternal Bloom Calendar</p>
          {bloomCalendar.map((item, i) => (
            <div key={item.month} style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "16px", alignItems: "center", padding: "11px 0", borderBottom: i < bloomCalendar.length - 1 ? "1px solid rgba(255,250,236,0.08)" : "none" }}>
              <span style={{ fontFamily: "Jun, serif", fontSize: "0.95rem", fontWeight: 600, color: "#8CB2C0" }}>{item.month}</span>
              <span style={{ fontFamily: "DM Sans", fontSize: "0.82rem", color: "rgba(255,250,236,0.6)" }}>{item.bloom}</span>
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
    { label: "VIP Arrival",
      desc: "Private transfer and 24/7 personal support from the moment you land",
      svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8CB2C0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>,
    },
    { label: "Premium Stay",
      desc: "Curated 5-star accommodation selected for your comfort",
      svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8CB2C0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    },
    { label: "Off-Market Viewings",
      desc: "Exclusive properties not listed publicly, shown only to our clients",
      svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8CB2C0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    },
    { label: "Gastronomic Program",
      desc: "Batumi's finest restaurants and experiences, arranged for you",
      svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8CB2C0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
    },
    { label: "Investment Briefing",
      desc: "Private session with our senior advisor on market and returns",
      svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8CB2C0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    },
    { label: "Legal Consultation",
      desc: "Full legal review of shortlisted properties before you decide",
      svg: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8CB2C0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    },
  ];

  return (
    <section ref={ref} id="discovery-tour" style={{
      background: "#21141A", minHeight: isMobile ? "auto" : "100vh",
      display: "flex", alignItems: "center",
      padding: "10px", position: "relative", overflow: "hidden",
    }}>





      <div style={{ width: "100%", position: "relative", zIndex: 1, background: "#FFFBF0", borderRadius: "16px", paddingTop: isMobile ? "40px" : "clamp(60px,7vw,100px)", paddingBottom: isMobile ? "40px" : "clamp(60px,7vw,100px)" }}>
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
              <span style={{ fontSize: "0.6rem", letterSpacing: "0.24em", textTransform: "uppercase", color: C.muted, fontFamily: "DM Sans", fontWeight: 600 }}>Private Property Tour</span>
              <div style={{ width: "28px", height: "1px", background: C.wine }} />
            </div>
            <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(2.6rem, 5.5vw, 4.4rem)", fontWeight: 400, color: C.dark, lineHeight: 1.05, margin: "0", letterSpacing: "-0.02em", display: "inline" }}>
              Sitbo Discovery{" "}
            </h2>
            <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(2.6rem, 5.5vw, 4.4rem)", fontWeight: 400, fontStyle: "italic", color: "#8CB2C0", lineHeight: 1.05, margin: "0", letterSpacing: "-0.02em", display: "inline" }}>
              Experience.
            </h2>
            <p style={{ fontFamily: "Jun, serif", fontSize: "1.2rem", color: C.muted, lineHeight: 1.7, margin: "20px 0 0", fontStyle: "italic" }}>
              Arrive as a guest. Leave as an investor.
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
                background: isMobile ? "#ffffff" : "rgba(140,178,192,0.05)",
                border: isMobile ? "none" : "1px solid rgba(140,178,192,0.15)",
                borderRadius: isMobile ? "12px" : "16px",
                boxShadow: isMobile ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.7s ease, transform 0.7s ease, box-shadow 0.3s ease, border-color 0.3s ease",
                transitionDelay: `${0.2 + i * 0.07}s`,
                cursor: "default",
              }}
              onMouseEnter={isMobile ? undefined : e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(140,178,192,0.15)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(140,178,192,0.4)"; }}
              onMouseLeave={isMobile ? undefined : e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(140,178,192,0.15)"; }}
              >
                <div style={{ marginBottom: isMobile ? "10px" : "20px" }}>
                  {isMobile ? (
                    React.cloneElement(item.svg, {
                      width: 24,
                      height: 24,
                      stroke: "#8CB2C0",
                      strokeWidth: 1,
                    })
                  ) : (
                    <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: "rgba(140,178,192,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {React.cloneElement(item.svg, { width: 28, height: 28 })}
                    </div>
                  )}
                </div>
                <p style={{
                  fontFamily: "DM Sans",
                  fontSize: isMobile ? "0.7rem" : "0.82rem",
                  fontWeight: isMobile ? 600 : 700,
                  color: isMobile ? "#21141A" : C.dark,
                  margin: isMobile ? "0 0 4px" : "0 0 8px",
                  letterSpacing: isMobile ? "0.12em" : "0.04em",
                  textTransform: "uppercase",
                }}>{item.label}</p>
                <p style={{
                  fontFamily: "DM Sans",
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
            border: "1px solid rgba(140,178,192,0.25)",
            borderRadius: "12px", padding: "24px 32px",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.9s ease 0.4s",
          }}>
            <div>
              <span style={{ fontFamily: "Jun, serif", fontSize: "1.6rem", fontWeight: 700, color: C.dark, marginRight: "10px" }}>
                $2,000
              </span>
              <span style={{ fontFamily: "DM Sans", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted }}>Deposit</span>
              <p style={{ fontFamily: "DM Sans", fontSize: "0.78rem", color: C.muted, margin: "6px 0 0", lineHeight: 1.5 }}>
                Fully refundable against purchase — deducted from the transaction.
              </p>
            </div>
            <a href="#contact" style={{
              display: "inline-block", padding: "14px 32px", flexShrink: 0,
              background: "#8CB2C0", borderRadius: "6px", textDecoration: "none",
              fontFamily: "DM Sans", fontSize: "0.72rem", fontWeight: 700,
              color: "#FFFBF0", letterSpacing: "0.1em", textTransform: "uppercase",
              transition: "opacity 0.2s, transform 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Book a Discovery Tour
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
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "120px", background: "linear-gradient(to right, #FFFBF0, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "120px", background: "linear-gradient(to left, #FFFBF0, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div className="gallery-track">
            {[
              "/turnkey-new.png",
              "/turnkey-web.png",
              "/lifestyle-coast.png",
              "/interior-bedroom.png",
              "/hero2.png",
              "/card1.png",
              "/card2.png",
              "/turnkey-new.png",
              "/turnkey-web.png",
              "/lifestyle-coast.png",
              "/interior-bedroom.png",
              "/hero2.png",
              "/card1.png",
              "/card2.png",
            ].map((src, i) => (
              <div key={i} style={{ width: "280px", height: "280px", flexShrink: 0, overflow: "hidden", borderRadius: "12px" }}>
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
function Payment() {
  const cards = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8CB2C0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
        </svg>
      ),
      title: "Official Bank Transfers (GEL)",
      body: "All official property payments in Georgia are conducted in the local currency, Georgian Lari (GEL), directly to the developer's bank account. We provide full assistance with currency exchange at the most competitive market rates to ensure your USD or EUR funds are converted according to the National Bank's official daily rate.",
      sub: "Secure, transparent, and 100% compliant with Georgian financial regulations.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8CB2C0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/><path d="M10 9h4v2h-4z"/><path d="M10 13h4v2h-4z"/>
        </svg>
      ),
      title: "Cryptocurrency & Digital Assets",
      body: "Batumi is a leading hub for crypto-real estate deals. Most top-tier developers now officially accept BTC, ETH, and USDT. We facilitate the entire process, ensuring your digital assets are securely used for your purchase with full legal documentation and proof of payment.",
      sub: "Full legal compliance. Blockchain-verified ownership transfer.",
    },
  ];

  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8CB2C0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      ),
      title: "Interest-Free Installments",
      desc: "Pay in GEL over 18–48 months with a 10–30% down payment directly to the developer. No bank involvement, no interest.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8CB2C0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9"/><path d="M12 5v14M5 12h14"/>
        </svg>
      ),
      title: "Remote Transactions",
      desc: "Complete the currency exchange, payment, and property registration without being physically present in Georgia.",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8CB2C0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="12" rx="1"/><path d="M6 7V4M18 7V4"/>
        </svg>
      ),
      title: "SWIFT & International Support",
      desc: "Full support for international bank transfers and remote bank account opening for non-residents.",
    },
  ];

  return (
    <section id="payment" style={{ background: "#21141A", padding: "clamp(60px,8vw,220px) 10px clamp(50px,6vw,200px)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(24px, 4vw, 64px)" }}>
        {/* Header */}
        <div className="reveal" style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ width: "28px", height: "1px", background: "#683D47" }} />
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#aaa", fontFamily: "DM Sans" }}>Payment Methods</span>
          </div>
          <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 400, color: "#FFFBF0", lineHeight: 1.1 }}>
            Flexible ways to<br /><em style={{ fontStyle: "italic", color: "#8CB2C0" }}>invest in Batumi.</em>
          </h2>
        </div>

        {/* Two cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "48px" }}>
          {cards.map((card) => (
            <div key={card.title} className="reveal"
              style={{ background: "#FFFBF0", borderRadius: "16px", padding: "56px 32px", border: "1px solid rgba(140,178,192,0.15)", transition: "transform 0.3s, box-shadow 0.3s", cursor: "default" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.3)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
            >
              <div style={{ width: "52px", height: "52px", background: "rgba(140,178,192,0.12)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "28px" }}>
                {card.icon}
              </div>
              <h3 style={{ fontFamily: "Jun, serif", fontSize: "1.6rem", fontWeight: 500, color: "#21141A", marginBottom: "16px", lineHeight: 1.2 }}>{card.title}</h3>
              <p style={{ fontFamily: "DM Sans", fontSize: "0.88rem", color: "#555", lineHeight: 1.8, marginBottom: "20px" }}>{card.body}</p>
              <p style={{ fontFamily: "DM Sans", fontSize: "0.78rem", color: "#8CB2C0", lineHeight: 1.6, borderTop: "1px solid rgba(140,178,192,0.25)", paddingTop: "16px" }}>{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Three features — in boxes */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", borderTop: "1px solid rgba(140,178,192,0.15)", paddingTop: "40px" }}>
          {features.map((f) => (
            <div key={f.title} className="reveal" style={{ display: "flex", flexDirection: "column", gap: "18px", padding: "28px 24px", background: "rgba(255,251,240,0.07)", borderRadius: "14px", border: "1px solid rgba(255,251,240,0.1)", textAlign: "center", alignItems: "center" }}>
              <div style={{ width: "48px", height: "48px", background: "rgba(140,178,192,0.15)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <p style={{ fontFamily: "DM Sans", fontWeight: 600, fontSize: "0.9rem", color: "#FAF7F0", marginBottom: "8px" }}>{f.title}</p>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.8rem", color: "#aaa", lineHeight: 1.7 }}>{f.desc}</p>
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
    width: "100%", background: "rgba(33,20,26,0.06)", border: "1px solid rgba(33,20,26,0.2)", padding: "10px 14px", color: "#21141A", fontFamily: "DM Sans",
    fontSize: "0.9rem", outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase",
    color: "rgba(33,20,26,0.55)", fontFamily: "DM Sans", marginBottom: "6px",
  };
  const statRow = (label: string, value: string, label2?: string, value2?: string) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", padding: "12px 0", borderBottom: "1px solid rgba(33,20,26,0.1)" }}>
      <div>
        <p style={{ fontFamily: "DM Sans", fontSize: "0.6rem", color: "rgba(33,20,26,0.5)", margin: "0 0 4px", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</p>
        <p style={{ fontFamily: "Jun, serif", fontSize: "1.05rem", color: "#21141A", margin: 0, fontWeight: 600 }}>{value}</p>
      </div>
      {label2 && (
        <div>
          <p style={{ fontFamily: "DM Sans", fontSize: "0.6rem", color: "rgba(33,20,26,0.5)", margin: "0 0 4px", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label2}</p>
          <p style={{ fontFamily: "Jun, serif", fontSize: "1.05rem", color: "#21141A", margin: 0, fontWeight: 600 }}>{value2}</p>
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
            <div style={{ width: "28px", height: "1px", background: "#683D47" }} />
            <span style={{ fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,251,240,0.55)", fontFamily: "DM Sans" }}>Payment Calculator</span>
          </div>
          <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 400, color: "#FFFBF0", margin: 0, lineHeight: 1.1 }}>
            Plan your<br /><em style={{ fontStyle: "italic", color: "#8CB2C0" }}>investment.</em>
          </h2>
        </div>

        {/* Mode toggle */}
        <div style={{ display: isMobile ? "flex" : "inline-flex", width: isMobile ? "100%" : "auto", background: "rgba(255,250,236,0.07)", borderRadius: "10px", padding: "4px", marginBottom: "32px", border: "1px solid rgba(255,250,236,0.1)" }}>
          {(["installment", "mortgage"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: isMobile ? 1 : undefined,
              padding: "9px 22px", borderRadius: "7px", border: "none", cursor: "pointer",
              fontFamily: "DM Sans", fontSize: isMobile ? "0.68rem" : "0.78rem", letterSpacing: "0.04em", fontWeight: 600,
              transition: "all 0.2s",
              background: mode === m ? "#8CB2C0" : "transparent",
              color: mode === m ? "#21141A" : "rgba(255,250,236,0.6)",
            }}>
              {m === "installment" ? "Interest-Free Installment" : "Bank Mortgage"}
            </button>
          ))}
        </div>

        {/* Main layout */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 360px", gap: "32px", alignItems: "start" }}>

          {/* ── LEFT: Inputs ── */}
          <div style={{ background: "#FFFBF0", borderRadius: "16px", padding: "36px", border: "1px solid rgba(33,20,26,0.12)" }}>

            {mode === "installment" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div>
                  <label style={labelStyle}>Property Price (USD)</label>
                  <input type="number" value={instPrice || ""} onChange={e => setInstPrice(e.target.value === "" ? 0 : +e.target.value)} onFocus={e => e.target.select()} style={inputStyle} min={10000} step={5000} />
                </div>
                <div>
                  <label style={labelStyle}>Down Payment — {instDown}%&nbsp;&nbsp;<span style={{ color: "#8CB2C0" }}>{fmtInst(instPrice * instDown / 100)}</span></label>
                  <input type="range" min={10} max={70} value={instDown} onChange={e => setInstDown(+e.target.value)}
                    style={{ width: "100%", accentColor: "#8CB2C0", cursor: "pointer" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.62rem", color: "rgba(33,20,26,0.4)", fontFamily: "DM Sans", marginTop: "4px" }}>
                    <span>10%</span><span>70%</span>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Duration — {instMonths} months</label>
                  <input type="range" min={24} max={48} step={6} value={instMonths} onChange={e => setInstMonths(+e.target.value)}
                    style={{ width: "100%", accentColor: "#8CB2C0", cursor: "pointer" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.62rem", color: "rgba(33,20,26,0.4)", fontFamily: "DM Sans", marginTop: "4px" }}>
                    <span>24 mo</span><span>48 mo</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {/* Mortgage sub-tabs */}
                <div style={{ display: "flex", gap: "4px", marginBottom: "28px", background: "rgba(33,20,26,0.06)", padding: "4px" }}>
                  {(["amount", "income"] as const).map((t) => (
                    <button key={t} onClick={() => setMortTab(t)} style={{
                      flex: 1, padding: "8px 4px", border: "none", cursor: "pointer",
                      fontFamily: "DM Sans", fontSize: "0.7rem", fontWeight: 600, transition: "all 0.2s",
                      background: mortTab === t ? "#21141A" : "transparent",
                      color: mortTab === t ? "#FFFBF0" : "rgba(33,20,26,0.5)",
                    }}>
                      {t === "amount" ? "By Amount" : "By Income"}
                    </button>
                  ))}
                </div>


                {/* By Amount */}
                {mortTab === "amount" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div>
                      <label style={labelStyle}>Loan Amount ({mortCurrency})</label>
                      <input type="number" value={mortAmount || ""} onChange={e => setMortAmount(e.target.value === "" ? 0 : +e.target.value)} onFocus={e => e.target.select()} style={inputStyle} min={3000} step={5000} />
                    </div>
                    <div>
                      <label style={labelStyle}>Period — {mortYears} years</label>
                      <input type="range" min={1} max={20} value={mortYears} onChange={e => setMortYears(+e.target.value)}
                        style={{ width: "100%", accentColor: "#8CB2C0", cursor: "pointer" }} />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.62rem", color: "rgba(33,20,26,0.4)", fontFamily: "DM Sans", marginTop: "4px" }}>
                        {[1,5,9,13,17,20].map(v => <span key={v}>{v}</span>)}
                      </div>
                    </div>
                  </div>
                )}

                {/* By Income */}
                {mortTab === "income" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div>
                      <label style={labelStyle}>Monthly Income ({mortCurrency})</label>
                      <input type="number" value={mortIncome || ""} onChange={e => setMortIncome(e.target.value === "" ? 0 : +e.target.value)} onFocus={e => e.target.select()} style={inputStyle} min={500} step={500} />
                    </div>
                    <div>
                      <label style={labelStyle}>Period — {mortIncomeYears} years</label>
                      <input type="range" min={1} max={20} value={mortIncomeYears} onChange={e => setMortIncomeYears(+e.target.value)}
                        style={{ width: "100%", accentColor: "#8CB2C0", cursor: "pointer" }} />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.62rem", color: "rgba(33,20,26,0.4)", fontFamily: "DM Sans", marginTop: "4px" }}>
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
            <div style={{ background: "#FFFBF0", borderRadius: "16px", border: "1px solid rgba(33,20,26,0.15)", padding: "28px" }}>

              {mode === "installment" ? (
                <>
                  <p style={{ fontFamily: "DM Sans", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(33,20,26,0.55)", margin: "0 0 10px" }}>Monthly Payment</p>
                  <p style={{ fontFamily: "Jun, serif", fontSize: "2.6rem", fontWeight: 600, color: "#8CB2C0", margin: "0 0 4px", lineHeight: 1 }}>
                    {fmtInst(instMonthly)}
                  </p>
                  <p style={{ fontFamily: "DM Sans", fontSize: "0.7rem", color: "rgba(33,20,26,0.5)", margin: "0 0 16px" }}>0% interest · {instMonths} months</p>
                  {statRow("Loan Amount", fmtInst(instLoan), "Down Payment", fmtInst(instPrice * instDown / 100))}
                  {statRow("Total Price", fmtInst(instPrice), "Duration", instMonths + " months")}
                </>
              ) : mortTab === "amount" ? (
                <>
                  <p style={{ fontFamily: "DM Sans", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(33,20,26,0.55)", margin: "0 0 10px" }}>Monthly Contribution</p>
                  <p style={{ fontFamily: "Jun, serif", fontSize: "2.6rem", fontWeight: 600, color: "#8CB2C0", margin: "0 0 4px", lineHeight: 1 }}>
                    {fmt(mortMonthly, currencySymbol)}
                  </p>
                  <p style={{ fontFamily: "DM Sans", fontSize: "0.7rem", color: "rgba(33,20,26,0.5)", margin: "0 0 16px" }}>Annuity payment</p>
                  {statRow("Amount", fmt(mortAmount, currencySymbol), "Period", mortYears + " years")}
                  {statRow("Interest Rate (NIR)", NIR + "%", "Effective Rate (EIR)", EIR + "%")}
                </>
              ) : (
                <>
                  <p style={{ fontFamily: "DM Sans", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(33,20,26,0.55)", margin: "0 0 10px" }}>Max Loan Amount</p>
                  <p style={{ fontFamily: "Jun, serif", fontSize: "2.6rem", fontWeight: 600, color: "#8CB2C0", margin: "0 0 4px", lineHeight: 1 }}>
                    {fmt(maxLoan, currencySymbol)}
                  </p>
                  <p style={{ fontFamily: "DM Sans", fontSize: "0.7rem", color: "rgba(33,20,26,0.5)", margin: "0 0 16px" }}>Based on 50% income ratio</p>
                  {statRow("Monthly Contribution", fmt(maxMonthlyPayment, currencySymbol), "Period", mortIncomeYears + " years")}
                  {statRow("Interest Rate (NIR)", NIR + "%", "Effective Rate (EIR)", EIR + "%")}
                </>
              )}

            </div>

            {/* ROI Preview */}
            <div style={{ background: "#FFFBF0", borderRadius: "16px", border: "1px solid rgba(33,20,26,0.15)", padding: "20px" }}>
              <p style={{ fontFamily: "DM Sans", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(33,20,26,0.5)", margin: "0 0 6px" }}>ROI Preview</p>
              <p style={{ fontFamily: "Jun, serif", fontSize: "1.8rem", fontWeight: 600, color: "#8CB2C0", margin: "0 0 4px" }}>9–14%</p>
              <p style={{ fontFamily: "DM Sans", fontSize: "0.7rem", color: "rgba(33,20,26,0.5)", margin: 0, lineHeight: 1.6 }}>
                Based on current market data for high-demand areas in Batumi.
              </p>
            </div>

            {/* CTA */}
            <a href="#contact" style={{
              display: "block", textAlign: "center", padding: "14px 20px",
              background: "#8CB2C0", borderRadius: "10px", textDecoration: "none",
              fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 700,
              color: "#21141A", letterSpacing: "0.04em", transition: "opacity 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Get a Detailed Payment Plan
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: "", contact: "", budget: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.contact.trim()) { setError("Please fill in your name and contact."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) setSubmitted(true);
      else setError("Something went wrong. Please try again.");
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  const contactLabelStyle: React.CSSProperties = {
    display: "block",
    color: "rgba(255,251,240,0.5)",
    fontSize: "0.65rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontFamily: "DM Sans",
    marginBottom: "6px",
  };
  const contactInputStyle: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    background: "rgba(255,251,240,0.08)",
    border: "1px solid rgba(255,251,240,0.15)",
    color: "#FFFBF0",
    fontFamily: "DM Sans",
    fontSize: "0.9rem",
    padding: "12px 14px",
    outline: "none",
    borderRadius: "0",
  };

  return (
    <section id="contact" className="scroll-mt-24 border-t border-[rgba(140,178,192,0.15)] bg-[#21141A] py-[clamp(64px,8vw,120px)]">
      <style>{`
        #contact .contact-input::placeholder { color: rgba(255,251,240,0.35); }
        #contact select.contact-input option { background: #21141A; color: #FFFBF0; }
      `}</style>
      <div className="mx-auto max-w-[1200px] px-4 md:px-6">
      <div className="mx-auto max-w-[680px]">
        <div className="reveal" style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ width: "28px", height: "1px", background: "rgba(255,251,240,0.3)" }} />
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,251,240,0.5)", fontFamily: "DM Sans" }}>Private Consultation</span>
            <div style={{ width: "28px", height: "1px", background: "rgba(255,251,240,0.3)" }} />
          </div>
          <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(1.8rem,4vw,3.4rem)", fontWeight: 400, color: "#FFFBF0", lineHeight: 1.1, marginBottom: "16px" }}>
            Let's discuss<br /><em style={{ fontStyle: "italic", color: C.teal }}>your strategy.</em>
          </h2>
          <p style={{ fontFamily: "DM Sans", fontSize: "0.9rem", color: "rgba(255,251,240,0.6)", lineHeight: 1.7 }}>
            We take on a limited number of clients each quarter. No obligation, full transparency.
          </p>
        </div>

        {submitted ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ width: "64px", height: "64px", border: `1px solid ${C.teal}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <span style={{ color: C.teal, fontSize: "1.4rem" }}>✓</span>
            </div>
            <h3 style={{ fontFamily: "Jun, serif", fontSize: "1.8rem", color: "#FFFBF0", marginBottom: "12px" }}>We'll be in touch shortly.</h3>
            <p style={{ fontFamily: "DM Sans", fontSize: "0.88rem", color: "rgba(255,251,240,0.6)", lineHeight: 1.7 }}>
              Your inquiry has been received. Expect a personal call from Arthur within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="reveal reveal-delay-1" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div className="form-row">
              <div>
                <label style={contactLabelStyle}>Your Name *</label>
                <input className="contact-input" type="text" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={contactInputStyle} />
              </div>
              <div>
                <label style={contactLabelStyle}>WhatsApp / Phone *</label>
                <input className="contact-input" type="text" placeholder="+1 234 567 8900" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} required style={contactInputStyle} />
              </div>
            </div>
            <div>
              <label style={contactLabelStyle}>Investment Budget</label>
              <select className="contact-input" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} style={{ ...contactInputStyle, cursor: "pointer" }}>
                <option value="">Select your budget range</option>
                <option value="50-100k">$50,000 – $100,000</option>
                <option value="100-200k">$100,000 – $200,000</option>
                <option value="200-500k">$200,000 – $500,000</option>
                <option value="500k+">$500,000+</option>
              </select>
            </div>
            {error && <p style={{ color: C.teal, fontSize: "0.8rem", fontFamily: "DM Sans" }}>{error}</p>}
            <button type="submit" className="btn-gold" disabled={loading}
              style={{ marginTop: "6px", width: "100%", padding: "16px", fontSize: "0.78rem", opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer", color: "#21141A", background: "#8CB2C0" }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.opacity = "0.9"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = loading ? "0.7" : "1"; }}>
              {loading ? "Sending..." : "Request Private Consultation"}
            </button>
            <p style={{ fontFamily: "DM Sans", fontSize: "0.72rem", color: "rgba(255,251,240,0.35)", textAlign: "center" }}>
              By submitting you agree to be contacted by a Sitbo Invest advisor. No spam, ever.
            </p>
          </form>
        )}
      </div>
      </div>
    </section>
  );
}

// ─── History Timeline ─────────────────────────────────────────────────────────
function HistoryTimeline() {
  const milestones = [
    { year: "2019", text: "SITBO begins advisory work across Batumi's coastal corridor." },
    { year: "2022", text: "Off-market pipeline expands — Gonio, Chakvi, Makhinjauri." },
    { year: "2024", text: "Tbilisi entries added for clients seeking dual-city portfolios." },
    { year: "2026", text: "Full turnkey + residency pathway under one mandate." },
  ];

  const cities = [
    {
      name: "Batumi",
      tag: "Black Sea · Yield Core",
      image: "/lifestyle-coast.png",
      blurb: "Seafront liquidity, short-term rental demand, and infrastructure still compressing the discount.",
    },
    {
      name: "Tbilisi",
      tag: "Capital · Long Hold",
      image: "/hisni-by-biograpi.jpg",
      blurb: "Capital-city depth for investors balancing coastal yield with urban appreciation.",
    },
  ];

  return (
    <section
      id="history-timeline"
      className="scroll-mt-24"
      style={{ background: "#21141A", padding: "clamp(64px, 10vw, 120px) 0" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 clamp(20px, 4vw, 64px)" }}>
        <div className="reveal" style={{ marginBottom: "clamp(36px, 6vw, 64px)", maxWidth: 640 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 1, background: "#8CB2C0" }} />
            <span style={{ fontFamily: "Manrope, sans-serif", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(250,247,240,0.5)" }}>
              History Timeline
            </span>
          </div>
          <h2 style={{ fontFamily: "Jun, Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.4rem)", fontWeight: 400, color: "#FAF7F0", lineHeight: 1.15, margin: "0 0 16px" }}>
            Two cities.<br />One investment map.
          </h2>
          <p style={{ fontFamily: "Manrope, sans-serif", fontSize: "0.95rem", color: "rgba(250,247,240,0.55)", lineHeight: 1.7, margin: 0 }}>
            From Batumi&apos;s coastal yield to Tbilisi&apos;s capital depth — the milestones that shaped how SITBO places capital.
          </p>
        </div>

        <div
          className="reveal"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: 16,
            marginBottom: "clamp(40px, 7vw, 72px)",
          }}
        >
          {cities.map((city) => (
            <article
              key={city.name}
              style={{
                position: "relative",
                borderRadius: 14,
                overflow: "hidden",
                minHeight: 280,
                border: "1px solid rgba(250,247,240,0.1)",
              }}
            >
              <img
                src={city.image}
                alt={city.name}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.62)" }}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  height: "100%",
                  minHeight: 280,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: 24,
                  background: "linear-gradient(to top, rgba(20,14,18,0.88) 0%, rgba(20,14,18,0.15) 65%, transparent 100%)",
                }}
              >
                <span style={{ fontFamily: "Manrope, sans-serif", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#8CB2C0", marginBottom: 8 }}>
                  {city.tag}
                </span>
                <h3 style={{ fontFamily: "Jun, Georgia, serif", fontSize: "clamp(1.8rem, 4vw, 2.4rem)", fontWeight: 400, color: "#FAF7F0", margin: "0 0 10px" }}>
                  {city.name}
                </h3>
                <p style={{ fontFamily: "Manrope, sans-serif", fontSize: "0.88rem", color: "rgba(250,247,240,0.7)", lineHeight: 1.6, margin: 0 }}>
                  {city.blurb}
                </p>
              </div>
            </article>
          ))}
        </div>

        <ol
          className="reveal"
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "grid",
            gap: 0,
            borderTop: "1px solid rgba(250,247,240,0.1)",
          }}
        >
          {milestones.map((m) => (
            <li
              key={m.year}
              style={{
                display: "grid",
                gridTemplateColumns: "88px 1fr",
                gap: 16,
                padding: "20px 0",
                borderBottom: "1px solid rgba(250,247,240,0.08)",
                alignItems: "start",
              }}
            >
              <span style={{ fontFamily: "Jun, Georgia, serif", fontSize: "1.25rem", color: "#8CB2C0" }}>{m.year}</span>
              <span style={{ fontFamily: "Manrope, sans-serif", fontSize: "0.92rem", color: "rgba(250,247,240,0.72)", lineHeight: 1.6 }}>{m.text}</span>
            </li>
          ))}
        </ol>
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
      <Philosophy />
      <HistoryTimeline />
      <Analytics />
      <Lifestyle />
      <Portfolio />
      <DiscoveryTour />
      <Payment />
      <Reviews />
      <Partners />
      <Contact />
      <Footer />
      <SocialProofToast />
    </div>
  );
}

// ─── Social Proof Toast ───────────────────────────────────────────────────────
type SocialProofMsg =
  | { kind: "activity"; line: string }
  | { kind: "consultation"; at: Date };

function formatTimeAgo(date: Date, refMs = Date.now()): string {
  const diff = refMs - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`;
  return "This week";
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
          background: "#8CB2C0",
          animation: "sitboPulse 2s ease-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "#8CB2C0",
        }}
      />
    </div>
  );
}

function SocialProofToast() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [msg, setMsg] = useState<SocialProofMsg>({ kind: "activity", line: "" });
  const [now, setNow] = useState(() => new Date());
  const [isNarrow, setIsNarrow] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 640 : false
  );

  const viewers = () => Math.floor(Math.random() * 10) + 3;

  const toasts: (() => SocialProofMsg)[] = [
    () => ({ kind: "activity", line: `${viewers()} people are viewing this right now` }),
    () => ({ kind: "activity", line: `${viewers()} investors are browsing properties` }),
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

  const timeAgo = msg.kind === "consultation" ? formatTimeAgo(msg.at, now.getTime()) : null;

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
        border: "1px solid rgba(140, 178, 192, 0.2)",
        borderRadius: 999,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.24)",
        fontFamily: "Manrope, sans-serif",
        fontSize: isNarrow ? 11 : 12,
        fontWeight: 400,
        letterSpacing: "0.04em",
        color: "#FAF7F0",
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
              color: "#FAF7F0",
              letterSpacing: "0.02em",
            }}
          >
            Last consultation request
          </span>
          <span
            style={{
              fontSize: isNarrow ? 9 : 10,
              fontWeight: 400,
              color: "#FAF7F0",
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
            color: "#FAF7F0",
            letterSpacing: "0.02em",
            lineHeight: 1.3,
          }}
        >
          {msg.line}
        </span>
      )}
    </div>
  );
}



export default Index;
