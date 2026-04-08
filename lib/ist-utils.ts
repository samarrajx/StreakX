import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const IST = "Asia/Kolkata";

export function getTodayIST(): string {
  return format(toZonedTime(new Date(), IST), "yyyy-MM-dd");
}

export function formatDateIST(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(toZonedTime(d, IST), "yyyy-MM-dd");
}

export function formatTimeIST(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(toZonedTime(d, IST), "hh:mm a");
}

export function getLastNDaysIST(n: number): string[] {
  const now = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (n - 1 - i));
    return format(toZonedTime(d, IST), "yyyy-MM-dd");
  });
}

export function formatDisplayDate(dateStr: string): string {
  return format(parseISO(dateStr), "EEE, MMM d");
}

export function isToday(dateStr: string): boolean {
  return dateStr === getTodayIST();
}

export function getDayOfWeek(dateStr: string): string {
  return format(parseISO(dateStr), "EEE");
}

export function getDayNumber(dateStr: string): string {
  return format(parseISO(dateStr), "d");
}

export function getMonthName(dateStr: string): string {
  return format(parseISO(dateStr), "MMM");
}
