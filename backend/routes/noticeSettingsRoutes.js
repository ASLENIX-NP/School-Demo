import express from "express";
import {
  getNoticeSettings,
  updateNoticeSettings,
} from "../controllers/noticesController.js";

const router = express.Router();

router.get("/", getNoticeSettings);
router.post("/", updateNoticeSettings);
router.put("/", updateNoticeSettings);

export default router;
