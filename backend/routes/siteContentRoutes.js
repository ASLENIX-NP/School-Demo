import express from "express";
import {
  getSiteContent,
  updateSiteContent,
} from "../controllers/siteContentController.js";

const router = express.Router();

router.get("/:section", getSiteContent);
router.post("/:section", updateSiteContent);
router.put("/:section", updateSiteContent);

export default router;
