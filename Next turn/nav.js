document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  toggle("loginBtn", !user);
  toggle("signupBtn", !user);
  toggle("dashboardBtn", user);
  toggle("logoutBtn", user);
});

function toggle(id, show) {
  const el = document.getElementById(id);
  if (el) el.style.display = show ? "inline-block" : "none";
}

function logoutUser() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}
