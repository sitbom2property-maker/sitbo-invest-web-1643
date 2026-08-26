import { useEffect, useState } from "react";
import { Link } from "wouter";
import { NavLocaleSwitcher } from "../components/NavLocaleSwitcher";
import { useT, type MessageKey } from "../i18n";

/** Assistant WhatsApp (Amina funnel). Full intl form of +995 510 00 27 22. */
const ASSISTANT_WA = "https://wa.me/995510002722";
const ASSISTANT_WA_TEXT = encodeURIComponent(
  "Здравствуйте! Я пришёл(а) от Амины. Хочу записаться на консультацию / сопровождение.",
);
const ASSISTANT_HREF = `${ASSISTANT_WA}?text=${ASSISTANT_WA_TEXT}`;

const NAV_H = 72;

type Plan = {
  id: string;
  nameKey: MessageKey;
  forKey: MessageKey;
  price: string;
  featureKeys: MessageKey[];
  requestKey: MessageKey;
  resultKey: MessageKey;
  noteKey?: MessageKey;
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
    price: "$1999",
    featureKeys: ["v2.plan3.f1", "v2.plan3.f2", "v2.plan3.f3", "v2.plan3.f4"],
    requestKey: "v2.plan3.request",
    resultKey: "v2.plan3.result",
    noteKey: "v2.plan3.note",
  },
];

type FaqItem = { qKey: MessageKey; aKey: MessageKey };
type FaqGroupId = "pay" | "me" | "georgia";

const FAQ_GROUPS: {
  id: FaqGroupId;
  titleKey: MessageKey;
  teaserKey: MessageKey;
  items: FaqItem[];
}[] = [
  {
    id: "pay",
    titleKey: "amina.faq.tab.pay",
    teaserKey: "amina.faq.tab.payTeaser",
    items: [
      { qKey: "v2.faq.q1", aKey: "v2.faq.a1" },
      { qKey: "v2.faq.q7", aKey: "v2.faq.a7" },
      { qKey: "v2.faq.q6", aKey: "v2.faq.a6" },
      { qKey: "v2.faq.q9", aKey: "v2.faq.a9" },
      { qKey: "amina.faq.pay.q1", aKey: "amina.faq.pay.a1" },
      { qKey: "amina.faq.pay.q2", aKey: "amina.faq.pay.a2" },
    ],
  },
  {
    id: "me",
    titleKey: "amina.faq.tab.me",
    teaserKey: "amina.faq.tab.meTeaser",
    items: [
      { qKey: "v2.faq.q2", aKey: "v2.faq.a2" },
      { qKey: "v2.faq.q3", aKey: "v2.faq.a3" },
      { qKey: "v2.faq.q8", aKey: "v2.faq.a8" },
      { qKey: "v2.faq.q4", aKey: "v2.faq.a4" },
      { qKey: "v2.faq.q5", aKey: "v2.faq.a5" },
      { qKey: "amina.faq.me.q1", aKey: "amina.faq.me.a1" },
    ],
  },
  {
    id: "georgia",
    titleKey: "amina.faq.tab.georgia",
    teaserKey: "amina.faq.tab.georgiaTeaser",
    items: [
      { qKey: "invest.faq.q1", aKey: "invest.faq.a1" },
      { qKey: "invest.faq.q2", aKey: "invest.faq.a2" },
      { qKey: "invest.faq.q3", aKey: "invest.faq.a3" },
      { qKey: "invest.faq.q4", aKey: "invest.faq.a4" },
      { qKey: "invest.faq.q5", aKey: "invest.faq.a5" },
      { qKey: "invest.faq.q6", aKey: "invest.faq.a6" },
      { qKey: "invest.faq.q7", aKey: "invest.faq.a7" },
      { qKey: "invest.faq.q8", aKey: "invest.faq.a8" },
      { qKey: "invest.faq.q9", aKey: "invest.faq.a9" },
      { qKey: "invest.faq.q10", aKey: "invest.faq.a10" },
      { qKey: "invest.faq.q11", aKey: "invest.faq.a11" },
    ],
  },
];

const WHY_STATS: { value: string; labelKey: MessageKey; noteKey: MessageKey; tone: "gray" | "green" | "white" }[] = [
  { value: "0%", labelKey: "v2.stats.tax", noteKey: "v2.stats.taxNote", tone: "gray" },
  { value: "$150k", labelKey: "v2.stats.residency", noteKey: "v2.stats.residencyNote", tone: "green" },
  { value: "30–70%", labelKey: "v2.stats.capital", noteKey: "v2.stats.capitalNote", tone: "green" },
  { value: "3.7M", labelKey: "v2.stats.tourists", noteKey: "v2.stats.touristsNote", tone: "gray" },
  { value: "13.2%", labelKey: "v2.stats.yield", noteKey: "v2.stats.yieldNote", tone: "green" },
];

const AMINA_PROMO_CLIENT_KEY = "amina_promo_client_v1";
const EXPRESS_PLAN_ID = "express-audit";

type AminaPromoState = {
  limit: number;
  claimed: number;
  remaining: number;
  active: boolean;
};

function getAminaClientId(): string {
  try {
    const existing = localStorage.getItem(AMINA_PROMO_CLIENT_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `c_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(AMINA_PROMO_CLIENT_KEY, id);
    return id;
  } catch {
    return `anon_${Date.now()}`;
  }
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".am .rv");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.05, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    requestAnimationFrame(() => {
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95 && r.bottom > 0) {
          el.classList.add("in");
          io.unobserve(el);
        }
      });
    });
    return () => io.disconnect();
  }, []);
}

function waPlanHref(planName: string, price: string) {
  const text = encodeURIComponent(
    `Здравствуйте! Я пришёл(а) от Амины. Интересует тариф «${planName}» (${price}). Подскажите, как записаться и оплатить.`,
  );
  return `${ASSISTANT_WA}?text=${text}`;
}

function AminaNav() {
  const t = useT();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links: { href: string; labelKey: MessageKey }[] = [
    { href: "#hero", labelKey: "amina.nav.hero" },
    { href: "#market", labelKey: "amina.nav.market" },
    { href: "#why-georgia", labelKey: "amina.nav.why" },
    { href: "#tariffs", labelKey: "amina.nav.tariffs" },
    { href: "#faq", labelKey: "amina.nav.faq" },
  ];

  /** In-page jump without leaving #hash in the URL (keeps next open at the top). */
  const go = (href: string) => {
    setOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header className={`am-nav${scrolled ? " is-scrolled" : ""}`}>
        <div className="am-nav-inner">
          <Link href="/" className="am-nav-logo" aria-label="Arthur — Real Estate Strategist">
            <img
              className="am-nav-logo-light"
              src="/brand/arthur-logo-white.png"
              alt="arthur's — Real Estate Strategist"
            />
            <img
              className="am-nav-logo-dark"
              src="/brand/arthur-logo-black.png"
              alt="arthur's — Real Estate Strategist"
            />
          </Link>
          <nav className="am-nav-links" aria-label="Amina landing">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  go(l.href);
                }}
              >
                {t(l.labelKey)}
              </a>
            ))}
          </nav>
          <div className="am-nav-right">
            <NavLocaleSwitcher tone={scrolled ? "light" : "dark"} showCurrency={false} />
            <a className="am-nav-wa" href={ASSISTANT_HREF} target="_blank" rel="noopener noreferrer">
              {t("amina.nav.assistant")}
            </a>
            <button
              type="button"
              className="am-nav-burger"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
      {open ? (
        <div className="am-nav-sheet" role="dialog" aria-modal="true">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                go(l.href);
              }}
            >
              {t(l.labelKey)}
            </a>
          ))}
          <a className="am-btn am-btn-dark" href={ASSISTANT_HREF} target="_blank" rel="noopener noreferrer">
            {t("amina.nav.assistant")}
          </a>
        </div>
      ) : null}
    </>
  );
}

function Hero() {
  const t = useT();
  const [hasVideo, setHasVideo] = useState(true);

  return (
    <section id="hero" className="am-hero">
      <div className="am-wrap am-hero-grid">
        <div className="am-hero-copy rv">
          <h1 className="am-h1">{t("amina.hero.title")}</h1>
          <div className="am-hero-body">
            <p>{t("amina.hero.p1")}</p>
            <p>{t("amina.hero.p2")}</p>
          </div>
          <div className="am-hero-frame">
            <a
              href="#tariffs"
              className="am-btn am-btn-ghost"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("tariffs")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {t("amina.nav.consultation")}
            </a>
            <a
              href="#faq"
              className="am-btn am-btn-ghost"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("faq")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {t("amina.nav.faq")}
            </a>
          </div>
        </div>

        <div className="am-hero-media rv" aria-label={t("amina.hero.videoLabel")}>
          <div className="am-phone">
            {hasVideo ? (
              <video
                className="am-phone-media"
                src="/amina/stories-amina.mp4"
                poster="/amina/stories-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                tabIndex={-1}
                onError={() => setHasVideo(false)}
              />
            ) : (
              <img
                className="am-phone-media"
                src="/amina/stories-poster.jpg"
                alt=""
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Market() {
  const t = useT();
  return (
    <section id="market" className="am-market">
      <div className="am-wrap am-market-grid">
        <div className="am-market-copy rv">
          <h2 className="am-h2">{t("amina.market.title")}</h2>
          <p className="am-lead">{t("amina.market.body2")}</p>
        </div>
        <figure className="am-market-fig rv">
          <img src="/home/hero-arthur-terrace.jpg" alt="" loading="lazy" />
        </figure>
      </div>
    </section>
  );
}

function WhyGeorgia() {
  const t = useT();
  return (
    <section id="why-georgia" className="am-why">
      <div className="am-wrap">
        <div className="am-why-head rv">
          <h2 className="am-h2">{t("v2.why.title")}</h2>
          <p className="am-lead am-why-lead">
            {t("v2.why.bodyLead")} {t("v2.what.question")}
          </p>
          <p className="am-lead">{t("amina.why.body")}</p>
        </div>

        <div className="am-stats rv">
          {WHY_STATS.map((s) => (
            <div key={s.labelKey} className={`am-stat am-stat-${s.tone}`}>
              <div className="am-stat-top">
                <span className="am-stat-value">{s.value}</span>
                <span className="am-stat-label">{t(s.labelKey)}</span>
              </div>
              <span className="am-stat-note">{t(s.noteKey)}</span>
            </div>
          ))}
        </div>

        <div className="am-photo-row rv">
          <img src="/amina/photo-sea.jpg" alt="" loading="lazy" />
          <img src="/amina/photo-wine.jpg" alt="" loading="lazy" />
          <img src="/amina/photo-food.jpg" alt="" loading="lazy" />
          <img src="/amina/photo-horse.jpg" alt="" loading="lazy" />
        </div>
      </div>
    </section>
  );
}

function Tariffs() {
  const t = useT();
  const [promo, setPromo] = useState<AminaPromoState | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/amina-promo")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: AminaPromoState | null) => {
        if (!cancelled && data && typeof data.remaining === "number") setPromo(data);
      })
      .catch(() => {
        /* keep null → show regular $79 */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const promoActive = Boolean(promo?.active);

  const openPlan = async (plan: Plan) => {
    let price = plan.price;
    if (plan.id === EXPRESS_PLAN_ID && promoActive) {
      price = "$0";
      try {
        const res = await fetch("/api/amina-promo/claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clientId: getAminaClientId() }),
        });
        if (res.ok) {
          const next = (await res.json()) as AminaPromoState;
          setPromo(next);
        }
      } catch {
        /* still open WhatsApp at $0 while promo was shown */
      }
    }
    window.open(waPlanHref(t(plan.nameKey), price), "_blank", "noopener,noreferrer");
  };

  return (
    <section id="tariffs" className="am-pricing">
      <div className="am-wrap">
        <h2 className="am-h1 rv">
          {t("v2.pricing.line1")}
          <br />
          {t("v2.pricing.line2")}
        </h2>
        <p className="am-pricing-note rv">{t("amina.pricing.note")}</p>

        <div className="am-plans">
          {PLANS.map((plan) => {
            const showPromo = plan.id === EXPRESS_PLAN_ID && promoActive;
            return (
              <div key={plan.id} className={`am-plan rv${plan.featured ? " is-featured" : ""}`}>
                <h3>{t(plan.nameKey)}</h3>
                <p className="am-plan-for">{t(plan.forKey)}</p>
                <ul>
                  {plan.featureKeys.map((k) => (
                    <li key={k}>{t(k)}</li>
                  ))}
                </ul>
                <div className="am-plan-block">
                  <strong>{t("v2.pricing.requestLabel")}</strong>
                  <p>{t(plan.requestKey)}</p>
                </div>
                <div className="am-plan-block">
                  <strong>{t("v2.pricing.resultLabel")}</strong>
                  <p>{t(plan.resultKey)}</p>
                </div>
                {showPromo ? (
                  <div className="am-plan-price am-plan-price-promo">
                    <span className="am-price-was">$79</span>
                    <span className="am-price-now">$0</span>
                    <span className="am-price-spots">
                      {t("amina.promo.spotsLeft", { n: promo?.remaining ?? 10 })}
                    </span>
                  </div>
                ) : (
                  <div className="am-plan-price">{plan.price}</div>
                )}
                <p className={`am-plan-note${plan.noteKey ? "" : " is-empty"}`}>
                  {plan.noteKey ? t(plan.noteKey) : "\u00A0"}
                </p>
                <button
                  type="button"
                  className={`am-btn am-plan-cta ${plan.featured ? "am-btn-white" : "am-btn-dark"}`}
                  onClick={() => void openPlan(plan)}
                >
                  {t("amina.pricing.choose")}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const t = useT();
  const cards: { titleKey: MessageKey; bodyKey: MessageKey }[] = [
    { titleKey: "amina.how.payTitle", bodyKey: "amina.how.payBody" },
    { titleKey: "amina.how.assistantTitle", bodyKey: "amina.how.assistantBody" },
    { titleKey: "amina.how.arthurTitle", bodyKey: "amina.how.arthurBody" },
  ];
  return (
    <section id="how" className="am-how">
      <div className="am-wrap">
        <div className="am-how-head rv">
          <h2 className="am-h2">{t("amina.how.title")}</h2>
          <p className="am-lead">{t("amina.how.lead")}</p>
        </div>
        <div className="am-how-grid">
          {cards.map((c) => (
            <article key={c.titleKey} className="am-how-card rv">
              <h3>{t(c.titleKey)}</h3>
              <p>{t(c.bodyKey)}</p>
            </article>
          ))}
        </div>
        <div className="am-how-band rv">
          <img src="/amina/why-band.jpg" alt="" loading="lazy" />
          <div className="am-how-band-copy">
            <h3 className="am-h3">{t("amina.how.bandTitle")}</h3>
            <p>{t("amina.how.bandBody")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqWidget() {
  const t = useT();
  const [active, setActive] = useState<FaqGroupId | null>(null);
  const [openIndex, setOpenIndex] = useState(0);
  const group = FAQ_GROUPS.find((g) => g.id === active) ?? null;

  const select = (id: FaqGroupId) => {
    setActive(id);
    setOpenIndex(0);
    requestAnimationFrame(() => {
      document.getElementById("faq-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <section id="faq" className="am-faq">
      <div className="am-wrap">
        <div className="am-faq-head rv">
          <h2 className="am-h2">{t("amina.faq.title")}</h2>
          <p className="am-lead">{t("amina.faq.lead")}</p>
        </div>

        <div className="am-faq-tabs rv" role="tablist" aria-label={t("amina.faq.title")}>
          {FAQ_GROUPS.map((g) => {
            const on = active === g.id;
            return (
              <button
                key={g.id}
                type="button"
                role="tab"
                aria-selected={on}
                className={`am-faq-tab${on ? " is-on" : ""}`}
                onClick={() => select(g.id)}
              >
                <span className="am-faq-tab-title">{t(g.titleKey)}</span>
                <span className="am-faq-tab-teaser">{t(g.teaserKey)}</span>
              </button>
            );
          })}
        </div>

        <div id="faq-panel" className="am-faq-panel rv">
          {group ? (
            <>
              <h3 className="am-faq-panel-title">{t(group.titleKey)}</h3>
              <div className="am-faq-list">
                {group.items.map((item, index) => {
                  const isOpen = openIndex === index;
                  return (
                    <div key={item.qKey} className={`am-faq-item${isOpen ? " is-open" : ""}`}>
                      <button
                        type="button"
                        className="am-faq-q"
                        aria-expanded={isOpen}
                        onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      >
                        <span>{t(item.qKey)}</span>
                        <span className="am-faq-toggle" aria-hidden>
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>
                      {isOpen ? <p className="am-faq-a">{t(item.aKey)}</p> : null}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="am-faq-empty">{t("amina.faq.empty")}</p>
          )}

          <div className="am-faq-actions">
            <a
              href="#tariffs"
              className="am-btn am-btn-dark"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("tariffs")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {t("amina.faq.backTariffs")}
            </a>
            <a className="am-btn am-btn-ghost-dark" href={ASSISTANT_HREF} target="_blank" rel="noopener noreferrer">
              {t("amina.faq.writeAssistant")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function DoersBand() {
  const t = useT();
  return (
    <section className="am-doers" aria-label={t("amina.doers.alt")}>
      <img
        src="/amina/doers-and-dreamers.jpg"
        alt={t("amina.doers.alt")}
        loading="lazy"
        decoding="async"
      />
    </section>
  );
}

function AminaFooter() {
  const t = useT();
  return (
    <footer className="am-footer" role="contentinfo">
      <div className="am-wrap am-footer-grid">
        <section className="am-footer-brand" aria-label="Arthur Arutyunyan">
          <img
            className="am-footer-logo"
            src="/brand/sitbo-wordmark-light.png"
            alt="Sitbo"
            width={76}
            height={14}
          />
          <h2 className="am-footer-name">
            <span>Arthur Arutyunyan</span>
            <span className="am-footer-role">{t("v2.footer.role")}</span>
          </h2>
          <p className="am-footer-tag">{t("v2.footer.tagline")}</p>
        </section>

        <nav className="am-footer-col" aria-label={t("amina.footer.page")}>
          <h3>{t("amina.footer.page")}</h3>
            <ul>
              <li>
                <a
                  href="#tariffs"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("tariffs")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  {t("amina.nav.tariffs")}
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("faq")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  {t("amina.nav.faq")}
                </a>
              </li>
              <li>
                <a
                  href="#why-georgia"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("why-georgia")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  {t("amina.nav.why")}
                </a>
              </li>
            </ul>
        </nav>

        <nav className="am-footer-col" aria-label={t("v2.footer.contact")}>
          <h3>{t("v2.footer.contact")}</h3>
          <ul>
            <li>
              <a href={ASSISTANT_HREF} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
            <li>
              <a href="https://t.me/sitboinvest" target="_blank" rel="noopener noreferrer">
                Telegram
              </a>
            </li>
            <li>
              <a href="https://instagram.com/sitboinvest" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="am-wrap am-footer-bottom">
        <p>
          {t("v2.footer.rights")}{" "}
          <Link href="/legal">{t("v2.footer.terms")}</Link>
        </p>
      </div>
    </footer>
  );
}

const STYLES = `
.am {
  --bg: #FFFEF9;
  --ink: #21141A;
  --green: #48674D;
  --gray: #463C41;
  --display: 'JUN', Georgia, serif;
  --body: 'Nunito', sans-serif;
  --max: var(--site-max, 1680px);
  --gutter: var(--site-gutter, clamp(16px, 2.8vw, 40px));
  --nav-h: ${NAV_H}px;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--body);
  overflow-x: hidden;
}
.am-wrap { max-width: var(--max); margin: 0 auto; padding: 0 var(--gutter); box-sizing: border-box; }
.am .rv { opacity: 0; transform: translateY(22px); transition: opacity .7s ease, transform .7s ease; }
.am .rv.in { opacity: 1; transform: none; }

.am-h1 { font-family: var(--display); font-weight: 600; font-size: clamp(34px, 4.6vw, 64px); line-height: 1.06; letter-spacing: -0.02em; margin: 0; }
.am-h2 { font-family: var(--display); font-weight: 600; font-size: clamp(30px, 3.9vw, 56px); line-height: 1.14; letter-spacing: -0.015em; margin: 0; }
.am-h3 { font-family: var(--display); font-weight: 600; font-size: clamp(24px, 2.8vw, 40px); line-height: 1.15; margin: 0; }
.am-lead { font-family: var(--body); font-size: clamp(15px, 1.2vw, 17px); line-height: 1.65; color: rgba(33,20,26,.78); margin: 0; max-width: 62ch; }
.am-eyebrow { font-family: var(--body); font-size: 12px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; margin: 0 0 18px; color: rgba(255,254,249,.7); }
.am-eyebrow-dark { color: rgba(33,20,26,.55); }

.am-btn {
  display: inline-flex; align-items: center; justify-content: center;
  font-family: var(--body); font-size: 15px; font-weight: 500;
  padding: 14px 26px; border-radius: 2px; border: 1px solid transparent;
  cursor: pointer; text-decoration: none; white-space: nowrap;
  transition: opacity .2s, background .2s, color .2s, border-color .2s;
}
.am-btn-dark { background: var(--ink); color: var(--bg); }
.am-btn-dark:hover { opacity: .9; }
.am-btn-white { background: var(--bg); color: var(--ink); }
.am-btn-white:hover { opacity: .9; }
.am-btn-ghost { background: transparent; color: var(--bg); border-color: rgba(255,254,249,.5); }
.am-btn-ghost:hover { background: var(--bg); color: var(--ink); }
.am-btn-ghost-dark { background: transparent; color: var(--ink); border-color: rgba(33,20,26,.4); }
.am-btn-ghost-dark:hover { background: var(--ink); color: var(--bg); }

/* nav */
.am-nav {
  position: fixed; inset: 0 0 auto 0; z-index: 80; height: var(--nav-h);
  display: flex; align-items: center;
  background: transparent; transition: background .25s, backdrop-filter .25s, box-shadow .25s;
  --am-nav-ink: #FFFEF9;
}
.am-nav.is-scrolled {
  background: rgba(255,254,249,.88);
  backdrop-filter: blur(14px);
  box-shadow: 0 1px 0 rgba(33,20,26,.06);
  --am-nav-ink: #21141A;
}
.am-nav-inner {
  width: 100%; max-width: var(--max); margin: 0 auto; padding: 0 var(--gutter);
  display: flex; align-items: center; gap: 28px; box-sizing: border-box;
}
.am-nav-logo { display: flex; align-items: center; flex-shrink: 0; text-decoration: none; line-height: 0; }
.am-nav-logo img { height: 44px; width: auto; display: block; }
.am-nav.is-scrolled .am-nav-logo-light { display: none; }
.am-nav:not(.is-scrolled) .am-nav-logo-dark { display: none; }
.am-nav-links { display: flex; gap: clamp(16px, 2vw, 28px); flex: 1; justify-content: center; }
.am-nav-links a {
  font-size: 13px; font-weight: 500; color: var(--am-nav-ink); text-decoration: none;
  letter-spacing: .02em; opacity: .78;
}
.am-nav-links a:hover { opacity: 1; }
.am-nav-right { display: flex; align-items: center; gap: 14px; margin-left: auto; }
.am-nav-wa {
  font-size: 13px; font-weight: 600; color: var(--am-nav-ink); text-decoration: none;
  padding: 8px 14px; border: 1px solid color-mix(in srgb, var(--am-nav-ink) 35%, transparent); border-radius: 2px;
}
.am-nav-wa:hover { background: var(--am-nav-ink); color: #21141A; }
.am-nav.is-scrolled .am-nav-wa:hover { color: #FFFEF9; }
.am-nav-burger {
  display: none; width: 40px; height: 40px; border: none; background: transparent; cursor: pointer;
  flex-direction: column; justify-content: center; gap: 6px; padding: 0;
}
.am-nav-burger span { display: block; height: 1.5px; width: 22px; background: var(--am-nav-ink); margin: 0 auto; }
.am-nav-sheet {
  position: fixed; inset: var(--nav-h) 0 0 0; z-index: 79;
  background: var(--bg); padding: 28px var(--gutter);
  display: flex; flex-direction: column; gap: 18px;
}
.am-nav-sheet a { font-family: var(--display); font-size: 28px; color: var(--ink); text-decoration: none; }
.am-nav-sheet .am-btn { margin-top: 12px; width: fit-content; }

/* hero — dark editorial */
.am-hero {
  background: var(--ink); color: var(--bg);
  padding: calc(var(--nav-h) + clamp(36px, 5vw, 72px)) 0 clamp(56px, 8vw, 110px);
}
.am-hero-grid {
  display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(240px, 0.7fr);
  gap: clamp(36px, 6vw, 88px); align-items: center;
}
.am-hero-copy .am-h1 { color: var(--bg); max-width: 16ch; margin-bottom: 22px; }
.am-hero-body { display: grid; gap: 16px; max-width: 58ch; margin-bottom: 28px; }
.am-hero-body p {
  margin: 0; font-size: clamp(15px, 1.2vw, 17px); line-height: 1.65;
  color: rgba(255,254,249,.82);
}
.am-hero-frame {
  display: inline-flex; align-items: stretch; gap: 0;
  border: 1px solid rgba(255,254,249,.45); border-radius: 2px; overflow: hidden;
}
.am-hero-frame .am-btn {
  border: none; border-radius: 0; border-right: 1px solid rgba(255,254,249,.28);
  padding: 14px 26px;
}
.am-hero-frame .am-btn:last-child { border-right: none; }
.am-hero-frame .am-btn:hover { background: #FFFEF9; color: #21141A; }
.am-hero-actions { display: flex; flex-wrap: wrap; gap: 12px; }
.am-hero-media { display: flex; justify-content: center; }
.am-phone {
  width: min(100%, 320px);
  aspect-ratio: 9 / 16;
  border-radius: 2px; overflow: hidden;
  background: #160e12;
  border: 1px solid rgba(255,254,249,.12);
  box-shadow: 0 24px 60px rgba(0,0,0,.35);
}
.am-phone-media { width: 100%; height: 100%; object-fit: cover; display: block; }

/* market */
.am-market { padding: clamp(64px, 9vw, 120px) 0; background: var(--bg); }
.am-market-grid {
  display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, .9fr);
  gap: clamp(28px, 5vw, 72px); align-items: center;
}
.am-market-copy .am-h2 { margin: 0 0 22px; max-width: 28ch; }
.am-market-copy .am-lead + .am-lead { margin-top: 16px; }
.am-market-fig { margin: 0; border-radius: 2px; overflow: hidden; }
.am-market-fig img { width: 100%; height: 100%; object-fit: cover; display: block; min-height: 320px; max-height: 560px; }

/* why */
.am-why { padding: clamp(56px, 8vw, 104px) 0; background: var(--bg); border-top: 1px solid rgba(33,20,26,.08); }
.am-why-head { margin-bottom: clamp(28px, 4vw, 48px); }
.am-why-head .am-h2 { margin-bottom: 18px; max-width: 18ch; }
.am-why-lead { margin-bottom: 14px; color: var(--ink); font-weight: 500; }
.am-stats {
  display: grid; grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px; margin-bottom: clamp(24px, 3vw, 40px);
}
.am-stat {
  border-radius: 2px; min-height: 160px; padding: 22px 20px;
  display: flex; flex-direction: column; justify-content: space-between;
}
.am-stat-gray { background: var(--gray); color: var(--bg); }
.am-stat-green { background: var(--green); color: var(--bg); }
.am-stat-white { background: #fff; color: var(--ink); border: 1px solid rgba(33,20,26,.08); }
.am-stat-value { font-family: var(--display); font-size: clamp(28px, 3vw, 40px); line-height: 1; display: block; margin-bottom: 8px; }
.am-stat-label { font-size: 13px; font-weight: 600; display: block; }
.am-stat-note { font-size: 12px; opacity: .75; margin-top: 16px; }
.am-photo-row {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
}
.am-photo-row img {
  width: 100%; aspect-ratio: 4/5; object-fit: cover; border-radius: 2px; display: block;
}

/* pricing */
.am-pricing { padding: clamp(56px, 8vw, 110px) 0; background: var(--ink); color: var(--bg); }
.am-pricing .am-h1 { color: var(--bg); margin-bottom: 14px; }
.am-pricing-note { color: rgba(255,254,249,.72); margin: 0 0 clamp(28px, 4vw, 48px); max-width: 62ch; }
.am-plans { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(14px, 1.5vw, 22px); align-items: stretch; }
.am-plan {
  background: var(--bg); color: var(--ink); border-radius: 2px;
  padding: clamp(32px, 3.4vw, 48px) clamp(24px, 2.6vw, 36px);
  display: flex; flex-direction: column; box-sizing: border-box;
  min-height: clamp(640px, 70vh, 820px);
}
.am-plan.is-featured { background: var(--green); color: var(--bg); }
.am-plan h3 { font-family: var(--display); font-weight: 400; font-size: clamp(21px, 2.1vw, 30px); margin: 0 0 12px; }
.am-plan-for {
  font-size: 15px; line-height: 1.35; margin: 0 0 22px;
  padding-bottom: 20px; border-bottom: 1px solid rgba(33,20,26,.15);
}
.am-plan.is-featured .am-plan-for { border-bottom-color: rgba(255,254,249,.22); }
.am-plan ul { list-style: disc; margin: 0 0 22px; padding-left: 18px; display: grid; gap: 12px; }
.am-plan li { font-size: 15px; line-height: 1.45; }
.am-plan-block { margin-bottom: 18px; }
.am-plan-block strong { display: block; font-size: 16px; font-weight: 700; margin-bottom: 8px; }
.am-plan-block p { margin: 0; font-size: 15px; line-height: 1.5; }
.am-plan-price {
  font-family: var(--display); font-size: clamp(36px, 4vw, 52px); line-height: 1.05;
  margin: auto 0 14px; letter-spacing: -0.02em;
}
.am-plan-price-promo {
  display: flex; flex-direction: column; align-items: flex-start; gap: 6px;
}
.am-price-was {
  font-size: clamp(18px, 1.8vw, 22px);
  text-decoration: line-through;
  opacity: 0.55;
  letter-spacing: 0;
}
.am-price-now {
  font-size: clamp(36px, 4vw, 52px);
  line-height: 1.05;
  letter-spacing: -0.02em;
}
.am-price-spots {
  font-family: var(--body);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--green);
  opacity: 1;
  margin-top: 4px;
}
.am-plan-note { font-size: 13px; line-height: 1.5; color: rgba(33,20,26,.55); margin: 0 0 18px; min-height: 5.2em; }
.am-plan-note.is-empty { visibility: hidden; }
.am-plan.is-featured .am-plan-note { color: rgba(255,254,249,.7); }
.am-plan-cta { width: 100%; }

/* how */
.am-how { padding: clamp(56px, 8vw, 104px) 0; background: var(--bg); }
.am-how-head { margin-bottom: clamp(28px, 4vw, 44px); }
.am-how-head .am-h2 { margin-bottom: 16px; max-width: 18ch; }
.am-how-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: clamp(28px, 4vw, 48px); }
.am-how-card {
  border: 1px solid rgba(33,20,26,.1); border-radius: 2px;
  padding: clamp(24px, 3vw, 36px); background: #fff;
}
.am-how-card h3 { font-family: var(--display); font-size: clamp(22px, 2vw, 28px); margin: 0 0 14px; font-weight: 500; }
.am-how-card p { margin: 0; font-size: 15px; line-height: 1.6; color: rgba(33,20,26,.75); }
.am-how-band {
  position: relative; border-radius: 2px; overflow: hidden; min-height: clamp(280px, 36vw, 420px);
  display: grid; align-items: end;
}
.am-how-band img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.am-how-band::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(33,20,26,.15), rgba(33,20,26,.78));
}
.am-how-band-copy {
  position: relative; z-index: 1; padding: clamp(28px, 4vw, 48px);
  color: var(--bg); max-width: 640px;
}
.am-how-band-copy .am-h3 { color: var(--bg); margin-bottom: 12px; }
.am-how-band-copy p { margin: 0; font-size: 16px; line-height: 1.6; color: rgba(255,254,249,.88); }

/* faq widget */
.am-faq { padding: clamp(56px, 8vw, 104px) 0 clamp(72px, 10vw, 128px); background: var(--bg); border-top: 1px solid rgba(33,20,26,.08); }
.am-faq-head { margin-bottom: clamp(24px, 3vw, 40px); }
.am-faq-head .am-h2 { margin-bottom: 14px; }
.am-faq-tabs {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
  margin-bottom: clamp(20px, 3vw, 32px);
}
.am-faq-tab {
  text-align: left; border-radius: 2px; border: 1px solid transparent;
  background: var(--green); color: var(--bg); padding: clamp(22px, 2.6vw, 32px); cursor: pointer;
  min-height: 148px; display: flex; flex-direction: column; gap: 10px;
  transition: background .2s, color .2s, border-color .2s, opacity .2s;
}
.am-faq-tab:hover { opacity: .92; }
.am-faq-tab.is-on {
  background: var(--ink); color: var(--bg); border-color: var(--ink);
  box-shadow: inset 0 0 0 2px rgba(255,254,249,.12);
}
.am-faq-tab-title { font-family: var(--display); font-size: clamp(22px, 2.2vw, 30px); font-weight: 500; line-height: 1.15; }
.am-faq-tab-teaser { font-size: 14px; line-height: 1.45; opacity: .78; }
.am-faq-panel {
  border: 1px solid rgba(33,20,26,.1); border-radius: 2px; background: #fff;
  padding: clamp(24px, 3.2vw, 44px);
}
.am-faq-panel-title { font-family: var(--display); font-size: clamp(24px, 2.4vw, 34px); margin: 0 0 18px; font-weight: 500; }
.am-faq-empty { margin: 0 0 24px; color: rgba(33,20,26,.6); font-size: 15px; }
.am-faq-item { border-top: 1px solid rgba(33,20,26,.1); }
.am-faq-item:last-of-type { border-bottom: 1px solid rgba(33,20,26,.1); }
.am-faq-q {
  width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 16px;
  padding: 16px 0; border: none; background: transparent; cursor: pointer;
  text-align: left; color: var(--ink); font-family: var(--body); font-size: clamp(15px, 1.2vw, 17px);
  font-weight: 500; line-height: 1.35;
}
.am-faq-toggle {
  width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
  background: var(--ink); color: var(--bg);
  display: inline-flex; align-items: center; justify-content: center; font-size: 18px;
}
.am-faq-a {
  margin: 0 0 16px; max-width: 760px;
  font-size: clamp(14px, 1.1vw, 16px); line-height: 1.6; color: rgba(33,20,26,.72);
  white-space: pre-line;
}
.am-faq-actions {
  display: flex; flex-wrap: wrap; gap: 12px; margin-top: clamp(24px, 3vw, 36px);
}

/* doers band — full-bleed before footer */
.am-doers {
  background: var(--bg);
  margin: 0;
  padding: 0;
  line-height: 0;
}
.am-doers img {
  display: block;
  width: 100%;
  height: auto;
  max-height: min(72vh, 720px);
  object-fit: cover;
  object-position: center;
}

/* footer */
.am-footer {
  background: var(--ink); color: var(--bg);
  padding: clamp(56px, 7vw, 96px) 0 clamp(28px, 4vw, 48px);
}
.am-footer-grid {
  display: grid; grid-template-columns: minmax(0, 1.85fr) auto auto;
  gap: clamp(40px, 6vw, 100px); align-items: start;
}
.am-footer-logo { height: 14px; width: auto; display: block; margin-bottom: 14px; }
.am-footer-name {
  font-size: 16px; font-weight: 700; margin: 0 0 14px; display: flex; flex-direction: column; gap: 4px;
}
.am-footer-role { font-size: 13px; font-weight: 500; color: rgba(255,254,249,.88); max-width: 420px; line-height: 1.4; }
.am-footer-tag { font-size: 12px; line-height: 1.5; color: rgba(255,254,249,.78); margin: 0; max-width: 560px; }
.am-footer-col h3 {
  font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
  margin: 0 0 22px; color: var(--bg);
}
.am-footer-col ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
.am-footer-col a { font-size: 12px; color: rgba(255,254,249,.78); text-decoration: none; }
.am-footer-col a:hover { opacity: .55; }
.am-footer-bottom { margin-top: clamp(40px, 6vw, 72px); font-size: 12px; color: rgba(255,254,249,.55); }
.am-footer-bottom a { color: rgba(255,254,249,.78); }

@media (max-width: 1100px) {
  .am-plans { grid-template-columns: 1fr; }
  .am-plan { min-height: 0; }
  .am-stats { grid-template-columns: 1fr 1fr; }
  .am-how-grid { grid-template-columns: 1fr; }
}
@media (max-width: 900px) {
  .am-nav-links, .am-nav-wa { display: none; }
  .am-nav-burger { display: flex; }
  .am-hero-grid, .am-market-grid { grid-template-columns: 1fr; }
  .am-hero-media { order: -1; }
  .am-phone { width: min(100%, 280px); }
  .am-photo-row { grid-template-columns: 1fr 1fr; }
  .am-faq-tabs { grid-template-columns: 1fr; }
  .am-faq-tab { min-height: 0; }
  .am-footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
  .am-footer-brand { grid-column: 1 / -1; }
}
@media (max-width: 640px) {
  .am-stats { grid-template-columns: 1fr; }
  .am-hero-actions, .am-faq-actions { flex-direction: column; align-items: stretch; }
  .am-hero-frame { width: 100%; display: flex; }
  .am-hero-frame .am-btn { flex: 1; }
  .am-btn { width: 100%; }
  .am-nav-logo img { height: 36px; }
}
`;

export default function AminaPage() {
  useReveal();

  useEffect(() => {
    // Always open landing at the top. Ads / leftover #hash must not jump mid-page.
    if (window.location.hash) {
      const clean = `${window.location.pathname}${window.location.search}`;
      window.history.replaceState(null, "", clean);
    }
    const toTop = () => window.scrollTo(0, 0);
    toTop();
    const t0 = window.setTimeout(toTop, 0);
    const t1 = window.setTimeout(toTop, 100);
    const t2 = window.setTimeout(toTop, 350);
    return () => {
      window.clearTimeout(t0);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <div className="am">
      <style>{STYLES}</style>
      <AminaNav />
      <Hero />
      <Market />
      <WhyGeorgia />
      <Tariffs />
      <HowItWorks />
      <FaqWidget />
      <DoersBand />
      <AminaFooter />
    </div>
  );
}
