import express from "express";
import multer from "multer";
import { uploadFile } from "../controllers/uploadController.js";

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const router = express.Router();

// Support multiple field names: file, image, photo
router.post("/", upload.single("file"), (req, res, next) => {
  if (!req.file) {
    return upload.single("image")(req, res, (err) => {
      if (err || !req.file) {
        return upload.single("photo")(req, res, next);
      }
      next();
    });
  }
  next();
}, uploadFile);

export default router;
