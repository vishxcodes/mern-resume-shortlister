const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const jobsContainer = document.getElementById("jobsContainer");

// Redirect if not logged in
if (!token) {
  alert("Please login first.");
  window.location.href = "index.html";
}
if (role !== "candidate") {
  alert("Only candidates can access this page.");
  window.location.href = "index.html";
}

document.getElementById("logoutBtn").addEventListener("click", logout);

// Fetch and render all jobs
async function loadJobs() {
  try {
    const res = await fetch("http://localhost:8000/api/jobs");
    const jobs = await res.json();

    jobsContainer.innerHTML = "";

    if (!jobs || jobs.length === 0) {
      jobsContainer.innerHTML = `<p class="no-jobs">No jobs available right now.</p>`;
      return;
    }

    jobs.forEach((job) => {
      const div = document.createElement("div");
      div.className = "job-card";

      div.innerHTML = `
        <h3>${job.title}</h3>
        <p>${job.description}</p>
        <small>Posted by: ${job.recruiterId?.name || "Unknown Recruiter"}</small>
        <button class="apply-btn" onclick="applyToJob('${job._id}')">Apply</button>
      `;
      jobsContainer.appendChild(div);
    });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    jobsContainer.innerHTML = `<p class="no-jobs">Error loading jobs. Please check the server.</p>`;
  }
}

async function applyToJob(jobId) {
  const resumeId = prompt("Enter your uploaded Resume ID to apply:");
  if (!resumeId) return alert("Resume ID is required.");

  try {
    const res = await fetch(`http://localhost:8000/api/applications/apply/${jobId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ resumeId }),
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
    } else {
      alert(data.error || "Something went wrong");
    }
  } catch (err) {
    console.error("Error applying:", err);
    alert("Error applying to job.");
  }
}

// Load jobs when page opens
loadJobs();
