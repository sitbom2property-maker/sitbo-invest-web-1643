import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { projects, type Project } from "../data/projects";
import { localizeProjects } from "../data/projects-locale";
import { useRates } from "../context/RatesContext";
import { useLocale } from "../context/LocaleContext";
import { useT } from "../i18n";
import { RequestModal } from "../components/RequestModal";

const C = {
  dark:      "#21141A",
  teal:      "#703C54",
  wine:      "#703C54",
  light:     "#FFFEF9",
  parchment: "#FFFEF9",
  muted:     "rgba(33,20,26,0.55)",
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

// ─── Grid ─────────────────────────────────────────────────────────────────────
function Container({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div className="site-wrap" style={style}>{children}</div>;
}

// ─── Cities & filter types ────────────────────────────────────────────────────
const CITIES = ["All", "Batumi", "Tbilisi", "Chakvi", "Gonio", "Makhinjauri", "Shekvetili"] as const;

// ─── Card ─────────────────────────────────────────────────────────────────────
function CatalogCard({ p }: { p: Project }) {
  const [hovered, setHovered] = useState(false);
  const { formatFromUSD } = useRates();
  const t = useT();
  const priceLabel = formatFromUSD(p.priceUSD, { prefix: t("cta.from") });
  return (
    <Link href={`/project/${p.slug}`}>
      <a style={{ textDecoration: "none", display: "block" }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            borderRadius: "2px", overflow: "hidden", background: C.dark,
            boxShadow: hovered ? "0 12px 40px rgba(33,20,26,0.15)" : "0 2px 16px rgba(33,20,26,0.06)",
            transition: "box-shadow 0.3s, transform 0.3s",
            transform: hovered ? "translateY(-4px)" : "none",
            cursor: "pointer",
          }}
        >
          {/* Image */}
          <div style={{ position: "relative", height: "240px", overflow: "hidden", background: C.dark }}>
            {p.cardImage ? (
              <img src={p.cardImage} alt={p.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease", transform: hovered ? "scale(1.05)" : "scale(1)" }} />
            ) : null}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(33,20,26,0.7) 0%, transparent 55%)" }} />

            {/* Name over image */}
            <div style={{ position: "absolute", bottom: "14px", left: "14px", right: "14px" }}>
              <h3 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "1.3rem", fontWeight: 500, color: C.light, margin: 0, lineHeight: 1.2 }}>{p.name}</h3>
            </div>
          </div>

          {/* Info strip */}
          <div style={{ background: C.light, padding: "16px 16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px", marginBottom: "12px" }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "1.2rem", fontWeight: 700, color: C.dark, margin: 0, lineHeight: 1 }}>{priceLabel}</p>
              <span style={{ flexShrink: 0, fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: C.muted }}>
                {p.completion}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: C.muted, margin: 0, lineHeight: 1.5, flex: 1, paddingRight: "12px" }}>
                {p.desc.length > 80 ? p.desc.slice(0, 78) + "…" : p.desc}
              </p>
              <div style={{ flexShrink: 0, width: "32px", height: "32px", borderRadius: "50%", border: `1px solid rgba(33,20,26,0.15)`, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s, border-color 0.2s", background: hovered ? C.dark : "transparent", borderColor: hovered ? C.dark : "rgba(33,20,26,0.15)" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M6 2l4 4-4 4" stroke={hovered ? C.light : C.dark} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CatalogPage() {
  const isMobile = useIsMobile();
  const t = useT();
  const { language } = useLocale();
  const localizedProjects = useMemo(
    () => localizeProjects(projects, language),
    [language],
  );

  const [city, setCity]     = useState<typeof CITIES[number]>("All");
  const [trophyOnly, setTrophyOnly] = useState(false);
  const [sort, setSort]     = useState<string>("default");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const sortOptions = [
    { value: "default", label: t("catalog.sortDefault") },
    { value: "price-asc", label: t("catalog.sortPriceAsc") },
    { value: "price-desc", label: t("catalog.sortPriceDesc") },
    { value: "yield-desc", label: t("catalog.sortYield") },
  ];

  const cityLabels: Record<typeof CITIES[number], string> = {
    All: t("catalog.filterAll"),
    Batumi: t("catalog.city.batumi"),
    Tbilisi: t("catalog.city.tbilisi"),
    Chakvi: t("catalog.city.chakvi"),
    Gonio: t("catalog.city.gonio"),
    Makhinjauri: t("catalog.city.makhinjauri"),
    Shekvetili: t("catalog.city.shekvetili"),
  };

  // Scroll top on mount
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filtered = useMemo(() => {
    let list = [...localizedProjects];

    // City (canonical English keys on Project.city)
    if (city !== "All") list = list.filter(p => p.city === city);

    if (trophyOnly) list = list.filter(p => p.trophyProperty);

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sort === "price-asc")  list.sort((a, b) => a.priceUSD - b.priceUSD);
    if (sort === "price-desc") list.sort((a, b) => b.priceUSD - a.priceUSD);
    if (sort === "yield-desc") list.sort((a, b) => {
      const getMax = (s: string) => parseFloat(s.split("–")[1] ?? s) || 0;
      return getMax(b.yield) - getMax(a.yield);
    });

    return list;
  }, [city, trophyOnly, sort, search, localizedProjects]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: localizedProjects.length };
    localizedProjects.forEach(p => { map[p.city] = (map[p.city] || 0) + 1; });
    map.trophy = localizedProjects.filter(p => p.trophyProperty).length;
    return map;
  }, [localizedProjects]);

  const inputStyle: React.CSSProperties = {
    fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: C.dark,
    background: C.light, border: "1px solid rgba(33,20,26,0.12)",
    borderRadius: "2px", padding: "10px 14px", outline: "none",
  };

  return (
    <div style={{ background: C.light, minHeight: "100vh" }}>
      {/* ── HERO ── */}
      <section style={{ background: C.dark, width: "100%", padding: "clamp(80px,10vw,140px) 0" }}>
        <Container>
          <h1
            style={{
              fontFamily: "Coolvetica, Inter, sans-serif",
              fontSize: "clamp(1.35rem, 2.2vw, 1.9rem)",
              fontWeight: 400,
              color: C.light,
              lineHeight: 1.3,
              margin: "0 0 clamp(36px, 4vw, 56px)",
              maxWidth: "760px",
            }}
          >
            {t("catalog.titleLine1")}
            <br />
            {t("catalog.titleLine2")}
          </h1>

          {/* City tabs + trophy filter */}
          <div style={{ display: "flex", gap: "8px", marginTop: 0, flexWrap: "wrap", alignItems: "center" }}>
            {CITIES.map(c => (
              <button key={c} onClick={() => setCity(c)} style={{
                fontFamily: "Inter, sans-serif", fontSize: "0.75rem", fontWeight: 600,
                letterSpacing: "0.06em", textTransform: "uppercase",
                padding: "8px 18px", borderRadius: "2px", cursor: "pointer",
                border: `1px solid ${city === c ? C.teal : "rgba(255,254,249,0.15)"}`,
                background: city === c ? C.teal : "transparent",
                color: C.light,
                transition: "all 0.2s",
              }}>
                {cityLabels[c]} {counts[c] ? <span style={{ fontWeight: 400 }}>({counts[c]})</span> : ""}
              </button>
            ))}
            <span
              aria-hidden
              style={{
                width: 1,
                height: 22,
                background: "rgba(255,254,249,0.2)",
                margin: "0 4px",
                flexShrink: 0,
              }}
            />
            <button
              type="button"
              onClick={() => setTrophyOnly(v => !v)}
              aria-pressed={trophyOnly}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "8px 18px",
                borderRadius: "2px",
                cursor: "pointer",
                border: `1px solid ${trophyOnly ? C.light : "rgba(255,254,249,0.15)"}`,
                background: trophyOnly ? C.light : "transparent",
                color: trophyOnly ? C.dark : C.light,
                transition: "all 0.2s",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M7 4h10v3a5 5 0 0 1-4 4.9V15h3v2H8v-2h3v-3.1A5 5 0 0 1 7 7V4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M7 5H4v1a3 3 0 0 0 3 3M17 5h3v1a3 3 0 0 1-3 3M8 19h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              {t("catalog.trophyProperty")}
              {counts.trophy ? <span style={{ fontWeight: 400 }}>({counts.trophy})</span> : null}
            </button>
          </div>
        </Container>
      </section>

      {/* ── FILTER BAR ── */}
      <div style={{ background: C.light, borderBottom: "1px solid rgba(33,20,26,0.07)", position: "sticky", top: "80px", zIndex: 40 }}>
        <Container style={{ paddingTop: "14px", paddingBottom: "14px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>

            {/* Search */}
            <div style={{ position: "relative", flex: "1 1 220px" }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <circle cx="6.5" cy="6.5" r="5" stroke={C.muted} strokeWidth="1.4"/>
                <path d="M10 10l3.5 3.5" stroke={C.muted} strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <input
                type="text" placeholder={t("catalog.searchPlaceholder")}
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ ...inputStyle, paddingLeft: "34px", width: "100%", boxSizing: "border-box" }}
              />
            </div>

            {/* Sort */}
            <select value={sort} onChange={e => setSort(e.target.value)}
              style={{ ...inputStyle, cursor: "pointer", flex: "0 0 auto" }}>
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </Container>
      </div>

      {/* ── GRID ── */}
      <section style={{ padding: "48px 0 96px" }}>
        <Container>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "96px 24px" }}>
              <h2 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "2rem", fontWeight: 400, color: C.muted, marginBottom: "12px" }}>{t("catalog.emptyTitle")}</h2>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: C.muted }}>{t("catalog.emptyBody")}</p>
              <button onClick={() => { setCity("All"); setTrophyOnly(false); setSearch(""); setSort("default"); }}
                style={{ marginTop: "20px", fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, background: C.dark, border: "none", borderRadius: "2px", padding: "12px 28px", cursor: "pointer" }}>
                {t("cta.resetFilters")}
              </button>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: "24px",
            }}>
              {filtered.map(p => <CatalogCard key={p.slug} p={p} />)}
            </div>
          )}
        </Container>
      </section>

      {/* ── CTA (same as About / Services) ── */}
      <section className="cat-cta-outer">
        <style>{`
          .cat-cta-outer {
            max-width: var(--site-max, 1440px);
            margin: 0 auto;
            padding: 0 var(--site-gutter, clamp(30px, 5.5vw, 80px)) clamp(56px, 7vw, 100px);
            box-sizing: border-box;
            background: ${C.light};
          }
          .cat-cta {
            border-radius: 2px;
            overflow: hidden;
            background:
              radial-gradient(100% 140% at 90% 50%, rgba(112,60,84,.55) 0%, rgba(33,20,26,0) 55%),
              #412834;
            padding: clamp(40px, 5vw, 72px) clamp(24px, 4vw, 64px);
            text-align: center;
            color: ${C.light};
          }
          .cat-cta h2 {
            font-family: Coolvetica, Inter, sans-serif;
            font-weight: 600;
            margin: 0 0 14px;
            font-size: clamp(28px, 3.6vw, 48px);
            line-height: 1.12;
            color: ${C.light};
          }
          .cat-cta p {
            margin: 0 auto 28px;
            max-width: 480px;
            font-family: Inter, sans-serif;
            font-size: clamp(15px, 1.3vw, 17px);
            line-height: 1.5;
            color: ${C.light};
          }
          .cat-cta-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-family: Inter, sans-serif;
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
          .cat-cta-btn:hover { opacity: .88; }
        `}</style>
        <div className="cat-cta">
          <h2>{t("services.cta.title")}</h2>
          <p>{t("services.cta.body")}</p>
          <button type="button" className="cat-cta-btn" onClick={() => setModalOpen(true)}>
            {t("services.cta.button")}
          </button>
        </div>
      </section>

      <RequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        source="Catalog page"
        title={t("services.cta.button")}
      />
    </div>
  );
}
