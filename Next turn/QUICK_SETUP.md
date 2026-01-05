# 🚀 Quick Setup Guide - Next Turn Backend

Get your Next Turn platform up and running with real-time email notifications in minutes!

## ✅ What You're Getting

Your platform now has:
- ✅ **Fully Serverless Backend** on Vercel
- ✅ **Real-time Email Notifications** (Gmail integration)
- ✅ **AI-Powered Wait Times** (Google Gemini)
- ✅ **Firebase Integration** (Authentication & Database)
- ✅ **Automatic QR Code Generation**
- ✅ **Production-Ready Configuration**

## 🎯 Quick Start (5 Steps)

### 1️⃣ Install Dependencies

```bash
cd "/Users/jaimin/Downloads/Next turn"
npm install
```

### 2️⃣ Set Up Gmail for Email Notifications

1. **Enable 2-Factor Authentication** on your Gmail account
   - Go to: https://myaccount.google.com/security
   - Turn on 2-Step Verification

2. **Generate App Password**
   - Visit: https://myaccount.google.com/apppasswords
   - App: Mail
   - Device: Other (Custom) → "Next Turn"
   - **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

### 3️⃣ Get Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **nextturn-8217f**
3. Settings ⚙️ → Project Settings → Service Accounts
4. Click **Generate New Private Key**
5. Download the JSON file (keep it secure!)

### 4️⃣ Get Gemini AI Key

1. Visit: https://makersuite.google.com/app/apikey
2. Click **Create API Key**
3. Copy the key (starts with `AIzaSy...`)

### 5️⃣ Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

When prompted:
- Project name: **nextturn** (or your choice)
- Directory: **.**
- Override settings: **No**

## 🔐 Configure Environment Variables

After deployment, add these to Vercel:

1. Go to: [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project → Settings → Environment Variables

### Add These 5 Variables:

| Variable | Value | Example |
|----------|-------|---------|
| `FIREBASE_SERVICE_ACCOUNT` | Entire JSON from Firebase | `{"type":"service_account",...}` |
| `FIREBASE_DATABASE_URL` | Your database URL | `https://nextturn-8217f-default-rtdb.firebaseio.com` |
| `EMAIL_USER` | Your Gmail | `your-email@gmail.com` |
| `EMAIL_APP_PASSWORD` | 16-char app password (no spaces) | `abcdefghijklmnop` |
| `GEMINI_API_KEY` | Your Gemini key | `AIzaSyC...` |

**Important:** Check all boxes: Production, Preview, Development

### Then Redeploy:

```bash
vercel --prod
```

## ✅ Test Your Setup

### 1. Test Backend Health

Visit: https://nextturn-three.vercel.app/api/health

Expected:
```json
{"status":"ok","service":"Next Turn Backend"}
```

### 2. Test Email

```bash
curl -X POST https://nextturn-three.vercel.app/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"your-email@gmail.com"}'
```

Check your email! 📧

### 3. Test Full Flow

1. Visit: https://nextturn-three.vercel.app/register-place.html
2. Register a new place
3. Download the QR code
4. Scan QR code (or visit the link)
5. Join the queue
6. **Check your email for confirmation!** ✅

## 📱 How It Works

### User Journey:
1. **Scan QR Code** → Join queue page opens
2. **Fill details** → Name, email, priority type
3. **Submit** → Backend processes request
4. **Email sent** → Confirmation with token number
5. **Wait** → System monitors position
6. **Get notified** → Email when turn is near
7. **Your turn** → Email to proceed to counter

### Admin Flow:
1. **Open admin panel** → See live queue
2. **Call next person** → System sends notification
3. **Mark completed** → Updates queue automatically
4. **Notifications sent** → To next people in line

## 🎨 Features You Can Use Now

### ✅ Queue Management
- Real-time queue updates
- Priority handling (child, elderly, pregnant)
- Token-based system
- Position tracking

### ✅ Email Notifications
- **Queue Joined:** Immediate confirmation
- **Turn Soon:** When 2 people ahead
- **Turn Now:** When it's your turn
- Beautiful HTML templates with gradients

### ✅ AI-Powered Features
- Smart wait time calculation
- Historical data analysis
- Peak hour adjustments
- Priority user optimization

### ✅ Admin Dashboard
- Live queue monitoring
- Call next person button
- Mark as completed
- Analytics and statistics
- QR code download

## 📖 Documentation

We've created comprehensive docs for you:

- **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** - Complete deployment guide
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - API reference
- **[.env.example](./.env.example)** - Environment variables template

## 🔧 File Structure

```
Next turn/
├── api/                          # 🆕 Serverless Functions
│   ├── _firebase.js             # Firebase Admin setup
│   ├── _email.js                # Email service
│   ├── _ai.js                   # Gemini AI integration
│   ├── queue-join.js            # Join queue endpoint
│   ├── check-notifications.js   # Send notifications
│   ├── calculate-wait-time.js   # AI wait time
│   ├── test-email.js            # Email testing
│   └── health.js                # Health check
│
├── vercel.json                   # 🆕 Vercel configuration
├── .env.example                  # 🆕 Environment template
├── VERCEL_DEPLOYMENT.md         # 🆕 Deployment guide
├── API_DOCUMENTATION.md         # 🆕 API docs
│
├── index.html                    # Landing page
├── join.html                    # Queue join page (✅ Updated)
├── admin.html                   # Admin panel
├── dashboard.html               # User dashboard
├── register-place.html          # Place registration
│
├── admin.js                     # ✅ Updated with API calls
├── dashboard.js                 # Dashboard logic
├── firebase-config.js           # Firebase config
│
└── Images/                      # Your logos
```

## 🆕 What's Changed

### Backend (New Files)
- ✅ Created `/api` folder with 8 serverless functions
- ✅ Firebase Admin SDK integration
- ✅ Nodemailer email service
- ✅ Gemini AI integration

### Frontend (Updated)
- ✅ `admin.js` - Auto-detects production vs local API
- ✅ `join.html` - Uses backend API for queue joining
- ✅ QR codes now use production URL automatically

### Configuration
- ✅ `vercel.json` - Routes and build config
- ✅ `package.json` - Updated dependencies
- ✅ `.gitignore` - Added Vercel folder

## 🐛 Troubleshooting

### Emails Not Sending?
```bash
# Test email configuration
curl -X POST https://nextturn-three.vercel.app/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"your-email@gmail.com"}'
```

**Check:**
- Gmail app password is correct (16 chars, no spaces)
- 2FA is enabled on Gmail
- `EMAIL_USER` and `EMAIL_APP_PASSWORD` are set in Vercel

### Firebase Connection Failed?
**Check:**
- `FIREBASE_SERVICE_ACCOUNT` is valid JSON
- JSON is on a single line (no line breaks)
- Database URL is correct

### API 404 Errors?
```bash
# Check API health
curl https://nextturn-three.vercel.app/api/health
```

**Solutions:**
- Redeploy: `vercel --prod`
- Check Vercel logs: `vercel logs --follow`
- Verify `vercel.json` routes

## 📊 Monitor Your System

### View Logs
```bash
vercel logs --follow
```

### Check Function Performance
1. Vercel Dashboard → Your Project
2. Click **Functions** tab
3. View execution time and errors

### Firebase Console
- Monitor database reads/writes
- Check authentication status
- Review security rules

## 🎉 You're Done!

Your Next Turn platform is now:
- ✅ Deployed on Vercel
- ✅ Sending real emails
- ✅ Using AI for wait times
- ✅ Fully functional backend
- ✅ Production ready

## 🔗 Important Links

**Your Live App:**
- Main: https://nextturn-three.vercel.app/
- Admin: https://nextturn-three.vercel.app/admin.html
- Dashboard: https://nextturn-three.vercel.app/dashboard.html

**APIs:**
- Health: https://nextturn-three.vercel.app/api/health
- Join Queue: POST to `/api/queue-join`
- Notifications: POST to `/api/check-notifications`

**Resources:**
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Firebase Console](https://console.firebase.google.com/)
- [Google AI Studio](https://makersuite.google.com/)

## 💡 Next Steps

1. **Register your first place** → Get QR code
2. **Print QR code** → Display at your location
3. **Test with real users** → Get feedback
4. **Monitor emails** → Check delivery rate
5. **Scale up** → Add more places

## 🆘 Need Help?

1. Check [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed guide
2. Review [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
3. Check Vercel logs: `vercel logs --follow`
4. Test individual endpoints with cURL

---

**Built with ❤️ for Next Turn**

Last Updated: January 5, 2026
