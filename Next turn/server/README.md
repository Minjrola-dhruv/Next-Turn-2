# Next Turn Backend Server

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `server` directory:

```env
# Gmail SMTP Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-16-digit-app-password

# Firebase Configuration
FIREBASE_PROJECT_ID=nextturn-8217f
FIREBASE_DATABASE_URL=https://nextturn-8217f-default-rtdb.firebaseio.com

# Google Gemini AI API
GEMINI_API_KEY=your-gemini-api-key

# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5500
```

### 3. Get Gmail App Password

1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification (enable if not enabled)
3. Scroll down to "App passwords"
4. Select "Mail" and "Other (Custom name)"
5. Name it "Next Turn" and generate
6. Copy the 16-digit password (no spaces) to `EMAIL_APP_PASSWORD`

### 4. Get Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Create an API key
3. Copy it to `GEMINI_API_KEY`

### 5. Firebase Admin SDK Setup

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save the JSON file as `serviceAccountKey.json` in the `server` directory
4. Update server.js if needed to use the service account

### 6. Run the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### POST `/api/queue/join`
Join a queue and receive email confirmation
```json
{
  "placeId": "place-id",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "priorityType": "normal|child|elderly|pregnant",
  "age": 25
}
```

### POST `/api/queue/calculate-wait-time`
Calculate estimated wait time using AI
```json
{
  "placeId": "place-id",
  "position": 5,
  "priorityType": "normal"
}
```

### POST `/api/queue/check-notifications`
Check and send notifications to users whose turn is coming up
```json
{
  "placeId": "place-id"
}
```

### POST `/api/test-email`
Test email configuration
```json
{
  "to": "test@example.com"
}
```

## Features

- ✅ Email notifications with HTML templates
- ✅ AI-powered wait time calculation using Gemini
- ✅ Priority queue support (children, elderly, pregnant)
- ✅ Real-time Firebase integration
- ✅ Automatic notification when turn approaches
- ✅ Beautiful email templates
- ✅ Analytics tracking

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| EMAIL_USER | Gmail address for sending emails | Yes |
| EMAIL_APP_PASSWORD | Gmail app password (16 digits) | Yes |
| FIREBASE_PROJECT_ID | Firebase project ID | Yes |
| FIREBASE_DATABASE_URL | Firebase Realtime Database URL | Yes |
| GEMINI_API_KEY | Google Gemini API key | Yes |
| PORT | Server port (default: 3000) | No |

## Troubleshooting

### Email not sending
- Verify Gmail app password is correct
- Ensure 2-factor authentication is enabled
- Check spam folder

### Firebase connection issues
- Verify database URL
- Check Firebase rules
- Ensure service account key is valid

### Gemini API errors
- Verify API key is valid
- Check API quota
- Fallback calculation will be used automatically
