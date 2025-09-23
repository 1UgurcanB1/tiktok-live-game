// apps/web/src/services/ws.ts

// ---------- Event Bus (typed, no any/Function) ----------
type Handler<T> = (payload: T) => void;

class EventBus {
  private map = new Map<string, Set<Handler<unknown>>>();

  on<T>(type: string, h: Handler<T>): () => void {
    const set = this.map.get(type) ?? new Set<Handler<unknown>>();
    set.add(h as unknown as Handler<unknown>);
    this.map.set(type, set);
    return () => {
      set.delete(h as unknown as Handler<unknown>); // cleanup returns void
    };
  }

  emit<T>(type: string, payload: T): void {
    const set = this.map.get(type);
    set?.forEach((fn) => (fn as Handler<T>)(payload));
  }
}

export const events = new EventBus();

// ---------- รูปแบบอีเวนต์จากเซิร์ฟเวอร์ ----------
export type ServerEvent =
  | {
      type: "health";
      db: { connected: boolean };
      tiktok: { connected: boolean; username?: string };
    }
  | { type: "state_changed"; status: string; currentRound: number }
  | { type: "score_update"; scores: Array<{ userId: string; total: number }> }
  | { type: string; [k: string]: unknown };

// ---------- WS client (typed) ----------
class WSClient {
  private ws: WebSocket | null = null;
  private url = "";
  private retry = 0;
  private timer: number | null = null;

  connect(url: string): void {
    this.url = url;
    this.open();
  }

  private open(): void {
    if (!this.url) return;

    if (this.ws) this.ws.close();
    this.ws = new WebSocket(this.url);

    this.ws.addEventListener("open", () => {
      this.retry = 0;
      events.emit("ws_open", {} as unknown);
    });

    this.ws.addEventListener("message", (ev) => {
      try {
        const text = typeof ev.data === "string" ? ev.data : String(ev.data);
        const msg = JSON.parse(text) as unknown;
        if (isServerEvent(msg)) {
          events.emit(msg.type, msg as never);
        }
      } catch {
        // ignore malformed payload
      }
    });

    this.ws.addEventListener("close", () => {
      events.emit("ws_close", {} as unknown);
      const wait = Math.min(30_000, 1000 * 2 ** this.retry++);
      if (this.timer) {
        clearTimeout(this.timer); // ✅ แทน short-circuit expression
      }
      this.timer = window.setTimeout(() => this.open(), wait);
    });

    this.ws.addEventListener("error", () => {
      this.ws?.close();
    });
  }

  send(data: unknown): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  close(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.ws?.close();
  }
}

function isServerEvent(v: unknown): v is ServerEvent {
  return (
    !!v &&
    typeof v === "object" &&
    "type" in (v as Record<string, unknown>) &&
    typeof (v as Record<string, unknown>).type === "string"
  );
}

export const ws = new WSClient();
