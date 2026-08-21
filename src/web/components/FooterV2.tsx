import { Link } from "wouter";
import { AppLink } from "./app-link";
import { useT } from "../i18n";

const WHATSAPP = "https://wa.me/995555505288";
const TELEGRAM = "https://t.me/sitboinvest";
const INSTAGRAM = "https://instagram.com/sitboinvest";
const LINKEDIN = "https://www.linkedin.com/company/sitbo-invest";

/** Luxury footer — centered 1240px canvas, light surface, left-aligned copy. */
export function FooterV2() {
  const t = useT();

  return (
    <footer className="fv2" role="contentinfo">
      <style>{`
        .fv2 {
          background: #FFFEF9;
          color: #21141A;
          font-family: 'Inter', sans-serif;
          padding: clamp(64px, 8vw, 112px) 0 clamp(32px, 4vw, 56px);
          border-top: 1px solid rgba(33,20,26,.08);
        }
        .fv2-wrap {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 clamp(40px, 6vw, 100px);
          box-sizing: border-box;
        }
        .fv2-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.6fr) auto auto;
          gap: clamp(40px, 6vw, 96px);
          align-items: start;
          text-align: left;
        }
        .fv2-brand { min-width: 0; }
        .fv2-name {
          font-family: 'Inter', sans-serif;
          font-size: clamp(16px, 1.2vw, 18px);
          font-weight: 500;
          letter-spacing: .01em;
          margin: 0 0 20px;
          color: #21141A;
        }
        .fv2-name em {
          font-family: 'Inter', sans-serif;
          font-style: italic;
          font-weight: 400;
        }
        .fv2-tagline {
          font-size: clamp(14px, 1.1vw, 16px);
          line-height: 1.65;
          color: #21141A;
          margin: 0;
          max-width: 560px;
        }
        .fv2-col-title {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: .08em;
          text-transform: uppercase;
          margin: 0 0 22px;
          color: #21141A;
        }
        .fv2-col ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 14px;
        }
        .fv2-col a {
          font-size: 15px;
          color: #21141A;
          text-decoration: none;
          transition: opacity .2s;
          white-space: nowrap;
        }
        .fv2-col a:hover { opacity: .55; }
        .fv2-bottom {
          margin-top: clamp(48px, 7vw, 88px);
          padding-top: 28px;
          border-top: 1px solid rgba(33,20,26,.1);
          font-size: 13px;
          color: rgba(33,20,26,.65);
        }
        .fv2-bottom a {
          color: #21141A;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .fv2-bottom a:hover { opacity: .65; }
        @media (max-width: 900px) {
          .fv2-grid { grid-template-columns: 1fr 1fr; gap: 36px 48px; }
          .fv2-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 640px) {
          .fv2-wrap { padding: 0 clamp(24px, 6vw, 40px); }
          .fv2-grid { grid-template-columns: 1fr; gap: 36px; }
          .fv2-name { font-size: 15px; margin-bottom: 16px; }
          .fv2-tagline { font-size: 14px; max-width: none; }
        }
      `}</style>

      <div className="fv2-wrap">
        <div className="fv2-grid">
          <section className="fv2-brand" aria-label="Arthur Arutyunyan">
            <h2 className="fv2-name">
              Arthur Arutyunyan | <em>{t("v2.footer.role")}</em>
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
