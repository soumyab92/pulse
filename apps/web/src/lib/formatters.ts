import { format, formatDistanceToNow, isPast, isValid, parseISO } from "date-fns";

function toDate(value: string | Date) {
  return typeof value === "string" ? parseISO(value) : value;
}

export function formatDate(value: string | Date | null | undefined, pattern = "MMM d, yyyy") {
  if (!value) return "—";
  const date = toDate(value);
  return isValid(date) ? format(date, pattern) : "—";
}

export function formatRelativeTime(value: string | Date) {
  const date = toDate(value);
  if (!isValid(date)) return "—";
  return formatDistanceToNow(date, { addSuffix: true });
}

export function isOverdue(dueDate: string | Date | null | undefined, status: string) {
  if (!dueDate || status === "completed") return false;
  const date = toDate(dueDate);
  return isValid(date) && isPast(date);
}

export function formatHours(hours: number | null | undefined) {
  if (hours == null) return "—";
  return `${hours}h`;
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
