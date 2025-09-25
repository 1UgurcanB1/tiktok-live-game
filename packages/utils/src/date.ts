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
