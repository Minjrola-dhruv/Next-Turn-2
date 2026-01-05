/************* ADMIN.JS - COMPREHENSIVE ADMIN PANEL *************/

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

let currentPlaceId = null;
let currentPlace = null;
let currentlyServing = null;
let queueListener = null;

// Backend API URL - automatically use production or development URL
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api'
  : 'https://nextturn-three.vercel.app/api';

// Check authentication
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  
  // Get place ID from URL or user's places
  const urlParams = new URLSearchParams(window.location.search);
  currentPlaceId = urlParams.get('placeId');
  
  if (!currentPlaceId) {
    // Load user's first place
    db.ref(`users/${user.uid}/places`).once('value', snapshot => {
      const places = snapshot.val();
      if (places) {
        currentPlaceId = Object.keys(places)[0];
        initializeAdmin();
      } else {
        alert('No places registered. Please register a place first.');
        window.location.href = 'register-place.html';
      }
    });
  } else {
    initializeAdmin();
  }
});

/**
 * Initialize admin panel
 */
async function initializeAdmin() {
  try {
    // Load place data
    const placeSnapshot = await db.ref(`places/${currentPlaceId}`).once('value');
    currentPlace = placeSnapshot.val();
    
    if (!currentPlace) {
      alert('Place not found');
      return;
    }

    // Update header
    document.getElementById('placeName').textContent = currentPlace.name;
    document.getElementById('placeAddress').textContent = currentPlace.address || '';
    
    // Generate QR codes
    generateQRCodes();
    
    // Load settings
    loadSettings();
    
    // Start listening to queue
    listenToQueue();
    
    // Load analytics
    loadAnalytics();
    
    // Check for notifications periodically
    setInterval(checkNotifications, 30000); // Every 30 seconds
    
  } catch (error) {
    console.error('Initialization error:', error);
    alert('Failed to load admin panel');
  }
}

/**
 * Listen to queue updates in real-time
 */
function listenToQueue() {
  if (queueListener) {
    queueListener.off();
  }
  
  const queueRef = db.ref(`queues/${currentPlaceId}`);
  queueListener = queueRef;
  
  queueRef.on('value', snapshot => {
    const queueData = snapshot.val() || {};
    updateQueueDisplay(queueData);
    updateOverview(queueData);
  });
}

/**
 * Update queue display
 */
function updateQueueDisplay(queueData) {
  const queueArray = Object.entries(queueData)
    .map(([id, data]) => ({ id, ...data }))
    .filter(item => item.status !== 'completed')
    .sort((a, b) => {
      // Sort by priority first, then by position
      const priorityOrder = { pregnant: 0, elderly: 1, child: 2, normal: 3 };
      const priorityDiff = priorityOrder[a.priorityType] - priorityOrder[b.priorityType];
      return priorityDiff !== 0 ? priorityDiff : a.position - b.position;
    });

  // Update table
  const tbody = document.getElementById('queueTableBody');
  if (queueArray.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No people in queue</td></tr>';
  } else {
    tbody.innerHTML = queueArray.map((item, index) => `
      <tr class="${item.status === 'called' ? 'row-called' : ''}">
        <td><strong>${item.token}</strong></td>
        <td>${item.name}</td>
        <td>${item.email}</td>
        <td>${item.phone || 'N/A'}</td>
        <td><span class="badge badge-${item.priorityType}">${formatPriority(item.priorityType)}</span></td>
        <td>#${index + 1}</td>
        <td>${item.estimatedTime || 'N/A'} min</td>
        <td><span class="badge badge-${item.status}">${item.status}</span></td>
        <td>
          <button onclick="callPerson('${item.id}')" class="btn-sm btn-primary" ${item.status === 'called' ? 'disabled' : ''}>Call</button>
          <button onclick="completePerson('${item.id}')" class="btn-sm btn-success">Complete</button>
          <button onclick="removePerson('${item.id}')" class="btn-sm btn-danger">Remove</button>
        </td>
      </tr>
    `).join('');
  }

  // Update current person
  const calledPerson = queueArray.find(item => item.status === 'called');
  const currentPersonDiv = document.getElementById('currentPerson');
  
  if (calledPerson) {
    currentlyServing = calledPerson;
    currentPersonDiv.innerHTML = `
      <div class="person-card large">
        <div class="person-token">${calledPerson.token}</div>
        <div class="person-info">
          <h4>${calledPerson.name}</h4>
          <p>📧 ${calledPerson.email}</p>
          <p>📱 ${calledPerson.phone || 'N/A'}</p>
          <p>⏱️ Called ${getTimeAgo(calledPerson.calledAt || calledPerson.createdAt)}</p>
        </div>
        <span class="badge badge-${calledPerson.priorityType}">${formatPriority(calledPerson.priorityType)}</span>
      </div>
    `;
  } else {
    currentlyServing = null;
    currentPersonDiv.innerHTML = '<p class="empty-state">No one currently being served</p>';
  }

  // Update next in line
  const nextPeople = queueArray.filter(item => item.status === 'waiting').slice(0, 3);
  const nextDiv = document.getElementById('nextPeople');
  
  if (nextPeople.length === 0) {
    nextDiv.innerHTML = '<p class="empty-state">Queue is empty</p>';
  } else {
    nextDiv.innerHTML = nextPeople.map(item => `
      <div class="person-card">
        <div class="person-token small">${item.token}</div>
        <div class="person-info">
          <h5>${item.name}</h5>
          <p>Est. wait: ${item.estimatedTime || 'N/A'} min</p>
        </div>
        <span class="badge badge-${item.priorityType}">${formatPriority(item.priorityType)}</span>
      </div>
    `).join('');
  }
}

/**
 * Update overview statistics
 */
function updateOverview(queueData) {
  const queueArray = Object.values(queueData);
  
  const waiting = queueArray.filter(item => item.status === 'waiting' || item.status === 'called');
  const completed = queueArray.filter(item => item.status === 'completed');
  
  const today = new Date().setHours(0, 0, 0, 0);
  const servedToday = queueArray.filter(item => 
    item.status === 'completed' && item.completedAt >= today
  );

  document.getElementById('waitingCount').textContent = waiting.length;
  document.getElementById('servedToday').textContent = servedToday.length;
  document.getElementById('totalServed').textContent = currentPlace.totalServed || completed.length;

  // Calculate average wait time
  if (waiting.length > 0) {
    const avgTime = Math.round(
      waiting.reduce((sum, item) => sum + (item.estimatedTime || 5), 0) / waiting.length
    );
    document.getElementById('avgWaitTime').textContent = avgTime + ' min';
  } else {
    document.getElementById('avgWaitTime').textContent = '0 min';
  }
}

/**
 * Load analytics
 */
function loadAnalytics() {
  db.ref(`queues/${currentPlaceId}`).once('value', snapshot => {
    const queueData = snapshot.val() || {};
    const queueArray = Object.values(queueData);

    // Total today
    const today = new Date().setHours(0, 0, 0, 0);
    const todayQueue = queueArray.filter(item => item.createdAt >= today);
    document.getElementById('analyticsTotalToday').textContent = todayQueue.length;

    // Priority users
    const priority = queueArray.filter(item => item.priorityType !== 'normal');
    document.getElementById('analyticsPriority').textContent = priority.length;

    // Category breakdown
    document.getElementById('catNormal').textContent = 
      queueArray.filter(item => item.priorityType === 'normal').length;
    document.getElementById('catChild').textContent = 
      queueArray.filter(item => item.priorityType === 'child').length;
    document.getElementById('catElderly').textContent = 
      queueArray.filter(item => item.priorityType === 'elderly').length;
    document.getElementById('catPregnant').textContent = 
      queueArray.filter(item => item.priorityType === 'pregnant').length;

    // Average service time
    const completed = queueArray.filter(item => 
      item.status === 'completed' && item.completedAt && item.createdAt
    );
    
    if (completed.length > 0) {
      const avgService = Math.round(
        completed.reduce((sum, item) => 
          sum + ((item.completedAt - item.createdAt) / 60000), 0
        ) / completed.length
      );
      document.getElementById('analyticsAvgService').textContent = avgService + ' min';
    }

    // Wait time analysis
    if (completed.length > 0) {
      const waitTimes = completed.map(item => (item.completedAt - item.createdAt) / 60000);
      document.getElementById('shortestWait').textContent = Math.round(Math.min(...waitTimes)) + ' min';
      document.getElementById('longestWait').textContent = Math.round(Math.max(...waitTimes)) + ' min';
    }

    // Current queue time
    const waiting = queueArray.filter(item => item.status === 'waiting');
    const totalQueueTime = waiting.reduce((sum, item) => sum + (item.estimatedTime || 5), 0);
    document.getElementById('currentQueueTime').textContent = totalQueueTime + ' min';
  });
}

/**
 * Load settings
 */
function loadSettings() {
  document.getElementById('settingAvgTime').value = currentPlace.avgServiceTime || 5;
  document.getElementById('settingPriority').checked = currentPlace.enablePriority !== false;
  document.getElementById('settingNotifications').checked = currentPlace.enableNotifications !== false;
  document.getElementById('settingActive').checked = currentPlace.active !== false;
}

// Settings form submit
document.getElementById('settingsForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
    const updates = {
      avgServiceTime: parseInt(document.getElementById('settingAvgTime').value),
      enablePriority: document.getElementById('settingPriority').checked,
      enableNotifications: document.getElementById('settingNotifications').checked,
      active: document.getElementById('settingActive').checked
    };

    await db.ref(`places/${currentPlaceId}`).update(updates);
    currentPlace = { ...currentPlace, ...updates };
    
    alert('✅ Settings saved successfully!');
  } catch (error) {
    console.error('Settings save error:', error);
    alert('❌ Failed to save settings');
  }
});

/**
 * Call next person in queue
 */
async function callNext() {
  try {
    const queueSnapshot = await db.ref(`queues/${currentPlaceId}`).once('value');
    const queueData = queueSnapshot.val() || {};
    
    const waiting = Object.entries(queueData)
      .map(([id, data]) => ({ id, ...data }))
      .filter(item => item.status === 'waiting')
      .sort((a, b) => {
        const priorityOrder = { pregnant: 0, elderly: 1, child: 2, normal: 3 };
        const priorityDiff = priorityOrder[a.priorityType] - priorityOrder[b.priorityType];
        return priorityDiff !== 0 ? priorityDiff : a.position - b.position;
      });

    if (waiting.length === 0) {
      alert('Queue is empty!');
      return;
    }

    const nextPerson = waiting[0];
    await callPerson(nextPerson.id);
    
  } catch (error) {
    console.error('Call next error:', error);
    alert('Failed to call next person');
  }
}

/**
 * Call specific person
 */
async function callPerson(queueId) {
  try {
    await db.ref(`queues/${currentPlaceId}/${queueId}`).update({
      status: 'called',
      calledAt: Date.now()
    });

    // Trigger notification
    await checkNotifications();
    
    alert('✅ Person called!');
  } catch (error) {
    console.error('Call person error:', error);
    alert('Failed to call person');
  }
}

/**
 * Mark person as completed
 */
async function completePerson(queueId) {
  try {
    await db.ref(`queues/${currentPlaceId}/${queueId}`).update({
      status: 'completed',
      completedAt: Date.now()
    });

    // Update total served count
    await db.ref(`places/${currentPlaceId}/totalServed`).transaction(count => (count || 0) + 1);
    
    // Trigger notifications for next people
    await checkNotifications();
    
    alert('✅ Marked as completed!');
  } catch (error) {
    console.error('Complete person error:', error);
    alert('Failed to mark as completed');
  }
}

/**
 * Mark currently serving person as completed
 */
async function markCompleted() {
  if (!currentlyServing) {
    alert('No one is currently being served');
    return;
  }
  
  await completePerson(currentlyServing.id);
}

/**
 * Remove person from queue
 */
async function removePerson(queueId) {
  if (!confirm('Are you sure you want to remove this person from the queue?')) {
    return;
  }
  
  try {
    await db.ref(`queues/${currentPlaceId}/${queueId}`).remove();
    alert('✅ Person removed from queue');
  } catch (error) {
    console.error('Remove person error:', error);
    alert('Failed to remove person');
  }
}

/**
 * Clear entire queue
 */
async function clearQueue() {
  if (!confirm('Are you sure you want to clear the entire queue? This cannot be undone!')) {
    return;
  }
  
  try {
    await db.ref(`queues/${currentPlaceId}`).remove();
    alert('✅ Queue cleared');
  } catch (error) {
    console.error('Clear queue error:', error);
    alert('Failed to clear queue');
  }
}

/**
 * Check and send notifications via backend
 */
async function checkNotifications() {
  try {
    const response = await fetch(`${API_URL}/check-notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ placeId: currentPlaceId })
    });
    
    const result = await response.json();
    console.log('Notifications checked:', result);
    return result;
  } catch (error) {
    console.error('Notification check error:', error);
    // Fail silently - notifications are not critical
    return null;
  }
}

/**
 * Generate QR codes
 */
function generateQRCodes() {
  const qrURL = currentPlace.qrCode;
  
  // Main QR display
  const qrDisplay = document.getElementById('qrCodeDisplay');
  if (qrDisplay) {
    qrDisplay.innerHTML = '';
    new QRCode(qrDisplay, {
      text: qrURL,
      width: 200,
      height: 200,
      correctLevel: QRCode.CorrectLevel.H
    });
  }
}

/**
 * Show QR modal
 */
function showQR() {
  const modal = document.getElementById('qrModal');
  const modalQR = document.getElementById('modalQRCode');
  
  modalQR.innerHTML = '';
  new QRCode(modalQR, {
    text: currentPlace.qrCode,
    width: 300,
    height: 300,
    correctLevel: QRCode.CorrectLevel.H
  });
  
  modal.style.display = 'block';
}

function closeQRModal() {
  document.getElementById('qrModal').style.display = 'none';
}

/**
 * Download QR code
 */
function downloadQRCode() {
  const canvas = document.querySelector('#qrCodeDisplay canvas');
  if (canvas) {
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `nextturn-${currentPlace.name.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = url;
    link.click();
  }
}

/**
 * Refresh data
 */
function refreshData() {
  loadAnalytics();
  alert('✅ Data refreshed');
}

/**
 * Show section
 */
function showSection(sectionId) {
  // Update nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  event.target.closest('.nav-item').classList.add('active');
  
  // Update sections
  document.querySelectorAll('.admin-section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(sectionId).classList.add('active');
}

/**
 * Logout
 */
function logoutAdmin() {
  auth.signOut().then(() => {
    window.location.href = 'login.html';
  });
}

/**
 * Helper functions
 */
function formatPriority(priority) {
  const map = {
    normal: 'Normal',
    child: '👶 Child',
    elderly: '👴 Elderly',
    pregnant: '🤰 Pregnant'
  };
  return map[priority] || priority;
}

function getTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return seconds + 's ago';
  if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
  if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
  return Math.floor(seconds / 86400) + 'd ago';
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('qrModal');
  if (event.target === modal) {
    closeQRModal();
  }
}
