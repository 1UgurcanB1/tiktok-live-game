/** ---------- Date & Time ---------- */
export const toISO = (d: Date | number | string = new Date()) =>
  new Date(d).toISOString();

export const fromUnix = (sec: number) => new Date(sec * 1000);

export const formatTZ = (
  input: Date | string | number,
  timeZone = "Asia/Bangkok",
  opts: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  },
) =>
  new Intl.DateTimeFormat("th-TH", { timeZone, ...opts }).format(
    new Date(input),
  );

export const elapsed = (
  from: Date | string | number,
  to: Date | string | number = Date.now(),
) => Math.max(0, new Date(to).getTime() - new Date(from).getTime());

export const timeago = (ts: Date | string | number) => {
  const ms = Date.now() - new Date(ts).getTime();
  const sec = Math.round(ms / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h`;
  const d = Math.round(hr / 24);
  return `${d}d`;
};

/** ---------- Number ---------- */
export const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

export const roundTo = (n: number, dp = 0) =>
  Math.round(n * 10 ** dp) / 10 ** dp;

export const toFixedNoTrail = (n: number, dp = 2) =>
  (+n.toFixed(dp)).toString();

/** ---------- String ---------- */
export const capitalize = (s: string) =>
  s ? s[0].toUpperCase() + s.slice(1) : s;

export const titleCase = (s: string) =>
  s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());

export const slugify = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const truncate = (s: string, len: number, end = "…") =>
  s.length <= len ? s : s.slice(0, Math.max(0, len - end.length)) + end;

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

/** ---------- Promise helpers ---------- */
export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function withTimeout<T>(
  p: Promise<T>,
  ms: number,
  msg = "Timeout",
) {
  let t: any;
  const timeout = new Promise<never>(
    (_, rej) => (t = setTimeout(() => rej(new Error(msg)), ms)),
  );
  try {
    return await Promise.race([p, timeout]);
  } finally {
    clearTimeout(t);
  }
}

export async function retry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  delayMs = 300,
  onError?: (e: any, i: number) => void,
): Promise<T> {
  let last: any;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      onError?.(e, i);
      if (i < attempts) await sleep(delayMs * i);
    }
  }
  throw last;
}

/** ---------- IDs (ไม่พึ่ง crypto) ---------- */
export const randomId = (len = 16) => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < len; i++)
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
};
