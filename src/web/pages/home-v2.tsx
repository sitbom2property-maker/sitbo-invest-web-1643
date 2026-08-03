import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { Link } from "wouter";
import { RequestModal } from "../components/RequestModal";
import { Partners } from "../components/partners";
import { projects as catalogProjects } from "../data/projects";
import { localizeProjects } from "../data/projects-locale";
import { useLocale } from "../context/LocaleContext";
import { useT, type MessageKey } from "../i18n";

const C = {
  dark: "#21141A",
  light: "#FFFBF0",
  teal: "#8CB2C0",
  wine: "#683D47",
  muted: "#7a7a7a",
};

function useIsMobile(bp = 900) {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < bp : false,
  );
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < bp);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [bp]);
  return mobile;
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".v2-reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

type ModalState = { open: boolean; source: string; topic?: string; title?: string };

const CLOSED: ModalState = { open: false, source: "" };

// ─── Shared bits ──────────────────────────────────────────────────────────────

function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      style={{
        fontFamily: "Manrope, sans-serif",
        fontSize: 10,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: light ? "rgba(250,247,240,0.5)" : C.teal,
        margin: "0 0 18px",
      }}
    >
      {children}
    </p>
  );
}

function Shell({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "0 clamp(20px, 5vw, 64px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── 1. Hero ──────────────────────────────────────────────────────────────────

function Hero({ onRequest }: { onRequest: (s: ModalState) => void }) {
  const t = useT();
  return (
    <section
      className="v2-hero"
      style={{
        position: "relative",
        width: "100vw",
        minHeight: "100vh",
        marginTop: "calc(-1 * var(--nav-height, 88px))",
        marginLeft: "calc(-50vw + 50%)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <source src="/hero-video.webm" type="video/webm" />
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(to top, rgba(20,14,18,0.86) 0%, rgba(20,14,18,0.45) 45%, rgba(20,14,18,0.12) 78%, rgba(20,14,18,0) 100%)",
        }}
      />

      <Shell style={{ position: "relative", zIndex: 2, width: "100%" }}>
        <div style={{ maxWidth: 820, paddingTop: "var(--nav-height, 88px)" }}>
          <h1
            className="v2-hero-h1"
            style={{
              fontFamily: "Jun, Georgia, serif",
              fontSize: "clamp(38px, 6vw, 86px)",
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              color: "#FFFFFF",
              margin: "0 0 26px",
            }}
          >
            {t("v2.hero.line1")}
            <br />
            <em style={{ fontStyle: "italic" }}>{t("v2.hero.line2")}</em>
          </h1>

          <p
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "clamp(14px, 1.4vw, 17px)",
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.78)",
              maxWidth: 580,
              margin: "0 0 36px",
            }}
          >
            {t("v2.hero.body")}
          </p>

          <div className="v2-hero-ctas">
            <button
              type="button"
              className="v2-btn v2-btn-solid"
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
              className="v2-btn v2-btn-ghost"
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
      </Shell>

      <a href="#why-georgia" className="v2-scroll-hint" aria-label={t("v2.hero.scroll")}>
        <span>{t("v2.hero.scroll")}</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M2 4.5L7 9.5L12 4.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </section>
  );
}

// ─── 2. Why Georgia ───────────────────────────────────────────────────────────

const STATS: { value: string; labelKey: MessageKey }[] = [
  { value: "0%", labelKey: "v2.stats.tax" },
  { value: "$150k", labelKey: "v2.stats.residency" },
  { value: "47.4%", labelKey: "v2.stats.women" },
  { value: "3.7M", labelKey: "v2.stats.tourists" },
  { value: "$1,420", labelKey: "v2.stats.price" },
  { value: "13.2%", labelKey: "v2.stats.yield" },
];

function WhyGeorgia() {
  const t = useT();
  return (
    <section id="why-georgia" style={{ background: C.light, padding: "clamp(72px, 10vw, 130px) 0" }}>
      <Shell>
        <div className="v2-why-head v2-reveal">
          <h2
            style={{
              fontFamily: "Jun, Georgia, serif",
              fontSize: "clamp(30px, 4.6vw, 62px)",
              fontWeight: 400,
              lineHeight: 1.08,
              color: C.dark,
              margin: 0,
              maxWidth: 620,
            }}
          >
            {t("v2.why.title")}
          </h2>
          <p
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "clamp(14px, 1.3vw, 16px)",
              lineHeight: 1.75,
              color: C.muted,
              maxWidth: 400,
              margin: 0,
            }}
          >
            {t("v2.why.body")}
          </p>
        </div>

        <div className="v2-stats-grid v2-reveal">
          {STATS.map((s) => (
            <div key={s.labelKey} className="v2-stat">
              <div
                style={{
                  fontFamily: "Jun, Georgia, serif",
                  fontSize: "clamp(34px, 4vw, 56px)",
                  fontWeight: 400,
                  lineHeight: 1,
                  color: C.dark,
                  marginBottom: 12,
                }}
              >
                {s.value}
              </div>
              <p
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: 12,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: C.muted,
                  margin: 0,
                }}
              >
                {t(s.labelKey)}
              </p>
            </div>
          ))}
        </div>
      </Shell>
    </section>
  );
}

// ─── 3. Alabbar quote ─────────────────────────────────────────────────────────

function Quote() {
  const t = useT();
  return (
    <section
      style={{
        background: C.dark,
        padding: "clamp(72px, 10vw, 130px) 0",
        position: "relative",
      }}
    >
      <Shell>
        <div className="v2-reveal" style={{ maxWidth: 940, margin: "0 auto", textAlign: "center" }}>
          <img
            src="/eagle-hills-logo.png"
            alt="Eagle Hills"
            style={{ height: 26, width: "auto", opacity: 0.75, marginBottom: 34 }}
          />
          <blockquote
            style={{
              fontFamily: "Jun, Georgia, serif",
              fontSize: "clamp(22px, 3.2vw, 42px)",
              fontWeight: 400,
              fontStyle: "italic",
              lineHeight: 1.35,
              color: C.light,
              margin: "0 0 30px",
            }}
          >
            “{t("v2.quote.text")}”
          </blockquote>
          <p
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: 12,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: C.teal,
              margin: "0 0 34px",
            }}
          >
            {t("v2.quote.author")}
          </p>
          <Link href="/invest" className="v2-btn v2-btn-outline-light">
            {t("v2.quote.cta")}
          </Link>
        </div>
      </Shell>
    </section>
  );
}

// ─── 4. Selected projects ─────────────────────────────────────────────────────

function SelectedProjects() {
  const t = useT();
  const { language } = useLocale();
  const projects = useMemo(
    () => localizeProjects(catalogProjects, language).slice(0, 3),
    [language],
  );

  return (
    <section id="properties" style={{ background: C.light, padding: "clamp(72px, 10vw, 130px) 0" }}>
      <Shell>
        <div className="v2-projects-head v2-reveal">
          <div>
            <Eyebrow>{t("v2.projects.eyebrow")}</Eyebrow>
            <h2
              style={{
                fontFamily: "Jun, Georgia, serif",
                fontSize: "clamp(30px, 4.6vw, 62px)",
                fontWeight: 400,
                lineHeight: 1.08,
                color: C.dark,
                margin: 0,
              }}
            >
              {t("v2.projects.title")}
              <br />
              <em style={{ fontStyle: "italic", color: C.wine }}>{t("v2.projects.titleEm")}</em>
            </h2>
          </div>
          <div style={{ maxWidth: 360 }}>
            <p
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: "clamp(14px, 1.3vw, 16px)",
                lineHeight: 1.75,
                color: C.muted,
                margin: "0 0 20px",
              }}
            >
              {t("v2.projects.body")}
            </p>
            <Link href="/catalog" className="v2-link-arrow">
              {t("v2.projects.viewAll")} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="v2-projects-grid">
          {projects.map((p) => (
            <Link key={p.slug} href={`/project/${p.slug}`} className="v2-project-card v2-reveal">
              <div className="v2-project-media">
                <img src={p.cardImage} alt={p.name} loading="lazy" />
                <span className="v2-project-yield">{p.yield}</span>
              </div>
              <div style={{ padding: "20px 4px 0" }}>
                <p
                  style={{
                    fontFamily: "Manrope, sans-serif",
                    fontSize: 10,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: C.muted,
                    margin: "0 0 8px",
                  }}
                >
                  {p.tag}
                </p>
                <h3
                  style={{
                    fontFamily: "Jun, Georgia, serif",
                    fontSize: 24,
                    fontWeight: 400,
                    color: C.dark,
                    margin: "0 0 10px",
                  }}
                >
                  {p.name}
                </h3>
                <p
                  style={{
                    fontFamily: "Manrope, sans-serif",
                    fontSize: 13,
                    color: C.muted,
                    margin: 0,
                  }}
                >
                  {p.priceFrom} · {p.completion}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Shell>
    </section>
  );
}

// ─── 5. Ecosystem ─────────────────────────────────────────────────────────────

const ECOSYSTEM: { titleKey: MessageKey; bodyKey: MessageKey }[] = [
  { titleKey: "v2.eco.legal.title", bodyKey: "v2.eco.legal.body" },
  { titleKey: "v2.eco.banking.title", bodyKey: "v2.eco.banking.body" },
  { titleKey: "v2.eco.renovation.title", bodyKey: "v2.eco.renovation.body" },
  { titleKey: "v2.eco.management.title", bodyKey: "v2.eco.management.body" },
];

function Ecosystem() {
  const t = useT();
  return (
    <section style={{ background: C.dark, padding: "clamp(72px, 10vw, 130px) 0" }}>
      <Shell>
        <div className="v2-eco-head v2-reveal">
          <div>
            <Eyebrow light>{t("v2.eco.eyebrow")}</Eyebrow>
            <h2
              style={{
                fontFamily: "Jun, Georgia, serif",
                fontSize: "clamp(30px, 4.6vw, 62px)",
                fontWeight: 400,
                lineHeight: 1.08,
                color: C.light,
                margin: 0,
              }}
            >
              {t("v2.eco.title")}
              <br />
              <em style={{ fontStyle: "italic", color: C.teal }}>{t("v2.eco.titleEm")}</em>
            </h2>
          </div>
          <p
            style={{
              fontFamily: "Manrope, sans-serif",
              fontSize: "clamp(14px, 1.3vw, 16px)",
              lineHeight: 1.75,
              color: "rgba(250,247,240,0.6)",
              maxWidth: 380,
              margin: 0,
            }}
          >
            {t("v2.eco.body")}
          </p>
        </div>

        <div className="v2-eco-grid">
          {ECOSYSTEM.map((item, i) => (
            <div key={item.titleKey} className="v2-eco-card v2-reveal">
              <span
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  color: C.teal,
                }}
              >
                0{i + 1}
              </span>
              <h3
                style={{
                  fontFamily: "Jun, Georgia, serif",
                  fontSize: 22,
                  fontWeight: 400,
                  color: C.light,
                  margin: "16px 0 12px",
                }}
              >
                {t(item.titleKey)}
              </h3>
              <p
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "rgba(250,247,240,0.55)",
                  margin: 0,
                }}
              >
                {t(item.bodyKey)}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 64 }}>
          <Partners />
        </div>
      </Shell>
    </section>
  );
}

// ─── 6. Feedback & case studies ───────────────────────────────────────────────

const TESTIMONIALS: { quoteKey: MessageKey; authorKey: MessageKey }[] = [
  { quoteKey: "v2.fb.q1", authorKey: "v2.fb.a1" },
  { quoteKey: "v2.fb.q2", authorKey: "v2.fb.a2" },
  { quoteKey: "v2.fb.q3", authorKey: "v2.fb.a3" },
];

const CASES: {
  titleKey: MessageKey;
  typeKey: MessageKey;
  cityKey: MessageKey;
  image: string;
}[] = [
  {
    titleKey: "v2.case1.title",
    typeKey: "v2.case1.type",
    cityKey: "v2.case.city",
    image: "/artex-parkline.png",
  },
  {
    titleKey: "v2.case2.title",
    typeKey: "v2.case2.type",
    cityKey: "v2.case.city",
    image: "/queens-residence.png",
  },
  {
    titleKey: "v2.case3.title",
    typeKey: "v2.case3.type",
    cityKey: "v2.case.city",
    image: "/silk-towers.png",
  },
];

function Feedback() {
  const t = useT();
  return (
    <section id="feedback" style={{ background: C.light, padding: "clamp(72px, 10vw, 130px) 0" }}>
      <Shell>
        <div className="v2-reveal" style={{ marginBottom: 56 }}>
          <Eyebrow>{t("v2.fb.eyebrow")}</Eyebrow>
          <h2
            style={{
              fontFamily: "Jun, Georgia, serif",
              fontSize: "clamp(30px, 4.6vw, 62px)",
              fontWeight: 400,
              lineHeight: 1.08,
              color: C.dark,
              margin: 0,
              maxWidth: 720,
            }}
          >
            {t("v2.fb.title")} <em style={{ fontStyle: "italic", color: C.wine }}>{t("v2.fb.titleEm")}</em>
          </h2>
        </div>

        <div className="v2-fb-grid">
          {TESTIMONIALS.map((item) => (
            <figure key={item.quoteKey} className="v2-fb-card v2-reveal">
              <div style={{ color: C.teal, fontSize: 13, letterSpacing: "0.2em", marginBottom: 18 }}>
                ★★★★★
              </div>
              <blockquote
                style={{
                  fontFamily: "Jun, Georgia, serif",
                  fontSize: 19,
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: C.dark,
                  margin: "0 0 20px",
                }}
              >
                “{t(item.quoteKey)}”
              </blockquote>
              <figcaption
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  color: C.muted,
                }}
              >
                {t(item.authorKey)}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="v2-case-grid">
          {CASES.map((c) => (
            <article key={c.titleKey} className="v2-case-card v2-reveal">
              <div className="v2-case-media">
                <img src={c.image} alt={t(c.titleKey)} loading="lazy" />
              </div>
              <div style={{ padding: "22px 22px 24px" }}>
                <h3
                  style={{
                    fontFamily: "Jun, Georgia, serif",
                    fontSize: 21,
                    fontWeight: 400,
                    color: C.light,
                    margin: "0 0 16px",
                  }}
                >
                  {t(c.titleKey)}
                </h3>
                <dl style={{ margin: 0, display: "grid", gap: 8 }}>
                  <div className="v2-case-row">
                    <dt>{t("v2.case.locationLabel")}</dt>
                    <dd>{t(c.cityKey)}</dd>
                  </div>
                  <div className="v2-case-row">
                    <dt>{t("v2.case.typeLabel")}</dt>
                    <dd>{t(c.typeKey)}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      </Shell>
    </section>
  );
}

// ─── 7. Pricing — it always starts with a call ────────────────────────────────

type Plan = {
  id: string;
  nameKey: MessageKey;
  forKey: MessageKey;
  price: string;
  featureKeys: MessageKey[];
  resultKey: MessageKey;
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "express",
    nameKey: "v2.plan1.name",
    forKey: "v2.plan1.for",
    price: "$79",
    featureKeys: ["v2.plan1.f1", "v2.plan1.f2", "v2.plan1.f3"],
    resultKey: "v2.plan1.result",
  },
  {
    id: "deep-dive",
    nameKey: "v2.plan2.name",
    forKey: "v2.plan2.for",
    price: "$279",
    featureKeys: ["v2.plan2.f1", "v2.plan2.f2", "v2.plan2.f3", "v2.plan2.f4"],
    resultKey: "v2.plan2.result",
    featured: true,
  },
  {
    id: "tour",
    nameKey: "v2.plan3.name",
    forKey: "v2.plan3.for",
    price: "$1,999",
    featureKeys: ["v2.plan3.f1", "v2.plan3.f2", "v2.plan3.f3"],
    resultKey: "v2.plan3.result",
  },
];

function Pricing({ onRequest }: { onRequest: (s: ModalState) => void }) {
  const t = useT();
  return (
    <section id="consultation" style={{ background: C.dark, padding: "clamp(72px, 10vw, 130px) 0" }}>
      <Shell>
        <div className="v2-reveal" style={{ textAlign: "center", marginBottom: 60 }}>
          <Eyebrow light>{t("v2.pricing.eyebrow")}</Eyebrow>
          <h2
            style={{
              fontFamily: "Jun, Georgia, serif",
              fontSize: "clamp(30px, 4.6vw, 62px)",
              fontWeight: 400,
              lineHeight: 1.08,
              color: C.light,
              margin: "0 auto",
              maxWidth: 760,
            }}
          >
            {t("v2.pricing.title")}
          </h2>
        </div>

        <div className="v2-plan-grid">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`v2-plan-card v2-reveal${plan.featured ? " is-featured" : ""}`}
            >
              {plan.featured ? <span className="v2-plan-badge">{t("v2.pricing.popular")}</span> : null}

              <p
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: C.teal,
                  margin: "0 0 12px",
                }}
              >
                {t(plan.forKey)}
              </p>
              <h3
                style={{
                  fontFamily: "Jun, Georgia, serif",
                  fontSize: 27,
                  fontWeight: 400,
                  color: C.light,
                  margin: "0 0 18px",
                }}
              >
                {t(plan.nameKey)}
              </h3>
              <div
                style={{
                  fontFamily: "Jun, Georgia, serif",
                  fontSize: 44,
                  fontWeight: 400,
                  color: C.light,
                  marginBottom: 24,
                }}
              >
                {plan.price}
              </div>

              <ul className="v2-plan-features">
                {plan.featureKeys.map((k) => (
                  <li key={k}>{t(k)}</li>
                ))}
              </ul>

              <div className="v2-plan-result">
                <span>{t("v2.pricing.resultLabel")}</span>
                <p>{t(plan.resultKey)}</p>
              </div>

              <button
                type="button"
                className={`v2-btn ${plan.featured ? "v2-btn-solid" : "v2-btn-outline-light"}`}
                style={{ width: "100%", marginTop: 26 }}
                onClick={() =>
                  onRequest({
                    open: true,
                    source: `Pricing — ${plan.id}`,
                    topic: `${t(plan.nameKey)} · ${plan.price}`,
                    title: t(plan.nameKey),
                  })
                }
              >
                {t("v2.pricing.choose")}
              </button>
            </div>
          ))}
        </div>
      </Shell>
    </section>
  );
}

// ─── 8. Newsletter ────────────────────────────────────────────────────────────

function Newsletter() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !email.includes("@")) {
      setError(t("v2.news.errorEmail"));
      setState("error");
      return;
    }
    if (!agree) {
      setError(t("v2.news.errorAgree"));
      setState("error");
      return;
    }
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
        setState("error");
        return;
      }
      setState("done");
      setEmail("");
    } catch {
      setError(t("popup.errorNetwork"));
      setState("error");
    }
  };

  return (
    <section style={{ background: C.light, padding: "clamp(56px, 8vw, 100px) 0" }}>
      <Shell>
        <div className="v2-news v2-reveal">
          <div>
            <h2
              style={{
                fontFamily: "Jun, Georgia, serif",
                fontSize: "clamp(26px, 3.6vw, 44px)",
                fontWeight: 400,
                lineHeight: 1.1,
                color: C.light,
                margin: "0 0 14px",
              }}
            >
              {t("v2.news.title")}
            </h2>
            <p
              style={{
                fontFamily: "Manrope, sans-serif",
                fontSize: 14,
                lineHeight: 1.7,
                color: "rgba(250,247,240,0.6)",
                margin: 0,
                maxWidth: 440,
              }}
            >
              {t("v2.news.body")}
            </p>
          </div>

          <form onSubmit={submit} className="v2-news-form">
            {state === "done" ? (
              <p
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: 15,
                  color: C.teal,
                  margin: 0,
                }}
              >
                {t("v2.news.done")}
              </p>
            ) : (
              <>
                <div className="v2-news-row">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("v2.news.placeholder")}
                    className="v2-news-input"
                    aria-label={t("v2.news.placeholder")}
                  />
                  <button
                    type="submit"
                    className="v2-btn v2-btn-white"
                    disabled={state === "loading"}
                  >
                    {state === "loading" ? "…" : t("v2.news.submit")}
                  </button>
                </div>

                <label className="v2-news-agree">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                  />
                  <span>
                    {t("v2.news.agree")}{" "}
                    <Link href="/legal" style={{ color: C.teal }}>
                      {t("v2.news.privacy")}
                    </Link>
                  </span>
                </label>

                {error ? (
                  <p style={{ fontFamily: "Manrope, sans-serif", fontSize: 12, color: "#e57373", margin: 0 }}>
                    {error}
                  </p>
                ) : null}
              </>
            )}
          </form>
        </div>
      </Shell>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const V2_STYLES = `
  .v2-btn {
    display: inline-flex; align-items: center; justify-content: center;
    font-family: Manrope, sans-serif; font-size: 11px; font-weight: 600;
    letter-spacing: 0.16em; text-transform: uppercase;
    padding: 16px 30px; border-radius: 8px; border: 1px solid transparent;
    cursor: pointer; text-decoration: none; transition: opacity .2s, background .2s, color .2s, border-color .2s;
  }
  .v2-btn-solid { background: #8CB2C0; color: #21141A; }
  .v2-btn-solid:hover { opacity: .88; }
  .v2-btn-ghost { background: transparent; color: #FAF7F0; border-color: rgba(250,247,240,.4); }
  .v2-btn-ghost:hover { border-color: #8CB2C0; color: #8CB2C0; }
  .v2-btn-outline-light { background: transparent; color: #FAF7F0; border-color: rgba(250,247,240,.28); }
  .v2-btn-outline-light:hover { border-color: #8CB2C0; color: #8CB2C0; }
  .v2-btn-white { background: #FFFBF0; color: #21141A; }
  .v2-btn-white:hover { opacity: .88; }

  .v2-hero-ctas { display: flex; gap: 14px; flex-wrap: wrap; }

  .v2-scroll-hint {
    position: absolute; left: 50%; bottom: 28px; transform: translateX(-50%);
    z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 8px;
    font-family: Manrope, sans-serif; font-size: 10px; font-weight: 500;
    letter-spacing: .28em; text-transform: uppercase;
    color: rgba(255,255,255,.72); text-decoration: none;
    animation: v2Pulse 2.4s ease-in-out infinite;
  }
  .v2-scroll-hint:hover { color: #8CB2C0; }
  @keyframes v2Pulse { 0%,100% { opacity:.3 } 50% { opacity:1 } }

  .v2-reveal { opacity: 0; transform: translateY(22px); transition: opacity .7s ease, transform .7s ease; }
  .v2-reveal.is-visible { opacity: 1; transform: none; }

  .v2-why-head, .v2-projects-head, .v2-eco-head {
    display: grid; grid-template-columns: 1.25fr .85fr; gap: 40px;
    align-items: end; margin-bottom: 60px;
  }
  .v2-stats-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 1px; background: rgba(33,20,26,.1);
    border: 1px solid rgba(33,20,26,.1); border-radius: 14px; overflow: hidden;
  }
  .v2-stat { background: #FFFBF0; padding: clamp(24px, 3vw, 40px); }

  .v2-link-arrow {
    font-family: Manrope, sans-serif; font-size: 11px; font-weight: 600;
    letter-spacing: .16em; text-transform: uppercase; color: #21141A;
    text-decoration: none; border-bottom: 1px solid rgba(33,20,26,.3); padding-bottom: 4px;
    transition: color .2s, border-color .2s;
  }
  .v2-link-arrow:hover { color: #683D47; border-color: #683D47; }

  .v2-projects-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
  .v2-project-card { text-decoration: none; display: block; }
  .v2-project-media {
    position: relative; border-radius: 14px; overflow: hidden; aspect-ratio: 4/5; background: #ddd;
  }
  .v2-project-media img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform .6s ease;
  }
  .v2-project-card:hover .v2-project-media img { transform: scale(1.06); }
  .v2-project-yield {
    position: absolute; top: 14px; right: 14px; background: #FFFBF0; color: #21141A;
    font-family: Manrope, sans-serif; font-size: 11px; font-weight: 700;
    padding: 5px 11px; border-radius: 6px;
  }

  .v2-eco-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
  .v2-eco-card {
    border: 1px solid rgba(250,247,240,.1); border-radius: 14px;
    padding: 28px 24px 30px; background: rgba(250,247,240,.02);
  }

  .v2-fb-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 72px; }
  .v2-fb-card {
    margin: 0; background: #FFFFFF; border: 1px solid rgba(33,20,26,.08);
    border-radius: 14px; padding: 30px 28px;
  }

  .v2-case-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .v2-case-card { background: #21141A; border-radius: 14px; overflow: hidden; }
  .v2-case-media { aspect-ratio: 16/10; overflow: hidden; }
  .v2-case-media img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .v2-case-row { display: flex; justify-content: space-between; gap: 12px; font-family: Manrope, sans-serif; font-size: 12px; }
  .v2-case-row dt { color: rgba(250,247,240,.45); margin: 0; }
  .v2-case-row dd { color: #FAF7F0; margin: 0; text-align: right; }

  .v2-plan-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; align-items: stretch; }
  .v2-plan-card {
    position: relative; display: flex; flex-direction: column;
    border: 1px solid rgba(250,247,240,.12); border-radius: 16px;
    padding: 34px 30px 32px; background: rgba(250,247,240,.02);
  }
  .v2-plan-card.is-featured { border-color: #8CB2C0; background: rgba(140,178,192,.06); }
  .v2-plan-badge {
    position: absolute; top: -11px; left: 30px; background: #8CB2C0; color: #21141A;
    font-family: Manrope, sans-serif; font-size: 9px; font-weight: 700;
    letter-spacing: .16em; text-transform: uppercase; padding: 5px 12px; border-radius: 20px;
  }
  .v2-plan-features {
    list-style: none; margin: 0 0 24px; padding: 0; display: grid; gap: 11px;
    font-family: Manrope, sans-serif; font-size: 13.5px; line-height: 1.55;
    color: rgba(250,247,240,.72);
  }
  .v2-plan-features li { position: relative; padding-left: 20px; }
  .v2-plan-features li::before {
    content: ""; position: absolute; left: 0; top: 8px; width: 6px; height: 6px;
    border-radius: 50%; background: #8CB2C0;
  }
  .v2-plan-result {
    margin-top: auto; border-top: 1px solid rgba(250,247,240,.1); padding-top: 18px;
    font-family: Manrope, sans-serif;
  }
  .v2-plan-result span {
    font-size: 9.5px; letter-spacing: .18em; text-transform: uppercase; color: #8CB2C0;
  }
  .v2-plan-result p { font-size: 13.5px; line-height: 1.6; color: rgba(250,247,240,.72); margin: 8px 0 0; }

  .v2-news {
    display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center;
    background: linear-gradient(120deg, #21141A 0%, #2e1a24 55%, #683D47 100%);
    border-radius: 18px; padding: clamp(32px, 5vw, 56px);
  }
  .v2-news-form { display: flex; flex-direction: column; gap: 14px; }
  .v2-news-row { display: flex; gap: 12px; align-items: stretch; }
  .v2-news-input {
    flex: 1; min-width: 0; background: transparent; border: none;
    border-bottom: 1px solid rgba(250,247,240,.35);
    color: #FAF7F0; font-family: Manrope, sans-serif; font-size: 14px;
    padding: 12px 2px; outline: none; transition: border-color .2s;
  }
  .v2-news-input::placeholder { color: rgba(250,247,240,.4); }
  .v2-news-input:focus { border-color: #8CB2C0; }
  .v2-news-agree {
    display: flex; align-items: flex-start; gap: 9px;
    font-family: Manrope, sans-serif; font-size: 11.5px; line-height: 1.5;
    color: rgba(250,247,240,.55); cursor: pointer;
  }
  .v2-news-agree input { margin-top: 2px; accent-color: #8CB2C0; }

  @media (max-width: 1024px) {
    .v2-eco-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 900px) {
    .v2-why-head, .v2-projects-head, .v2-eco-head { grid-template-columns: 1fr; gap: 24px; align-items: start; margin-bottom: 40px; }
    .v2-stats-grid { grid-template-columns: repeat(2, 1fr); }
    .v2-projects-grid, .v2-fb-grid, .v2-case-grid, .v2-plan-grid { grid-template-columns: 1fr; }
    .v2-fb-grid { margin-bottom: 48px; }
    .v2-news { grid-template-columns: 1fr; }
    .v2-hero-ctas .v2-btn { flex: 1 1 auto; }
  }
  @media (max-width: 520px) {
    .v2-news-row { flex-direction: column; }
    .v2-stats-grid { grid-template-columns: 1fr 1fr; }
    .v2-hero-ctas { flex-direction: column; }
  }
`;

export default function HomeV2() {
  const t = useT();
  const isMobile = useIsMobile();
  const [modal, setModal] = useState<ModalState>(CLOSED);
  useReveal();

  useEffect(() => {
    // Let ScrollToHash win when the visitor lands on /#feedback etc.
    if (!window.location.hash) window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ background: C.light, overflowX: "hidden" }}>
      <style>{V2_STYLES}</style>

      <Hero onRequest={setModal} />
      <WhyGeorgia />
      <Quote />
      <SelectedProjects />
      <Ecosystem />
      <Feedback />
      <Pricing onRequest={setModal} />
      <Newsletter />

      <RequestModal
        open={modal.open}
        onClose={() => setModal(CLOSED)}
        source={modal.source}
        topic={modal.topic}
        title={modal.title}
      />

      {/* Mobile sticky CTA */}
      {isMobile ? (
        <div
          style={{
            position: "fixed",
            left: 16,
            right: 16,
            bottom: 16,
            zIndex: 900,
          }}
        >
          <button
            type="button"
            className="v2-btn v2-btn-solid"
            style={{ width: "100%", boxShadow: "0 12px 30px rgba(0,0,0,0.28)" }}
            onClick={() =>
              setModal({
                open: true,
                source: "Mobile sticky CTA",
                title: t("v2.hero.ctaPrimary"),
              })
            }
          >
            {t("v2.hero.ctaPrimary")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
