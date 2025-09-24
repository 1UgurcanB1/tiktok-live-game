import { ChatEventData, GiftEventData } from "@tiktok/types";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

/** ระบุรูปแบบ event ที่เราสนใจ (ใส่โครงเท่าที่ใช้) */
type EventMap = {
  chat: ChatEventData;
  gift: GiftEventData;
  streamEnd: unknown;
  disconnected: unknown;
};

/** สัญญา (Contract) ขั้นต่ำของคอนเนกชันที่เราต้องใช้จาก lib จริง */
type WebcastConn = {
  connect(): Promise<{ roomId: string | number }>;
  disconnect?: () => Promise<void> | void;
  on?: <E extends keyof EventMap>(
    event: E,
    cb: (ev: EventMap[E]) => void,
  ) => void;
};

/** ตัวสร้างของคอนเนกชันจากไลบรารี */
type WebcastCtor = new (username: string) => WebcastConn;

// อิมพอร์ตแบบประกาศชนิดให้ชัด (หลีกเลี่ยง any)

const { WebcastPushConnection } = require("tiktok-live-connector") as {
  WebcastPushConnection: WebcastCtor;
};

export class TikTokLiveService {
  private conn: WebcastConn | null = null;
  private _username: string | null = null;
  private _roomId: string | null = null;

  get username() {
    return this._username;
  }
  get roomId() {
    return this._roomId;
  }
  get connected() {
    return this.conn !== null;
  }

  async connect(username: string) {
    // If there was an existing connection, tear it down first
    if (this.conn) await this.disconnect();

    // Prepare a new connection but don't mark as connected yet
    const pending = new WebcastPushConnection(username);
    try {
      const state = await pending.connect(); // { roomId: string | number }

      // Bind lifecycle events to keep internal state in sync
      pending.on?.("disconnected", () => {
        this.conn = null;
        this._roomId = null;
        this._username = null;
      });
      pending.on?.("streamEnd", () => {
        this.conn = null;
        this._roomId = null;
        this._username = null;
      });

      // Mark as connected only after success
      this.conn = pending;
      this._username = username;
      this._roomId = String(state.roomId);
      return state;
    } catch (e) {
      // Ensure we don't leave a half-open state
      try {
        await pending.disconnect?.();
      } catch {
        // ignore
      }
      this.conn = null;
      this._username = null;
      this._roomId = null;
      throw e;
    }
  }

  async disconnect() {
    if (!this.conn) return;
    try {
      await this.conn.disconnect?.();
    } catch {
      // ป้องกัน no-empty: ใส่ statement เล็กน้อย
      void 0;
    }
    this.conn = null;
    this._roomId = null;
    this._username = null;
  }

  on<E extends keyof EventMap>(event: E, cb: (ev: EventMap[E]) => void) {
    this.conn?.on?.(event, cb);
  }
}
