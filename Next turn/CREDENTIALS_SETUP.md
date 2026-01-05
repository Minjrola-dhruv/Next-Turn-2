# 🔑 Credentials Setup Guide

Your Firebase URL is already configured! Now you just need 2 more credentials:

---

## 1. 📧 Gmail App Password (for Email Notifications)

### Steps:

1. **Go to Google Account Settings:**
   - Visit: https://myaccount.google.com/security

2. **Enable 2-Factor Authentication** (if not already enabled):
   - Click "2-Step Verification"
   - Follow the setup wizard
   - This is REQUIRED for app passwords

3. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords
   - Select app: "Mail"
   - Select device: "Other (Custom name)" → Type "Next Turn Queue System"
   - Click "Generate"
   - **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

4. **Add to your `.env` file:**
   ```bash
   EMAIL_USER=your-actual-email@gmail.com
   EMAIL_APP_PASSWORD=abcdefghijklmnop  # Remove spaces
   ```

---

## 2. 🤖 Gemini API Key (for AI Wait Time Calculation)

### Steps:

1. **Visit Google AI Studio:**
   - Go to: https://aistudio.google.com/app/apikey

2. **Create API Key:**
   - Sign in with your Google account
   - Click "Create API Key"
   - Choose "Create API key in new project" (or select existing)
   - Copy the generated key (starts with `AIza...`)

3. **Add to your `.env` file:**
   ```bash
   GEMINI_API_KEY=AIzaSy...your-actual-key-here
   ```

---

## ✅ Your Complete `.env` File Should Look Like:

```bash
# Email Configuration
EMAIL_USER=jaimin@gmail.com
EMAIL_APP_PASSWORD=abcdefghijklmnop

# Firebase Admin SDK (already configured)
FIREBASE_PROJECT_ID=nextturn-8217f
FIREBASE_DATABASE_URL=https://nextturn-8217f-default-rtdb.firebaseio.com

# Gemini API
GEMINI_API_KEY=AIzaSy...your-key...

# Server Configuration (already set)
PORT=3000
NODE_ENV=development

# Frontend URL (already set)
FRONTEND_URL=http://localhost:5500
```

---

## 🚀 After Adding Credentials:

### 1. Install Backend Dependencies:
```bash
cd server
npm install
```

### 2. Start Backend Server:
```bash
npm start
```

You should see:
```
✅ Server running on port 3000
✅ Gemini AI initialized
```

### 3. Start Frontend:
```bash
# In the main project folder
python3 -m http.server 5500
```

Or use VS Code Live Server extension.

---

## 🧪 Test Your Setup:

### Test Email System:
```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@gmail.com"}'
```

You should receive a test email!

### Test Gemini AI:
The AI will automatically be used when customers join the queue.
Check server logs for "AI calculation" messages.

---

## ❓ Troubleshooting:

### Gmail App Password Not Working?
- Make sure 2FA is enabled first
- Remove all spaces from the 16-character password
- Try regenerating the app password
- Check that EMAIL_USER matches the Gmail account

### Gemini API Not Working?
- Verify API key starts with `AIza`
- Check API is enabled at: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
- Make sure billing is enabled (free tier available)

### Firebase Connection Issues?
- Verify database URL is exactly: `https://nextturn-8217f-default-rtdb.firebaseio.com`
- Check Firebase Console → Realtime Database → Rules are deployed
- Ensure database is in "Test Mode" or has proper rules deployed

---

## 📊 Current Status:

✅ Firebase URL configured  
✅ Firebase project ID set  
⏳ Gmail app password needed  
⏳ Gemini API key needed  

**You're 2 credentials away from a fully working system!** 🎉
