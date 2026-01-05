/**
 * Vercel Serverless Function: Calculate Wait Time
 * POST /api/calculate-wait-time
 */

const { getDatabase } = require('./_firebase');
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
    const { placeId, position, priorityType } = req.body;

    if (!placeId || !position || !priorityType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = getDatabase();
    
    // Get analytics
    const analyticsSnapshot = await db.ref(`analytics/${placeId}`).once('value');
    const analytics = analyticsSnapshot.val() || {};

    const waitTimeData = await calculateWaitTimeWithAI(placeId, position, priorityType, analytics);

    res.status(200).json({
      success: true,
      ...waitTimeData
    });

  } catch (error) {
    console.error('Wait time calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate wait time', details: error.message });
  }
};
