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
      console.error("PDF parsing failed:", err.message);
      return "";
    }
  }

  if (ext === ".docx" || ext === ".doc") {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value.trim();
    } catch (err) {
      console.error("DOCX parsing failed:", err.message);
      return "";
    }
  }

  throw new Error("Unsupported file type");
};
