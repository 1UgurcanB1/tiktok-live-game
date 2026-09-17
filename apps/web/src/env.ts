// apps/web/src/env.ts
import { z } from "zod";

const raw = {
  MODE: import.meta.env.MODE,
  VITE_API_BASE: import.meta.env.VITE_API_BASE,
  VITE_TIKTOK_USERNAME: import.meta.env.VITE_TIKTOK_USERNAME,
  VITE_WS_URL: import.meta.env.VITE_WS_URL,
  VITE_TIKTOK_MODE: import.meta.env.VITE_TIKTOK_MODE,
} as const;

const EnvSchema = z.object({
  MODE: z.string(),
  VITE_API_BASE: z.string().default("/"),
  VITE_TIKTOK_USERNAME: z.string().min(1).optional(),
  // Supports both absolute ws(s):// URLs and same-origin paths such as /ws.
  VITE_WS_URL: z.string().min(1).optional(),
  VITE_TIKTOK_MODE: z.enum(["real", "sim"]).optional(),
});

export const env = EnvSchema.parse(raw);
export type Env = z.infer<typeof EnvSchema>;
