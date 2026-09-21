/**
 * Minimal class-name joiner. Deliberately dependency-free: every kilobyte of JS
 * counts on a 3G connection in the middle of a coffee farm.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
