# 📡 Next Turn API Documentation

Complete API reference for the Next Turn backend serverless functions.

## Base URL

**Production:** `https://nextturn-three.vercel.app/api`  
**Development:** `http://localhost:3000/api`

---

## 🔐 Authentication

All API endpoints use Firebase Authentication. The frontend automatically handles authentication tokens.

---

## 📋 API Endpoints

### 1. Health Check

Check if the backend is running.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "ok",
  "service": "Next Turn Backend",
  "timestamp": "2026-01-05T12:00:00.000Z",
  "environment": "production"
}
```

---

### 2. Join Queue

Add a person to the queue and send confirmation email.

**Endpoint:** `POST /api/queue-join`

**Request Body:**
```json
{
  "placeId": "string (required)",
  "name": "string (required)",
  "email": "string (required)",
  "phone": "string (optional)",
  "priorityType": "normal|child|elderly|pregnant (required)",
  "age": "number (optional)"
}
```

**Example:**
```json
{
  "placeId": "-NxAbcDef123",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "priorityType": "normal",
  "age": 35
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "queueId": "-NxQueueId456",
  "token": "T-ABC123",
  "position": 3,
  "estimatedTime": 15,
  "message": "Successfully joined the queue"
}
```

**Automatic Actions:**
- Creates queue entry in Firebase
- Calculates position based on priority
- Uses AI to estimate wait time
- Sends confirmation email to user

**Error Responses:**

**400 Bad Request:**
```json
{
  "error": "Missing required fields"
}
```

**404 Not Found:**
```json
{
  "error": "Place not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Failed to join queue",
  "details": "Error message"
}
```

---

### 3. Check Notifications

Check queue status and send notifications to users whose turn is coming up or now.

**Endpoint:** `POST /api/check-notifications`

**Request Body:**
```json
{
  "placeId": "string (required)"
}
```

**Example:**
```json
{
  "placeId": "-NxAbcDef123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "notifications": [
    {
      "queueId": "-NxQueue1",
      "type": "soon",
      "peopleAhead": 2
    },
    {
      "queueId": "-NxQueue2",
      "type": "now"
    }
  ],
  "count": 2,
  "message": "Sent 2 notifications"
}
```

**Notification Types:**
- `soon`: Sent when 2 people are ahead (⚠️ "Your Turn is Coming Up!")
- `now`: Sent when it's their turn (✅ "Your Turn Now!")

**Automatic Actions:**
- Scans all waiting people in queue
- Sends "turn soon" email when 2 people ahead
- Sends "turn now" email when position is next
- Updates notification status in database

---

### 4. Calculate Wait Time

Calculate estimated wait time using AI for a specific position and priority.

**Endpoint:** `POST /api/calculate-wait-time`

**Request Body:**
```json
{
  "placeId": "string (required)",
  "position": "number (required)",
  "priorityType": "normal|child|elderly|pregnant (required)"
}
```

**Example:**
```json
{
  "placeId": "-NxAbcDef123",
  "position": 5,
  "priorityType": "elderly"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "estimatedMinutes": 18,
  "confidence": 85,
  "factors": "Based on historical data and priority status. Priority users receive 30% faster service."
}
```

**AI Features:**
- Uses Google Gemini Pro for intelligent calculation
- Considers historical data and patterns
- Adjusts for priority types (30% reduction)
- Accounts for peak hours (20% increase)
- Falls back to basic calculation if AI unavailable

**Fallback Response (if AI fails):**
```json
{
  "success": true,
  "estimatedMinutes": 25,
  "confidence": 70,
  "factors": "Calculated using average service time"
}
```

---

### 5. Test Email

Send a test email to verify email configuration.

**Endpoint:** `POST /api/test-email`

**Request Body:**
```json
{
  "to": "string (required)"
}
```

**Example:**
```json
{
  "to": "test@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "messageId": "<abc123@gmail.com>"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message details"
}
```

---

## 📧 Email Templates

### 1. Queue Joined Confirmation

**Subject:** `Queue Confirmation - [Place Name]`

**Content:**
- Welcome message with user's name
- Token number (large, highlighted)
- Current position in queue
- Estimated wait time
- Priority status
- Link to dashboard

### 2. Your Turn Soon

**Subject:** `⚠️ Your Turn is Coming Up!`

**Content:**
- Alert that 2 people are ahead
- Token number
- Place name
- Updated estimated time
- Reminder to stay nearby

### 3. Your Turn Now

**Subject:** `✅ Your Turn Now!`

**Content:**
- Large notice to proceed to counter
- Token number (very prominent)
- Place name
- Thank you message

All emails include:
- Professional gradient design (purple/blue)
- Mobile-responsive layout
- Branded footer with Next Turn logo
- Link to dashboard

---

## 🔄 Automatic Notification Flow

### When a Person Joins Queue:

1. ✅ Queue entry created in Firebase
2. 📊 Position calculated (priority users go ahead)
3. 🤖 AI calculates estimated wait time
4. 📧 Confirmation email sent immediately
5. ⏰ System starts monitoring their position

### When Queue Moves Forward:

1. 🔍 Admin calls next person or marks completed
2. 📡 `checkNotifications()` is triggered
3. 🔔 System checks all waiting people:
   - If 2 ahead: Send "turn soon" email
   - If 0 ahead: Send "turn now" email
4. 💾 Update notification status in database

### Automatic Checks:

The admin panel automatically checks for notifications:
- **Every 30 seconds** while admin panel is open
- **After each queue action** (call, complete, remove)
- **Manual trigger** available via refresh button

---

## 🛠 Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (missing/invalid parameters)
- `404` - Not Found (place doesn't exist)
- `405` - Method Not Allowed
- `500` - Internal Server Error

Error responses always include:
```json
{
  "error": "Human-readable error message",
  "details": "Technical details (optional)"
}
```

---

## 🔒 Security Features

1. **CORS Enabled:** Allows requests from any origin
2. **Firebase Auth Integration:** All database writes require authentication
3. **Input Validation:** All inputs are validated and sanitized
4. **Email Verification:** Email format is validated
5. **Rate Limiting:** Built-in Vercel rate limiting
6. **Environment Variables:** Sensitive credentials stored securely

---

## 📊 Firebase Database Structure

### Places
```
places/
  {placeId}/
    name: "Hospital XYZ"
    category: "healthcare"
    ownerId: "user123"
    qrCode: "https://..."
    avgServiceTime: 5
    enablePriority: true
    active: true
```

### Queues
```
queues/
  {placeId}/
    {queueId}/
      name: "John Doe"
      email: "john@example.com"
      token: "T-ABC123"
      position: 3
      status: "waiting" | "called" | "completed"
      priorityType: "normal" | "child" | "elderly" | "pregnant"
      estimatedTime: 15
      notificationSent: false
      createdAt: 1234567890
```

### Users
```
users/
  {uid}/
    email: "owner@example.com"
    places/
      {placeId}/
        name: "My Place"
        role: "owner"
```

---

## 🧪 Testing Examples

### Using cURL

**Join Queue:**
```bash
curl -X POST https://nextturn-three.vercel.app/api/queue-join \
  -H "Content-Type: application/json" \
  -d '{
    "placeId": "-NxAbcDef123",
    "name": "Test User",
    "email": "test@example.com",
    "priorityType": "normal"
  }'
```

**Check Notifications:**
```bash
curl -X POST https://nextturn-three.vercel.app/api/check-notifications \
  -H "Content-Type: application/json" \
  -d '{"placeId": "-NxAbcDef123"}'
```

**Test Email:**
```bash
curl -X POST https://nextturn-three.vercel.app/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to": "your-email@gmail.com"}'
```

### Using JavaScript (fetch)

```javascript
// Join Queue
const response = await fetch('https://nextturn-three.vercel.app/api/queue-join', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    placeId: '-NxAbcDef123',
    name: 'John Doe',
    email: 'john@example.com',
    priorityType: 'normal'
  })
});

const result = await response.json();
console.log(result);
```

---

## 🚀 Performance

- **Cold Start:** ~1-2 seconds (first request after idle)
- **Warm Start:** ~100-300ms
- **Email Delivery:** ~2-5 seconds
- **AI Calculation:** ~1-3 seconds (with fallback)

---

## 📈 Monitoring

### View Function Logs in Vercel:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Functions** tab
4. Select a function to view logs

### CLI Logs:
```bash
vercel logs --follow
```

---

## 🔄 API Versioning

Current version: **v1** (no version prefix in URL)

Future versions will be prefixed: `/api/v2/...`

---

## 📞 Support

For API issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test with `/api/health` endpoint
4. Review error messages in response

---

**API Last Updated:** January 5, 2026  
**Backend Version:** 2.0.0
