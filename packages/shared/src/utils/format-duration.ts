/**
 * Format seconds into human-readable duration.
 * e.g. 3661 → "1h 1m 1s", 125 → "2m 5s"
 */
export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

/**
 * Format seconds into HH:MM:SS.
 * e.g. 3661 → "01:01:01"
 */
export function formatDurationHMS(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}
