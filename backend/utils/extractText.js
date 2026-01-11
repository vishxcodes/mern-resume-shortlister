export const extractTextFromFile = async (file) => {
  if (!file || !file.buffer) {
    throw new Error("Invalid file data");
  }

  // Dynamically import ONLY when needed (Vercel-safe)
  if (file.mimetype === "application/pdf") {
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(file.buffer);
    return data.text.trim();
  }

  if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.mimetype === "application/msword"
  ) {
    const mammoth = (await import("mammoth")).default;
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });
    return result.value.trim();
  }

  throw new Error("Unsupported file type");
};
