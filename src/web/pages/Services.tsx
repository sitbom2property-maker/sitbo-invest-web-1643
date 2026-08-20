import { useEffect, useRef, useState } from "react";
import { AppLink } from "../components/app-link";
import { RequestModal } from "../components/RequestModal";
import { useT, type MessageKey } from "../i18n";

/**
 * Services page — first-person voice, aligned with home-v2 visual system:
 * Coolvetica / Inter · #21141A · wine #703C54 · light #FFFEF9 · teal #8CB2C0 at 10%
 */

type ServiceItem = {
  num: string;
  titleKey: MessageKey;
  descriptionKey: MessageKey;
  bulletKeys: MessageKey[];
};

const SERVICES: ServiceItem[] = [
  {
    num: "01",
    titleKey: "services.item1.title",
    descriptionKey: "services.item1.desc",
    bulletKeys: [
      "services.item1.bullet1",
      "services.item1.bullet2",
      "services.item1.bullet3",
      "services.item1.bullet4",
      "services.item1.bullet5",
      "services.item1.bullet6",
    ],
  },
  {
    num: "02",
    titleKey: "services.item2.title",
    descriptionKey: "services.item2.desc",
    bulletKeys: [
      "services.item2.bullet1",
      "services.item2.bullet2",
      "services.item2.bullet3",
      "services.item2.bullet4",
      "services.item2.bullet5",
    ],
  },
  {
    num: "03",
    titleKey: "services.item3.title",
    descriptionKey: "services.item3.desc",
    bulletKeys: [
      "services.item3.bullet1",
      "services.item3.bullet2",
      "services.item3.bullet3",
      "services.item3.bullet4",
      "services.item3.bullet5",
    ],
  },
  {
    num: "04",
    titleKey: "services.item4.title",
    descriptionKey: "services.item4.desc",
    bulletKeys: [
      "services.item4.bullet1",
      "services.item4.bullet2",
      "services.item4.bullet3",
      "services.item4.bullet4",
      "services.item4.bullet5",
    ],
  },
  {
    num: "05",
    titleKey: "services.item5.title",
    descriptionKey: "services.item5.desc",
    bulletKeys: [
      "services.item5.bullet1",
      "services.item5.bullet2",
      "services.item5.bullet3",
      "services.item5.bullet4",
    ],
  },
  {
    num: "06",
    titleKey: "services.item6.title",
    descriptionKey: "services.item6.desc",
    bulletKeys: [
      "services.item6.bullet1",
      "services.item6.bullet2",
      "services.item6.bullet3",
      "services.item6.bullet4",
      "services.item6.bullet5",
    ],
  },
  {
    num: "07",
    titleKey: "services.item7.title",
    descriptionKey: "services.item7.desc",
    bulletKeys: [
      "services.item7.bullet1",
      "services.item7.bullet2",
      "services.item7.bullet3",
      "services.item7.bullet4",
      "services.item7.bullet5",
    ],
  },
];

const LIMITS = [
  { titleKey: "services.limit1.title" as MessageKey, textKey: "services.limit1.text" as MessageKey },
  { titleKey: "services.limit2.title" as MessageKey, textKey: "services.limit2.text" as MessageKey },
  { titleKey: "services.limit3.title" as MessageKey, textKey: "services.limit3.text" as MessageKey },
  { titleKey: "services.limit4.title" as MessageKey, textKey: "services.limit4.text" as MessageKey },
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".sv .rv");
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

function AccordionItem({
  service,
  isOpen,
  onToggle,
}: {
  service: ServiceItem;
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
    <div className={`sv-acc${isOpen ? " is-open" : ""}`}>
      <button type="button" className="sv-acc-head" onClick={onToggle} aria-expanded={isOpen}>
        <span className="sv-acc-num">{service.num}</span>
        <span className="sv-acc-title">{t(service.titleKey)}</span>
        <span className="sv-acc-toggle" aria-hidden>
          {isOpen ? "−" : "+"}
        </span>
      </button>
      <div className="sv-acc-panel" style={{ maxHeight }}>
        <div ref={panelRef} className="sv-acc-body">
          <p>{t(service.descriptionKey)}</p>
          <ul>
            {service.bulletKeys.map((k) => (
              <li key={k}>{t(k)}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const CSS = `
.sv {
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
.sv .rv { opacity: 0; transform: translateY(22px); transition: opacity .7s ease, transform .7s ease; }
.sv .rv.in { opacity: 1; transform: none; }
.sv-wrap { max-width: var(--max); margin: 0 auto; padding: 0 var(--gutter); box-sizing: border-box; }
.sv-narrow { max-width: 920px; margin: 0 auto; }

.sv-btn {
  display: inline-flex; align-items: center; justify-content: center;
  font-family: var(--body); font-size: 15px; font-weight: 400;
  padding: 15px 30px; border-radius: var(--radius); border: 1px solid transparent;
  cursor: pointer; text-decoration: none; white-space: nowrap;
  transition: background .2s, color .2s, border-color .2s, opacity .2s;
}
.sv-btn-white { background: var(--white); color: var(--bg); }
.sv-btn-white:hover { opacity: .88; }
.sv-btn-outline { background: transparent; color: var(--white); border-color: rgba(255,255,255,.55); }
a.sv-btn-outline:hover { background: var(--white); color: var(--bg); }

/* hero */
.sv-hero {
  position: relative;
  padding: clamp(48px, 7vw, 96px) 0 clamp(56px, 8vw, 110px);
  overflow: hidden;
}
.sv-hero-circle {
  position: absolute; top: -180px; right: -140px; width: 640px; height: 640px;
  border: 1px solid var(--green); border-radius: 50%; pointer-events: none;
}
.sv-hero-grid {
  position: relative; z-index: 1;
  display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: clamp(28px, 4vw, 64px); align-items: end;
}
.sv-hero h1 {
  font-family: var(--display); font-weight: 600; margin: 0 0 18px;
  font-size: clamp(34px, 4.6vw, 64px); line-height: 1.08; letter-spacing: -.01em;
}
.sv-hero h1 em {
  font-style: normal; color: var(--white);
}
.sv-hero-lead {
  font-size: clamp(15px, 1.35vw, 18px); line-height: 1.5;
  color: var(--white); margin: 0; max-width: 420px;
}
.sv-hero-side {
  font-size: clamp(14px, 1.2vw, 16px); line-height: 1.55;
  color: var(--white); margin: 0; max-width: 380px;
  justify-self: end;
}
.sv-hero-btns { display: flex; gap: 14px; flex-wrap: wrap; margin-top: 28px; }

/* services list */
.sv-list-outer {
  max-width: var(--max); margin: 0 auto;
  padding: 0 var(--gutter) clamp(48px, 6vw, 90px);
  box-sizing: border-box;
}
.sv-list {
  background: var(--panel); color: var(--bg); border-radius: 10px;
  padding: clamp(28px, 4vw, 56px) clamp(20px, 4vw, 56px);
}
.sv-list-head {
  display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
  margin-bottom: clamp(28px, 4vw, 48px); align-items: start;
}
.sv-list-head h2 {
  font-family: var(--display); font-weight: 600; margin: 0;
  font-size: clamp(26px, 3.2vw, 44px); line-height: 1.12; color: var(--bg);
}
.sv-list-head p {
  margin: 0; font-size: clamp(14px, 1.2vw, 16px); line-height: 1.5;
  color: rgba(33,20,26,.65); max-width: 380px; justify-self: end;
}

.sv-acc { border-bottom: 1px solid rgba(33,20,26,.12); }
.sv-acc:first-child { border-top: 1px solid rgba(33,20,26,.12); }
.sv-acc-head {
  width: 100%; display: grid; grid-template-columns: 48px 1fr auto;
  gap: 16px; align-items: center; padding: 22px 0;
  border: none; background: transparent; cursor: pointer; text-align: left;
}
.sv-acc-num {
  font-family: var(--body); font-size: 13px; color: rgba(33,20,26,.4);
  font-variant-numeric: tabular-nums;
}
.sv-acc-title {
  font-family: var(--display); font-weight: 600;
  font-size: clamp(18px, 2vw, 26px); color: var(--bg); line-height: 1.2;
}
.sv-acc-toggle {
  width: 36px; height: 36px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--bg); color: var(--white); font-size: 20px; line-height: 1;
}
.sv-acc.is-open .sv-acc-toggle { background: var(--green); }
.sv-acc-panel { overflow: hidden; transition: max-height .4s ease; }
.sv-acc-body { padding: 0 0 26px 64px; max-width: 720px; }
.sv-acc-body p {
  margin: 0 0 16px; font-size: 15px; line-height: 1.55; color: rgba(33,20,26,.72);
}
.sv-acc-body ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.sv-acc-body li {
  position: relative; padding-left: 18px;
  font-size: 14px; line-height: 1.5; color: rgba(33,20,26,.78);
}
.sv-acc-body li::before {
  content: ""; position: absolute; left: 0; top: .55em;
  width: 7px; height: 7px; border-radius: 50%; background: var(--green);
}

/* limits */
.sv-limits { padding: clamp(56px, 7vw, 100px) 0; }
.sv-limits-head {
  display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
  margin-bottom: clamp(28px, 4vw, 48px); align-items: start;
}
.sv-limits-head h2 {
  font-family: var(--display); font-weight: 600; margin: 0;
  font-size: clamp(28px, 3.4vw, 48px); line-height: 1.12;
}
.sv-limits-head p {
  margin: 0; font-size: 15px; line-height: 1.5; color: var(--white);
  max-width: 360px; justify-self: end;
}
.sv-limits-grid {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.sv-limit {
  background: var(--card); border-radius: 10px;
  padding: clamp(22px, 2.4vw, 32px);
}
.sv-limit h3 {
  font-family: var(--display); font-weight: 600; margin: 0 0 10px;
  font-size: clamp(18px, 1.7vw, 22px); line-height: 1.25;
}
.sv-limit p {
  margin: 0; font-size: 14px; line-height: 1.5; color: var(--white);
}

/* cta */
.sv-cta-outer {
  max-width: var(--max); margin: 0 auto;
  padding: 0 var(--gutter) clamp(56px, 7vw, 100px);
  box-sizing: border-box;
}
.sv-cta {
  border-radius: 10px; overflow: hidden;
  background:
    radial-gradient(100% 140% at 90% 50%, rgba(112,60,84,.55) 0%, rgba(33,20,26,0) 55%),
    var(--card);
  padding: clamp(40px, 5vw, 72px) clamp(24px, 4vw, 64px);
  text-align: center;
}
.sv-cta h2 {
  font-family: var(--display); font-weight: 600; margin: 0 0 14px;
  font-size: clamp(28px, 3.6vw, 48px); line-height: 1.12;
}
.sv-cta p {
  margin: 0 auto 28px; max-width: 480px;
  font-size: clamp(15px, 1.3vw, 17px); line-height: 1.5; color: var(--white);
}

@media (max-width: 900px) {
  .sv-hero { padding-top: 36px; }
  .sv-hero-grid, .sv-list-head, .sv-limits-head { grid-template-columns: 1fr; }
  .sv-hero-side, .sv-list-head p, .sv-limits-head p { justify-self: start; }
  .sv-hero-circle { width: 380px; height: 380px; top: -120px; right: -120px; }
  .sv-limits-grid { grid-template-columns: 1fr; }
  .sv-acc-body { padding-left: 0; }
  .sv-acc-head { grid-template-columns: 36px 1fr auto; gap: 10px; }
  .sv-hero-btns .sv-btn { width: 100%; }
}
`;

export default function ServicesPage() {
  const t = useT();
  const [openIndex, setOpenIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  useReveal();

  return (
    <div className="sv">
      <style>{CSS}</style>

      <section className="sv-hero">
        <span className="sv-hero-circle" aria-hidden="true" />
        <div className="sv-wrap sv-hero-grid">
          <div className="rv">
            <h1>
              {t("services.hero.title")}
              <br />
              <em>{t("services.hero.titleEm")}</em>
            </h1>
            <div className="sv-hero-btns">
              <button type="button" className="sv-btn sv-btn-white" onClick={() => setModalOpen(true)}>
                {t("services.cta.button")}
              </button>
              <AppLink href="/#consultation" className="sv-btn sv-btn-outline">
                {t("nav.pricing")}
              </AppLink>
            </div>
          </div>
          <p className="sv-hero-side rv">{t("services.hero.body")}</p>
        </div>
      </section>

      <section className="sv-list-outer">
        <div className="sv-list rv">
          <div className="sv-list-head">
            <h2>{t("services.list.title")}</h2>
            <p>{t("services.list.lead")}</p>
          </div>
          <div className="sv-narrow" style={{ maxWidth: "100%" }}>
            {SERVICES.map((service, index) => (
              <AccordionItem
                key={service.num}
                service={service}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="sv-limits">
        <div className="sv-wrap">
          <div className="sv-limits-head rv">
            <h2>{t("services.limits.title")}</h2>
            <p>{t("services.limits.eyebrow")}</p>
          </div>
          <div className="sv-limits-grid">
            {LIMITS.map((item) => (
              <div key={item.titleKey} className="sv-limit rv">
                <h3>{t(item.titleKey)}</h3>
                <p>{t(item.textKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sv-cta-outer">
        <div className="sv-cta rv">
          <h2>{t("services.cta.title")}</h2>
          <p>{t("services.cta.body")}</p>
          <button type="button" className="sv-btn sv-btn-white" onClick={() => setModalOpen(true)}>
            {t("services.cta.button")}
          </button>
        </div>
      </section>

      <RequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        source="Services page"
        title={t("services.cta.button")}
      />
    </div>
  );
}
