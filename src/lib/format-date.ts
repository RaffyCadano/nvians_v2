import { format } from "date-fns";

/** Format a Postgres `DATE` string without UTC timezone shifting the day. */
export function formatCalendarDate(dateStr: string, pattern = "MMM d, yyyy") {
  const [year, month, day] = dateStr.split("-").map(Number);
  return format(new Date(year, month - 1, day), pattern);
}

export function formatCalendarDateRange(
  startDate: string,
  endDate: string | null,
  pattern = "MMMM d, yyyy",
) {
  const start = formatCalendarDate(startDate, pattern);
  if (!endDate || endDate === startDate) return start;

  const shortStart = formatCalendarDate(startDate, "MMM d");
  const end = formatCalendarDate(endDate, pattern);
  return `${shortStart} – ${end}`;
}
