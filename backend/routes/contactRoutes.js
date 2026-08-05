import express from "express";
import {
  getContactMessages,
  createContactMessage,
  updateMessageReadStatus,
  deleteContactMessage,
} from "../controllers/contactController.js";

const router = express.Router();

router.get("/", getContactMessages);
router.post("/", createContactMessage);
router.patch("/:id/read", updateMessageReadStatus);
router.put("/:id", updateMessageReadStatus);
router.delete("/:id", deleteContactMessage);

export default router;
