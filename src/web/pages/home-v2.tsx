import { useEffect, useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent } from "react";
import { Link } from "wouter";
import { PrivacyModal } from "../components/PrivacyModal";
import { RequestModal } from "../components/RequestModal";
import { AppLink } from "../components/app-link";
import { useT, type MessageKey } from "../i18n";

/**
 * Homepage rebuilt from the Figma export (Desktop - 1.pdf, 1440 × 7851).
 * Design tokens:
 *   --bg-dark #21141A · --bg-light/#card-light #FFFEF9
 *   --card-gray #463C41 · --card-green #48674D
 *   --accent-plum #703C54 (accent only, not container fill)
 *   --accent-blue #8CB2C0 at 10% mixes
 *   border-radius 2px
 */

type ModalState = { open: boolean; source: string; topic?: string; title?: string };
const CLOSED: ModalState = { open: false, source: "" };

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".rv");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ onRequest }: { onRequest: (s: ModalState) => void }) {
  const t = useT();
  return (
    <section className="rd-hero">
      <span className="rd-hero-circle" aria-hidden="true" />
      <div className="rd-wrap rd-hero-grid">
        <div className="rd-hero-photo">
          <img src="/home/rd-arthur.jpg" alt="Arthur Arutyunyan" />
        </div>

        <div className="rd-hero-copy">
          <h1>
            {t("v2.hero.line1")}
            <br />
            {t("v2.hero.line2")}
          </h1>
          <p>{t("v2.hero.body")}</p>
          <div className="rd-hero-btns">
            <button
              type="button"
              className="rd-btn rd-btn-outline"
              onClick={() =>
                onRequest({
                  open: true,
                  source: "Hero — Consultation",
                  title: t("v2.hero.ctaPrimary"),
                })
              }
            >
              {t("v2.hero.ctaPrimary")}
            </button>
            <button
              type="button"
              className="rd-btn rd-btn-outline"
              onClick={() =>
                onRequest({
                  open: true,
                  source: "Hero — Sell with me",
                  title: t("v2.hero.ctaSecondary"),
                  topic: t("v2.hero.ctaSecondary"),
                })
              }
            >
              {t("v2.hero.ctaSecondary")}
            </button>
          </div>
        </div>
      </div>

      <div className="rd-hero-band">
        <img src="/home/rd-waterfront.jpg" alt="" aria-hidden="true" />
      </div>
    </section>
  );
}

// ─── Your person inside the market ────────────────────────────────────────────

const MARKET_CARDS: { key: MessageKey; tone: "gray" | "green" | "white" | "plum" }[] = [
  { key: "v2.market.card1", tone: "gray" },
  { key: "v2.market.card2", tone: "green" },
  { key: "v2.market.card3", tone: "white" },
  { key: "v2.market.card4", tone: "plum" },
];

function MarketPerson() {
  const t = useT();
  return (
    <section className="rd-market" id="inside-market">
      <div className="rd-wrap">
        <div className="rd-market-head rv">
          <h2 className="rd-h2">{t("v2.market.title")}</h2>
          <div className="rd-market-copy">
            <p>{t("v2.market.body1")}</p>
          </div>
        </div>
        <div className="rd-market-grid rv">
          {MARKET_CARDS.map((card) => (
            <div key={card.key} className={`rd-market-card rd-market-card-${card.tone}`}>
              <span>{t(card.key)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why Georgia + stats ──────────────────────────────────────────────────────

type Stat =
  | { kind: "stat"; value: string; labelKey: MessageKey; noteKey: MessageKey; tone: "gray" | "green" | "white" }
  | { kind: "image"; src: string; alt: string };

const STATS: Stat[] = [
  { kind: "stat", value: "0%", labelKey: "v2.stats.tax", noteKey: "v2.stats.taxNote", tone: "gray" },
  { kind: "stat", value: "$150k", labelKey: "v2.stats.residency", noteKey: "v2.stats.residencyNote", tone: "green" },
  { kind: "image", src: "/home/rd-tower.jpg", alt: "Tbilisi" },
  { kind: "stat", value: "47.4%", labelKey: "v2.stats.women", noteKey: "v2.stats.womenNote", tone: "gray" },
  { kind: "image", src: "/home/rd-beach.jpg", alt: "Batumi" },
  { kind: "stat", value: "3.7M", labelKey: "v2.stats.tourists", noteKey: "v2.stats.touristsNote", tone: "gray" },
  { kind: "stat", value: "$1420", labelKey: "v2.stats.price", noteKey: "v2.stats.priceNote", tone: "white" },
  { kind: "stat", value: "13.2%", labelKey: "v2.stats.yield", noteKey: "v2.stats.yieldNote", tone: "green" },
];

function WhyGeorgia() {
  const t = useT();
  return (
    <section id="why-georgia" className="rd-why">
      <div className="rd-wrap">
        <div className="rd-split rv">
          <h2 className="rd-h2">{t("v2.why.title")}</h2>
          <div className="rd-why-copy">
            <p className="rd-why-lead">{t("v2.why.bodyLead")}</p>
            <p className="rd-lead">{t("v2.why.body")}</p>
            <AppLink href="/invest" className="rd-why-link">
              {t("v2.why.cta")}
            </AppLink>
          </div>
        </div>

        <div className="rd-stats rv">
          {STATS.map((s, i) =>
            s.kind === "image" ? (
              <div key={`img-${i}`} className="rd-stat rd-stat-img">
                <img src={s.src} alt={s.alt} loading="lazy" />
              </div>
            ) : (
              <div key={s.labelKey} className={`rd-stat rd-stat-${s.tone}`}>
                <div className="rd-stat-top">
                  <span className="rd-stat-value">{s.value}</span>
                  <span className="rd-stat-label">{t(s.labelKey)}</span>
                </div>
                <span className="rd-stat-note">{t(s.noteKey)}</span>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Quote ────────────────────────────────────────────────────────────────────

function Quote() {
  const t = useT();
  return (
    <section className="rd-quote" id="global-recognition">
      <div className="rd-wrap">
        <div className="rd-recog rv">
          <div className="rd-recog-copy">
            <h2 className="rd-h2">{t("v2.quote.eyebrow")}</h2>
            <blockquote>“{t("v2.quote.text")}”</blockquote>
            <p className="rd-quote-author">{t("v2.quote.author")}</p>
            <AppLink href="/invest#strategies" className="rd-btn rd-btn-white">
              {t("v2.quote.cta")}
            </AppLink>
          </div>
          <div className="rd-recog-visual">
            <img src="/projects/gonio/for-sale/marina.png" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Drag rail (projects + feedback) ──────────────────────────────────────────

function useDragRail(cardSelector: string, gap = 12) {
  const railRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    active: boolean;
    pointerId: number;
    startX: number;
    startScroll: number;
    lastX: number;
    lastT: number;
    velocity: number;
    moved: boolean;
  } | null>(null);
  const momentumRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);

  const syncProgress = () => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  const stopMomentum = () => {
    if (momentumRef.current) {
      cancelAnimationFrame(momentumRef.current);
      momentumRef.current = 0;
    }
  };

  const snapToNearest = (el: HTMLDivElement) => {
    const card = el.querySelector<HTMLElement>(cardSelector);
    if (!card) return;
    const step = card.offsetWidth + gap;
    if (step <= 0) return;
    const max = el.scrollWidth - el.clientWidth;
    const target = Math.min(max, Math.max(0, Math.round(el.scrollLeft / step) * step));
    const start = el.scrollLeft;
    const dist = target - start;
    if (Math.abs(dist) < 1) {
      syncProgress();
      return;
    }
    const duration = 320;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const e = 1 - (1 - p) ** 3;
      el.scrollLeft = start + dist * e;
      syncProgress();
      if (p < 1) momentumRef.current = requestAnimationFrame(tick);
      else momentumRef.current = 0;
    };
    momentumRef.current = requestAnimationFrame(tick);
  };

  const glide = (el: HTMLDivElement, initialVelocity: number) => {
    let v = initialVelocity;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(32, now - prev);
      prev = now;
      v *= Math.pow(0.95, dt / 16);
      el.scrollLeft += v * dt;
      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft < 0) {
        el.scrollLeft = 0;
        v = 0;
      } else if (el.scrollLeft > max) {
        el.scrollLeft = max;
        v = 0;
      }
      syncProgress();
      if (Math.abs(v) > 0.04) {
        momentumRef.current = requestAnimationFrame(tick);
      } else {
        momentumRef.current = 0;
        snapToNearest(el);
      }
    };
    momentumRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => stopMomentum(), []);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const el = railRef.current;
    if (!el) return;
    // Don't capture yet — allow real clicks on project links until the user
    // actually starts dragging past the threshold.
    stopMomentum();
    const now = performance.now();
    dragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      lastX: e.clientX,
      lastT: now,
      velocity: 0,
      moved: false,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = railRef.current;
    if (!drag?.active || !el || drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.startX;
    if (!drag.moved && Math.abs(dx) > 6) {
      drag.moved = true;
      el.setPointerCapture(e.pointerId);
      setDragging(true);
    }
    if (!drag.moved) return;
    el.scrollLeft = drag.startScroll - dx;
    const now = performance.now();
    const dt = now - drag.lastT;
    if (dt > 0) {
      const instant = (drag.lastX - e.clientX) / dt;
      drag.velocity = drag.velocity * 0.7 + instant * 0.3;
    }
    drag.lastX = e.clientX;
    drag.lastT = now;
    syncProgress();
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const el = railRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    if (drag.moved) {
      const blockClick = (ev: Event) => {
        ev.preventDefault();
        ev.stopPropagation();
        el?.removeEventListener("click", blockClick, true);
      };
      el?.addEventListener("click", blockClick, true);
      window.setTimeout(() => el?.removeEventListener("click", blockClick, true), 0);
      if (el) {
        if (Math.abs(drag.velocity) > 0.05) glide(el, drag.velocity);
        else snapToNearest(el);
      }
    }
    dragRef.current = null;
    setDragging(false);
  };

  return {
    railRef,
    dragging,
    progress,
    syncProgress,
    onPointerDown,
    onPointerMove,
    endDrag,
  };
}

// ─── Selected projects ────────────────────────────────────────────────────────

const PROJECTS = [
  { name: "Piazza Residence", img: "/projects/piazza/for-sale/exterior-tower.jpg", href: "/project/piazza-residence" },
  { name: "Artex Parkline", img: "/projects/parkline/for-sale/ext-park-hero.jpg", href: "/project/artex-parkline" },
  { name: "Rogantini Swiss Village", img: "/projects/rogantini/for-sale/ext-hero.jpg", href: "/project/rogantini-swiss-village" },
  { name: "Silk Towers", img: "/projects/silk/for-sale/card.jpg", href: "/project/silk-towers" },
  { name: "VR Shekvetili Forest Beach", img: "/projects/shekvetili/for-sale/ext-01.jpg", href: "/project/shekvetili-forest-beach" },
  { name: "Krtsanisi Resort Residence", img: "/projects/krtsanisi/for-sale/ext-01.jpg", href: "/project/krtsanisi-resort-residence" },
  { name: "Vake Sky Tower", img: "/projects/vake-sky/for-sale/ext-01.jpg", href: "/project/vake-sky-tower" },
];

function SelectedProjects() {
  const t = useT();
  const { railRef, dragging, progress, syncProgress, onPointerDown, onPointerMove, endDrag } =
    useDragRail(".rd-proj", 12);

  return (
    <section id="properties" className="rd-projects-outer">
      <div className="rd-panel rd-panel-white">
        <div className="rd-projects">
          <div className="rd-projects-side rv">
            <h2 className="rd-h3">
              {t("v2.projects.title")}
              <br />
              {t("v2.projects.titleEm")}
            </h2>
            <p className="rd-small" style={{ whiteSpace: "pre-line" }}>{t("v2.projects.body")}</p>
            <Link href="/catalog" className="rd-btn rd-btn-dark-outline">
              {t("v2.projects.viewAll")}
            </Link>
          </div>

          <div className="rd-projects-main">
            <div
              className={`rd-rail${dragging ? " is-dragging" : ""}`}
              ref={railRef}
              onScroll={syncProgress}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              {PROJECTS.map((p) => (
                <Link
                  key={p.name}
                  href={p.href}
                  className="rd-proj"
                  draggable={false}
                  aria-label={p.name}
                >
                  <div className="rd-proj-img">
                    {p.img ? (
                      <img src={p.img} alt={p.name} loading="lazy" draggable={false} />
                    ) : null}
                  </div>
                  <span className="rd-proj-name">{p.name}</span>
                </Link>
              ))}
            </div>
            <div className="rd-rail-track" aria-hidden="true">
              <span style={{ transform: `translateX(${progress * 200}%)` }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Ecosystem accordion ──────────────────────────────────────────────────────

const ECO: { titleKey: MessageKey; bodyKey: MessageKey; img: string }[] = [
  { titleKey: "v2.eco.legal.title", bodyKey: "v2.eco.legal.body", img: "/home/rd-eco-legal.jpg" },
  { titleKey: "v2.eco.banking.title", bodyKey: "v2.eco.banking.body", img: "/home/rd-eco-banking.jpg" },
  { titleKey: "v2.eco.notary.title", bodyKey: "v2.eco.notary.body", img: "/home/rd-eco-notary.jpg" },
  { titleKey: "v2.eco.architect.title", bodyKey: "v2.eco.architect.body", img: "/home/rd-eco-architect.jpg" },
  { titleKey: "v2.eco.renovation.title", bodyKey: "v2.eco.renovation.body", img: "/home/rd-eco-renovation.jpg" },
];

function Ecosystem() {
  const t = useT();
  const [active, setActive] = useState(0);

  return (
    <section className="rd-eco">
      <div className="rd-wrap">
        <div className="rd-split rv">
          <h2 className="rd-h2">
            {t("v2.eco.title")}
            <br />
            {t("v2.eco.titleEm")}
          </h2>
          <p className="rd-lead">{t("v2.eco.body")}</p>
        </div>

        <div className="rd-eco-row rv">
          {ECO.map((item, i) => (
            <button
              key={item.titleKey}
              type="button"
              className={`rd-eco-card${i === active ? " is-open" : ""}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-expanded={i === active}
            >
              <img
                className="rd-eco-photo"
                src={item.img}
                alt=""
                aria-hidden="true"
                loading="lazy"
              />
              <span className="rd-eco-index">0{i + 1}</span>
              <span className="rd-eco-title">{t(item.titleKey)}</span>
              <span className="rd-eco-body">{t(item.bodyKey)}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Feedback & case studies ──────────────────────────────────────────────────

const GOOGLE_REVIEWS_URL = "https://g.page/r/CR1_vKWcSyUNEAE/review";

const FEEDBACK: {
  quoteKey: MessageKey;
  authorKey: MessageKey;
  tags: string[];
}[] = [
  {
    quoteKey: "v2.fb.q1",
    authorKey: "v2.fb.a1",
    tags: ["#batumi", "#fastsale", "#vipservice"],
  },
  {
    quoteKey: "v2.fb.q2",
    authorKey: "v2.fb.a2",
    tags: ["#batumi", "#mortgage", "#advisory"],
  },
  {
    quoteKey: "v2.fb.q3",
    authorKey: "v2.fb.a3",
    tags: ["#batumi", "#investment", "#fullservice"],
  },
  {
    quoteKey: "v2.fb.q4",
    authorKey: "v2.fb.a4",
    tags: ["#batumi", "#seamlessdeal", "#protection"],
  },
  {
    quoteKey: "v2.fb.q5",
    authorKey: "v2.fb.a5",
    tags: ["#batumi", "#problemsolver", "#mortgage"],
  },
  {
    quoteKey: "v2.fb.q6",
    authorKey: "v2.fb.a6",
    tags: ["#tbilisi", "#batumi", "#representation"],
  },
  {
    quoteKey: "v2.fb.q7",
    authorKey: "v2.fb.a7",
    tags: ["#georgia", "#legalprotection", "#diplomacy"],
  },
];

function Feedback() {
  const t = useT();
  const { railRef, dragging, progress, syncProgress, onPointerDown, onPointerMove, endDrag } =
    useDragRail(".rd-fb-card", 16);

  return (
    <section id="feedback" className="rd-fb-outer">
      <div className="rd-panel rd-panel-light rd-fb-panel">
        <div className="rd-fb-head rv">
          <h2 className="rd-h3">
            {t("v2.fb.title")}
            <br />
            {t("v2.fb.titleEm")}
          </h2>
          <a
            className="rd-fb-google-link"
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span aria-hidden="true">→</span> {t("v2.fb.google")}
          </a>
        </div>

        <div className="rd-fb-main">
          <div
            className={`rd-fb-rail${dragging ? " is-dragging" : ""}`}
            ref={railRef}
            onScroll={syncProgress}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            {FEEDBACK.map((f) => (
              <figure key={f.quoteKey} className="rd-fb-card rv">
                <div className="rd-fb-copy">
                  <blockquote>“{t(f.quoteKey)}”</blockquote>
                  <figcaption>— {t(f.authorKey)}</figcaption>
                </div>
                <div className="rd-fb-tags">
                  {f.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </figure>
            ))}
          </div>
        </div>

        <div className="rd-rail-track rd-fb-track" aria-hidden="true">
          <span style={{ transform: `translateX(${progress * 200}%)` }} />
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

type Plan = {
  id: string;
  nameKey: MessageKey;
  forKey: MessageKey;
  price: string;
  featureKeys: MessageKey[];
  requestKey: MessageKey;
  resultKey: MessageKey;
  noteKey?: MessageKey;
  ctaKey?: MessageKey;
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "express-audit",
    nameKey: "v2.plan1.name",
    forKey: "v2.plan1.for",
    price: "$79",
    featureKeys: ["v2.plan1.f1", "v2.plan1.f2", "v2.plan1.f3"],
    requestKey: "v2.plan1.request",
    resultKey: "v2.plan1.result",
  },
  {
    id: "strategic-deep-dive",
    nameKey: "v2.plan2.name",
    forKey: "v2.plan2.for",
    price: "$279",
    featureKeys: ["v2.plan2.f1", "v2.plan2.f2", "v2.plan2.f3", "v2.plan2.f4"],
    requestKey: "v2.plan2.request",
    resultKey: "v2.plan2.result",
    featured: true,
  },
  {
    id: "discovery-tour",
    nameKey: "v2.plan3.name",
    forKey: "v2.plan3.for",
    price: "$1999*",
    featureKeys: ["v2.plan3.f1", "v2.plan3.f2", "v2.plan3.f3", "v2.plan3.f4"],
    requestKey: "v2.plan3.request",
    resultKey: "v2.plan3.result",
    noteKey: "v2.plan3.note",
    ctaKey: "v2.plan3.cta",
  },
];

function Pricing({ onRequest }: { onRequest: (s: ModalState) => void }) {
  const t = useT();
  return (
    <section id="consultation" className="rd-pricing">
      <div className="rd-wrap">
        <h2 className="rd-h1 rv">{t("v2.pricing.title")}</h2>

        <div className="rd-plans">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`rd-plan rv${plan.featured ? " is-featured" : ""}`}>
              <h3>{t(plan.nameKey)}</h3>
              <p className="rd-plan-for">{t(plan.forKey)}</p>
              <div className="rd-plan-price">{plan.price}</div>

              <ul>
                {plan.featureKeys.map((k) => (
                  <li key={k}>{t(k)}</li>
                ))}
              </ul>

              <div className="rd-plan-block">
                <strong>{t("v2.pricing.requestLabel")}</strong>
                <p>{t(plan.requestKey)}</p>
              </div>
              <div className="rd-plan-block">
                <strong>{t("v2.pricing.resultLabel")}</strong>
                <p>{t(plan.resultKey)}</p>
              </div>

              {plan.noteKey ? <p className="rd-plan-note">{t(plan.noteKey)}</p> : null}

              <button
                type="button"
                className={`rd-btn rd-plan-cta ${plan.featured ? "rd-btn-white" : "rd-btn-dark"}`}
                onClick={() =>
                  onRequest({
                    open: true,
                    source: `Pricing — ${plan.id}`,
                    topic: `${t(plan.nameKey)} · ${plan.price}`,
                    title: t(plan.nameKey),
                  })
                }
              >
                {t(plan.ctaKey ?? "v2.pricing.choose")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const HOME_FAQS: { qKey: MessageKey; aKey: MessageKey }[] = [
  { qKey: "v2.faq.q1", aKey: "v2.faq.a1" },
  { qKey: "v2.faq.q2", aKey: "v2.faq.a2" },
  { qKey: "v2.faq.q3", aKey: "v2.faq.a3" },
  { qKey: "v2.faq.q4", aKey: "v2.faq.a4" },
  { qKey: "v2.faq.q5", aKey: "v2.faq.a5" },
  { qKey: "v2.faq.q6", aKey: "v2.faq.a6" },
  { qKey: "v2.faq.q7", aKey: "v2.faq.a7" },
  { qKey: "v2.faq.q8", aKey: "v2.faq.a8" },
  { qKey: "v2.faq.q9", aKey: "v2.faq.a9" },
];

function Faq() {
  const t = useT();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="rd-faq-outer">
      <div className="rd-panel rd-panel-white rd-faq-panel">
        <h2 className="rd-h2 rv">{t("v2.faq.title")}</h2>
        <div className="rd-faq-list rv">
          {HOME_FAQS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.qKey} className={`rd-faq${isOpen ? " is-open" : ""}`}>
                <button
                  type="button"
                  className="rd-faq-head"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  <span>{t(item.qKey)}</span>
                  <span className="rd-faq-toggle" aria-hidden>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen ? <p className="rd-faq-body">{t(item.aKey)}</p> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Notes (selectivity) ──────────────────────────────────────────────────────

function Notes() {
  const t = useT();
  return (
    <section className="rd-notes" id="notes">
      <div className="rd-wrap">
        <div className="rd-notes-inner rv">
          <h2 className="rd-h2">
            {t("v2.notes.title1")}
            <br />
            {t("v2.notes.title2")}
          </h2>
          <p>{t("v2.notes.body")}</p>
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter ───────────────────────────────────────────────────────────────

function Newsletter() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !email.includes("@")) return setError(t("v2.news.errorEmail"));
    if (!agree) return setError(t("v2.news.errorAgree"));
    setState("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: t("v2.news.leadName"),
          contact: email.trim(),
          source: "Newsletter subscribe",
          page: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });
      if (!res.ok) {
        setError(t("popup.errorGeneric"));
        setState("idle");
        return;
      }
      setState("done");
      setEmail("");
    } catch {
      setError(t("popup.errorNetwork"));
      setState("idle");
    }
  };

  return (
    <section className="rd-news-outer">
      <div className="rd-news rv">
        <div className="rd-news-inner">
          <h2>{t("v2.news.title")}</h2>
          <p>{t("v2.news.body")}</p>

          {state === "done" ? (
            <p className="rd-news-done">{t("v2.news.done")}</p>
          ) : (
            <form onSubmit={submit}>
              <div className="rd-news-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("v2.news.placeholder")}
                  aria-label={t("v2.news.placeholder")}
                />
                <button type="submit" className="rd-btn rd-btn-white" disabled={state === "loading"}>
                  {state === "loading" ? "…" : t("v2.news.submit")}
                </button>
              </div>
              <label className="rd-news-agree">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                <span>
                  {t("v2.news.agree")}{" "}
                  <button
                    type="button"
                    className="rd-news-privacy"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPrivacyOpen(true);
                    }}
                  >
                    {t("v2.news.privacy")}
                  </button>
                </span>
              </label>
              {error ? <p className="rd-news-error">{error}</p> : null}
            </form>
          )}
        </div>
      </div>
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </section>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CSS = `
html, body { background: #21141A; }
.rd {
  --bg-dark: #21141A;
  --bg-light: #FFFEF9;
  --text-light: #FFFEF9;
  --text-dark: #21141A;
  --card-gray: #463C41;
  --card-green: #48674D;
  --card-light: #FFFEF9;
  --accent-plum: #703C54;
  --accent-blue: #8CB2C0;
  --radius: 2px;
  --bg: var(--bg-dark);
  --card: var(--card-gray);
  --green: var(--card-green);
  --white: var(--bg-light);
  --panel: var(--bg-light);
  --blue: color-mix(in srgb, var(--accent-blue) 10%, var(--bg-light));
  --display: 'Coolvetica', Inter, sans-serif;
  --body: 'Inter', sans-serif;
  /* One canvas: same max width + gutters as header / footer / every page */
  --rd-max: var(--site-max, 1440px);
  --rd-gutter: var(--site-gutter, clamp(32px, 5vw, 80px));
  --rd-inset: clamp(28px, 3.2vw, 48px);
  background: var(--bg);
  color: var(--text-light);
  overflow-x: hidden;
  font-family: var(--body);
}
.rd-wrap { max-width: var(--rd-max); margin: 0 auto; padding: 0 var(--rd-gutter); box-sizing: border-box; }
/* Panels share the same 1440 canvas and side gutters as every other block */
.rd-canvas {
  max-width: var(--rd-max); margin: 0 auto; padding: 0 var(--rd-gutter);
  box-sizing: border-box;
}
.rd .rv { opacity: 0; transform: translateY(24px); transition: opacity .7s ease, transform .7s ease; }
.rd .rv.in { opacity: 1; transform: none; }

/* buttons — radius capped at 2px */
.rd-btn {
  display: inline-flex; align-items: center; justify-content: center;
  font-family: var(--body); font-size: 15px; font-weight: 400;
  padding: 15px 30px; border-radius: 2px; border: 1px solid transparent;
  cursor: pointer; text-decoration: none; white-space: nowrap;
  transition: background .2s, color .2s, border-color .2s, opacity .2s;
}
.rd-btn-outline { background: transparent; color: #FFFEF9; border-color: rgba(255,254,249,.55); }
.rd-btn-outline:hover { background: #FFFEF9; color: #21141A; }
.rd-btn-white { background: #FFFEF9; color: #21141A; }
.rd-btn-white:hover { opacity: .88; }
.rd-btn-dark { background: #21141A; color: #FFFEF9; }
.rd-btn-dark:hover { opacity: .9; }
.rd-btn-dark-outline { background: transparent; color: #21141A; border-color: rgba(33,20,26,.5); }
.rd-btn-dark-outline:hover { background: #21141A; color: #FFFEF9; }

/* type */
.rd-h1 { font-family: var(--display); font-weight: 600; font-size: clamp(34px, 4.45vw, 64px); line-height: 1.06; margin: 0; }
.rd-h2 { font-family: var(--display); font-weight: 600; font-size: clamp(30px, 3.9vw, 56px); line-height: 1.14; margin: 0; }
.rd-h3 { font-family: var(--display); font-weight: 600; font-size: clamp(26px, 3.35vw, 48px); line-height: 1.14; margin: 0; color: var(--text-dark); }
.rd-lead { font-family: var(--body); font-size: 16px; line-height: 1.45; color: var(--text-light); margin: 0; }
.rd-small { font-family: var(--body); font-size: 16px; line-height: 1.4; color: rgba(33,20,26,.75); margin: 0; }
.rd-split { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; margin-bottom: clamp(34px, 4vw, 58px); }
.rd-split .rd-lead {
  max-width: 420px; justify-self: end; text-align: right;
}
.rd-why-copy {
  max-width: 440px; justify-self: end; text-align: left;
  display: grid; gap: 14px;
}
.rd-why-lead {
  font-family: var(--body); font-size: clamp(18px, 1.5vw, 22px); font-weight: 600;
  line-height: 1.35; color: #FFFEF9; margin: 0;
}
.rd-why-copy .rd-lead { max-width: none; justify-self: start; text-align: left; color: rgba(255,254,249,.82); }
.rd-why-link {
  display: inline-flex; align-items: center; margin-top: 4px;
  font-family: var(--body); font-size: 15px; font-weight: 500;
  color: #FFFEF9; text-decoration: underline; text-underline-offset: 3px;
}
.rd-why-link:hover { opacity: .85; }

/* hero — app shell already offsets fixed nav; center photo between nav and fold */
.rd-hero { position: relative; padding-top: clamp(16px, 2vw, 28px); overflow: hidden; }
.rd-hero-circle {
  position: absolute; top: -190px; right: -120px; width: 760px; height: 760px;
  border: 1px solid var(--green); border-radius: 50%; pointer-events: none;
}
.rd-hero-grid {
  position: relative; z-index: 2;
  display: grid; grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.2fr); align-items: center;
  gap: 0;
  box-sizing: border-box;
  min-height: calc(100svh - var(--nav-height, 88px) - clamp(16px, 2vw, 28px));
  padding-bottom: clamp(28px, 3.5vw, 48px);
}
.rd-hero-photo {
  border-radius: 2px; overflow: hidden; aspect-ratio: 508 / 680; z-index: 1;
  justify-self: start; width: 100%;
  max-height: min(72svh, 640px);
  max-width: min(100%, calc(min(72svh, 640px) * 508 / 680));
}
.rd-hero-photo img { width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block; }
.rd-hero-copy {
  position: relative; z-index: 2;
  margin-left: clamp(-48px, -6vw, -18px);
  padding-left: clamp(12px, 2vw, 28px);
}
.rd-hero-copy h1 {
  font-family: var(--display); font-weight: 600; margin: 0 0 22px;
  font-size: clamp(32px, 3.9vw, 56px); line-height: 1.07; letter-spacing: -.01em;
}
.rd-hero-copy p {
  font-family: var(--body); font-size: clamp(14px, 1.04vw, 15px); line-height: 1.45;
  color: var(--white); margin: 0 0 30px; max-width: 500px;
}
.rd-hero-btns { display: flex; gap: 20px; flex-wrap: wrap; }
.rd-hero-btns .rd-btn { min-width: 166px; }

.rd-hero-band { position: relative; line-height: 0; }
.rd-hero-band img { width: 100%; height: clamp(280px, 58vw, 838px); object-fit: cover; display: block; }

/* market person */
.rd-market { padding: clamp(48px, 6vw, 96px) 0; background: #21141A; color: #FFFEF9; }
.rd-market-head {
  display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: clamp(24px, 4vw, 56px); align-items: start;
  margin-bottom: clamp(28px, 4vw, 48px);
}
.rd-market-head .rd-h2 { max-width: 640px; color: #FFFEF9; }
.rd-market-copy {
  display: grid; gap: 16px; max-width: 520px; justify-self: end;
}
.rd-market-copy p {
  margin: 0; font-family: var(--body); font-size: clamp(14px, 1.2vw, 16px);
  line-height: 1.5; color: rgba(255,254,249,.82);
}
.rd-market-grid {
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(12px, 1.4vw, 18px);
}
.rd-market-card {
  border-radius: 2px; min-height: clamp(140px, 16vw, 180px);
  padding: clamp(18px, 2vw, 24px);
  display: flex; align-items: flex-end;
  box-sizing: border-box;
}
.rd-market-card span {
  font-family: var(--display); font-weight: 600;
  font-size: clamp(18px, 1.7vw, 24px); line-height: 1.2;
}
.rd-market-card-gray { background: #463C41; color: #FFFEF9; }
.rd-market-card-green { background: #48674D; color: #FFFEF9; }
.rd-market-card-white { background: #FFFEF9; color: #21141A; }
.rd-market-card-plum { background: #703C54; color: #FFFEF9; }

/* notes */
.rd-notes { padding: clamp(48px, 6vw, 96px) 0; background: #21141A; color: #FFFEF9; }
.rd-notes-inner { max-width: 820px; }
.rd-notes-inner .rd-h2 { color: #FFFEF9; margin: 0 0 22px; }
.rd-notes-inner p {
  margin: 0; font-family: var(--body); font-size: clamp(15px, 1.25vw, 17px);
  line-height: 1.55; color: rgba(255,254,249,.82); max-width: 720px;
}

/* why + stats — perfect squares; dark page section #21141A / #FFFEF9 */
.rd-why { padding: clamp(56px, 7.6vw, 110px) 0 clamp(50px, 6vw, 90px); background: #21141A; color: #FFFEF9; }
.rd-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 15px; }
.rd-stat {
  aspect-ratio: 1 / 1; width: 100%; min-height: 0;
  border-radius: 2px; padding: clamp(16px, 1.7vw, 26px);
  display: flex; flex-direction: column; justify-content: space-between;
  box-sizing: border-box;
}
.rd-stat-gray { background: #463C41; color: #FFFEF9; }
.rd-stat-plum { background: #463C41; color: #FFFEF9; } /* legacy alias → gray */
.rd-stat-green { background: #48674D; color: #FFFEF9; }
.rd-stat-white { background: #FFFEF9; color: #21141A; }
.rd-stat-img { padding: 0; overflow: hidden; border-radius: 2px; }
.rd-stat-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.rd-stat-value { display: block; font-family: var(--body); font-weight: 500; font-size: clamp(28px, 3.6vw, 56px); line-height: 1.05; }
.rd-stat-label { display: block; font-family: var(--body); font-size: clamp(13px, 1.25vw, 20px); margin-top: 10px; color: #FFFEF9; }
.rd-stat-white .rd-stat-label { color: #21141A; opacity: .92; }
.rd-stat-note { font-family: var(--body); font-size: clamp(11px, 1vw, 15px); color: #FFFEF9; }
.rd-stat-white .rd-stat-note { color: #21141A; opacity: .55; }

/* quote / global recognition */
.rd-quote { padding: clamp(40px, 6vw, 96px) 0 clamp(56px, 7vw, 104px); }
.rd-recog {
  display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(28px, 4vw, 56px); align-items: center;
}
.rd-recog-copy { display: flex; flex-direction: column; align-items: flex-start; }
.rd-recog-copy .rd-h2 { margin: 0 0 22px; }
.rd-recog-copy blockquote {
  font-family: var(--body); font-weight: 300; font-size: clamp(20px, 2.22vw, 32px);
  line-height: 1.3; margin: 0 0 18px; color: var(--white);
}
.rd-quote-author { font-family: var(--body); font-size: 16px; color: var(--white); margin: 0 0 28px; }
.rd-recog-visual {
  border: 1px solid rgba(255,255,255,.85); overflow: hidden;
  aspect-ratio: 4 / 5; max-height: 640px;
}
.rd-recog-visual img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* panels — sit inside .rd-canvas so left content matches footer logo */
.rd-panel { border-radius: 2px; margin: 0; }
.rd-panel-white { background: #FFFEF9; color: #21141A; }
.rd-panel-light { background: #FFFEF9; color: #21141A; }
.rd-projects-outer, .rd-fb-outer { padding-bottom: clamp(50px, 6vw, 90px); }
.rd-fb-outer { padding-top: clamp(20px, 3vw, 40px); }

/* selected projects */
.rd-projects {
  display: grid; grid-template-columns: 400fr 940fr; gap: clamp(24px, 3vw, 48px);
  padding: clamp(32px, 4.2vw, 62px) 0 clamp(32px, 4.2vw, 60px);
  padding-left: var(--rd-inset); align-items: center;
}
.rd-projects-side { display: flex; flex-direction: column; gap: 18px; align-items: flex-start; }
.rd-projects-side .rd-btn { margin-top: 14px; min-width: 202px; }
.rd-projects-main { min-width: 0; }
.rd-rail {
  display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: none;
  padding-bottom: 22px; scrollbar-width: none;
  cursor: grab; touch-action: pan-y; user-select: none;
  -webkit-overflow-scrolling: touch;
}
.rd-rail.is-dragging { cursor: grabbing; scroll-snap-type: none; }
.rd-rail::-webkit-scrollbar { display: none; }
.rd-proj {
  flex: 0 0 clamp(220px, 22vw, 313px);
  text-decoration: none; color: inherit; cursor: pointer;
}
.rd-proj-img { aspect-ratio: 313 / 440; overflow: hidden; background: #463C41; border-radius: 2px; }
.rd-proj-img img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  transition: transform .6s ease; pointer-events: none; -webkit-user-drag: none;
}
.rd-rail:not(.is-dragging) .rd-proj:hover .rd-proj-img img { transform: scale(1.05); }
.rd-proj-name { display: block; margin-top: 14px; font-family: var(--display); font-weight: 600; font-size: 18px; color: var(--text-dark); }
.rd-rail-track { position: relative; height: 4px; background: rgba(33,20,26,.12); overflow: hidden; border-radius: 2px; }
.rd-rail-track span {
  position: absolute; inset: 0 auto 0 0; width: 33%; background: var(--bg); border-radius: 2px;
  will-change: transform; transition: transform .05s linear;
}

/* ecosystem */
.rd-eco { padding: clamp(50px, 6.6vw, 96px) 0 clamp(56px, 7vw, 104px); }
.rd-eco-row { display: flex; gap: 12px; align-items: stretch; }
.rd-eco-card {
  position: relative; flex: 1 1 0; min-width: 0; overflow: hidden;
  background: #463C41; border: none; border-radius: 2px; cursor: pointer;
  min-height: clamp(320px, 44vw, 634px); padding: clamp(18px, 1.8vw, 28px);
  display: flex; flex-direction: column; justify-content: flex-start;
  text-align: left; color: var(--text-light); transition: flex-grow .45s ease;
}
.rd-eco-card.is-open { flex-grow: 2.2; }
.rd-eco-photo {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
  opacity: .18; pointer-events: none; transition: opacity .35s ease;
  filter: saturate(.85) brightness(.75);
}
.rd-eco-card.is-open .rd-eco-photo { opacity: .42; filter: saturate(.95) brightness(.85); }
.rd-eco-card::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(180deg, rgba(33,20,26,.35) 0%, rgba(33,20,26,.72) 100%);
}
.rd-eco-index { position: relative; z-index: 1; font-family: var(--body); font-size: 13px; color: var(--white); }
.rd-eco-title {
  position: relative; z-index: 1; font-family: var(--body); font-size: clamp(15px, 1.39vw, 20px);
  margin-top: 14px; line-height: 1.3;
}
.rd-eco-body {
  position: relative; z-index: 1; margin-top: auto; font-family: var(--body);
  font-size: clamp(14px, 1.25vw, 18px); line-height: 1.45; color: var(--white);
  opacity: 0; max-height: 0; overflow: hidden; transition: opacity .35s ease;
}
.rd-eco-card.is-open .rd-eco-body { opacity: 1; max-height: 420px; }

/* feedback — redesigned carousel with Google Reviews CTA + next arrow */
.rd-panel-light { padding: clamp(34px, 4.4vw, 68px) var(--rd-inset); }
.rd-fb-panel { background: #FFFEF9; color: #21141A; }
.rd-fb-head {
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: 24px; margin-bottom: clamp(28px, 3vw, 46px);
}
.rd-fb-head .rd-h3 { margin: 0; color: #21141A; }
.rd-fb-google-link {
  flex-shrink: 0; font-family: var(--body); font-size: clamp(14px, 1.25vw, 18px);
  color: #21141A; text-decoration: underline; text-underline-offset: 3px;
  white-space: nowrap; transition: opacity .2s;
}
.rd-fb-google-link:hover { opacity: .7; }
.rd-fb-google-link span { margin-right: 6px; text-decoration: none; display: inline-block; }
.rd-fb-main { min-width: 0; }
.rd-fb-rail {
  display: flex; gap: 16px; overflow-x: auto; min-width: 0;
  scroll-snap-type: x mandatory; scrollbar-width: none; padding-bottom: 8px;
  /* Peek of the next card on the right edge */
  padding-right: clamp(48px, 8vw, 96px);
  cursor: grab; touch-action: pan-y; user-select: none;
  -webkit-overflow-scrolling: touch;
}
.rd-fb-rail.is-dragging { cursor: grabbing; scroll-snap-type: none; }
.rd-fb-rail::-webkit-scrollbar { display: none; }
.rd-fb-card {
  /* ~2.65 cards visible → next review peeks */
  --fb-size: clamp(240px, calc((100% - 32px) / 2.65), 340px);
  position: relative;
  flex: 0 0 var(--fb-size);
  width: var(--fb-size);
  min-height: calc(var(--fb-size) + 120px);
  scroll-snap-align: start;
  margin: 0; box-sizing: border-box;
  background: #412835; border-radius: 2px;
  padding: clamp(28px, 2.8vw, 40px);
  display: flex; flex-direction: column; color: #FFFEF9; overflow: hidden;
  pointer-events: none;
}
.rd-fb-copy {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 0;
}
.rd-fb-card blockquote {
  font-family: var(--body); font-weight: 400; font-size: clamp(16px, 1.35vw, 18px);
  line-height: 1.45; margin: 0 0 16px; color: #FFFEF9;
  text-align: left;
}
.rd-fb-card figcaption {
  font-family: var(--body); font-size: clamp(12px, 1vw, 14px);
  font-weight: 400; color: rgba(255,254,249,.78); margin: 0; line-height: 1.4;
  text-align: left;
}
.rd-fb-tags { display: flex; flex-wrap: wrap; gap: 8px 12px; margin-top: auto; padding-top: 28px; flex-shrink: 0; }
.rd-fb-tags span {
  font-family: var(--body); font-size: 12px; line-height: 1.35;
  padding: 0; color: rgba(255,254,249,.78);
  border: none; border-radius: 0;
  text-transform: none; letter-spacing: 0.01em;
}
.rd-fb-track { margin-top: 18px; }

/* pricing — dark page section; light cards + green featured */
.rd-pricing { padding: clamp(20px, 3vw, 44px) 0 clamp(56px, 7vw, 100px); background: #21141A; color: #FFFEF9; }
.rd-pricing .rd-h1 { margin-bottom: clamp(28px, 3.5vw, 56px); color: #FFFEF9; }
.rd-plans { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(16px, 1.6vw, 24px); align-items: stretch; }
.rd-plan {
  /* Express Audit / Discovery Tour — taller frame, more air */
  background: #FFFEF9; color: #21141A; border-radius: 2px;
  padding: clamp(36px, 3.4vw, 52px) clamp(28px, 2.8vw, 40px);
  display: flex; flex-direction: column;
  min-height: clamp(640px, 72vh, 820px);
  box-sizing: border-box;
}
.rd-plan.is-featured {
  /* Strategic Deep-Dive */
  background: #48674D; color: #FFFEF9;
}
.rd-plan.is-featured .rd-plan-for { border-bottom-color: rgba(255,254,249,.2); }
.rd-plan h3 { font-family: var(--display); font-weight: 400; font-size: clamp(21px, 2.22vw, 32px); margin: 0 0 12px; }
.rd-plan-for {
  font-family: var(--body); font-size: 16px; line-height: 1.35; margin: 0 0 22px;
  padding-bottom: 22px; border-bottom: 1px solid rgba(33,20,26,.15);
}
.rd-plan-price { font-family: var(--body); font-weight: 400; font-size: clamp(36px, 4.2vw, 56px); line-height: 1.1; margin-bottom: 36px; font-variant-numeric: tabular-nums; }
.rd-plan ul { list-style: disc; margin: 0 0 36px; padding-left: 18px; display: grid; gap: 12px; }
.rd-plan li { font-family: var(--body); font-size: 16px; line-height: 1.4; }
.rd-plan-block { margin-bottom: 28px; }
.rd-plan-block strong { display: block; font-family: var(--body); font-weight: 700; font-size: 18px; margin-bottom: 10px; }
.rd-plan-block p { font-family: var(--body); font-size: 16px; line-height: 1.45; margin: 0; }
.rd-plan-note {
  font-family: var(--body); font-size: 13px; line-height: 1.45;
  color: rgba(33,20,26,.55); margin: 4px 0 28px;
}
.rd-plan.is-featured .rd-plan-note { color: rgba(255,254,249,.7); }
.rd-plan-cta { margin-top: auto; width: 100%; font-size: 16px; padding: 16px 20px; border-radius: 2px; }

/* FAQ — after pricing */
.rd-faq-outer { padding-bottom: clamp(40px, 5vw, 72px); }
.rd-faq-panel { padding: clamp(34px, 4.4vw, 68px) var(--rd-inset); }
.rd-faq-panel .rd-h2 { margin: 0 0 clamp(22px, 3vw, 36px); color: #21141A; }
.rd-faq { border-top: 1px solid rgba(33,20,26,.1); }
.rd-faq:last-child { border-bottom: 1px solid rgba(33,20,26,.1); }
.rd-faq-head {
  width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 16px;
  padding: 18px 0; border: none; background: transparent; cursor: pointer;
  text-align: left; color: #21141A; font-family: var(--body); font-size: clamp(15px, 1.25vw, 17px);
  font-weight: 500; line-height: 1.35;
}
.rd-faq-toggle {
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
  background: #21141A; color: #FFFEF9;
  display: inline-flex; align-items: center; justify-content: center; font-size: 18px; line-height: 1;
}
.rd-faq-body {
  margin: 0 0 18px; max-width: 760px;
  font-family: var(--body); font-size: clamp(14px, 1.15vw, 16px); line-height: 1.55;
  color: rgba(33,20,26,.72);
}

/* newsletter CTA — image bg /images/cta-bg.jpg, fallback #21141A (no solid plum fill) */
.rd-news-outer { padding-bottom: clamp(40px, 5vw, 70px); background: #21141A; }
.rd-news {
  position: relative; border-radius: 2px; overflow: hidden;
  background-color: #21141A;
  background-image: url('/images/cta-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.rd-news-inner { position: relative; padding: clamp(30px, 4vw, 56px) var(--rd-inset); max-width: calc(920px + var(--rd-inset)); }
.rd-news-inner h2 { font-family: var(--display); font-weight: 600; font-size: clamp(26px, 3.35vw, 48px); margin: 0 0 18px; color: #FFFEF9; }
.rd-news-inner > p { font-family: var(--body); font-size: clamp(13px, 1.15vw, 16px); line-height: 1.4; color: #FFFEF9; margin: 0 0 34px; max-width: 640px; }
.rd-news-row {
  display: flex; align-items: flex-end; gap: 16px;
  border-bottom: 1px solid rgba(255,254,249,.4); padding-bottom: 8px;
}
.rd-news-row input {
  flex: 1; min-width: 0; background: transparent; border: none; outline: none;
  font-family: var(--body); font-size: 16px; color: #FFFEF9; padding: 10px 0;
  border-radius: 2px;
}
.rd-news-row input::placeholder { color: rgba(255,254,249,.6); }
.rd-news-row .rd-btn { min-width: 171px; border-radius: 2px; }
.rd-news-agree { display: flex; gap: 8px; align-items: flex-start; margin-top: 12px; font-family: var(--body); font-size: 12px; font-style: italic; color: #FFFEF9; cursor: pointer; }
.rd-news-agree input { accent-color: #FFFEF9; margin-top: 2px; }
.rd-news-agree a, .rd-news-privacy {
  color: #FFFEF9; background: none; border: none; padding: 0; margin: 0;
  font: inherit; font-style: italic; text-decoration: underline; cursor: pointer;
}
.rd-news-privacy:hover { opacity: .85; }
.rd-news-done { font-family: var(--body); font-size: 18px; color: #FFFEF9; margin: 0; }
.rd-news-error { font-family: var(--body); font-size: 13px; color: #FFFEF9; margin: 10px 0 0; }

/* responsive */
@media (max-width: 1024px) {
  .rd-hero-grid {
    grid-template-columns: 1fr; align-items: start; gap: clamp(20px, 3vw, 32px);
    min-height: 0;
  }
  .rd-hero-photo { max-width: 420px; max-height: none; width: 100%; }
  .rd-hero-copy { margin-left: 0; padding-left: 0; }
  .rd-split { grid-template-columns: 1fr; gap: 18px; }
  .rd-split .rd-lead { justify-self: start; text-align: left; max-width: none; }
  .rd-why-copy { justify-self: start; max-width: none; }
  .rd-recog { grid-template-columns: 1fr; }
  .rd-recog-visual { aspect-ratio: 16 / 10; max-height: 420px; }
  .rd-stats { grid-template-columns: repeat(2, 1fr); }
  .rd-projects { grid-template-columns: 1fr; padding-right: var(--rd-inset); }
  /* Keep vertical ecosystem cards like desktop — horizontal scroll rail */
  .rd-eco-row {
    flex-direction: row; overflow-x: auto; scroll-snap-type: x mandatory;
    padding-bottom: 8px; scrollbar-width: none;
  }
  .rd-eco-row::-webkit-scrollbar { display: none; }
  .rd-eco-card {
    flex: 0 0 min(72vw, 280px); min-height: clamp(360px, 70vw, 520px);
    scroll-snap-align: start;
  }
  .rd-eco-card .rd-eco-photo { opacity: .4; }
  .rd-eco-card .rd-eco-body { opacity: 1; max-height: none; margin-top: auto; }
  .rd-plans { grid-template-columns: 1fr; }
  .rd-plan { min-height: 0; padding: clamp(32px, 5vw, 44px) clamp(24px, 4vw, 32px); }
  .rd-market-head { grid-template-columns: 1fr; gap: 18px; }
  .rd-market-copy { justify-self: start; max-width: none; }
  .rd-market-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 640px) {
  .rd-hero-circle { width: 420px; height: 420px; top: -140px; right: -140px; }
  .rd-hero-btns { flex-direction: column; align-items: stretch; }
  .rd-hero-btns .rd-btn { width: 100%; }
  .rd-news-row { flex-direction: column; align-items: stretch; gap: 12px; }
  .rd-news-row .rd-btn { width: 100%; }
  .rd-fb-card { --fb-size: min(78vw, 300px); }
  .rd-fb-head { flex-direction: column; align-items: flex-start; gap: 16px; }
  .rd-fb-rail { padding-right: 56px; }
  .rd-market-grid { grid-template-columns: 1fr; }
}
`;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomeV2() {
  const [modal, setModal] = useState<ModalState>(CLOSED);
  useReveal();

  return (
    <div className="rd">
      <style>{CSS}</style>

      <Hero onRequest={setModal} />
      <MarketPerson />
      <Pricing onRequest={setModal} />
      <div className="rd-canvas">
        <Faq />
      </div>
      <WhyGeorgia />
      <div className="rd-canvas">
        <SelectedProjects />
      </div>
      <Notes />
      <div className="rd-canvas">
        <Feedback />
      </div>
      <div className="rd-canvas">
        <Newsletter />
      </div>

      <RequestModal
        open={modal.open}
        onClose={() => setModal(CLOSED)}
        source={modal.source}
        topic={modal.topic}
        title={modal.title}
      />
    </div>
  );
}
