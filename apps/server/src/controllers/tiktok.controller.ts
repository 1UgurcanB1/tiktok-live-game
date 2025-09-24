import type { Request, Response } from "express";
import { z } from "zod";
import { tiktok } from "../services/tiktok.service.js";
import { broadcast } from "../lib/ws.js";
import type { TikTokStatusEvent } from "@tiktok/types";
import { toISO } from "@tiktok/utils";
import { RequestHandler } from "express";
import { env } from "../env.js";

const ConnectSchema = z.object({
  username: z.string().min(2),
  mode: z.enum(["real", "sim"]).optional().default(env.TIKTOK_MODE),
});

type ConnectInput = { username: string; mode?: "real" | "sim" };
type ValidatedRequest<T> = Request & { input: T };

export const connect: RequestHandler = async (req, res) => {
  const { input } = req as ValidatedRequest<ConnectInput>;
  const { username, mode } = input;
  await tiktok.disconnect();
  const r = await tiktok.connect(username, mode);

  const ev: TikTokStatusEvent = {
    type: "tiktok.status",
    connected: tiktok.connected,
    roomId: r.roomId ? r.roomId.toString() : undefined,
    username: tiktok.username ?? undefined,
    timestamp: toISO(new Date()),
  };
  broadcast(ev);
  res.json(ev);
};

export async function disconnect(_req: Request, res: Response) {
  await tiktok.disconnect();

  const ev: TikTokStatusEvent = {
    type: "tiktok.status",
    connected: false,
    roomId: undefined,
    username: undefined,
    timestamp: toISO(new Date()),
  };
  broadcast(ev);
  res.json(ev);
}

export async function status(_req: Request, res: Response) {
  const ev: TikTokStatusEvent = {
    type: "tiktok.status",
    connected: tiktok.connected,
    roomId: tiktok.roomId ?? undefined,
    username: tiktok.username ?? undefined,
    timestamp: toISO(new Date()),
  };
  broadcast(ev);
  res.json(ev);
}

export const connectValidate = ConnectSchema;
