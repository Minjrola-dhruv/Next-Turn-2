const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.database();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server ready');
  }
});

/**
 * Calculate dynamic wait time using Gemini AI
 */
async function calculateWaitTimeWithAI(placeId, queuePosition, priorityType) {
  try {
    const analyticsRef = db.ref(`analytics/${placeId}`);
    const snapshot = await analyticsRef.once('value');
    const analytics = snapshot.val() || {};
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
You are an AI assistant for a queue management system. Calculate the estimated waiting time based on:

Current Queue Position: ${queuePosition}
Priority Type: ${priorityType} (normal/child/elderly/pregnant - priority users are served faster)
Historical Average Wait Time: ${analytics.avgWaitTime || 5} minutes per person
Total People Served Today: ${analytics.totalServed || 0}
Peak Hours Data: ${JSON.stringify(analytics.peakHours || {})}

Consider:
1. Priority users (children, elderly, pregnant) should get 30% less wait time
2. Peak hours increase wait time by 20%
3. Historical data patterns
4. Current time of day

Return ONLY a JSON object with this format:
{
  "estimatedMinutes": <number>,
  "confidence": <0-100>,
  "factors": "<brief explanation>"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const aiResult = JSON.parse(jsonMatch[0]);
      return aiResult;
    }
    
    // Fallback calculation
    return fallbackWaitTime(queuePosition, priorityType);
  } catch (error) {
    console.error('AI calculation error:', error);
    return fallbackWaitTime(queuePosition, priorityType);
  }
}

/**
 * Fallback wait time calculation
 */
function fallbackWaitTime(position, priorityType) {
  const baseTime = position * 5; // 5 minutes per person
  const multiplier = (priorityType !== 'normal') ? 0.7 : 1.0;
  return {
    estimatedMinutes: Math.round(baseTime * multiplier),
    confidence: 70,
    factors: 'Calculated using average service time'
  };
}

/**
 * Send email notification
 */
async function sendEmailNotification(to, subject, htmlContent) {
  try {
    const mailOptions = {
      from: `Next Turn <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate email HTML template
 */
function generateEmailHTML(type, data) {
  const baseStyle = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
      <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
  `;
  
  const footer = `
        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0; text-align: center; color: #64748b;">
          <p style="margin: 5px 0;">Next Turn - Smart Queue Management</p>
          <p style="margin: 5px 0; font-size: 12px;">This is an automated notification. Please do not reply.</p>
        </div>
      </div>
    </div>
  `;

  if (type === 'queue_joined') {
    return baseStyle + `
      <h1 style="color: #3b82f6; margin-bottom: 20px;">🎟️ You're in the Queue!</h1>
      <p style="font-size: 16px; color: #334155; line-height: 1.6;">
        Hello <strong>${data.name}</strong>,
      </p>
      <p style="font-size: 16px; color: #334155; line-height: 1.6;">
        You have successfully joined the queue at <strong>${data.placeName}</strong>.
      </p>
      <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 10px 0; font-size: 18px;"><strong>Token Number:</strong> <span style="color: #3b82f6; font-size: 24px;">${data.token}</span></p>
        <p style="margin: 10px 0;"><strong>Current Position:</strong> ${data.position}</p>
        <p style="margin: 10px 0;"><strong>Estimated Wait Time:</strong> ${data.estimatedTime} minutes</p>
        <p style="margin: 10px 0;"><strong>Priority:</strong> ${data.priorityType === 'normal' ? 'Standard' : data.priorityType.charAt(0).toUpperCase() + data.priorityType.slice(1)}</p>
      </div>
      <p style="font-size: 14px; color: #64748b;">
        We'll notify you when you're next in line. Please stay nearby!
      </p>
    ` + footer;
  }

  if (type === 'your_turn_soon') {
    return baseStyle + `
      <h1 style="color: #f59e0b; margin-bottom: 20px;">⚠️ Your Turn is Coming Up!</h1>
      <p style="font-size: 16px; color: #334155; line-height: 1.6;">
        Hello <strong>${data.name}</strong>,
      </p>
      <p style="font-size: 18px; color: #334155; line-height: 1.6; background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <strong>You have ${data.peopleAhead} person(s) ahead of you!</strong>
      </p>
      <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 10px 0;"><strong>Token:</strong> ${data.token}</p>
        <p style="margin: 10px 0;"><strong>Place:</strong> ${data.placeName}</p>
        <p style="margin: 10px 0;"><strong>Estimated Time:</strong> ~${data.estimatedTime} minutes</p>
      </div>
      <p style="font-size: 16px; color: #334155;">
        Please be ready and stay near the service area.
      </p>
    ` + footer;
  }

  if (type === 'your_turn_now') {
    return baseStyle + `
      <h1 style="color: #10b981; margin-bottom: 20px;">✅ It's Your Turn Now!</h1>
      <p style="font-size: 16px; color: #334155; line-height: 1.6;">
        Hello <strong>${data.name}</strong>,
      </p>
      <p style="font-size: 20px; color: #334155; line-height: 1.6; background: #d1fae5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; text-align: center;">
        <strong>🎉 Please proceed to the counter!</strong>
      </p>
      <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <p style="margin: 10px 0; font-size: 32px; color: #3b82f6;"><strong>${data.token}</strong></p>
        <p style="margin: 10px 0;"><strong>${data.placeName}</strong></p>
      </div>
      <p style="font-size: 14px; color: #64748b; text-align: center;">
        Thank you for using Next Turn!
      </p>
    ` + footer;
  }

  return baseStyle + '<p>Notification</p>' + footer;
}

/**
 * API Routes
 */

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Join queue endpoint
app.post('/api/queue/join', async (req, res) => {
  try {
    const { placeId, name, email, phone, priorityType, age } = req.body;

    if (!placeId || !name || !email || !priorityType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get place details
    const placeSnapshot = await db.ref(`places/${placeId}`).once('value');
    if (!placeSnapshot.exists()) {
      return res.status(404).json({ error: 'Place not found' });
    }

    const placeData = placeSnapshot.val();

    // Get current queue
    const queueRef = db.ref(`queues/${placeId}`);
    const queueSnapshot = await queueRef.once('value');
    const currentQueue = queueSnapshot.val() || {};

    // Calculate position with priority
    const waitingQueue = Object.values(currentQueue).filter(q => q.status === 'waiting');
    let position = waitingQueue.length + 1;

    // Priority users get better positions
    if (priorityType !== 'normal') {
      const normalUsers = waitingQueue.filter(q => q.priorityType === 'normal');
      position = waitingQueue.length - normalUsers.length + 1;
    }

    // Generate token
    const newQueueRef = queueRef.push();
    const token = `T-${newQueueRef.key.slice(-6).toUpperCase()}`;

    // Calculate wait time using AI
    const waitTimeData = await calculateWaitTimeWithAI(placeId, position, priorityType);

    // Create queue entry
    const queueEntry = {
      name,
      email,
      phone: phone || '',
      priorityType,
      age: age || null,
      position,
      status: 'waiting',
      token,
      createdAt: Date.now(),
      estimatedTime: waitTimeData.estimatedMinutes,
      notificationSent: false,
      placeId,
      placeName: placeData.name
    };

    await newQueueRef.set(queueEntry);

    // Send confirmation email
    const emailHTML = generateEmailHTML('queue_joined', {
      name,
      placeName: placeData.name,
      token,
      position,
      estimatedTime: waitTimeData.estimatedMinutes,
      priorityType
    });

    await sendEmailNotification(
      email,
      `Queue Confirmation - ${placeData.name}`,
      emailHTML
    );

    res.json({
      success: true,
      queueId: newQueueRef.key,
      token,
      position,
      estimatedTime: waitTimeData.estimatedMinutes,
      message: 'Successfully joined the queue'
    });

  } catch (error) {
    console.error('Queue join error:', error);
    res.status(500).json({ error: 'Failed to join queue', details: error.message });
  }
});

// Calculate wait time endpoint
app.post('/api/queue/calculate-wait-time', async (req, res) => {
  try {
    const { placeId, position, priorityType } = req.body;

    const waitTimeData = await calculateWaitTimeWithAI(placeId, position, priorityType);

    res.json({
      success: true,
      ...waitTimeData
    });

  } catch (error) {
    console.error('Wait time calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate wait time' });
  }
});

// Monitor queue and send notifications
app.post('/api/queue/check-notifications', async (req, res) => {
  try {
    const { placeId } = req.body;

    const queueRef = db.ref(`queues/${placeId}`);
    const snapshot = await queueRef.once('value');
    const queue = snapshot.val() || {};

    const notifications = [];

    for (const [queueId, queueData] of Object.entries(queue)) {
      if (queueData.status !== 'waiting') continue;

      const waitingAhead = Object.values(queue).filter(q => 
        q.status === 'waiting' && q.position < queueData.position
      ).length;

      // Notify when 2 people ahead
      if (waitingAhead <= 2 && !queueData.notificationSent) {
        const emailHTML = generateEmailHTML('your_turn_soon', {
          name: queueData.name,
          token: queueData.token,
          placeName: queueData.placeName,
          peopleAhead: waitingAhead,
          estimatedTime: waitingAhead * 5
        });

        await sendEmailNotification(
          queueData.email,
          '⚠️ Your Turn is Coming Up!',
          emailHTML
        );

        await queueRef.child(queueId).update({ notificationSent: true });
        notifications.push({ queueId, type: 'soon' });
      }

      // Notify when it's their turn
      if (waitingAhead === 0 && queueData.status === 'waiting') {
        const emailHTML = generateEmailHTML('your_turn_now', {
          name: queueData.name,
          token: queueData.token,
          placeName: queueData.placeName
        });

        await sendEmailNotification(
          queueData.email,
          '✅ Your Turn Now!',
          emailHTML
        );

        await queueRef.child(queueId).update({ status: 'called' });
        notifications.push({ queueId, type: 'now' });
      }
    }

    res.json({
      success: true,
      notifications,
      message: `Sent ${notifications.length} notifications`
    });

  } catch (error) {
    console.error('Notification check error:', error);
    res.status(500).json({ error: 'Failed to check notifications' });
  }
});

// Test email endpoint
app.post('/api/test-email', async (req, res) => {
  try {
    const { to } = req.body;
    
    const result = await sendEmailNotification(
      to,
      'Test Email from Next Turn',
      generateEmailHTML('queue_joined', {
        name: 'Test User',
        placeName: 'Test Location',
        token: 'T-TEST123',
        position: 1,
        estimatedTime: 5,
        priorityType: 'normal'
      })
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   🚀 Next Turn Server Running         ║
  ║   📧 Email notifications: Ready       ║
  ║   🤖 Gemini AI: Enabled               ║
  ║   🔥 Firebase: Connected              ║
  ║   🌐 Port: ${PORT}                      ║
  ╚════════════════════════════════════════╝
  `);
});

module.exports = app;
