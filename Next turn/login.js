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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

/******** LOGIN FUNCTION ********/
function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  message.style.color = "red";
  message.innerText = "";

  // Validation
  if (!email || !password) {
    message.innerText = "Please fill all fields.";
    return;
  }

  if (!validateEmail(email)) {
    message.innerText = "Invalid email address.";
    return;
  }

  // Firebase login
  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      localStorage.setItem("user", JSON.stringify(userCredential.user));
      message.style.color = "green";
      message.innerText = "Login successful!";
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
    case "auth/user-not-found":
      el.innerText = "No account found with this email.";
      break;
    case "auth/wrong-password":
      el.innerText = "Incorrect password.";
      break;
    case "auth/invalid-email":
      el.innerText = "Invalid email address.";
      break;
    case "auth/network-request-failed":
      el.innerText = "Network error. Please check internet.";
      break;
    default:
      el.innerText = "Login failed. Please try again.";
  }
}
