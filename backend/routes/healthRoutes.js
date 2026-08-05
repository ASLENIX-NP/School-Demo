import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    timestamp: new Date().toISOString(),
    message: "School Backend is running smoothly 🚀",
  });
});

export default router;
