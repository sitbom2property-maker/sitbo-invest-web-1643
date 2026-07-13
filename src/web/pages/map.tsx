import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Link } from "wouter";
import { projects, type Project } from "../data/projects";
import { NAV_HEIGHT } from "../components/nav";
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

function formatPriceLabel(p: Project) {
  if (p.priceUSD >= 1000) return `from $${Math.round(p.priceUSD / 1000)}k`;
  return p.priceFrom.replace(/^From\s+/i, "from ");
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
      }}
    >
      <div style={{ position: "relative", height: "88px", borderRadius: "8px", overflow: "hidden" }}>
        <img src={p.cardImage} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
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
        <p style={{ fontFamily: "DM Sans", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted, margin: "0 0 4px" }}>
          {p.tag}
        </p>
        <h3 style={{ fontFamily: "Jun, serif", fontSize: "1.05rem", fontWeight: 500, color: C.dark, margin: "0 0 6px", lineHeight: 1.15 }}>
          {p.name}
        </h3>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "baseline" }}>
          <span style={{ fontFamily: "Jun, serif", fontSize: "0.98rem", fontWeight: 700, color: C.dark }}>{p.priceFrom}</span>
          <span style={{ fontFamily: "DM Sans", fontSize: "0.68rem", fontWeight: 700, color: C.wine }}>{p.yield} ROI</span>
        </div>
        <p style={{ fontFamily: "DM Sans", fontSize: "0.68rem", color: C.muted, margin: "6px 0 0" }}>{p.seaDistance}</p>
      </div>
    </button>
  );
}

export default function MapPage() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [shellH, setShellH] = useState(640);
  const [city, setCity] = useState<(typeof CITIES)[number]>("Batumi");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const [mapError, setMapError] = useState("");
  const [mapReady, setMapReady] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markersRef = useRef<import("leaflet").Marker[]>([]);
  const LRef = useRef<typeof import("leaflet") | null>(null);

  useEffect(() => {
    setMounted(true);
    const sync = () => {
      setIsMobile(window.innerWidth < 900);
      setShellH(Math.max(420, window.innerHeight - NAV_HEIGHT));
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
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
  const showSidebar = !isMobile || mobileView === "list";
  const showMap = !isMobile || mobileView === "map";

  const selectProject = useCallback(
    (slug: string) => {
      setSelected(slug);
      if (window.innerWidth < 900) setMobileView("map");
      requestAnimationFrame(() => {
        listRef.current?.querySelector(`[data-slug="${slug}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    },
    [],
  );

  // Init Leaflet once (client-only, dynamic import — avoids blank crash)
  useEffect(() => {
    if (!mounted || !showMap || !mapElRef.current || mapRef.current) return;

    let cancelled = false;

    (async () => {
      try {
        const leafletMod = await import("leaflet");
        if (cancelled || !mapElRef.current) return;

        const L = leafletMod.default ?? leafletMod;
        LRef.current = L as typeof import("leaflet");

        const map = L.map(mapElRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
        }).setView(BATUMI_CENTER, 12);

        L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · CARTO',
          maxZoom: 19,
          subdomains: "abcd",
        }).addTo(map);

        // OSM fallback if CARTO tiles fail to paint
        setTimeout(() => {
          if (cancelled || !mapRef.current) return;
          const tiles = mapElRef.current?.querySelectorAll(".leaflet-tile-loaded");
          if (!tiles || tiles.length === 0) {
            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
              maxZoom: 19,
            }).addTo(map);
          }
        }, 2500);

        mapRef.current = map;
        setMapReady(true);
        setTimeout(() => map.invalidateSize(), 50);
        setTimeout(() => map.invalidateSize(), 300);
      } catch (err) {
        console.error(err);
        setMapError("Map failed to load. Use the list or open Catalog.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mounted, showMap]);

  // Destroy map when leaving map pane on mobile
  useEffect(() => {
    if (showMap) return;
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      markersRef.current = [];
      setMapReady(false);
    }
  }, [showMap]);

  // Sync markers + bounds
  useEffect(() => {
    const map = mapRef.current;
    const L = LRef.current;
    if (!map || !L || !mapReady) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    filtered.forEach((p) => {
      const active = selected === p.slug;
      const bg = active ? C.dark : C.light;
      const fg = active ? C.light : C.dark;
      const border = active ? C.dark : "rgba(33,20,26,0.18)";
      const label = formatPriceLabel(p);

      const icon = L.divIcon({
        className: "sitbo-map-marker",
        html: `<div style="transform:translate(-50%,-100%);display:inline-flex;flex-direction:column;align-items:center;cursor:pointer;filter:drop-shadow(0 4px 14px rgba(33,20,26,0.18))">
          <div style="background:${bg};color:${fg};border:1px solid ${border};border-radius:999px;padding:7px 12px;font-family:DM Sans,sans-serif;font-size:12px;font-weight:700;white-space:nowrap;line-height:1">${label}</div>
          <div style="width:10px;height:10px;background:${bg};border:1px solid ${border};transform:rotate(45deg) translateY(-5px);margin-top:-1px"></div>
        </div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([p.lat, p.lng], {
        icon,
        zIndexOffset: active ? 1000 : 0,
      })
        .addTo(map)
        .on("click", () => selectProject(p.slug));

      markersRef.current.push(marker);
    });

    map.invalidateSize();

    if (selected) {
      const p = filtered.find((x) => x.slug === selected);
      if (p) {
        map.flyTo([p.lat, p.lng], Math.max(map.getZoom(), 14), { duration: 0.55 });
        return;
      }
    }

    if (filtered.length === 1) {
      map.setView([filtered[0].lat, filtered[0].lng], 14);
      return;
    }

    if (filtered.length > 1) {
      const bounds = L.latLngBounds(filtered.map((p) => [p.lat, p.lng] as [number, number]));
      map.fitBounds(bounds.pad(0.2), { maxZoom: 13, animate: true });
    } else {
      map.setView(BATUMI_CENTER, 12);
    }
  }, [filtered, selected, mapReady, selectProject, shellH, showMap]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  if (!mounted) {
    return (
      <div style={{ minHeight: "60vh", background: C.parchment, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "DM Sans", color: C.muted }}>Loading map…</p>
      </div>
    );
  }

  const sidebar = (
    <aside
      style={{
        width: isMobile ? "100%" : "400px",
        flexShrink: 0,
        height: "100%",
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
            <p style={{ fontFamily: "DM Sans", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: C.muted, margin: "0 0 4px" }}>
              Sitbo projects
            </p>
            <h1 style={{ fontFamily: "Jun, serif", fontSize: "1.55rem", fontWeight: 500, color: C.dark, margin: 0, lineHeight: 1.1 }}>Map</h1>
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
            padding: "10px 14px",
            outline: "none",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
        <p style={{ fontFamily: "DM Sans", fontSize: "0.72rem", color: C.muted, margin: "10px 0 0" }}>
          {filtered.length} {filtered.length === 1 ? "project" : "projects"} on map
        </p>
      </div>

      <div ref={listRef} style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.map((p) => (
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
        ))}
      </div>
    </aside>
  );

  return (
    <div
      style={{
        height: shellH,
        minHeight: 420,
        background: C.light,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {isMobile && (
        <div
          style={{
            flexShrink: 0,
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            borderBottom: "1px solid rgba(33,20,26,0.08)",
            background: C.light,
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
                borderRadius: 999,
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

      <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
        {showSidebar && sidebar}

        {showMap && (
          <div style={{ flex: 1, position: "relative", minWidth: 0, minHeight: 0, background: "#d9e2e6" }}>
            <div ref={mapElRef} style={{ position: "absolute", inset: 0 }} />

            {!mapReady && !mapError && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: C.parchment,
                  zIndex: 2,
                  fontFamily: "DM Sans",
                  color: C.muted,
                }}
              >
                Loading map…
              </div>
            )}

            {mapError && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  background: C.parchment,
                  zIndex: 2,
                  padding: 24,
                  textAlign: "center",
                }}
              >
                <p style={{ fontFamily: "Jun, serif", fontSize: "1.4rem", color: C.dark, margin: 0 }}>{mapError}</p>
                <Link href="/catalog">
                  <a style={{ fontFamily: "DM Sans", color: C.wine, fontWeight: 700 }}>Open catalog →</a>
                </Link>
              </div>
            )}

            {selectedProject && (
              <div
                style={{
                  position: "absolute",
                  left: 12,
                  right: isMobile ? 12 : "auto",
                  bottom: 12,
                  zIndex: 500,
                  width: isMobile ? "auto" : 320,
                  background: C.light,
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: "0 16px 40px rgba(33,20,26,0.2)",
                  border: "1px solid rgba(33,20,26,0.08)",
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "96px 1fr", gap: 12, padding: 10 }}>
                  <img
                    src={selectedProject.cardImage}
                    alt=""
                    style={{ width: 96, height: 76, objectFit: "cover", borderRadius: 8, display: "block" }}
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
                      >
                        Open →
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .sitbo-map-marker { background: transparent !important; border: none !important; }
        .leaflet-container { width: 100%; height: 100%; font-family: 'DM Sans', sans-serif; background: #d9e2e6; }
        .leaflet-control-attribution { font-size: 10px; }
      `}</style>
    </div>
  );
}
