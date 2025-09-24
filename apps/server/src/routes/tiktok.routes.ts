import { Router } from "express";
import * as ctl from "../controllers/tiktok.controller.js";
import { validate } from "../middlewares/validate.js";

const router: Router = Router();

// รองรับทั้ง body และ query ได้ แต่ที่นี่เลือก body
router.post("/connect", validate(ctl.connectValidate, "body"), ctl.connect);
router.post("/disconnect", ctl.disconnect);
router.get("/status", ctl.status);

export default router;
