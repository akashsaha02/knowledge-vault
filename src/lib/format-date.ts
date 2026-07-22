import { formatDistanceToNow, format } from "date-fns";

export function formatRelativeTime(date: Date | string) {
  const value = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(value, { addSuffix: true });
}

export function formatFullDate(date: Date | string) {
  const value = typeof date === "string" ? new Date(date) : date;
  return format(value, "MMM d, yyyy 'at' h:mm a");
}
