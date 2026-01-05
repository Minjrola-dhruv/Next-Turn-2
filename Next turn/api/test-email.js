/**
 * Vercel Serverless Function: Test Email
 * POST /api/test-email
 */

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
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({ error: 'Email address required' });
    }
    
    const result = await sendEmail(
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

    res.status(200).json(result);
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ error: error.message });
  }
};
