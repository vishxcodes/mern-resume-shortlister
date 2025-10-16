document.getElementById("jobForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const recruiterId = document.getElementById("recruiterId").value;
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  const res = await fetch("http://localhost:8000/api/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recruiterId, title, description })
  });

  const data = await res.json();
  alert(data._id ? "Job created successfully!" : data.error);
});
