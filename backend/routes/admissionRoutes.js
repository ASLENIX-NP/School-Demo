import express from "express";
import {
  getAdmissionSettings,
  updateAdmissionSettings,
  createAdmissionInquiry,
  getAdmissionInquiries,
  updateAdmissionInquiry,
  deleteAdmissionInquiry,
  convertInquiryToStudent,
  getAdmissionAnalytics
} from "../controllers/admissionController.js";

const router = express.Router();

// Public routes
router.get("/settings", getAdmissionSettings);
router.post("/inquiry", createAdmissionInquiry);

// Admin routes (Inquiries, Analytics, Settings update)
router.put("/settings", updateAdmissionSettings);
router.get("/inquiries", getAdmissionInquiries);
router.put("/inquiries/:id", updateAdmissionInquiry);
router.delete("/inquiries/:id", deleteAdmissionInquiry);
router.post("/inquiries/:id/convert", convertInquiryToStudent);
router.get("/analytics", getAdmissionAnalytics);

export default router;
