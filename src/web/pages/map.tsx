import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Link } from "wouter";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { projects, type Project } from "../data/projects";
import "leaflet/dist/leaflet.css";

const C = {
  dark: "#21141A",
  teal: "#8CB2C0",
  wine: "#683D47",
  light: "#FFFBF0",
  parchment: "#F5F3ED",
  muted: "#7a7a7a",
};

const CITIES = ["All", "Batumi", "Tbilisi", "Chakvi / Gonio", "Makhinjauri"] as const;
const BATUMI_CENTER: [number, number] = [41.6422, 41.6247];

function useIsMobile(bp = 900) {
  const [m, setM] = useState(() => (typeof window !== "undefined" ? window.innerWidth < bp : false));
  useEffect(() => {
    const h = () => setM(window.innerWidth < bp);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, [bp]);
  return m;
}

function formatPriceLabel(p: Project) {
  if (p.priceUSD >= 1000) {
    const k = Math.round(p.priceUSD / 1000);
    return `from $${k}k`;
  }
  return p.priceFrom.replace(/^From\s+/i, "from ");
}

function createPriceIcon(p: Project, active: boolean) {
  const label = formatPriceLabel(p);
  const bg = active ? C.dark : C.light;
  const fg = active ? C.light : C.dark;
  const border = active ? C.dark : "rgba(33,20,26,0.18)";
  const shadow = active
    ? "0 8px 24px rgba(33,20,26,0.35)"
    : "0 4px 14px rgba(33,20,26,0.14)";

  return L.divIcon({
    className: "sitbo-map-marker",
    html: `<div style="
      transform: translate(-50%, -100%);
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      filter: drop-shadow(${shadow});
    ">
      <div style="
        background: ${bg};
        color: ${fg};
        border: 1px solid ${border};
        border-radius: 999px;
        padding: 7px 12px;
        font-family: 'DM Sans', sans-serif;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.02em;
        white-space: nowrap;
        line-height: 1;
        transition: background 0.2s, color 0.2s;
      ">${label}</div>
      <div style="
        width: 10px;
        height: 10px;
        background: ${bg};
        border: 1px solid ${border};
        transform: rotate(45deg) translateY(-5px);
        margin-top: -1px;
      "></div>
    </div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function FitBounds({ items, selected }: { items: Project[]; selected: string | null }) {
  const map = useMap();
  const lastKey = useRef("");

  useEffect(() => {
    if (!items.length) return;
    const key = items.map((p) => p.slug).join("|") + (selected ?? "");
    if (key === lastKey.current) return;
    lastKey.current = key;

    if (selected) {
      const p = items.find((x) => x.slug === selected);
      if (p) {
        map.flyTo([p.lat, p.lng], Math.max(map.getZoom(), 14), { duration: 0.6 });
        return;
      }
    }

    if (items.length === 1) {
      map.flyTo([items[0].lat, items[0].lng], 14, { duration: 0.55 });
      return;
    }

    const bounds = L.latLngBounds(items.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds.pad(0.18), { animate: true, duration: 0.55, maxZoom: 13 });
  }, [items, selected, map]);

  return null;
}

function SidebarCard({
  p,
  active,
  onSelect,
}: {
  p: Project;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        display: "grid",
        gridTemplateColumns: "112px 1fr",
        gap: "12px",
        width: "100%",
        textAlign: "left",
        padding: "10px",
        borderRadius: "12px",
        border: `1px solid ${active ? C.teal : "rgba(33,20,26,0.08)"}`,
        background: active ? "rgba(140,178,192,0.12)" : C.light,
        cursor: "pointer",
        boxShadow: active ? "0 8px 24px rgba(33,20,26,0.08)" : "none",
        transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
      }}
    >
      <div style={{ position: "relative", height: "88px", borderRadius: "8px", overflow: "hidden" }}>
        <img
          src={p.cardImage}
          alt={p.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div
          style={{
            position: "absolute",
            top: "6px",
            left: "6px",
            background: "rgba(33,20,26,0.7)",
            color: C.light,
            fontFamily: "DM Sans",
            fontSize: "0.55rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "2px 6px",
            borderRadius: "4px",
          }}
        >
          {p.city}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
        <p
          style={{
            fontFamily: "DM Sans",
            fontSize: "0.58rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: C.muted,
            margin: "0 0 4px",
          }}
        >
          {p.tag}
        </p>
        <h3
          style={{
            fontFamily: "Jun, serif",
            fontSize: "1.05rem",
            fontWeight: 500,
            color: C.dark,
            margin: "0 0 6px",
            lineHeight: 1.15,
          }}
        >
          {p.name}
        </h3>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "baseline" }}>
          <span style={{ fontFamily: "Jun, serif", fontSize: "0.98rem", fontWeight: 700, color: C.dark }}>
            {p.priceFrom}
          </span>
          <span style={{ fontFamily: "DM Sans", fontSize: "0.68rem", fontWeight: 700, color: C.wine }}>
            {p.yield} ROI
          </span>
        </div>
        <p style={{ fontFamily: "DM Sans", fontSize: "0.68rem", color: C.muted, margin: "6px 0 0" }}>
          {p.seaDistance}
        </p>
      </div>
    </button>
  );
}

export default function MapPage() {
  const isMobile = useIsMobile();
  const [city, setCity] = useState<(typeof CITIES)[number]>("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered = useMemo(() => {
    let list = [...projects];
    if (city !== "All") list = list.filter((p) => p.city === city);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tag.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q),
      );
    }
    return list;
  }, [city, search]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: projects.length };
    projects.forEach((p) => {
      map[p.city] = (map[p.city] || 0) + 1;
    });
    return map;
  }, []);

  const selectedProject = filtered.find((p) => p.slug === selected) ?? null;

  const selectProject = useCallback(
    (slug: string) => {
      setSelected(slug);
      if (isMobile) setMobileView("map");
      requestAnimationFrame(() => {
        const el = listRef.current?.querySelector(`[data-slug="${slug}"]`);
        el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    },
    [isMobile],
  );

  const mapHeight = isMobile
    ? "calc(100dvh - 80px - 52px)"
    : "calc(100dvh - 80px)";

  const sidebar = (
    <aside
      style={{
        width: isMobile ? "100%" : "400px",
        flexShrink: 0,
        height: isMobile ? mapHeight : "100%",
        background: C.parchment,
        borderRight: isMobile ? "none" : "1px solid rgba(33,20,26,0.08)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid rgba(33,20,26,0.07)", background: C.light }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "12px" }}>
          <div>
            <p
              style={{
                fontFamily: "DM Sans",
                fontSize: "0.6rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: C.muted,
                margin: "0 0 4px",
              }}
            >
              Sitbo projects
            </p>
            <h1 style={{ fontFamily: "Jun, serif", fontSize: "1.55rem", fontWeight: 500, color: C.dark, margin: 0, lineHeight: 1.1 }}>
              Map
            </h1>
          </div>
          <Link href="/catalog">
            <a
              style={{
                fontFamily: "DM Sans",
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: C.dark,
                textDecoration: "none",
                border: "1px solid rgba(33,20,26,0.15)",
                borderRadius: "8px",
                padding: "8px 12px",
                whiteSpace: "nowrap",
              }}
            >
              List view
            </a>
          </Link>
        </div>

        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
          {CITIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setCity(c);
                setSelected(null);
              }}
              style={{
                fontFamily: "DM Sans",
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                padding: "6px 10px",
                borderRadius: "6px",
                cursor: "pointer",
                border: `1px solid ${city === c ? C.teal : "rgba(33,20,26,0.12)"}`,
                background: city === c ? C.teal : "transparent",
                color: city === c ? C.dark : C.muted,
              }}
            >
              {c}
              {counts[c] ? ` (${counts[c]})` : ""}
            </button>
          ))}
        </div>

        <div style={{ position: "relative" }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          >
            <circle cx="6.5" cy="6.5" r="5" stroke={C.muted} strokeWidth="1.4" />
            <path d="M10 10l3.5 3.5" stroke={C.muted} strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              fontFamily: "DM Sans",
              fontSize: "0.82rem",
              color: C.dark,
              background: C.parchment,
              border: "1px solid rgba(33,20,26,0.12)",
              borderRadius: "8px",
              padding: "10px 14px 10px 34px",
              outline: "none",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
        </div>
        <p style={{ fontFamily: "DM Sans", fontSize: "0.72rem", color: C.muted, margin: "10px 0 0" }}>
          {filtered.length} {filtered.length === 1 ? "project" : "projects"} on map
        </p>
      </div>

      <div ref={listRef} style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 16px" }}>
            <p style={{ fontFamily: "Jun, serif", fontSize: "1.4rem", color: C.muted, marginBottom: "8px" }}>No projects found</p>
            <button
              type="button"
              onClick={() => {
                setCity("All");
                setSearch("");
              }}
              style={{
                fontFamily: "DM Sans",
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: C.light,
                background: C.dark,
                border: "none",
                borderRadius: "8px",
                padding: "10px 18px",
                cursor: "pointer",
              }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          filtered.map((p) => (
            <div key={p.slug} data-slug={p.slug}>
              <SidebarCard p={p} active={selected === p.slug} onSelect={() => selectProject(p.slug)} />
              {selected === p.slug && (
                <Link href={`/project/${p.slug}`}>
                  <a
                    style={{
                      display: "block",
                      marginTop: "8px",
                      textAlign: "center",
                      fontFamily: "DM Sans",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      color: C.light,
                      background: C.dark,
                      borderRadius: "8px",
                      padding: "11px 14px",
                    }}
                  >
                    Open project →
                  </a>
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  );

  const mapPane = (
    <div style={{ flex: 1, position: "relative", height: isMobile ? mapHeight : "100%", minWidth: 0 }}>
      <MapContainer
        center={BATUMI_CENTER}
        zoom={12}
        style={{ width: "100%", height: "100%", background: "#d9e2e6" }}
        zoomControl={!isMobile}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · CARTO'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <FitBounds items={filtered} selected={selected} />
        {filtered.map((p) => (
          <Marker
            key={`${p.slug}-${selected === p.slug}`}
            position={[p.lat, p.lng]}
            icon={createPriceIcon(p, selected === p.slug)}
            eventHandlers={{
              click: () => selectProject(p.slug),
            }}
            zIndexOffset={selected === p.slug ? 1000 : 0}
          />
        ))}
      </MapContainer>

      {selectedProject && !isMobile && (
        <div
          style={{
            position: "absolute",
            left: "16px",
            bottom: "16px",
            zIndex: 500,
            width: "min(340px, calc(100% - 32px))",
            background: C.light,
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: "0 16px 40px rgba(33,20,26,0.18)",
            border: "1px solid rgba(33,20,26,0.08)",
          }}
        >
          <div style={{ position: "relative", height: "140px" }}>
            <img
              src={selectedProject.cardImage}
              alt={selectedProject.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close"
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                border: "none",
                background: "rgba(33,20,26,0.65)",
                color: C.light,
                cursor: "pointer",
                fontSize: "16px",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
          <div style={{ padding: "14px 16px 16px" }}>
            <p
              style={{
                fontFamily: "DM Sans",
                fontSize: "0.58rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: C.muted,
                margin: "0 0 4px",
              }}
            >
              {selectedProject.city} · {selectedProject.tag}
            </p>
            <h2 style={{ fontFamily: "Jun, serif", fontSize: "1.25rem", fontWeight: 500, color: C.dark, margin: "0 0 8px" }}>
              {selectedProject.name}
            </h2>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontFamily: "Jun, serif", fontWeight: 700, color: C.dark }}>{selectedProject.priceFrom}</span>
              <span style={{ fontFamily: "DM Sans", fontSize: "0.75rem", fontWeight: 700, color: C.wine }}>
                {selectedProject.yield} ROI
              </span>
            </div>
            <Link href={`/project/${selectedProject.slug}`}>
              <a
                style={{
                  display: "block",
                  textAlign: "center",
                  fontFamily: "DM Sans",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  color: C.light,
                  background: C.dark,
                  borderRadius: "8px",
                  padding: "12px 14px",
                }}
              >
                View details
              </a>
            </Link>
          </div>
        </div>
      )}

      {isMobile && selectedProject && mobileView === "map" && (
        <div
          style={{
            position: "absolute",
            left: "12px",
            right: "12px",
            bottom: "12px",
            zIndex: 500,
            background: C.light,
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: "0 16px 40px rgba(33,20,26,0.22)",
          }}
        >
          <button
            type="button"
            onClick={() => selectProject(selectedProject.slug)}
            style={{
              display: "grid",
              gridTemplateColumns: "96px 1fr",
              gap: "12px",
              width: "100%",
              border: "none",
              background: "transparent",
              padding: "10px",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            <img
              src={selectedProject.cardImage}
              alt=""
              style={{ width: "96px", height: "76px", objectFit: "cover", borderRadius: "8px", display: "block" }}
            />
            <div>
              <h3 style={{ fontFamily: "Jun, serif", fontSize: "1.05rem", margin: "0 0 4px", color: C.dark }}>
                {selectedProject.name}
              </h3>
              <p style={{ fontFamily: "DM Sans", fontSize: "0.78rem", color: C.muted, margin: "0 0 8px" }}>
                {selectedProject.priceFrom} · {selectedProject.yield} ROI
              </p>
              <Link href={`/project/${selectedProject.slug}`}>
                <a
                  style={{
                    fontFamily: "DM Sans",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: C.wine,
                    textDecoration: "none",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Open →
                </a>
              </Link>
            </div>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ background: C.light, height: mapHeight, overflow: "hidden" }}>
      {isMobile && (
        <div
          style={{
            height: "52px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            background: C.light,
            borderBottom: "1px solid rgba(33,20,26,0.08)",
          }}
        >
          {(["map", "list"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setMobileView(v)}
              style={{
                fontFamily: "DM Sans",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "8px 18px",
                borderRadius: "999px",
                border: `1px solid ${mobileView === v ? C.dark : "rgba(33,20,26,0.15)"}`,
                background: mobileView === v ? C.dark : "transparent",
                color: mobileView === v ? C.light : C.dark,
                cursor: "pointer",
              }}
            >
              {v === "map" ? "Map" : "List"}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", height: isMobile ? mapHeight : "100%", overflow: "hidden" }}>
        {(!isMobile || mobileView === "list") && sidebar}
        {(!isMobile || mobileView === "map") && mapPane}
      </div>

      <style>{`
        .sitbo-map-marker { background: transparent !important; border: none !important; }
        .leaflet-container { font-family: 'DM Sans', sans-serif; }
        .leaflet-control-attribution { font-size: 10px; }
      `}</style>
    </div>
  );
}
