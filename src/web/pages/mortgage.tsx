import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Footer } from "../components/footer";

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  dark:      "#21141A",
  teal:      "#8CB2C0",
  wine:      "#683D47",
  light:     "#FFFBF0",
  parchment: "#F5F3ED",
  muted:     "#7a7a7a",
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

    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(16px,4vw,48px)", ...style }}>{children}
    </div>
  
  </>);
}

function Row({ children, gap = 24, style }: { children: React.ReactNode; gap?: number; style?: React.CSSProperties }) {
  const isMobile = useIsMobile();
  return (
    <div style={isMobile
      ? { display: "flex", flexDirection: "column", gap: `${gap}px`, ...style }
      : { display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: `${gap}px`, ...style }
    }>{children}</div>
  );
}

function Col({ span = 12, spanMd, children, style }: {
  span?: number; spanMd?: number; children?: React.ReactNode; style?: React.CSSProperties;
}) {
  const isMobile = useIsMobile();
  return (
    <div style={isMobile
      ? { width: "100%", minWidth: 0, ...style }
      : { gridColumn: `span ${spanMd ?? span}`, ...style }
    }>{children}</div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (<>

    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
      <div style={{ width: "28px", height: "1px", background: C.wine, flexShrink: 0 }} />
      <span style={{ fontFamily: "DM Sans", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted }}>{children}
      </span>
    </div>
  
  </>);
}

function Divider() {
  return <div style={{ height: "1px", background: "rgba(33,20,26,0.08)" }} />;
}

// ─── Table row (light theme) ──────────────────────────────────────────────────
function TRow({ label, value }: { label: string; value: string }) {
  return (<>

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", padding: "11px 0", borderBottom: "1px solid rgba(33,20,26,0.07)" }}>
      <span style={{ fontFamily: "DM Sans", fontSize: "0.83rem", color: C.muted }}>{label}</span>
      <span style={{ fontFamily: "DM Sans", fontSize: "0.83rem", color: C.dark, fontWeight: 600, textAlign: "right" }}>{value}</span>
    </div>
  
  </>);
}

// ─── Process step ─────────────────────────────────────────────────────────────
function ProcessStep({ n, title, desc, delay = 0 }: { n: number; title: string; desc: string; delay?: number }) {
  return (
    <div className="m-reveal" style={{ transitionDelay: `${delay}ms`, display: "flex", gap: "20px", padding: "28px 0", borderBottom: "1px solid rgba(33,20,26,0.07)", flex: 1 }}>
      <div style={{ flexShrink: 0, width: "44px", height: "44px", borderRadius: "50%", border: `1.5px solid ${C.wine}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "Jun, serif", fontSize: "1rem", fontWeight: 700, color: C.wine }}>{String(n).padStart(2, "0")}</span>
      </div>
      <div style={{ paddingTop: "8px" }}>
        <p style={{ fontFamily: "DM Sans", fontSize: "0.9rem", fontWeight: 700, color: C.dark, marginBottom: "6px" }}>{title}</p>
        <p style={{ fontFamily: "DM Sans", fontSize: "0.83rem", color: C.muted, lineHeight: 1.7, margin: 0 }}>{desc}</p>
      </div>
    </div>
  );
}

// ─── Calculator ───────────────────────────────────────────────────────────────
function MortgageCalculator() {
  const [price, setPrice]     = useState(200000);
  const [downPct, setDownPct] = useState(35);
  const [rate, setRate]       = useState(10.5);
  const [years, setYears]     = useState(10);
  const [currency, setCurrency] = useState<"USD" | "GEL" | "EUR">("USD");

  const gelRate = 2.71;
  const eurRate = 1.09;

  const toDisplay = (usd: number) => {
    if (currency === "GEL") return Math.round(usd * gelRate);
    if (currency === "EUR") return Math.round(usd / eurRate);
    return Math.round(usd);
  };
  const sym = currency === "GEL" ? "₾" : currency === "EUR" ? "€" : "$";
  const fmt = (v: number) => sym + toDisplay(v).toLocaleString("en-US");

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
    display: "block", fontFamily: "DM Sans", fontSize: "0.72rem",
    letterSpacing: "0.1em", textTransform: "uppercase", color: C.muted, marginBottom: "8px",
  };
  const numInput: React.CSSProperties = {
    width: "100%", background: C.light,
    border: "1px solid rgba(33,20,26,0.15)", borderRadius: "8px",
    padding: "10px 14px", fontFamily: "DM Sans", fontSize: "0.88rem", color: C.dark,
    outline: "none", boxSizing: "border-box", marginTop: "8px",
  };

  return (<>

    <section style={{ padding: "80px 0", background: C.parchment }}>
      <Container>
        <Row style={{ marginBottom: "48px" }}>
          <Col span={6}>
            <div className="m-reveal">
              <Eyebrow>Calculator</Eyebrow>
              <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, color: C.dark, lineHeight: 1.15 }}>
                Calculate your<br />monthly payment.
              </h2>
            </div>
          </Col>
          <Col span={6}>
            <div className="m-reveal" style={{ transitionDelay: "80ms", paddingTop: "20px" }}>
              <p style={{ fontFamily: "DM Sans", fontSize: "0.88rem", color: C.muted, lineHeight: 1.8 }}>
                Adjust the sliders to model different scenarios. Switch between USD, GEL, and EUR.
                Results are indicative — actual rates depend on TBC Bank assessment.
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
                  fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600,
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
              <label style={fieldLabel}>Property Price · <strong style={{ color: C.dark }}>{fmt(price)}</strong></label>
              <input type="range" min="30000" max="1000000" step="5000" value={price}
                onChange={e => setPrice(+e.target.value)}
                style={{ width: "100%", accentColor: C.wine, cursor: "pointer" }} />
              <input type="number" value={toDisplay(price)}
                onChange={e => setPrice(
                  currency === "GEL" ? Math.round(+e.target.value / gelRate) :
                  currency === "EUR" ? Math.round(+e.target.value * eurRate) : +e.target.value
                )}
                style={numInput} />
            </div>
          </Col>

{/* Down payment */}
          <Col span={6}>
            <div className="m-reveal" style={{ transitionDelay: "60ms" }}>
              <label style={fieldLabel}>Down Payment · <strong style={{ color: C.dark }}>{downPct}% · {fmt(downAmount)}</strong></label>
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
              <label style={fieldLabel}>Interest Rate · <strong style={{ color: C.dark }}>{rate}% p.a.</strong></label>
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
              <label style={fieldLabel}>Loan Term · <strong style={{ color: C.dark }}>{years} years</strong></label>
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
    { label: "Monthly Payment", value: fmt(monthlyPayment), accent: true },
    { label: "Loan Amount",     value: fmt(loanUSD),        accent: false },
    { label: "Total Interest",  value: fmt(totalInterest),  accent: false },
    { label: "Total Cost",      value: fmt(totalPaid + downAmount), accent: false },
          ].map((item, i) => (
            <Col key={item.label} span={3}>
              <div className="m-reveal" style={{
                transitionDelay: `${i * 60}ms`,
                background: item.accent ? C.dark : C.light,
                border: `1px solid ${item.accent ? "transparent" : "rgba(33,20,26,0.1)"}`,
                borderRadius: "12px", padding: "24px 20px", textAlign: "center",
              }}>
                <div style={{
                  fontFamily: "Jun, serif",
                  fontSize: "clamp(1.4rem,2.5vw,1.9rem)", fontWeight: 700, lineHeight: 1,
                  color: item.accent ? C.teal : C.dark, marginBottom: "8px",
                }}>{item.value}</div>
                <div style={{ fontFamily: "DM Sans", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: item.accent ? "rgba(255,251,240,0.5)" : C.muted }}>
                  {item.label}
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <Row style={{ marginTop: "16px" }}>
          <Col span={12}>
            <p style={{ fontFamily: "DM Sans", fontSize: "0.72rem", color: C.muted, margin: 0, lineHeight: 1.6 }}>
              * Indicative annuity calculation. USD/GEL ≈ 2.71, USD/EUR ≈ 0.92. Actual conditions depend on TBC Bank assessment.
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
  useReveal();

  return (<>

    <div style={{ background: C.light, minHeight: "100vh", color: C.dark }}>
{/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section>
        <Container>
          <Row style={{ minHeight: "80vh", alignItems: "center", paddingTop: "48px", paddingBottom: "64px" }}>

            <Col span={7}>
              <div className="m-reveal">
                <Eyebrow>Real Estate Financing · Georgia</Eyebrow>
                <h1 style={{
                  fontFamily: "Jun, serif",
                  fontSize: "clamp(2.8rem, 6vw, 5rem)",
                  fontWeight: 400, lineHeight: 1.05,
                  color: C.dark, marginBottom: "28px", letterSpacing: "-0.01em",
                }}>
                  Mortgage for<br />
                  <em style={{ fontStyle: "italic", color: C.teal }}>Non-Residents</em><br />
                  in Georgia.
                </h1>
                <p style={{ fontFamily: "DM Sans", fontSize: "clamp(0.9rem,1.8vw,1.05rem)", color: C.muted, lineHeight: 1.8, maxWidth: "480px", marginBottom: "40px" }}>
                  TBC Bank offers mortgage financing to non-residents and foreigners. Stricter than for citizens — but entirely achievable. 30–40% down, personal visit required, transparent income.
                </p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <a href="#calculator" style={{ display: "inline-block", fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, background: C.dark, borderRadius: "8px", padding: "14px 32px", textDecoration: "none" }}>
                    Use Calculator
                  </a>
                  <a href="#terms" style={{ display: "inline-block", fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark, background: "transparent", border: `1px solid ${C.dark}`, borderRadius: "8px", padding: "14px 32px", textDecoration: "none" }}>
                    View Terms
                  </a>
                </div>
              </div>
            </Col>

{/* Right: key stats */}
            <Col span={5}>
              <div className="m-reveal" style={{ transitionDelay: "120ms" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {[
    { val: "30–40%", label: "Min. down payment" },
    { val: "9–10%",  label: "From (nominal rate)" },
    { val: "10 yr",  label: "Max loan term" },
    { val: "$500K",  label: "Max loan amount" },
                  ].map((s) => (
                    <div key={s.label} style={{ background: C.parchment, borderRadius: "12px", padding: "24px 20px", borderTop: `2px solid ${C.wine}` }}>
                      <div style={{ fontFamily: "Jun, serif", fontSize: "1.8rem", fontWeight: 700, color: C.dark, lineHeight: 1, marginBottom: "6px" }}>{s.val}</div>
                      <div style={{ fontFamily: "DM Sans", fontSize: "0.72rem", color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</div>
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
                <Eyebrow>TBC Bank · Key Terms</Eyebrow>
                <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: C.dark, lineHeight: 1.15 }}>
                  What to expect<br />from the bank.
                </h2>
              </div>
            </Col>
            <Col span={7}>
              <div className="m-reveal" style={{ transitionDelay: "80ms", paddingTop: "20px" }}>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.95rem", color: C.muted, lineHeight: 1.8 }}>
                  TBC Bank is Georgia's largest retail bank and the most accessible for non-residents.
                  Loans available in GEL, USD, or EUR — choose based on your income currency.
                </p>
              </div>
            </Col>
          </Row>

          <Row gap={24}>
{/* Card 1: Down Payment */}
            <Col span={6}>
              <div className="m-reveal" style={{ background: C.parchment, borderRadius: "14px", padding: "32px 28px", height: "100%", boxSizing: "border-box" }}>
                <h3 style={{ fontFamily: "DM Sans", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.wine, marginBottom: "20px" }}>Down Payment (LTV)</h3>
                <div style={{ fontFamily: "Jun, serif", fontSize: "3.5rem", fontWeight: 700, color: C.dark, lineHeight: 1, marginBottom: "8px" }}>30–40%</div>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.83rem", color: C.muted, lineHeight: 1.7, marginBottom: "16px" }}>
                  Of the bank's appraised value — which is often below market price. Plan accordingly.
                </p>
                <div style={{ background: C.light, borderRadius: "8px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.teal, flexShrink: 0 }} />
                  <span style={{ fontFamily: "DM Sans", fontSize: "0.8rem", color: C.mutedDark }}>
                    Can drop to <strong>15%</strong> with 6+ months of confirmed Georgian income
                  </span>
                </div>
              </div>
            </Col>

{/* Card 2: Rates */}
            <Col span={6}>
              <div className="m-reveal" style={{ transitionDelay: "80ms", background: C.light, border: "1px solid rgba(33,20,26,0.08)", borderRadius: "14px", padding: "32px 28px", height: "100%", boxSizing: "border-box" }}>
                <h3 style={{ fontFamily: "DM Sans", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.wine, marginBottom: "20px" }}>Interest Rates</h3>
                <TRow label="Nominal rate" value="From 9–10% p.a." />
                <TRow label="EIR (effective)" value="From 12.1% (EIR 14.21%)" />
                <TRow label="GEL index" value="TIBR1M" />
                <TRow label="USD index" value="SOFR" />
                <TRow label="EUR index" value="EURIBOR" />
                <p style={{ fontFamily: "DM Sans", fontSize: "0.75rem", color: C.muted, marginTop: "14px", lineHeight: 1.6 }}>
                  Rate fixed for 5 years, then revised. For expats with income/loan currency mismatch — from 12.1%.
                </p>
              </div>
            </Col>

{/* Card 3: Loan params */}
            <Col span={4}>
              <div className="m-reveal" style={{ transitionDelay: "40ms", background: C.light, border: "1px solid rgba(33,20,26,0.08)", borderRadius: "14px", padding: "28px 24px" }}>
                <h3 style={{ fontFamily: "DM Sans", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.wine, marginBottom: "16px" }}>Loan Parameters</h3>
                <TRow label="Term" value="Up to 10 yrs (rarely 15)" />
                <TRow label="Max amount" value="Up to $500K equiv." />
                <TRow label="Currencies" value="GEL · USD · EUR" />
                <TRow label="Collateral" value="Property purchased" />
              </div>
            </Col>

{/* Card 4: Who qualifies */}
            <Col span={8}>
              <div className="m-reveal" style={{ transitionDelay: "80ms", background: C.dark, borderRadius: "14px", padding: "28px 28px" }}>
                <h3 style={{ fontFamily: "DM Sans", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: C.teal, marginBottom: "16px" }}>Who Qualifies</h3>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.88rem", color: "rgba(255,251,240,0.7)", lineHeight: 1.7, marginBottom: "20px" }}>
                  Non-residents, expats, and foreigners from <strong style={{ color: C.light }}>90+ visa-free countries</strong>. Physical presence in Georgia is required. Income must be transparent — salary, self-employment, freelance, rental, dividends — with no negative records.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "12px" }}>
{["Salary / Employment", "Self-employed / ИП", "Freelance income", "Rental income", "Dividends"].map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: C.teal, flexShrink: 0 }} />
                      <span style={{ fontFamily: "DM Sans", fontSize: "0.8rem", color: "rgba(255,251,240,0.65)" }}>{item}</span>
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
      <section style={{ padding: "80px 0", background: C.parchment }}>
        <Container>
          <Row style={{ marginBottom: "48px" }}>
            <Col span={5}>
              <div className="m-reveal">
                <Eyebrow>Important to Know</Eyebrow>
                <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(1.8rem,3.5vw,3rem)", fontWeight: 400, color: C.dark, lineHeight: 1.2 }}>
                  Know the<br />risks first.
                </h2>
              </div>
            </Col>
          </Row>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", alignItems: "stretch" }}>
            {[
              { icon: "⚠", title: "Currency Risk",        desc: "If your income is in rubles but the loan is in USD/GEL, exchange rate fluctuations affect your monthly payment directly." },
              { icon: "🔍", title: "Strict Scoring",       desc: "TBC Bank runs thorough compliance checks — especially for Russian/Belarusian nationals. Transparency of income is non-negotiable." },
              { icon: "📋", title: "Income Match",         desc: "Income currency should match the loan currency ideally. Mismatches push effective rates up (from 12.1% EIR)." },
              { icon: "🏗",  title: "New Builds Preferred", desc: "Banks favour new construction. Secondary market properties get stricter appraisals — often 15–20% below asking." },
            ].map((item, i) => (
              <div key={item.title} className="m-reveal" style={{
                transitionDelay: `${i * 70}ms`,
                background: C.light, borderRadius: "12px", padding: "28px 22px",
                borderTop: `2px solid ${C.wine}`,
                display: "flex", flexDirection: "column",
              }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "12px" }}>{item.icon}</div>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.88rem", fontWeight: 700, color: C.dark, marginBottom: "8px" }}>{item.title}</p>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.8rem", color: C.muted, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
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
                <Eyebrow>Step by Step</Eyebrow>
                <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 400, color: C.dark, lineHeight: 1.15 }}>
                  How to get<br />approved.
                </h2>
              </div>
            </Col>
            <Col span={7}>
              <div className="m-reveal" style={{ transitionDelay: "80ms", paddingTop: "20px" }}>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.95rem", color: C.muted, lineHeight: 1.8 }}>
                  Most approvals take 2–5 business days with the right documentation. Here's the complete sequence.
                </p>
              </div>
            </Col>
          </Row>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 48px" }}>
            <ProcessStep n={1} delay={0}   title="Enter Georgia"        desc="A personal visit is mandatory. Citizens of 90+ countries can stay visa-free for up to 1 year. Rare exceptions via notarised power of attorney." />
            <ProcessStep n={3} delay={160} title="Submit Application"   desc="In-branch at TBC or online for expats. Multi-step compliance review for Russian/Belarusian nationals. Approval in 2–5 business days with partner support." />
            <ProcessStep n={2} delay={80}  title="Prepare Documents"    desc="Passport, proof of income (salary, business registration, freelance contracts, rental income). Open a Georgian bank account. Russians: ruble transfers direct from Russia are possible." />
            <ProcessStep n={4} delay={240} title="Valuation & Closing"  desc="Bank appraises the property — often below market. Signing at a notary. Down payment transfer completed (rubles accepted). Title registered on blockchain registry in 1 day." />
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
                <Eyebrow>Ready to apply?</Eyebrow>
                <h2 style={{ fontFamily: "Jun, serif", fontSize: "clamp(2rem,5vw,3.6rem)", fontWeight: 400, color: C.light, lineHeight: 1.1, marginBottom: "20px" }}>
                  We work with TBC Bank<br />
                  <em style={{ fontStyle: "italic", color: C.teal }}>directly.</em>
                </h2>
                <p style={{ fontFamily: "DM Sans", fontSize: "0.92rem", color: "rgba(255,251,240,0.5)", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto 40px" }}>
                  No residency required. We guide you through the full process — documents, compliance, bank submission. Conditions change; we have live data.
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  <Link href="/#contact">
                    <a style={{ display: "inline-block", fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark, background: C.teal, borderRadius: "8px", padding: "15px 36px", textDecoration: "none" }}>
                      Get a Free Consultation
                    </a>
                  </Link>
                  <a href="https://wa.me/995555505288" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", fontFamily: "DM Sans", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.light, background: "transparent", border: "1px solid rgba(255,251,240,0.2)", borderRadius: "8px", padding: "15px 36px", textDecoration: "none" }}>
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Footer />

    </div>
  
  </>);
}
