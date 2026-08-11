import express from "express";

import {
  getAdminSettings,
  updateAdminSettings,
  getLoginActivity,
  uploadAdminPhoto,
  updateAdminEmail,
  changeAdminPassword,
  forgotPassword,
  verifyForgotPasswordOtp,
  resetPassword,
} from "../controllers/adminSettingsController.js";

const router = express.Router();

// =====================================================
// ADMIN SETTINGS
// =====================================================

router.get("/", getAdminSettings);

router.post("/", updateAdminSettings);

router.put("/", updateAdminSettings);

// =====================================================
// LOGIN ACTIVITY
// =====================================================

router.get("/login-activity", getLoginActivity);

// =====================================================
// ADMIN PHOTO
// =====================================================

router.post("/upload-photo", uploadAdminPhoto);

// =====================================================
// ADMIN EMAIL
// =====================================================

router.post("/email", updateAdminEmail);

// =====================================================
// NORMAL CHANGE PASSWORD
// =====================================================

router.post("/change-password", changeAdminPassword);

// =====================================================
// FORGOT PASSWORD
// =====================================================

// Send OTP
router.post("/forgot-password", forgotPassword);

// Verify OTP
router.post("/verify-otp", verifyForgotPasswordOtp);

// Reset password after OTP verification
router.post("/reset-password", resetPassword);

export default router;