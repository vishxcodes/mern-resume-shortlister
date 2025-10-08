import { extractTextFromFile } from "./utils/extractText.js";

const run = async () => {
  const text = await extractTextFromFile("./dummy_resume_1.pdf"); // put a sample resume here
  console.log("Extracted text (first 200 chars):", text.slice(0, 200));
};

run();
