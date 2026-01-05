/**
 * Vercel Serverless Function: Check and Send Queue Notifications
 * POST /api/check-notifications
 */

const { getDatabase } = require('./_firebase');
const { sendEmail, generateEmailHTML } = require('./_email');

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
    const { placeId } = req.body;

    if (!placeId) {
      return res.status(400).json({ error: 'Missing placeId' });
    }

    const db = getDatabase();
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
      if (waitingAhead <= 2 && waitingAhead > 0 && !queueData.notificationSent) {
        const emailHTML = generateEmailHTML('your_turn_soon', {
          name: queueData.name,
          token: queueData.token,
          placeName: queueData.placeName,
          peopleAhead: waitingAhead,
          estimatedTime: waitingAhead * 5
        });

        await sendEmail(
          queueData.email,
          '⚠️ Your Turn is Coming Up!',
          emailHTML
        );

        await queueRef.child(queueId).update({ notificationSent: true });
        notifications.push({ queueId, type: 'soon', peopleAhead: waitingAhead });
      }

      // Notify when it's their turn
      if (waitingAhead === 0 && queueData.status === 'waiting') {
        const emailHTML = generateEmailHTML('your_turn_now', {
          name: queueData.name,
          token: queueData.token,
          placeName: queueData.placeName
        });

        await sendEmail(
          queueData.email,
          '✅ Your Turn Now!',
          emailHTML
        );

        await queueRef.child(queueId).update({ status: 'called' });
        notifications.push({ queueId, type: 'now' });
      }
    }

    res.status(200).json({
      success: true,
      notifications,
      count: notifications.length,
      message: `Sent ${notifications.length} notifications`
    });

  } catch (error) {
    console.error('Notification check error:', error);
    res.status(500).json({ error: 'Failed to check notifications', details: error.message });
  }
};
