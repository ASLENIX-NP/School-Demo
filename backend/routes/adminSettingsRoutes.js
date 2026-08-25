import express from "express";

import {
  getAdminSettings,
  updateAdminSettings,
  getLoginActivity,
  uploadAdminPhoto,
  updateAdminEmail,
  changeAdminPassword,
  logoutDevice,
  logoutOtherDevices,
  forgotPassword,
  verifyForgotPasswordOtp,
  resetPassword,
} from "../controllers/adminSettingsController.js";

import { protectAdmin } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// =====================================================
// PASSWORD RECOVERY
// These routes do not require an existing login.
// =====================================================

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyForgotPasswordOtp);
router.post("/reset-password", resetPassword);

// =====================================================
// PROTECTED ADMIN SETTINGS
// Everything below requires a valid admin session.
// =====================================================

router.use(protectAdmin);

// =====================================================
// ADMIN PROFILE
// =====================================================

router.get("/", getAdminSettings);
router.put("/", updateAdminSettings);

// =====================================================
// LOGIN / DEVICE SESSIONS
// =====================================================

router.get("/login-activity", getLoginActivity);

// =====================================================
// PROFILE PHOTO
// =====================================================

router.post("/upload-photo", uploadAdminPhoto);

// =====================================================
// ADMIN EMAIL
// =====================================================

router.put("/email", updateAdminEmail);

// =====================================================
// CHANGE PASSWORD
// =====================================================

router.put("/change-password", changeAdminPassword);

// =====================================================
// DEVICE MANAGEMENT
// =====================================================

router.delete("/sessions/:id", logoutDevice);

router.post(
  "/sessions/logout-others",
  logoutOtherDevices
);

export default router;