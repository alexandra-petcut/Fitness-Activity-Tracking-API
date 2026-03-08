/**
 * Format meters into a human-readable distance string.
 * e.g. 5234 → "5.23 km", 800 → "800 m"
 */
export function formatDistance(meters: number | null | undefined): string {
  if (meters == null || meters <= 0) return "0 m";
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(2)} km`;
}

/**
 * Format speed from m/s to km/h.
 * e.g. 2.78 → "10.0 km/h"
 */
export function formatSpeed(mps: number): string {
  if (!mps || mps <= 0) return "0 km/h";
  return `${(mps * 3.6).toFixed(1)} km/h`;
}
