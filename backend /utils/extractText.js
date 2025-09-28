import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const extractTextFromFile = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".pdf") {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text.trim();
    } catch (err) {
      console.error(`PDF parsing failed for ${filePath}:`, err.message);
      return ""; // fallback to empty string if PDF is unreadable
    }
  } else if (ext === ".docx" || ext === ".doc") {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value.trim();
    } catch (err) {
      console.error(`DOCX parsing failed for ${filePath}:`, err.message);
      return "";
    }
  } else {
    throw new Error("Unsupported file type");
  }
};
