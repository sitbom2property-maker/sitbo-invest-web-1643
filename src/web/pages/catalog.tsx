import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { projects, type Project } from "../data/projects";
import { Footer } from "../components/footer";

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
  return <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(24px, 4vw, 64px)", ...style }}>{children}</div>;
}

// ─── Cities & filter types ────────────────────────────────────────────────────
const CITIES = ["All", "Batumi", "Tbilisi", "Chakvi / Gonio", "Makhinjauri"] as const;
const SORT_OPTIONS = [
  { value: "default",    label: "Default" },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "yield-desc", label: "Yield: Highest first" },
] as const;

// ─── Card ─────────────────────────────────────────────────────────────────────
function CatalogCard({ p }: { p: Project }) {
  const [hovered, setHovered] = useState(false);
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
              {p.city}
            </div>

            {/* ROI badge */}
            <div style={{ position: "absolute", top: "12px", right: "12px", background: C.light, borderRadius: "5px", padding: "3px 10px", fontFamily: "DM Sans", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.06em", color: C.dark }}>
              {p.yield} ROI
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
                <p style={{ fontFamily: "Jun, serif", fontSize: "1.2rem", fontWeight: 700, color: C.dark, margin: 0, lineHeight: 1 }}>{p.priceFrom}</p>
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

  const [city, setCity]     = useState<typeof CITIES[number]>("All");
  const [sort, setSort]     = useState<string>("default");
  const [search, setSearch] = useState("");
  const [showBookCall, setShowBookCall] = useState(false);
  const [bookForm, setBookForm] = useState({ name: "", phone: "", email: "", message: "" });

  // Scroll top on mount
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filtered = useMemo(() => {
    let list = [...projects];

    // City
    if (city !== "All") list = list.filter(p => p.city === city);

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
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
  }, [city, sort, search]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: projects.length };
    projects.forEach(p => { map[p.city] = (map[p.city] || 0) + 1; });
    return map;
  }, []);

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
              Georgia Real Estate
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
            <h1 style={{ fontFamily: "Jun, serif", fontSize: "clamp(2.4rem,5vw,4rem)", fontWeight: 400, color: C.light, lineHeight: 1.05, margin: 0 }}>
              Property Catalog
            </h1>
            <p style={{ fontFamily: "DM Sans", fontSize: "0.88rem", color: "rgba(255,251,240,0.5)", maxWidth: "420px", lineHeight: 1.7, margin: 0 }}>
              {projects.length} curated projects across Batumi, Chakvi, Gonio and beyond — filtered and verified by SITBO.
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
                {c} {counts[c] ? <span style={{ opacity: 0.7, fontWeight: 400 }}>({counts[c]})</span> : ""}
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
                type="text" placeholder="Search by name, area, city…"
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ ...inputStyle, paddingLeft: "34px", width: "100%", boxSizing: "border-box" }}
              />
            </div>

            {/* Sort */}
            <select value={sort} onChange={e => setSort(e.target.value)}
              style={{ ...inputStyle, cursor: "pointer", flex: "0 0 auto" }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* Results count */}
            <span style={{ fontFamily: "DM Sans", fontSize: "0.78rem", color: C.muted, flexShrink: 0 }}>
              {filtered.length} {filtered.length === 1 ? "project" : "projects"}
            </span>
          </div>
        </Container>
      </div>

      {/* ── GRID ── */}
      <section style={{ padding: "48px 0 96px" }}>
        <Container>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "96px 24px" }}>
              <p style={{ fontFamily: "Jun, serif", fontSize: "2rem", color: C.muted, marginBottom: "12px" }}>No projects found</p>
              <p style={{ fontFamily: "DM Sans", fontSize: "0.85rem", color: C.muted }}>Try adjusting your filters</p>
              <button onClick={() => { setCity("All"); setSearch(""); setSort("default"); }}
                style={{ marginTop: "20px", fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, background: C.dark, border: "none", borderRadius: "8px", padding: "12px 28px", cursor: "pointer" }}>
                Reset filters
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
                Don't see what<br />you're looking for?
              </h2>
              <p style={{ fontFamily: "DM Sans", fontSize: "0.88rem", color: "rgba(255,251,240,0.5)", lineHeight: 1.7 }}>
                We work with off-market inventory not listed publicly. Tell us your budget and preferences — we'll find the right match.
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button onClick={() => setShowBookCall(true)} style={{ display: "inline-block", fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark, background: C.teal, border: "none", borderRadius: "8px", padding: "15px 32px", cursor: "pointer", transition: "opacity 0.2s" }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                Book a Call
              </button>
            </div>
          </div>
        </Container>
      </section>
      <Footer />

      {/* Book a Call popup */}
      {showBookCall && (
        <div onClick={() => setShowBookCall(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, backdropFilter: "blur(4px)" }}>
          <div onClick={e => e.stopPropagation()} style={{ position: "relative", background: C.dark, borderRadius: "16px", padding: "40px", maxWidth: "480px", width: "90%", border: "1px solid rgba(140,178,192,0.2)" }}>
            <button onClick={() => setShowBookCall(false)} style={{ position: "absolute", top: "16px", right: "16px", width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,251,240,0.1)", border: "none", color: C.light, fontSize: "20px", cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,251,240,0.2)")} onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,251,240,0.1)")}>✕</button>
            <h2 style={{ fontFamily: "Jun, serif", fontSize: "1.8rem", fontWeight: 400, color: C.light, marginBottom: "8px" }}>Book a Call</h2>
            <p style={{ fontFamily: "DM Sans", fontSize: "0.83rem", color: "rgba(255,251,240,0.55)", marginBottom: "24px" }}>Leave your details and we'll reach out to schedule a convenient time.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { key: "name", placeholder: "Your Name", type: "text" },
                { key: "phone", placeholder: "Phone Number", type: "tel" },
                { key: "email", placeholder: "Email Address", type: "email" },
              ].map(f => (
                <input key={f.key} type={f.type} placeholder={f.placeholder} value={(bookForm as any)[f.key]}
                  onChange={e => setBookForm({ ...bookForm, [f.key]: e.target.value })}
                  style={{ fontFamily: "DM Sans", fontSize: "0.88rem", background: "rgba(255,251,240,0.05)", border: "1px solid rgba(255,251,240,0.12)", borderRadius: "8px", color: C.light, padding: "12px 14px", outline: "none", transition: "border-color 0.2s" }}
                  onFocus={e => (e.target.style.borderColor = C.teal)} onBlur={e => (e.target.style.borderColor = "rgba(255,251,240,0.12)")} />
              ))}
              <textarea placeholder="Your request (optional)" value={bookForm.message} onChange={e => setBookForm({ ...bookForm, message: e.target.value })} rows={3}
                style={{ fontFamily: "DM Sans", fontSize: "0.88rem", background: "rgba(255,251,240,0.05)", border: "1px solid rgba(255,251,240,0.12)", borderRadius: "8px", color: C.light, padding: "12px 14px", outline: "none", resize: "none", transition: "border-color 0.2s" }}
                onFocus={e => (e.target.style.borderColor = C.teal)} onBlur={e => (e.target.style.borderColor = "rgba(255,251,240,0.12)")} />
              <button onClick={() => { setShowBookCall(false); setBookForm({ name: "", phone: "", email: "", message: "" }); }}
                style={{ fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark, background: C.teal, border: "none", borderRadius: "8px", padding: "14px", cursor: "pointer", marginTop: "4px", transition: "opacity 0.2s", width: "100%" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                Send Request
              </button>
              <p style={{ fontFamily: "DM Sans", fontSize: "0.75rem", color: "rgba(255,251,240,0.5)", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,251,240,0.1)", textAlign: "center" }}>
                Contact us directly at: <span style={{ color: C.teal, fontWeight: 600 }}>+995 555 50 52 88</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
