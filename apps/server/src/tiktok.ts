import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { WebcastPushConnection } = require("tiktok-live-connector");

type Listener = (ev: any) => void;

export class TikTokLiveService {
  private conn: any | null = null;
  private _username: string | null = null;
  private _roomId: string | null = null;

  get username() { return this._username; }
  get roomId() { return this._roomId; }
  get connected() { return !!this.conn; }

  async connect(username: string) {
    if (this.conn) await this.disconnect();
    this._username = username;
    this.conn = new WebcastPushConnection(username);

    // return state with roomId
    const state = await this.conn.connect();
    this._roomId = String(state.roomId);
    return state;
  }

  async disconnect() {
    if (!this.conn) return;
    try { await this.conn.disconnect?.(); } catch {}
    this.conn = null;
    this._roomId = null;
    this._username = null;
  }

  on(event: "chat" | "gift" | "streamEnd" | "disconnected", cb: Listener) {
    this.conn?.on?.(event, cb);
  }
}
