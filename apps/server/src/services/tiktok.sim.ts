import {
  ChatEventData,
  GiftEventData,
  FollowEventData,
  ShareEventData,
} from "@tiktok/types";
import { randomId, sleep } from "@tiktok/utils";

type EventMap = {
  chat: ChatEventData;
  gift: GiftEventData;
  follow: FollowEventData;
  share: ShareEventData;
  streamEnd: unknown;
  disconnected: unknown;
};

type Listener<E extends keyof EventMap> = (ev: EventMap[E]) => void;

export class SimulatedTikTokConnection {
  private username: string;
  private roomId: string;
  private timers: NodeJS.Timeout[] = [];
  // ใช้โครงสร้างแบบหลวมเพื่อเลี่ยงปัญหา inferred never[]
  private listeners: Partial<
    Record<keyof EventMap, Array<(ev: unknown) => void>>
  > = {};
  private running = false;

  constructor(username: string) {
    this.username = username;
    this.roomId = Math.floor(Math.random() * 10_000_000).toString();
  }

  async connect() {
    this.running = true;
    // kick off event generators
    this.spawnChatLoop();
    this.spawnGiftLoop();
    this.spawnShareLoop();
    this.spawnFollowLoop();
    return { roomId: this.roomId };
  }

  async disconnect() {
    this.running = false;
    for (const t of this.timers) clearTimeout(t);
    this.timers = [];
    this.emit("disconnected", undefined as unknown as never);
  }

  on<E extends keyof EventMap>(event: E, cb: Listener<E>) {
    if (!this.listeners[event])
      this.listeners[event] = [] as Array<(ev: unknown) => void>;
    const arr = this.listeners[event]!;
    arr.push(cb as unknown as (ev: unknown) => void);
  }

  private emit<E extends keyof EventMap>(event: E, data: EventMap[E]) {
    for (const cb of this.listeners[event] || [])
      (cb as (ev: EventMap[E]) => void)(data);
  }

  private spawnChatLoop() {
    const run = async () => {
      while (this.running) {
        const delay = randInt(500, 2500);
        await sleep(delay);
        if (!this.running) break;
        const data: ChatEventData = {
          userId: randUserId(),
          secUid: randomId(24),
          uniqueId: `user_${randInt(1000, 9999)}`,
          nickname:
            pick([
              "Alice",
              "Bob",
              "Carol",
              "Dave",
              "Eve",
              "Mallory",
              "Oscar",
              "Peggy",
            ]) + randSuffix(),
          profilePictureUrl: null,
          comment: pick([
            "สวัสดีครับ",
            "สู้ๆ นะ",
            "แจกของหน่อย",
            "เกมอะไรครับ",
            "5555",
            "Nice!",
          ]),
          createTime: Date.now().toString(),
        };
        this.emit("chat", data);
      }
    };
    // fire and forget
    run();
  }

  private spawnGiftLoop() {
    const run = async () => {
      while (this.running) {
        const delay = randInt(3000, 7000);
        await sleep(delay);
        if (!this.running) break;
        const repeat = pick([1, 1, 1, 2, 3]);
        const giftId = pick([5655, 5650, 7002, 7099]);
        const diamonds = pick([1, 1, 5, 10, 20]);
        const data: GiftEventData = {
          userId: randUserId(),
          secUid: randomId(24),
          uniqueId: `user_${randInt(1000, 9999)}`,
          nickname: pick(["VIP", "Donor", "RichBoy", "Angel"]) + randSuffix(),
          profilePictureUrl: null,
          giftId,
          repeatCount: repeat,
          repeatEnd: true,
          giftType: 1,
          diamondCount: diamonds,
          giftName: `Gift#${giftId}`,
          giftPictureUrl: "",
          timestamp: Date.now(),
        };
        this.emit("gift", data);
      }
    };
    run();
  }

  private spawnShareLoop() {
    const run = async () => {
      while (this.running) {
        const delay = randInt(4000, 9000);
        await sleep(delay);
        if (!this.running) break;
        const base = {
          userId: randUserId(),
          secUid: randomId(24),
          uniqueId: `user_${randInt(1000, 9999)}`,
          nickname: pick(["Fan", "Viewer", "Guest"]) + randSuffix(),
          profilePictureUrl: null,
          createTime: Date.now().toString(),
        };
        this.emit("share", { ...base } as ShareEventData);
      }
    };
    run();
  }

  private spawnFollowLoop() {
    const run = async () => {
      while (this.running) {
        const delay = randInt(5000, 11000);
        await sleep(delay);
        if (!this.running) break;
        const base = {
          userId: randUserId(),
          secUid: randomId(24),
          uniqueId: `user_${randInt(1000, 9999)}`,
          nickname: pick(["Fan", "Viewer", "Guest"]) + randSuffix(),
          profilePictureUrl: null,
          createTime: Date.now().toString(),
        };
        this.emit("follow", { ...base } as FollowEventData);
      }
    };
    run();
  }
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randUserId() {
  return randInt(10000000, 99999999).toString();
}
function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randSuffix() {
  return Math.random() < 0.2 ? randInt(1, 99).toString() : "";
}
