import express from "express";
import {
  adminLogin,
  adminLogout,
  forgotPassword,
  resetPassword,
} from "../controllers/adminAuthController.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/logout", adminLogout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
