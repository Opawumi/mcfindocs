import {
  format,
  formatDistance,
  formatRelative,
  isValid,
  parseISO,
} from "date-fns";

/**
 * Format a date to a readable string
 * @param date - Date object, string, or timestamp
 * @param formatStr - Format string (default: 'MMM dd, yyyy')
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  formatStr: string = "MMM dd, yyyy"
): string {
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);

  if (!isValid(dateObj)) {
    return "Invalid date";
  }

  return format(dateObj, formatStr);
}

/**
 * Format a date to a relative time string (e.g., "2 hours ago")
 * @param date - Date object, string, or timestamp
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string | number): string {
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);

  if (!isValid(dateObj)) {
    return "Invalid date";
  }

  return formatDistance(dateObj, new Date(), { addSuffix: true });
}

/**
 * Format a date to a relative date string (e.g., "yesterday at 3:20 PM")
 * @param date - Date object, string, or timestamp
 * @returns Relative date string
 */
export function formatRelativeDate(date: Date | string | number): string {
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);

  if (!isValid(dateObj)) {
    return "Invalid date";
  }

  return formatRelative(dateObj, new Date());
}

/**
 * Format a date and time
 * @param date - Date object, string, or timestamp
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date | string | number): string {
  return formatDate(date, "MMM dd, yyyy HH:mm");
}

/**
 * Format a time only
 * @param date - Date object, string, or timestamp
 * @returns Formatted time string
 */
export function formatTime(date: Date | string | number): string {
  return formatDate(date, "HH:mm");
}
