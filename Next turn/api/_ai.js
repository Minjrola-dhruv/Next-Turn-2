/**
 * AI Service using Google Gemini for dynamic wait time calculation
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

function getGeminiClient() {
  if (!genAI && process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

/**
 * Calculate dynamic wait time using Gemini AI
 */
async function calculateWaitTimeWithAI(placeId, queuePosition, priorityType, analytics = {}) {
  try {
    const client = getGeminiClient();
    if (!client) {
      return fallbackWaitTime(queuePosition, priorityType);
    }

    const model = client.getGenerativeModel({ model: "gemini-pro" });
    
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

module.exports = {
  calculateWaitTimeWithAI,
  fallbackWaitTime
};
