import { useState, useEffect } from "react";
import { Link } from "wouter";
import { AppLink } from "../components/app-link";
import { useLocale } from "../context/LocaleContext";
import { useRates } from "../context/RatesContext";
import { formatMoney } from "../lib/money";
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

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useIsMobile(bp = 768) {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < bp : false
  );
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < bp);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [bp]);
  return mobile;
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".m-reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.opacity = "1";
          (e.target as HTMLElement).style.transform = "translateY(0)";
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.06 }
    );
    els.forEach((el) => {
      (el as HTMLElement).style.opacity = "0";
      (el as HTMLElement).style.transform = "translateY(24px)";
      (el as HTMLElement).style.transition = "opacity 0.55s ease, transform 0.55s ease";
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
}

// ─── Grid primitives ─────────────────────────────────────────────────────────
function Container({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (<>

    <div className="site-wrap" style={style}>{children}
    </div>
  
  </>);
}

function Row({ children, gap = 24, style }: { children: React.ReactNode; gap?: number; style?: React.CSSProperties }) {
  return (<>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: `${gap}px`, ...style }}>{children}
    </div>
  
  </>);
}

function Col({ span = 12, spanMd, children, style }: {
  span?: number; spanMd?: number; children?: React.ReactNode; style?: React.CSSProperties;
}) {
  const isMobile = useIsMobile();
  const cols = isMobile ? 12 : (spanMd ?? span);
  return <div style={{ gridColumn: `span ${cols}`, ...style }}>{children}</div>;
}

function Divider() {
  return <div style={{ height: "1px", background: "rgba(33,20,26,0.08)" }} />;
}

// ─── Table row (light theme) ──────────────────────────────────────────────────
function TRow({ label, value }: { label: string; value: string }) {
  return (<>

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", padding: "11px 0", borderBottom: "1px solid rgba(33,20,26,0.07)" }}>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.83rem", color: C.muted }}>{label}</span>
      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.83rem", color: C.dark, fontWeight: 600, textAlign: "right" }}>{value}</span>
    </div>
  
  </>);
}

// ─── Process step ─────────────────────────────────────────────────────────────
function ProcessStep({ n, title, desc, delay = 0 }: { n: number; title: string; desc: string; delay?: number }) {
  return (
    <div className="m-reveal" style={{ transitionDelay: `${delay}ms`, display: "flex", gap: "20px", padding: "28px 0", borderBottom: "1px solid rgba(33,20,26,0.07)", flex: 1 }}>
      <div style={{ flexShrink: 0, width: "44px", height: "44px", borderRadius: "50%", border: `1.5px solid ${C.wine}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: "1rem", fontWeight: 700, color: C.wine }}>{String(n).padStart(2, "0")}</span>
      </div>
      <div style={{ paddingTop: "8px" }}>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem", fontWeight: 700, color: C.dark, marginBottom: "6px" }}>{title}</p>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.83rem", color: C.muted, lineHeight: 1.7, margin: 0 }}>{desc}</p>
      </div>
    </div>
  );
}

// ─── Calculator ───────────────────────────────────────────────────────────────
function MortgageCalculator() {
  const { currency: localeCurrency, language } = useLocale();
  const { convertFromUSD, convert, date: ratesDate } = useRates();
  const t = useT();
  const [price, setPrice]     = useState(200000);
  const [downPct, setDownPct] = useState(35);
  const [rate, setRate]       = useState(10.5);
  const [years, setYears]     = useState(10);
  const [currency, setCurrency] = useState<"USD" | "GEL" | "EUR">(
    ["USD", "GEL", "EUR"].includes(localeCurrency)
      ? (localeCurrency as "USD" | "GEL" | "EUR")
      : "USD"
  );

  useEffect(() => {
    if (["USD", "GEL", "EUR"].includes(localeCurrency)) {
      setCurrency(localeCurrency as "USD" | "GEL" | "EUR");
    }
  }, [localeCurrency]);

  const fmt = (usd: number) =>
    formatMoney(convertFromUSD(usd, currency), currency, language);
  const toDisplay = (usd: number) => Math.round(convertFromUSD(usd, currency));
  const fromDisplay = (amount: number) =>
    Math.round(convert(amount, currency, "USD"));

  const downAmount     = (price * downPct) / 100;
  const loanUSD        = price - downAmount;
  const monthlyRate    = rate / 100 / 12;
  const n              = years * 12;
  const monthlyPayment = monthlyRate === 0
    ? loanUSD / n
    : (loanUSD * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  const totalPaid      = monthlyPayment * n;
  const totalInterest  = totalPaid - loanUSD;

  const fieldLabel: React.CSSProperties = {
    display: "block", fontFamily: "Inter, sans-serif", fontSize: "0.72rem",
    letterSpacing: "0.1em", textTransform: "uppercase", color: C.muted, marginBottom: "8px",
  };
  const numInput: React.CSSProperties = {
    width: "100%", background: C.light,
    border: "1px solid rgba(33,20,26,0.15)", borderRadius: "8px",
    padding: "10px 14px", fontFamily: "Inter, sans-serif", fontSize: "0.88rem", color: C.dark,
    outline: "none", boxSizing: "border-box", marginTop: "8px",
  };

  return (<>

    <section style={{ padding: "80px 0", background: C.light }}>
      <Container>
        <Row style={{ marginBottom: "48px" }}>
          <Col span={6}>
            <div className="m-reveal">
              <h2 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: C.dark, lineHeight: 1.15 }}>
                {t("mortgage.calculator.title")}
              </h2>
            </div>
          </Col>
          <Col span={6}>
            <div className="m-reveal" style={{ transitionDelay: "80ms", paddingTop: "20px" }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", color: C.muted, lineHeight: 1.8 }}>
                {t("mortgage.calculator.body")}
              </p>
            </div>
          </Col>
        </Row>

{/* Currency toggle */}
        <Row style={{ marginBottom: "40px" }}>
          <Col span={12}>
            <div className="m-reveal" style={{ display: "flex", gap: "8px" }}>
              {(["USD", "GEL", "EUR"] as const).map((c) => (
                <button key={c} onClick={() => setCurrency(c)} style={{
                  padding: "8px 24px", borderRadius: "6px",
                  border: `1px solid ${currency === c ? C.dark : "rgba(33,20,26,0.2)"}`,
                  background: currency === c ? C.dark : "transparent",
                  color: currency === c ? C.light : C.muted,
                  fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 600,
                  cursor: "pointer", letterSpacing: "0.08em",
                  transition: "background 0.2s, color 0.2s, border-color 0.2s",
                }}>{c}</button>
              ))}
            </div>
          </Col>
        </Row>

{/* Sliders — 4 fields across 6+6 */}
        <Row gap={32} style={{ marginBottom: "40px" }}>
{/* Property price */}
          <Col span={6}>
            <div className="m-reveal">
              <label style={fieldLabel}>{t("mortgage.calculator.propertyPrice")} · <strong style={{ color: C.dark }}>{fmt(price)}</strong></label>
              <input type="range" min="30000" max="1000000" step="5000" value={price}
                onChange={e => setPrice(+e.target.value)}
                style={{ width: "100%", accentColor: C.wine, cursor: "pointer" }} />
              <input type="number" value={toDisplay(price)}
                onChange={e => setPrice(fromDisplay(+e.target.value))}
                style={numInput} />
            </div>
          </Col>

{/* Down payment */}
          <Col span={6}>
            <div className="m-reveal" style={{ transitionDelay: "60ms" }}>
              <label style={fieldLabel}>{t("mortgage.calculator.downPayment")} · <strong style={{ color: C.dark }}>{downPct}% · {fmt(downAmount)}</strong></label>
              <input type="range" min="15" max="70" step="1" value={downPct}
                onChange={e => setDownPct(+e.target.value)}
                style={{ width: "100%", accentColor: C.wine, cursor: "pointer" }} />
              <input type="number" min="15" max="70" value={downPct}
                onChange={e => setDownPct(Math.max(15, Math.min(70, +e.target.value)))}
                style={numInput} />
            </div>
          </Col>

{/* Rate */}
          <Col span={6}>
            <div className="m-reveal" style={{ transitionDelay: "120ms" }}>
              <label style={fieldLabel}>{t("mortgage.calculator.interestRate")} · <strong style={{ color: C.dark }}>{rate}% p.a.</strong></label>
              <input type="range" min="9" max="18" step="0.1" value={rate}
                onChange={e => setRate(+e.target.value)}
                style={{ width: "100%", accentColor: C.wine, cursor: "pointer" }} />
              <input type="number" min="9" max="18" step="0.1" value={rate}
                onChange={e => setRate(+e.target.value)}
                style={numInput} />
            </div>
          </Col>

{/* Term */}
          <Col span={6}>
            <div className="m-reveal" style={{ transitionDelay: "180ms" }}>
              <label style={fieldLabel}>{t("mortgage.calculator.loanTerm")} · <strong style={{ color: C.dark }}>{years} {t("mortgage.calculator.yearsSuffix")}</strong></label>
              <input type="range" min="1" max="15" step="1" value={years}
                onChange={e => setYears(+e.target.value)}
                style={{ width: "100%", accentColor: C.wine, cursor: "pointer" }} />
              <input type="number" min="1" max="15" value={years}
                onChange={e => setYears(Math.max(1, Math.min(15, +e.target.value)))}
                style={numInput} />
            </div>
          </Col>
        </Row>

{/* Results */}
        <Row gap={16}>
          {[
    { label: t("mortgage.calculator.monthlyPayment"), value: fmt(monthlyPayment), accent: true },
    { label: t("mortgage.calculator.loanAmount"), value: fmt(loanUSD), accent: false },
    { label: t("mortgage.calculator.totalInterest"), value: fmt(totalInterest), accent: false },
    { label: t("mortgage.calculator.totalCost"), value: fmt(totalPaid + downAmount), accent: false },
          ].map((item, i) => (
            <Col key={item.label} span={3}>
              <div className="m-reveal" style={{
                transitionDelay: `${i * 60}ms`,
                background: item.accent ? C.dark : C.light,
                border: `1px solid ${item.accent ? "transparent" : "rgba(33,20,26,0.1)"}`,
                borderRadius: "12px", padding: "24px 20px", textAlign: "center",
              }}>
                <div style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "clamp(1.4rem,2.5vw,1.9rem)", fontWeight: 700, lineHeight: 1,
                  color: item.accent ? C.teal : C.dark, marginBottom: "8px",
                }}>{item.value}</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: item.accent ? "rgba(255,254,249,0.5)" : C.muted }}>
                  {item.label}
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <Row style={{ marginTop: "16px" }}>
          <Col span={12}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: C.muted, margin: 0, lineHeight: 1.6 }}>
              * {t("mortgage.ratesNote")}{ratesDate ? ` (${ratesDate})` : ""}. {t("mortgage.calculator.actualConditions")}
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  
  </>);
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MortgagePage() {
  const isMobile = useIsMobile();
  const t = useT();
  useReveal();

  return (<>

    <div style={{ background: C.light, minHeight: "100vh", color: C.dark }}>
{/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section>
        <Container>
          <Row style={{ minHeight: "80vh", alignItems: "center", paddingTop: "48px", paddingBottom: "64px" }}>

            <Col span={7}>
              <div className="m-reveal">
                <h1 style={{
                  fontFamily: "Coolvetica, Inter, sans-serif",
                  fontSize: "clamp(2.8rem, 6vw, 5rem)",
                  fontWeight: 400, lineHeight: 1.05,
                  color: C.dark, marginBottom: "28px", letterSpacing: "-0.01em",
                }}>
                  {t("mortgage.hero.title")}<br />
                  <em style={{ fontStyle: "italic", color: C.teal }}>{t("mortgage.hero.titleEm")}</em><br />
                  {t("mortgage.hero.titleSuffix")}
                </h1>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(0.9rem,1.8vw,1.05rem)", color: C.muted, lineHeight: 1.8, maxWidth: "480px", marginBottom: "40px" }}>
                  {t("mortgage.hero.body")}
                </p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <a href="#calculator" style={{ display: "inline-block", fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, background: C.dark, borderRadius: "8px", padding: "14px 32px", textDecoration: "none" }}>
                    {t("mortgage.hero.ctaCalculator")}
                  </a>
                  <a href="#terms" style={{ display: "inline-block", fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark, background: "transparent", border: `1px solid ${C.dark}`, borderRadius: "8px", padding: "14px 32px", textDecoration: "none" }}>
                    {t("mortgage.hero.ctaTerms")}
                  </a>
                </div>
              </div>
            </Col>

{/* Right: key stats */}
            <Col span={5}>
              <div className="m-reveal" style={{ transitionDelay: "120ms" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {[
    { val: "30–40%", label: t("mortgage.stat.downPayment") },
    { val: "9–10%", label: t("mortgage.stat.nominalRate") },
    { val: "10 yr", label: t("mortgage.stat.maxTerm") },
    { val: "$500K", label: t("mortgage.stat.maxAmount") },
                  ].map((s) => (
                    <div key={s.label} style={{ background: C.light, borderRadius: "12px", padding: "24px 20px", borderTop: `2px solid ${C.wine}` }}>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "1.8rem", fontWeight: 700, color: C.dark, lineHeight: 1, marginBottom: "6px" }}>{s.val}</div>
                      <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Col>

          </Row>
        </Container>
      </section>

      <Divider />

{/* ── KEY TERMS ────────────────────────────────────────────────────────── */}
      <section id="terms" style={{ padding: "96px 0" }}>
        <Container>
          <Row style={{ marginBottom: "56px" }}>
            <Col span={5}>
              <div className="m-reveal">
                <h2 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: C.dark, lineHeight: 1.15 }}>
                  {t("mortgage.terms.title")}
                </h2>
              </div>
            </Col>
            <Col span={7}>
              <div className="m-reveal" style={{ transitionDelay: "80ms", paddingTop: "20px" }}>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: C.muted, lineHeight: 1.8 }}>
                  {t("mortgage.terms.body")}
                </p>
              </div>
            </Col>
          </Row>

          <Row gap={24}>
{/* Card 1: Down Payment */}
            <Col span={6}>
              <div className="m-reveal" style={{ background: C.light, borderRadius: "14px", padding: "32px 28px", height: "100%", boxSizing: "border-box" }}>
                <h3 style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.wine, marginBottom: "20px" }}>{t("mortgage.terms.downPayment.title")}</h3>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "3.5rem", fontWeight: 700, color: C.dark, lineHeight: 1, marginBottom: "8px" }}>30–40%</div>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.83rem", color: C.muted, lineHeight: 1.7, marginBottom: "16px" }}>
                  {t("mortgage.terms.downPayment.body")}
                </p>
                <div style={{ background: C.light, borderRadius: "8px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.teal, flexShrink: 0 }} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: C.mutedDark }}>
                    {t("mortgage.terms.downPayment.note")}
                  </span>
                </div>
              </div>
            </Col>

{/* Card 2: Rates */}
            <Col span={6}>
              <div className="m-reveal" style={{ transitionDelay: "80ms", background: C.light, border: "1px solid rgba(33,20,26,0.08)", borderRadius: "14px", padding: "32px 28px", height: "100%", boxSizing: "border-box" }}>
                <h3 style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.wine, marginBottom: "20px" }}>{t("mortgage.terms.rates.title")}</h3>
                <TRow label={t("mortgage.terms.nominalRate")} value={t("mortgage.terms.nominalRateValue")} />
                <TRow label={t("mortgage.terms.eir")} value={t("mortgage.terms.eirValue")} />
                <TRow label={t("mortgage.terms.gelIndex")} value="TIBR1M" />
                <TRow label={t("mortgage.terms.usdIndex")} value="SOFR" />
                <TRow label={t("mortgage.terms.eurIndex")} value="EURIBOR" />
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: C.muted, marginTop: "14px", lineHeight: 1.6 }}>
                  {t("mortgage.terms.rateFixedNote")}
                </p>
              </div>
            </Col>

{/* Card 3: Loan params */}
            <Col span={4}>
              <div className="m-reveal" style={{ transitionDelay: "40ms", background: C.light, border: "1px solid rgba(33,20,26,0.08)", borderRadius: "14px", padding: "28px 24px" }}>
                <h3 style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.wine, marginBottom: "16px" }}>{t("mortgage.terms.loanParameters")}</h3>
                <TRow label={t("mortgage.terms.term")} value={t("mortgage.terms.termValue")} />
                <TRow label={t("mortgage.terms.maxAmount")} value={t("mortgage.terms.maxAmountValue")} />
                <TRow label={t("mortgage.terms.currencies")} value={t("mortgage.terms.currenciesValue")} />
                <TRow label={t("mortgage.terms.collateral")} value={t("mortgage.terms.collateralValue")} />
              </div>
            </Col>

{/* Card 4: Who qualifies */}
            <Col span={8}>
              <div className="m-reveal" style={{ transitionDelay: "80ms", background: C.dark, borderRadius: "14px", padding: "28px 28px" }}>
                <h3 style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.teal, marginBottom: "16px" }}>{t("mortgage.terms.whoQualifies")}</h3>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", color: "rgba(255,254,249,0.7)", lineHeight: 1.7, marginBottom: "20px" }}>
                  {t("mortgage.terms.whoQualifiesBody")}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "12px" }}>
{[
  t("mortgage.terms.qualification.salary"),
  t("mortgage.terms.qualification.selfEmployed"),
  t("mortgage.terms.qualification.freelance"),
  t("mortgage.terms.qualification.rental"),
  t("mortgage.terms.qualification.dividends"),
].map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: C.teal, flexShrink: 0 }} />
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "rgba(255,254,249,0.65)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Divider />

{/* ── RISKS ────────────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 0", background: C.light }}>
        <Container>
          <Row style={{ marginBottom: "48px" }}>
            <Col span={5}>
              <div className="m-reveal">
                <h2 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "clamp(1.8rem,3.5vw,3rem)", fontWeight: 400, color: C.dark, lineHeight: 1.2 }}>
                  {t("mortgage.risks.title")}
                </h2>
              </div>
            </Col>
          </Row>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", alignItems: "stretch" }}>
            {[
              { icon: "⚠", title: t("mortgage.risk.currency.title"), desc: t("mortgage.risk.currency.desc") },
              { icon: "🔍", title: t("mortgage.risk.scoring.title"), desc: t("mortgage.risk.scoring.desc") },
              { icon: "📋", title: t("mortgage.risk.income.title"), desc: t("mortgage.risk.income.desc") },
              { icon: "🏗", title: t("mortgage.risk.newBuilds.title"), desc: t("mortgage.risk.newBuilds.desc") },
            ].map((item, i) => (
              <div key={item.title} className="m-reveal" style={{
                transitionDelay: `${i * 70}ms`,
                background: C.light, borderRadius: "12px", padding: "28px 22px",
                borderTop: `2px solid ${C.wine}`,
                display: "flex", flexDirection: "column",
              }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "12px" }}>{item.icon}</div>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", fontWeight: 700, color: C.dark, marginBottom: "8px" }}>{item.title}</p>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: C.muted, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

{/* ── PROCESS ──────────────────────────────────────────────────────────── */}
      <section id="process" style={{ padding: "96px 0" }}>
        <Container>
          <Row style={{ marginBottom: "56px" }}>
            <Col span={5}>
              <div className="m-reveal">
                <h2 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: C.dark, lineHeight: 1.15 }}>
                  {t("mortgage.process.title")}
                </h2>
              </div>
            </Col>
            <Col span={7}>
              <div className="m-reveal" style={{ transitionDelay: "80ms", paddingTop: "20px" }}>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.95rem", color: C.muted, lineHeight: 1.8 }}>
                  {t("mortgage.process.body")}
                </p>
              </div>
            </Col>
          </Row>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 48px" }}>
            <ProcessStep n={1} delay={0} title={t("mortgage.process1.title")} desc={t("mortgage.process1.desc")} />
            <ProcessStep n={3} delay={160} title={t("mortgage.process3.title")} desc={t("mortgage.process3.desc")} />
            <ProcessStep n={2} delay={80} title={t("mortgage.process2.title")} desc={t("mortgage.process2.desc")} />
            <ProcessStep n={4} delay={240} title={t("mortgage.process4.title")} desc={t("mortgage.process4.desc")} />
          </div>
        </Container>
      </section>

{/* ── CALCULATOR ───────────────────────────────────────────────────────── */}
      <div id="calculator">
        <MortgageCalculator />
      </div>

{/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section style={{ background: C.dark, padding: "96px 0" }}>
        <Container>
          <Row>
            <Col span={8} style={{ margin: "0 auto", textAlign: "center" }}>
              <div className="m-reveal">
                <h2 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "clamp(2rem,5vw,3.6rem)", fontWeight: 400, color: C.light, lineHeight: 1.1, marginBottom: "20px" }}>
                  {t("mortgage.cta.title")}
                </h2>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.92rem", color: "rgba(255,254,249,0.5)", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto 40px" }}>
                  {t("mortgage.cta.body")}
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  <AppLink href="/#contact" style={{ display: "inline-block", fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark, background: C.teal, borderRadius: "8px", padding: "15px 36px", textDecoration: "none" }}>
                    {t("cta.getFreeConsultation")}
                  </AppLink>
                  <a href="https://wa.me/995555505288" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", fontFamily: "Inter, sans-serif", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, background: "transparent", border: "1px solid rgba(255,254,249,0.2)", borderRadius: "8px", padding: "15px 36px", textDecoration: "none" }}>
                    {t("cta.whatsappUs")}
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

    </div>
  
  </>);
}
