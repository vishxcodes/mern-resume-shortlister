document.getElementById("jobForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return alert("Please login first!");
  if (role !== "recruiter") return alert("Only recruiters can create jobs.");

  const res = await fetch("http://localhost:8000/api/jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description }),
  });

  const data = await res.json();
  alert(data.message || data.error);
});
