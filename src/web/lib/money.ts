export type CurrencyCode = "USD" | "EUR" | "GBP" | "GEL" | "RUB" | "AED" | "TRY";

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  GEL: "₾",
  RUB: "₽",
  AED: "د.إ",
  TRY: "₺",
};

export type RatesState = {
  source: "nbg" | "fallback" | "loading";
  date: string;
  gelPerUnit: Record<string, number>;
};

export const DEFAULT_RATES: RatesState = {
  source: "fallback",
  date: "",
  gelPerUnit: {
    GEL: 1,
    USD: 2.71,
    EUR: 2.95,
    GBP: 3.45,
    RUB: 0.031,
    AED: 0.74,
    TRY: 0.08,
  },
};

/** Convert amount from one currency to another via GEL pivot (NBG). */
export function convertAmount(
  amount: number,
  from: string,
  to: string,
  gelPerUnit: Record<string, number>
): number {
  const fromCode = from.toUpperCase();
  const toCode = to.toUpperCase();
  if (!Number.isFinite(amount)) return 0;
  if (fromCode === toCode) return amount;

  const fromRate = gelPerUnit[fromCode];
  const toRate = gelPerUnit[toCode];
  if (!fromRate || !toRate) return amount;

  const inGel = amount * fromRate;
  return inGel / toRate;
}

export function convertFromUSD(
  amountUSD: number,
  to: string,
  gelPerUnit: Record<string, number>
): number {
  return convertAmount(amountUSD, "USD", to, gelPerUnit);
}

export function formatMoney(
  amount: number,
  currency: string,
  language: string = "en",
  opts?: { compact?: boolean; maximumFractionDigits?: number }
): string {
  const code = currency.toUpperCase();
  const locale = language === "ru" ? "ru-RU" : "en-US";
  const symbol = CURRENCY_SYMBOLS[code] ?? `${code} `;
  const digits = opts?.maximumFractionDigits ?? (Math.abs(amount) >= 100 ? 0 : 2);

  try {
    const formatted = new Intl.NumberFormat(locale, {
      maximumFractionDigits: digits,
      minimumFractionDigits: 0,
    }).format(Math.round(amount * Math.pow(10, digits)) / Math.pow(10, digits));

    // Symbol before for most; RUB often after in RU — keep symbol before for consistency
    if (code === "GEL" || code === "RUB") {
      return language === "ru" ? `${formatted} ${symbol}` : `${symbol}${formatted}`;
    }
    return `${symbol}${formatted}`;
  } catch {
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  }
}

export function formatFromUSD(
  amountUSD: number,
  currency: string,
  language: string,
  gelPerUnit: Record<string, number>,
  opts?: { prefix?: string }
): string {
  const converted = convertFromUSD(amountUSD, currency, gelPerUnit);
  const money = formatMoney(converted, currency, language);
  return opts?.prefix ? `${opts.prefix}${money}` : money;
}
