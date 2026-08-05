import express from "express";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  updatePopupOrder,
} from "../controllers/announcementController.js";

const router = express.Router();

router.get("/", getAnnouncements);
router.post("/", createAnnouncement);
router.patch("/popup-order", updatePopupOrder);
router.put("/:id", updateAnnouncement);
router.patch("/:id", updateAnnouncement);
router.delete("/:id", deleteAnnouncement);

export default router;
