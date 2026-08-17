import { Link } from "wouter";
import { AppLink } from "./app-link";
import { useT } from "../i18n";

const WHATSAPP = "https://wa.me/995555505288";
const TELEGRAM = "https://t.me/sitboinvest";
const INSTAGRAM = "https://instagram.com/sitboinvest";
const LINKEDIN = "https://www.linkedin.com/company/sitbo-invest";

/** Footer rebuilt from the Figma export (Desktop - 1.pdf). */
export function FooterV2() {
  const t = useT();

  return (
    <footer className="fv2">
      <style>{`
        .fv2 {
          --rd-max: var(--site-max, 1440px);
          --rd-gutter: var(--site-gutter, clamp(30px, 5.5vw, 80px));
          background: #21141A;
          color: #FFFEF9;
          font-family: 'Inter', sans-serif;
          padding: clamp(46px, 6vw, 88px) 0 clamp(26px, 3vw, 44px);
        }
        .fv2-wrap {
          max-width: var(--rd-max); margin: 0 auto;
          padding: 0 var(--rd-gutter); box-sizing: border-box;
        }
        .fv2-grid {
          display: grid; grid-template-columns: minmax(0, 1fr) auto auto;
          gap: clamp(32px, 5vw, 96px); align-items: start;
        }
        .fv2-logo { height: 22px; width: auto; display: block; margin-bottom: 22px; }
        .fv2-name {
          font-family: 'Inter', sans-serif; font-size: clamp(17px, 1.39vw, 20px);
          margin: 0 0 22px; color: #FFFEF9;
        }
        .fv2-name em { font-family: 'Inter', sans-serif; font-style: italic; }
        .fv2-tagline {
          font-size: clamp(15px, 1.25vw, 18px); line-height: 1.45;
          color: rgba(255,255,255,.82); margin: 0; max-width: 560px;
        }
        .fv2-tagline + .fv2-tagline { margin-top: 0.55em; }
        .fv2-col-title {
          font-family: 'Inter', sans-serif;
          font-size: clamp(16px, 1.39vw, 20px); font-weight: 600; margin: 0 0 22px; color: #FFFEF9;
        }
        .fv2-col ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
        .fv2-col a {
          font-size: 16px; color: rgba(255,255,255,.85); text-decoration: none;
          transition: color .2s; white-space: nowrap;
        }
        .fv2-col a:hover { color: #FFFEF9; text-decoration: underline; }
        .fv2-bottom {
          margin-top: clamp(40px, 6vw, 96px); font-size: 16px; color: rgba(255,255,255,.72);
        }
        .fv2-bottom a { color: rgba(255,255,255,.72); }
        @media (max-width: 900px) {
          .fv2-grid { grid-template-columns: 1fr 1fr; }
          .fv2-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 640px) {
          .fv2-logo { height: 18px; margin-bottom: 16px; }
          .fv2-name { font-size: 15px; margin-bottom: 14px; }
          .fv2-tagline { font-size: 14px; max-width: none; }
        }
      `}</style>

      <div className="fv2-wrap">
        <div className="fv2-grid">
          <div className="fv2-brand">
            <Link href="/" aria-label="SITBO Invest">
              <img className="fv2-logo" src="/brand/logo-dark-bg.png" alt="SITBO Invest" />
            </Link>
            <p className="fv2-name">
              Arthur Arutyunyan | <em>{t("v2.footer.role")}</em>
            </p>
            <p className="fv2-tagline">{t("v2.footer.tagline")}</p>
            <p className="fv2-tagline">{t("v2.footer.taglineEnd")}</p>
          </div>

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

        <p className="fv2-bottom">
          {t("v2.footer.rights")}{" "}
          <Link href="/legal">{t("v2.footer.terms")}</Link>
        </p>
      </div>
    </footer>
  );
}
