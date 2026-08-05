import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "../data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const getFallbackData = (fileName, defaultValue = []) => {
  try {
    const filePath = path.join(dataDir, `${fileName}.json`);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), "utf8");
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (err) {
    console.error(`Error reading fallback data for ${fileName}:`, err.message);
    return defaultValue;
  }
};

export const setFallbackData = (fileName, data) => {
  try {
    const filePath = path.join(dataDir, `${fileName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error(`Error writing fallback data for ${fileName}:`, err.message);
    return false;
  }
};
