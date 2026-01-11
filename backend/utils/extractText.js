import mammoth from "mammoth";
import pdfParse from "pdf-parse";

export const extractTextFromFile = async (file) => {
  if (!file || !file.buffer) {
    throw new Error("Invalid file data");
  }

  // PDF
  if (file.mimetype === "application/pdf") {
    const data = await pdfParse(file.buffer);
    return data.text.trim();
  }

  // DOCX
  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });
    return result.value.trim();
  }

  // DOC (older format)
  if (file.mimetype === "application/msword") {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });
    return result.value.trim();
  }

  throw new Error("Unsupported file type");
};
