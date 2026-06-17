const MONTHS = 6;

export type TrendPoint = { label: string; value: number };

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

export function buildStatusTrend<T extends { created_at: string; status: string }>(
  items: T[],
  status?: string,
): TrendPoint[] {
  const dates = items
    .filter((item) => !status || item.status === status)
    .map((item) => item.created_at);
  return buildMonthlyTrend(dates);
}

export function buildMonthlyAttendanceRate(
  records: { status: string; created_at: string }[],
): TrendPoint[] {
  const now = new Date();
  const points: TrendPoint[] = [];

  for (let i = MONTHS - 1; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const endOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59, 999);
    const label = monthDate.toLocaleDateString("en-PH", { month: "short" });
    const monthRecords = records.filter((record) => new Date(record.created_at) <= endOfMonth);
    const present = monthRecords.filter((record) => record.status === "present").length;
    const total = monthRecords.filter(
      (record) => record.status === "present" || record.status === "absent",
    ).length;
    const value = total > 0 ? Math.round((present / total) * 100) : 0;
    points.push({ label, value });
  }

  return points;
}
