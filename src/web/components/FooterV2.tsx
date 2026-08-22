import { Link } from "wouter";
import { AppLink } from "./app-link";
import { useT } from "../i18n";

const WHATSAPP = "https://wa.me/995555505288";
const TELEGRAM = "https://t.me/sitboinvest";
const INSTAGRAM = "https://instagram.com/sitboinvest";
const LINKEDIN = "https://www.linkedin.com/company/sitbo-invest";

/** Luxury footer — centered site canvas, dark surface, left-aligned copy. */
export function FooterV2() {
  const t = useT();

  return (
    <footer className="fv2" role="contentinfo">
      <style>{`
        .fv2 {
          background: #21141A;
          color: #FFFEF9;
          font-family: 'Inter', sans-serif;
          padding: clamp(64px, 8vw, 112px) 0 clamp(32px, 4vw, 56px);
        }
        .fv2-wrap {
          max-width: var(--site-max, 1440px);
          margin: 0 auto;
          padding: 0 var(--site-gutter, clamp(32px, 5vw, 80px));
          box-sizing: border-box;
        }
        .fv2-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.85fr) auto auto;
          gap: clamp(48px, 7vw, 120px);
          align-items: start;
          text-align: left;
        }
        .fv2-brand { min-width: 0; }
        .fv2-logo {
          display: block;
          width: 28px;
          height: 28px;
          object-fit: contain;
          margin: 0 0 14px;
        }
        .fv2-name {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: .01em;
          margin: 0 0 14px;
          color: #FFFEF9;
          line-height: 1.35;
        }
        .fv2-tagline {
          font-size: 12px;
          line-height: 1.5;
          font-weight: 400;
          color: rgba(255,254,249,.78);
          margin: 0;
          max-width: 560px;
        }
        .fv2-col-title {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: .08em;
          text-transform: uppercase;
          margin: 0 0 22px;
          color: #FFFEF9;
        }
        .fv2-col ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 14px;
        }
        .fv2-col a {
          font-size: 12px;
          color: rgba(255,254,249,.78);
          text-decoration: none;
          transition: opacity .2s;
          white-space: nowrap;
        }
        .fv2-col a:hover { opacity: .55; }
        .fv2-bottom {
          margin-top: clamp(48px, 7vw, 88px);
          font-size: 12px;
          color: rgba(255,254,249,.55);
        }
        .fv2-bottom a {
          color: rgba(255,254,249,.78);
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .fv2-bottom a:hover { opacity: .65; }
        @media (max-width: 900px) {
          .fv2-grid { grid-template-columns: 1fr 1fr; gap: 36px 48px; }
          .fv2-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 640px) {
          .fv2-wrap { padding: 0 clamp(20px, 5vw, 32px); }
          .fv2-grid { grid-template-columns: 1fr; gap: 36px; }
          .fv2-logo { width: 24px; height: 24px; margin-bottom: 12px; }
          .fv2-name { font-size: 15px; margin-bottom: 12px; }
          .fv2-tagline { max-width: none; }
        }
      `}</style>

      <div className="fv2-wrap">
        <div className="fv2-grid">
          <section className="fv2-brand" aria-label="Arthur Arutyunyan">
            <img
              className="fv2-logo"
              src="/brand/sitbo-logo-s-light.png"
              alt="Sitbo Invest"
              width={28}
              height={28}
            />
            <h2 className="fv2-name">
              Arthur Arutyunyan | {t("v2.footer.role")}
            </h2>
            <p className="fv2-tagline">{t("v2.footer.tagline")}</p>
          </section>

          <nav className="fv2-col" aria-label={t("v2.footer.investment")}>
            <h3 className="fv2-col-title">{t("v2.footer.investment")}</h3>
            <ul>
              <li>
                <Link href="/catalog">{t("v2.footer.properties")}</Link>
              </li>
              <li>
                <Link href="/services">{t("v2.footer.partnership")}</Link>
              </li>
            </ul>
          </nav>

          <nav className="fv2-col" aria-label={t("v2.footer.contact")}>
            <h3 className="fv2-col-title">{t("v2.footer.contact")}</h3>
            <ul>
              <li>
                <AppLink href="/#consultation">{t("v2.footer.consultation")}</AppLink>
              </li>
              <li>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={TELEGRAM} target="_blank" rel="noopener noreferrer">
                  Telegram
                </a>
              </li>
              <li>
                <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="fv2-bottom">
          <p>
            {t("v2.footer.rights")}{" "}
            <Link href="/legal">{t("v2.footer.terms")}</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
