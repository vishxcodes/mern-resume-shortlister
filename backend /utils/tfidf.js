import { PythonShell } from "python-shell";

export const rankResumes = (jobDescription, resumes) => {
  return new Promise((resolve, reject) => {
    const input = JSON.stringify({ job_description: jobDescription, resumes });
    console.log("Job description:", jobDescription);
  console.log("Resumes:", resumes.map(r => ({ id: r.id, length: r.text.length })));

    PythonShell.run(
      "utils/tfidf_rank.py",
      { args: [input] },
      (err, results) => {
        if (err) return reject(err);
        // results is an array of lines printed by Python script
        resolve(JSON.parse(results[0]));
      }
    );
  });
};
