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
