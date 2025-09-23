import http from "node:http";
import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import { connectMongo, healthMongo } from "./db.js";
import { env } from "./env.js";
import type {
  DBStatusEvent,
  TikTokStatusEvent,
  ChatEventData,
  ChatEvent,
  GiftEventData,
  GiftEvent,
} from "@tiktok/types";
import { TikTokLiveService } from "./tiktok.js";
import { toISO } from "@tiktok/utils";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
await connectMongo();
const tiktok = new TikTokLiveService();

app.get("/api/health", async (_req, res) => {
  try {
    const h = await healthMongo();
    const ev: DBStatusEvent = {
      type: "db.status",
      env: env.NODE_ENV,
      connected: h.ok,
      error: h.error,
      timestamp: toISO(new Date()),
    };
    broadcast(ev);
    res.status(h.ok ? 200 : 500).json(ev);
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

const wss = new WebSocketServer({ server, path: env.WS_PATH });
const clients = new Set<import("ws").WebSocket>();

wss.on("connection", (socket) => {
  clients.add(socket);
  socket.on("close", () => clients.delete(socket));
});

function broadcast(obj: unknown) {
  const data = JSON.stringify(obj);
  for (const client of wss.clients) {
    if (client.readyState === 1 && client.bufferedAmount < 1_000_000) {
      client.send(data);
    }
  }
}

app.post("/api/tiktok/connect", async (req, res) => {
  let { username } = req.body as { username?: string };
  if (!username) {
    username = env.TIKTOK_USERNAME;
  }
  if (!username)
    return res.status(400).json({ ok: false, error: "username required" });
  try {
    const state = await tiktok.connect(username);

    // wire listeners
    tiktok.on("chat", async (data: ChatEventData) => {
      const ev: ChatEvent = {
        type: "tiktok.chat",
        timestamp: toISO(new Date()),
        data,
      };
      broadcast(ev);
    });

    tiktok.on("gift", async (data: GiftEventData) => {
      const ev: GiftEvent = {
        type: "tiktok.gift",
        timestamp: toISO(new Date()),
        data,
      };
      broadcast(ev);
    });

    const status: TikTokStatusEvent = {
      type: "tiktok.status",
      connected: true,
      roomId: String(state.roomId),
      username,
      timestamp: toISO(new Date()),
    };
    broadcast(status);

    res.json(status);
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.post("/api/tiktok/disconnect", async (_req, res) => {
  await tiktok.disconnect();
  const status: TikTokStatusEvent = {
    type: "tiktok.status",
    connected: false,
    timestamp: toISO(new Date()),
  };
  broadcast(status);
  res.json({ ok: true });
});

app.get("/api/tiktok/status", (_req, res) => {
  res.json({
    ok: true,
    connected: tiktok.connected,
    roomId: tiktok.roomId,
    username: tiktok.username,
  });
});

server.listen(env.PORT, () =>
  console.log(`[server] http://localhost:${env.PORT} ws:${env.WS_PATH}`),
);
