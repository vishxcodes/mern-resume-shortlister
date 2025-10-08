import path from "path";
import { PythonShell } from "python-shell";

export const rankResumes = (jobDescription, resumes) => {
  return new Promise((resolve, reject) => {
    const input = JSON.stringify({ job_description: jobDescription, resumes });
    const scriptPath = path.join(process.cwd(), "utils", "tfidf_rank.py");

    console.log("🚀 Starting TF-IDF ranking");
    console.log("Job description length:", jobDescription.length);
    console.log("Resumes:", resumes.length);
    console.log("Script path:", scriptPath);

    const options = {
      pythonPath: "python3",
      args: [input],
      mode: "text",
    };

    PythonShell.run(scriptPath, options)
      .then(results => {
        console.log("✅ Python finished, raw results:", results);
        if (!results || results.length === 0) throw new Error("Empty Python output");
        resolve(JSON.parse(results[0]));
      })
      .catch(err => {
        console.error("❌ Python failed:", err);
        reject(err);
      });
  });
};
