/****************************
 🔥 FIREBASE CONFIGURATION
****************************/

const firebaseConfig = {
apiKey: "AIzaSyCZJDf4OAdFK0e7BDYLY5wYIeNR7ZhAfWI",
  authDomain: "nextturn-8217f.firebaseapp.com",
  projectId: "nextturn-8217f",
  storageBucket: "nextturn-8217f.firebasestorage.app",
  messagingSenderId: "884198002910",
  appId: "1:884198002910:web:6387c7d5816cc4acfc324f",
  measurementId: "G-B6B11FCNGL"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase Auth reference
const auth = firebase.auth();

/****************************
 ✅ HELPER FUNCTIONS
****************************/

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showMessage(el, msg, color = "red") {
  if (!el) return;
  el.style.color = color;
  el.innerText = msg;
}

/****************************
 📝 SIGNUP FUNCTION
****************************/

function signup() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();
  const msg = document.getElementById("errorMsg");

  showMessage(msg, "");

  if (!email || !password) {
    showMessage(msg, "Please fill all fields.");
    return;
  }

  if (!validateEmail(email)) {
    showMessage(msg, "Please enter a valid email address.");
    return;
  }

  if (password.length < 6) {
    showMessage(msg, "Password must be at least 6 characters.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      localStorage.setItem(
        "user",
        JSON.stringify(userCredential.user)
      );

      showMessage(msg, "Signup successful! Redirecting...", "green");

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    })
    .catch(error => {
      handleAuthError(error.code, msg);
    });
}

/****************************
 🔐 LOGIN FUNCTION
****************************/

function login() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();
  const msg = document.getElementById("errorMsg");

  showMessage(msg, "");

  if (!email || !password) {
    showMessage(msg, "Please enter email and password.");
    return;
  }

  if (!validateEmail(email)) {
    showMessage(msg, "Invalid email address.");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      localStorage.setItem(
        "user",
        JSON.stringify(userCredential.user)
      );

      showMessage(msg, "Login successful! Redirecting...", "green");

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 800);
    })
    .catch(error => {
      handleAuthError(error.code, msg);
    });
}

/****************************
 ❌ LOGOUT FUNCTION
****************************/

function logoutUser() {
  auth.signOut().then(() => {
    localStorage.removeItem("user");
    window.location.href = "index.html";
  });
}

/****************************
 ⚠️ AUTH ERROR HANDLING
****************************/

function handleAuthError(code, el) {
  switch (code) {
    case "auth/email-already-in-use":
      showMessage(el, "This email is already registered.");
      break;
    case "auth/invalid-email":
      showMessage(el, "Invalid email address.");
      break;
    case "auth/weak-password":
      showMessage(el, "Password is too weak.");
      break;
    case "auth/user-not-found":
      showMessage(el, "No account found with this email.");
      break;
    case "auth/wrong-password":
      showMessage(el, "Incorrect password.");
      break;
    case "auth/network-request-failed":
      showMessage(el, "Network error. Please check internet.");
      break;
    default:
      showMessage(el, "Something went wrong. Try again.");
  }
}
