document.getElementById("rankForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const jobId = document.getElementById("jobId").value;

  const res = await fetch(`http://localhost:8000/api/jobs/rank/${jobId}`);
  const data = await res.json();

  const list = document.getElementById("results");
  list.innerHTML = "";

  if (data.rankedResumes) {
    data.rankedResumes.forEach(r => {
      const li = document.createElement("li");
      li.textContent = `Resume ID: ${r.id}, Score: ${r.score.toFixed(3)}`;
      list.appendChild(li);
    });
  } else {
    list.textContent = data.error || "No results found.";
  }
});
