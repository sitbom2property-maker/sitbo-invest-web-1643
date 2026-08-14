type Localized = Record<string, string | null> | string | null | undefined;

type RawPlacement = {
  id?: string;
  placementStatus?: { name?: Localized; moduleName?: Localized };
  floors?: Array<{ numeration?: Localized }>;
  numeration?: Localized;
  rooms?: Localized;
  totalArea?: number | null;
  totalPrice?: number | null;
  pricePerSqM?: number | null;
  urls?: { gallery?: string[] };
  row1?: Localized;
  row2?: Localized;
  planningType?: Localized;
};

export type ApartmentStatus = "available" | "reserved" | "sold" | "unavailable";

export type ApartmentKey = "piazza" | "parkline";

const STATUS: Record<string, ApartmentStatus> = {
  available: "available",
  "free booking": "reserved",
  reserved: "reserved",
  sold: "sold",
  "not for sale": "unavailable",
  owner: "unavailable",
  closed: "unavailable",
  barter: "sold",
  resale: "available",
  interest: "reserved",
};

function loc(obj: Localized, lang = "en"): string {
  if (obj == null) return "";
  if (typeof obj === "string") return obj.trim();
  const v = obj[lang] ?? obj.en ?? "";
  return typeof v === "string" ? v.trim() : "";
}

function roomsKey(v: string): "studio" | "1" | "2" | "3" {
  const s = v.trim().toUpperCase();
  if (!s || s === "S" || s === "STUDIO" || s === "0") return "studio";
  if (s.startsWith("1")) return "1";
  if (s.startsWith("2")) return "2";
  if (s.startsWith("3")) return "3";
  return "studio";
}

function parsePiazza(num: string): { col: number; key: string; building?: string } {
  const m = String(num).match(/^(\d+)([A-Za-z])?$/);
  if (!m) return { col: 0, key: "0" };
  const pos = Number(m[1].slice(-2));
  const letter = (m[2] || "").toUpperCase();
  return { col: pos, key: letter ? `${pos}${letter}` : String(pos) };
}

function parseParkline(num: string, floor: number): { col: number; key: string; building?: string } {
  const m = String(num).match(/^([A-Za-z])(\d+)$/);
  if (!m) return { col: 0, key: "0" };
  const building = m[1].toUpperCase();
  const rest = m[2];
  const fl = String(floor);
  const unit = rest.startsWith(fl) && rest.length > fl.length ? rest.slice(fl.length) : rest.slice(-2);
  const col = Number(unit || 0);
  return { col, key: String(col), building };
}

function mapPlacements(
  raw: RawPlacement[],
  project: string,
  parseNum: (num: string, floor: number) => { col: number; key: string; building?: string },
  include: (u: { rooms: string; floor: number }) => boolean,
) {
  const units = raw.flatMap((u) => {
    const stMod = loc(u.placementStatus?.moduleName).toLowerCase();
    const stRaw = loc(u.placementStatus?.name).toLowerCase();
    const status = STATUS[stMod] ?? STATUS[stRaw] ?? "unavailable";
    const floor = Number(loc(u.floors?.[0]?.numeration) || 0);
    const rooms = loc(u.rooms);
    if (!include({ rooms, floor })) return [];
    const number = loc(u.numeration);
    const { col, key, building } = parseNum(number, floor);
    const sellable = status === "available" || status === "reserved";
    const gallery = u.urls?.gallery ?? [];
    const view = loc(u.row2);
    const highlight = loc(u.row1) || building || "";
    const plan = loc(u.planningType);
    return [{
      id: u.id ?? number,
      n: number,
      f: floor,
      c: col,
      k: key,
      ...(building ? { b: building } : {}),
      r: roomsKey(rooms),
      a: u.totalArea ?? 0,
      p: sellable ? u.totalPrice ?? null : null,
      m: sellable ? u.pricePerSqM ?? null : null,
      s: status,
      v: view,
      h: highlight,
      t: plan,
      g: gallery[0] ?? null,
      vr: loc(u.row2, "ru") || view,
      hr: loc(u.row1, "ru") || highlight,
      tr: loc(u.planningType, "ru") || plan,
    }];
  });

  units.sort((a, b) => b.f - a.f || (a.b ?? "").localeCompare(b.b ?? "") || a.c - b.c || a.k.localeCompare(b.k) || a.n.localeCompare(b.n));

  const floors = [...new Set(units.map((u) => u.f))].sort((a, b) => a - b);
  const columns = [...new Set(units.map((u) => u.k))].sort((a, b) => {
    const na = Number(a.replace(/\D/g, "") || 0);
    const nb = Number(b.replace(/\D/g, "") || 0);
    return na - nb || a.localeCompare(b);
  });
  const buildings = [...new Set(units.map((u) => u.b).filter((b): b is string => Boolean(b)))].sort();

  return {
    project,
    source: "flat.show",
    currency: "USD",
    floors,
    columns,
    ...(buildings.length ? { buildings } : {}),
    units,
  };
}

async function fetchAllPlacements(complexId: string | number) {
  const members: RawPlacement[] = [];
  let url: string | null = `https://pro-api.flat.show/api/placements?complex=${complexId}&itemsPerPage=300`;
  const seen = new Set<string>();

  while (url && !seen.has(url)) {
    seen.add(url);
    const res = await fetch(url, {
      headers: { Accept: "application/ld+json, application/json" },
    });
    if (!res.ok) throw new Error(`Flat.show ${res.status}`);
    const data = (await res.json()) as {
      "hydra:member"?: RawPlacement[];
      "hydra:view"?: { "hydra:next"?: string };
    } | RawPlacement[];
    const page = Array.isArray(data) ? data : data["hydra:member"] ?? [];
    members.push(...page);
    const next = Array.isArray(data) ? undefined : data["hydra:view"]?.["hydra:next"];
    url = next ? (next.startsWith("http") ? next : `https://pro-api.flat.show${next}`) : null;
  }

  if (!members.length) throw new Error("Flat.show empty");
  return members;
}

const CACHE_MS = 10 * 60 * 1000;
const cache = new Map<ApartmentKey, { at: number; payload: ReturnType<typeof mapPlacements> }>();

const COMPLEX: Record<ApartmentKey, {
  id: string | number;
  project: string;
  parse: (num: string, floor: number) => { col: number; key: string; building?: string };
  include: (u: { rooms: string; floor: number }) => boolean;
}> = {
  piazza: {
    id: 157,
    project: "piazza-residence",
    parse: (num) => parsePiazza(num),
    include: () => true,
  },
  parkline: {
    id: 218,
    project: "artex-parkline",
    parse: parseParkline,
    include: (u) => u.rooms.toUpperCase() !== "P" && u.floor >= 1,
  },
};

export async function fetchFlatshowApartments(key: ApartmentKey) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.payload;

  const cfg = COMPLEX[key];
  const members = await fetchAllPlacements(cfg.id);
  const payload = mapPlacements(members, cfg.project, cfg.parse, cfg.include);
  cache.set(key, { at: Date.now(), payload });
  return payload;
}

export async function fetchPiazzaApartments() {
  return fetchFlatshowApartments("piazza");
}

export async function fetchParklineApartments() {
  return fetchFlatshowApartments("parkline");
}
