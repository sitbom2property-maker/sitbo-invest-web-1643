import { useEffect, useRef, useState } from "react";
import { RequestModal } from "../components/RequestModal";
import { useT, type MessageKey } from "../i18n";

/**
 * Why Georgia / Invest — first-person voice, home-v2 visual system:
 * Coolvetica / Inter · #21141A · wine #703C54 · light #FFFEF9 · teal #8CB2C0 at 10%
 */

type StatItem = {
  value?: string;
  valueKey?: MessageKey;
  labelKey: MessageKey;
  tone: "plum" | "green" | "white";
};

const STATS: StatItem[] = [
  { value: "13.2%", labelKey: "invest.why.stat1", tone: "green" },
  { value: "#1", labelKey: "invest.why.stat2", tone: "plum" },
  { value: "0%", labelKey: "invest.why.stat3", tone: "white" },
  { valueKey: "invest.why.stat4Value", labelKey: "invest.why.stat4", tone: "plum" },
  { value: "$1,420", labelKey: "invest.why.stat5", tone: "plum" },
  { value: "3.7M", labelKey: "invest.why.stat6", tone: "green" },
];

const ADVANTAGES = [
  { titleKey: "invest.advantage.purchaseTax.title" as MessageKey, subKey: "invest.advantage.purchaseTax.sub" as MessageKey },
  { titleKey: "invest.advantage.ownership.title" as MessageKey, subKey: "invest.advantage.ownership.sub" as MessageKey },
  { titleKey: "invest.advantage.registration.title" as MessageKey, subKey: "invest.advantage.registration.sub" as MessageKey },
  { titleKey: "invest.advantage.residency.title" as MessageKey, subKey: "invest.advantage.residency.sub" as MessageKey },
];

type Strategy = {
  tagKey: MessageKey;
  titleKey: MessageKey;
  yieldKey: MessageKey;
  horizonKey: MessageKey;
  riskKey: MessageKey;
  descKey: MessageKey;
  idealKey: MessageKey;
};

const STRATEGIES: Strategy[] = [
  {
    tagKey: "invest.strategy1.tag",
    titleKey: "invest.strategy1.title",
    yieldKey: "invest.strategy1.yield",
    horizonKey: "invest.strategy1.horizon",
    riskKey: "invest.strategy1.risk",
    descKey: "invest.strategy1.desc",
    idealKey: "invest.strategy1.ideal",
  },
  {
    tagKey: "invest.strategy2.tag",
    titleKey: "invest.strategy2.title",
    yieldKey: "invest.strategy2.yield",
    horizonKey: "invest.strategy2.horizon",
    riskKey: "invest.strategy2.risk",
    descKey: "invest.strategy2.desc",
    idealKey: "invest.strategy2.ideal",
  },
  {
    tagKey: "invest.strategy3.tag",
    titleKey: "invest.strategy3.title",
    yieldKey: "invest.strategy3.yield",
    horizonKey: "invest.strategy3.horizon",
    riskKey: "invest.strategy3.risk",
    descKey: "invest.strategy3.desc",
    idealKey: "invest.strategy3.ideal",
  },
  {
    tagKey: "invest.strategy4.tag",
    titleKey: "invest.strategy4.title",
    yieldKey: "invest.strategy4.yield",
    horizonKey: "invest.strategy4.horizon",
    riskKey: "invest.strategy4.risk",
    descKey: "invest.strategy4.desc",
    idealKey: "invest.strategy4.ideal",
  },
];

const PROCESS = [
  { n: "01", titleKey: "invest.process1.title" as MessageKey, descKey: "invest.process1.desc" as MessageKey },
  { n: "02", titleKey: "invest.process2.title" as MessageKey, descKey: "invest.process2.desc" as MessageKey },
  { n: "03", titleKey: "invest.process3.title" as MessageKey, descKey: "invest.process3.desc" as MessageKey },
  { n: "04", titleKey: "invest.process4.title" as MessageKey, descKey: "invest.process4.desc" as MessageKey },
  { n: "05", titleKey: "invest.process5.title" as MessageKey, descKey: "invest.process5.desc" as MessageKey },
  { n: "06", titleKey: "invest.process6.title" as MessageKey, descKey: "invest.process6.desc" as MessageKey },
];

const FAQS = [
  { qKey: "invest.faq.q1" as MessageKey, aKey: "invest.faq.a1" as MessageKey },
  { qKey: "invest.faq.q2" as MessageKey, aKey: "invest.faq.a2" as MessageKey },
  { qKey: "invest.faq.q3" as MessageKey, aKey: "invest.faq.a3" as MessageKey },
  { qKey: "invest.faq.q4" as MessageKey, aKey: "invest.faq.a4" as MessageKey },
  { qKey: "invest.faq.q5" as MessageKey, aKey: "invest.faq.a5" as MessageKey },
  { qKey: "invest.faq.q6" as MessageKey, aKey: "invest.faq.a6" as MessageKey },
];

const PRICE_BARS = [
  { cityKey: "invest.market.city.barcelona" as MessageKey, value: 5200, pct: 100 },
  { cityKey: "invest.market.city.lisbon" as MessageKey, value: 4800, pct: 92 },
  { cityKey: "invest.market.city.athens" as MessageKey, value: 3100, pct: 60 },
  { cityKey: "invest.market.city.tbilisi" as MessageKey, value: 1650, pct: 32 },
  { cityKey: "invest.market.city.batumi" as MessageKey, value: 1420, pct: 27 },
];

const YIELD_BARS = [
  { cityKey: "invest.market.city.batumi" as MessageKey, value: "13.2%", pct: 100 },
  { cityKey: "invest.market.city.tbilisi" as MessageKey, value: "8.5%", pct: 64 },
  { cityKey: "invest.market.city.athens" as MessageKey, value: "5.2%", pct: 39 },
  { cityKey: "invest.market.city.lisbon" as MessageKey, value: "3.8%", pct: 29 },
  { cityKey: "invest.market.city.barcelona" as MessageKey, value: "3.1%", pct: 23 },
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".iv .rv");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function StrategyItem({
  strategy,
  isOpen,
  onToggle,
}: {
  strategy: Strategy;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(0);
  const t = useT();

  useEffect(() => {
    if (!panelRef.current) return;
    setMaxHeight(isOpen ? panelRef.current.scrollHeight : 0);
  }, [isOpen]);

  return (
    <div className={`iv-acc${isOpen ? " is-open" : ""}`}>
      <button type="button" className="iv-acc-head" onClick={onToggle} aria-expanded={isOpen}>
        <span className="iv-acc-tag">{t(strategy.tagKey)}</span>
        <span className="iv-acc-title">{t(strategy.titleKey)}</span>
        <span className="iv-acc-yield">{t(strategy.yieldKey)}</span>
        <span className="iv-acc-toggle" aria-hidden>
          {isOpen ? "−" : "+"}
        </span>
      </button>
      <div className="iv-acc-panel" style={{ maxHeight }}>
        <div ref={panelRef} className="iv-acc-body">
          <div className="iv-acc-meta">
            <div>
              <span>{t("invest.strategy.horizon")}</span>
              <strong>{t(strategy.horizonKey)}</strong>
            </div>
            <div>
              <span>{t("invest.strategy.risk")}</span>
              <strong>{t(strategy.riskKey)}</strong>
            </div>
          </div>
          <p>{t(strategy.descKey)}</p>
          <p className="iv-acc-ideal">
            <strong>{t("invest.strategy.idealFor")}</strong> {t(strategy.idealKey)}
          </p>
        </div>
      </div>
    </div>
  );
}

function FaqItem({
  qKey,
  aKey,
  isOpen,
  onToggle,
}: {
  qKey: MessageKey;
  aKey: MessageKey;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const t = useT();
  return (
    <div className={`iv-faq${isOpen ? " is-open" : ""}`}>
      <button type="button" className="iv-faq-head" onClick={onToggle} aria-expanded={isOpen}>
        <span>{t(qKey)}</span>
        <span className="iv-faq-toggle" aria-hidden>
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && <p className="iv-faq-body">{t(aKey)}</p>}
    </div>
  );
}

const CSS = `
.iv {
  --bg-dark: #21141A;
  --bg-light: #FFFEF9;
  --text-light: #FFFEF9;
  --text-dark: #21141A;
  --card-gray: #463C41;
  --card-green: #48674D;
  --card-light: #FFFEF9;
  --accent-plum: #703C54;
  --accent-blue: #8CB2C0;
  --radius: 10px;
  --bg: var(--bg-dark);
  --card: var(--card-gray);
  --green: var(--card-green);
  --white: var(--bg-light);
  --panel: var(--bg-light);
  --display: 'Coolvetica', Inter, sans-serif;
  --body: 'Inter', sans-serif;
  --gutter: var(--site-gutter, clamp(30px, 5.5vw, 80px));
  --max: var(--site-max, 1440px);
  background: var(--bg);
  color: var(--white);
  font-family: var(--body);
  overflow-x: hidden;
  min-height: 100vh;
}
.iv .rv { opacity: 0; transform: translateY(22px); transition: opacity .7s ease, transform .7s ease; }
.iv .rv.in { opacity: 1; transform: none; }
.iv-wrap { max-width: var(--max); margin: 0 auto; padding: 0 var(--gutter); box-sizing: border-box; }

.iv-btn {
  display: inline-flex; align-items: center; justify-content: center;
  font-family: var(--body); font-size: 15px; font-weight: 400;
  padding: 15px 30px; border-radius: var(--radius); border: 1px solid transparent;
  cursor: pointer; text-decoration: none; white-space: nowrap;
  transition: background .2s, color .2s, border-color .2s, opacity .2s;
}
.iv-btn-white { background: var(--white); color: var(--bg); }
.iv-btn-white:hover { opacity: .88; }
.iv-btn-outline { background: transparent; color: var(--white); border-color: rgba(255,255,255,.55); }
.iv-btn-outline:hover { background: var(--white); color: var(--bg); }
.iv-btn-dark { background: var(--bg); color: var(--white); }
.iv-btn-dark:hover { opacity: .9; }

/* hero */
.iv-hero {
  position: relative;
  padding: clamp(48px, 7vw, 96px) 0 clamp(48px, 6vw, 88px);
  overflow: hidden;
}
.iv-hero-circle {
  position: absolute; top: -180px; right: -140px; width: 640px; height: 640px;
  border: 1px solid var(--green); border-radius: 50%; pointer-events: none;
}
.iv-hero-grid {
  position: relative; z-index: 1;
  display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: clamp(28px, 4vw, 64px); align-items: center;
}
.iv-hero-eyebrow {
  display: block; font-size: 13px; letter-spacing: .08em; text-transform: uppercase;
  color: var(--white); margin: 0 0 16px;
}
.iv-hero h1 {
  font-family: var(--display); font-weight: 600; margin: 0 0 18px;
  font-size: clamp(34px, 4.6vw, 64px); line-height: 1.08; letter-spacing: -.01em;
}
.iv-hero-lead {
  font-size: clamp(15px, 1.35vw, 18px); line-height: 1.5;
  color: var(--white); margin: 0 0 28px; max-width: 460px;
}
.iv-hero-btns { display: flex; gap: 14px; flex-wrap: wrap; }
.iv-hero-visual {
  border-radius: 2px; overflow: hidden; aspect-ratio: 4 / 5;
  max-height: min(68svh, 620px); justify-self: end; width: 100%;
}
.iv-hero-visual img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* why + stats */
.iv-why { padding: clamp(48px, 6vw, 88px) 0; }
.iv-split {
  display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start;
  margin-bottom: clamp(34px, 4vw, 58px);
}
.iv-split h2 {
  font-family: var(--display); font-weight: 600; margin: 0;
  font-size: clamp(28px, 3.4vw, 48px); line-height: 1.12;
}
.iv-split p {
  margin: 0; font-size: clamp(15px, 1.3vw, 18px); line-height: 1.5;
  color: var(--white); max-width: 420px;
}
.iv-stats {
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px;
}
.iv-stat {
  aspect-ratio: 1 / 1; border-radius: 10px; padding: clamp(16px, 1.7vw, 26px);
  display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;
}
.iv-stat-plum { background: var(--card); }
.iv-stat-green { background: var(--green); }
.iv-stat-white { background: var(--white); color: var(--bg); }
.iv-stat-value {
  font-family: var(--body); font-weight: 600;
  font-size: clamp(28px, 3.2vw, 42px); line-height: 1; letter-spacing: -.02em;
}
.iv-stat-label {
  font-size: clamp(13px, 1.1vw, 15px); line-height: 1.35;
  color: var(--white); max-width: 16ch;
}
.iv-stat-white .iv-stat-label { color: inherit; opacity: .65; }

.iv-quote {
  margin-top: clamp(36px, 4vw, 56px);
  padding-top: clamp(28px, 3vw, 40px);
  border-top: 1px solid rgba(255,255,255,.12);
  max-width: 720px;
  scroll-margin-top: calc(var(--nav-height, 88px) + 24px);
}
.iv-quote .iv-panel-eyebrow { display: block; margin-bottom: 14px; }
.iv-quote blockquote {
  font-family: var(--body); font-weight: 400; margin: 0 0 12px;
  font-size: clamp(20px, 2.2vw, 28px); line-height: 1.3;
}
.iv-quote cite {
  font-style: normal; font-size: 14px; color: var(--white);
}

/* advantages */
.iv-adv { padding: 0 0 clamp(48px, 6vw, 88px); }
.iv-adv-grid {
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px;
}
.iv-adv-card {
  background: var(--card); border-radius: 10px;
  padding: clamp(20px, 2.2vw, 28px);
}
.iv-adv-card h3 {
  font-family: var(--display); font-weight: 600; margin: 0 0 8px;
  font-size: clamp(17px, 1.5vw, 20px); line-height: 1.25;
}
.iv-adv-card p {
  margin: 0; font-size: 14px; line-height: 1.45; color: var(--white);
}

/* panel sections */
.iv-panel-outer {
  max-width: var(--max); margin: 0 auto;
  padding: 0 var(--gutter) clamp(40px, 5vw, 72px);
  box-sizing: border-box;
}
.iv-panel {
  background: var(--panel); color: var(--bg); border-radius: 10px;
  padding: clamp(28px, 4vw, 56px) clamp(20px, 4vw, 56px);
}
.iv-panel-head {
  display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
  margin-bottom: clamp(28px, 4vw, 44px); align-items: start;
}
.iv-panel-eyebrow {
  display: block; font-size: 13px; letter-spacing: .08em; text-transform: uppercase;
  color: rgba(33,20,26,.4); margin: 0 0 10px;
}
.iv-panel-head h2 {
  font-family: var(--display); font-weight: 600; margin: 0;
  font-size: clamp(26px, 3.2vw, 44px); line-height: 1.12; color: var(--bg);
}
.iv-panel-head p {
  margin: 0; font-size: clamp(14px, 1.2vw, 16px); line-height: 1.5;
  color: rgba(33,20,26,.65); max-width: 380px; justify-self: end;
}

/* strategy accordion */
.iv-acc { border-bottom: 1px solid rgba(33,20,26,.12); }
.iv-acc:first-child { border-top: 1px solid rgba(33,20,26,.12); }
.iv-acc-head {
  width: 100%; display: grid;
  grid-template-columns: 110px 1fr auto auto;
  gap: 16px; align-items: center; padding: 22px 0;
  border: none; background: transparent; cursor: pointer; text-align: left;
}
.iv-acc-tag {
  font-size: 12px; letter-spacing: .06em; text-transform: uppercase;
  color: rgba(33,20,26,.4);
}
.iv-acc-title {
  font-family: var(--display); font-weight: 600;
  font-size: clamp(18px, 2vw, 26px); color: var(--bg); line-height: 1.2;
}
.iv-acc-yield {
  font-family: var(--body); font-weight: 600; font-size: 15px; color: var(--green);
  white-space: nowrap;
}
.iv-acc-toggle {
  width: 36px; height: 36px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--bg); color: var(--white); font-size: 20px; line-height: 1;
}
.iv-acc.is-open .iv-acc-toggle { background: var(--green); }
.iv-acc-panel { overflow: hidden; transition: max-height .4s ease; }
.iv-acc-body { padding: 0 0 26px 126px; max-width: 720px; }
.iv-acc-meta {
  display: flex; gap: 32px; flex-wrap: wrap; margin-bottom: 14px;
}
.iv-acc-meta span {
  display: block; font-size: 12px; letter-spacing: .06em; text-transform: uppercase;
  color: rgba(33,20,26,.4); margin-bottom: 4px;
}
.iv-acc-meta strong {
  font-family: var(--body); font-weight: 600; font-size: 15px; color: var(--bg);
}
.iv-acc-body p {
  margin: 0 0 12px; font-size: 15px; line-height: 1.55; color: rgba(33,20,26,.72);
}
.iv-acc-ideal { color: rgba(33,20,26,.85) !important; }

/* market */
.iv-market { padding: clamp(48px, 6vw, 88px) 0; }
.iv-market-head { margin-bottom: clamp(28px, 4vw, 44px); max-width: 560px; }
.iv-market-head .iv-panel-eyebrow { color: var(--white); }
.iv-market-head h2 {
  font-family: var(--display); font-weight: 600; margin: 0;
  font-size: clamp(28px, 3.4vw, 48px); line-height: 1.12;
}
.iv-charts {
  display: grid; grid-template-columns: 1fr 1fr; gap: clamp(28px, 4vw, 56px);
}
.iv-chart h3 {
  font-family: var(--body); font-size: 14px; font-weight: 500; margin: 0 0 20px;
  color: var(--white);
}
.iv-bar-row {
  display: grid; grid-template-columns: 88px 1fr auto; gap: 12px;
  align-items: center; margin-bottom: 12px;
}
.iv-bar-row span:first-child { font-size: 14px; color: var(--white); }
.iv-bar-row span:last-child {
  font-size: 13px; font-variant-numeric: tabular-nums; color: var(--white); min-width: 4.5ch; text-align: right;
}
.iv-bar-track {
  height: 8px; border-radius: 10px; background: rgba(255,255,255,.08); overflow: hidden;
}
.iv-bar-fill {
  height: 100%; border-radius: 10px; background: var(--green);
  transform-origin: left center;
}

/* process */
.iv-process { padding: 0 0 clamp(48px, 6vw, 88px); }
.iv-process-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 0 48px;
}
.iv-step {
  display: grid; grid-template-columns: 48px 1fr; gap: 16px;
  padding: 22px 0; border-bottom: 1px solid rgba(255,255,255,.1);
}
.iv-step-n {
  width: 48px; height: 48px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,.28);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-variant-numeric: tabular-nums; color: var(--white);
}
.iv-step h3 {
  font-family: var(--display); font-weight: 600; margin: 0 0 6px;
  font-size: clamp(17px, 1.5vw, 20px);
}
.iv-step p {
  margin: 0; font-size: 14px; line-height: 1.5; color: var(--white);
}

/* faq */
.iv-faq-grid {
  display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: clamp(28px, 4vw, 48px); align-items: start;
}
.iv-faq { border-bottom: 1px solid rgba(33,20,26,.12); }
.iv-faq:first-child { border-top: 1px solid rgba(33,20,26,.12); }
.iv-faq-head {
  width: 100%; display: flex; justify-content: space-between; align-items: center;
  gap: 16px; padding: 20px 0; border: none; background: transparent;
  cursor: pointer; text-align: left;
  font-family: var(--body); font-size: 16px; font-weight: 500; color: var(--bg);
}
.iv-faq-toggle {
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--bg); color: var(--white); font-size: 18px; line-height: 1;
}
.iv-faq.is-open .iv-faq-toggle { background: var(--green); }
.iv-faq-body {
  margin: 0 0 20px; padding-right: 40px;
  font-size: 15px; line-height: 1.55; color: rgba(33,20,26,.68);
}
.iv-faq-aside {
  background: var(--bg); color: var(--white); border-radius: 10px;
  padding: clamp(24px, 3vw, 36px);
  position: sticky; top: calc(var(--nav-height, 88px) + 16px);
}
.iv-faq-aside h3 {
  font-family: var(--display); font-weight: 600; margin: 0 0 10px;
  font-size: clamp(22px, 2.2vw, 28px); line-height: 1.2;
}
.iv-faq-aside p {
  margin: 0 0 22px; font-size: 14px; line-height: 1.5; color: var(--white);
}

/* cta */
.iv-cta-outer {
  max-width: var(--max); margin: 0 auto;
  padding: 0 var(--gutter) clamp(56px, 7vw, 100px);
  box-sizing: border-box;
}
.iv-cta {
  border-radius: 10px; overflow: hidden;
  background:
    radial-gradient(100% 140% at 90% 50%, rgba(112,60,84,.55) 0%, rgba(33,20,26,0) 55%),
    var(--card);
  padding: clamp(40px, 5vw, 72px) clamp(24px, 4vw, 64px);
  text-align: center;
}
.iv-cta .iv-panel-eyebrow { color: var(--white); }
.iv-cta h2 {
  font-family: var(--display); font-weight: 600; margin: 0 0 14px;
  font-size: clamp(28px, 3.6vw, 48px); line-height: 1.12;
}
.iv-cta p {
  margin: 0 auto 28px; max-width: 480px;
  font-size: clamp(15px, 1.3vw, 17px); line-height: 1.5; color: var(--white);
}

@media (max-width: 1024px) {
  .iv-hero-grid, .iv-split, .iv-charts, .iv-process-grid, .iv-faq-grid, .iv-panel-head {
    grid-template-columns: 1fr;
  }
  .iv-stats { grid-template-columns: repeat(2, 1fr); }
  .iv-adv-grid { grid-template-columns: repeat(2, 1fr); }
  .iv-hero-visual { justify-self: start; max-height: 480px; aspect-ratio: 16 / 11; }
  .iv-panel-head p { justify-self: start; }
  .iv-acc-head { grid-template-columns: 1fr auto auto; gap: 10px; }
  .iv-acc-tag { display: none; }
  .iv-acc-body { padding-left: 0; }
  .iv-faq-aside { position: static; }
}
@media (max-width: 640px) {
  .iv-hero { padding-top: 36px; }
  .iv-hero-circle { width: 380px; height: 380px; top: -120px; right: -120px; }
  .iv-hero-btns .iv-btn { width: 100%; }
  .iv-adv-grid { grid-template-columns: 1fr; }
  .iv-acc-yield { font-size: 13px; }
}
`;

export default function InvestPage() {
  const t = useT();
  const [openStrategy, setOpenStrategy] = useState(0);
  const [openFaq, setOpenFaq] = useState(-1);
  const [modalOpen, setModalOpen] = useState(false);
  useReveal();

  return (
    <div className="iv">
      <style>{CSS}</style>

      <section className="iv-hero">
        <span className="iv-hero-circle" aria-hidden="true" />
        <div className="iv-wrap iv-hero-grid">
          <div className="rv">
            <span className="iv-hero-eyebrow">{t("invest.hero.eyebrow")}</span>
            <h1>
              {t("invest.hero.line1")}
              <br />
              {t("invest.hero.line2")}
              <br />
              {t("invest.hero.line3")}
            </h1>
            <p className="iv-hero-lead">{t("invest.hero.body")}</p>
            <div className="iv-hero-btns">
              <button type="button" className="iv-btn iv-btn-white" onClick={() => setModalOpen(true)}>
                {t("invest.hero.ctaConsultation")}
              </button>
              <a href="#strategies" className="iv-btn iv-btn-outline">
                {t("invest.hero.ctaStrategies")}
              </a>
            </div>
          </div>
          <div className="iv-hero-visual rv">
            <img src="/home/rd-waterfront.jpg" alt={t("invest.hero.imageAlt")} />
          </div>
        </div>
      </section>

      <section className="iv-why" id="why-georgia">
        <div className="iv-wrap">
          <div className="iv-split rv">
            <h2>{t("invest.why.title")}</h2>
            <p>{t("invest.why.body")}</p>
          </div>
          <div className="iv-stats rv">
            {STATS.map((s) => (
              <div key={s.labelKey} className={`iv-stat iv-stat-${s.tone}`}>
                <span className="iv-stat-value">{s.valueKey ? t(s.valueKey) : s.value}</span>
                <span className="iv-stat-label">{t(s.labelKey)}</span>
              </div>
            ))}
          </div>
          <div className="iv-quote rv" id="notes">
            <span className="iv-panel-eyebrow" style={{ color: "var(--white)" }}>
              {t("v2.quote.eyebrow")}
            </span>
            <blockquote>{t("invest.why.quote")}</blockquote>
            <cite>{t("invest.why.quoteAttr")}</cite>
          </div>
        </div>
      </section>

      <section className="iv-adv">
        <div className="iv-wrap">
          <div className="iv-adv-grid rv">
            {ADVANTAGES.map((a) => (
              <div key={a.titleKey} className="iv-adv-card">
                <h3>{t(a.titleKey)}</h3>
                <p>{t(a.subKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="iv-panel-outer" id="strategies">
        <div className="iv-panel rv">
          <div className="iv-panel-head">
            <div>
              <span className="iv-panel-eyebrow">{t("invest.strategies.eyebrow")}</span>
              <h2>{t("invest.strategies.title")}</h2>
            </div>
            <p>{t("invest.strategies.body")}</p>
          </div>
          {STRATEGIES.map((strategy, index) => (
            <StrategyItem
              key={strategy.tagKey}
              strategy={strategy}
              isOpen={openStrategy === index}
              onToggle={() => setOpenStrategy(openStrategy === index ? -1 : index)}
            />
          ))}
        </div>
      </section>

      <section className="iv-market">
        <div className="iv-wrap">
          <div className="iv-market-head rv">
            <span className="iv-panel-eyebrow">{t("invest.market.eyebrow")}</span>
            <h2>{t("invest.market.title")}</h2>
          </div>
          <div className="iv-charts rv">
            <div className="iv-chart">
              <h3>{t("invest.market.priceComparison")}</h3>
              {PRICE_BARS.map((row) => (
                <div key={row.cityKey} className="iv-bar-row">
                  <span>{t(row.cityKey)}</span>
                  <div className="iv-bar-track">
                    <div className="iv-bar-fill" style={{ width: `${row.pct}%` }} />
                  </div>
                  <span>${row.value.toLocaleString("en-US")}</span>
                </div>
              ))}
            </div>
            <div className="iv-chart">
              <h3>{t("invest.market.yieldComparison")}</h3>
              {YIELD_BARS.map((row) => (
                <div key={row.cityKey} className="iv-bar-row">
                  <span>{t(row.cityKey)}</span>
                  <div className="iv-bar-track">
                    <div className="iv-bar-fill" style={{ width: `${row.pct}%` }} />
                  </div>
                  <span>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="iv-process" id="process">
        <div className="iv-wrap">
          <div className="iv-split rv">
            <h2>{t("invest.process.title")}</h2>
            <p>{t("invest.process.body")}</p>
          </div>
          <div className="iv-process-grid rv">
            {PROCESS.map((step) => (
              <div key={step.n} className="iv-step">
                <span className="iv-step-n">{step.n}</span>
                <div>
                  <h3>{t(step.titleKey)}</h3>
                  <p>{t(step.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="iv-panel-outer">
        <div className="iv-panel rv">
          <div className="iv-panel-head">
            <div>
              <span className="iv-panel-eyebrow">{t("invest.faq.eyebrow")}</span>
              <h2>{t("invest.faq.title")}</h2>
            </div>
            <p>{t("invest.faq.body")}</p>
          </div>
          <div className="iv-faq-grid">
            <div>
              {FAQS.map((faq, index) => (
                <FaqItem
                  key={faq.qKey}
                  qKey={faq.qKey}
                  aKey={faq.aKey}
                  isOpen={openFaq === index}
                  onToggle={() => setOpenFaq(openFaq === index ? -1 : index)}
                />
              ))}
            </div>
            <aside className="iv-faq-aside">
              <h3>{t("invest.faq.moreQuestions")}</h3>
              <p>{t("invest.faq.talkDirectly")}</p>
              <button type="button" className="iv-btn iv-btn-white" onClick={() => setModalOpen(true)}>
                {t("invest.cta.button")}
              </button>
            </aside>
          </div>
        </div>
      </section>

      <section className="iv-cta-outer">
        <div className="iv-cta rv">
          <span className="iv-panel-eyebrow">{t("invest.cta.eyebrow")}</span>
          <h2>{t("invest.cta.title")}</h2>
          <p>{t("invest.cta.body")}</p>
          <button type="button" className="iv-btn iv-btn-white" onClick={() => setModalOpen(true)}>
            {t("invest.cta.button")}
          </button>
        </div>
      </section>

      <RequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        source="Invest page — Why Georgia"
        title={t("invest.cta.button")}
      />
    </div>
  );
}
