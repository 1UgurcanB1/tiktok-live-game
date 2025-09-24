import http from "node:http";
import { createApp } from "./app.js";
import { env } from "./env.js";
import { connectMongo } from "./db.js";
import { attachWSS, broadcast } from "./lib/ws.js";
import { tiktok } from "./services/tiktok.service.js";
import type { ChatEvent, GiftEvent, TikTokStatusEvent } from "@tiktok/types";
import { toISO } from "@tiktok/utils";

async function main() {
  await connectMongo();

  const app = createApp();
  const server = http.createServer(app);

  // attach WS
  attachWSS(server);

  // bridge TikTok events -> WS broadcast
  tiktok.on("chat", (data) => {
    const ev: ChatEvent = {
      type: "tiktok.chat",
      data,
      timestamp: toISO(new Date()),
    };
    broadcast(ev);
  });
  tiktok.on("gift", (data) => {
    const ev: GiftEvent = {
      type: "tiktok.gift",
      data,
      timestamp: toISO(new Date()),
    };
    broadcast(ev);
  });
  tiktok.on("disconnected", () => {
    const ev: TikTokStatusEvent = {
      type: "tiktok.status",
      connected: false,
      roomId: undefined,
      username: undefined,
      timestamp: toISO(new Date()),
    };
    broadcast(ev);
  });

  server.listen(env.PORT, () => {
    console.log(`[server] http://localhost:${env.PORT} ws:${env.WS_PATH}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
