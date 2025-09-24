import { Router } from "express";
import health from "./health.routes.js";
import tiktok from "./tiktok.routes.js";

const api: Router = Router();

api.use(health);            // /api/health
api.use("/tiktok", tiktok); // /api/tiktok/...

export default api;
