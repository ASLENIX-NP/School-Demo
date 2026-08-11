import express from "express";
import {
  getAdminSettings,
  updateAdminSettings,
  getLoginActivity,
  uploadAdminPhoto,
  updateAdminEmail,
  changeAdminPassword,
} from "../controllers/adminSettingsController.js";

const router = express.Router();

router.get("/", getAdminSettings);
router.post("/", updateAdminSettings);
router.put("/", updateAdminSettings);
router.get("/login-activity", getLoginActivity);
router.post("/upload-photo", uploadAdminPhoto);
router.post("/email", updateAdminEmail);
router.put("/email", updateAdminEmail);
router.post("/change-password", changeAdminPassword);
router.put("/change-password", changeAdminPassword);

export default router;
