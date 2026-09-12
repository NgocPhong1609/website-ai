/** Round API duration copy like "1.03333333333 phút học" for display. */
export function formatStudyDuration(description: string): string {
  const match = description.match(/^(\d+(?:\.\d+)?)\s*phút học$/i);
  if (!match) return description;

  const minutes = Number(match[1]);
  if (!Number.isFinite(minutes)) return description;

  const rounded = Math.round(minutes * 10) / 10;
  const label = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return `${label} phút học`;
}
