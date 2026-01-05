# 🚀 Quick Setup Guide - Next Turn

## Step-by-Step Setup (15 minutes)

### ✅ Step 1: Clone/Download Project (1 min)
```bash
cd "Next turn"
```

### ✅ Step 2: Firebase Setup (5 min)

#### 2.1 Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it "Next Turn" or similar
4. Disable Google Analytics (optional)
5. Create project

#### 2.2 Enable Realtime Database
1. In left sidebar, click "Realtime Database"
2. Click "Create Database"
3. Choose location (closest to you)
4. Start in **test mode** (we'll update rules later)

#### 2.3 Enable Authentication
1. In left sidebar, click "Authentication"
2. Click "Get started"
3. Click "Email/Password"
4. Enable and save

#### 2.4 Get Firebase Config
1. Click gear icon (⚙️) → Project settings
2. Scroll down to "Your apps"
3. Click web icon (</>)
4. Register app (name: "Next Turn Web")
5. Copy the `firebaseConfig` object
6. Paste in `firebase-config.js` (replace existing config)

#### 2.5 Update Database Rules
1. Go to Realtime Database → Rules tab
2. Copy content from `database.rules.json`
3. Paste in Firebase Console rules editor
4. Click "Publish"

### ✅ Step 3: Gmail SMTP Setup (3 min)

#### 3.1 Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification" if not already enabled

#### 3.2 Create App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Name it "Next Turn"
4. Click "Generate"
5. Copy the 16-digit password (no spaces)

### ✅ Step 4: Get Gemini API Key (2 min)

1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API key"
3. Select your Google Cloud project (or create new)
4. Copy the API key

### ✅ Step 5: Backend Setup (2 min)

```bash
cd server
npm install
```

Create `.env` file in `server` directory:
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
FIREBASE_PROJECT_ID=nextturn-8217f
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
GEMINI_API_KEY=your-gemini-api-key-here
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5500
```

**Replace:**
- `your-gmail@gmail.com` with your Gmail
- `xxxx xxxx xxxx xxxx` with the 16-digit app password
- `your-project.firebaseio.com` with your Firebase database URL
- `your-gemini-api-key-here` with your Gemini API key

### ✅ Step 6: Start Backend Server (1 min)

```bash
npm start
```

You should see:
```
  ╔════════════════════════════════════════╗
  ║   🚀 Next Turn Server Running         ║
  ║   📧 Email notifications: Ready       ║
  ║   🤖 Gemini AI: Enabled               ║
  ║   🔥 Firebase: Connected              ║
  ║   🌐 Port: 3000                       ║
  ╚════════════════════════════════════════╝
```

### ✅ Step 7: Start Frontend (1 min)

**Open a NEW terminal** (keep backend running):

```bash
# If you have Python
python -m http.server 5500

# OR if you have Node.js
npx http-server -p 5500

# OR use VS Code Live Server extension
```

Open browser: `http://localhost:5500`

## 🎉 You're Ready!

### First Time Usage

1. **Sign Up**
   - Go to http://localhost:5500/signup.html
   - Create account with email/password

2. **Register Your First Place**
   - Login → Click "Register New Place"
   - Fill in details
   - Generate QR code

3. **Test the Queue**
   - Open the QR code in a new tab (or scan with phone)
   - Fill form and join queue
   - Open Admin Panel to manage

4. **Test Email Notifications**
   - Backend server → POST to http://localhost:3000/api/test-email
   - Or join queue and wait for auto notifications

## 🔍 Verify Setup

### Test Checklist

- [ ] Can sign up/login
- [ ] Can register a place
- [ ] QR code generates correctly
- [ ] Can join queue via QR
- [ ] Admin panel shows queue
- [ ] Email notifications work
- [ ] Track page shows status

### Common Issues

**Can't login/signup:**
- Check Firebase Authentication is enabled
- Check console for errors
- Verify firebase-config.js is correct

**Backend won't start:**
- Check .env file exists in `server` folder
- Verify all environment variables set
- Check port 3000 is not in use

**Emails not sending:**
- Verify app password (16 digits, no spaces)
- Check 2FA is enabled on Gmail
- Test with: `curl -X POST http://localhost:3000/api/test-email -H "Content-Type: application/json" -d '{"to":"your@email.com"}'`

**QR code doesn't work:**
- Check place ID in URL
- Verify database rules allow read access
- Check browser console for errors

## 📝 Production Deployment

### Backend Deployment (Recommended: Railway/Render)

**Using Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd server
railway up
```

Set environment variables in Railway dashboard.

**Using Render:**
1. Connect GitHub repo
2. Select `server` directory
3. Add environment variables
4. Deploy

### Frontend Deployment (Recommended: Vercel/Netlify)

**Using Vercel:**
```bash
npm install -g vercel
vercel
```

**Using Netlify:**
1. Drag and drop folder to https://app.netlify.com/drop
2. Or connect GitHub repo

**Update API_URL in frontend files:**
Change `http://localhost:3000` to your deployed backend URL in:
- `join.html`
- `admin.js`
- `dashboard.js`

## 🆘 Need Help?

- Check `README.md` for detailed documentation
- Check `server/README.md` for backend specific help
- Check Firebase Console → Database → Rules for access issues
- Check browser console for JavaScript errors
- Check server terminal for backend errors

## 🎓 Learning Resources

- **Firebase:** https://firebase.google.com/docs
- **Nodemailer:** https://nodemailer.com/
- **Gemini API:** https://ai.google.dev/docs
- **QR Codes:** https://davidshimjs.github.io/qrcodejs/

---

**Setup Complete! 🎊**

Start managing queues digitally with Next Turn!
