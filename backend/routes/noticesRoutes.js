import express from "express";
import {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} from "../controllers/noticesController.js";

const router = express.Router();

router.get("/", getNotices);
router.post("/", createNotice);
router.get("/:id", getNoticeById);
router.put("/:id", updateNotice);
router.patch("/:id", updateNotice);
router.delete("/:id", deleteNotice);

export default router;