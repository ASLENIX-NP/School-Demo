import express from "express";

import {
  adminLogin,
  adminLogout,
} from "../controllers/adminAuthController.js";

const router = express.Router();

// =====================================================
// ADMIN LOGIN
// =====================================================

router.post("/login", adminLogin);

// =====================================================
// ADMIN LOGOUT
// =====================================================

router.post("/logout", adminLogout);

export default router;