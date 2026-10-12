import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Poi, PoiCategory } from "../data/projects";

type Lang = "en" | "ru" | "ka";
type Names = Record<Lang, string>;

export type NeighbourhoodMapProps = {
  center: { lat: number; lng: number };
  label: string;
  pois: Poi[];
  language: string;
};

const COLORS: Record<PoiCategory, string> = {
  metro: "#C0392B",
  landmark: "#703C54",
  shopping: "#48674D",
  education: "#2B6CB0",
  transport: "#21141A",
};

const CATEGORY_LABELS: Record<PoiCategory, Names> = {
  metro: { en: "Metro", ru: "Метро", ka: "მეტრო" },
  landmark: { en: "Old Tbilisi", ru: "Старый Тбилиси", ka: "ძველი თბილისი" },
  shopping: { en: "Shopping", ru: "Покупки", ka: "შოპინგი" },
  education: { en: "Education", ru: "Образование", ka: "განათლება" },
  transport: { en: "Airport & rail", ru: "Аэропорт и вокзал", ka: "აეროპორტი და სადგური" },
};

const UI: Record<Lang, { all: string; walk: string; drive: string; km: string; m: string; hint: string }> = {
  en: { all: "All", walk: "min walk", drive: "min drive", km: "km", m: "m", hint: "Tap a place to see it on the map" },
  ru: { all: "Все", walk: "мин пешком", drive: "мин на машине", km: "км", m: "м", hint: "Нажмите на место, чтобы увидеть его на карте" },
  ka: { all: "ყველა", walk: "წთ ფეხით", drive: "წთ მანქანით", km: "კმ", m: "მ", hint: "შეეხეთ ადგილს, რომ რუკაზე ნახოთ" },
};

function langOf(language: string): Lang {
  return language === "ru" || language === "ka" ? language : "en";
}

/** Straight-line distance in metres. */
export function distanceMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Rough travel time: walking up to 2.5 km (80 m/min), driving beyond (30 km/h city average); 1.3 route factor. */
export function travelTime(meters: number): { minutes: number; mode: "walk" | "drive" } {
  const route = meters * 1.3;
  if (meters <= 2500) return { minutes: Math.max(1, Math.round(route / 80)), mode: "walk" };
  return { minutes: Math.max(1, Math.round(route / 500)), mode: "drive" };
}

const CSS = `
.nm { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(260px, 0.9fr); gap: 16px; }
.nm-map { position: relative; height: clamp(360px, 46vw, 560px); border-radius: 2px; overflow: hidden; background: #ECE8E1; z-index: 0; }
.nm-map .leaflet-container { width: 100%; height: 100%; font-family: Nunito, sans-serif; background: #ECE8E1; }
.nm-side { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.nm-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.nm-chip {
  display: inline-flex; align-items: center; gap: 7px; padding: 7px 12px; border-radius: 999px;
  border: 1px solid rgba(33,20,26,0.15); background: #FFFEF9; color: #21141A;
  font-family: Nunito, sans-serif; font-size: 13px; cursor: pointer; transition: background .2s, border-color .2s;
}
.nm-chip.is-on { background: #21141A; color: #FFFEF9; border-color: #21141A; }
.nm-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.nm-list { list-style: none; margin: 0; padding: 0; max-height: clamp(260px, 36vw, 470px); overflow-y: auto; border-top: 1px solid rgba(33,20,26,0.1); }
.nm-item {
  display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: 12px; align-items: center;
  width: 100%; padding: 12px 4px; border: none; border-bottom: 1px solid rgba(33,20,26,0.1);
  background: transparent; text-align: left; cursor: pointer; font-family: Nunito, sans-serif; color: #21141A;
}
.nm-item:hover, .nm-item.is-active { background: rgba(112,60,84,0.06); }
.nm-item-name { font-size: 15px; font-weight: 600; line-height: 1.3; }
.nm-item-cat { font-size: 12px; color: rgba(33,20,26,0.5); }
.nm-item-dist { text-align: right; font-size: 13px; line-height: 1.3; white-space: nowrap; }
.nm-item-dist b { display: block; font-size: 15px; }
.nm-hint { font-size: 12px; color: rgba(33,20,26,0.5); margin: 0; }
.nm-home {
  display: inline-flex; align-items: center; gap: 6px; transform: translate(-50%, -100%);
  background: #703C54; color: #FFFEF9; padding: 7px 12px; border-radius: 2px; white-space: nowrap;
  font-family: Nunito, sans-serif; font-size: 13px; font-weight: 700; letter-spacing: .06em;
  box-shadow: 0 8px 24px rgba(33,20,26,.35); position: relative;
}
.nm-home::after {
  content: ""; position: absolute; left: 50%; bottom: -6px; transform: translateX(-50%);
  border: 6px solid transparent; border-top-color: #703C54; border-bottom: 0;
}
.nm-pin { width: 16px; height: 16px; border-radius: 50%; border: 3px solid #FFFEF9; box-shadow: 0 2px 8px rgba(33,20,26,.35); box-sizing: border-box; transform: translate(-50%, -50%); transition: transform .2s; }
.nm-pin.is-active { transform: translate(-50%, -50%) scale(1.5); }
.nm-ring-label { font-family: Nunito, sans-serif; font-size: 11px; font-weight: 700; color: #703C54; background: rgba(255,254,249,.85); padding: 1px 5px; border-radius: 2px; white-space: nowrap; transform: translate(-50%, -50%); }
.nm-map .leaflet-popup-content { font-family: Nunito, sans-serif; font-size: 13px; margin: 10px 12px; }
@media (max-width: 900px) {
  .nm { grid-template-columns: 1fr; }
  .nm-list { max-height: none; }
}
`;

export function NeighbourhoodMap({ center, label, pois, language }: NeighbourhoodMapProps) {
  const lang = langOf(language);
  const ui = UI[lang];
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const [filter, setFilter] = useState<PoiCategory | "all">("all");
  const [active, setActive] = useState<string | null>(null);

  const items = useMemo(
    () =>
      pois
        .map((p) => {
          const meters = distanceMeters(center, p);
          return { ...p, meters, time: travelTime(meters) };
        })
        .sort((a, b) => a.meters - b.meters),
    [pois, center],
  );
  const categories = useMemo(() => Array.from(new Set(items.map((p) => p.category))), [items]);
  const visible = items.filter((p) => filter === "all" || p.category === filter);

  const fmtDist = (m: number) =>
    m < 1000 ? `${Math.round(m / 10) * 10} ${ui.m}` : `${(m / 1000).toFixed(1)} ${ui.km}`;

  // Build the map once (Leaflet is loaded lazily so it stays out of the main bundle).
  useEffect(() => {
    let cancelled = false;
    const markers = markersRef.current;
    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return;
      const map = L.map(containerRef.current, {
        center: [center.lat, center.lng],
        zoom: 14,
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true,
      });
      mapRef.current = map;
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        subdomains: "abcd",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }).addTo(map);

      for (const [radius, text] of [
        [1000, `1 ${UI[lang].km}`],
        [2000, `2 ${UI[lang].km}`],
      ] as const) {
        L.circle([center.lat, center.lng], {
          radius,
          color: "#703C54",
          weight: 1.5,
          opacity: 0.55,
          dashArray: "5 7",
          fillColor: "#703C54",
          fillOpacity: radius === 1000 ? 0.06 : 0.025,
          interactive: false,
        }).addTo(map);
        // label on the ring, straight north of the centre
        const north = center.lat + radius / 111320;
        L.marker([north, center.lng], {
          interactive: false,
          icon: L.divIcon({ className: "", html: `<span class="nm-ring-label">${text}</span>`, iconSize: [0, 0] }),
        }).addTo(map);
      }

      L.marker([center.lat, center.lng], {
        zIndexOffset: 1000,
        icon: L.divIcon({ className: "", html: `<span class="nm-home">● ${label}</span>`, iconSize: [0, 0] }),
      }).addTo(map);

      for (const p of items) {
        const m = L.marker([p.lat, p.lng], {
          icon: L.divIcon({
            className: "",
            html: `<span class="nm-pin" style="background:${COLORS[p.category]}"></span>`,
            iconSize: [0, 0],
          }),
        })
          .bindPopup(
            `<b>${p.name[lang]}</b><br>${fmtDist(p.meters)} · ${p.time.minutes} ${
              p.time.mode === "walk" ? UI[lang].walk : UI[lang].drive
            }`,
            { closeButton: false, offset: [0, -6] },
          )
          .addTo(map);
        m.on("click", () => setActive(p.id));
        markers.set(p.id, m);
      }

      // Fit the nearby places (within 3 km) plus the building.
      const near = items.filter((p) => p.meters < 3000);
      if (near.length) {
        map.fitBounds(
          L.latLngBounds([[center.lat, center.lng], ...near.map((p) => [p.lat, p.lng] as [number, number])]),
          { padding: [36, 36] },
        );
      }
    });
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markers.clear();
    };
    // Rebuild when the language changes so popups are localised.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // Show / hide markers for the selected category.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    for (const p of items) {
      const m = markersRef.current.get(p.id);
      if (!m) continue;
      const show = filter === "all" || p.category === filter;
      if (show && !map.hasLayer(m)) m.addTo(map);
      if (!show && map.hasLayer(m)) m.remove();
    }
  }, [filter, items]);

  // Highlight the active place.
  useEffect(() => {
    markersRef.current.forEach((m, id) => {
      const el = m.getElement()?.querySelector(".nm-pin");
      el?.classList.toggle("is-active", id === active);
    });
  }, [active]);

  const focus = (p: (typeof items)[number]) => {
    setActive(p.id);
    const map = mapRef.current;
    const m = markersRef.current.get(p.id);
    if (!map || !m) return;
    map.flyTo([p.lat, p.lng], p.meters > 3000 ? 12 : 16, { duration: 0.8 });
    m.openPopup();
  };

  return (
    <div className="nm">
      <style>{CSS}</style>
      <div className="nm-map" ref={containerRef} />
      <div className="nm-side">
        <div className="nm-chips" role="tablist">
          <button type="button" className={`nm-chip${filter === "all" ? " is-on" : ""}`} onClick={() => setFilter("all")}>
            {ui.all}
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={`nm-chip${filter === c ? " is-on" : ""}`}
              onClick={() => setFilter(c)}
            >
              <span className="nm-dot" style={{ background: COLORS[c] }} />
              {CATEGORY_LABELS[c][lang]}
            </button>
          ))}
        </div>
        <ul className="nm-list">
          {visible.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className={`nm-item${active === p.id ? " is-active" : ""}`}
                onClick={() => focus(p)}
              >
                <span className="nm-dot" style={{ background: COLORS[p.category] }} />
                <span>
                  <span className="nm-item-name">{p.name[lang]}</span>
                  <br />
                  <span className="nm-item-cat">{CATEGORY_LABELS[p.category][lang]}</span>
                </span>
                <span className="nm-item-dist">
                  <b>
                    {p.time.minutes} {p.time.mode === "walk" ? ui.walk : ui.drive}
                  </b>
                  {fmtDist(p.meters)}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="nm-hint">{ui.hint}</p>
      </div>
    </div>
  );
}
