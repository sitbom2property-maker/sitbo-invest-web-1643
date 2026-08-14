import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { projects, type Project } from "../data/projects";
import { localizeCityLabel, localizeProjects } from "../data/projects-locale";
import { useRates } from "../context/RatesContext";
import { useLocale } from "../context/LocaleContext";
import { useT } from "../i18n";

const C = {
  dark:      "#21141A",
  teal:      "#8CB2C0",
  wine:      "#683D47",
  light:     "#FFFBF0",
  parchment: "#FFFBF0",
  muted:     "#7a7a7a",
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
const CITIES = ["All", "Batumi", "Tbilisi", "Chakvi / Gonio", "Makhinjauri"] as const;

// ─── Card ─────────────────────────────────────────────────────────────────────
function CatalogCard({ p }: { p: Project }) {
  const [hovered, setHovered] = useState(false);
  const { formatFromUSD } = useRates();
  const { language } = useLocale();
  const t = useT();
  const priceLabel = formatFromUSD(p.priceUSD, { prefix: t("cta.from") });
  return (
    <Link href={`/project/${p.slug}`}>
      <a style={{ textDecoration: "none", display: "block" }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            borderRadius: "14px", overflow: "hidden", background: C.dark,
            boxShadow: hovered ? "0 12px 40px rgba(33,20,26,0.15)" : "0 2px 16px rgba(33,20,26,0.06)",
            transition: "box-shadow 0.3s, transform 0.3s",
            transform: hovered ? "translateY(-4px)" : "none",
            cursor: "pointer",
          }}
        >
          {/* Image */}
          <div style={{ position: "relative", height: "240px", overflow: "hidden" }}>
            <img src={p.cardImage} alt={p.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease", transform: hovered ? "scale(1.05)" : "scale(1)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(33,20,26,0.7) 0%, transparent 55%)" }} />

            {/* City badge */}
            <div style={{ position: "absolute", top: "12px", left: "12px", background: "rgba(33,20,26,0.65)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,251,240,0.15)", borderRadius: "5px", padding: "3px 10px", fontFamily: "DM Sans", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,251,240,0.8)" }}>
              {localizeCityLabel(p.city, language)}
            </div>

            {/* ROI badge */}
            <div style={{ position: "absolute", top: "12px", right: "12px", background: C.light, borderRadius: "5px", padding: "3px 10px", fontFamily: "DM Sans", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.06em", color: C.dark }}>
              {p.yield} {t("catalog.roi")}
            </div>

            {/* Name over image */}
            <div style={{ position: "absolute", bottom: "14px", left: "14px", right: "14px" }}>
              <p style={{ fontFamily: "DM Sans", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,251,240,0.55)", marginBottom: "4px" }}>{p.tag}</p>
              <h3 style={{ fontFamily: "Jun, serif", fontSize: "1.3rem", fontWeight: 500, color: C.light, margin: 0, lineHeight: 1.2 }}>{p.name}</h3>
            </div>
          </div>

          {/* Info strip */}
          <div style={{ background: C.light, padding: "16px 16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "12px" }}>
              <div>
                <p style={{ fontFamily: "Jun, serif", fontSize: "1.2rem", fontWeight: 700, color: C.dark, margin: 0, lineHeight: 1 }}>{priceLabel}</p>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.65rem", color: C.muted, margin: "3px 0 0" }}>{p.area} · {p.completion}</p>
              </div>
              <div style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "5px" }}>
                <svg width="11" height="13" viewBox="0 0 12 14" fill="none"><path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5c-.83 0-1.5-.67-1.5-1.5S5.17 3.5 6 3.5 7.5 4.17 7.5 5 6.83 6.5 6 6.5z" fill={C.muted}/></svg>
                <span style={{ fontFamily: "DM Sans", fontSize: "0.72rem", color: C.muted }}>{p.seaDistance}</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontFamily: "DM Sans", fontSize: "0.75rem", color: C.muted, margin: 0, lineHeight: 1.5, flex: 1, paddingRight: "12px" }}>
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
  const [sort, setSort]     = useState<string>("default");
  const [search, setSearch] = useState("");
  const [showBookCall, setShowBookCall] = useState(false);
  const [bookForm, setBookForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [bookLoading, setBookLoading] = useState(false);
  const [bookError, setBookError] = useState("");
  const [bookSent, setBookSent] = useState(false);

  const submitBookCall = async () => {
    setBookError("");
    if (!bookForm.name.trim() || (!bookForm.phone.trim() && !bookForm.email.trim())) {
      setBookError(t("home.contact.errorRequired"));
      return;
    }
    setBookLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bookForm.name.trim(),
          phone: bookForm.phone.trim(),
          email: bookForm.email.trim(),
          message: bookForm.message.trim(),
          source: "Catalog — Book a Call",
          page: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });
      if (res.ok) {
        setBookSent(true);
        setBookForm({ name: "", phone: "", email: "", message: "" });
        window.setTimeout(() => {
          setShowBookCall(false);
          setBookSent(false);
        }, 2000);
      } else {
        setBookError(t("home.contact.errorGeneric"));
      }
    } catch {
      setBookError(t("home.contact.errorNetwork"));
    } finally {
      setBookLoading(false);
    }
  };

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
    "Chakvi / Gonio": t("catalog.city.chakviGonio"),
    Makhinjauri: t("catalog.city.makhinjauri"),
  };

  // Scroll top on mount
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filtered = useMemo(() => {
    let list = [...localizedProjects];

    // City (canonical English keys on Project.city)
    if (city !== "All") list = list.filter(p => p.city === city);

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
  }, [city, sort, search, localizedProjects]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: localizedProjects.length };
    localizedProjects.forEach(p => { map[p.city] = (map[p.city] || 0) + 1; });
    return map;
  }, [localizedProjects]);

  const inputStyle: React.CSSProperties = {
    fontFamily: "DM Sans", fontSize: "0.82rem", color: C.dark,
    background: C.light, border: "1px solid rgba(33,20,26,0.12)",
    borderRadius: "8px", padding: "10px 14px", outline: "none",
  };

  return (
    <div style={{ background: C.light, minHeight: "100vh" }}>
      {/* ── HERO ── */}
      <section style={{ background: C.dark }}>
        <Container style={{ paddingTop: "56px", paddingBottom: "56px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ width: "24px", height: "1px", background: C.wine }} />
            <span style={{ fontFamily: "DM Sans", fontSize: "0.63rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,251,240,0.45)" }}>
              {t("catalog.eyebrow")}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
            <h1 style={{ fontFamily: "Jun, serif", fontSize: "clamp(2.4rem,5vw,4rem)", fontWeight: 400, color: C.light, lineHeight: 1.05, margin: 0 }}>
              {t("catalog.title")}
            </h1>
            <p style={{ fontFamily: "DM Sans", fontSize: "0.88rem", color: "rgba(255,251,240,0.5)", maxWidth: "420px", lineHeight: 1.7, margin: 0 }}>
              {localizedProjects.length} {t("catalog.subtitle")}
            </p>
          </div>

          {/* City tabs */}
          <div style={{ display: "flex", gap: "8px", marginTop: "40px", flexWrap: "wrap" }}>
            {CITIES.map(c => (
              <button key={c} onClick={() => setCity(c)} style={{
                fontFamily: "DM Sans", fontSize: "0.75rem", fontWeight: 600,
                letterSpacing: "0.06em", textTransform: "uppercase",
                padding: "8px 18px", borderRadius: "6px", cursor: "pointer",
                border: `1px solid ${city === c ? C.teal : "rgba(255,251,240,0.15)"}`,
                background: city === c ? C.teal : "transparent",
                color: city === c ? C.dark : "rgba(255,251,240,0.6)",
                transition: "all 0.2s",
              }}>
                {cityLabels[c]} {counts[c] ? <span style={{ opacity: 0.7, fontWeight: 400 }}>({counts[c]})</span> : ""}
              </button>
            ))}
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

            {/* Results count */}
            <span style={{ fontFamily: "DM Sans", fontSize: "0.78rem", color: C.muted, flexShrink: 0 }}>
              {filtered.length} {filtered.length === 1 ? t("catalog.projectSingular") : t("catalog.projectPlural")}
            </span>
          </div>
        </Container>
      </div>

      {/* ── GRID ── */}
      <section style={{ padding: "48px 0 96px" }}>
        <Container>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "96px 24px" }}>
              <p style={{ fontFamily: "Jun, serif", fontSize: "2rem", color: C.muted, marginBottom: "12px" }}>{t("catalog.emptyTitle")}</p>
              <p style={{ fontFamily: "DM Sans", fontSize: "0.85rem", color: C.muted }}>{t("catalog.emptyBody")}</p>
              <button onClick={() => { setCity("All"); setSearch(""); setSort("default"); }}
                style={{ marginTop: "20px", fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, background: C.dark, border: "none", borderRadius: "8px", padding: "12px 28px", cursor: "pointer" }}>
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

      {/* ── CTA ── */}
      <section style={{ background: C.dark, padding: "80px 0" }}>
        <Container>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "48px", alignItems: "center" }}>
            <div>
              <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 400, color: C.light, lineHeight: 1.15, marginBottom: "16px" }}>
                {t("catalog.cta.title")}
              </h2>
              <p style={{ fontFamily: "DM Sans", fontSize: "0.88rem", color: "rgba(255,251,240,0.5)", lineHeight: 1.7 }}>
                {t("catalog.cta.body")}
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button onClick={() => setShowBookCall(true)} style={{ display: "inline-block", fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark, background: C.teal, border: "none", borderRadius: "8px", padding: "15px 32px", cursor: "pointer", transition: "opacity 0.2s" }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                {t("catalog.cta.bookCall")}
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Book a Call popup */}
      {showBookCall && (
        <div onClick={() => setShowBookCall(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, backdropFilter: "blur(4px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ position: "relative", background: C.dark, borderRadius: "16px", padding: "40px", maxWidth: "480px", width: "90%", border: "1px solid rgba(140,178,192,0.2)" }}>
            <button onClick={() => setShowBookCall(false)} style={{ position: "absolute", top: "16px", right: "16px", width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,251,240,0.1)", border: "none", color: C.light, fontSize: "20px", cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,251,240,0.2)")} onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,251,240,0.1)")}>✕</button>
            <h2 style={{ fontFamily: "Jun, serif", fontSize: "1.8rem", fontWeight: 400, color: C.light, marginBottom: "8px" }}>{t("catalog.bookCall.title")}</h2>
            <p style={{ fontFamily: "DM Sans", fontSize: "0.83rem", color: "rgba(255,251,240,0.55)", marginBottom: "24px" }}>{t("catalog.bookCall.body")}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { key: "name", placeholder: t("catalog.bookCall.name"), type: "text" },
                { key: "phone", placeholder: t("catalog.bookCall.phone"), type: "tel" },
                { key: "email", placeholder: t("catalog.bookCall.email"), type: "email" },
              ].map(f => (
                <input key={f.key} type={f.type} placeholder={f.placeholder} value={(bookForm as any)[f.key]}
                  onChange={e => setBookForm({ ...bookForm, [f.key]: e.target.value })}
                  style={{ fontFamily: "DM Sans", fontSize: "0.88rem", background: "rgba(255,251,240,0.05)", border: "1px solid rgba(255,251,240,0.12)", borderRadius: "8px", color: C.light, padding: "12px 14px", outline: "none", transition: "border-color 0.2s" }}
                  onFocus={e => (e.target.style.borderColor = C.teal)} onBlur={e => (e.target.style.borderColor = "rgba(255,251,240,0.12)")} />
              ))}
              <textarea placeholder={t("catalog.bookCall.message")} value={bookForm.message} onChange={e => setBookForm({ ...bookForm, message: e.target.value })} rows={3}
                style={{ fontFamily: "DM Sans", fontSize: "0.88rem", background: "rgba(255,251,240,0.05)", border: "1px solid rgba(255,251,240,0.12)", borderRadius: "8px", color: C.light, padding: "12px 14px", outline: "none", resize: "none", transition: "border-color 0.2s" }}
                onFocus={e => (e.target.style.borderColor = C.teal)} onBlur={e => (e.target.style.borderColor = "rgba(255,251,240,0.12)")} />
              <button
                type="button"
                onClick={submitBookCall}
                disabled={bookLoading || bookSent}
                style={{ fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark, background: C.teal, border: "none", borderRadius: "8px", padding: "14px", cursor: bookLoading ? "wait" : "pointer", marginTop: "4px", transition: "opacity 0.2s", width: "100%", opacity: bookLoading ? 0.7 : 1 }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={e => (e.currentTarget.style.opacity = bookLoading ? "0.7" : "1")}
              >
                {bookSent ? t("home.contact.sentTitle") : bookLoading ? "…" : t("cta.sendRequest")}
              </button>
              {bookError ? (
                <p style={{ fontFamily: "DM Sans", fontSize: "0.78rem", color: "#e57373", margin: "8px 0 0", textAlign: "center" }}>{bookError}</p>
              ) : null}
              <p style={{ fontFamily: "DM Sans", fontSize: "0.75rem", color: "rgba(255,251,240,0.5)", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,251,240,0.1)", textAlign: "center" }}>
                {t("catalog.bookCall.direct")} <span style={{ color: C.teal, fontWeight: 600 }}>+995 555 50 52 88</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
