import { useEffect, useState } from "react";
import { useLocale } from "../context/LocaleContext";
import { RequestModal } from "../components/RequestModal";

const C = {
  dark: "#21141A",
  wine: "#703C54",
  light: "#FFFEF9",
  muted: "rgba(33,20,26,0.6)",
};

const TOPIC = "HISNI 3rd Tower Pre-Sale";

const copy = {
  en: {
    eyebrow: "Pre-Sale · 5, 6, 7 November",
    title: "HISNI 3rd Tower",
    lead: "The third tower of HISNI by Biograpi in Tbilisi. Three days only, a limited number of apartments. Booking goes through me personally on a Zoom call, with a fully refundable USD 1,000 fee.",
    cta: "Reserve a place",
    whatsapp: "Ask on WhatsApp",
    facts: [
      ["Pre-sale", "5, 6, 7 November — 3 days only"],
      ["Completion", "May 2031"],
      ["Reservation fee", "USD 1,000, fully refundable"],
      ["Availability", "Limited number of apartments"],
      ["Booking", "Personally with me, via Zoom call"],
      ["Amenities", "Pool, spa, fitness, padel, 8,000 m² terrace"],
    ],
    galleryTitle: "The project",
    stepsTitle: "How the pre-sale works",
    steps: [
      "Leave a request — I contact you personally.",
      "We have a Zoom call: I walk you through the project, apartment types and payment plans.",
      "I book your place in the pre-sale with the USD 1,000 fully refundable reservation fee.",
      "On 5–7 November I reserve the specific apartment you choose, and you proceed with the purchase agreement.",
    ],
    priceTitle: "Prices",
    priceBody: "Prices vary depending on the selected payment plan, apartment type, size, location within the building and other characteristics.",
    refundTitle: "Fully refundable",
    refundBody: "The USD 1,000 reservation fee is fully refundable if you can't find a suitable apartment or decide not to proceed with the purchase for any reason.",
    finalTitle: "Pre-sale runs 5, 6, 7 November only",
    modalTitle: "Reserve a place in the pre-sale",
    modalBody: "Leave your contacts — I will get in touch personally to schedule a Zoom call and book your place in the pre-sale.",
  },
  ru: {
    eyebrow: "Пресейл · 5, 6, 7 ноября",
    title: "HISNI 3rd Tower",
    lead: "Третья башня HISNI by Biograpi в Тбилиси. Всего три дня, ограниченное количество квартир. Бронирование лично через меня, по Zoom-звонку; взнос USD 1,000 полностью возвращается.",
    cta: "Забронировать место",
    whatsapp: "Написать в WhatsApp",
    facts: [
      ["Пресейл", "5, 6, 7 ноября — всего 3 дня"],
      ["Сдача", "Май 2031"],
      ["Бронь", "USD 1,000, полностью возвратная"],
      ["Наличие", "Ограниченное число квартир"],
      ["Бронирование", "Лично через меня, по Zoom"],
      ["Инфраструктура", "Бассейн, спа, фитнес, падел, терраса 8 000 м²"],
    ],
    galleryTitle: "О проекте",
    stepsTitle: "Как проходит пресейл",
    steps: [
      "Оставьте заявку — я свяжусь с вами лично.",
      "Созваниваемся в Zoom: рассказываю о проекте, типах квартир и планах оплаты.",
      "Бронирую вам место на пресейле — взнос USD 1,000, полностью возвратный.",
      "5–7 ноября бронирую выбранную вами квартиру, дальше — договор купли-продажи.",
    ],
    priceTitle: "Цены",
    priceBody: "Цена зависит от выбранного плана оплаты, типа и площади квартиры, расположения в здании и других характеристик.",
    refundTitle: "Полный возврат",
    refundBody: "Бронь USD 1,000 возвращается полностью, если вы не нашли подходящую квартиру или по любой причине решили не продолжать покупку.",
    finalTitle: "Пресейл только 5, 6, 7 ноября",
    modalTitle: "Забронировать место на пресейле",
    modalBody: "Оставьте контакты — я лично свяжусь с вами, назначим Zoom-звонок и забронирую место на пресейле.",
  },
};

const GALLERY = ["ext-01", "ext-03", "lobby", "pool", "fitness", "terrace"].map(
  (name) => `/projects/hisni/${name}.jpg`,
);

const eyebrowStyle: React.CSSProperties = {
  fontFamily: "Nunito, sans-serif", fontSize: "0.72rem", letterSpacing: "0.18em",
  textTransform: "uppercase", margin: "0 0 18px",
};

const h2Style: React.CSSProperties = {
  fontFamily: "JUN, Georgia, serif", fontSize: "clamp(1.5rem,2.6vw,2.2rem)",
  fontWeight: 400, lineHeight: 1.2, margin: "0 0 20px", color: C.dark,
};

const bodyStyle: React.CSSProperties = {
  fontFamily: "Nunito, sans-serif", fontSize: "0.95rem", lineHeight: 1.7, color: C.dark, margin: 0,
};

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

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ background: C.light, minHeight: "100vh" }}>
      {/* ── HERO ── */}
      <section style={{ background: `linear-gradient(90deg, rgba(33,20,26,0.92) 0%, rgba(33,20,26,0.55) 60%, rgba(33,20,26,0.25) 100%), url(/projects/hisni/hero.jpg) center / cover` }}>
        <div className="site-wrap" style={{ paddingTop: "80px", paddingBottom: "80px" }}>
          <p style={{ ...eyebrowStyle, color: C.light }}>{t.eyebrow}</p>
          <h1 style={{ fontFamily: "JUN, Georgia, serif", fontSize: "clamp(2.2rem,5vw,4.2rem)", fontWeight: 400, color: C.light, lineHeight: 1.05, margin: "0 0 22px" }}>
            {t.title}
          </h1>
          <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.05rem", lineHeight: 1.7, color: C.light, maxWidth: 560, margin: "0 0 34px" }}>
            {t.lead}
          </p>
          <CtaButtons label={t.cta} whatsapp={t.whatsapp} onClick={() => setOpen(true)} />
        </div>
      </section>

      {/* ── FACTS ── */}
      <section>
        <div className="site-wrap" style={{ paddingTop: "56px", paddingBottom: "24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            {t.facts.map(([label, value]) => (
              <div key={label} style={{ border: "1px solid rgba(33,20,26,0.12)", borderRadius: 2, padding: "22px 20px" }}>
                <p style={{ ...eyebrowStyle, fontSize: "0.65rem", color: C.muted, margin: "0 0 10px" }}>{label}</p>
                <p style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.05rem", fontWeight: 600, color: C.dark, margin: 0, lineHeight: 1.4 }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section>
        <div className="site-wrap" style={{ paddingTop: "40px", paddingBottom: "8px" }}>
          <h2 style={h2Style}>{t.galleryTitle}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
            {GALLERY.map((src) => (
              <img key={src} src={src} alt="HISNI by Biograpi" loading="lazy"
                style={{ width: "100%", aspectRatio: "16 / 10", objectFit: "cover", borderRadius: 2, display: "block" }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── STEPS ── */}
      <section>
        <div className="site-wrap" style={{ paddingTop: "40px", paddingBottom: "40px" }}>
          <h2 style={h2Style}>{t.stepsTitle}</h2>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "14px", maxWidth: 760 }}>
            {t.steps.map((step, i) => (
              <li key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", background: C.wine, color: C.light, fontFamily: "Nunito, sans-serif", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {i + 1}
                </span>
                <p style={{ ...bodyStyle, paddingTop: 5 }}>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── PRICE & REFUND ── */}
      <section>
        <div className="site-wrap" style={{ paddingTop: "16px", paddingBottom: "64px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px" }}>
          <div>
            <h2 style={h2Style}>{t.priceTitle}</h2>
            <p style={bodyStyle}>{t.priceBody}</p>
          </div>
          <div>
            <h2 style={h2Style}>{t.refundTitle}</h2>
            <p style={bodyStyle}>{t.refundBody}</p>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: C.dark }}>
        <div className="site-wrap" style={{ paddingTop: "56px", paddingBottom: "56px" }}>
          <h2 style={{ ...h2Style, color: C.light }}>{t.finalTitle}</h2>
          <CtaButtons label={t.cta} whatsapp={t.whatsapp} onClick={() => setOpen(true)} />
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
