import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validates and normalizes time format to HH:MM
 * @param time - Time string to validate
 * @returns Normalized time string or null if invalid
 */
export function validateAndNormalizeTime(
  time: string | undefined | null,
): string | null {
  if (!time) return null;

  const cleanTime = time.trim();

  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

  if (!timeRegex.test(cleanTime)) {
    return null;
  }

  const [hours, minutes] = cleanTime.split(":");
  const normalizedHours = hours!.padStart(2, "0");
  const normalizedMinutes = minutes!.padStart(2, "0");

  return `${normalizedHours}:${normalizedMinutes}`;
}

/**
 * Validates if a time string is in proper HH:MM format
 * @param time - Time string to validate
 * @returns true if valid, false otherwise
 */
export function isValidTimeFormat(time: string | undefined | null): boolean {
  return validateAndNormalizeTime(time) !== null;
}
