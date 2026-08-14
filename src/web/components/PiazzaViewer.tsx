import { useLocale } from "../context/LocaleContext";
import { useT } from "../i18n";

/** Official Piazza Flat.show module (same allowlisted embed the developer uses). */
const VIEWER_EN = "https://www.visarteam.tech/interactive-tools/piazza";
const VIEWER_RU = "https://www.visarteam.tech/interactive-tools/piazza";
const DEVELOPER = "https://centralmg.ge/piazza/apartments";

function viewerSrc(ru: boolean) {
  const base = ru ? VIEWER_RU : VIEWER_EN;
  if (typeof window === "undefined") return `${base}#/`;
  const hash = window.location.hash.toLowerCase();
  if (hash.includes("floors")) return `${base}#/floors`;
  if (hash.includes("2d") || hash.includes("chess")) return `${base}#/chess`;
  return `${base}#/`;
}

export function PiazzaViewer({ projectName }: { projectName: string }) {
  const t = useT();
  const { language } = useLocale();
  const ru = language.toLowerCase().startsWith("ru");
  const src = viewerSrc(ru);
  const developer = ru ? `${DEVELOPER.replace("/piazza/", "/ru/piazza/")}` : DEVELOPER;

  return (
    <div id="apartments" className="pz">
      <div className="pz-head">
        <div>
          <h3 className="pz-title">{t("chess.title")}</h3>
          <p className="pz-sub">{t("chess.officialHint")}</p>
        </div>
        <a className="pz-ext" href={developer} target="_blank" rel="noopener noreferrer">
          {t("chess.openFullscreen")}
        </a>
      </div>

      <iframe
        className="pz-frame"
        title={`${projectName} — Flat.show`}
        src={src}
        allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
        allowFullScreen
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
      />

      <style>{CSS}</style>
    </div>
  );
}

const CSS = `
.pz { font-family: Inter, sans-serif; color: #21141A; }
.pz-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin: 0 auto 18px; width: min(1180px, calc(100% - 40px)); }
.pz-title { font-family: Coolvetica, Inter, sans-serif; font-size: clamp(1.6rem,2.5vw,2.2rem); font-weight: 400; margin: 0; }
.pz-sub { font-size: 0.85rem; color: #7a7a7a; margin: 8px 0 0; }
.pz-ext { font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: #21141A; text-decoration: none; border-bottom: 1px solid rgba(33,20,26,.35); padding-bottom: 2px; }
.pz-frame { display: block; width: 100%; height: min(92vh, 980px); min-height: 640px; border: 0; background: #f4f1ec; }
@media (max-width: 720px) {
  .pz-frame { min-height: 520px; height: 80vh; }
  .pz-head { width: calc(100% - 32px); }
}
`;
