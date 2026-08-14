type Localized = Record<string, string | null> | string | null | undefined;

type RawPlacement = {
  id?: string;
  placementStatus?: { name?: Localized };
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

const STATUS: Record<string, ApartmentStatus> = {
  available: "available",
  "free booking": "reserved",
  sold: "sold",
  "not for sale": "unavailable",
  owner: "unavailable",
  closed: "unavailable",
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

function parseCol(num: string): { col: number; key: string } {
  const m = String(num).match(/^(\d+)([A-Za-z])?$/);
  if (!m) return { col: 0, key: "0" };
  const pos = Number(m[1].slice(-2));
  const letter = (m[2] || "").toUpperCase();
  return { col: pos, key: letter ? `${pos}${letter}` : String(pos) };
}

export function mapPlacements(raw: RawPlacement[]) {
  const units = raw.map((u) => {
    const stRaw = loc(u.placementStatus?.name).toLowerCase();
    const status = STATUS[stRaw] ?? "unavailable";
    const floor = Number(loc(u.floors?.[0]?.numeration) || 0);
    const number = loc(u.numeration);
    const { col, key } = parseCol(number);
    const sellable = status === "available" || status === "reserved";
    const gallery = u.urls?.gallery ?? [];
    const view = loc(u.row2);
    const highlight = loc(u.row1);
    const plan = loc(u.planningType);
    return {
      id: u.id ?? number,
      n: number,
      f: floor,
      c: col,
      k: key,
      r: roomsKey(loc(u.rooms)),
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
    };
  });

  units.sort((a, b) => b.f - a.f || a.c - b.c || a.k.localeCompare(b.k) || a.n.localeCompare(b.n));

  const floors = [...new Set(units.map((u) => u.f))].sort((a, b) => a - b);
  const columns = [...new Set(units.map((u) => u.k))].sort((a, b) => {
    const na = Number(a.replace(/\D/g, "") || 0);
    const nb = Number(b.replace(/\D/g, "") || 0);
    return na - nb || a.localeCompare(b);
  });

  return {
    project: "piazza-residence",
    source: "flat.show",
    currency: "USD",
    floors,
    columns,
    units,
  };
}

const FLATSHOW =
  "https://pro-api.flat.show/api/placements?complex=157&itemsPerPage=300";

let cache: { at: number; payload: ReturnType<typeof mapPlacements> } | null = null;
const CACHE_MS = 10 * 60 * 1000;

export async function fetchPiazzaApartments() {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.payload;

  const res = await fetch(FLATSHOW, {
    headers: { Accept: "application/ld+json, application/json" },
  });
  if (!res.ok) throw new Error(`Flat.show ${res.status}`);
  const data = (await res.json()) as { "hydra:member"?: RawPlacement[] } | RawPlacement[];
  const members = Array.isArray(data) ? data : data["hydra:member"] ?? [];
  if (!members.length) throw new Error("Flat.show empty");
  const payload = mapPlacements(members);
  cache = { at: Date.now(), payload };
  return payload;
}
