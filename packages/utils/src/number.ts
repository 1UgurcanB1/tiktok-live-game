/** ---------- Number ---------- */
export const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

export const roundTo = (n: number, dp = 0) =>
  Math.round(n * 10 ** dp) / 10 ** dp;

export const toFixedNoTrail = (n: number, dp = 2) =>
  (+n.toFixed(dp)).toString();
