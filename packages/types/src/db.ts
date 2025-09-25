/* =========================
 * Connections
 * ========================= */

export type DBStatusEvent = {
  type: "db.status";
  env: string;
  connected: boolean;
  error?: string;
  timestamp: string;
};
