import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import type { Map as MlMap, Marker, Popup } from "maplibre-gl";
import { projects, catalogListedProjects, type Project } from "../data/projects";
import { localizeCityLabel, localizeProjects } from "../data/projects-locale";
import { useRates } from "../context/RatesContext";
import { useLocale } from "../context/LocaleContext";
import { useT } from "../i18n";
import { MAP_STYLE_URL, addTowerLayer, applyEveningStyle } from "./NeighbourhoodMap";

const C = {
  dark: "#21141A",
  wine: "#703C54",
  light: "#FFFEF9",
  muted: "rgba(33,20,26,0.55)",
  line: "rgba(33,20,26,0.12)",
};

const CSS = `
.pm { background: ${C.light}; scroll-margin-top: 80px; }
.pm-head { padding: clamp(32px, 4vw, 56px) 0 clamp(20px, 2.4vw, 28px); }
.pm-head h2 { font-family: JUN, Georgia, serif; font-weight: 400; font-size: clamp(1.8rem, 3.2vw, 2.6rem); line-height: 1.15; margin: 0 0 10px; color: ${C.dark}; }
.pm-head p { font-family: Nunito, sans-serif; font-size: clamp(0.95rem, 1.2vw, 1.05rem); color: ${C.muted}; margin: 0; max-width: 640px; line-height: 1.6; }
.pm-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }
.pm-chip { font-family: Nunito, sans-serif; font-size: 13px; padding: 7px 14px; border-radius: 999px; border: 1px solid ${C.line}; background: ${C.light}; color: ${C.dark}; cursor: pointer; }
.pm-chip.is-on { background: ${C.dark}; color: ${C.light}; border-color: ${C.dark}; }
.pm-body { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 380px); gap: 16px; padding-bottom: clamp(48px, 6vw, 80px); }
.pm-body > * { min-width: 0; }
.pm-map-wrap { position: relative; }
.pm-map { position: relative; height: clamp(520px, calc(100vh - 220px), 860px); border-radius: 2px; overflow: hidden; background: #16111A; }
.pm-toggle { position: absolute; top: 12px; left: 12px; z-index: 2; display: inline-flex; border-radius: 2px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,.3); font-family: Nunito, sans-serif; }
.pm-toggle button { border: none; padding: 8px 14px; font-size: 13px; font-weight: 700; cursor: pointer; background: ${C.light}; color: ${C.dark}; }
.pm-toggle button.is-on { background: ${C.wine}; color: ${C.light}; }
.pm-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; max-height: clamp(520px, calc(100vh - 220px), 860px); overflow-y: auto; }
.pm-card { display: grid; grid-template-columns: 112px minmax(0, 1fr); gap: 14px; width: 100%; padding: 10px; border: 1px solid ${C.line}; border-radius: 2px; background: ${C.light}; text-align: left; cursor: pointer; font-family: Nunito, sans-serif; color: ${C.dark}; transition: border-color .2s, box-shadow .2s; }
.pm-card:hover, .pm-card.is-active { border-color: ${C.wine}; box-shadow: 0 6px 20px rgba(33,20,26,.08); }
.pm-card img { width: 112px; height: 84px; object-fit: cover; border-radius: 2px; display: block; }
.pm-card-name { font-family: JUN, Georgia, serif; font-size: 1.1rem; margin: 0 0 4px; line-height: 1.2; }
.pm-card-meta { font-size: 12px; color: ${C.muted}; margin: 0 0 6px; }
.pm-card-price { font-size: 15px; font-weight: 700; margin: 0; }
.pm-badge { display: inline-block; margin-left: 6px; font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; background: ${C.wine}; color: ${C.light}; padding: 2px 6px; border-radius: 2px; vertical-align: middle; }
.pm-marker { display: flex; align-items: center; gap: 8px; padding: 4px 10px 4px 4px; background: ${C.light}; border-radius: 999px; box-shadow: 0 6px 18px rgba(33,20,26,.28); cursor: pointer; font-family: Nunito, sans-serif; white-space: nowrap; width: max-content; transition: background .2s; margin-bottom: 8px; }
.pm-marker::after { content: ""; position: absolute; left: 50%; bottom: -6px; transform: translateX(-50%); border: 6px solid transparent; border-top-color: ${C.light}; border-bottom: 0; }
.pm-marker img { width: 34px; height: 34px; border-radius: 50%; object-fit: cover; display: block; }
.pm-marker b { display: block; font-size: 12px; color: ${C.dark}; line-height: 1.15; }
.pm-marker span { display: block; font-size: 11px; color: ${C.wine}; font-weight: 700; line-height: 1.15; }
.pm-marker.is-active { background: ${C.wine}; z-index: 5; }
.pm-marker.is-active::after { border-top-color: ${C.wine}; }
.pm-marker.is-active b, .pm-marker.is-active span { color: ${C.light}; }
.pm-pop { font-family: Nunito, sans-serif; width: 240px; }
.pm-pop img { width: 100%; height: 130px; object-fit: cover; display: block; border-radius: 2px; margin-bottom: 10px; }
.pm-pop h3 { font-family: JUN, Georgia, serif; font-weight: 400; font-size: 1.15rem; margin: 0 0 4px; color: ${C.dark}; }
.pm-pop p { margin: 0 0 4px; font-size: 12px; color: ${C.muted}; }
.pm-pop strong { display: block; font-size: 15px; color: ${C.dark}; margin: 6px 0 10px; }
.pm-pop a { display: block; text-align: center; background: ${C.wine}; color: ${C.light}; text-decoration: none; padding: 10px; border-radius: 2px; font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.pm-map .maplibregl-popup-content { padding: 10px; border-radius: 2px; }
@media (max-width: 960px) {
  .pm-body { grid-template-columns: 1fr; }
  .pm-map { height: 70vh; }
  .pm-list { max-height: none; }
}
`;

type Item = Project & { priceLabel: string };

function escapeHtml(v: string): string {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** All catalogue projects on one evening 3D map, with a side list. Shown on the catalogue page (#map). */
export function ProjectsMap() {
  const t = useT();
  const { language } = useLocale();
  const { formatFromUSD } = useRates();
  const [, navigate] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  const markersRef = useRef<Map<string, { marker: Marker; popup: Popup; el: HTMLElement }>>(new Map());
  const [city, setCity] = useState<string>("All");
  const [active, setActive] = useState<string | null>(null);
  const [is3d, setIs3d] = useState(true);
  // Load MapLibre only when the block comes near the viewport.
  const [inView, setInView] = useState(false);

  const items: Item[] = useMemo(
    () =>
      localizeProjects(catalogListedProjects(projects), language).map((p) => ({
        ...p,
        priceLabel: p.priceUSD ? formatFromUSD(p.priceUSD, { prefix: t("cta.from") }) : p.priceFrom,
      })),
    [language, formatFromUSD, t],
  );
  const cities = useMemo(() => Array.from(new Set(items.map((p) => p.city))), [items]);
  const visible = items.filter((p) => city === "All" || p.city === city);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || inView) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setInView(true);
        io.disconnect();
      }
    }, { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [inView]);

  // Build the map (MapLibre is loaded lazily, shared chunk with the project page map).
  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    const markers = markersRef.current;
    Promise.all([import("maplibre-gl"), import("maplibre-gl/dist/maplibre-gl.css")]).then(([mod]) => {
      const maplibregl = mod.default ?? mod;
      if (cancelled || !containerRef.current || mapRef.current) return;
      const map = new maplibregl.Map({
        container: containerRef.current,
        style: MAP_STYLE_URL,
        center: [43.2, 41.7],
        zoom: 7.2,
        pitch: 45,
        maxPitch: 75,
        attributionControl: { compact: true },
      });
      mapRef.current = map;
      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");

      map.on("load", () => {
        applyEveningStyle(map);
        addTowerLayer(map, "pm-towers", items.flatMap((p) => p.mapTowers ?? []), 13);
        const bounds = new maplibregl.LngLatBounds();
        items.forEach((p) => bounds.extend([p.lng, p.lat]));
        if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: { top: 70, bottom: 40, left: 60, right: 60 }, duration: 0, maxZoom: 13, pitch: 45 });
      });

      for (const p of items) {
        const el = document.createElement("div");
        el.className = "pm-marker";
        el.innerHTML = `<img src="${escapeHtml(p.cardImage)}" alt=""><div><b>${escapeHtml(p.name)}</b><span>${escapeHtml(p.priceLabel)}</span></div>`;
        const pop = document.createElement("div");
        pop.className = "pm-pop";
        pop.innerHTML = `<img src="${escapeHtml(p.cardImage)}" alt="${escapeHtml(p.name)}"><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(
          localizeCityLabel(p.city, language),
        )} · ${escapeHtml(p.completion)}</p>${p.presale ? `<p>${escapeHtml(p.presale)}</p>` : ""}<strong>${escapeHtml(
          p.priceLabel,
        )}</strong><a href="/project/${p.slug}">${escapeHtml(t("map.openProject"))}</a>`;
        // Navigate inside the SPA instead of reloading the page.
        pop.querySelector("a")?.addEventListener("click", (e) => {
          e.preventDefault();
          navigate(`/project/${p.slug}`);
        });
        const popup = new maplibregl.Popup({ closeButton: true, offset: 28, maxWidth: "280px" }).setDOMContent(pop);
        const marker = new maplibregl.Marker({ element: el, anchor: "bottom" }).setLngLat([p.lng, p.lat]).setPopup(popup).addTo(map);
        el.addEventListener("click", () => setActive(p.slug));
        markers.set(p.slug, { marker, popup, el });
      }
    });
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markers.clear();
    };
    // Rebuild when language or currency formatting changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, inView]);

  // City filter: hide other markers and fit the visible ones.
  useEffect(() => {
    const map = mapRef.current;
    for (const p of items) {
      const m = markersRef.current.get(p.slug);
      if (m) m.el.style.display = city === "All" || p.city === city ? "" : "none";
    }
    if (!map || !visible.length) return;
    import("maplibre-gl").then((mod) => {
      const maplibregl = mod.default ?? mod;
      const bounds = new maplibregl.LngLatBounds();
      visible.forEach((p) => bounds.extend([p.lng, p.lat]));
      map.fitBounds(bounds, { padding: 80, maxZoom: 14, pitch: is3d ? 45 : 0, duration: 900 });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  useEffect(() => {
    markersRef.current.forEach((m, slug) => m.el.classList.toggle("is-active", slug === active));
  }, [active]);

  // 2D / 3D view.
  useEffect(() => {
    mapRef.current?.easeTo({ pitch: is3d ? 55 : 0, bearing: is3d ? -20 : 0, duration: 700 });
  }, [is3d]);

  const focus = (p: Item) => {
    setActive(p.slug);
    const map = mapRef.current;
    const m = markersRef.current.get(p.slug);
    if (!map || !m) return;
    markersRef.current.forEach((other) => other.popup.isOpen() && other.popup.remove());
    map.flyTo({ center: [p.lng, p.lat], zoom: 16, pitch: is3d ? 55 : 0, bearing: is3d ? -20 : 0, duration: 1400 });
    map.once("moveend", () => {
      if (!m.popup.isOpen()) m.marker.togglePopup();
    });
  };

  return (
    <section className="pm" id="map">
      <style>{CSS}</style>
      <div className="site-wrap">
        <div className="pm-head">
          <h2>{t("map.title")}</h2>
          <p>{t("map.lead")}</p>
          <div className="pm-chips">
            {["All", ...cities].map((c) => (
              <button key={c} type="button" className={`pm-chip${city === c ? " is-on" : ""}`} onClick={() => setCity(c)}>
                {c === "All" ? t("map.all") : localizeCityLabel(c, language)}
              </button>
            ))}
          </div>
        </div>
        <div className="pm-body">
          <div className="pm-map-wrap">
            <div className="pm-map" ref={containerRef} />
            <div className="pm-toggle" role="group">
              <button type="button" className={is3d ? "is-on" : ""} onClick={() => setIs3d(true)}>3D</button>
              <button type="button" className={is3d ? "" : "is-on"} onClick={() => setIs3d(false)}>2D</button>
            </div>
          </div>
          <ul className="pm-list">
            {visible.map((p) => (
              <li key={p.slug}>
                <button type="button" className={`pm-card${active === p.slug ? " is-active" : ""}`} onClick={() => focus(p)}>
                  <img src={p.cardImage} alt={p.name} loading="lazy" />
                  <span>
                    <p className="pm-card-name">
                      {p.name}
                      {p.presale ? <span className="pm-badge">{p.presale}</span> : null}
                    </p>
                    <p className="pm-card-meta">
                      {localizeCityLabel(p.city, language)} · {p.completion}
                    </p>
                    <p className="pm-card-price">{p.priceLabel}</p>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
