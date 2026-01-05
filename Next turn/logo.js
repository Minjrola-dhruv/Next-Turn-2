const logo = document.getElementById("siteLogo");

if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  logo.src = "assets/images/logo-dark.png";
}
