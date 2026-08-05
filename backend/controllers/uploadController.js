import imagekit from "../config/imagekit.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  const file = req.file;

  // Try ImageKit upload first if configured
  if (imagekit) {
    try {
      const result = await imagekit.upload({
        file: file.buffer,
        fileName: `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_")}`,
        folder: "/school_uploads",
      });

      if (result && result.url) {
        return res.json({
          success: true,
          url: result.url,
          imageUrl: result.url,
          data: { url: result.url },
        });
      }
    } catch (err) {
      console.warn("ImageKit upload error, falling back to local storage:", err.message);
    }
  }

  // Fallback to local storage
  const filename = `${Date.now()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const filePath = path.join(uploadsDir, filename);

  try {
    fs.writeFileSync(filePath, file.buffer);
    const localUrl = `http://localhost:${process.env.PORT || 5000}/uploads/${filename}`;

    return res.json({
      success: true,
      url: localUrl,
      imageUrl: localUrl,
      data: { url: localUrl },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "File upload failed",
      error: err.message,
    });
  }
};
