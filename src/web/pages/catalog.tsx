import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { projects, type Project } from "../data/projects";
import { localizeProjects } from "../data/projects-locale";
import { useRates } from "../context/RatesContext";
import { useLocale } from "../context/LocaleContext";
import { useT, type MessageKey } from "../i18n";
import { RequestModal } from "../components/RequestModal";
import { AppLink } from "../components/app-link";
import { trackEvent } from "../lib/analytics";

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

const CHECKLIST_ITEMS: MessageKey[] = [
  "catalog.checklist.i1",
  "catalog.checklist.i2",
  "catalog.checklist.i3",
  "catalog.checklist.i4",
  "catalog.checklist.i5",
  "catalog.checklist.i6",
  "catalog.checklist.i7",
  "catalog.checklist.i8",
  "catalog.checklist.i9",
  "catalog.checklist.i10",
];

/** Ownership, land, contract terms, independent advice — indices in CHECKLIST_ITEMS */
const CRITICAL_INDEXES = new Set([0, 1, 4, 9]);

type RiskLevel = "high" | "review" | "ready";

function resolveRiskLevel(checked: boolean[]): RiskLevel {
  const done = checked.filter(Boolean).length;
  let level: RiskLevel = done <= 4 ? "high" : done <= 7 ? "review" : "ready";
  const criticalMissing = [...CRITICAL_INDEXES].some((i) => !checked[i]);
  if (criticalMissing && level === "ready") level = "review";
  return level;
}

function DepositChecklist() {
  const t = useT();
  const isMobile = useIsMobile();
  const [checked, setChecked] = useState<boolean[]>(() => CHECKLIST_ITEMS.map(() => false));
  const done = checked.filter(Boolean).length;
  const total = CHECKLIST_ITEMS.length;
  const level = resolveRiskLevel(checked);

  const result = {
    high: {
      badge: "catalog.checklist.high.badge" as MessageKey,
      title: "catalog.checklist.high.title" as MessageKey,
      body: "catalog.checklist.high.body" as MessageKey,
      cta: "catalog.checklist.high.cta" as MessageKey,
    },
    review: {
      badge: "catalog.checklist.review.badge" as MessageKey,
      title: "catalog.checklist.review.title" as MessageKey,
      body: "catalog.checklist.review.body" as MessageKey,
      cta: "catalog.checklist.review.cta" as MessageKey,
    },
    ready: {
      badge: "catalog.checklist.ready.badge" as MessageKey,
      title: "catalog.checklist.ready.title" as MessageKey,
      body: "catalog.checklist.ready.body" as MessageKey,
      cta: "catalog.checklist.ready.cta" as MessageKey,
    },
  }[level];

  const badgeStyle =
    level === "high"
      ? { border: "1px solid rgba(255,254,249,.35)", color: "rgba(255,254,249,.92)", background: "rgba(255,254,249,.06)" }
      : level === "review"
        ? { border: "1px solid rgba(140,178,192,.45)", color: "#C9DCE4", background: "rgba(140,178,192,.1)" }
        : { border: "1px solid rgba(72,103,77,.55)", color: "#C8D6C9", background: "rgba(72,103,77,.18)" };

  const toggle = (index: number) => {
    setChecked((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  return (
    <section
      aria-labelledby="deposit-checklist-title"
      style={{
        padding: "0 0 clamp(48px, 6vw, 80px)",
        background: C.light,
      }}
    >
      <Container>
        <div
          style={{
            borderRadius: 2,
            background: C.dark,
            color: C.light,
            padding: isMobile ? "28px 20px" : "clamp(36px, 4vw, 56px)",
            border: "1px solid rgba(255,254,249,.08)",
          }}
        >
          <h2
            id="deposit-checklist-title"
            style={{
              fontFamily: "JUN, Georgia, serif",
              fontWeight: 600,
              fontSize: "clamp(26px, 3.2vw, 40px)",
              lineHeight: 1.15,
              margin: "0 0 12px",
              maxWidth: 760,
            }}
          >
            {t("catalog.checklist.title")}
          </h2>
          <p
            style={{
              margin: "0 0 28px",
              maxWidth: 680,
              fontFamily: "Nunito, sans-serif",
              fontSize: "clamp(14px, 1.2vw, 16px)",
              lineHeight: 1.5,
              color: "rgba(255,254,249,.78)",
            }}
          >
            {t("catalog.checklist.subtitle")}
          </p>

          <div
            role="group"
            aria-label={t("catalog.checklist.title")}
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: isMobile ? 10 : "10px 28px",
              marginBottom: 28,
            }}
          >
            {CHECKLIST_ITEMS.map((key, index) => {
              const on = checked[index];
              const id = `deposit-check-${index}`;
              return (
                <label
                  key={key}
                  htmlFor={id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    textAlign: "left",
                    padding: "12px 14px",
                    borderRadius: 2,
                    border: `1px solid ${on ? "rgba(255,254,249,.45)" : "rgba(255,254,249,.16)"}`,
                    background: on ? "rgba(255,254,249,.08)" : "transparent",
                    color: C.light,
                    cursor: "pointer",
                    fontFamily: "Nunito, sans-serif",
                    fontSize: 15,
                    lineHeight: 1.4,
                  }}
                >
                  <input
                    id={id}
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle(index)}
                    style={{
                      position: "absolute",
                      opacity: 0,
                      width: 1,
                      height: 1,
                      pointerEvents: "none",
                    }}
                  />
                  <span
                    aria-hidden
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 2,
                      flexShrink: 0,
                      marginTop: 1,
                      border: `1.5px solid ${on ? C.light : "rgba(255,254,249,.45)"}`,
                      background: on ? C.light : "transparent",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: C.dark,
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {on ? "✓" : ""}
                  </span>
                  <span>{t(key)}</span>
                </label>
              );
            })}
          </div>

          <div
            style={{
              borderRadius: 2,
              border: "1px solid rgba(255,254,249,.14)",
              background: "rgba(255,254,249,.04)",
              padding: isMobile ? "20px 16px" : "24px 28px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  fontFamily: "Nunito, sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  color: "rgba(255,254,249,.75)",
                }}
              >
                {t("catalog.checklist.progress", { done, total })}
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontFamily: "Nunito, sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  ...badgeStyle,
                }}
              >
                {t(result.badge)}
              </span>
            </div>

            <h3
              style={{
                fontFamily: "JUN, Georgia, serif",
                fontWeight: 600,
                fontSize: "clamp(20px, 2.2vw, 28px)",
                lineHeight: 1.2,
                margin: "0 0 12px",
                maxWidth: 720,
              }}
            >
              {t(result.title)}
            </h3>
            <p
              style={{
                margin: "0 0 20px",
                maxWidth: 720,
                fontFamily: "Nunito, sans-serif",
                fontSize: "clamp(14px, 1.2vw, 16px)",
                lineHeight: 1.55,
                color: "rgba(255,254,249,.82)",
              }}
            >
              {t(result.body)}
            </p>

            <AppLink
              href="/#consultation"
              className="cat-checklist-cta"
              onNavigate={() =>
                trackEvent("deposit_check_deep_dive_click", {
                  risk_level: level,
                  checks_completed: done,
                })
              }
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Nunito, sans-serif",
                fontSize: 15,
                fontWeight: 500,
                padding: "15px 28px",
                borderRadius: 2,
                border: "none",
                cursor: "pointer",
                background: C.light,
                color: C.dark,
                textDecoration: "none",
              }}
            >
              {t(result.cta)}
            </AppLink>

            <p
              style={{
                margin: "16px 0 0",
                fontFamily: "Nunito, sans-serif",
                fontSize: 12,
                lineHeight: 1.45,
                color: "rgba(255,254,249,.55)",
                maxWidth: 640,
              }}
            >
              {t("catalog.checklist.disclaimer")}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

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
              <h3 style={{ fontFamily: "JUN, Georgia, serif", fontSize: "1.3rem", fontWeight: 500, color: C.light, margin: 0, lineHeight: 1.2 }}>{p.name}</h3>
            </div>
          </div>

          {/* Info strip */}
          <div style={{ background: C.light, padding: "16px 16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px", marginBottom: "12px" }}>
              <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.2rem", fontWeight: 700, color: C.dark, margin: 0, lineHeight: 1 }}>{priceLabel}</p>
              <span style={{ flexShrink: 0, fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", color: C.muted }}>
                {p.completion}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.75rem", color: C.muted, margin: 0, lineHeight: 1.5, flex: 1, paddingRight: "12px" }}>
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
    fontFamily: "Nunito, sans-serif", fontSize: "0.82rem", color: C.dark,
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
              fontFamily: "JUN, Georgia, serif",
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
                fontFamily: "Nunito, sans-serif", fontSize: "0.75rem", fontWeight: 600,
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
                fontFamily: "Nunito, sans-serif",
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
              <h2 style={{ fontFamily: "JUN, Georgia, serif", fontSize: "2rem", fontWeight: 400, color: C.muted, marginBottom: "12px" }}>{t("catalog.emptyTitle")}</h2>
              <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.85rem", color: C.muted }}>{t("catalog.emptyBody")}</p>
              <button onClick={() => { setCity("All"); setTrophyOnly(false); setSearch(""); setSort("default"); }}
                style={{ marginTop: "20px", fontFamily: "Nunito, sans-serif", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, background: C.dark, border: "none", borderRadius: "2px", padding: "12px 28px", cursor: "pointer" }}>
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

      <DepositChecklist />

      {/* ── CTA (same as About / Services) ── */}
      <section className="cat-cta-outer">
        <style>{`
          .cat-cta-outer {
            max-width: var(--site-max, 1680px);
            margin: 0 auto;
            padding: 0 var(--site-gutter, clamp(16px, 2.8vw, 40px)) clamp(56px, 7vw, 100px);
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
            font-family: JUN, Georgia, serif;
            font-weight: 600;
            margin: 0 0 14px;
            font-size: clamp(28px, 3.6vw, 48px);
            line-height: 1.12;
            color: ${C.light};
          }
          .cat-cta p {
            margin: 0 auto 28px;
            max-width: 480px;
            font-family: Nunito, sans-serif;
            font-size: clamp(15px, 1.3vw, 17px);
            line-height: 1.5;
            color: ${C.light};
          }
          .cat-cta-btn {
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
          .cat-cta-btn:hover { opacity: .88; }
        `}</style>
        <div className="cat-cta">
          <h2>{t("services.cta.title")}</h2>
          <p>{t("services.cta.body")}</p>
          <button
            type="button"
            className="cat-cta-btn"
            onClick={() => setModalOpen(true)}
          >
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
