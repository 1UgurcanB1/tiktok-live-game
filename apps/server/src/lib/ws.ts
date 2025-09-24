import { WebSocketServer } from "ws";
import type { Server } from "node:http";
import type { ChatEvent, GiftEvent, TikTokStatusEvent, DBStatusEvent, FollowEvent, ShareEvent } from "@tiktok/types";
import { env } from "../env.js";

// ถ้าคุณมี union type ของอีเวนต์ทั้งหมดใน @tiktok/types กำหนดมาแทน any ก็ได้
let wss: WebSocketServer | null = null;

export function attachWSS(server: Server) {
  wss = new WebSocketServer({ server, path: env.WS_PATH });
  wss.on("connection", () => {
    // welcome หรือ auth ก็ทำตรงนี้ได้
  });
}

type OutboundEvent =
  | ChatEvent
  | GiftEvent
  | FollowEvent
  | ShareEvent
  | TikTokStatusEvent
  | DBStatusEvent
  | unknown;

export function broadcast(event: OutboundEvent) {
  if (!wss) return;
  const msg = JSON.stringify(event);
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) client.send(msg);
  }
}
