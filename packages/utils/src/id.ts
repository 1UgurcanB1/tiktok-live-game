/** ---------- IDs (ไม่พึ่ง crypto) ---------- */
export const randomId = (len = 16) => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < len; i++)
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
};
