import { rankResumes } from "./utils/tfidf.js";

(async () => {
  const job = "React developer with JavaScript";
  const resumes = [
    { id: "r1", text: "Experienced React developer" },
    { id: "r2", text: "" }
  ];

  const ranked = await rankResumes(job, resumes);
  console.log("RANKED:", ranked);
})();
