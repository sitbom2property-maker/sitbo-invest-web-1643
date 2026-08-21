import { useEffect, useState } from "react";
import { useLocale } from "../context/LocaleContext";
import { useT } from "../i18n";
import { PrivacyModal } from "./PrivacyModal";

type CookiePrefs = {
  necessary: boolean;
  performance: boolean;
  targeting: boolean;
  functionality: boolean;
  unclassified: boolean;
};

const STORAGE_KEY = "sitbo_cookie_consent";

const ALL_ON: CookiePrefs = {
  necessary: true,
  performance: true,
  targeting: true,
  functionality: true,
  unclassified: true,
};

const NECESSARY_ONLY: CookiePrefs = {
  necessary: true,
  performance: false,
  targeting: false,
  functionality: false,
  unclassified: false,
};

const CATEGORIES: {
  key: keyof CookiePrefs;
  labelKey:
    | "cookie.necessary"
    | "cookie.performance"
    | "cookie.targeting"
    | "cookie.functionality"
    | "cookie.unclassified";
  descKey:
    | "cookie.necessaryDesc"
    | "cookie.performanceDesc"
    | "cookie.targetingDesc"
    | "cookie.functionalityDesc"
    | "cookie.unclassifiedDesc";
  locked?: boolean;
}[] = [
  { key: "necessary", labelKey: "cookie.necessary", descKey: "cookie.necessaryDesc", locked: true },
  { key: "performance", labelKey: "cookie.performance", descKey: "cookie.performanceDesc" },
  { key: "targeting", labelKey: "cookie.targeting", descKey: "cookie.targetingDesc" },
  { key: "functionality", labelKey: "cookie.functionality", descKey: "cookie.functionalityDesc" },
  { key: "unclassified", labelKey: "cookie.unclassified", descKey: "cookie.unclassifiedDesc" },
];

function persist(prefs: CookiePrefs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>(NECESSARY_ONLY);
  const [details, setDetails] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const t = useT();
  const { language, setLocale } = useLocale();

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) setShowBanner(true);
  }, []);

  useEffect(() => {
    if (!showBanner) {
      document.body.classList.remove("has-cookie-banner");
      document.documentElement.style.removeProperty("--cookie-banner-height");
      return;
    }
    document.body.classList.add("has-cookie-banner");
    const el = document.getElementById("sitbo-cookie-banner");
    if (!el) return;
    const apply = () => {
      document.documentElement.style.setProperty("--cookie-banner-height", `${el.offsetHeight}px`);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.body.classList.remove("has-cookie-banner");
      document.documentElement.style.removeProperty("--cookie-banner-height");
    };
  }, [showBanner, details]);

  const close = (next: CookiePrefs) => {
    persist(next);
    setShowBanner(false);
  };

  const toggle = (key: keyof CookiePrefs, locked?: boolean) => {
    if (locked) return;
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  };

  if (!showBanner) return null;

  return (
    <>
      <style>{COOKIE_CSS}</style>
      <div id="sitbo-cookie-banner" className="ck" role="dialog" aria-labelledby="ck-title" aria-modal="false">
        <div className="ck-inner">
          <div className="ck-top">
            <h2 id="ck-title" className="ck-title">
              {t("cookie.title")}
            </h2>
            <div className="ck-tools">
              <div className="ck-lang">
                <button
                  type="button"
                  className="ck-icon-btn"
                  aria-label={t("cookie.language")}
                  aria-expanded={langOpen}
                  onClick={() => setLangOpen((v) => !v)}
                >
                  <GlobeIcon />
                </button>
                {langOpen && (
                  <div className="ck-lang-menu" role="listbox" aria-label={t("cookie.language")}>
                    {(["en", "ru"] as const).map((code) => (
                      <button
                        key={code}
                        type="button"
                        role="option"
                        aria-selected={language === code}
                        className={language === code ? "is-active" : ""}
                        onClick={() => {
                          setLocale({ language: code });
                          setLangOpen(false);
                        }}
                      >
                        {code.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                className="ck-icon-btn"
                aria-label={t("cookie.close")}
                onClick={() => close(NECESSARY_ONLY)}
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          <p className="ck-body">{t("cookie.body")}</p>
          <button type="button" className="ck-policy" onClick={() => setPolicyOpen(true)}>
            {t("cookie.readMore")}
          </button>

          <div className="ck-row">
            <div className="ck-cats">
              {CATEGORIES.map((c) => (
                <label key={c.key} className={`ck-cat${c.locked ? " is-locked" : ""}`}>
                  <input
                    type="checkbox"
                    checked={prefs[c.key]}
                    disabled={c.locked}
                    onChange={() => toggle(c.key, c.locked)}
                  />
                  <span className="ck-box" aria-hidden="true">
                    {prefs[c.key] ? (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4.1 3.6 6.6 9 1.2"
                          stroke="#21141A"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </span>
                  <span>{t(c.labelKey)}</span>
                </label>
              ))}
            </div>

            <div className="ck-actions">
              <button type="button" className="ck-btn ck-btn-accept" onClick={() => close(ALL_ON)}>
                <span className="ck-btn-full">{t("cookie.acceptAll")}</span>
                <span className="ck-btn-short">{t("cookie.accept")}</span>
              </button>
              <button type="button" className="ck-btn ck-btn-decline" onClick={() => close(NECESSARY_ONLY)}>
                <span className="ck-btn-full">{t("cookie.declineAll")}</span>
                <span className="ck-btn-short">{t("cookie.decline")}</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            className="ck-details-toggle"
            aria-expanded={details}
            onClick={() => setDetails((v) => !v)}
          >
            <GearIcon />
            {details ? t("cookie.hideDetails") : t("cookie.showDetails")}
          </button>

          {details && (
            <ul className="ck-details">
              {CATEGORIES.map((c) => (
                <li key={c.key}>
                  <strong>{t(c.labelKey)}</strong>
                  <p>{t(c.descKey)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <PrivacyModal open={policyOpen} onClose={() => setPolicyOpen(false)} />
    </>
  );
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18M12 3c2.8 2.6 4.2 6 4.2 9s-1.4 6.4-4.2 9c-2.8-2.6-4.2-6-4.2-9s1.4-6.4 4.2-9Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M1 1l12 12M13 1 1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 3.2v1.8M12 19v1.8M20.8 12h-1.8M4.8 12H3M18.2 5.8l-1.3 1.3M7.1 16.9l-1.3 1.3M18.2 18.2l-1.3-1.3M7.1 7.1 5.8 5.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

const COOKIE_CSS = `
.ck {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: #21141A;
  color: #FFFEF9;
  font-family: Inter, sans-serif;
  box-shadow: 0 -8px 32px rgba(0,0,0,.35);
}
.ck-inner {
  max-width: var(--site-max, 1440px);
  margin: 0 auto;
  padding: 18px var(--site-gutter, 32px) 16px;
  box-sizing: border-box;
}
.ck-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.ck-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0;
  color: #FFFEF9;
}
.ck-tools { display: flex; align-items: center; gap: 4px; }
.ck-lang { position: relative; }
.ck-icon-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; padding: 0;
  background: none; border: none; color: #FFFEF9; cursor: pointer;
}
.ck-icon-btn:hover { opacity: .7; }
.ck-lang-menu {
  position: absolute; right: 0; bottom: calc(100% + 8px);
  min-width: 72px; background: #21141A; border: 1px solid rgba(255,255,255,.16);
  border-radius: 2px; padding: 4px; z-index: 2;
}
.ck-lang-menu button {
  width: 100%; background: none; border: none; color: #FFFEF9;
  font-size: 11px; font-weight: 700; letter-spacing: .08em;
  padding: 8px 10px; cursor: pointer; text-align: left; border-radius: 2px;
}
.ck-lang-menu button.is-active,
.ck-lang-menu button:hover { background: rgba(255,255,255,.08); color: #FFFEF9; }
.ck-body {
  margin: 8px 0 0; max-width: 820px;
  font-size: 13.5px; line-height: 1.5; color: rgba(255,255,255,.92);
}
.ck-policy {
  display: inline-block; margin: 8px 0 14px; padding: 0;
  background: none; border: none; cursor: pointer;
  color: #FFFEF9; font-size: 13.5px; font-weight: 500;
  text-decoration: none;
}
.ck-policy:hover { text-decoration: underline; }
.ck-row {
  display: flex; align-items: center; justify-content: space-between;
  gap: 24px; flex-wrap: wrap;
}
.ck-cats {
  display: flex; flex-wrap: wrap; gap: 14px 22px; align-items: center;
  flex: 1 1 420px;
}
.ck-cat {
  display: inline-flex; align-items: center; gap: 8px;
  cursor: pointer; user-select: none;
  font-size: 11px; font-weight: 700; letter-spacing: .08em;
  text-transform: uppercase; color: #FFFEF9;
}
.ck-cat.is-locked { cursor: default; }
.ck-cat input { position: absolute; opacity: 0; pointer-events: none; }
.ck-box {
  width: 16px; height: 16px; flex-shrink: 0;
  border: 1.5px solid #FFFEF9; border-radius: 2px;
  display: inline-flex; align-items: center; justify-content: center;
  background: transparent;
}
.ck-cat input:checked + .ck-box {
  background: #703C54; border-color: #703C54;
}
.ck-actions { display: flex; gap: 10px; flex-shrink: 0; }
.ck-btn {
  background: transparent; color: #FFFEF9;
  border: 1px solid #FFFEF9; border-radius: 2px;
  padding: 10px 22px; cursor: pointer;
  font-size: 11px; font-weight: 700; letter-spacing: .1em;
  text-transform: uppercase; white-space: nowrap;
}
.ck-btn:hover { background: #FFFEF9; color: #21141A; }
.ck-btn-short { display: none; }
.ck-details-toggle {
  display: inline-flex; align-items: center; gap: 8px;
  margin-top: 14px; padding: 0;
  background: none; border: none; color: #FFFEF9; cursor: pointer;
  font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
}
.ck-details-toggle:hover { opacity: .75; }
.ck-details {
  list-style: none; margin: 12px 0 0; padding: 12px 0 0;
  border-top: 1px solid rgba(255,255,255,.12);
  display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px 20px;
}
.ck-details strong {
  display: block; font-size: 11px; letter-spacing: .08em;
  text-transform: uppercase; margin-bottom: 4px;
}
.ck-details p {
  margin: 0; font-size: 12px; line-height: 1.45; color: #FFFEF9;
  font-weight: 400; text-transform: none; letter-spacing: 0;
}
@media (max-width: 720px) {
  .ck {
    max-height: 50vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .ck-inner {
    padding: 14px clamp(16px, 5vw, 24px) 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 0;
  }
  .ck-title { font-size: 15px; font-weight: 600; }
  .ck-body {
    margin: 0;
    max-width: none;
    font-size: 13px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .ck-lang,
  .ck-policy,
  .ck-cats,
  .ck-details-toggle,
  .ck-details { display: none !important; }
  .ck-row {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    margin: 0;
  }
  .ck-actions {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .ck-btn {
    flex: none;
    width: 100%;
    text-align: center;
    padding: 12px 10px;
  }
  .ck-btn-full { display: none; }
  .ck-btn-short { display: inline; }
}
`;
