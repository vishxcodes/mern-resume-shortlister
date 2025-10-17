// Common auth utilities for all pages

async function login(email, password) {
  try {
    const res = await fetch("http://localhost:8000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      alert(`Login successful as ${data.user.role}`);
      window.location.reload();
    } else {
      alert(data.error || "Login failed");
    }
  } catch (err) {
    alert("Error logging in: " + err.message);
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  alert("Logged out successfully.");
  window.location.reload();
}

function checkAuthButtons() {
  const token = localStorage.getItem("token");
  document.getElementById("loginBtn").style.display = token ? "none" : "inline-block";
  document.getElementById("logoutBtn").style.display = token ? "inline-block" : "none";
}
