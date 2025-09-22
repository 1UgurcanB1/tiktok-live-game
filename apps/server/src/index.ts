import http from "node:http";
import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import { Pool } from "pg";
import { PORT, WS_PATH, DATABASE_URL, NODE_ENV, TIKTOK_USERNAME } from "./env.js";
import type { ClientToServerMessage, ServerToClientMessage, TikTokStatusEvent, ChatEventData, ChatEvent, GiftEventData, GiftEvent } from "@tiktok/types";
import { TikTokLiveService } from "./tiktok.js";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const pool = new Pool({ connectionString: DATABASE_URL });
const tiktok = new TikTokLiveService();

app.get("/api/health", async (_req, res) => {
  try {
    const r = await pool.query("select 1 as ok");
    res.json({ ok: true, env: NODE_ENV, db: r.rows[0].ok === 1 });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

const wss = new WebSocketServer({ server, path: WS_PATH });
const clients = new Set<import("ws").WebSocket>();

wss.on("connection", (socket) => {
  const welcome: ServerToClientMessage = { type: "welcome", timestamp: new Date().toISOString() };
  clients.add(socket);
  socket.on("close", () => clients.delete(socket));
  socket.send(JSON.stringify(welcome));
  socket.on("message", (buf) => {
    try {
      const msg = JSON.parse(String(buf)) as ClientToServerMessage;
      if (msg.type === "ping") {
        socket.send(JSON.stringify({ type: "pong", timestamp: new Date().toISOString() }));
      } else if (msg.type === "echo") {
        socket.send(JSON.stringify({ type: "broadcast", payload: msg.payload, timestamp: new Date().toISOString() }));
      }
    } catch { }
  });
});

function broadcast(msg: any) {
  const data = JSON.stringify(msg);
  for (const c of clients) try { c.send(data); } catch { }
}

app.post("/api/tiktok/connect", async (req, res) => {
  const username = TIKTOK_USERNAME
  if (!username) return res.status(400).json({ ok: false, error: "username required" });
  try {
    const state = await tiktok.connect(username);

    // wire listeners
    tiktok.on("chat", (data: ChatEventData) => {
      const ev: ChatEvent = {
        type: "chat",
        timestamp: new Date().toISOString(),
        data
      };
      broadcast(ev);
    });

    tiktok.on("gift", (data: GiftEventData) => {
      const ev: GiftEvent = {
        type: "gift",
        timestamp: new Date().toISOString(),
        data
      };
      broadcast(ev);
    });

    const status: TikTokStatusEvent = {
      type: "tiktok.status",
      connected: true,
      roomId: String(state.roomId),
      username,
      timestamp: new Date().toISOString(),
    };
    broadcast(status);

    res.json({ ok: true, roomId: state.roomId, username });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.post("/api/tiktok/disconnect", async (_req, res) => {
  await tiktok.disconnect();
  const status: TikTokStatusEvent = {
    type: "tiktok.status",
    connected: false,
    timestamp: new Date().toISOString(),
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

wss.on("connection", (socket) => {
  socket.on("message", async (buf) => {
    try {
      const msg = JSON.parse(String(buf));
      if (msg.type === "tiktok.connect" && msg.username) {
        const r = await fetch(`http://localhost:${PORT}/api/tiktok/connect`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ username: msg.username }),
        });
        const j = await r.json();
        socket.send(JSON.stringify({ type: "broadcast", payload: j, timestamp: new Date().toISOString() }));
      } else if (msg.type === "tiktok.disconnect") {
        await fetch(`http://localhost:${PORT}/api/tiktok/disconnect`, { method: "POST" });
      } else if (msg.type === "tiktok.status") {
        const r = await fetch(`http://localhost:${PORT}/api/tiktok/status`);
        const j = await r.json();
        socket.send(JSON.stringify({ type: "broadcast", payload: j, timestamp: new Date().toISOString() }));
      }
    } catch { }
  });
});

server.listen(PORT, () => console.log(`[server] http://localhost:${PORT} ws:${WS_PATH}`));
