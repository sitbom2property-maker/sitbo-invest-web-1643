import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import snapshot from "../data/piazza-apartments.json";
import {
  SELECTABLE,
  STATUS_COLOR,
  type ApartmentBoard,
  type ApartmentStatus,
  type ApartmentUnit,
  type RoomKey,
} from "../data/apartments";
import { useRates } from "../context/RatesContext";
import { useLocale } from "../context/LocaleContext";
import { useT, type MessageKey } from "../i18n";
import { RequestModal } from "./RequestModal";

const C = {
  dark: "#21141A",
  teal: "#8CB2C0",
  wine: "#683D47",
  light: "#FFFBF0",
  muted: "#7a7a7a",
};

const COLS = Array.from({ length: 17 }, (_, i) => i + 1);
const FALLBACK = snapshot as ApartmentBoard;

type StatusFilter = "free" | "all";
type RoomFilter = "all" | RoomKey;

function usePiazzaBoard() {
  const [board, setBoard] = useState<ApartmentBoard>(FALLBACK);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/apartments/piazza")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: ApartmentBoard) => {
        if (!cancelled && Array.isArray(data?.units) && data.units.length) setBoard(data);
      })
      .catch(() => {
        /* snapshot already loaded */
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return board;
}

const ROOM_KEYS: Record<RoomKey, MessageKey> = {
  studio: "chess.room.studio",
  "1": "chess.room.1",
  "2": "chess.room.2",
  "3": "chess.room.3",
};

const STATUS_KEYS: Record<ApartmentStatus, MessageKey> = {
  available: "chess.status.available",
  reserved: "chess.status.reserved",
  sold: "chess.status.sold",
  unavailable: "chess.status.unavailable",
};

export function ApartmentChessboard({ projectName }: { projectName: string }) {
  const t = useT();
  const { language } = useLocale();
  const ru = language.toLowerCase().startsWith("ru");
  const { formatFromUSD } = useRates();
  const board = usePiazzaBoard();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("free");
  const [roomFilter, setRoomFilter] = useState<RoomFilter>("all");
  const [floorFilter, setFloorFilter] = useState<number | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [layoutSrc, setLayoutSrc] = useState<string | null>(null);
  const floorRowRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const floors = useMemo(() => [...board.floors].sort((a, b) => b - a), [board.floors]);

  useEffect(() => {
    if (floorFilter === "all") return;
    floorRowRefs.current[floorFilter]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [floorFilter]);

  const counts = useMemo(() => {
    const available = board.units.filter((u) => u.s === "available").length;
    const reserved = board.units.filter((u) => u.s === "reserved").length;
    return { available, reserved, total: board.units.length };
  }, [board.units]);

  const selected = board.units.find((u) => u.id === selectedId) ?? null;

  const matchesFilters = (u: ApartmentUnit) => {
    if (statusFilter === "free" && !SELECTABLE.includes(u.s)) return false;
    if (roomFilter !== "all" && u.r !== roomFilter) return false;
    return true;
  };

  const unitsAt = (floor: number, col: number) =>
    board.units.filter((u) => u.f === floor && u.c === col);

  const cellBg = (u: ApartmentUnit, dim: boolean) => {
    const base = STATUS_COLOR[u.s];
    if (dim) return u.s === "available" || u.s === "reserved" ? `${base}55` : "#f0e8df";
    return base;
  };

const chip = (active: boolean): CSSProperties => ({
    fontFamily: "Inter, sans-serif",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    padding: "7px 12px",
    borderRadius: 6,
    cursor: "pointer",
    border: `1px solid ${active ? C.dark : "rgba(33,20,26,0.12)"}`,
    background: active ? C.dark : "transparent",
    color: active ? C.light : C.dark,
  });

  const topic = selected
    ? `${projectName} — ${selected.n} (${selected.a} m², ${t("chess.floor")} ${selected.f})`
    : projectName;

  return (
    <div id="apartments">
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 22 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 24, height: 1, background: C.wine }} />
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.63rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted }}>
              {t("chess.eyebrow")}
            </span>
          </div>
          <h3 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "clamp(1.6rem,2.5vw,2.2rem)", fontWeight: 400, color: C.dark, margin: 0 }}>
            {t("chess.title")}
          </h3>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: C.muted, margin: "8px 0 0" }}>
            {t("chess.availableCount", { count: counts.available })}
            {counts.reserved ? ` · ${t("chess.reservedCount", { count: counts.reserved })}` : ""}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        <button type="button" style={chip(statusFilter === "free")} onClick={() => setStatusFilter("free")}>
          {t("chess.filter.free")}
        </button>
        <button type="button" style={chip(statusFilter === "all")} onClick={() => setStatusFilter("all")}>
          {t("chess.filter.all")}
        </button>
        <span style={{ width: 1, background: "rgba(33,20,26,0.1)", margin: "0 4px" }} />
        {([
          ["all", t("chess.filter.allRooms")],
          ["studio", t("chess.room.studio")],
          ["1", t("chess.room.1")],
          ["2", t("chess.room.2")],
          ["3", t("chess.room.3")],
        ] as const).map(([key, label]) => (
          <button key={key} type="button" style={chip(roomFilter === key)} onClick={() => setRoomFilter(key)}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
        <label style={{ fontFamily: "Inter, sans-serif", fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted }}>
          {t("chess.floor")}
        </label>
        <select
          value={floorFilter === "all" ? "all" : String(floorFilter)}
          onChange={(e) => setFloorFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
          style={{
            fontFamily: "Inter, sans-serif", fontSize: "0.82rem", color: C.dark,
            background: C.light, border: "1px solid rgba(33,20,26,0.12)",
            borderRadius: 8, padding: "8px 12px",
          }}
        >
          <option value="all">{t("chess.allFloors")}</option>
          {floors.map((f) => (
            <option key={f} value={f}>{t("chess.floorN", { n: f })}</option>
          ))}
        </select>
        <div style={{ display: "flex", gap: 12, marginLeft: "auto", flexWrap: "wrap" }}>
          {([
            ["available", t("chess.status.available")],
            ["reserved", t("chess.status.reserved")],
            ["sold", t("chess.status.sold")],
            ["unavailable", t("chess.status.unavailable")],
          ] as const).map(([st, label]) => (
            <span key={st} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Inter, sans-serif", fontSize: "0.72rem", color: C.muted }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: STATUS_COLOR[st as ApartmentStatus] }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(260px,320px)", gap: 20, alignItems: "start" }} className="chess-layout">
        <div style={{ overflowX: "auto", alignSelf: "start", border: "1px solid rgba(33,20,26,0.08)", borderRadius: 12, background: C.light }}>
          <div style={{ minWidth: 720, padding: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: `36px repeat(${COLS.length}, minmax(34px,1fr))`, gap: 3, marginBottom: 6 }}>
              <div />
              {COLS.map((c) => (
                <div key={c} style={{ textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: C.muted }}>
                  {c}
                </div>
              ))}
            </div>
            {floors.map((floor) => {
              const focused = floorFilter === "all" || floor === floorFilter;
              return (
              <div
                key={floor}
                ref={(el) => { floorRowRefs.current[floor] = el; }}
                style={{
                  display: "grid",
                  gridTemplateColumns: `36px repeat(${COLS.length}, minmax(34px,1fr))`,
                  gap: 3,
                  marginBottom: 3,
                  padding: focused && floorFilter !== "all" ? 3 : 0,
                  borderRadius: 6,
                  outline: floorFilter !== "all" && floor === floorFilter ? `2px solid ${C.teal}` : "none",
                  background: floorFilter !== "all" && floor === floorFilter ? "rgba(140,178,192,0.12)" : "transparent",
                  opacity: focused ? 1 : 0.38,
                }}
              >
                <div style={{
                  fontFamily: "Inter, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: C.dark,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {floor}
                </div>
                {COLS.map((col) => {
                  const cellUnits = unitsAt(floor, col);
                  if (!cellUnits.length) {
                    return <div key={col} style={{ minHeight: 34, borderRadius: 4, background: "rgba(33,20,26,0.03)" }} />;
                  }
                  return (
                    <div key={col} style={{ display: "flex", flexDirection: "column", gap: 2, minHeight: 34 }}>
                      {cellUnits.map((u) => {
                        const dim = !matchesFilters(u);
                        const active = selectedId === u.id;
                        return (
                          <button
                            key={u.id}
                            type="button"
                            title={`${u.n} · ${u.a} m²`}
                            onClick={() => setSelectedId(u.id)}
                            style={{
                              flex: 1,
                              minHeight: cellUnits.length > 1 ? 16 : 34,
                              border: active ? `2px solid ${C.dark}` : "1px solid rgba(33,20,26,0.06)",
                              borderRadius: 4,
                              background: cellBg(u, dim),
                              cursor: "pointer",
                              padding: 0,
                              opacity: dim ? 0.35 : 1,
                              color: u.s === "available" || u.s === "reserved" ? C.dark : "rgba(33,20,26,0.45)",
                              fontFamily: "Inter, sans-serif",
                              fontSize: "0.55rem",
                              fontWeight: 700,
                            }}
                          >
                            {u.k}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
              );
            })}
          </div>
        </div>

        <aside style={{
          background: C.dark, borderRadius: 16, padding: 22,
          color: C.light, minHeight: 280,
        }}>
          {!selected ? (
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", color: "rgba(255,251,240,0.55)", lineHeight: 1.7, margin: 0 }}>
              {t("chess.pickHint")}
            </p>
          ) : (
            <div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.teal, margin: "0 0 8px" }}>
                {t("chess.unit")} {selected.n}
              </p>
              <h4 style={{ fontFamily: "Coolvetica, Inter, sans-serif", fontSize: "1.55rem", fontWeight: 400, margin: "0 0 14px", lineHeight: 1.2 }}>
                {ru ? selected.tr : selected.t}
              </h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px", marginBottom: 16 }}>
                {[
                  [t("chess.floor"), String(selected.f)],
                  [t("chess.area"), `${selected.a} m²`],
                  [t("chess.rooms"), t(ROOM_KEYS[selected.r])],
                  [t("chess.status.label"), t(STATUS_KEYS[selected.s])],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,251,240,0.4)", margin: "0 0 4px" }}>{label}</p>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", fontWeight: 600, margin: 0 }}>{value}</p>
                  </div>
                ))}
              </div>
              {selected.p ? (
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "1.6rem", fontWeight: 700, color: C.teal, margin: "0 0 4px" }}>
                  {formatFromUSD(selected.p)}
                </p>
              ) : (
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.85rem", color: "rgba(255,251,240,0.5)", margin: "0 0 4px" }}>
                  {t("chess.priceOnRequest")}
                </p>
              )}
              {selected.m ? (
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "rgba(255,251,240,0.45)", margin: "0 0 14px" }}>
                  {formatFromUSD(selected.m)} / m²
                </p>
              ) : <div style={{ height: 14 }} />}
              {(ru ? selected.vr || selected.hr : selected.v || selected.h) ? (
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8rem", color: "rgba(255,251,240,0.65)", margin: "0 0 16px" }}>
                  {[ru ? selected.vr : selected.v, ru ? selected.hr : selected.h].filter(Boolean).join(" · ")}
                </p>
              ) : null}
              {selected.g ? (
                <button type="button" onClick={() => setLayoutSrc(selected.g)} style={{
                  display: "block", width: "100%", border: "none", padding: 0, background: "transparent", cursor: "pointer", marginBottom: 16,
                }}>
                  <img src={selected.g} alt={selected.n} style={{ width: "100%", borderRadius: 8, display: "block", background: C.light }} />
                </button>
              ) : null}
              {SELECTABLE.includes(selected.s) ? (
                <button
                  type="button"
                  onClick={() => setRequestOpen(true)}
                  style={{
                    width: "100%", fontFamily: "Inter, sans-serif", fontSize: "0.75rem", fontWeight: 600,
                    letterSpacing: "0.1em", textTransform: "uppercase", color: C.dark, background: C.teal,
                    border: "none", borderRadius: 8, padding: 14, cursor: "pointer",
                  }}
                >
                  {t("chess.request")}
                </button>
              ) : (
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.78rem", color: "rgba(255,251,240,0.45)", margin: 0 }}>
                  {t("chess.notSelectable")}
                </p>
              )}
            </div>
          )}
        </aside>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .chess-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <RequestModal
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        title={t("chess.request")}
        subtitle={topic}
        source="Piazza chessboard"
        topic={topic}
      />

      {layoutSrc && (
        <div onClick={() => setLayoutSrc(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, cursor: "pointer" }}>
          <img src={layoutSrc} alt="" style={{ maxWidth: "90vw", maxHeight: "80vh", objectFit: "contain", borderRadius: 12 }} />
        </div>
      )}
    </div>
  );
}
