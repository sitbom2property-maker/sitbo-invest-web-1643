import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as MlMap, Marker, Popup } from "maplibre-gl";
import type { Poi, PoiCategory } from "../data/projects";

type Lang = "en" | "ru" | "ka";
type Names = Record<Lang, string>;

/** A building drawn in 3D on the map (e.g. towers that are not in OpenStreetMap yet). */
export type MapTower = {
  /** Footprint centre. */
  lat: number;
  lng: number;
  /** Semi-axes in metres (east-west and north-south before rotation). */
  rx: number;
  ry: number;
  /** Rotation of the footprint, degrees counter-clockwise from east. */
  rotation: number;
  height: number;
  /** "ellipse" or a rounded rectangle. */
  shape: "ellipse" | "rect";
};

export type NeighbourhoodMapProps = {
  center: { lat: number; lng: number };
  label: string;
  pois: Poi[];
  language: string;
  towers?: MapTower[];
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

const UI: Record<
  Lang,
  { all: string; walk: string; drive: string; km: string; m: string; hint: string; view3d: string; view2d: string; schematic: string }
> = {
  en: {
    all: "All", walk: "min walk", drive: "min drive", km: "km", m: "m",
    hint: "Tap a place to see it on the map. Drag with two fingers or right-click to tilt and rotate.",
    view3d: "3D", view2d: "2D", schematic: "HISNI towers: footprints and heights from the developer's site plan",
  },
  ru: {
    all: "Все", walk: "мин пешком", drive: "мин на машине", km: "км", m: "м",
    hint: "Нажмите на место, чтобы увидеть его на карте. Наклон и поворот — двумя пальцами или правой кнопкой мыши.",
    view3d: "3D", view2d: "2D", schematic: "Башни HISNI: контуры и высоты по генплану застройщика",
  },
  ka: {
    all: "ყველა", walk: "წთ ფეხით", drive: "წთ მანქანით", km: "კმ", m: "მ",
    hint: "შეეხეთ ადგილს, რომ რუკაზე ნახოთ. დახრა და შემობრუნება — ორი თითით ან მაუსის მარჯვენა ღილაკით.",
    view3d: "3D", view2d: "2D", schematic: "HISNI-ის კოშკები: კონტურები და სიმაღლეები დეველოპერის გენგეგმით",
  },
};

/** OpenFreeMap "dark" style (no API key), restyled for an evening look in applyEveningStyle. */
export const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/dark";

/** Evening palette + 3D city buildings from OpenStreetMap heights (the dark style ships them flat). */
export function applyEveningStyle(map: MlMap): void {
  const paint = (layer: string, prop: string, value: unknown) => {
    if (map.getLayer(layer)) map.setPaintProperty(layer, prop as never, value as never);
  };
  paint("background", "background-color", "#16111A");
  paint("water", "fill-color", "#1A2430");
  paint("landuse_park", "fill-color", "#1C2620");
  paint("landcover_wood", "fill-color", "#1A231D");
  paint("landuse_residential", "fill-color", "#1B1619");
  if (map.getSource("openmaptiles") && !map.getLayer("city-3d")) {
    map.addLayer(
      {
        id: "city-3d",
        type: "fill-extrusion",
        source: "openmaptiles",
        "source-layer": "building",
        minzoom: 13,
        filter: ["match", ["geometry-type"], ["MultiPolygon", "Polygon"], true, false],
        paint: {
          "fill-extrusion-color": [
            "interpolate", ["linear"], ["coalesce", ["get", "render_height"], 6],
            0, "#2A2326", 30, "#352B2C", 80, "#43363A",
          ],
          "fill-extrusion-height": ["coalesce", ["get", "render_height"], 6],
          "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
          "fill-extrusion-opacity": 0.92,
        },
      },
      map.getLayer("aeroway-taxiway") ? "aeroway-taxiway" : undefined,
    );
  }
}

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

/** Closed ring of [lng, lat] points approximating a circle of `radius` metres. */
export function circleRing(center: { lat: number; lng: number }, radius: number, steps = 64): [number, number][] {
  const latDeg = radius / 111320;
  const lngDeg = radius / (111320 * Math.cos((center.lat * Math.PI) / 180));
  const ring: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * 2 * Math.PI;
    ring.push([center.lng + lngDeg * Math.cos(t), center.lat + latDeg * Math.sin(t)]);
  }
  return ring;
}

/** Closed [lng, lat] ring for a tower footprint: rotated ellipse or rounded rectangle (superellipse). */
export function towerRing(t: MapTower, steps = 72, scale = 1): [number, number][] {
  const rot = (t.rotation * Math.PI) / 180;
  const mLat = 1 / 111320;
  const mLng = 1 / (111320 * Math.cos((t.lat * Math.PI) / 180));
  const ring: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * 2 * Math.PI;
    let x = Math.cos(a);
    let y = Math.sin(a);
    if (t.shape === "rect") {
      // |x|^4 + |y|^4 = 1 — a square with rounded corners
      x = Math.sign(x) * Math.sqrt(Math.abs(x));
      y = Math.sign(y) * Math.sqrt(Math.abs(y));
    }
    const ex = x * t.rx * scale;
    const ny = y * t.ry * scale;
    const e = ex * Math.cos(rot) - ny * Math.sin(rot);
    const n = ex * Math.sin(rot) + ny * Math.cos(rot);
    ring.push([t.lng + e * mLng, t.lat + n * mLat]);
  }
  return ring;
}

const PODIUM_HEIGHT = 12;
const FLOOR_HEIGHT = 3.4;
const SLAB = 0.4;
const WINDOW_SECTORS = 18;
/** Dark bronze glazing and warm lit windows — the dusk look of the developer's renders. */
const GLASS_DARK = ["#2F2622", "#3A2E27", "#33291F"];
const GLASS_LIT = ["#E9B566", "#F2C77A", "#D99A4E", "#F6D594"];
const SLAB_COLOR = "#EFE8DC";
const ROOF_COLOR = "#4B4744";

type TowerFeature = {
  type: "Feature";
  properties: { base: number; top: number; color: string };
  geometry: { type: "Polygon"; coordinates: [number, number][][] };
};

/** Small deterministic pseudo-random number in [0, 1) so the lit windows stay put. */
function hash01(a: number, b: number, c: number): number {
  let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/**
 * Builds a tower floor by floor: a light podium, thin pale slabs, and dark bronze glazing
 * split into window sectors of which roughly a third are lit — close to the night renders.
 */
export function towerFeatures(t: MapTower, index = 0): TowerFeature[] {
  const out: TowerFeature[] = [];
  const poly = (ring: [number, number][], base: number, top: number, color: string) =>
    out.push({ type: "Feature", properties: { base, top, color }, geometry: { type: "Polygon", coordinates: [ring] } });

  const steps = WINDOW_SECTORS * 4;
  const glassRing = towerRing(t, steps, 0.95);
  const centre: [number, number] = [t.lng, t.lat];

  poly(towerRing(t, 56, 1.3), 0, PODIUM_HEIGHT, "#F1ECE3");
  const floors = Math.max(1, Math.round((t.height - PODIUM_HEIGHT) / FLOOR_HEIGHT));
  const fh = (t.height - PODIUM_HEIGHT) / floors;
  for (let f = 0; f < floors; f++) {
    const base = PODIUM_HEIGHT + f * fh;
    poly(towerRing(t, 56, 1.04), base, base + SLAB, SLAB_COLOR);
    // Window sectors: wedges from the centre, so only their outer arc shows on the façade.
    for (let k = 0; k < WINDOW_SECTORS; k++) {
      const arc = glassRing.slice(k * 4, k * 4 + 5);
      const r = hash01(index + 1, f + 1, k + 1);
      const lit = r < 0.36;
      const palette = lit ? GLASS_LIT : GLASS_DARK;
      const color = palette[Math.floor(hash01(k + 7, f + 3, index + 11) * palette.length)];
      poly([centre, ...arc, centre], base + SLAB, base + fh, color);
    }
  }
  // Roof slab, parapet line and a rooftop plant room.
  poly(towerRing(t, 56, 1.0), t.height, t.height + 0.8, ROOF_COLOR);
  poly(towerRing(t, 56, 1.03), t.height + 0.8, t.height + 1.3, SLAB_COLOR);
  poly(
    towerRing({ ...t, rx: Math.min(t.rx, t.ry) * 0.42, ry: Math.min(t.rx, t.ry) * 0.3, shape: "rect" }, 24, 1),
    t.height + 0.8,
    t.height + 4.2,
    "#5A5552",
  );
  return out;
}

/** Adds the detailed towers as one fill-extrusion layer. */
export function addTowerLayer(map: MlMap, id: string, towers: MapTower[], minzoom = 0): void {
  if (!towers.length) return;
  map.addSource(id, {
    type: "geojson",
    data: { type: "FeatureCollection", features: towers.flatMap((tw, n) => towerFeatures(tw, n)) },
  });
  map.addLayer({
    id,
    type: "fill-extrusion",
    source: id,
    minzoom,
    paint: {
      "fill-extrusion-color": ["get", "color"],
      "fill-extrusion-base": ["get", "base"],
      "fill-extrusion-height": ["get", "top"],
      "fill-extrusion-opacity": 1,
      "fill-extrusion-vertical-gradient": true,
    },
  });
  map.setLight({ anchor: "viewport", color: "#fff4e6", intensity: 0.32, position: [1.3, 200, 30] });
}

const CSS = `
.nm { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(260px, 0.9fr); gap: 16px; }
.nm-map-wrap { position: relative; }
.nm-map { position: relative; height: clamp(380px, 48vw, 600px); border-radius: 2px; overflow: hidden; background: #16111A; }
.nm-map .maplibregl-canvas { outline: none; }
.nm-toggle {
  position: absolute; top: 12px; left: 12px; z-index: 2; display: inline-flex; border-radius: 2px; overflow: hidden;
  box-shadow: 0 2px 10px rgba(33,20,26,.18); font-family: Nunito, sans-serif;
}
.nm-toggle button { border: none; padding: 8px 14px; font-size: 13px; font-weight: 700; cursor: pointer; background: #FFFEF9; color: #21141A; }
.nm-toggle button.is-on { background: #21141A; color: #FFFEF9; }
.nm-note { position: absolute; left: 12px; bottom: 10px; z-index: 2; font-family: Nunito, sans-serif; font-size: 11px; color: #21141A; background: rgba(255,254,249,.85); padding: 3px 8px; border-radius: 2px; }
.nm-side { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.nm-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.nm-chip {
  display: inline-flex; align-items: center; gap: 7px; padding: 7px 12px; border-radius: 999px;
  border: 1px solid rgba(33,20,26,0.15); background: #FFFEF9; color: #21141A;
  font-family: Nunito, sans-serif; font-size: 13px; cursor: pointer; transition: background .2s, border-color .2s;
}
.nm-chip.is-on { background: #21141A; color: #FFFEF9; border-color: #21141A; }
.nm-dot { display: inline-block; width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.nm-list { list-style: none; margin: 0; padding: 0; max-height: clamp(280px, 38vw, 510px); overflow-y: auto; border-top: 1px solid rgba(33,20,26,0.1); }
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
  display: inline-flex; align-items: center; gap: 6px;
  background: #703C54; color: #FFFEF9; padding: 7px 12px; border-radius: 2px; white-space: nowrap;
  font-family: Nunito, sans-serif; font-size: 13px; font-weight: 700; letter-spacing: .06em;
  box-shadow: 0 8px 24px rgba(33,20,26,.35); position: relative; margin-bottom: 8px;
}
.nm-home::after {
  content: ""; position: absolute; left: 50%; bottom: -6px; transform: translateX(-50%);
  border: 6px solid transparent; border-top-color: #703C54; border-bottom: 0;
}
.nm-pin { display: block; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #FFFEF9; box-shadow: 0 2px 8px rgba(33,20,26,.35); box-sizing: border-box; cursor: pointer; transition: box-shadow .2s; }
/* MapLibre positions markers with transform, so highlight with a ring instead of scaling. */
.nm-pin.is-active { box-shadow: 0 0 0 5px rgba(112,60,84,.35), 0 2px 8px rgba(33,20,26,.35); }
.nm-map .maplibregl-popup-content { font-family: Nunito, sans-serif; font-size: 13px; padding: 10px 12px; border-radius: 2px; }
@media (max-width: 900px) {
  .nm { grid-template-columns: 1fr; }
  .nm-list { max-height: none; }
}
`;

export function NeighbourhoodMap({ center, label, pois, language, towers = [] }: NeighbourhoodMapProps) {
  const lang = langOf(language);
  const ui = UI[lang];
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  const markersRef = useRef<Map<string, { marker: Marker; popup: Popup; el: HTMLElement }>>(new Map());
  const [filter, setFilter] = useState<PoiCategory | "all">("all");
  const [active, setActive] = useState<string | null>(null);
  const [is3d, setIs3d] = useState(true);

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

  const fmtDist = (m: number, l: Lang = lang) =>
    m < 1000 ? `${Math.round(m / 10) * 10} ${UI[l].m}` : `${(m / 1000).toFixed(1)} ${UI[l].km}`;

  // Build the map once per language (MapLibre is loaded lazily so it stays out of the main bundle).
  useEffect(() => {
    let cancelled = false;
    const markers = markersRef.current;
    Promise.all([import("maplibre-gl"), import("maplibre-gl/dist/maplibre-gl.css")]).then(([mod]) => {
      const maplibregl = mod.default ?? mod;
      if (cancelled || !containerRef.current || mapRef.current) return;
      const map = new maplibregl.Map({
        container: containerRef.current,
        style: MAP_STYLE_URL,
        center: [center.lng, center.lat],
        zoom: 15.4,
        pitch: 58,
        bearing: -24,
        maxPitch: 75,
        attributionControl: { compact: true },
        cooperativeGestures: false,
      });
      mapRef.current = map;
      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");

      map.on("load", () => {
        applyEveningStyle(map);

        map.addSource("nm-rings", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [1000, 2000].map((r) => ({
              type: "Feature",
              properties: { r },
              geometry: { type: "Polygon", coordinates: [circleRing(center, r)] },
            })),
          },
        });
        map.addLayer({
          id: "nm-rings-fill",
          type: "fill",
          source: "nm-rings",
          paint: { "fill-color": "#C98BA6", "fill-opacity": ["case", ["==", ["get", "r"], 1000], 0.1, 0.04] },
        });
        map.addLayer({
          id: "nm-rings-line",
          type: "line",
          source: "nm-rings",
          paint: { "line-color": "#E3B7C9", "line-opacity": 0.7, "line-width": 1.5, "line-dasharray": [3, 4] },
        });

        addTowerLayer(map, "nm-towers", towers);

        // Fit nearby places (within 3 km) plus the building, keeping the tilt.
        const near = items.filter((p) => p.meters < 3000);
        if (near.length) {
          const bounds = new maplibregl.LngLatBounds([center.lng, center.lat], [center.lng, center.lat]);
          near.forEach((p) => bounds.extend([p.lng, p.lat]));
          map.fitBounds(bounds, { padding: 50, pitch: 50, bearing: -24, duration: 0, maxZoom: 15.4 });
        }
      });

      const home = document.createElement("div");
      home.innerHTML = `<span class="nm-home">● ${label}</span>`;
      new maplibregl.Marker({ element: home, anchor: "bottom" }).setLngLat([center.lng, center.lat]).addTo(map);

      for (const p of items) {
        const el = document.createElement("span");
        el.className = "nm-pin";
        el.style.background = COLORS[p.category];
        const popup = new maplibregl.Popup({ closeButton: false, offset: 12 }).setHTML(
          `<b>${p.name[lang]}</b><br>${fmtDist(p.meters, lang)} · ${p.time.minutes} ${
            p.time.mode === "walk" ? UI[lang].walk : UI[lang].drive
          }`,
        );
        const marker = new maplibregl.Marker({ element: el }).setLngLat([p.lng, p.lat]).setPopup(popup).addTo(map);
        el.addEventListener("click", () => setActive(p.id));
        markers.set(p.id, { marker, popup, el });
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
    for (const p of items) {
      const m = markersRef.current.get(p.id);
      if (m) m.el.style.display = filter === "all" || p.category === filter ? "" : "none";
    }
  }, [filter, items]);

  // Highlight the active place.
  useEffect(() => {
    markersRef.current.forEach((m, id) => m.el.classList.toggle("is-active", id === active));
  }, [active]);

  // 2D / 3D view.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.easeTo({ pitch: is3d ? 55 : 0, bearing: is3d ? -24 : 0, duration: 700 });
  }, [is3d]);

  const focus = (p: (typeof items)[number]) => {
    setActive(p.id);
    const map = mapRef.current;
    const m = markersRef.current.get(p.id);
    if (!map || !m) return;
    map.flyTo({ center: [p.lng, p.lat], zoom: p.meters > 3000 ? 12 : 16, duration: 900 });
    markersRef.current.forEach((other) => other.popup.isOpen() && other.popup.remove());
    m.marker.togglePopup();
  };

  return (
    <div className="nm">
      <style>{CSS}</style>
      <div className="nm-map-wrap">
        <div className="nm-map" ref={containerRef} />
        <div className="nm-toggle" role="group">
          <button type="button" className={is3d ? "is-on" : ""} onClick={() => setIs3d(true)}>
            {ui.view3d}
          </button>
          <button type="button" className={is3d ? "" : "is-on"} onClick={() => setIs3d(false)}>
            {ui.view2d}
          </button>
        </div>
        {towers.length ? <span className="nm-note">{ui.schematic}</span> : null}
      </div>
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
