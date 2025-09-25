import { TikTokLiveService } from "../tiktok.js";
import { SimulatedTikTokConnection } from "./tiktok.sim.js";
import { env } from "../env.js";
import type {
  ChatEventData,
  FollowEventData,
  GiftEventData,
  LikeEventData,
  ShareEventData,
  SocialEventData,
} from "@tiktok/types";

type EventMap = {
  chat: ChatEventData;
  gift: GiftEventData;
  follow: FollowEventData;
  share: ShareEventData;
  like: LikeEventData;
  social: SocialEventData;
  streamEnd: unknown;
  disconnected: unknown;
};

type Listener<E extends keyof EventMap> = (ev: EventMap[E]) => void;

export type TikTokMode = "real" | "sim";

class TikTokSwitchingService {
  private real = new TikTokLiveService();
  private sim: SimulatedTikTokConnection | null = null;
  private _username: string | null = null;
  private _roomId: string | null = null;
  private _mode: TikTokMode = env.TIKTOK_MODE;
  private listeners: Partial<
    Record<keyof EventMap, Array<(v: unknown) => void>>
  > = {};

  get connected() {
    return this._mode === "real" ? this.real.connected : Boolean(this.sim);
  }
  get username() {
    return this._username;
  }
  get roomId() {
    return this._roomId;
  }
  get mode() {
    return this._mode;
  }

  async connect(username: string, mode?: TikTokMode) {
    await this.disconnect();
    this._mode = mode ?? env.TIKTOK_MODE;
    if (this._mode === "real") {
      const r = await this.real.connect(username);
      this._username = this.real.username ?? username;
      this._roomId = r.roomId?.toString?.() ?? null;
      this.real.on?.("disconnected", () => {
        this._username = null;
        this._roomId = null;
      });
      this.real.on?.("streamEnd", () => {
        this._username = null;
        this._roomId = null;
      });
      // map social -> follow/share if underlying lib emits 'social'
      this.real.on?.("social", (data: SocialEventData) => {
        const disp = (data.displayType ?? data.label ?? "")
          .toString()
          .toLowerCase();
        if (disp.includes("follow")) {
          for (const cb of this.listeners.follow || [])
            (cb as (v: SocialEventData) => void)(data);
        } else if (disp.includes("share")) {
          for (const cb of this.listeners.share || [])
            (cb as (v: SocialEventData) => void)(data);
        }
      });
      // attach stored listeners to real connection
      this.listeners.chat?.forEach((cb) =>
        this.real.on("chat", cb as (v: ChatEventData) => void),
      );
      this.listeners.gift?.forEach((cb) =>
        this.real.on("gift", cb as (v: GiftEventData) => void),
      );
      this.listeners.like?.forEach((cb) =>
        this.real.on("like", cb as (v: LikeEventData) => void),
      );
      return { roomId: this._roomId };
    } else {
      this.sim = new SimulatedTikTokConnection(username);
      const r = await this.sim.connect();
      this._username = username;
      this._roomId = r.roomId?.toString?.() ?? null;
      this.sim.on("disconnected", () => {
        this._username = null;
        this._roomId = null;
        this.sim = null;
      });
      // attach stored listeners to sim connection
      if (this.sim) {
        this.listeners.chat?.forEach((cb) =>
          this.sim?.on("chat", cb as (v: ChatEventData) => void),
        );
        this.listeners.gift?.forEach((cb) =>
          this.sim?.on("gift", cb as (v: GiftEventData) => void),
        );
        this.listeners.follow?.forEach((cb) =>
          this.sim?.on("follow", cb as (v: FollowEventData) => void),
        );
        this.listeners.share?.forEach((cb) =>
          this.sim?.on("share", cb as (v: ShareEventData) => void),
        );
        this.listeners.like?.forEach((cb) =>
          this.sim?.on("like", cb as (v: LikeEventData) => void),
        );
      }
      return { roomId: this._roomId };
    }
  }

  async disconnect() {
    if (this._mode === "real") {
      await this.real.disconnect();
    } else if (this.sim) {
      await this.sim.disconnect();
      this.sim = null;
    }
    this._username = null;
    this._roomId = null;
  }

  on<E extends keyof EventMap>(event: E, cb: Listener<E>) {
    // store only; will be attached when connect() is called
    if (!this.listeners[event])
      this.listeners[event] = [] as Array<(v: unknown) => void>;
    const arr = this.listeners[event] as Array<(v: unknown) => void>;
    arr.push(cb as unknown as (v: unknown) => void);
  }
}

// สร้าง instance กลางให้ controller และ server ใช้ร่วมกัน
export const tiktok = new TikTokSwitchingService();
