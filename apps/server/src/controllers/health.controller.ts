import { healthMongo } from "../db.js";
import type { Request, Response } from "express";
import { broadcast } from "../lib/ws.js";
import type { DBStatusEvent } from "@tiktok/types";
import { toISO } from "@tiktok/utils";
import { env } from "../env.js";

export async function health(_req: Request, res: Response) {
  const status = await healthMongo();
  const ev: DBStatusEvent = {
    type: "db.status",
    env: env.NODE_ENV,
    connected: status.ok,
    error: status.error,
    timestamp: toISO(new Date()),
  };
  broadcast(ev);
  res.json(ev);
}
