import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

const nodeEnv = (process.env.NODE_ENV ?? "development").trim();
dotenv.config({ path: path.resolve(process.cwd(), `.env.${nodeEnv}`) });

const EnvSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "staging", "production"])
      .default("development"),
    PORT: z.coerce.number().int().positive().default(3001),
    WS_PATH: z
      .string()
      .default("/ws")
      .transform((p) => (p.startsWith("/") ? p : `/${p}`)),
    DATABASE_MODE: z.enum(["memory", "mongo"]).default(
      process.env.NODE_ENV === "production" ? "mongo" : "memory",
    ),
    DATABASE_URL: z
      .string()
      .optional()
      .transform((s) => (s?.trim() ? s.trim() : undefined)),
    TIKTOK_USERNAME: z
      .string()
      .optional()
      .transform((s) => (s?.trim() ? s : undefined)),
    TIKTOK_MODE: z
      .enum(["real", "sim"])
      .default(process.env.NODE_ENV === "development" ? "sim" : "real"),
  })
  .superRefine((value, ctx) => {
    if (value.DATABASE_MODE === "mongo" && !value.DATABASE_URL) {
      ctx.addIssue({
        code: "custom",
        path: ["DATABASE_URL"],
        message: "DATABASE_URL is required when DATABASE_MODE=mongo",
      });
    }
  });

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("[env] Invalid environment variables:");
  for (const issue of parsed.error.issues) {
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;

export const IS_DEV = env.NODE_ENV === "development";
export const IS_STAGING = env.NODE_ENV === "staging";
export const IS_PROD = env.NODE_ENV === "production";
