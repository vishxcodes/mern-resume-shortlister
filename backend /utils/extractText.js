import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import path from "path";

export const extractTextFromFile = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".pdf") {
    // PDF extraction
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  } 
  else if (ext === ".docx" || ext === ".doc") {
    // DOCX extraction
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } 
  else {
    throw new Error("Unsupported file type");
  }
};
