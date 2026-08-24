import { useEffect, useRef, useState } from "react";
import { RequestModal } from "../components/RequestModal";
import { useT, type MessageKey } from "../i18n";

/**
 * Why Georgia / Invest — Figma redesign:
 * light hero + mosaic, diplomacy slider, blockchain timeline,
 * awards, early band, strategies, market, process, FAQ, CTA.
 */

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
  { qKey: "invest.faq.q7" as MessageKey, aKey: "invest.faq.a7" as MessageKey },
  { qKey: "invest.faq.q8" as MessageKey, aKey: "invest.faq.a8" as MessageKey },
  { qKey: "invest.faq.q9" as MessageKey, aKey: "invest.faq.a9" as MessageKey },
  { qKey: "invest.faq.q10" as MessageKey, aKey: "invest.faq.a10" as MessageKey },
  { qKey: "invest.faq.q11" as MessageKey, aKey: "invest.faq.a11" as MessageKey },
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

const DIPLOMACY = [
  { titleKey: "invest.diplomacy1.title" as MessageKey, bodyKey: "invest.diplomacy1.body" as MessageKey },
  { titleKey: "invest.diplomacy2.title" as MessageKey, bodyKey: "invest.diplomacy2.body" as MessageKey },
  { titleKey: "invest.diplomacy3.title" as MessageKey, bodyKey: "invest.diplomacy3.body" as MessageKey },
];

const CHAIN = [
  {
    titleKey: "invest.chain.2016.title" as MessageKey,
    bodyKey: "invest.chain.2016.body" as MessageKey,
    img: "/why-georgia/chain-2016.jpg",
  },
  {
    titleKey: "invest.chain.2017.title" as MessageKey,
    bodyKey: "invest.chain.2017.body" as MessageKey,
    img: "/why-georgia/chain-2017.jpg",
  },
  {
    titleKey: "invest.chain.today.title" as MessageKey,
    bodyKey: "invest.chain.today.body" as MessageKey,
    img: "/why-georgia/chain-today.jpg",
  },
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
  --card-plum: #412834;
  --card-green: #48674D;
  --card-muted: #E8E4DF;
  --green: #48674D;
  --white: #FFFEF9;
  --display: 'JUN', Georgia, serif;
  --body: 'Nunito', sans-serif;
  --gutter: var(--site-gutter, clamp(30px, 5.5vw, 80px));
  --max: var(--site-max, 1440px);
  --radius: 20px;
  --radius-sm: 2px;
  background: var(--bg-light);
  color: var(--text-dark);
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
  padding: 15px 30px; border-radius: var(--radius-sm); border: 1px solid transparent;
  cursor: pointer; text-decoration: none; white-space: nowrap;
  transition: background .2s, color .2s, border-color .2s, opacity .2s;
}
.iv-btn-white { background: var(--white); color: var(--bg-dark); }
.iv-btn-white:hover { opacity: .88; }
.iv-btn-dark { background: var(--bg-dark); color: var(--white); }
.iv-btn-dark:hover { opacity: .9; }

/* hero */
.iv-hero {
  background: var(--bg-light);
  padding: clamp(48px, 7vw, 96px) 0 clamp(28px, 4vw, 48px);
}
.iv-hero-grid {
  display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: clamp(24px, 4vw, 64px); align-items: start;
}
.iv-hero h1 {
  font-family: var(--display); font-weight: 600; margin: 0;
  font-size: clamp(34px, 4.8vw, 64px); line-height: 1.05; letter-spacing: -.01em;
  color: var(--text-dark);
}
.iv-hero-lead {
  margin: 0; font-size: clamp(14px, 1.2vw, 16px); line-height: 1.5;
  color: rgba(33,20,26,.78); max-width: 420px; justify-self: end;
}

/* mosaic */
.iv-mosaic {
  padding: 0 0 clamp(48px, 6vw, 88px);
  background: var(--bg-light);
}
.iv-mosaic-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(12px, 1.4vw, 18px);
}
.iv-tile {
  border-radius: var(--radius); overflow: hidden; min-height: 220px;
  display: flex; flex-direction: column; justify-content: space-between;
  padding: 22px 20px; box-sizing: border-box;
}
.iv-tile-img { padding: 0; min-height: 220px; }
.iv-tile-img img { width: 100%; height: 100%; object-fit: cover; display: block; min-height: 220px; }
.iv-tile-plum { background: var(--card-plum); color: var(--white); }
.iv-tile-green { background: var(--card-green); color: var(--white); }
.iv-tile-muted { background: var(--card-muted); color: var(--text-dark); }
.iv-tile-value {
  font-family: var(--display); font-weight: 600;
  font-size: clamp(36px, 3.6vw, 52px); line-height: 1; margin: 0 0 10px;
}
.iv-tile-label { font-size: 14px; line-height: 1.35; margin: 0; }
.iv-tile-source { font-size: 12px; opacity: .7; margin-top: auto; padding-top: 18px; }
.iv-tile-center {
  justify-content: center; text-align: center;
  font-size: clamp(16px, 1.35vw, 20px); line-height: 1.35; font-weight: 500;
}
.iv-tile-body { font-size: 13px; line-height: 1.4; margin: 12px 0 0; opacity: .85; }

/* diplomacy slider */
.iv-diplomacy {
  background: var(--bg-dark); color: var(--white);
  padding: clamp(56px, 7vw, 100px) 0;
}
.iv-diplomacy-row {
  display: grid; grid-template-columns: 1fr auto; gap: 24px; align-items: center;
}
.iv-diplomacy h2 {
  font-family: var(--display); font-weight: 600; margin: 0 0 18px;
  font-size: clamp(28px, 3.6vw, 48px); line-height: 1.12; max-width: 720px;
}
.iv-diplomacy p {
  margin: 0; font-size: clamp(15px, 1.25vw, 17px); line-height: 1.5;
  color: rgba(255,254,249,.82); max-width: 720px;
}
.iv-diplomacy-next {
  width: 56px; height: 56px; border-radius: 50%;
  border: 1px solid rgba(255,254,249,.45); background: transparent; color: var(--white);
  font-size: 28px; line-height: 1; cursor: pointer; flex-shrink: 0;
  transition: background .2s, color .2s;
}
.iv-diplomacy-next:hover { background: var(--white); color: var(--bg-dark); }
.iv-diplomacy-dots { display: flex; gap: 8px; margin-top: 28px; }
.iv-diplomacy-dots button {
  width: 8px; height: 8px; border-radius: 50%; border: none; padding: 0;
  background: rgba(255,254,249,.28); cursor: pointer;
}
.iv-diplomacy-dots button.is-active { background: var(--white); }

/* blockchain */
.iv-chain {
  background: var(--bg-light); color: var(--text-dark);
  padding: clamp(56px, 7vw, 100px) 0;
}
.iv-chain-head {
  display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start;
  margin-bottom: clamp(28px, 4vw, 44px);
}
.iv-chain-head h2 {
  font-family: var(--display); font-weight: 600; margin: 0;
  font-size: clamp(28px, 3.4vw, 48px); line-height: 1.12;
}
.iv-chain-head p {
  margin: 0; font-size: 15px; line-height: 1.5; color: rgba(33,20,26,.78);
}
.iv-chain-rail {
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(12px, 1.4vw, 18px);
}
.iv-chain-card {
  position: relative; border-radius: var(--radius); overflow: hidden;
  min-height: clamp(320px, 36vw, 460px);
  background: var(--card-plum); color: var(--white);
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 24px; box-sizing: border-box;
}
.iv-chain-card img {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; display: block;
}
.iv-chain-card::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(33,20,26,.15) 20%, rgba(33,20,26,.88) 78%);
}
.iv-chain-card > * { position: relative; z-index: 1; }
.iv-chain-card h3 {
  font-family: var(--display); font-weight: 600; margin: 0 0 10px;
  font-size: clamp(28px, 2.8vw, 40px); line-height: 1;
}
.iv-chain-card p { margin: 0; font-size: 13px; line-height: 1.45; color: rgba(255,254,249,.9); }

/* awards */
.iv-awards {
  background: var(--bg-light); color: var(--text-dark);
  padding: 0 0 clamp(48px, 6vw, 80px);
  text-align: center;
}
.iv-awards h2 {
  font-family: var(--display); font-weight: 600; margin: 0 0 clamp(28px, 4vw, 48px);
  font-size: clamp(28px, 3.6vw, 48px); line-height: 1.12;
}
.iv-awards img {
  width: 100%; max-width: 1100px; height: auto; display: block; margin: 0 auto;
}

/* early band */
.iv-early {
  background: var(--bg-dark); color: var(--white);
  padding: clamp(64px, 8vw, 120px) 0;
}
.iv-early h2 {
  font-family: var(--display); font-weight: 600; margin: 0;
  font-size: clamp(36px, 5vw, 64px); line-height: 1.08;
}

/* strategies panel */
.iv-panel-outer {
  background: var(--bg-dark);
  padding: 0 var(--gutter) clamp(40px, 5vw, 72px);
}
.iv-panel {
  max-width: var(--max); margin: 0 auto;
  background: var(--bg-light); color: var(--text-dark);
  border-radius: var(--radius) var(--radius) 0 0;
  padding: clamp(36px, 5vw, 64px) clamp(22px, 4vw, 56px);
}
.iv-panel-head {
  display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 28px; align-items: start;
  margin-bottom: clamp(24px, 3vw, 36px);
}
.iv-panel-eyebrow {
  display: block; font-size: 12px; letter-spacing: .08em; text-transform: uppercase;
  color: rgba(33,20,26,.45); margin: 0 0 10px;
}
.iv-panel-head h2 {
  font-family: var(--display); font-weight: 600; margin: 0;
  font-size: clamp(28px, 3.4vw, 44px); line-height: 1.12;
}
.iv-panel-head p {
  margin: 0; font-size: 14px; line-height: 1.5; color: rgba(33,20,26,.62);
  text-align: right;
}

.iv-acc { border-top: 1px solid rgba(33,20,26,.1); }
.iv-acc:last-child { border-bottom: 1px solid rgba(33,20,26,.1); }
.iv-acc-head {
  width: 100%; display: grid;
  grid-template-columns: 110px 1fr auto auto; gap: 16px; align-items: center;
  padding: 22px 0; border: none; background: transparent; cursor: pointer;
  text-align: left; color: inherit; font-family: inherit;
}
.iv-acc-tag { font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: rgba(33,20,26,.45); }
.iv-acc-title { font-size: clamp(18px, 1.6vw, 22px); font-weight: 500; }
.iv-acc-yield { font-size: 15px; color: rgba(33,20,26,.7); white-space: nowrap; }
.iv-acc-toggle {
  width: 34px; height: 34px; border-radius: 50%;
  background: var(--green); color: var(--white);
  display: inline-flex; align-items: center; justify-content: center; font-size: 20px;
}
.iv-acc-panel { overflow: hidden; transition: max-height .35s ease; }
.iv-acc-body { padding: 0 0 24px 126px; max-width: 720px; }
.iv-acc-meta {
  display: flex; gap: 32px; margin-bottom: 14px; flex-wrap: wrap;
}
.iv-acc-meta span { display: block; font-size: 12px; color: rgba(33,20,26,.45); margin-bottom: 4px; }
.iv-acc-meta strong { font-size: 14px; font-weight: 500; }
.iv-acc-body p { margin: 0 0 12px; font-size: 15px; line-height: 1.5; color: rgba(33,20,26,.78); }
.iv-acc-ideal { margin-bottom: 0 !important; }

/* market + process */
.iv-market, .iv-process {
  background: var(--bg-dark); color: var(--white);
  padding: clamp(48px, 6vw, 88px) 0;
}
.iv-market h2, .iv-process h2 {
  font-family: var(--display); font-weight: 600; margin: 0 0 clamp(28px, 4vw, 44px);
  font-size: clamp(28px, 3.6vw, 48px); line-height: 1.12;
}
.iv-charts {
  display: grid; grid-template-columns: 1fr 1fr; gap: clamp(28px, 4vw, 56px);
}
.iv-chart h3 { margin: 0 0 20px; font-size: 15px; font-weight: 500; color: rgba(255,254,249,.75); }
.iv-bar-row {
  display: grid; grid-template-columns: 90px 1fr 64px; gap: 12px; align-items: center;
  margin-bottom: 12px; font-size: 13px;
}
.iv-bar-track { height: 10px; background: rgba(255,254,249,.12); border-radius: 2px; overflow: hidden; }
.iv-bar-fill { height: 100%; background: var(--green); border-radius: 2px; }
.iv-process-head {
  display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: start;
  margin-bottom: clamp(28px, 4vw, 44px);
}
.iv-process-head h2 { margin: 0; }
.iv-process-head p { margin: 0; font-size: 15px; line-height: 1.5; color: rgba(255,254,249,.78); }
.iv-process-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 22px 40px;
}
.iv-step { display: grid; grid-template-columns: 42px 1fr; gap: 14px; }
.iv-step-n {
  font-family: var(--display); font-size: 22px; color: rgba(255,254,249,.45);
}
.iv-step h3 { margin: 0 0 6px; font-size: 17px; font-weight: 500; }
.iv-step p { margin: 0; font-size: 14px; line-height: 1.45; color: rgba(255,254,249,.72); }

/* FAQ */
.iv-faq-outer {
  background: var(--bg-dark);
  padding: 0 var(--gutter) clamp(40px, 5vw, 72px);
}
.iv-faq-panel {
  max-width: var(--max); margin: 0 auto;
  background: var(--bg-light); color: var(--text-dark);
  border-radius: var(--radius);
  padding: clamp(36px, 5vw, 64px) clamp(22px, 4vw, 56px);
}
.iv-faq { border-top: 1px solid rgba(33,20,26,.1); }
.iv-faq:last-child { border-bottom: 1px solid rgba(33,20,26,.1); }
.iv-faq-head {
  width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 16px;
  padding: 20px 0; border: none; background: transparent; cursor: pointer;
  text-align: left; color: inherit; font: inherit; font-size: 16px;
}
.iv-faq-toggle {
  width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
  background: var(--bg-dark); color: var(--white);
  display: inline-flex; align-items: center; justify-content: center; font-size: 20px;
}
.iv-faq-body {
  margin: 0 0 20px; max-width: 720px;
  font-size: 15px; line-height: 1.5; color: rgba(33,20,26,.72);
}

/* CTA */
.iv-cta-outer {
  background: var(--bg-dark);
  padding: 0 var(--gutter) clamp(56px, 7vw, 100px);
}
.iv-cta {
  max-width: var(--max); margin: 0 auto;
  border-radius: var(--radius-sm); overflow: hidden;
  background-color: #412834;
  background-image: url('/images/cta-bg.jpg');
  background-size: cover; background-position: center;
  padding: clamp(48px, 6vw, 80px) clamp(24px, 4vw, 64px);
  text-align: center; color: var(--white);
}
.iv-cta .iv-panel-eyebrow { color: rgba(255,254,249,.65); }
.iv-cta h2 {
  font-family: var(--display); font-weight: 600; margin: 0 0 14px;
  font-size: clamp(28px, 3.6vw, 48px); line-height: 1.12;
}
.iv-cta p {
  margin: 0 auto 28px; max-width: 520px;
  font-size: clamp(15px, 1.3vw, 17px); line-height: 1.5; color: rgba(255,254,249,.85);
}

@media (max-width: 1000px) {
  .iv-hero-grid, .iv-chain-head, .iv-panel-head, .iv-process-head, .iv-charts { grid-template-columns: 1fr; }
  .iv-hero-lead, .iv-panel-head p { justify-self: start; text-align: left; max-width: none; }
  .iv-mosaic-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .iv-chain-rail { grid-template-columns: 1fr; }
  .iv-acc-head { grid-template-columns: 1fr auto auto; }
  .iv-acc-tag { display: none; }
  .iv-acc-body { padding-left: 0; }
  .iv-process-grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .iv-mosaic-grid { grid-template-columns: 1fr; }
  .iv-diplomacy-row { grid-template-columns: 1fr; }
  .iv-diplomacy-next { justify-self: start; }
}
`;

export default function InvestPage() {
  const t = useT();
  const [openStrategy, setOpenStrategy] = useState(0);
  const [openFaq, setOpenFaq] = useState(-1);
  const [modalOpen, setModalOpen] = useState(false);
  const [diplomacyIndex, setDiplomacyIndex] = useState(0);
  useReveal();

  const diplomacy = DIPLOMACY[diplomacyIndex];

  return (
    <div className="iv">
      <style>{CSS}</style>

      <section className="iv-hero" id="why-georgia">
        <div className="iv-wrap iv-hero-grid rv">
          <h1>
            {t("invest.hero.line1")}
            <br />
            {t("invest.hero.line2")}
          </h1>
          <p className="iv-hero-lead">{t("invest.hero.body")}</p>
        </div>
      </section>

      <section className="iv-mosaic">
        <div className="iv-wrap">
          <div className="iv-mosaic-grid rv">
            <div className="iv-tile iv-tile-plum">
              <div>
                <p className="iv-tile-value">{t("invest.mosaic.visitorsValue")}</p>
                <p className="iv-tile-label">{t("invest.mosaic.visitorsLabel")}</p>
              </div>
              <p className="iv-tile-source">{t("invest.mosaic.visitorsSource")}</p>
            </div>
            <div className="iv-tile iv-tile-img">
              <img src="/why-georgia/img-horse.jpg" alt={t("invest.mosaic.horseAlt")} />
            </div>
            <div className="iv-tile iv-tile-plum iv-tile-center">{t("invest.mosaic.destination")}</div>
            <div className="iv-tile iv-tile-img">
              <img src="/why-georgia/img-sea.jpg" alt={t("invest.mosaic.seaAlt")} />
            </div>
            <div className="iv-tile iv-tile-img">
              <img src="/why-georgia/img-food.jpg" alt={t("invest.mosaic.foodAlt")} />
            </div>
            <div className="iv-tile iv-tile-green">
              <div>
                <p className="iv-tile-value">{t("invest.mosaic.yieldValue")}</p>
                <p className="iv-tile-label">{t("invest.mosaic.yieldLabel")}</p>
              </div>
            </div>
            <div className="iv-tile iv-tile-muted">
              <div>
                <p className="iv-tile-value">{t("invest.mosaic.yearsValue")}</p>
                <p className="iv-tile-label">{t("invest.mosaic.yearsLabel")}</p>
                <p className="iv-tile-body">{t("invest.mosaic.yearsBody")}</p>
              </div>
            </div>
            <div className="iv-tile iv-tile-img">
              <img src="/why-georgia/img-wine.jpg" alt={t("invest.mosaic.wineAlt")} />
            </div>
          </div>
        </div>
      </section>

      <section className="iv-diplomacy">
        <div className="iv-wrap">
          <div className="iv-diplomacy-row rv">
            <div>
              <h2>{t(diplomacy.titleKey)}</h2>
              <p>{t(diplomacy.bodyKey)}</p>
              <div className="iv-diplomacy-dots" role="tablist" aria-label="Diplomacy slides">
                {DIPLOMACY.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={i === diplomacyIndex ? "is-active" : undefined}
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => setDiplomacyIndex(i)}
                  />
                ))}
              </div>
            </div>
            <button
              type="button"
              className="iv-diplomacy-next"
              aria-label={t("invest.diplomacy.next")}
              onClick={() => setDiplomacyIndex((i) => (i + 1) % DIPLOMACY.length)}
            >
              ›
            </button>
          </div>
        </div>
      </section>

      <section className="iv-chain">
        <div className="iv-wrap">
          <div className="iv-chain-head rv">
            <h2>{t("invest.chain.title")}</h2>
            <p>{t("invest.chain.body")}</p>
          </div>
          <div className="iv-chain-rail rv">
            {CHAIN.map((card) => (
              <article key={card.titleKey} className="iv-chain-card">
                <img src={card.img} alt="" />
                <h3>{t(card.titleKey)}</h3>
                <p>{t(card.bodyKey)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="iv-awards">
        <div className="iv-wrap rv">
          <h2>{t("invest.awards.title")}</h2>
          <img src="/why-georgia/awards.png" alt={t("invest.awards.alt")} />
        </div>
      </section>

      <section className="iv-early">
        <div className="iv-wrap rv">
          <h2>
            {t("invest.early.line1")}
            <br />
            {t("invest.early.line2")}
          </h2>
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
          <h2 className="rv">{t("invest.market.title")}</h2>
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
          <div className="iv-process-head rv">
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

      <section className="iv-faq-outer">
        <div className="iv-faq-panel rv">
          <span className="iv-panel-eyebrow">{t("invest.faq.eyebrow")}</span>
          <h2 style={{ fontFamily: "var(--display)", fontWeight: 600, margin: "0 0 28px", fontSize: "clamp(28px, 3.4vw, 44px)", lineHeight: 1.12 }}>
            {t("invest.faq.title")}
          </h2>
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
