/******** FIREBASE CONFIG ********/
const firebaseConfig = {
  apiKey: "AIzaSyCZJDf4OAdFK0e7BDYLY5wYIeNR7ZhAfWI",
  authDomain: "nextturn-8217f.firebaseapp.com",
  projectId: "nextturn-8217f",
  storageBucket: "nextturn-8217f.firebasestorage.app",
  messagingSenderId: "884198002910",
  appId: "1:884198002910:web:6387c7d5816cc4acfc324f",
  measurementId: "G-B6B11FCNGL"
};
// 🔥 INITIALIZE FIREBASE (YOU MISSED THIS)
firebase.initializeApp(firebaseConfig);

// 🔥 AUTH OBJECT (YOU MISSED THIS)
const auth = firebase.auth();


/******** SIGNUP FUNCTION ********/
function signup() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  // Reset message
  message.style.color = "red";
  message.innerText = "";

  // Validation
  if (!email || !password) {
    message.innerText = "Please fill all fields.";
    return;
  }

  if (!validateEmail(email)) {
    message.innerText = "Please enter a valid email address.";
    return;
  }

  if (password.length < 6) {
    message.innerText = "Password must be at least 6 characters.";
    return;
  }

  // Firebase signup
  auth.createUserWithEmailAndPassword(email, password)
  .then(userCredential => {
    localStorage.setItem("user", JSON.stringify(userCredential.user));

    message.style.color = "green";
    message.innerText = "Signup successful! Redirecting to dashboard...";

    // ✅ REDIRECT
    window.location.href = "dashboard.html";
  })
  .catch(error => {
    showError(error.code, message);
  });
}

/******** HELPERS ********/
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(code, el) {
  switch (code) {
    case "auth/email-already-in-use":
      el.innerText = "This email is already registered.";
      break;
    case "auth/invalid-email":
      el.innerText = "Invalid email address.";
      break;
    case "auth/weak-password":
      el.innerText = "Password is too weak.";
      break;
    case "auth/network-request-failed":
      el.innerText = "Network error. Please check internet.";
      break;
    default:
      el.innerText = "Signup failed. Please try again.";
  }
}