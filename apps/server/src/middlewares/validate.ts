import type { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema, from: "body" | "query" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(from === "body" ? req.body : req.query);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: parsed.error.flatten() });
    }
    // เก็บค่าที่ parse แล้วลง req เพื่อใช้ต่อ
    (req as Request & { input: unknown }).input = parsed.data as unknown;
    next();
  };
