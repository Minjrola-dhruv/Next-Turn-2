/**
 * Vercel Serverless Function: Join Queue
 * POST /api/queue-join
 */

const { getDatabase } = require('./_firebase');
const { sendEmail, generateEmailHTML } = require('./_email');
const { calculateWaitTimeWithAI } = require('./_ai');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { placeId, name, email, phone, priorityType, age } = req.body;

    if (!placeId || !name || !email || !priorityType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = getDatabase();

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

    // Get analytics for AI calculation
    const analyticsSnapshot = await db.ref(`analytics/${placeId}`).once('value');
    const analytics = analyticsSnapshot.val() || {};

    // Calculate wait time using AI
    const waitTimeData = await calculateWaitTimeWithAI(placeId, position, priorityType, analytics);

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

    await sendEmail(
      email,
      `Queue Confirmation - ${placeData.name}`,
      emailHTML
    );

    res.status(200).json({
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
};
