import type { TrendPoint } from "./stats-line-chart";

const MONTHS = 6;

export function buildMonthlyTrend(dates: string[]): TrendPoint[] {
  const now = new Date();
  const points: TrendPoint[] = [];

  for (let i = MONTHS - 1; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const endOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59, 999);
    const label = monthDate.toLocaleDateString("en-PH", { month: "short" });
    const value = dates.filter((d) => new Date(d) <= endOfMonth).length;
    points.push({ label, value });
  }

  return points;
}
