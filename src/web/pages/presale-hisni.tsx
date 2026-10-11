import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link } from "wouter";
import { useLocale } from "../context/LocaleContext";
import { RequestModal } from "../components/RequestModal";
import { projects, resolvePaymentPlans } from "../data/projects";
import { localizeProject } from "../data/projects-locale";

const C = {
  dark: "#21141A",
  wine: "#703C54",
  plum: "#412834",
  light: "#FFFEF9",
  muted: "rgba(33,20,26,0.55)",
  line: "rgba(33,20,26,0.12)",
};

const SLUG = "hisni-3rd-tower";
const TOPIC = "HISNI 3rd Tower Pre-Sale";

const copy = {
  en: {
    eyebrow: "Pre-Sale · 5, 6, 7 November",
    title: "HISNI 3rd Tower",
    lead: "Three days to reserve an apartment in the third tower of HISNI by Biograpi, Tbilisi — before public sales open. A limited number of apartments, a fully refundable USD 1,000 reservation.",
    cta: "Reserve a place",
    whatsapp: "Ask on WhatsApp",
    facts: [
      ["Pre-sale", "5, 6, 7 November — 3 days only"],
      ["Prices", "From $1,800/m² · from $67,900"],
      ["Apartments", "Studios, 1 and 2 bedrooms · 34–95 m²"],
      ["Completion", "May 2031"],
      ["Reservation", "USD 1,000, fully refundable"],
      ["Booking", "Personally with me, via Zoom call"],
    ],
    stepsTitle: "How the pre-sale works",
    steps: [
      "Leave a request — I contact you personally.",
      "We have a Zoom call: I walk you through the project, apartment types and both payment plans.",
      "You pay the USD 1,000 reservation fee and your place in the pre-sale is booked.",
      "On 5–7 November you choose a specific apartment, I reserve it for you, and you proceed with the purchase agreement.",
    ],
    plansTitle: "Prices and payment plans",
    plansLead: "The price per m² depends on the payment plan you choose, the apartment type, its size and position in the building.",
    type: "Type",
    area: "Area",
    perSqm: "Price per m²",
    refundTitle: "Your USD 1,000 is fully refundable",
    refundBody: "If you can't find an apartment that fits your requirements, or decide not to go ahead with the purchase for any reason, the reservation fee is returned in full.",
    galleryTitle: "The project",
    projectLink: "Full project details",
    finalTitle: "Pre-sale runs 5, 6, 7 November only",
    finalBody: "Apartments are limited. Book your Zoom call now to take part.",
    modalTitle: "Reserve a place in the pre-sale",
    modalBody: "Leave your contacts — I will get in touch personally to schedule a Zoom call and book your place in the pre-sale.",
  },
  ru: {
    eyebrow: "Пресейл · 5, 6, 7 ноября",
    title: "HISNI 3rd Tower",
    lead: "Три дня, чтобы забронировать квартиру в третьей башне HISNI by Biograpi в Тбилиси — до открытых продаж. Количество квартир ограничено, бронь USD 1,000 полностью возвращается.",
    cta: "Забронировать место",
    whatsapp: "Написать в WhatsApp",
    facts: [
      ["Пресейл", "5, 6, 7 ноября — всего 3 дня"],
      ["Цены", "От $1,800/м² · от $67,900"],
      ["Квартиры", "Студии, 1 и 2 спальни · 34–95 м²"],
      ["Сдача", "Май 2031"],
      ["Бронь", "USD 1,000, полностью возвратная"],
      ["Бронирование", "Лично через меня, по Zoom"],
    ],
    stepsTitle: "Как проходит пресейл",
    steps: [
      "Оставьте заявку — я свяжусь с вами лично.",
      "Созваниваемся в Zoom: рассказываю о проекте, типах квартир и обоих планах оплаты.",
      "Вы вносите бронь USD 1,000 — ваше место на пресейле закреплено.",
      "5–7 ноября вы выбираете конкретную квартиру, я её бронирую, дальше — договор купли-продажи.",
    ],
    plansTitle: "Цены и планы оплаты",
    plansLead: "Цена за м² зависит от выбранного плана оплаты, типа и площади квартиры и её расположения в здании.",
    type: "Тип",
    area: "Площадь",
    perSqm: "Цена за м²",
    refundTitle: "USD 1,000 возвращаются полностью",
    refundBody: "Если вы не нашли подходящую квартиру или по любой причине решили не продолжать покупку, бронь возвращается в полном объёме.",
    galleryTitle: "О проекте",
    projectLink: "Подробнее о проекте",
    finalTitle: "Пресейл только 5, 6, 7 ноября",
    finalBody: "Количество квартир ограничено. Запишитесь на Zoom-звонок, чтобы участвовать.",
    modalTitle: "Забронировать место на пресейле",
    modalBody: "Оставьте контакты — я лично свяжусь с вами, назначим Zoom-звонок и забронирую место на пресейле.",
  },
};

const GALLERY = ["ext-01", "ext-03", "lobby", "pool", "fitness", "terrace"].map(
  (name) => `/projects/hisni/${name}.jpg`,
);

const eyebrowStyle: CSSProperties = {
  fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", letterSpacing: "0.18em",
  textTransform: "uppercase", margin: "0 0 18px",
};

const h2Style: CSSProperties = {
  fontFamily: "JUN, Georgia, serif", fontSize: "clamp(1.6rem,2.8vw,2.4rem)",
  fontWeight: 400, lineHeight: 1.15, margin: "0 0 20px", color: C.dark,
};

const bodyStyle: CSSProperties = {
  fontFamily: "Nunito, sans-serif", fontSize: "1rem", lineHeight: 1.7, color: C.dark, margin: 0,
};

const section: CSSProperties = { paddingTop: "clamp(48px, 6vw, 80px)" };

function CtaButtons({ label, whatsapp, onClick }: { label: string; whatsapp: string; onClick: () => void }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      <button
        type="button"
        onClick={onClick}
        style={{
          padding: "16px 28px", borderRadius: 2, border: "none", background: C.wine, color: C.light,
          fontFamily: "Nunito, sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.16em",
          textTransform: "uppercase", cursor: "pointer",
        }}
      >
        {label}
      </button>
      <a
        href="https://wa.me/995555505288"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          padding: "15px 26px", borderRadius: 2, border: `1px solid ${C.light}`, color: C.light,
          fontFamily: "Nunito, sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: "0.16em",
          textTransform: "uppercase", textDecoration: "none",
        }}
      >
        {whatsapp}
      </a>
    </div>
  );
}

export default function HisniPresalePage() {
  const { language } = useLocale();
  const t = language === "ru" ? copy.ru : copy.en;
  const [open, setOpen] = useState(false);

  const project = useMemo(() => {
    const base = projects.find((p) => p.slug === SLUG);
    return base ? localizeProject(base, language) : undefined;
  }, [language]);
  const plans = project ? resolvePaymentPlans(project) : [];
  const unitTypes = project?.unitTypes ?? [];

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ background: C.light, minHeight: "100vh" }}>
      {/* ── HERO ── */}
      <section style={{ background: `linear-gradient(90deg, rgba(33,20,26,0.92) 0%, rgba(33,20,26,0.6) 60%, rgba(33,20,26,0.3) 100%), url(/projects/hisni/hero.jpg) center / cover` }}>
        <div className="site-wrap" style={{ paddingTop: "clamp(64px, 9vw, 120px)", paddingBottom: "clamp(64px, 9vw, 120px)" }}>
          <p style={{ ...eyebrowStyle, color: C.light }}>{t.eyebrow}</p>
          <h1 style={{ fontFamily: "JUN, Georgia, serif", fontSize: "clamp(2.4rem,5.4vw,4.6rem)", fontWeight: 400, color: C.light, lineHeight: 1.02, margin: "0 0 22px" }}>
            {t.title}
          </h1>
          <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "clamp(1rem,1.3vw,1.12rem)", lineHeight: 1.65, color: C.light, maxWidth: 580, margin: "0 0 34px" }}>
            {t.lead}
          </p>
          <CtaButtons label={t.cta} whatsapp={t.whatsapp} onClick={() => setOpen(true)} />
        </div>
      </section>

      {/* ── FACTS ── */}
      <section style={section}>
        <div className="site-wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
            {t.facts.map(([label, value]) => (
              <div key={label} style={{ border: `1px solid ${C.line}`, borderRadius: 2, padding: "22px 20px" }}>
                <p style={{ ...eyebrowStyle, fontSize: "0.65rem", color: C.muted, margin: "0 0 10px" }}>{label}</p>
                <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.05rem", fontWeight: 700, color: C.dark, margin: 0, lineHeight: 1.4 }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STEPS ── */}
      <section style={section}>
        <div className="site-wrap">
          <h2 style={h2Style}>{t.stepsTitle}</h2>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
            {t.steps.map((step, i) => (
              <li key={i} style={{ background: i === t.steps.length - 1 ? C.plum : "#E8E4DF", color: i === t.steps.length - 1 ? C.light : C.dark, borderRadius: 2, padding: "24px 22px", display: "flex", flexDirection: "column", gap: 18 }}>
                <span style={{ fontFamily: "JUN, Georgia, serif", fontSize: "2rem", lineHeight: 1 }}>0{i + 1}</span>
                <p style={{ ...bodyStyle, color: "inherit", fontSize: "0.98rem", lineHeight: 1.6 }}>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── PRICES & PAYMENT PLANS ── */}
      {project && unitTypes.length ? (
        <section style={section}>
          <div className="site-wrap">
            <h2 style={h2Style}>{t.plansTitle}</h2>
            <p style={{ ...bodyStyle, color: C.muted, maxWidth: 640, marginBottom: 28 }}>{t.plansLead}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))", gap: "16px" }}>
              {plans.map((plan, planIdx) => (
                <div key={planIdx} style={{ border: `1px solid ${C.line}`, borderRadius: 2, padding: "clamp(20px, 2.4vw, 28px)", display: "flex", flexDirection: "column", gap: 22 }}>
                  <h3 style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.1rem", fontWeight: 700, color: C.dark, margin: 0 }}>
                    {project.paymentPlanNames?.[planIdx]}
                  </h3>
                  <div style={{ display: "flex", gap: 6 }}>
                    {plan.map((seg, k) => (
                      <div key={k} style={{ flex: `${seg.pct} 1 0`, minWidth: 0, background: seg.stage === "down" ? C.wine : C.light, color: seg.stage === "down" ? C.light : C.dark, border: `1px solid ${C.wine}`, borderRadius: 2, padding: "14px 12px" }}>
                        <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.4rem", fontWeight: 700, margin: "0 0 6px", lineHeight: 1 }}>{seg.pct}%</p>
                        <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.74rem", margin: 0, lineHeight: 1.3 }}>{seg.label}</p>
                      </div>
                    ))}
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Nunito, sans-serif", fontSize: "0.92rem", color: C.dark }}>
                    <thead>
                      <tr>
                        {[t.type, t.area, t.perSqm].map((h) => (
                          <th key={h} style={{ textAlign: "left", fontSize: "12px", fontWeight: 400, color: C.muted, padding: "0 10px 10px 0" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {unitTypes.map((u) => (
                        <tr key={u.type} style={{ borderTop: `1px solid ${C.line}` }}>
                          <td style={{ padding: "12px 10px 12px 0", fontWeight: 700 }}>{u.type}</td>
                          <td style={{ padding: "12px 10px 12px 0" }}>{u.area}</td>
                          <td style={{ padding: "12px 0" }}>{u.prices[planIdx]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── REFUND ── */}
      <section style={section}>
        <div className="site-wrap">
          <div style={{ background: "#48674D", color: C.light, borderRadius: 2, padding: "clamp(24px, 3.4vw, 44px)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px 40px", alignItems: "center" }}>
            <h2 style={{ ...h2Style, color: C.light, margin: 0 }}>{t.refundTitle}</h2>
            <p style={{ ...bodyStyle, color: C.light }}>{t.refundBody}</p>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section style={section}>
        <div className="site-wrap">
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 20 }}>
            <h2 style={{ ...h2Style, margin: 0 }}>{t.galleryTitle}</h2>
            <Link href={`/project/${SLUG}`}>
              <a style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.95rem", fontWeight: 600, color: C.wine, textDecoration: "none" }}>{t.projectLink} →</a>
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
            {GALLERY.map((src) => (
              <img key={src} src={src} alt="HISNI by Biograpi" loading="lazy"
                style={{ width: "100%", aspectRatio: "16 / 10", objectFit: "cover", borderRadius: 2, display: "block" }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: "clamp(48px, 6vw, 80px) 0" }}>
        <div className="site-wrap">
          <div style={{ background: C.dark, borderRadius: 2, padding: "clamp(32px, 5vw, 64px) clamp(24px, 4vw, 56px)" }}>
            <h2 style={{ ...h2Style, color: C.light }}>{t.finalTitle}</h2>
            <p style={{ ...bodyStyle, color: C.light, margin: "0 0 28px", maxWidth: 520 }}>{t.finalBody}</p>
            <CtaButtons label={t.cta} whatsapp={t.whatsapp} onClick={() => setOpen(true)} />
          </div>
        </div>
      </section>

      <RequestModal
        open={open}
        onClose={() => setOpen(false)}
        title={t.modalTitle}
        subtitle={t.modalBody}
        source="hisni-presale"
        topic={TOPIC}
      />
    </div>
  );
}
