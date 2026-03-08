/**
 * Format pace from seconds per km to "M:SS /km".
 * e.g. 330 → "5:30 /km"
 */
export function formatPace(secPerKm: number): string {
  if (!secPerKm || secPerKm <= 0) return "--:-- /km";
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}:${String(s).padStart(2, "0")} /km`;
}

/**
 * Calculate pace from distance (meters) and duration (seconds).
 * Returns seconds per kilometer.
 */
export function calculatePace(
  distanceMeters: number,
  durationSec: number
): number {
  if (!distanceMeters || distanceMeters <= 0) return 0;
  const km = distanceMeters / 1000;
  return durationSec / km;
}
