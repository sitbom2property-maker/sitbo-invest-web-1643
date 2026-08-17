import { useState, type CSSProperties } from "react";
import { useT, type MessageKey } from "../i18n";

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  dark:  "#21141A",
  teal:  "#703C54",
  wine:  "#703C54",
  light: "#FFFEF9",
  parch: "#FFFEF9",
  muted: "rgba(33,20,26,0.55)",
};

type RenovationGoal = "self" | "invest";
type FinishLevel = "comfort" | "premium" | "luxe";

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const t = useT();

  return (<>

    <section style={{ background: C.dark, minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", padding: "120px 0 80px" }}>
{/* bg texture */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/home/turnkey-web.png)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.18 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(33,20,26,0.95) 40%, rgba(33,20,26,0.7))" }} />

      <div style={{ maxWidth: "var(--site-max)", margin: "0 auto", padding: "0 var(--site-gutter)", position: "relative", zIndex: 2, width: "100%", display: "flex", alignItems: "center", gap: "64px" }}>

{/* Left: text */}
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <h1 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "clamp(2.8rem,5vw,5.5rem)", fontWeight: 400, color: C.light, lineHeight: 1.05, marginBottom: "28px" }}>
            {t("turnkey.hero.title")}<br />
            <em style={{ fontStyle: "italic", color: C.teal }}>{t("turnkey.hero.titleEm")}</em>
          </h1>

          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(0.9rem,1.3vw,1.05rem)", color: "rgba(255,254,249,0.65)", lineHeight: 1.75, marginBottom: "52px" }}>
            {t("turnkey.hero.body")}
          </p>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <a href="#contact-form" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, background: C.teal, borderRadius: "8px", padding: "16px 36px", textDecoration: "none", transition: "opacity 0.2s" }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
              {t("turnkey.hero.ctaSelf")}
            </a>
            <a href="#contact-form" style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, background: "transparent", border: "1px solid rgba(255,254,249,0.25)", borderRadius: "8px", padding: "16px 36px", textDecoration: "none", transition: "border-color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.borderColor = C.teal)} onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,254,249,0.25)")}>
              {t("turnkey.hero.ctaInvest")}
            </a>
          </div>
        </div>

{/* Right: photo */}
        <div style={{ flex: "0 0 420px", maxWidth: "420px" }} className="hero-photo-col">
          <div style={{ borderRadius: "20px", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}>
            <img src="/home/turnkey-hero-photo.png" alt={t("turnkey.hero.title")} style={{ width: "100%", display: "block", objectFit: "cover" }} />
          </div>
        </div>

      </div>
    </section>
  
  </>);
}

// ─── Two Columns ──────────────────────────────────────────────────────────────
function TwoColumns() {
  const t = useT();
  const cols = [
    {
      tag: t("turnkey.forSelf.eyebrow"),
      title: t("turnkey.forSelf.title"),
      text: t("turnkey.forSelf.body"),
      items: [
 { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>, label: t("turnkey.forSelf.item1.label"), desc: t("turnkey.forSelf.item1.desc") },
 { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, label: t("turnkey.forSelf.item2.label"), desc: t("turnkey.forSelf.item2.desc") },
 { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, label: t("turnkey.forSelf.item3.label"), desc: t("turnkey.forSelf.item3.desc") },
      ],
      bg: C.light,
      dark: false,
    },
    {
      tag: t("turnkey.forInvestors.eyebrow"),
      title: t("turnkey.forInvestors.title"),
      text: t("turnkey.forInvestors.body"),
      items: [
 { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>, label: t("turnkey.forInvestors.item1.label"), desc: t("turnkey.forInvestors.item1.desc") },
 { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, label: t("turnkey.forInvestors.item2.label"), desc: t("turnkey.forInvestors.item2.desc") },
 { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>, label: t("turnkey.forInvestors.item3.label"), desc: t("turnkey.forInvestors.item3.desc") },
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
            <h2 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 400, color: col.dark ? C.light : C.dark, lineHeight: 1.15, marginBottom: "20px" }}>{col.title}</h2>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", color: col.dark ? "rgba(255,254,249,0.55)" : "rgba(33,20,26,0.55)", lineHeight: 1.8, marginBottom: "40px" }}>{col.text}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {col.items.map(item => (
                <div key={item.label} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: col.dark ? "rgba(140,178,192,0.1)" : "rgba(140,178,192,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.85rem", color: col.dark ? C.light : C.dark, margin: "0 0 5px" }}>{item.label}</p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: col.dark ? "rgba(255,254,249,0.5)" : "rgba(33,20,26,0.5)", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "40px" }}>
              <a href="#contact-form" style={{ display: "inline-block", fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, background: col.dark ? C.teal : C.dark, borderRadius: "8px", padding: "12px 28px", textDecoration: "none", transition: "opacity 0.2s" }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                {col.dark ? t("turnkey.cta.calculateRoi") : t("turnkey.cta.discussProject")}
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
  const t = useT();

  return (<>

    <section style={{ background: C.dark, padding: "10px" }}>
      <div style={{ background: C.wine, borderRadius: "16px", padding: "clamp(60px,7vw,100px) clamp(32px,5vw,80px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: "clamp(80px,20vw,220px)", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "rgba(255,254,249,0.05)", lineHeight: 1, userSelect: "none", pointerEvents: "none", whiteSpace: "nowrap" }}>100%</div>
        <div style={{ position: "relative", zIndex: 1, maxWidth: "720px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: C.light, lineHeight: 1.15, marginBottom: "28px" }}>
            {t("turnkey.design.title")}<br />
            <em style={{ fontStyle: "italic" }}>{t("turnkey.design.titleEm")}</em>
          </h2>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "rgba(255,254,249,0.7)", lineHeight: 1.8, marginBottom: "12px" }}>
            {t("turnkey.design.body1")}
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "rgba(255,254,249,0.7)", lineHeight: 1.8 }}>
            {t("turnkey.design.body2")}
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
  const [goal, setGoal] = useState<RenovationGoal>("invest");
  const [finish, setFinish] = useState<FinishLevel>("premium");
  const [shown, setShown] = useState(false);
  const t = useT();

  // price per sqm in USD
  const base: Record<string, Record<string, number>> = {
    self:   { comfort: 280, premium: 420, luxe: 680 },
    invest: { comfort: 200, premium: 300, luxe: 460 },
  };
  const condMult = condition === "old" ? 1.25 : 1;
  const pricePerSqm = base[goal][finish] * condMult;
  const low  = Math.round(pricePerSqm * area * 0.9 / 100) * 100;
  const high = Math.round(pricePerSqm * area * 1.1 / 100) * 100;

  const timelines: Record<RenovationGoal, Record<FinishLevel, MessageKey>> = {
    self: {
      comfort: "turnkey.calculator.timeline.self.comfort",
      premium: "turnkey.calculator.timeline.self.premium",
      luxe: "turnkey.calculator.timeline.self.luxe",
    },
    invest: {
      comfort: "turnkey.calculator.timeline.invest.comfort",
      premium: "turnkey.calculator.timeline.invest.premium",
      luxe: "turnkey.calculator.timeline.invest.luxe",
    },
  };
  const timeline = t(timelines[goal][finish]);

  const Radio = ({ name, value, current, label, onChange }: { name: string; value: string; current: string; label: string; onChange: (v: string) => void }) => (
    <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: current === value ? C.dark : "rgba(33,20,26,0.5)", fontWeight: current === value ? 600 : 400, transition: "color 0.2s" }}>
      <span style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${current === value ? C.teal : "rgba(33,20,26,0.25)"}`, background: current === value ? C.teal : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
        {current === value && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.dark, display: "block" }} />}
      </span>
      <input type="radio" name={name} value={value} checked={current === value} onChange={() => onChange(value)} style={{ display: "none" }} />
{label}
    </label>
  );

  return (<>

    <section style={{ background: C.dark, padding: "10px" }}>
      <div style={{ background: C.light, borderRadius: "16px", padding: "clamp(48px,6vw,80px) clamp(24px,4vw,64px)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "clamp(2rem,3.5vw,2.8rem)", fontWeight: 400, color: C.dark, lineHeight: 1.1, marginBottom: "10px" }}>
            {t("turnkey.calculator.title")}
          </h2>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: C.muted, lineHeight: 1.7, marginBottom: "40px" }}>
            {t("turnkey.calculator.body")}
          </p>

{/* Area slider */}
          <div style={{ marginBottom: "36px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: C.dark }}>{t("turnkey.calculator.area")}</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "1.4rem", fontWeight: 700, color: C.dark }}>{area} m²</span>
            </div>
            <input type="range" min={25} max={200} value={area} onChange={e => setArea(+e.target.value)}
              style={{ width: "100%", accentColor: C.teal, height: "4px", cursor: "pointer" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.65rem", color: "rgba(33,20,26,0.4)" }}>25 m²</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.65rem", color: "rgba(33,20,26,0.4)" }}>200 m²</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "32px", marginBottom: "36px" }}>
            <div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: C.dark, marginBottom: "14px" }}>{t("turnkey.calculator.condition")}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Radio name="cond" value="new" current={condition} label={t("turnkey.calculator.newBuild")} onChange={v => setCondition(v as "new" | "old")} />
                <Radio name="cond" value="old" current={condition} label={t("turnkey.calculator.oldBuild")} onChange={v => setCondition(v as "new" | "old")} />
              </div>
            </div>
            <div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: C.dark, marginBottom: "14px" }}>{t("turnkey.calculator.goal")}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Radio name="goal" value="invest" current={goal} label={t("turnkey.calculator.goalInvest")} onChange={v => setGoal(v as RenovationGoal)} />
                <Radio name="goal" value="self" current={goal} label={t("turnkey.calculator.goalSelf")} onChange={v => setGoal(v as RenovationGoal)} />
              </div>
            </div>
            <div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: C.dark, marginBottom: "14px" }}>{t("turnkey.calculator.finish")}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Radio name="finish" value="comfort" current={finish} label={t("turnkey.calculator.comfort")} onChange={v => setFinish(v as FinishLevel)} />
                <Radio name="finish" value="premium" current={finish} label={t("turnkey.calculator.premium")} onChange={v => setFinish(v as FinishLevel)} />
                <Radio name="finish" value="luxe" current={finish} label={t("turnkey.calculator.luxe")} onChange={v => setFinish(v as FinishLevel)} />
              </div>
            </div>
          </div>

          <button onClick={() => setShown(true)} style={{ width: "100%", fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, background: C.dark, border: "none", borderRadius: "10px", padding: "16px", cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={e => (e.currentTarget.style.background = C.teal)} onMouseLeave={e => (e.currentTarget.style.background = C.dark)}>
            {t("turnkey.calculator.calculate")}
          </button>

          {shown && (
            <div style={{ marginTop: "28px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={{ background: C.dark, borderRadius: "12px", padding: "28px 24px", textAlign: "center" }}>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,254,249,0.45)", marginBottom: "10px" }}>{t("turnkey.calculator.costRange")}</p>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "2rem", fontWeight: 700, color: C.light, margin: 0 }}>
                  ${low.toLocaleString()} – ${high.toLocaleString()}
                </p>
              </div>
              <div style={{ background: C.wine, borderRadius: "12px", padding: "28px 24px", textAlign: "center" }}>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,254,249,0.45)", marginBottom: "10px" }}>{t("turnkey.calculator.timeline")}</p>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "2rem", fontWeight: 700, color: C.light, margin: 0 }}>{timeline}</p>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <a href="#contact-form" style={{ display: "block", textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, background: C.teal, borderRadius: "10px", padding: "16px", textDecoration: "none", transition: "opacity 0.2s" }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                  {t("turnkey.calculator.detailedQuote")}
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
  const t = useT();
  const steps = [
 { n: "01", title: t("turnkey.remote.step1.title"), desc: t("turnkey.remote.step1.desc") },
 { n: "02", title: t("turnkey.remote.step2.title"), desc: t("turnkey.remote.step2.desc") },
 { n: "03", title: t("turnkey.remote.step3.title"), desc: t("turnkey.remote.step3.desc") },
 { n: "04", title: t("turnkey.remote.step4.title"), desc: t("turnkey.remote.step4.desc") },
  ];
  return (<>

    <section style={{ background: C.dark, padding: "10px" }}>
      <div style={{ background: C.light, borderRadius: "16px", padding: "clamp(60px,7vw,100px) clamp(24px,4vw,64px)" }}>
        <div style={{ maxWidth: "var(--site-max)", margin: "0 auto", padding: "0 var(--site-gutter)" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <h2 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: C.dark, lineHeight: 1.1 }}>
              {t("turnkey.remote.title")}<br />
              <em style={{ fontStyle: "italic", color: C.teal }}>{t("turnkey.remote.titleEm")}</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2px", borderRadius: "12px", overflow: "hidden" }}>
            {steps.map((s, i) => (
              <div key={s.n} style={{ background: i % 2 === 0 ? C.parch : "#FFFEF9", padding: "40px 32px" }}>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "2.8rem", fontWeight: 700, color: "rgba(33,20,26,0.1)", margin: "0 0 20px", lineHeight: 1 }}>{s.n}</p>
                <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "0.88rem", color: C.dark, margin: "0 0 10px" }}>{s.title}</p>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: "rgba(33,20,26,0.5)", lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
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
  const t = useT();
  const projects = [
 { type: "invest", img: "/p1.jpg", title: t("turnkey.portfolio.project1.title"), tags: [t("turnkey.portfolio.project1.tag1"), t("turnkey.portfolio.project1.tag2"), t("turnkey.portfolio.project1.tag3"), t("turnkey.portfolio.project1.tag4")] },
 { type: "life",   img: "/p2.jpg", title: t("turnkey.portfolio.project2.title"), tags: [t("turnkey.portfolio.project2.tag1"), t("turnkey.portfolio.project2.tag2"), t("turnkey.portfolio.project2.tag3")] },
 { type: "invest", img: "/p3.jpg", title: t("turnkey.portfolio.project3.title"), tags: [t("turnkey.portfolio.project3.tag1"), t("turnkey.portfolio.project3.tag2"), t("turnkey.portfolio.project3.tag3"), t("turnkey.portfolio.project3.tag4")] },
 { type: "life",   img: "/p4.jpg", title: t("turnkey.portfolio.project4.title"), tags: [t("turnkey.portfolio.project4.tag1"), t("turnkey.portfolio.project4.tag2"), t("turnkey.portfolio.project4.tag3")] },
 { type: "invest", img: "/p5.jpg", title: t("turnkey.portfolio.project5.title"), tags: [t("turnkey.portfolio.project5.tag1"), t("turnkey.portfolio.project5.tag2"), t("turnkey.portfolio.project5.tag3"), t("turnkey.portfolio.project5.tag4")] },
 { type: "life",   img: "/p6.jpg", title: t("turnkey.portfolio.project6.title"), tags: [t("turnkey.portfolio.project6.tag1"), t("turnkey.portfolio.project6.tag2"), t("turnkey.portfolio.project6.tag3")] },
  ];
  const visible = projects.filter(p => filter === "all" || p.type === filter);
  const placeholderColors = ["#703C54", "#21141A", "#73485F", "#703C54", "#21141A", "#73485F"];

  return (<>

    <section style={{ background: C.dark, padding: "10px" }}>
      <div style={{ background: C.dark, borderRadius: "16px", padding: "clamp(60px,7vw,100px) clamp(24px,4vw,64px)" }}>
        <div style={{ maxWidth: "var(--site-max)", margin: "0 auto", padding: "0 var(--site-gutter)" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "24px", marginBottom: "48px" }}>
            <div>
              <h2 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: C.light, lineHeight: 1.1 }}>
                {t("turnkey.portfolio.title")} <em style={{ fontStyle: "italic", color: C.light }}>{t("turnkey.portfolio.titleEm")}</em>
              </h2>
            </div>
            <div style={{ display: "flex", gap: "8px", background: "rgba(255,254,249,0.06)", borderRadius: "10px", padding: "4px" }}>
{([["all", t("turnkey.portfolio.all")], ["life", t("turnkey.portfolio.forLife")], ["invest", t("turnkey.portfolio.forInvestment")]] as const).map(([val, label]) => (
                <button key={val} onClick={() => setFilter(val)} style={{ fontFamily: "Inter, sans-serif", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", border: "none", borderRadius: "7px", padding: "9px 18px", cursor: "pointer", transition: "all 0.2s", background: filter === val ? C.teal : "transparent", color: filter === val ? C.light : "rgba(255,254,249,0.55)" }}>
{label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
            {visible.map((p, i) => (
              <div key={p.title} style={{ borderRadius: "12px", overflow: "hidden", background: placeholderColors[i % placeholderColors.length] + "33", border: "1px solid rgba(255,254,249,0.06)" }}>
                <div style={{ height: "220px", background: placeholderColors[i % placeholderColors.length] + "44", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,254,249,0.25)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <div style={{ padding: "24px" }}>
                  <h3 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "1.2rem", fontWeight: 500, color: C.light, margin: "0 0 14px" }}>{p.title}</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {p.tags.map(tag => (
                      <span key={tag} style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", letterSpacing: "0.08em", textTransform: "uppercase", color: p.type === "invest" ? C.teal : "rgba(255,254,249,0.6)", background: p.type === "invest" ? "rgba(140,178,192,0.1)" : "rgba(255,254,249,0.06)", borderRadius: "4px", padding: "4px 8px" }}>{tag}</span>
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
  const t = useT();

  return (<>

    <section style={{ background: C.dark, padding: "10px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "10px" }}>
        <div style={{ background: C.light, borderRadius: "16px", padding: "clamp(48px,5vw,64px) clamp(32px,4vw,48px)" }}>
          <h3 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "clamp(1.6rem,2.5vw,2.2rem)", fontWeight: 400, color: C.dark, lineHeight: 1.2, marginBottom: "20px" }}>
            {t("turnkey.guarantee.self.title")}
          </h3>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", color: "rgba(33,20,26,0.55)", lineHeight: 1.8 }}>
            {t("turnkey.guarantee.self.body")}
          </p>
        </div>
        <div style={{ background: C.dark, border: "1px solid rgba(140,178,192,0.1)", borderRadius: "16px", padding: "clamp(48px,5vw,64px) clamp(32px,4vw,48px)" }}>
          <h3 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "clamp(1.6rem,2.5vw,2.2rem)", fontWeight: 400, color: C.light, lineHeight: 1.2, marginBottom: "20px" }}>
            {t("turnkey.guarantee.invest.title")}
          </h3>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", color: "rgba(255,254,249,0.55)", lineHeight: 1.8 }}>
            {t("turnkey.guarantee.invest.body")}
          </p>
        </div>
      </div>
    </section>
  
  </>);
}

// ─── Market Stats ─────────────────────────────────────────────────────────────
function MarketStats() {
  const t = useT();

  return (<>

    <section style={{ background: C.dark, padding: "80px 10px" }}>
      <div style={{ maxWidth: "var(--site-max)", margin: "0 auto", padding: "0 var(--site-gutter)" }}>
        <h2 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: C.light, lineHeight: 1.1, marginBottom: "60px", maxWidth: "700px" }}>
          {t("turnkey.market.title")}
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
{/* Stat 1: Tourism Growth */}
          <div>
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "2.8rem", fontWeight: 700, color: C.teal, margin: "0" }}>9,4M</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "rgba(255,254,249,0.6)", margin: "6px 0 0", letterSpacing: "0.08em", textTransform: "uppercase" }}>{t("turnkey.market.stat1.label")}</p>
            </div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "rgba(255,254,249,0.65)", lineHeight: 1.7, margin: 0 }}>
              {t("turnkey.market.stat1.body")}
            </p>
          </div>

{/* Stat 2: Nightly Rates */}
          <div>
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "2.8rem", fontWeight: 700, color: C.teal, margin: "0" }}>$60–$100</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "rgba(255,254,249,0.6)", margin: "6px 0 0", letterSpacing: "0.08em", textTransform: "uppercase" }}>{t("turnkey.market.stat2.label")}</p>
            </div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "rgba(255,254,249,0.65)", lineHeight: 1.7, margin: 0 }}>
              {t("turnkey.market.stat2.body")}
            </p>
          </div>

{/* Stat 3: Payback Period */}
          <div>
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "2.8rem", fontWeight: 700, color: C.teal, margin: "0" }}>11</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "rgba(255,254,249,0.6)", margin: "6px 0 0", letterSpacing: "0.08em", textTransform: "uppercase" }}>{t("turnkey.market.stat3.label")}</p>
            </div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "rgba(255,254,249,0.65)", lineHeight: 1.7, margin: 0 }}>
              {t("turnkey.market.stat3.body")}
            </p>
          </div>

{/* Stat 4: Price Appreciation */}
          <div>
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "2.8rem", fontWeight: 700, color: C.teal, margin: "0" }}>+70%</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "rgba(255,254,249,0.6)", margin: "6px 0 0", letterSpacing: "0.08em", textTransform: "uppercase" }}>{t("turnkey.market.stat4.label")}</p>
            </div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "rgba(255,254,249,0.65)", lineHeight: 1.7, margin: 0 }}>
              {t("turnkey.market.stat4.body")}
            </p>
          </div>

{/* Stat 5: Market Price */}
          <div>
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "2.8rem", fontWeight: 700, color: C.teal, margin: "0" }}>$1,850</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "rgba(255,254,249,0.6)", margin: "6px 0 0", letterSpacing: "0.08em", textTransform: "uppercase" }}>{t("turnkey.market.stat5.label")}</p>
            </div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "rgba(255,254,249,0.65)", lineHeight: 1.7, margin: 0 }}>
              {t("turnkey.market.stat5.body")}
            </p>
          </div>

{/* Stat 6: Institutional Confidence */}
          <div>
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "2.8rem", fontWeight: 700, color: C.teal, margin: "0" }}>✓</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "rgba(255,254,249,0.6)", margin: "6px 0 0", letterSpacing: "0.08em", textTransform: "uppercase" }}>{t("turnkey.market.stat6.label")}</p>
            </div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", color: "rgba(255,254,249,0.65)", lineHeight: 1.7, margin: 0 }}>
              {t("turnkey.market.stat6.body")}
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
  const t = useT();

  const inputStyle: CSSProperties = {
    width: "100%", background: "rgba(255,254,249,0.06)", border: "1px solid rgba(255,254,249,0.12)",
    borderRadius: "8px", padding: "14px 16px", color: C.light, fontFamily: "Inter, sans-serif",
    fontSize: "0.88rem", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
  };
  const labelStyle: CSSProperties = {
    display: "block", fontFamily: "Inter, sans-serif", fontSize: "0.65rem", letterSpacing: "0.14em",
    textTransform: "uppercase", color: "rgba(255,254,249,0.45)", marginBottom: "8px",
  };

  return (<>

    <section id="contact-form" style={{ background: C.dark, padding: "10px 10px 0" }}>
      <div style={{ background: C.dark, borderRadius: "16px 16px 0 0", padding: "clamp(60px,8vw,120px) clamp(24px,4vw,64px)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <h2 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: C.light, lineHeight: 1.1, marginBottom: "16px" }}>
              {t("turnkey.contact.title")}
            </h2>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", color: "rgba(255,254,249,0.5)", lineHeight: 1.75 }}>
              {t("turnkey.contact.body")}
            </p>
          </div>

          {sent ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "20px" }}><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <h2 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "1.8rem", fontWeight: 400, color: C.light, marginBottom: "10px" }}>{t("turnkey.contact.successTitle")}</h2>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: "rgba(255,254,249,0.5)" }}>{t("turnkey.contact.successBody")}</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>{t("turnkey.contact.name")}</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder={t("turnkey.contact.namePlaceholder")} style={inputStyle} onFocus={e => (e.target.style.borderColor = C.teal)} onBlur={e => (e.target.style.borderColor = "rgba(255,254,249,0.12)")} />
                </div>
                <div>
                  <label style={labelStyle}>{t("turnkey.contact.phoneOrEmail")}</label>
                  <input value={contact} onChange={e => setContact(e.target.value)} placeholder={t("turnkey.contact.phonePlaceholder")} style={inputStyle} onFocus={e => (e.target.style.borderColor = C.teal)} onBlur={e => (e.target.style.borderColor = "rgba(255,254,249,0.12)")} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>{t("turnkey.contact.projectIs")}</label>
                <select value={goal} onChange={e => setGoal(e.target.value)} style={{ ...inputStyle, appearance: "none" as "none" }}>
                  <option value="invest">{t("turnkey.contact.optionInvest")}</option>
                  <option value="self">{t("turnkey.contact.optionSelf")}</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>{t("turnkey.contact.describe")}</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder={t("turnkey.contact.describePlaceholder")} rows={4} style={{ ...inputStyle, resize: "vertical" }} onFocus={e => (e.target.style.borderColor = C.teal)} onBlur={e => (e.target.style.borderColor = "rgba(255,254,249,0.12)")} />
              </div>
              <button onClick={() => setSent(true)} style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, background: C.teal, border: "none", borderRadius: "10px", padding: "18px", cursor: "pointer", transition: "opacity 0.2s" }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                {t("turnkey.contact.submit")}
              </button>
            </div>
          )}

{/* Contact details */}
          <div style={{ marginTop: "48px", paddingTop: "40px", borderTop: "1px solid rgba(140,178,192,0.1)", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "32px" }}>
            <a href="https://wa.me/995591800800" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "rgba(255,254,249,0.5)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = C.teal)} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,254,249,0.5)")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            <a href="mailto:sitboinvest@gmail.com" style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "rgba(255,254,249,0.5)", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={e => (e.currentTarget.style.color = C.teal)} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,254,249,0.5)")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              sitboinvest@gmail.com
            </a>
            <span style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "rgba(255,254,249,0.5)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {t("turnkey.contact.location")}
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
      <Hero />
      <TwoColumns />
      <DesignRule />
      <Calculator />
      <RemoteProcess />
      <Portfolio />
      <Guarantees />
      <MarketStats />
      <ContactForm />
    </div>
  
  </>);
}
