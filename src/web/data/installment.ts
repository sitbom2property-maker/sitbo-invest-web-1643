/** Remaining 0% months as of `anchorYm` (`YYYY-MM`). Drops by 1 each calendar month. */
export function remainingInstallmentMonths(
  startMonths: number,
  anchorYm: string,
  now = new Date(),
): number {
  const [year, month] = anchorYm.split("-").map(Number);
  if (!year || !month) return Math.max(0, startMonths);
  const elapsed = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month);
  return Math.max(0, startMonths - Math.max(0, elapsed));
}

function monthsRu(n: number): string {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return "месяц";
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return "месяца";
  return "месяцев";
}

export function formatInstallmentLine(downPct: number, months: number, ru: boolean): string {
  if (ru) return `${downPct}% взнос / 0% на ${months} ${monthsRu(months)}`;
  return `${downPct}% down / 0% over ${months} month${months === 1 ? "" : "s"}`;
}
