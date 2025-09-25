/** ---------- Random & Sampling ---------- */
export const shuffle = <T>(arr: readonly T[]): T[] => {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const sample = <T>(arr: readonly T[], n: number): T[] =>
  shuffle(arr).slice(0, Math.max(0, Math.min(n, arr.length)));

export function fairSampleByKey<T, K extends string | number>(
  items: readonly T[],
  n: number,
  key: (x: T) => K,
  recent: readonly K[] = [],
  window = Math.max(5, n * 2),
): T[] {
  if (n <= 0 || items.length === 0) return [];
  const recentSlice = recent.slice(-window);
  const recentSet = new Set<K>(recentSlice);
  const fresh = items.filter((it) => !recentSet.has(key(it)));
  if (fresh.length >= n) return sample(fresh, n);
  const remainder = items.filter((it) => recentSet.has(key(it)));
  const out = [...shuffle(fresh), ...shuffle(remainder)];
  const seen = new Set<K>();
  const picked: T[] = [];
  for (const it of out) {
    const k = key(it);
    if (seen.has(k)) continue;
    seen.add(k);
    picked.push(it);
    if (picked.length >= n) break;
  }
  return picked;
}

export function weightedPickBy<T>(
  items: readonly T[],
  weight: (x: T) => number,
): T | undefined {
  if (!items.length) return undefined;
  const ws = items.map((it) => Math.max(0, Number(weight(it)) || 0));
  const total = ws.reduce((a, b) => a + b, 0);
  if (total <= 0) return undefined;
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= ws[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

export function weightedSampleBy<T>(
  items: readonly T[],
  n: number,
  weight: (x: T) => number,
  opts: { replacement?: boolean } = {},
): T[] {
  const replacement = opts.replacement ?? false;
  if (n <= 0 || items.length === 0) return [];

  if (replacement) {
    const out: T[] = [];
    for (let i = 0; i < n; i++) {
      const pick = weightedPickBy(items, weight);
      if (pick !== undefined) out.push(pick);
    }
    return out;
  }

  type Node = { item: T; key: number };
  const nodes: Node[] = [];
  for (const it of items) {
    const w = Math.max(0, Number(weight(it)) || 0);
    if (w <= 0) continue;
    const u = Math.random();
    const key = Math.log(u === 0 ? Number.EPSILON : u) / w;
    nodes.push({ item: it, key });
  }
  if (nodes.length === 0) return [];
  nodes.sort((a, b) => b.key - a.key);
  return nodes.slice(0, Math.min(n, nodes.length)).map((n) => n.item);
}
