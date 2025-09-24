import express from "express";
import type { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import apiRouter from "./routes/index.js";

export function createApp(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // health ping แบบเร็ว ๆ ไม่แตะ DB
  app.get("/", (_req, res) => res.json({ ok: true }));

  // รวมทุก API ใต้ /api
  app.use("/api", apiRouter);

  // 404
  app.use((_req, res) =>
    res.status(404).json({ ok: false, error: "Not Found" })
  );

  // error handler กลาง (Express 5 รองรับ async)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // The `_next` parameter is intentionally unused here, but must be present for Express to recognize this as an error-handling middleware.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ ok: false, error: "Internal Server Error" });
  });

  return app;
}
