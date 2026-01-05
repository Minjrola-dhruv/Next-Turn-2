// /*************************************************
//  * DASHBOARD.JS – NEXT TURN
//  * Full Working Code
//  *************************************************/

// /* ================= FIREBASE CONFIG ================= */
// /* 🔴 Replace values with your Firebase project config */
// const firebaseConfig = {
//   apiKey: "AIzaSyCZJDf4OAdFK0e7BDYLY5wYIeNR7ZhAfWI",
//   authDomain: "nextturn-8217f.firebaseapp.com",
//   projectId: "nextturn-8217f",
//   storageBucket: "nextturn-8217f.firebasestorage.app",
//   messagingSenderId: "884198002910",
//   appId: "1:884198002910:web:6387c7d5816cc4acfc324f",
//   measurementId: "G-B6B11FCNGL"
// };

// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// const db = firebase.database();

// /* ================= FIXED AVG TIME ================= */
// const AVG_TIME_PER_PERSON = 2; // minutes

// /* ================= GOOGLE FORM BASE ================= */
// /* MUST end with = */
// const FORM_BASE =
//   "https://docs.google.com/forms/d/e/1FAIpQLScraFTx6Ep5NcTdbcddyCl-J53DaWg2dBmJ5oPsuETxEod9Jw/viewform?usp=pp_url&entry.64203407=";

// /* ================= GENERATE TURN ID ================= */
// function generateTurnId() {
//   return "TURN-" + Date.now();
// }

// /* ================= GENERATE QR ================= */
// function generateQR() {
//   const turnId = generateTurnId();
//   const formURL = FORM_BASE + encodeURIComponent(turnId);

//   const qrDiv = document.getElementById("qrCode");
//   qrDiv.innerHTML = "";

//   new QRCode(qrDiv, {
//     text: formURL,
//     width: 180,
//     height: 180
//   });

//   const link = document.getElementById("formLink");
//   link.href = formURL;
//   link.innerText = "Open Google Form (Turn ID: " + turnId + ")";

//   qrDiv.onclick = () => openForm(formURL);
// }

// /* ================= OPEN FORM IN PAGE ================= */
// function openForm(url) {
//   const frame = document.getElementById("formFrame");
//   frame.src = url;
//   frame.style.height = "700px";
// }

// /* ================= DASHBOARD LIVE QUEUE ================= */
// db.ref("queue").on("value", snapshot => {
//   const data = snapshot.val();

//   if (!data) {
//     document.getElementById("waitingCount").innerText = "0";
//     document.getElementById("avgTime").innerText = "2 min";
//     document.getElementById("completedCount").innerText = "0";
//     return;
//   }

//   const users = Object.values(data);

//   const waitingUsers = users.filter(user =>
//     user.completed === false || user.completed === undefined
//   );

//   const completedUsers = users.filter(user =>
//     user.completed === true
//   );

//   document.getElementById("waitingCount").innerText =
//     waitingUsers.length;

//   document.getElementById("avgTime").innerText = "2 min";

//   document.getElementById("completedCount").innerText =
//     completedUsers.length;
// });

// /* ================= LOGOUT ================= */
// function logoutUser() {
//   localStorage.removeItem("user");
//   window.location.href = "index.html";
// }
/************* DASHBOARD.JS - CLIENT DASHBOARD *************/

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

let userPlaces = [];

// Check authentication
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  
  document.getElementById('userEmail').textContent = user.email;
  loadDashboard(user.uid);
});

/**
 * Load dashboard data
 */
async function loadDashboard(userId) {
  try {
    // Load user's places
    const placesSnapshot = await db.ref(`users/${userId}/places`).once('value');
    const placesData = placesSnapshot.val() || {};
    
    let totalWaiting = 0;
    let totalServed = 0;
    let totalPlaces = Object.keys(placesData).length;
    const waitTimes = [];

    // Load details for each place
    const placesPromises = Object.keys(placesData).map(async placeId => {
      const placeSnapshot = await db.ref(`places/${placeId}`).once('value');
      const placeInfo = placeSnapshot.val();
      
      if (!placeInfo) return null;

      // Get queue data for this place
      const queueSnapshot = await db.ref(`queues/${placeId}`).once('value');
      const queueData = queueSnapshot.val() || {};
      const queueArray = Object.values(queueData);

      const waiting = queueArray.filter(q => q.status === 'waiting').length;
      const served = queueArray.filter(q => q.status === 'completed').length;

      totalWaiting += waiting;
      totalServed += served;

      if (waiting > 0) {
        waitTimes.push(waiting * (placeInfo.avgServiceTime || 5));
      }

      return {
        id: placeId,
        ...placeInfo,
        currentWaiting: waiting,
        totalServed: served
      };
    });

    userPlaces = (await Promise.all(placesPromises)).filter(p => p !== null);

    // Update stats
    document.getElementById('totalWaiting').textContent = totalWaiting;
    document.getElementById('totalPlaces').textContent = totalPlaces;
    document.getElementById('totalServed').textContent = totalServed;

    if (waitTimes.length > 0) {
      const avgWait = Math.round(waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length);
      document.getElementById('avgTime').textContent = avgWait + ' min';
    } else {
      document.getElementById('avgTime').textContent = '0 min';
    }

    // Display places
    displayPlaces();

  } catch (error) {
    console.error('Dashboard load error:', error);
  }
}

/**
 * Display places
 */
function displayPlaces() {
  const container = document.getElementById('placesContainer');

  if (userPlaces.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No places registered yet. Click "Register New Place" to get started!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = userPlaces.map(place => `
    <div class="place-card">
      <div class="place-header">
        <div>
          <h3>${place.name}</h3>
          <p class="place-category">${getCategoryIcon(place.category)} ${formatCategory(place.category)}</p>
        </div>
        <div class="place-status ${place.active ? 'active' : 'inactive'}">
          ${place.active ? '🟢 Active' : '🔴 Inactive'}
        </div>
      </div>

      <div class="place-stats">
        <div class="place-stat">
          <span class="stat-label">Waiting</span>
          <span class="stat-value">${place.currentWaiting}</span>
        </div>
        <div class="place-stat">
          <span class="stat-label">Served</span>
          <span class="stat-value">${place.totalServed || 0}</span>
        </div>
        <div class="place-stat">
          <span class="stat-label">Avg Time</span>
          <span class="stat-value">${place.avgServiceTime || 5}m</span>
        </div>
      </div>

      <div class="place-actions">
        <button onclick="managePlace('${place.id}')" class="btn-manage">
          🎛️ Manage Queue
        </button>
        <button onclick="viewQR('${place.id}')" class="btn-qr">
          📱 View QR
        </button>
      </div>
    </div>
  `).join('');
}

/**
 * Manage place
 */
function managePlace(placeId) {
  window.location.href = `admin.html?placeId=${placeId}`;
}

/**
 * View QR code
 */
function viewQR(placeId) {
  const place = userPlaces.find(p => p.id === placeId);
  if (!place) return;

  // Create modal
  const modal = document.createElement('div');
  modal.className = 'qr-modal';
  modal.innerHTML = `
    <div class="qr-modal-content">
      <span class="qr-modal-close" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <h2>${place.name}</h2>
      <p>Share this QR code at your location</p>
      <div id="modalQR" class="qr-display"></div>
      <button onclick="downloadQR('${place.name}')" class="btn-download">
        📥 Download QR Code
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  // Generate QR code
  new QRCode(document.getElementById('modalQR'), {
    text: place.qrCode,
    width: 300,
    height: 300,
    correctLevel: QRCode.CorrectLevel.H
  });

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

/**
 * Download QR code
 */
function downloadQR(placeName) {
  const canvas = document.querySelector('#modalQR canvas');
  if (canvas) {
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `nextturn-${placeName.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = url;
    link.click();
  }
}

/**
 * Show help
 */
function showHelp() {
  alert(`
📚 Next Turn Help

1️⃣ Register a Place: Click "Register New Place" to add your business location

2️⃣ Generate QR Code: Each place gets a unique QR code

3️⃣ Display QR Code: Print and display the QR code at your location

4️⃣ Customers Scan: Customers scan the QR code to join the queue

5️⃣ Manage Queue: Use the admin panel to call customers and manage the queue

6️⃣ Priority Queue: Children, elderly, and pregnant women get priority

7️⃣ Email Notifications: Customers receive email when their turn is near

For more help, contact: support@nextturn.com
  `);
}

/**
 * Logout
 */
function logoutUser() {
  auth.signOut().then(() => {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  });
}

/**
 * Helper functions
 */
function formatCategory(category) {
  return category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
}

function getCategoryIcon(category) {
  const icons = {
    hospital: '🏥',
    bank: '🏦',
    government: '🏛️',
    restaurant: '🍽️',
    retail: '🛒',
    salon: '💇',
    other: '📌'
  };
  return icons[category] || '📌';
}
