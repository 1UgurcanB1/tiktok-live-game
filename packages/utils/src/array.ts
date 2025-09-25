/** ---------- Array ---------- */
export const uniqBy = <T>(arr: T[], key: (x: T) => string | number) => {
  const m = new Map<string | number, T>();
  for (const it of arr) {
    const k = key(it);
    if (!m.has(k)) m.set(k, it);
  }
  return [...m.values()];
};

export const groupBy = <T, K extends string | number | symbol>(
  arr: T[],
  key: (x: T) => K,
): Record<K, T[]> =>
  arr.reduce(
    (acc, it) => {
      const k = key(it);
      (acc[k] ||= []).push(it);
      return acc;
    },
    {} as Record<K, T[]>,
  );

export const chunk = <T>(arr: T[], size: number) => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};
