import type {
  ChatEventData,
  GiftEventData,
  FollowEventData,
  ShareEventData,
  LikeEventData,
} from "@tiktok/types";
import { randomId, sleep } from "@tiktok/utils";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type EventMap = {
  chat: ChatEventData;
  gift: GiftEventData;
  follow: FollowEventData;
  share: ShareEventData;
  like: LikeEventData;
  streamEnd: unknown;
  disconnected: unknown;
};

type Listener<E extends keyof EventMap> = (ev: EventMap[E]) => void;

export class SimulatedTikTokConnection {
  private username: string;
  private roomId: string;
  private timers: NodeJS.Timeout[] = [];
  private listeners: Partial<
    Record<keyof EventMap, Array<(ev: unknown) => void>>
  > = {};
  private running = false;
  private chatMessages: string[] = [];
  private names: string[] = [];
  private totalLikeCount = 0;

  constructor(username: string) {
    this.username = username;
    this.roomId = Math.floor(Math.random() * 10_000_000).toString();
  }

  async connect() {
    // Load mock files async on first connect
    if (this.chatMessages.length === 0 || this.names.length === 0) {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const envRoot = process.env.TIKTOK_SERVER_ROOT?.trim();
      const serverRoot =
        envRoot && envRoot.length
          ? path.isAbsolute(envRoot)
            ? envRoot
            : path.resolve(process.cwd(), envRoot)
          : await findNearestPackageJsonDir(__dirname);
      const mockDir = path.join(serverRoot, "mock");
      const fromServerRoot = (p?: string) =>
        p ? (path.isAbsolute(p) ? p : path.resolve(serverRoot, p)) : undefined;

      const chatCandidates = [
        fromServerRoot(process.env.TIKTOK_SIM_CHAT_FILE),
        path.join(mockDir, "tiktok_chat_messages.txt"),
      ].filter(Boolean) as string[];
      this.chatMessages = await loadFirstExistingAsync(chatCandidates, [
        "สวัสดีครับ",
        "สู้ๆ นะ",
        "แจกของหน่อย",
        "เกมอะไรครับ",
        "5555",
        "Nice!",
        "Let's go!",
        "สุดยอด",
      ]);

      const nameCandidates = [
        fromServerRoot(process.env.TIKTOK_SIM_NAMES_FILE),
        path.join(mockDir, "tiktok_names.txt"),
      ].filter(Boolean) as string[];
      this.names = await loadFirstExistingAsync(nameCandidates, [
        "Alice",
        "Bob",
        "Carol",
        "Dave",
        "Eve",
        "Mallory",
        "Oscar",
        "Peggy",
        "Victor",
        "Walter",
        "Trudy",
        "Sybil",
        "Grace",
        "Heidi",
        "Ivan",
        "Judy",
      ]);
    }

    this.running = true;
    this.spawnChatLoop();
    this.spawnGiftLoop();
    this.spawnShareLoop();
    this.spawnFollowLoop();
    this.spawnLikeLoop();
    return { roomId: this.roomId };
  }

  async disconnect() {
    this.running = false;
    for (const t of this.timers) clearTimeout(t);
    this.timers = [];
    this.emit("disconnected", undefined as unknown as never);
  }

  on<E extends keyof EventMap>(event: E, cb: Listener<E>) {
    const arr: Array<(ev: unknown) => void> = this.listeners[event] ?? [];
    arr.push(cb as unknown as (ev: unknown) => void);
    this.listeners[event] = arr;
  }

  private emit<E extends keyof EventMap>(event: E, data: EventMap[E]) {
    const arr = this.listeners[event] || [];
    for (const cb of arr) (cb as (ev: EventMap[E]) => void)(data);
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
          nickname: pick(this.names) + randSuffix(),
          profilePictureUrl: null,
          comment: pick(this.chatMessages),
          createTime: Date.now().toString(),
        };
        this.emit("chat", data);
      }
    };
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
          nickname: pick(this.names) + randSuffix(),
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
          nickname: pick(this.names) + randSuffix(),
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
          nickname: pick(this.names) + randSuffix(),
          profilePictureUrl: null,
          createTime: Date.now().toString(),
        };
        this.emit("follow", { ...base } as FollowEventData);
      }
    };
    run();
  }

  private spawnLikeLoop() {
    const run = async () => {
      while (this.running) {
        const delay = randInt(300, 1200);
        await sleep(delay);
        if (!this.running) break;
        const likeCount = pick([1, 1, 1, 2, 2, 3, 5, 10]);
        this.totalLikeCount += likeCount;
        const data: LikeEventData = {
          userId: randUserId(),
          secUid: randomId(24),
          uniqueId: `user_${randInt(1000, 9999)}`,
          nickname: pick(this.names) + randSuffix(),
          profilePictureUrl: null,
          likeCount,
          totalLikeCount: this.totalLikeCount,
          msgId: randomId(12),
          createTime: Date.now().toString(),
        };
        this.emit("like", data);
      }
    };
    run();
  }
}

async function loadFirstExistingAsync(
  paths: string[],
  fallback: string[],
): Promise<string[]> {
  for (const p of paths) {
    try {
      if (!p) continue;
      const raw = await fs.promises.readFile(p, "utf8");
      const lines = raw
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter((s) => s && !s.startsWith("#"));
      if (lines.length) return lines;
    } catch {
      // try next
    }
  }
  return fallback;
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

async function findNearestPackageJsonDir(startDir: string): Promise<string> {
  let dir = startDir;
  const root = path.parse(dir).root;
  while (true) {
    try {
      await fs.promises.access(path.join(dir, "package.json"));
      return dir;
    } catch {
      const parent = path.dirname(dir);
      if (parent === dir || dir === root) break;
      dir = parent;
    }
  }
  // fallback to startDir if not found
  return startDir;
}
