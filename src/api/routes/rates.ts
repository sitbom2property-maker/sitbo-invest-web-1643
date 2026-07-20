import { Hono } from "hono";

/**
 * National Bank of Georgia official rates.
 * API returns GEL amount per `quantity` units of foreign currency.
 * Example: USD quantity=1 rate=2.71 → 1 USD = 2.71 GEL
 */
const NBG_URL = "https://nbg.gov.ge/gw/api/ct/monetarypolicy/currencies/en/json";

const FALLBACK_GEL_PER_UNIT: Record<string, number> = {
  USD: 2.71,
  EUR: 2.95,
  GBP: 3.45,
  RUB: 0.031,
  AED: 0.74,
  TRY: 0.08,
};

type NbgCurrency = {
  code: string;
  quantity: number;
  rate: number;
};

type RatesPayload = {
  source: "nbg" | "fallback";
  date: string;
  /** GEL per 1 unit of currency */
  gelPerUnit: Record<string, number>;
};

let cache: { at: number; payload: RatesPayload } | null = null;
const CACHE_MS = 6 * 60 * 60 * 1000; // 6 hours

function fallbackPayload(): RatesPayload {
  return {
    source: "fallback",
    date: new Date().toISOString().slice(0, 10),
    gelPerUnit: { GEL: 1, ...FALLBACK_GEL_PER_UNIT },
  };
}

async function fetchNbgRates(): Promise<RatesPayload> {
  const res = await fetch(NBG_URL, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`NBG ${res.status}`);
  const data = (await res.json()) as Array<{
    date?: string;
    currencies?: NbgCurrency[];
  }>;
  const day = data?.[0];
  if (!day?.currencies?.length) throw new Error("NBG empty");

  const gelPerUnit: Record<string, number> = { GEL: 1 };
  for (const c of day.currencies) {
    if (!c.code || !c.quantity || !c.rate) continue;
    gelPerUnit[c.code.toUpperCase()] = c.rate / c.quantity;
  }

  return {
    source: "nbg",
    date: (day.date ?? new Date().toISOString()).slice(0, 10),
    gelPerUnit,
  };
}

const rates = new Hono();

rates.get("/", async (c) => {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_MS) {
    c.header("Cache-Control", "public, max-age=3600");
    return c.json(cache.payload);
  }

  try {
    const payload = await fetchNbgRates();
    cache = { at: now, payload };
    c.header("Cache-Control", "public, max-age=3600");
    return c.json(payload);
  } catch (err) {
    console.error("[rates] NBG fetch failed:", err);
    const payload = fallbackPayload();
    // Short cache on fallback so we retry sooner
    cache = { at: now - CACHE_MS + 15 * 60 * 1000, payload };
    c.header("Cache-Control", "public, max-age=300");
    return c.json(payload);
  }
});

export default rates;
