import path from "node:path";
import dotenv from "dotenv";

const env = (process.env.NODE_ENV ?? "development").trim();
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) });

export const NODE_ENV = env as "development" | "staging" | "production";
export const PORT = Number(process.env.PORT ?? 3001);
export const WS_PATH = process.env.WS_PATH ?? "/ws";
export const DATABASE_URL = process.env.DATABASE_URL ?? "";
export const TIKTOK_USERNAME = process.env.TIKTOK_USERNAME ?? "";
