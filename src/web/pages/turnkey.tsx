import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Footer } from "../components/footer";

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  dark:  "#21141A",
  teal:  "#8CB2C0",
  wine:  "#683D47",
  light: "#FFFBF0",
  parch: "#F5F3ED",
  muted: "rgba(33,20,26,0.55)",
};

// ─── Nav (shared) ─────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = [
    { label: "Catalog",            href: "/catalog" },
    { label: "Services",           href: "/#about" },
    { label: "Turnkey Renovation", href: "/turnkey" },
    { label: "Invest",             href: "/invest" },
    { label: "Mortgage",           href: "/mortgage" },
    { label: "Discovery Tour",     href: "/#discovery-tour" },
  ];
  return (<>

    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, transition: "background 0.4s, box-shadow 0.4s", background: scrolled || menuOpen ? "rgba(33,20,26,0.97)" : "transparent", boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.18)" : "none", backdropFilter: scrolled || menuOpen ? "blur(12px)" : "none" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", height: "68px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/"><a style={{ textDecoration: "none" }}><img src="/logo-dark-bg.png" alt="SITBO" style={{ height: "18px", width: "auto" }} /></a></Link>
        <nav style={{ display: "flex", gap: "28px", alignItems: "center" }} className="nav-desktop">
          {links.map(l => (
            <Link key={l.label} href={l.href}><a style={{ fontFamily: "DM Sans", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#FFFBF0", textDecoration: "none", opacity: 0.75, transition: "opacity 0.2s" }} onMouseEnter={e => (e.currentTarget.style.opacity = "1")} onMouseLeave={e => (e.currentTarget.style.opacity = "0.75")}>{l.label}</a></Link>
          ))}
          <a href="#contact-form" style={{ fontFamily: "DM Sans", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark, background: C.teal, borderRadius: "6px", padding: "9px 20px", textDecoration: "none", transition: "opacity 0.3s" }}>Free Consultation</a>
        </nav>
        <button onClick={() => setMenuOpen(p => !p)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: "4px" }} className="nav-burger">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFBF0" strokeWidth="1.8" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </div>
          {menuOpen && (
        <div style={{ background: "rgba(33,20,26,0.98)", borderTop: "1px solid rgba(140,178,192,0.1)", padding: "20px 24px 28px" }}>
          {links.map(l => <Link key={l.label} href={l.href}><a onClick={() => setMenuOpen(false)} style={{ display: "block", fontFamily: "DM Sans", fontSize: "0.85rem", color: "#FFFBF0", textDecoration: "none", padding: "10px 0", borderBottom: "1px solid rgba(255,251,240,0.06)" }}>{l.label}</a></Link>)}
          <a href="#contact-form" onClick={() => setMenuOpen(false)} style={{ display: "block", marginTop: "16px", fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: C.dark, background: C.teal, borderRadius: "8px", padding: "13px 24px", textDecoration: "none", textAlign: "center" }}>Free Consultation</a>
        </div>
      )}
    </header>
  
  </>);
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (<>

    <section style={{ background: C.dark, minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", padding: "120px 10px 80px" }}>
{/* bg texture */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/turnkey-web.png)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.18 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(33,20,26,0.95) 40%, rgba(33,20,26,0.7))" }} />

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 2, width: "100%", display: "flex", alignItems: "center", gap: "64px" }}>

{/* Left: text */}
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
            <div style={{ width: "28px", height: "1px", background: C.wine }} />
            <span style={{ fontFamily: "DM Sans", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,251,240,0.5)" }}>Batumi · Georgia</span>
          </div>

          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2.8rem,5vw,5.5rem)", fontWeight: 400, color: C.light, lineHeight: 1.05, marginBottom: "28px" }}>
            Reality matches<br />
            <em style={{ fontStyle: "italic", color: C.teal }}>the render</em>
          </h1>

          <p style={{ fontFamily: "DM Sans", fontSize: "clamp(0.9rem,1.3vw,1.05rem)", color: "rgba(255,251,240,0.65)", lineHeight: 1.75, marginBottom: "52px" }}>
            We renovate for those who notice every millimetre. You don't need to mediate between the designer and the builder, or find someone to blame when the furniture doesn't fit the doorway. We take care of everything: from the first line on paper to selecting the textiles.
          </p>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <a href="#contact-form" style={{ fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark, background: C.teal, borderRadius: "8px", padding: "16px 36px", textDecoration: "none", transition: "opacity 0.2s" }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
              I'm Renovating For Myself
            </a>
            <a href="#contact-form" style={{ fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, background: "transparent", border: "1px solid rgba(255,251,240,0.25)", borderRadius: "8px", padding: "16px 36px", textDecoration: "none", transition: "border-color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.borderColor = C.teal)} onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,251,240,0.25)")}>
              I'm Renovating For Investment
            </a>
          </div>
        </div>

{/* Right: photo */}
        <div style={{ flex: "0 0 420px", maxWidth: "420px" }} className="hero-photo-col">
          <div style={{ borderRadius: "20px", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>
            <img src="/turnkey-hero-photo.png" alt="Turnkey renovation" style={{ width: "100%", display: "block", objectFit: "cover" }} />
          </div>
        </div>

      </div>
    </section>
  
  </>);
}

// ─── Two Columns ──────────────────────────────────────────────────────────────
function TwoColumns() {
  const cols = [
    {
      tag: "For Perfectionists",
      title: "A Home That Reflects Your Vision",
      text: "We translate your personal style into a living space of uncompromising quality. Our process is designed for those who appreciate fine details and a seamless, stress-free experience.",
      items: [
 { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>, label: "Bespoke Design", desc: "A unique project crafted around your lifestyle and aesthetic vision." },
 { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, label: "Master Craftsmanship", desc: "Meticulous attention to every seam, joint, and finish — no compromises." },
 { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, label: "Premium Materials", desc: "We source the best materials, including Italian tile and European fittings." },
      ],
      bg: C.light,
      dark: false,
    },
    {
      tag: "For Investors",
      title: "A Renovation That Delivers Profit",
      text: "We create high-demand, low-maintenance rental properties that maximize your ROI. Our process is optimized for speed, durability, and market appeal in Batumi.",
      items: [
 { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>, label: "ROI-Driven Design", desc: "A proven aesthetic that attracts premium short-term tenants in Batumi." },
 { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, label: "Speed to Market", desc: "Fast-track delivery to minimize vacancy and start earning rental income sooner." },
 { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>, label: "Durable & Low-Maintenance", desc: "Vandal-proof, wear-resistant materials designed for Batumi's humid climate." },
      ],
      bg: C.dark,
      dark: true,
    },
  ];

  return (<>

    <section style={{ background: C.dark, padding: "0 10px 10px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "10px" }}>
        {cols.map(col => (
          <div key={col.tag} style={{ background: col.bg, borderRadius: "16px", padding: "clamp(48px,5vw,72px) clamp(32px,4vw,56px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
              <div style={{ width: "24px", height: "1px", background: C.wine }} />
              <span style={{ fontFamily: "DM Sans", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: col.dark ? "rgba(255,251,240,0.45)" : C.muted }}>{col.tag}</span>
            </div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 400, color: col.dark ? C.light : C.dark, lineHeight: 1.15, marginBottom: "20px" }}>{col.title}</h2>
            <p style={{ fontFamily: "DM Sans", fontSize: "0.88rem", color: col.dark ? "rgba(255,251,240,0.55)" : "#666", lineHeight: 1.8, marginBottom: "40px" }}>{col.text}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {col.items.map(item => (
                <div key={item.label} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: col.dark ? "rgba(140,178,192,0.1)" : "rgba(140,178,192,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <p style={{ fontFamily: "DM Sans", fontWeight: 700, fontSize: "0.85rem", color: col.dark ? C.light : C.dark, margin: "0 0 5px" }}>{item.label}</p>
                    <p style={{ fontFamily: "DM Sans", fontSize: "0.8rem", color: col.dark ? "rgba(255,251,240,0.5)" : "#777", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "40px" }}>
              <a href="#contact-form" style={{ display: "inline-block", fontFamily: "DM Sans", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: col.dark ? C.dark : C.light, background: col.dark ? C.teal : C.dark, borderRadius: "8px", padding: "12px 28px", textDecoration: "none", transition: "opacity 0.2s" }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                {col.dark ? "Calculate My ROI" : "Discuss My Project"}
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  
  </>);
}

// ─── Design Rule ──────────────────────────────────────────────────────────────
function DesignRule() {
  return (<>

    <section style={{ background: C.dark, padding: "10px" }}>
      <div style={{ background: C.wine, borderRadius: "16px", padding: "clamp(60px,7vw,100px) clamp(32px,5vw,80px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: "clamp(80px,20vw,220px)", fontFamily: "Cormorant Garamond, serif", fontWeight: 700, color: "rgba(255,251,240,0.05)", lineHeight: 1, userSelect: "none", pointerEvents: "none", whiteSpace: "nowrap" }}>100%</div>
        <div style={{ position: "relative", zIndex: 1, maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "28px" }}>
            <div style={{ width: "28px", height: "1px", background: "rgba(255,251,240,0.3)" }} />
            <span style={{ fontFamily: "DM Sans", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,251,240,0.55)" }}>Our Cornerstone</span>
            <div style={{ width: "28px", height: "1px", background: "rgba(255,251,240,0.3)" }} />
          </div>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: C.light, lineHeight: 1.15, marginBottom: "28px" }}>
            Perfection is Planned.<br />
            <em style={{ fontStyle: "italic" }}>We Never Start Without a Design Project.</em>
          </h2>
          <p style={{ fontFamily: "DM Sans", fontSize: "0.9rem", color: "rgba(255,251,240,0.7)", lineHeight: 1.8, marginBottom: "12px" }}>
            A complete, client-approved design project is our blueprint for success and your ultimate guarantee. It allows us to provide a <strong style={{ color: C.light }}>100% fixed budget and a precise timeline</strong> before a single wall is touched.
          </p>
          <p style={{ fontFamily: "DM Sans", fontSize: "0.9rem", color: "rgba(255,251,240,0.7)", lineHeight: 1.8 }}>
            This eliminates unexpected costs, ensures every detail meets your expectations, and is the professional standard we proudly uphold on every project in Batumi.
          </p>
        </div>
      </div>
    </section>
  
  </>);
}

// ─── Calculator ───────────────────────────────────────────────────────────────
function Calculator() {
  const [area, setArea] = useState(60);
  const [condition, setCondition] = useState<"new" | "old">("new");
  const [goal, setGoal] = useState<"self" | "invest">("invest");
  const [finish, setFinish] = useState<"comfort" | "premium" | "luxe">("premium");
  const [shown, setShown] = useState(false);

  // price per sqm in USD
  const base: Record<string, Record<string, number>> = {
    self:   { comfort: 280, premium: 420, luxe: 680 },
    invest: { comfort: 200, premium: 300, luxe: 460 },
  };
  const condMult = condition === "old" ? 1.25 : 1;
  const pricePerSqm = base[goal][finish] * condMult;
  const low  = Math.round(pricePerSqm * area * 0.9 / 100) * 100;
  const high = Math.round(pricePerSqm * area * 1.1 / 100) * 100;

  const timelines: Record<string, Record<string, string>> = {
    self:   { comfort: "8–10 weeks", premium: "10–14 weeks", luxe: "14–20 weeks" },
    invest: { comfort: "5–7 weeks",  premium: "6–9 weeks",   luxe: "9–13 weeks"  },
  };
  const timeline = timelines[goal][finish];

  const Radio = ({ name, value, current, label, onChange }: { name: string; value: string; current: string; label: string; onChange: (v: string) => void }) => (
    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontFamily: "DM Sans", fontSize: "0.85rem", color: current === value ? C.dark : "#777", fontWeight: current === value ? 600 : 400, transition: "color 0.2s" }}>
      <span style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${current === value ? C.teal : "#ccc"}`, background: current === value ? C.teal : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
        {current === value && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.dark, display: "block" }} />}
      </span>
      <input type="radio" name={name} value={value} checked={current === value} onChange={() => onChange(value)} style={{ display: "none" }} />
{label}
    </label>
  );

  return (<>

    <section style={{ background: C.dark, padding: "10px" }}>
      <div style={{ background: C.parch, borderRadius: "16px", padding: "clamp(48px,6vw,80px) clamp(24px,4vw,64px)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <div style={{ width: "28px", height: "1px", background: C.wine }} />
            <span style={{ fontFamily: "DM Sans", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted }}>Cost Estimator</span>
          </div>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem,3.5vw,2.8rem)", fontWeight: 400, color: C.dark, lineHeight: 1.1, marginBottom: "10px" }}>
            Get a Preliminary Estimate
          </h2>
          <p style={{ fontFamily: "DM Sans", fontSize: "0.85rem", color: C.muted, lineHeight: 1.7, marginBottom: "40px" }}>
            A ballpark figure based on your inputs. The final fixed price is set by your approved design project.
          </p>

{/* Area slider */}
          <div style={{ marginBottom: "36px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontFamily: "DM Sans", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: C.dark }}>Property Area</span>
              <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.4rem", fontWeight: 700, color: C.dark }}>{area} m²</span>
            </div>
            <input type="range" min={25} max={200} value={area} onChange={e => setArea(+e.target.value)}
              style={{ width: "100%", accentColor: C.teal, height: "4px", cursor: "pointer" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
              <span style={{ fontFamily: "DM Sans", fontSize: "0.65rem", color: "#aaa" }}>25 m²</span>
              <span style={{ fontFamily: "DM Sans", fontSize: "0.65rem", color: "#aaa" }}>200 m²</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "32px", marginBottom: "36px" }}>
            <div>
              <p style={{ fontFamily: "DM Sans", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: C.dark, marginBottom: "14px" }}>Property Condition</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Radio name="cond" value="new" current={condition} label="New Build (White Frame)" onChange={v => setCondition(v as "new" | "old")} />
                <Radio name="cond" value="old" current={condition} label="Old Build / Full Gutting" onChange={v => setCondition(v as "new" | "old")} />
              </div>
            </div>
            <div>
              <p style={{ fontFamily: "DM Sans", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: C.dark, marginBottom: "14px" }}>My Goal</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Radio name="goal" value="invest" current={goal} label="For Investment (ROI)" onChange={v => setGoal(v as "self" | "invest")} />
                <Radio name="goal" value="self" current={goal} label="For Myself (Perfectionist)" onChange={v => setGoal(v as "self" | "invest")} />
              </div>
            </div>
            <div>
              <p style={{ fontFamily: "DM Sans", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: C.dark, marginBottom: "14px" }}>Finish Level</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Radio name="finish" value="comfort" current={finish} label="Comfort" onChange={v => setFinish(v as "comfort" | "premium" | "luxe")} />
                <Radio name="finish" value="premium" current={finish} label="Premium" onChange={v => setFinish(v as "comfort" | "premium" | "luxe")} />
                <Radio name="finish" value="luxe" current={finish} label="Luxe" onChange={v => setFinish(v as "comfort" | "premium" | "luxe")} />
              </div>
            </div>
          </div>

          <button onClick={() => setShown(true)} style={{ width: "100%", fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, background: C.dark, border: "none", borderRadius: "10px", padding: "16px", cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={e => (e.currentTarget.style.background = C.teal)} onMouseLeave={e => (e.currentTarget.style.background = C.dark)}>
            Calculate My Estimate
          </button>

          {shown && (
            <div style={{ marginTop: "28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ background: C.dark, borderRadius: "12px", padding: "28px 24px", textAlign: "center" }}>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,251,240,0.45)", marginBottom: "10px" }}>Estimated Cost Range</p>
                <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2rem", fontWeight: 700, color: C.light, margin: 0 }}>
                  ${low.toLocaleString()} – ${high.toLocaleString()}
                </p>
              </div>
              <div style={{ background: C.wine, borderRadius: "12px", padding: "28px 24px", textAlign: "center" }}>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,251,240,0.45)", marginBottom: "10px" }}>Estimated Timeline</p>
                <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2rem", fontWeight: 700, color: C.light, margin: 0 }}>{timeline}</p>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <a href="#contact-form" style={{ display: "block", textAlign: "center", fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark, background: C.teal, borderRadius: "10px", padding: "16px", textDecoration: "none", transition: "opacity 0.2s" }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                  Book a Free Consultation for a Detailed Quote
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  
  </>);
}

// ─── Remote Process ───────────────────────────────────────────────────────────
function RemoteProcess() {
  const steps = [
 { n: "01", title: "Dedicated Manager", desc: "One point of contact, available 24/7 in your preferred messenger — WhatsApp, Telegram, or email." },
 { n: "02", title: "Weekly Video Reports", desc: "Detailed video walkthroughs every week so you see everything as if you were standing on-site." },
 { n: "03", title: "24/7 Project Portal", desc: "Real-time access to all documents, floor plans, photos, and financial reports in one place." },
 { n: "04", title: "Live Video Calls", desc: "Schedule a live call from your property at any time. Inspect the work yourself, remotely." },
  ];
  return (<>

    <section style={{ background: C.dark, padding: "10px" }}>
      <div style={{ background: C.light, borderRadius: "16px", padding: "clamp(60px,7vw,100px) clamp(24px,4vw,64px)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{ width: "28px", height: "1px", background: C.wine }} />
              <span style={{ fontFamily: "DM Sans", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted }}>Remote Management</span>
              <div style={{ width: "28px", height: "1px", background: C.wine }} />
            </div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: C.dark, lineHeight: 1.1 }}>
              Your Renovation, Under Your Control.<br />
              <em style={{ fontStyle: "italic", color: C.teal }}>From Anywhere.</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2px", borderRadius: "12px", overflow: "hidden" }}>
            {steps.map((s, i) => (
              <div key={s.n} style={{ background: i % 2 === 0 ? C.parch : "#ede9e0", padding: "40px 32px" }}>
                <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2.8rem", fontWeight: 700, color: "rgba(33,20,26,0.1)", margin: "0 0 20px", lineHeight: 1 }}>{s.n}</p>
                <p style={{ fontFamily: "DM Sans", fontWeight: 700, fontSize: "0.88rem", color: C.dark, margin: "0 0 10px" }}>{s.title}</p>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.82rem", color: "#777", lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  
  </>);
}

// ─── Portfolio ────────────────────────────────────────────────────────────────
function Portfolio() {
  const [filter, setFilter] = useState<"all" | "life" | "invest">("all");
  const projects = [
 { type: "invest", img: "/p1.jpg", title: "Studio, Batumi Centre", tags: ["48 Days", "$18,000", "+70% Rental Income", "ROI: 2.1 yrs"] },
 { type: "life",   img: "/p2.jpg", title: "2BR Sea View Penthouse", tags: ["Bespoke Kitchen", "Italian Tile", "Sea View"] },
 { type: "invest", img: "/p3.jpg", title: "1BR Near Boulevard", tags: ["38 Days", "$14,500", "+65% Rental Income", "ROI: 2.4 yrs"] },
 { type: "life",   img: "/p4.jpg", title: "Designer Loft, Orbi City", tags: ["Custom Millwork", "Marble Surfaces", "Full Fit-Out"] },
 { type: "invest", img: "/p5.jpg", title: "Studio, Technika", tags: ["52 Days", "$20,000", "+80% Rental Income", "ROI: 1.9 yrs"] },
 { type: "life",   img: "/p6.jpg", title: "3BR Family Residence", tags: ["Author Supervision", "Premium Materials", "6 Month Project"] },
  ];
  const visible = projects.filter(p => filter === "all" || p.type === filter);
  const placeholderColors = ["#8CB2C0","#683D47","#A8C5D0","#8B5E67","#6FA3B5","#7A4E57"];

  return (<>

    <section style={{ background: C.dark, padding: "10px" }}>
      <div style={{ background: C.dark, borderRadius: "16px", padding: "clamp(60px,7vw,100px) clamp(24px,4vw,64px)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "24px", marginBottom: "48px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ width: "28px", height: "1px", background: C.wine }} />
                <span style={{ fontFamily: "DM Sans", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,251,240,0.45)" }}>Our Work</span>
              </div>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: C.light, lineHeight: 1.1 }}>
                Proof of <em style={{ fontStyle: "italic", color: C.teal }}>Perfection</em>
              </h2>
            </div>
            <div style={{ display: "flex", gap: "8px", background: "rgba(255,251,240,0.06)", borderRadius: "10px", padding: "4px" }}>
{([["all","All Projects"],["life","For Life"],["invest","For Investment"]] as const).map(([val, label]) => (
                <button key={val} onClick={() => setFilter(val)} style={{ fontFamily: "DM Sans", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", border: "none", borderRadius: "7px", padding: "9px 18px", cursor: "pointer", transition: "all 0.2s", background: filter === val ? C.teal : "transparent", color: filter === val ? C.dark : "rgba(255,251,240,0.55)" }}>
{label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
            {visible.map((p, i) => (
              <div key={p.title} style={{ borderRadius: "12px", overflow: "hidden", background: placeholderColors[i % placeholderColors.length] + "33", border: "1px solid rgba(255,251,240,0.06)" }}>
                <div style={{ height: "220px", background: placeholderColors[i % placeholderColors.length] + "44", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,251,240,0.25)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <div style={{ padding: "24px" }}>
                  <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem", fontWeight: 500, color: C.light, margin: "0 0 14px" }}>{p.title}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {p.tags.map(tag => (
                      <span key={tag} style={{ fontFamily: "DM Sans", fontSize: "0.62rem", letterSpacing: "0.08em", textTransform: "uppercase", color: p.type === "invest" ? C.teal : "rgba(255,251,240,0.6)", background: p.type === "invest" ? "rgba(140,178,192,0.12)" : "rgba(255,251,240,0.06)", borderRadius: "4px", padding: "4px 8px" }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  
  </>);
}

// ─── Guarantees ───────────────────────────────────────────────────────────────
function Guarantees() {
  return (<>

    <section style={{ background: C.dark, padding: "10px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "10px" }}>
        <div style={{ background: C.parch, borderRadius: "16px", padding: "clamp(48px,5vw,64px) clamp(32px,4vw,48px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <div style={{ width: "24px", height: "1px", background: C.wine }} />
            <span style={{ fontFamily: "DM Sans", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted }}>For Perfectionists</span>
          </div>
          <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(1.6rem,2.5vw,2.2rem)", fontWeight: 400, color: C.dark, lineHeight: 1.2, marginBottom: "20px" }}>
            We Guarantee Your <em style={{ fontStyle: "italic", color: C.wine }}>Aesthetic Satisfaction</em>
          </h3>
          <p style={{ fontFamily: "DM Sans", fontSize: "0.88rem", color: "#666", lineHeight: 1.8 }}>
            We don't just guarantee the work — we guarantee your satisfaction with the result. If a seam doesn't feel perfect to you, we'll redo it. That's our commitment to craftsmanship.
          </p>
        </div>
        <div style={{ background: C.dark, border: "1px solid rgba(140,178,192,0.15)", borderRadius: "16px", padding: "clamp(48px,5vw,64px) clamp(32px,4vw,48px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            <div style={{ width: "24px", height: "1px", background: C.wine }} />
            <span style={{ fontFamily: "DM Sans", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,251,240,0.45)" }}>For Investors</span>
          </div>
          <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(1.6rem,2.5vw,2.2rem)", fontWeight: 400, color: C.light, lineHeight: 1.2, marginBottom: "20px" }}>
            Fixed Budget. Fixed Timeline. <em style={{ fontStyle: "italic", color: C.teal }}>In the Contract.</em>
          </h3>
          <p style={{ fontFamily: "DM Sans", fontSize: "0.88rem", color: "rgba(255,251,240,0.55)", lineHeight: 1.8 }}>
            We put it in writing: penalties for every day of delay, a budget that will never grow by a dollar. Your investment has a predictable return from day one.
          </p>
        </div>
      </div>
    </section>
  
  </>);
}

// ─── Market Stats ─────────────────────────────────────────────────────────────
function MarketStats() {
  return (<>

    <section style={{ background: C.dark, padding: "80px 10px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
          <div style={{ width: "28px", height: "1px", background: C.wine }} />
          <span style={{ fontFamily: "DM Sans", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,251,240,0.5)" }}>Market Opportunity</span>
        </div>
        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: C.light, lineHeight: 1.1, marginBottom: "60px", maxWidth: "700px" }}>
          Why Batumi <em style={{ fontStyle: "italic", color: C.teal }}>Works</em> for Renovation & Rental
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
{/* Stat 1: Tourism Growth */}
          <div>
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2.8rem", fontWeight: 700, color: C.teal, margin: "0" }}>9,4M</p>
              <p style={{ fontFamily: "DM Sans", fontSize: "0.8rem", color: "rgba(255,251,240,0.6)", margin: "6px 0 0", letterSpacing: "0.08em", textTransform: "uppercase" }}>Annual Tourists (2025)</p>
            </div>
            <p style={{ fontFamily: "DM Sans", fontSize: "0.9rem", color: "rgba(255,251,240,0.65)", lineHeight: 1.7, margin: 0 }}>
              Unprecedented growth in Georgia's tourism sector creates sustained demand for short-term rental accommodations.
            </p>
          </div>

{/* Stat 2: Nightly Rates */}
          <div>
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2.8rem", fontWeight: 700, color: C.teal, margin: "0" }}>$60–$100</p>
              <p style={{ fontFamily: "DM Sans", fontSize: "0.8rem", color: "rgba(255,251,240,0.6)", margin: "6px 0 0", letterSpacing: "0.08em", textTransform: "uppercase" }}>Peak Season (May–Oct)</p>
            </div>
            <p style={{ fontFamily: "DM Sans", fontSize: "0.9rem", color: "rgba(255,251,240,0.65)", lineHeight: 1.7, margin: 0 }}>
              Premium daily rates for well-positioned, tastefully renovated apartments. Winter rates from $50/night provide year-round income.
            </p>
          </div>

{/* Stat 3: Payback Period */}
          <div>
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2.8rem", fontWeight: 700, color: C.teal, margin: "0" }}>11</p>
              <p style={{ fontFamily: "DM Sans", fontSize: "0.8rem", color: "rgba(255,251,240,0.6)", margin: "6px 0 0", letterSpacing: "0.08em", textTransform: "uppercase" }}>Avg. Payback Period</p>
            </div>
            <p style={{ fontFamily: "DM Sans", fontSize: "0.9rem", color: "rgba(255,251,240,0.65)", lineHeight: 1.7, margin: 0 }}>
              Batumi properties achieve investment payback in ~11 years — one of the fastest in the Black Sea region.
            </p>
          </div>

{/* Stat 4: Price Appreciation */}
          <div>
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2.8rem", fontWeight: 700, color: C.teal, margin: "0" }}>+70%</p>
              <p style={{ fontFamily: "DM Sans", fontSize: "0.8rem", color: "rgba(255,251,240,0.6)", margin: "6px 0 0", letterSpacing: "0.08em", textTransform: "uppercase" }}>Value Growth by Completion</p>
            </div>
            <p style={{ fontFamily: "DM Sans", fontSize: "0.9rem", color: "rgba(255,251,240,0.65)", lineHeight: 1.7, margin: 0 }}>
              Properties purchased pre-completion typically appreciate 70–100% by project handover due to rising market demand.
            </p>
          </div>

{/* Stat 5: Market Price */}
          <div>
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2.8rem", fontWeight: 700, color: C.teal, margin: "0" }}>$1,850</p>
              <p style={{ fontFamily: "DM Sans", fontSize: "0.8rem", color: "rgba(255,251,240,0.6)", margin: "6px 0 0", letterSpacing: "0.08em", textTransform: "uppercase" }}>Per m² (2025–2026)</p>
            </div>
            <p style={{ fontFamily: "DM Sans", fontSize: "0.9rem", color: "rgba(255,251,240,0.65)", lineHeight: 1.7, margin: 0 }}>
              Competitive pricing for premium locations. Entry-level projects available from $1,250/m². Room for upside.
            </p>
          </div>

{/* Stat 6: Institutional Confidence */}
          <div>
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2.8rem", fontWeight: 700, color: C.teal, margin: "0" }}>✓</p>
              <p style={{ fontFamily: "DM Sans", fontSize: "0.8rem", color: "rgba(255,251,240,0.6)", margin: "6px 0 0", letterSpacing: "0.08em", textTransform: "uppercase" }}>Primary Market Data</p>
            </div>
            <p style={{ fontFamily: "DM Sans", fontSize: "0.9rem", color: "rgba(255,251,240,0.65)", lineHeight: 1.7, margin: 0 }}>
              Statistics sourced from Geostat, TBC Capital, Colliers, and Airbnb/Booking data. Transparent, market-driven.
            </p>
          </div>
        </div>
      </div>
    </section>
  
  </>);
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
function ContactForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [goal, setGoal] = useState("invest");
  const [desc, setDesc] = useState("");
  const [sent, setSent] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(255,251,240,0.06)", border: "1px solid rgba(255,251,240,0.12)",
    borderRadius: "8px", padding: "14px 16px", color: C.light, fontFamily: "DM Sans",
    fontSize: "0.88rem", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "DM Sans", fontSize: "0.65rem", letterSpacing: "0.14em",
    textTransform: "uppercase", color: "rgba(255,251,240,0.45)", marginBottom: "8px",
  };

  return (<>

    <section id="contact-form" style={{ background: C.dark, padding: "10px 10px 0" }}>
      <div style={{ background: C.dark, borderRadius: "16px 16px 0 0", padding: "clamp(60px,8vw,120px) clamp(24px,4vw,64px)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{ width: "28px", height: "1px", background: C.wine }} />
              <span style={{ fontFamily: "DM Sans", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,251,240,0.45)" }}>Free Consultation</span>
              <div style={{ width: "28px", height: "1px", background: C.wine }} />
            </div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: C.light, lineHeight: 1.1, marginBottom: "16px" }}>
              Ready to Create an Exceptional Space <em style={{ fontStyle: "italic", color: C.teal }}>in Batumi?</em>
            </h2>
            <p style={{ fontFamily: "DM Sans", fontSize: "0.88rem", color: "rgba(255,251,240,0.5)", lineHeight: 1.75 }}>
              Let's discuss your project. No obligation. Arthur will personally respond within 24 hours.
            </p>
          </div>

          {sent ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "20px" }}><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.8rem", color: C.light, marginBottom: "10px" }}>Message Received</p>
              <p style={{ fontFamily: "DM Sans", fontSize: "0.85rem", color: "rgba(255,251,240,0.5)" }}>Arthur will be in touch within 24 hours.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>Your Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Arthur" style={inputStyle} onFocus={e => (e.target.style.borderColor = C.teal)} onBlur={e => (e.target.style.borderColor = "rgba(255,251,240,0.12)")} />
                </div>
                <div>
                  <label style={labelStyle}>Phone or Email</label>
                  <input value={contact} onChange={e => setContact(e.target.value)} placeholder="+995 ..." style={inputStyle} onFocus={e => (e.target.style.borderColor = C.teal)} onBlur={e => (e.target.style.borderColor = "rgba(255,251,240,0.12)")} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>My Project Is</label>
                <select value={goal} onChange={e => setGoal(e.target.value)} style={{ ...inputStyle, appearance: "none" as "none" }}>
                  <option value="invest">For Investment (Rental Income / Resale)</option>
                  <option value="self">For Myself (Perfectionist Finish)</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Briefly Describe Your Property (Optional)</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="e.g. 55 m², white frame, Orbi City, 12th floor..." rows={4} style={{ ...inputStyle, resize: "vertical" }} onFocus={e => (e.target.style.borderColor = C.teal)} onBlur={e => (e.target.style.borderColor = "rgba(255,251,240,0.12)")} />
              </div>
              <button onClick={() => setSent(true)} style={{ fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark, background: C.teal, border: "none", borderRadius: "10px", padding: "18px", cursor: "pointer", transition: "opacity 0.2s" }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                Request My Free Consultation
              </button>
            </div>
          )}

{/* Contact details */}
          <div style={{ marginTop: "48px", paddingTop: "40px", borderTop: "1px solid rgba(140,178,192,0.1)", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "32px" }}>
            <a href="https://wa.me/995591800800" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "DM Sans", fontSize: "0.8rem", color: "rgba(255,251,240,0.5)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = C.teal)} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,251,240,0.5)")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            <a href="mailto:sitboinvest@gmail.com" style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "DM Sans", fontSize: "0.8rem", color: "rgba(255,251,240,0.5)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = C.teal)} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,251,240,0.5)")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              sitboinvest@gmail.com
            </a>
            <span style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "DM Sans", fontSize: "0.8rem", color: "rgba(255,251,240,0.5)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              Batumi, Georgia
            </span>
          </div>
        </div>
      </div>
    </section>
  
  </>);
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TurnkeyPage() {
  return (<>

    <div style={{ minHeight: "100vh", background: C.dark }}>
      <Nav />
      <Hero />
      <TwoColumns />
      <DesignRule />
      <Calculator />
      <RemoteProcess />
      <Portfolio />
      <Guarantees />
      <MarketStats />
      <ContactForm />
      <Footer />
    </div>
  
  </>);
}
