import { format, formatDistanceToNow } from "date-fns";

type TimestampLike =
  | { toDate(): Date }
  | { seconds: number; nanoseconds?: number }
  | { _seconds: number; _nanoseconds?: number };

export function toDate(ts: TimestampLike): Date {
  if ("toDate" in ts && typeof (ts as { toDate?: unknown }).toDate === "function") {
    return (ts as { toDate(): Date }).toDate();
  }
  if ("seconds" in ts) return new Date((ts as { seconds: number }).seconds * 1000);
  if ("_seconds" in ts) return new Date((ts as { _seconds: number })._seconds * 1000);
  return new Date();
}

export function formatTournamentDate(ts: TimestampLike): string {
  return format(toDate(ts), "dd MMM yyyy, hh:mm a");
}

export function formatShortDate(ts: TimestampLike): string {
  return format(toDate(ts), "dd MMM yyyy");
}

export function timeAgo(ts: TimestampLike): string {
  return formatDistanceToNow(toDate(ts), { addSuffix: true });
}
