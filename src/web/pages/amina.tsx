import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { trackLead } from "../lib/analytics";
import {
  AMINA_WHATSAPP_INTRO,
  AMINA_WHATSAPP_NUMBER,
  buildWhatsAppLink,
  openWhatsApp,
} from "../lib/whatsapp";

const C = {
  dark: "#21141A",
  wine: "#703C54",
  light: "#FFFEF9",
  blue: "#8CB2C0",
};

/** Lead source recorded in Odoo CRM so requests from this landing are identifiable. */
const SOURCE = "Amina";

/** Direct "write on WhatsApp" link (no form) — Amina's assistant, pre-filled intro. */
const DIRECT_WA_LINK = buildWhatsAppLink(
  {},
  { number: AMINA_WHATSAPP_NUMBER, intro: AMINA_WHATSAPP_INTRO },
);

const BENEFITS: { title: string; body: string }[] = [
  {
    title: "Личная консультация",
    body: "Разберём вашу цель, бюджет и горизонт. Честный расчёт доходности без приукрашивания.",
  },
  {
    title: "Подбор объекта",
    body: "Проверенные проекты и закрытые предложения в Батуми и по Грузии под вашу задачу.",
  },
  {
    title: "Юридическая проверка",
    body: "Сопровождение сделки, проверка застройщика и документов — вы защищены на каждом шаге.",
  },
  {
    title: "Сопровождение под ключ",
    body: "Оформление, ремонт, меблировка и управление арендой. Одна точка контакта 24/7.",
  },
];

const inputStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(255,254,249,0.05)",
  border: "1px solid rgba(140,178,192,0.18)",
  borderRadius: 8,
  color: C.light,
  fontFamily: "Inter, sans-serif",
  fontSize: 15,
  padding: "15px 16px",
  outline: "none",
  transition: "border-color 0.2s",
};

export default function AminaPage() {
  const [form, setForm] = useState({ name: "", contact: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "SITBO × Амина — консультация и сопровождение";
    return () => {
      document.title = prevTitle;
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.contact.trim()) {
      setError("Заполните имя и контакт.");
      return;
    }
    setLoading(true);
    // Hand the request to Amina's WhatsApp in parallel with the Odoo CRM lead.
    // Opened synchronously inside the submit gesture so it is not blocked.
    openWhatsApp(
      {
        name: form.name.trim(),
        contact: form.contact.trim(),
        source: SOURCE,
      },
      { number: AMINA_WHATSAPP_NUMBER, intro: AMINA_WHATSAPP_INTRO },
    );
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          contact: form.contact.trim(),
          source: SOURCE,
          page: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });
      if (!res.ok) {
        setError("Что-то пошло не так. Напишите нам напрямую в WhatsApp.");
        return;
      }
      trackLead({ source: SOURCE });
      setSubmitted(true);
      setForm({ name: "", contact: "" });
    } catch {
      setError("Ошибка сети. Напишите нам напрямую в WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: C.dark, color: C.light, minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        .amina-hero {
          position: relative;
          min-height: 100svh;
          display: grid;
          grid-template-columns: 1fr;
          align-items: center;
        }
        .amina-hero-bg {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(33,20,26,0.72) 0%, rgba(33,20,26,0.86) 60%, rgba(33,20,26,0.97) 100%),
            url('/home/rd-waterfront.jpg') center/cover no-repeat;
        }
        .amina-shell {
          position: relative; z-index: 1;
          width: 100%; max-width: 1080px;
          margin: 0 auto; padding: clamp(80px, 12vh, 140px) clamp(20px, 5vw, 48px);
          display: grid; grid-template-columns: 1.05fr 0.95fr; gap: clamp(32px, 5vw, 72px);
          align-items: center;
        }
        .amina-eyebrow {
          font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase;
          color: ${C.blue}; margin: 0 0 20px;
        }
        .amina-h1 {
          font-family: 'Coolvetica', Inter, sans-serif; font-weight: 400;
          font-size: clamp(34px, 5.4vw, 62px); line-height: 1.02;
          letter-spacing: -0.01em; margin: 0 0 22px;
        }
        .amina-sub {
          font-size: clamp(15px, 1.5vw, 18px); line-height: 1.6;
          color: rgba(255,254,249,0.82); max-width: 520px; margin: 0 0 8px;
        }
        .amina-card {
          background: rgba(33,20,26,0.55);
          border: 1px solid rgba(140,178,192,0.18);
          border-radius: 14px; padding: clamp(26px, 3vw, 36px);
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
          box-shadow: 0 30px 80px rgba(0,0,0,0.45);
        }
        .amina-input:focus { border-color: ${C.wine} !important; }
        .amina-input::placeholder { color: rgba(255,254,249,0.5); }
        .amina-btn { transition: opacity 0.2s, background 0.2s, color 0.2s, transform 0.15s; }
        .amina-btn:hover { transform: translateY(-1px); }
        .amina-benefits {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: clamp(18px, 2.4vw, 32px);
        }
        .amina-advisor { display: grid; grid-template-columns: 220px 1fr; gap: clamp(24px, 4vw, 56px); align-items: center; }
        @media (max-width: 900px) {
          .amina-shell { grid-template-columns: 1fr; }
          .amina-benefits { grid-template-columns: 1fr; }
          .amina-advisor { grid-template-columns: 1fr; text-align: center; }
        }
      `}</style>

      {/* ── Hero + request form ─────────────────────────────── */}
      <section className="amina-hero">
        <div className="amina-hero-bg" aria-hidden />
        <div className="amina-shell">
          <div>
            <p className="amina-eyebrow">По рекомендации Амины</p>
            <h1 className="amina-h1">
              Инвестиции в недвижимость Грузии — с личным сопровождением
            </h1>
            <p className="amina-sub">
              Оставьте заявку — и мой ассистент свяжется с вами в WhatsApp. Разберём вашу цель,
              подберём объект и проведём сделку под ключ. Без навязывания и с честным расчётом
              доходности.
            </p>
          </div>

          <div className="amina-card">
            {submitted ? (
              <div style={{ textAlign: "center", padding: "12px 0" }}>
                <div
                  style={{
                    width: 54, height: 54, margin: "0 auto 18px", borderRadius: "50%",
                    border: `1px solid ${C.light}`, display: "flex", alignItems: "center",
                    justifyContent: "center", color: C.light, fontSize: 22,
                  }}
                >
                  ✓
                </div>
                <h2 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontWeight: 400, fontSize: 24, margin: "0 0 10px" }}>
                  Заявка принята
                </h2>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(255,254,249,0.85)", margin: "0 0 20px" }}>
                  Мы открыли для вас чат в WhatsApp. Если он не открылся автоматически — нажмите кнопку ниже.
                </p>
                <a
                  className="amina-btn"
                  href={DIRECT_WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block", background: "#25D366", color: "#0b3d1f",
                    fontWeight: 700, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase",
                    padding: "15px 26px", borderRadius: 8, textDecoration: "none",
                  }}
                >
                  Открыть WhatsApp
                </a>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontWeight: 400, fontSize: "clamp(22px, 2.4vw, 28px)", margin: "0 0 8px" }}>
                  Записаться на консультацию
                </h2>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "rgba(255,254,249,0.7)", margin: "0 0 22px" }}>
                  Заявка уходит в WhatsApp и параллельно фиксируется у нас — ничего не потеряется.
                </p>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input
                    className="amina-input"
                    style={inputStyle}
                    type="text"
                    autoComplete="name"
                    placeholder="Ваше имя"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    className="amina-input"
                    style={inputStyle}
                    type="text"
                    autoComplete="tel"
                    placeholder="Телефон или WhatsApp"
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  />
                  {error ? (
                    <p style={{ margin: 0, fontSize: 13, color: "#f0c9d3" }}>{error}</p>
                  ) : null}
                  <button
                    type="submit"
                    className="amina-btn"
                    disabled={loading}
                    style={{
                      marginTop: 4, padding: "16px 18px", borderRadius: 8, border: "none",
                      background: C.wine, color: C.light, fontFamily: "Inter, sans-serif",
                      fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase",
                      cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1,
                    }}
                  >
                    {loading ? "…" : "Отправить и написать в WhatsApp"}
                  </button>
                </form>
                <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
                  <span style={{ flex: 1, height: 1, background: "rgba(255,254,249,0.15)" }} />
                  <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,254,249,0.5)" }}>
                    или
                  </span>
                  <span style={{ flex: 1, height: 1, background: "rgba(255,254,249,0.15)" }} />
                </div>
                <a
                  className="amina-btn"
                  href={DIRECT_WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    background: "#25D366", color: "#0b3d1f", fontWeight: 700, fontSize: 12,
                    letterSpacing: "0.12em", textTransform: "uppercase", padding: "15px 18px",
                    borderRadius: 8, textDecoration: "none",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.13c-.24.68-1.42 1.32-1.95 1.36-.5.05-.98.24-3.28-.69-2.76-1.09-4.5-3.9-4.64-4.08-.14-.19-1.11-1.48-1.11-2.82 0-1.34.7-2 .95-2.27.24-.27.53-.34.71-.34.18 0 .35 0 .5.01.16.01.38-.06.59.45.24.58.81 2 .88 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.19.69-.81.88-1.09.18-.28.37-.23.62-.14.25.09 1.6.76 1.87.9.28.14.46.21.53.32.07.12.07.68-.17 1.36Z" />
                  </svg>
                  Написать в WhatsApp
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── What you get ────────────────────────────────────── */}
      <section style={{ padding: "clamp(56px, 8vw, 96px) clamp(20px, 5vw, 48px)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <p className="amina-eyebrow" style={{ textAlign: "center" }}>Что вы получите</p>
          <h2
            style={{
              fontFamily: "Coolvetica, Inter, sans-serif", fontWeight: 400, textAlign: "center",
              fontSize: "clamp(26px, 3.6vw, 40px)", margin: "0 0 clamp(36px, 5vw, 56px)",
            }}
          >
            Полное сопровождение от заявки до ключей
          </h2>
          <div className="amina-benefits">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                style={{
                  border: "1px solid rgba(140,178,192,0.16)", borderRadius: 12,
                  padding: "clamp(24px, 3vw, 32px)", background: "rgba(255,254,249,0.03)",
                }}
              >
                <h3 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontWeight: 400, fontSize: 21, margin: "0 0 10px" }}>
                  {b.title}
                </h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "rgba(255,254,249,0.75)", margin: 0 }}>
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Advisor ─────────────────────────────────────────── */}
      <section style={{ padding: "0 clamp(20px, 5vw, 48px) clamp(64px, 9vw, 110px)" }}>
        <div
          className="amina-advisor"
          style={{
            maxWidth: 1080, margin: "0 auto", background: "rgba(255,254,249,0.03)",
            border: "1px solid rgba(140,178,192,0.16)", borderRadius: 14,
            padding: "clamp(28px, 4vw, 48px)",
          }}
        >
          <img
            src="/home/rd-arthur.jpg"
            alt="Артур Арутюнян — частный советник по недвижимости"
            style={{ width: "100%", maxWidth: 220, borderRadius: 12, objectFit: "cover", justifySelf: "center" }}
          />
          <div>
            <p className="amina-eyebrow">Ваш советник</p>
            <h3 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontWeight: 400, fontSize: "clamp(24px, 3vw, 34px)", margin: "0 0 14px" }}>
              Артур Арутюнян
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: "rgba(255,254,249,0.8)", margin: 0 }}>
              Частный советник по инвестициям в недвижимость Батуми и Грузии. Помогаю выбрать объект
              под вашу цель, проверяю застройщика и документы, веду сделку и сопровождаю после покупки.
              Работаю честно: показываю реальную доходность, а не обещания.
            </p>
          </div>
        </div>
      </section>

      {/* ── Minimal footer ──────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid rgba(140,178,192,0.14)", padding: "28px clamp(20px, 5vw, 48px)",
          textAlign: "center",
        }}
      >
        <a
          href={DIRECT_WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: C.light, fontWeight: 600, textDecoration: "none", fontSize: 14 }}
        >
          WhatsApp: +995 510 002 722
        </a>
        <p style={{ fontSize: 12, color: "rgba(255,254,249,0.45)", margin: "10px 0 0" }}>
          © {new Date().getFullYear()} SITBO Invest
        </p>
      </footer>
    </div>
  );
}
