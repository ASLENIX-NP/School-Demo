import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { supabase } from "./config/supabase.js";

import heroRoutes from "./routes/heroRoutes.js";
import statisticsRoutes from "./routes/statisticsRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import academicsRoutes from "./routes/academicsRoutes.js";
import noticesRoutes from "./routes/noticesRoutes.js";
import noticeSettingsRoutes from "./routes/noticeSettingsRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import siteContentRoutes from "./routes/siteContentRoutes.js";
import adminSettingsRoutes from "./routes/adminSettingsRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= Routes =================
app.use("/api/hero", heroRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/academics", academicsRoutes);
app.use("/api/notices", noticesRoutes);
app.use("/api/notice-settings", noticeSettingsRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/contact-messages", contactRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/site-content", siteContentRoutes);
app.use("/api/admin-settings", adminSettingsRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/health", healthRoutes);

// ================= Home =================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "School Management API Server is running 🚀",
  });
});

// ================= Test Supabase =================
app.get("/test-supabase", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("admin_settings")
      .select("*");

    if (error) throw error;

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});