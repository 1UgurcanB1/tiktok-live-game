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
    if (this.conn) await this.disconnect();

    this._username = username;
    this.conn = new WebcastPushConnection(username);

    const state = await this.conn.connect(); // { roomId: string | number }
    this._roomId = String(state.roomId);
    return state;
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
