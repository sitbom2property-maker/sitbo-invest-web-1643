import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_RATES, type RatesState } from "../lib/money";
import { useLocale } from "./LocaleContext";
import { formatFromUSD, formatMoney, convertFromUSD, convertAmount } from "../lib/money";

type RatesContextValue = RatesState & {
  ready: boolean;
  convertFromUSD: (amountUSD: number, to?: string) => number;
  formatFromUSD: (amountUSD: number, opts?: { prefix?: string }) => string;
  formatAmount: (amount: number, currency?: string) => string;
  convert: (amount: number, from: string, to?: string) => number;
};

const RatesContext = createContext<RatesContextValue | null>(null);

export function RatesProvider({ children }: { children: ReactNode }) {
  const { currency, language } = useLocale();
  const [rates, setRates] = useState<RatesState>({ ...DEFAULT_RATES, source: "loading" });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/rates");
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as {
          source: "nbg" | "fallback";
          date: string;
          gelPerUnit: Record<string, number>;
        };
        if (!cancelled) {
          setRates({
            source: data.source,
            date: data.date,
            gelPerUnit: { ...DEFAULT_RATES.gelPerUnit, ...data.gelPerUnit },
          });
          setReady(true);
        }
      } catch {
        if (!cancelled) {
          setRates(DEFAULT_RATES);
          setReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<RatesContextValue>(
    () => ({
      ...rates,
      ready,
      convertFromUSD: (amountUSD: number, to = currency) =>
        convertFromUSD(amountUSD, to, rates.gelPerUnit),
      formatFromUSD: (amountUSD: number, opts) =>
        formatFromUSD(amountUSD, currency, language, rates.gelPerUnit, opts),
      formatAmount: (amount: number, cur = currency) => formatMoney(amount, cur, language),
      convert: (amount: number, from: string, to = currency) =>
        convertAmount(amount, from, to, rates.gelPerUnit),
    }),
    [rates, ready, currency, language]
  );

  return <RatesContext.Provider value={value}>{children}</RatesContext.Provider>;
}

export function useRates() {
  const ctx = useContext(RatesContext);
  if (!ctx) {
    throw new Error("useRates must be used within RatesProvider");
  }
  return ctx;
}
