import { useState } from "react";
import { useT } from "../i18n";
import { useLocale } from "../context/LocaleContext";
import {
  GEORGIA_AIRPORTS,
  GEORGIA_REGION_SHAPES,
  GEORGIA_VIEWBOX,
} from "../data/georgia-map";

type Lang = "en" | "ru" | "ka";
type Names = Record<Lang, string>;

type RegionInfo = {
  name: Names;
  centre: Names;
  /** Geostat, population as of 1 January 2026 (persons). Omitted for occupied territory. */
  population?: number;
  occupied?: boolean;
};

const GEORGIA_POPULATION = 3_941_103;

const REGIONS: Record<string, RegionInfo> = {
  tbilisi: {
    name: { en: "Tbilisi", ru: "Тбилиси", ka: "თბილისი" },
    centre: { en: "Capital", ru: "Столица", ka: "დედაქალაქი" },
    population: 1_369_356,
  },
  adjara: {
    name: { en: "Adjara A.R.", ru: "Аджария (АР)", ka: "აჭარის ა.რ." },
    centre: { en: "Batumi", ru: "Батуми", ka: "ბათუმი" },
    population: 413_214,
  },
  guria: {
    name: { en: "Guria", ru: "Гурия", ka: "გურია" },
    centre: { en: "Ozurgeti", ru: "Озургети", ka: "ოზურგეთი" },
    population: 101_557,
  },
  imereti: {
    name: { en: "Imereti", ru: "Имеретия", ka: "იმერეთი" },
    centre: { en: "Kutaisi", ru: "Кутаиси", ka: "ქუთაისი" },
    population: 492_505,
  },
  kakheti: {
    name: { en: "Kakheti", ru: "Кахетия", ka: "კახეთი" },
    centre: { en: "Telavi", ru: "Телави", ka: "თელავი" },
    population: 300_049,
  },
  "mtskheta-mtianeti": {
    name: { en: "Mtskheta-Mtianeti", ru: "Мцхета-Мтианети", ka: "მცხეთა-მთიანეთი" },
    centre: { en: "Mtskheta", ru: "Мцхета", ka: "მცხეთა" },
    population: 93_187,
  },
  "racha-lechkhumi": {
    name: {
      en: "Racha-Lechkhumi and Kvemo Svaneti",
      ru: "Рача-Лечхуми и Квемо Сванети",
      ka: "რაჭა-ლეჩხუმი და ქვემო სვანეთი",
    },
    centre: { en: "Ambrolauri", ru: "Амбролаури", ka: "ამბროლაური" },
    population: 29_481,
  },
  "samegrelo-zemo-svaneti": {
    name: { en: "Samegrelo-Zemo Svaneti", ru: "Самегрело-Земо Сванети", ka: "სამეგრელო-ზემო სვანეთი" },
    centre: { en: "Zugdidi", ru: "Зугдиди", ka: "ზუგდიდი" },
    population: 297_820,
  },
  "samtskhe-javakheti": {
    name: { en: "Samtskhe-Javakheti", ru: "Самцхе-Джавахети", ka: "სამცხე-ჯავახეთი" },
    centre: { en: "Akhaltsikhe", ru: "Ахалцихе", ka: "ახალციხე" },
    population: 155_480,
  },
  "kvemo-kartli": {
    name: { en: "Kvemo Kartli", ru: "Квемо Картли", ka: "ქვემო ქართლი" },
    centre: { en: "Rustavi", ru: "Рустави", ka: "რუსთავი" },
    population: 440_058,
  },
  "shida-kartli": {
    name: { en: "Shida Kartli", ru: "Шида Картли", ka: "შიდა ქართლი" },
    centre: { en: "Gori", ru: "Гори", ka: "გორი" },
    population: 248_396,
  },
  abkhazia: {
    name: { en: "Abkhazia A.R.", ru: "Абхазия (АР)", ka: "აფხაზეთის ა.რ." },
    centre: { en: "Sokhumi", ru: "Сухуми", ka: "სოხუმი" },
    occupied: true,
  },
};

const CSS = `
.gm {
  display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(260px, 0.8fr);
  gap: clamp(16px, 2.4vw, 32px); align-items: stretch;
}
.gm-map {
  background: var(--card-muted, #E8E4DF); border-radius: var(--radius, 20px);
  padding: clamp(14px, 2.4vw, 32px); box-sizing: border-box;
  display: flex; flex-direction: column; gap: 18px;
}
.gm-svg { width: 100%; height: auto; display: block; overflow: visible; }
.gm-region {
  fill: #FFFEF9; stroke: #E8E4DF; stroke-width: 1.6; stroke-linejoin: round;
  cursor: pointer; transition: fill .2s;
  outline: none;
}
.gm-region:hover, .gm-region:focus-visible { fill: rgba(72,103,77,.45); }
.gm-region.is-active { fill: #48674D; }
.gm-region.is-occupied { fill: url(#gm-hatch); }
.gm-region.is-occupied.is-active, .gm-region.is-occupied:hover { fill: rgba(65,40,52,.35); }
.gm-airport { pointer-events: none; }
.gm-legend {
  display: flex; flex-wrap: wrap; gap: 10px 24px; margin: 0; padding: 0; list-style: none;
  font-size: 13px; color: rgba(33,20,26,.75);
}
.gm-legend li { display: inline-flex; align-items: center; gap: 8px; }
.gm-hint { font-size: 13px; color: rgba(33,20,26,.55); margin: 0; }
.gm-card {
  background: var(--card-plum, #412834); color: #FFFEF9; border-radius: var(--radius, 20px);
  padding: clamp(22px, 2.4vw, 32px); box-sizing: border-box;
  display: flex; flex-direction: column; gap: 22px;
}
.gm-card-eyebrow { font-size: 12px; letter-spacing: .14em; text-transform: uppercase; opacity: .7; margin: 0; }
.gm-card h3 {
  font-family: var(--display, 'JUN', Georgia, serif); font-weight: 600; margin: 0;
  font-size: clamp(26px, 2.4vw, 36px); line-height: 1.1;
}
.gm-facts { display: grid; gap: 16px; margin: 0; }
.gm-facts dt { font-size: 13px; opacity: .7; margin: 0 0 4px; }
.gm-facts dd {
  margin: 0; font-family: var(--display, 'JUN', Georgia, serif); font-weight: 600;
  font-size: clamp(22px, 2vw, 28px); line-height: 1.15;
}
.gm-note { font-size: 14px; line-height: 1.5; margin: 0; opacity: .85; }
.gm-source { font-size: 12px; line-height: 1.45; opacity: .6; margin: auto 0 0; }
@media (max-width: 1000px) {
  .gm { grid-template-columns: 1fr; }
}
`;

function langOf(language: string): Lang {
  return language === "ru" || language === "ka" ? language : "en";
}

export function GeorgiaMap() {
  const t = useT();
  const { language } = useLocale();
  const lang = langOf(language);
  const [active, setActive] = useState<string | null>(null);
  const fmt = (n: number) => n.toLocaleString(lang === "ka" ? "ka-GE" : lang === "ru" ? "ru-RU" : "en-US");

  const region = active ? REGIONS[active] : null;
  const share = region?.population ? ((region.population / GEORGIA_POPULATION) * 100).toFixed(1) : null;

  return (
    <div className="gm">
      <style>{CSS}</style>

      <div className="gm-map">
        <svg
          className="gm-svg"
          viewBox={GEORGIA_VIEWBOX}
          role="img"
          aria-label={t("invest.map.title")}
          onMouseLeave={() => setActive(null)}
        >
          <defs>
            <pattern id="gm-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="8" height="8" fill="#FFFEF9" />
              <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(65,40,52,.28)" strokeWidth="3" />
            </pattern>
          </defs>
          {GEORGIA_REGION_SHAPES.map((shape) => {
            const info = REGIONS[shape.id];
            const classes = [
              "gm-region",
              info?.occupied ? "is-occupied" : "",
              active === shape.id ? "is-active" : "",
            ].join(" ");
            return (
              <path
                key={shape.id}
                d={shape.d}
                className={classes}
                tabIndex={0}
                aria-label={info?.name[lang]}
                onMouseEnter={() => setActive(shape.id)}
                onFocus={() => setActive(shape.id)}
                onClick={() => setActive(shape.id)}
              />
            );
          })}
          {GEORGIA_AIRPORTS.map((a) =>
            a.kind === "international" ? (
              <g key={a.id} className="gm-airport">
                <circle cx={a.x} cy={a.y} r={11} fill="#21141A" />
                <circle cx={a.x} cy={a.y} r={4} fill="#FFFEF9" />
                <title>{a.name}</title>
              </g>
            ) : (
              <g key={a.id} className="gm-airport">
                <circle cx={a.x} cy={a.y} r={8} fill="#FFFEF9" stroke="#21141A" strokeWidth={3} />
                <title>{a.name}</title>
              </g>
            ),
          )}
        </svg>

        <ul className="gm-legend">
          <li>
            <svg width="18" height="18" viewBox="0 0 22 22" aria-hidden>
              <circle cx="11" cy="11" r="10" fill="#21141A" />
              <circle cx="11" cy="11" r="4" fill="#FFFEF9" />
            </svg>
            {t("invest.map.airportsIntl")}
          </li>
          <li>
            <svg width="16" height="16" viewBox="0 0 22 22" aria-hidden>
              <circle cx="11" cy="11" r="8" fill="#FFFEF9" stroke="#21141A" strokeWidth="3" />
            </svg>
            {t("invest.map.airportsDomestic")}
          </li>
          <li>
            <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden>
              <rect width="18" height="14" fill="url(#gm-hatch)" stroke="rgba(65,40,52,.35)" />
            </svg>
            {t("invest.map.occupiedLegend")}
          </li>
        </ul>
        <p className="gm-hint">{t("invest.map.hint")}</p>
      </div>

      <aside className="gm-card" aria-live="polite">
        {region ? (
          <>
            <div>
              <p className="gm-card-eyebrow">{t("invest.map.region")}</p>
              <h3>{region.name[lang]}</h3>
            </div>
            <dl className="gm-facts">
              <div>
                <dt>{t("invest.map.centre")}</dt>
                <dd>{region.centre[lang]}</dd>
              </div>
              {region.population ? (
                <>
                  <div>
                    <dt>{t("invest.map.population")}</dt>
                    <dd>{fmt(region.population)}</dd>
                  </div>
                  <div>
                    <dt>{t("invest.map.share")}</dt>
                    <dd>{share}%</dd>
                  </div>
                </>
              ) : null}
            </dl>
            {region.occupied ? <p className="gm-note">{t("invest.map.occupiedNote")}</p> : null}
          </>
        ) : (
          <>
            <div>
              <p className="gm-card-eyebrow">{t("invest.map.eyebrow")}</p>
              <h3>{t("invest.map.country")}</h3>
            </div>
            <dl className="gm-facts">
              <div>
                <dt>{t("invest.map.population")}</dt>
                <dd>{fmt(GEORGIA_POPULATION)}</dd>
              </div>
              <div>
                <dt>{t("invest.map.area")}</dt>
                <dd>{t("invest.map.areaValue")}</dd>
              </div>
              <div>
                <dt>{t("invest.map.capital")}</dt>
                <dd>{REGIONS.tbilisi.name[lang]}</dd>
              </div>
              <div>
                <dt>{t("invest.map.currency")}</dt>
                <dd>{t("invest.map.currencyValue")}</dd>
              </div>
            </dl>
          </>
        )}
        <p className="gm-source">{t("invest.map.source")}</p>
      </aside>
    </div>
  );
}
