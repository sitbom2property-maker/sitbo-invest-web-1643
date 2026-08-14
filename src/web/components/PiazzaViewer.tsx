import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import {
  SELECTABLE,
  type ApartmentStatus,
  type ApartmentUnit,
  type RoomKey,
} from "../data/apartments";
import { usePiazzaBoard } from "../hooks/usePiazzaBoard";
import { useRates } from "../context/RatesContext";
import { useLocale } from "../context/LocaleContext";
import { useT, type MessageKey } from "../i18n";
import { RequestModal } from "./RequestModal";
import { ApartmentChessboard } from "./ApartmentChessboard";

const C = {
  dark: "#21141A",
  teal: "#8CB2C0",
  light: "#FFFBF0",
  muted: "#7a7a7a",
};

const FILL: Record<ApartmentStatus, string> = {
  available: "#8ec4d4",
  reserved: "#d4b46a",
  sold: "#c45c54",
  unavailable: "#d4cbc3",
};

const HOVER = "#c5c56a";

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

const ROOM_SHORT: Record<RoomKey, string> = {
  studio: "Studio",
  "1": "1BR",
  "2": "2BR",
  "3": "3BR",
};

type ViewMode = "3d" | "floors" | "2d";
type RoomFilter = "all" | RoomKey;
type StatusFilter = "all" | ApartmentStatus;
type Box = { x: number; y: number; w: number; h: number };

/** Courtyard ring — column numbers walk clockwise from the SW mountain corner. */
const SLOTS: Record<number, Box> = {
  1: { x: 250, y: 560, w: 155, h: 125 },
  2: { x: 405, y: 560, w: 130, h: 125 },
  3: { x: 95, y: 500, w: 155, h: 185 },
  4: { x: 95, y: 405, w: 155, h: 95 },
  5: { x: 95, y: 315, w: 155, h: 90 },
  6: { x: 95, y: 225, w: 155, h: 90 },
  7: { x: 95, y: 115, w: 175, h: 110 },
  8: { x: 270, y: 70, w: 115, h: 155 },
  9: { x: 385, y: 70, w: 105, h: 155 },
  10: { x: 490, y: 70, w: 115, h: 155 },
  11: { x: 605, y: 70, w: 115, h: 155 },
  12: { x: 720, y: 70, w: 165, h: 155 },
  13: { x: 775, y: 225, w: 145, h: 90 },
  14: { x: 775, y: 315, w: 145, h: 90 },
  15: { x: 775, y: 405, w: 145, h: 90 },
  16: { x: 775, y: 495, w: 145, h: 90 },
  17: { x: 620, y: 560, w: 165, h: 125 },
};

/** Exterior faces of the courtyard block, left→right as seen from outside. */
const WALLS = [
  { id: "s", slots: [1, 2, 17] },
  { id: "n", slots: [12, 11, 10, 9, 8] },
  { id: "w", slots: [3, 4, 5, 6, 7] },
  { id: "e", slots: [13, 14, 15, 16] },
] as const;

function slotOf(k: string) {
  return Number(String(k).replace(/\D/g, "")) || 0;
}

function splitBox(box: Box, i: number, n: number): Box {
  if (n <= 1) return box;
  const h = box.h / n;
  return { ...box, y: box.y + i * h, h };
}

function hashToMode(hash: string): ViewMode | null {
  if (hash.includes("floors")) return "floors";
  if (hash.includes("2d") || hash.includes("chess")) return "2d";
  if (hash.includes("3d") || hash.includes("apartments")) return "3d";
  return null;
}

function modeToHash(mode: ViewMode) {
  if (mode === "floors") return "#floors";
  if (mode === "2d") return "#2d";
  return "#apartments";
}

export function PiazzaViewer({ projectName }: { projectName: string }) {
  const t = useT();
  const { language } = useLocale();
  const ru = language.toLowerCase().startsWith("ru");
  const { formatFromUSD, formatAmount, convertFromUSD } = useRates();
  const board = usePiazzaBoard();

  const [mode, setMode] = useState<ViewMode>(() =>
    typeof window === "undefined" ? "3d" : hashToMode(window.location.hash) ?? "3d",
  );
  const [roomFilter, setRoomFilter] = useState<RoomFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [floorFilter, setFloorFilter] = useState<number | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [layoutSrc, setLayoutSrc] = useState<string | null>(null);
  const [rot, setRot] = useState(-32);
  const [listOpen, setListOpen] = useState(true);

  const floors = useMemo(() => [...board.floors].sort((a, b) => b - a), [board.floors]);
  const activeFloor = floorFilter === "all" ? floors[floors.length - 1] ?? 4 : floorFilter;

  useEffect(() => {
    const apply = () => {
      const next = hashToMode(window.location.hash);
      if (next) setMode(next);
    };
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const goMode = (next: ViewMode) => {
    setMode(next);
    const hash = modeToHash(next);
    if (window.location.hash !== hash) history.replaceState(null, "", hash);
  };

  const counts = useMemo(() => {
    const available = board.units.filter((u) => u.s === "available").length;
    const reserved = board.units.filter((u) => u.s === "reserved").length;
    return { available, reserved };
  }, [board.units]);

  const matches = (u: ApartmentUnit) => {
    if (statusFilter !== "all" && u.s !== statusFilter) return false;
    if (roomFilter !== "all" && u.r !== roomFilter) return false;
    if (floorFilter !== "all" && u.f !== floorFilter) return false;
    return true;
  };

  const listed = useMemo(
    () => board.units.filter(matches).sort((a, b) => b.f - a.f || a.c - b.c),
    [board.units, roomFilter, statusFilter, floorFilter],
  );

  const selected = board.units.find((u) => u.id === selectedId) ?? null;
  const hovered = board.units.find((u) => u.id === hoverId) ?? selected;

  const floorUnits = useMemo(
    () => board.units.filter((u) => u.f === activeFloor),
    [board.units, activeFloor],
  );

  const topic = selected
    ? `${projectName} — ${selected.n} (${selected.a} m², ${t("chess.floor")} ${selected.f})`
    : projectName;

  const pick = (u: ApartmentUnit) => {
    setSelectedId(u.id);
    setFloorFilter(u.f);
  };

  const openFloor = (f: number) => {
    setFloorFilter(f);
    goMode("floors");
  };

  const gelPrice = (usd: number) => formatAmount(convertFromUSD(usd, "GEL"), "GEL");

  return (
    <div id="apartments" className="pz">
      <div className="pz-head">
        <div>
          <h3 className="pz-title">{t("chess.title")}</h3>
          <p className="pz-sub">
            {t("chess.availableCount", { count: counts.available })}
            {counts.reserved ? ` · ${t("chess.reservedCount", { count: counts.reserved })}` : ""}
          </p>
        </div>
        {mode === "2d" && <ViewSwitch mode={mode} setMode={goMode} t={t} />}
      </div>

      {mode === "2d" ? (
        <ApartmentChessboard projectName={projectName} embedded />
      ) : (
        <div className={`pz-shell${listOpen ? "" : " is-collapsed"}`}>
          {listOpen && (
            <aside className="pz-side">
              <div className="pz-filters">
                <select value={roomFilter} onChange={(e) => setRoomFilter(e.target.value as RoomFilter)}>
                  <option value="all">{t("chess.filter.allRooms")}</option>
                  {(Object.keys(ROOM_KEYS) as RoomKey[]).map((k) => (
                    <option key={k} value={k}>{t(ROOM_KEYS[k])}</option>
                  ))}
                </select>
                <select
                  value={floorFilter === "all" ? "all" : String(floorFilter)}
                  onChange={(e) => setFloorFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
                >
                  <option value="all">{t("chess.allFloors")}</option>
                  {floors.map((f) => (
                    <option key={f} value={f}>{t("chess.floorN", { n: f })}</option>
                  ))}
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}>
                  <option value="all">{t("chess.filter.all")}</option>
                  <option value="available">{t("chess.status.available")}</option>
                  <option value="reserved">{t("chess.status.reserved")}</option>
                  <option value="sold">{t("chess.status.sold")}</option>
                </select>
              </div>

              <div className="pz-cards">
                {listed.length === 0 && <p className="pz-empty">{t("chess.noMatches")}</p>}
                {listed.slice(0, 40).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    className={`pz-card${selectedId === u.id ? " is-on" : ""}`}
                    onClick={() => pick(u)}
                    onMouseEnter={() => setHoverId(u.id)}
                    onMouseLeave={() => setHoverId(null)}
                  >
                    {u.g ? <img src={u.g} alt="" /> : <div className="pz-card-ph" />}
                    <div className="pz-card-body">
                      <span className="pz-badge">{ru ? u.tr : u.t}</span>
                      <strong>#{u.n}</strong>
                      {u.p ? (
                        <em>{formatFromUSD(u.p)}</em>
                      ) : (
                        <em className="is-mute">{t("chess.priceOnRequest")}</em>
                      )}
                      <span className="pz-card-meta">
                        {t("chess.floorN", { n: u.f })} · {u.a} m²
                      </span>
                      <span className="pz-card-view">{ru ? u.hr || u.vr : u.h || u.v}</span>
                    </div>
                  </button>
                ))}
              </div>
            </aside>
          )}

          <div className="pz-main">
            <button
              type="button"
              className="pz-toggle"
              onClick={() => setListOpen((v) => !v)}
              aria-label={listOpen ? t("chess.hideList") : t("chess.showList")}
            >
              {listOpen ? "‹" : "›"}
            </button>

            <div className="pz-switch-float">
              <ViewSwitch mode={mode} setMode={goMode} t={t} />
            </div>

            {mode === "3d" ? (
              <Tower3D
                floors={floors}
                units={board.units}
                matches={matches}
                selectedId={selectedId}
                hoverId={hoverId}
                rot={rot}
                onRot={setRot}
                onHover={setHoverId}
                onPick={pick}
                onFloor={openFloor}
                hint={t("chess.rotateHint")}
              />
            ) : (
              <FloorPlan
                units={floorUnits}
                matches={matches}
                selectedId={selectedId}
                hoverId={hoverId}
                onHover={setHoverId}
                onPick={pick}
                t={t}
              />
            )}

            {mode === "floors" && (
              <FloorRail
                floors={floors}
                active={activeFloor}
                onPick={(f) => setFloorFilter(f)}
                label={t("chess.floor")}
              />
            )}

            {hovered && (mode === "3d" || floorUnits.some((u) => u.id === hovered.id)) && (
              <UnitTip
                unit={hovered}
                ru={ru}
                t={t}
                formatAmount={formatAmount}
                gelPrice={gelPrice}
                onRequest={() => SELECTABLE.includes(hovered.s) && setRequestOpen(true)}
                onLayout={setLayoutSrc}
              />
            )}

            <div className="pz-legend">
              {(["available", "reserved", "sold", "unavailable"] as const).map((st) => (
                <span key={st}>
                  <i style={{ background: FILL[st] }} />
                  {t(STATUS_KEYS[st])}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{CSS}</style>

      <RequestModal
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        title={t("chess.request")}
        subtitle={topic}
        source="Piazza 3D"
        topic={topic}
      />

      {layoutSrc && (
        <div className="pz-lightbox" onClick={() => setLayoutSrc(null)} role="presentation">
          <img src={layoutSrc} alt="" />
        </div>
      )}
    </div>
  );
}

function ViewSwitch({
  mode,
  setMode,
  t,
}: {
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
  t: (k: MessageKey) => string;
}) {
  return (
    <div className="pz-switch">
      {([
        ["3d", t("chess.view3d"), Icon360],
        ["floors", t("chess.viewFloors"), IconFloors],
        ["2d", t("chess.view2d"), IconGrid],
      ] as const).map(([id, label, Icon]) => (
        <button
          key={id}
          type="button"
          className={mode === id ? "is-on" : ""}
          onClick={() => setMode(id)}
          aria-pressed={mode === id}
        >
          <Icon />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

function Icon360() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 12a8 8 0 0 1 14.9-4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 12a8 8 0 0 1-14.9 4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M17 5v4h4M7 19v-4H3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconFloors() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="4" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <rect x="4" y="10" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <rect x="4" y="16" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconGrid() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="4" width="6" height="6" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="4" width="6" height="6" stroke="currentColor" strokeWidth="1.8" />
      <rect x="4" y="14" width="6" height="6" stroke="currentColor" strokeWidth="1.8" />
      <rect x="14" y="14" width="6" height="6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function FloorRail({
  floors,
  active,
  onPick,
  label,
}: {
  floors: number[];
  active: number;
  onPick: (f: number) => void;
  label: string;
}) {
  const hi = floors[0];
  const lo = floors[floors.length - 1];
  return (
    <div className="pz-rail" role="listbox" aria-label={label}>
      <button type="button" className="pz-rail-nav" disabled={active >= hi} onClick={() => onPick(Math.min(hi, active + 1))} aria-label="+">
        ▲
      </button>
      {floors.map((f) => (
        <button key={f} type="button" className={f === active ? "is-on" : ""} onClick={() => onPick(f)}>
          {f}
        </button>
      ))}
      <button type="button" className="pz-rail-nav" disabled={active <= lo} onClick={() => onPick(Math.max(lo, active - 1))} aria-label="-">
        ▼
      </button>
    </div>
  );
}

function UnitTip({
  unit,
  ru,
  t,
  formatAmount,
  gelPrice,
  onRequest,
  onLayout,
}: {
  unit: ApartmentUnit;
  ru: boolean;
  t: (k: MessageKey, vars?: Record<string, string | number>) => string;
  formatAmount: (n: number, currency?: string) => string;
  gelPrice: (n: number) => string;
  onRequest: () => void;
  onLayout: (src: string) => void;
}) {
  return (
    <div className="pz-tip">
      <span className={`pz-badge pz-st-${unit.s}`}>{t(STATUS_KEYS[unit.s])}</span>
      <span className="pz-badge">{ru ? unit.tr : unit.t}</span>
      <strong>#{unit.n}</strong>
      {unit.p ? (
        <>
          <em>{t("chess.priceUsd")}: {formatAmount(unit.p, "USD")}</em>
          <span className="pz-tip-gel">{t("chess.priceGel")}: {gelPrice(unit.p)}</span>
        </>
      ) : (
        <em className="is-mute">{t("chess.priceOnRequest")}</em>
      )}
      <p>
        {t("chess.floorN", { n: unit.f })} · {unit.a} m²
      </p>
      <p>{ru ? unit.hr || unit.vr : unit.h || unit.v}</p>
      {unit.g && (
        <button type="button" className="pz-tip-plan" onClick={() => onLayout(unit.g!)}>
          <img src={unit.g} alt="" />
        </button>
      )}
      {SELECTABLE.includes(unit.s) ? (
        <button type="button" className="pz-tip-cta" onClick={onRequest}>
          {t("chess.findOutMore")}
        </button>
      ) : (
        <p className="is-mute">{t("chess.notSelectable")}</p>
      )}
    </div>
  );
}

function Tower3D({
  floors,
  units,
  matches,
  selectedId,
  hoverId,
  rot,
  onRot,
  onHover,
  onPick,
  onFloor,
  hint,
}: {
  floors: number[];
  units: ApartmentUnit[];
  matches: (u: ApartmentUnit) => boolean;
  selectedId: string | null;
  hoverId: string | null;
  rot: number;
  onRot: (n: number) => void;
  onHover: (id: string | null) => void;
  onPick: (u: ApartmentUnit) => void;
  onFloor: (f: number) => void;
  hint: string;
}) {
  const drag = useRef<{ x: number; rot: number } | null>(null);
  const moved = useRef(false);
  const [dragging, setDragging] = useState(false);
  const ordered = useMemo(() => [...floors].sort((a, b) => b - a), [floors]);

  const byKey = useMemo(() => {
    const map = new Map<string, ApartmentUnit[]>();
    for (const u of units) {
      const slot = slotOf(u.k);
      const key = `${u.f}:${slot}`;
      const arr = map.get(key) ?? [];
      arr.push(u);
      map.set(key, arr);
    }
    return map;
  }, [units]);

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = { x: e.clientX, rot };
    moved.current = false;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 4) moved.current = true;
    onRot(drag.current.rot + dx * 0.42);
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const clickUnit = (u: ApartmentUnit) => {
    if (moved.current) return;
    onPick(u);
  };

  return (
    <div
      className={`pz-3d${dragging ? " is-drag" : ""}`}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <div className="pz-3d-sky" />
      <p className="pz-3d-hint">{hint}</p>
      <div className="pz-scene">
        <div className="pz-bldg" style={{ ["--rot" as string]: `${rot}deg` }}>
          <div className="pz-roof" />
          <div className="pz-ground" />
          {WALLS.map((wall) => (
            <div
              key={wall.id}
              className={`pz-face pz-face-${wall.id}`}
              style={{
                ["--cols" as string]: wall.slots.length,
                ["--rows" as string]: ordered.length,
              }}
            >
              {ordered.map((f) =>
                wall.slots.map((slot) => {
                  const list = byKey.get(`${f}:${slot}`) ?? [];
                  const u = list[0];
                  const on = u && (selectedId === u.id || hoverId === u.id);
                  const dim = u ? !matches(u) : true;
                  const fill = u
                    ? on && SELECTABLE.includes(u.s)
                      ? HOVER
                      : FILL[u.s]
                    : FILL.unavailable;
                  return (
                    <div
                      key={`${f}-${slot}`}
                      className={`pz-win${on ? " is-on" : ""}`}
                      style={{ background: fill, opacity: dim ? 0.38 : 1 }}
                      onMouseEnter={() => u && onHover(u.id)}
                      onMouseLeave={() => onHover(null)}
                      onClick={() => u && clickUnit(u)}
                      onDoubleClick={() => onFloor(f)}
                      title={u ? `#${u.n}` : undefined}
                    />
                  );
                }),
              )}
              <div className="pz-podium" />
            </div>
          ))}
        </div>
      </div>
      <div className="pz-orbit">
        <button type="button" onClick={() => onRot(rot - 28)} aria-label="Rotate left">‹</button>
        <button type="button" onClick={() => onRot(rot + 28)} aria-label="Rotate right">›</button>
      </div>
    </div>
  );
}

function FloorPlan({
  units,
  matches,
  selectedId,
  hoverId,
  onHover,
  onPick,
  t,
}: {
  units: ApartmentUnit[];
  matches: (u: ApartmentUnit) => boolean;
  selectedId: string | null;
  hoverId: string | null;
  onHover: (id: string | null) => void;
  onPick: (u: ApartmentUnit) => void;
  t: (k: MessageKey, vars?: Record<string, string | number>) => string;
}) {
  const grouped = useMemo(() => {
    const map = new Map<number, ApartmentUnit[]>();
    for (const u of units) {
      const s = slotOf(u.k);
      if (!s) continue;
      const arr = map.get(s) ?? [];
      arr.push(u);
      map.set(s, arr);
    }
    return map;
  }, [units]);

  return (
    <div className="pz-floor">
      <svg viewBox="0 0 1020 760" className="pz-svg" role="img" aria-label={t("chess.viewFloors")}>
        <defs>
          <linearGradient id="pz-yard" x1="0" x2="1">
            <stop offset="0" stopColor="#e8efe6" />
            <stop offset="1" stopColor="#d5e0d4" />
          </linearGradient>
        </defs>
        <rect x="40" y="40" width="940" height="680" rx="18" fill="#f7f3ee" />
        <rect x="270" y="245" width="480" height="290" rx="10" fill="url(#pz-yard)" stroke="#c3cbbd" />
        <rect x="430" y="330" width="160" height="120" rx="6" fill="#efe8df" stroke="#d2c8bc" />
        <text x="510" y="398" textAnchor="middle" className="pz-svg-muted">Piazza</text>

        <text x="510" y="36" textAnchor="middle" className="pz-svg-h">{t("chess.seaView")}</text>
        <text x="510" y="58" textAnchor="middle" className="pz-svg-muted">{t("chess.gorgasali")}</text>
        <text x="510" y="722" textAnchor="middle" className="pz-svg-h">{t("chess.mountainCityView")}</text>
        <text x="510" y="744" textAnchor="middle" className="pz-svg-muted">{t("chess.fireDepartment")}</text>
        <text transform="rotate(-90 28 390)" x="28" y="390" textAnchor="middle" className="pz-svg-muted">{t("chess.may26")}</text>
        <text x="175" y="610" className="pz-svg-muted">{t("chess.culturalMonument")}</text>
        <text transform="rotate(90 992 390)" x="992" y="390" textAnchor="middle" className="pz-svg-muted">{t("chess.portCityView")}</text>

        <g transform="translate(70 70)">
          <circle r="22" fill="#fff" stroke="#cfc6bb" />
          <text y="-6" textAnchor="middle" className="pz-svg-apt">N</text>
          <text y="12" textAnchor="middle" className="pz-svg-muted">S</text>
        </g>

        {[...grouped.entries()].map(([slot, list]) => {
          const base = SLOTS[slot];
          if (!base) return null;
          return list.map((u, i) => {
            const box = splitBox(base, i, list.length);
            const dim = !matches(u);
            const on = selectedId === u.id || hoverId === u.id;
            const fill = on && SELECTABLE.includes(u.s) ? HOVER : FILL[u.s];
            const label = `${ROOM_SHORT[u.r]} ${u.k}`;
            return (
              <g
                key={u.id}
                className="pz-unit"
                opacity={dim ? 0.35 : 1}
                onMouseEnter={() => onHover(u.id)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onPick(u)}
              >
                <rect
                  x={box.x}
                  y={box.y}
                  width={box.w}
                  height={box.h}
                  fill={fill}
                  stroke={on ? C.dark : "rgba(33,20,26,0.28)"}
                  strokeWidth={on ? 2.4 : 1}
                />
                <text x={box.x + box.w / 2} y={box.y + box.h / 2 - 6} textAnchor="middle" className="pz-svg-apt">
                  {label}
                </text>
                <text x={box.x + box.w / 2} y={box.y + box.h / 2 + 12} textAnchor="middle" className="pz-svg-m2">
                  {u.a} m²
                </text>
              </g>
            );
          });
        })}

        <g transform="translate(455 678)">
          <rect x="0" y="0" width="110" height="54" rx="4" fill="#fff" stroke="#d2c8bc" />
          <rect x="18" y="8" width="74" height="28" fill="none" stroke={C.dark} strokeWidth="1.2" />
          <rect x="28" y="14" width="54" height="16" fill="#d5e0d4" />
          <text x="55" y="48" textAnchor="middle" className="pz-svg-muted">Sea ↑</text>
        </g>
      </svg>
    </div>
  );
}

const CSS = `
.pz { font-family: Inter, sans-serif; color: ${C.dark}; }
.pz-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 18px; }
.pz-title { font-family: Coolvetica, Inter, sans-serif; font-size: clamp(1.6rem,2.5vw,2.2rem); font-weight: 400; margin: 0; }
.pz-sub { font-size: 0.85rem; color: ${C.muted}; margin: 8px 0 0; }
.pz-switch { display: flex; background: ${C.dark}; border-radius: 999px; padding: 4px; gap: 2px; }
.pz-switch button { font-family: Inter, sans-serif; font-size: 12px; font-weight: 600; letter-spacing: .03em; color: rgba(255,251,240,.7); background: transparent; border: none; border-radius: 999px; padding: 8px 12px; cursor: pointer; display: flex; align-items: center; gap: 6px; }
.pz-switch button.is-on { background: #fff; color: ${C.dark}; }
.pz-switch svg { flex-shrink: 0; }
.pz-shell { display: grid; grid-template-columns: minmax(260px,320px) minmax(0,1fr); min-height: min(78vh, 860px); border: 1px solid rgba(33,20,26,.08); border-radius: 16px; overflow: hidden; background: #f7f3ee; }
.pz-shell.is-collapsed { grid-template-columns: 1fr; }
.pz-side { background: #fff; border-right: 1px solid rgba(33,20,26,.08); display: flex; flex-direction: column; min-width: 0; }
.pz-filters { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 14px; border-bottom: 1px solid rgba(33,20,26,.06); }
.pz-filters select { font-family: Inter, sans-serif; font-size: 12px; color: ${C.dark}; background: ${C.light}; border: 1px solid rgba(33,20,26,.12); border-radius: 8px; padding: 8px 10px; }
.pz-cards { overflow: auto; padding: 12px; display: grid; gap: 10px; }
.pz-empty { font-size: 13px; color: ${C.muted}; margin: 12px 4px; }
.pz-card { display: grid; grid-template-columns: 88px 1fr; gap: 10px; text-align: left; background: #fff; border: 1px solid rgba(33,20,26,.08); border-radius: 10px; padding: 8px; cursor: pointer; }
.pz-card.is-on { border-color: ${C.dark}; }
.pz-card img, .pz-card-ph { width: 88px; height: 72px; object-fit: cover; border-radius: 6px; background: #efe8df; }
.pz-card-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.pz-card-body strong { font-size: 15px; }
.pz-card-body em { font-style: normal; font-size: 13px; font-weight: 600; color: ${C.dark}; }
.pz-card-meta, .pz-card-view, .is-mute { font-size: 11px; color: ${C.muted}; }
.pz-badge { display: inline-block; width: fit-content; font-size: 10px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; background: ${C.teal}; color: ${C.dark}; border-radius: 4px; padding: 2px 6px; }
.pz-badge.pz-st-available { background: #8ec4d4; }
.pz-badge.pz-st-reserved { background: #d4b46a; }
.pz-badge.pz-st-sold { background: #c45c54; color: #fff; }
.pz-badge.pz-st-unavailable { background: #d4cbc3; }
.pz-main { position: relative; min-width: 0; min-height: 560px; }
.pz-toggle { position: absolute; left: 8px; top: 50%; z-index: 5; width: 28px; height: 44px; border: none; border-radius: 8px; background: rgba(33,20,26,.78); color: #fff; cursor: pointer; }
.pz-switch-float { position: absolute; right: 16px; top: 14px; z-index: 5; }
.pz-3d { position: absolute; inset: 0; overflow: hidden; cursor: grab; touch-action: none; background: linear-gradient(180deg, #8aa8b8 0%, #c5d4dc 42%, #e4ece6 72%, #d7c4a4 100%); }
.pz-3d.is-drag { cursor: grabbing; }
.pz-3d-sky { position: absolute; inset: 0; background:
  radial-gradient(ellipse at 50% 120%, rgba(90,70,50,.18), transparent 55%),
  linear-gradient(180deg, transparent 60%, rgba(80,90,60,.12));
  pointer-events: none; }
.pz-3d-hint { position: absolute; left: 18px; top: 16px; z-index: 2; margin: 0; padding: 8px 12px; border-radius: 8px; background: rgba(255,251,240,.92); font-size: 13px; max-width: 46%; }
.pz-scene { position: absolute; inset: 0; perspective: 1600px; display: flex; align-items: center; justify-content: center; }
.pz-bldg { position: relative; width: 420px; height: 400px; transform-style: preserve-3d; transform: rotateX(-18deg) rotateY(var(--rot, -32deg)); transition: transform .5s ease; }
.pz-3d.is-drag .pz-bldg { transition: none; }
.pz-face { position: absolute; left: 0; top: 0; height: 400px; display: grid; grid-template-columns: repeat(var(--cols), 1fr); grid-template-rows: repeat(var(--rows), 1fr) 48px; gap: 1px; padding: 2px; background: #b7a090; backface-visibility: hidden; box-shadow: inset 0 0 0 1px rgba(33,20,26,.2); }
.pz-face-s { width: 420px; transform: translateZ(170px); }
.pz-face-n { width: 420px; transform: rotateY(180deg) translateZ(170px); }
.pz-face-w { width: 340px; left: 40px; transform: rotateY(-90deg) translateZ(210px); }
.pz-face-e { width: 340px; left: 40px; transform: rotateY(90deg) translateZ(210px); }
.pz-roof { position: absolute; width: 420px; height: 340px; left: 0; top: 30px; background: linear-gradient(135deg, #cfc3b4, #a89886); transform: rotateX(90deg) translateZ(200px); backface-visibility: hidden; }
.pz-ground { position: absolute; width: 520px; height: 440px; left: -50px; top: -20px; background: radial-gradient(ellipse, #8aa070, #6a7a58); transform: rotateX(90deg) translateZ(-201px); }
.pz-win { cursor: pointer; min-width: 0; min-height: 0; box-shadow: inset 0 0 0 1px rgba(255,255,255,.22); }
.pz-win.is-on { outline: 2px solid #fff; z-index: 2; }
.pz-podium { grid-column: 1 / -1; background:
  repeating-linear-gradient(90deg, #9a8674 0 18px, #8a7664 18px 20px),
  linear-gradient(#8d7a68, #6e5c4c); }
.pz-orbit { position: absolute; left: 50%; bottom: 22px; transform: translateX(-50%); display: flex; gap: 10px; z-index: 2; }
.pz-orbit button { width: 44px; height: 44px; border-radius: 50%; border: none; background: #fff; color: ${C.dark}; font-size: 22px; cursor: pointer; box-shadow: 0 6px 16px rgba(0,0,0,.18); }
.pz-floor { position: absolute; inset: 0; background: #fff; }
.pz-svg { width: 100%; height: 100%; display: block; }
.pz-svg-h { font-family: Coolvetica, Inter, sans-serif; font-size: 18px; fill: ${C.dark}; letter-spacing: .12em; }
.pz-svg-muted { font-family: Inter, sans-serif; font-size: 11px; fill: ${C.muted}; }
.pz-svg-apt { font-family: Inter, sans-serif; font-size: 11px; font-weight: 700; fill: ${C.dark}; }
.pz-svg-m2 { font-family: Inter, sans-serif; font-size: 10px; fill: ${C.dark}; }
.pz-unit { cursor: pointer; }
.pz-tip { position: absolute; right: 64px; top: 64px; width: 230px; background: #fff; border-radius: 12px; padding: 14px; box-shadow: 0 16px 40px rgba(0,0,0,.18); display: flex; flex-direction: column; gap: 6px; z-index: 4; }
.pz-tip strong { font-size: 18px; }
.pz-tip p { margin: 0; font-size: 12px; }
.pz-tip em { font-style: normal; font-weight: 700; }
.pz-tip-gel { font-size: 11px; color: ${C.muted}; }
.pz-tip-plan { border: none; padding: 0; background: none; cursor: pointer; }
.pz-tip-plan img { width: 100%; border-radius: 8px; display: block; }
.pz-tip-cta { margin-top: 6px; font-family: Inter, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; border: none; border-radius: 8px; padding: 10px; background: ${C.dark}; color: ${C.light}; cursor: pointer; }
.pz-rail { position: absolute; right: 10px; top: 64px; bottom: 56px; overflow: auto; display: flex; flex-direction: column; gap: 4px; padding: 8px 6px; background: rgba(255,251,240,.88); border-radius: 999px; z-index: 3; }
.pz-rail button { width: 36px; height: 36px; border: none; border-radius: 50%; background: transparent; font-family: Inter, sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; color: ${C.dark}; }
.pz-rail button.is-on { background: ${C.dark}; color: ${C.light}; }
.pz-rail-nav { font-size: 9px !important; color: ${C.muted} !important; }
.pz-legend { position: absolute; left: 16px; bottom: 14px; z-index: 3; display: flex; flex-wrap: wrap; gap: 10px; background: rgba(255,251,240,.9); border-radius: 8px; padding: 8px 10px; font-size: 11px; color: ${C.muted}; }
.pz-legend span { display: flex; align-items: center; gap: 6px; }
.pz-legend i { width: 10px; height: 10px; border-radius: 2px; display: block; }
.pz-lightbox { position: fixed; inset: 0; background: rgba(0,0,0,.8); display: flex; align-items: center; justify-content: center; z-index: 1000; cursor: pointer; }
.pz-lightbox img { max-width: 90vw; max-height: 80vh; object-fit: contain; border-radius: 12px; }
@media (max-width: 980px) {
  .pz-shell { grid-template-columns: 1fr; min-height: 0; }
  .pz-side { max-height: 280px; border-right: none; border-bottom: 1px solid rgba(33,20,26,.08); }
  .pz-main { min-height: 520px; }
  .pz-tip { right: 12px; left: 12px; width: auto; top: auto; bottom: 58px; }
  .pz-3d-hint { max-width: calc(100% - 180px); }
  .pz-switch span { display: none; }
  .pz-switch-float .pz-switch span { display: none; }
}
`;
