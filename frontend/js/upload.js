document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const file = document.getElementById("resume").files[0];

  if (!file) return alert("Please select a file.");
  if (!token) return alert("Please login first.");
  if (role !== "candidate") return alert("Only candidates can upload resumes.");

  const formData = new FormData();
  formData.append("resume", file);

  const response = await fetch("http://localhost:8000/api/resumes/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const data = await response.json();
  alert(data.message || data.error);
});
