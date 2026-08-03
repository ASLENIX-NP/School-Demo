import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { supabase } from "./config/supabase.js";

import heroRoutes from "./routes/heroRoutes.js";
import statisticsRoutes from "./routes/statisticsRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import academicsRoutes from "./routes/academicsRoutes.js";
import noticesRoutes from "./routes/noticesRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ================= Routes =================
app.use("/api/hero", heroRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/academics", academicsRoutes);
app.use("/api/notices", noticesRoutes);

// ================= Home =================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "School Backend is running 🚀",
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