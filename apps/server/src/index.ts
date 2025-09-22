import http from "node:http";
import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import { Pool } from "pg";
import { PORT, WS_PATH, DATABASE_URL, NODE_ENV } from "./env";
import type { ClientToServerMessage, ServerToClientMessage } from "@tiktok/types";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const pool = new Pool({ connectionString: DATABASE_URL });

app.get("/api/health", async (_req, res) => {
  try {
    const r = await pool.query("select 1 as ok");
    res.json({ ok: true, env: NODE_ENV, db: r.rows[0].ok === 1 });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

const wss = new WebSocketServer({ server, path: WS_PATH });
wss.on("connection", (socket) => {
  const welcome: ServerToClientMessage = { type: "welcome", timestamp: new Date().toISOString() };
  socket.send(JSON.stringify(welcome));
  socket.on("message", (buf) => {
    try {
      const msg = JSON.parse(String(buf)) as ClientToServerMessage;
      if (msg.type === "ping") {
        socket.send(JSON.stringify({ type: "pong", timestamp: new Date().toISOString() }));
      } else if (msg.type === "echo") {
        socket.send(JSON.stringify({ type: "broadcast", payload: msg.payload, timestamp: new Date().toISOString() }));
      }
    } catch {}
  });
});

server.listen(PORT, () => console.log(`[server] http://localhost:${PORT} ws:${WS_PATH}`));
