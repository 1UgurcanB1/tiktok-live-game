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
