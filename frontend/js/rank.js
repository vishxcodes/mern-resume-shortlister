document.getElementById("rankForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const jobId = document.getElementById("jobId").value.trim();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return alert("Please login first!");
  if (role !== "recruiter") return alert("Only recruiters can rank resumes.");

  const res = await fetch(`http://localhost:8000/api/jobs/rank/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  const list = document.getElementById("results");
  list.innerHTML = "";

  if (data.rankedResumes) {
    data.rankedResumes.forEach((r) => {
      const li = document.createElement("li");
      li.textContent = `Resume ID: ${r.id}, Score: ${r.score.toFixed(3)}`;
      list.appendChild(li);
    });
  } else {
    list.textContent = data.error || "No results found.";
  }
});
