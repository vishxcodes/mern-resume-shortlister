document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const userId = document.getElementById("userId").value;
  const file = document.getElementById("resume").files[0];

  if (!file || !userId) return alert("Please fill all fields.");

  const formData = new FormData();
  formData.append("resume", file);

  const response = await fetch(`http://localhost:8000/api/resumes/upload/${userId}`, {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  alert(data.message || data.error || "Something went wrong");
});
