# 🚀 Next Turn - Vercel Deployment Guide

Complete guide to deploy Next Turn with fully functional backend on Vercel.

## 📋 Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Firebase Setup](#firebase-setup)
- [Gmail Setup for Email Notifications](#gmail-setup)
- [Gemini AI Setup](#gemini-ai-setup)
- [Vercel Deployment](#vercel-deployment)
- [Environment Variables Configuration](#environment-variables)
- [Testing the Deployment](#testing)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This Next Turn deployment includes:
- ✅ **Serverless Backend API** on Vercel (no separate server needed)
- ✅ **Real-time Email Notifications** using Gmail
- ✅ **AI-Powered Wait Time Calculation** using Google Gemini
- ✅ **Firebase Real-time Database** for queue management
- ✅ **Firebase Authentication** for secure access
- ✅ **Automatic QR Code Generation** for queue joining

---

## ⚙️ Prerequisites

Before starting, ensure you have:

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **Firebase Project** - Already set up with your `nextturn-8217f` project
3. **Gmail Account** - For sending email notifications
4. **Google AI Studio Account** - For Gemini API

---

## 🔥 Firebase Setup

### 1. Generate Service Account Key

Your Firebase Admin SDK needs a service account key to work on Vercel.

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `nextturn-8217f`
3. Click **⚙️ Settings** → **Project Settings**
4. Navigate to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download the JSON file (keep it secure!)

**Important:** This JSON file contains sensitive credentials. Never commit it to Git.

### 2. Deploy Firebase Security Rules

Your security rules are already configured in `database.rules.json`. Deploy them:

```bash
firebase deploy --only database
```

### 3. Enable Firebase Realtime Database

Ensure your database is active at:
```
https://nextturn-8217f-default-rtdb.firebaseio.com
```

---

## 📧 Gmail Setup for Email Notifications

### Step 1: Enable 2-Factor Authentication

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already enabled

### Step 2: Generate App Password

1. Visit [App Passwords](https://myaccount.google.com/apppasswords)
2. Select **App**: Mail
3. Select **Device**: Other (Custom name)
4. Enter name: "Next Turn"
5. Click **Generate**
6. **Copy the 16-character password** (you won't see it again!)

Example: `abcd efgh ijkl mnop`

---

## 🤖 Gemini AI Setup

### Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **Create API Key**
3. Select your Google Cloud project or create new one
4. Copy the API key

Example format: `AIzaSyC...`

---

## 🚀 Vercel Deployment

### Method 1: Deploy via Vercel CLI (Recommended)

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Login to Vercel

```bash
vercel login
```

#### 3. Deploy Project

Navigate to your project directory:

```bash
cd "/Users/jaimin/Downloads/Next turn"
```

Install dependencies:

```bash
npm install
```

Deploy to Vercel:

```bash
vercel
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Select your account
- **Link to existing project**: No
- **Project name**: nextturn (or your choice)
- **Directory**: ./
- **Override settings**: No

#### 4. Deploy to Production

```bash
vercel --prod
```

### Method 2: Deploy via GitHub (Alternative)

1. Push your code to GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **Add New Project**
4. Import your GitHub repository
5. Configure settings (use defaults)
6. Click **Deploy**

---

## 🔐 Environment Variables Configuration

After deployment, you MUST configure environment variables in Vercel.

### Access Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `nextturn` project
3. Go to **Settings** → **Environment Variables**

### Add Required Variables

Add these **5 essential** environment variables:

#### 1. FIREBASE_SERVICE_ACCOUNT

**Value:** The entire content of your service account JSON file

```json
{"type":"service_account","project_id":"nextturn-8217f","private_key_id":"abc123...","private_key":"-----BEGIN PRIVATE KEY-----\nMIIE...","client_email":"firebase-adminsdk-xxx@nextturn-8217f.iam.gserviceaccount.com","client_id":"123456789","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/..."}
```

**Important:** 
- Copy the ENTIRE JSON content
- Make it a single line (no line breaks in the private key)
- Wrap in single quotes in Vercel UI if needed

#### 2. FIREBASE_DATABASE_URL

```
https://nextturn-8217f-default-rtdb.firebaseio.com
```

#### 3. EMAIL_USER

Your Gmail address:
```
your-email@gmail.com
```

#### 4. EMAIL_APP_PASSWORD

The 16-character app password from Gmail (without spaces):
```
abcdefghijklmnop
```

#### 5. GEMINI_API_KEY

Your Gemini API key:
```
AIzaSyC...your-actual-key...
```

### Apply to All Environments

For each variable:
- Check all boxes: **Production**, **Preview**, **Development**
- Click **Save**

### Redeploy After Adding Variables

After adding all variables, trigger a redeployment:

```bash
vercel --prod
```

Or click **Redeploy** in Vercel Dashboard.

---

## ✅ Testing the Deployment

### 1. Test Backend Health

Visit: `https://nextturn-three.vercel.app/api/health`

Expected response:
```json
{
  "status": "ok",
  "service": "Next Turn Backend",
  "timestamp": "2026-01-05T...",
  "environment": "production"
}
```

### 2. Test Email Functionality

Use the admin panel or make a POST request:

```bash
curl -X POST https://nextturn-three.vercel.app/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"your-email@gmail.com"}'
```

Check your email for a test message!

### 3. Test Queue Join Flow

1. **Register a Place**
   - Visit: `https://nextturn-three.vercel.app/register-place.html`
   - Sign in with your Firebase account
   - Fill in place details
   - Click **Register Place**
   - Download the QR code

2. **Join Queue via QR Code**
   - Scan the QR code or visit the join URL
   - Fill in your details
   - Select priority type
   - Click **Join Queue**
   - Check your email for confirmation!

3. **Test Notifications**
   - Open admin panel for your place
   - As people join, the system will automatically:
     - Send confirmation emails when joining
     - Send "your turn soon" when 2 people ahead
     - Send "your turn now" when it's their turn

---

## 🔄 Automatic Notification System

The backend automatically sends notifications:

### How It Works

1. **Queue Join**: Immediate confirmation email
2. **Turn Soon**: Email when 2 people ahead
3. **Turn Now**: Email when it's your turn

### Manual Trigger (if needed)

Admin can manually check and send notifications via admin panel:
- The system checks every 30 seconds automatically
- Or trigger manually by calling the API endpoint

---

## 🐛 Troubleshooting

### Issue: Emails Not Sending

**Solution:**
1. Verify `EMAIL_USER` and `EMAIL_APP_PASSWORD` are correct
2. Check Gmail App Password is 16 characters (no spaces)
3. Ensure 2FA is enabled on Gmail account
4. Check Vercel logs: `vercel logs --follow`

### Issue: Firebase Connection Failed

**Solution:**
1. Verify `FIREBASE_SERVICE_ACCOUNT` is valid JSON
2. Check the JSON is on a single line
3. Ensure `FIREBASE_DATABASE_URL` is correct
4. Verify Firebase Realtime Database is enabled

### Issue: Gemini AI Errors

**Solution:**
1. Verify `GEMINI_API_KEY` is valid
2. Check API quota in Google AI Studio
3. System will fallback to basic calculation if AI fails

### Issue: 404 on API Endpoints

**Solution:**
1. Check `vercel.json` routing configuration
2. Ensure all files in `/api` folder are deployed
3. Check Vercel build logs for errors
4. Redeploy: `vercel --prod`

### View Logs

**Real-time logs:**
```bash
vercel logs --follow
```

**Function logs in Vercel:**
1. Go to your project in Vercel Dashboard
2. Click **Functions** tab
3. Select a function to see logs

---

## 📱 QR Code Usage

### QR codes are automatically generated when you register a place.

**QR Code URL Format:**
```
https://nextturn-three.vercel.app/join.html?placeId=YOUR_PLACE_ID
```

### Print and Display:
1. Download QR code from admin panel
2. Print on A4 paper or poster
3. Display at your location
4. Users scan to join queue instantly!

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** to Git
2. **Rotate API keys** periodically
3. **Monitor Firebase security rules** for unauthorized access
4. **Review Vercel logs** regularly for suspicious activity
5. **Use strong Firebase Authentication** (email verification)

---

## 📈 Monitoring

### Check System Health

- **Vercel Analytics**: Monitor function performance
- **Firebase Console**: Track database usage
- **Gmail Sent Mail**: Verify email delivery
- **Vercel Logs**: Debug issues in real-time

---

## 🎉 You're All Set!

Your Next Turn platform is now fully deployed with:
- ✅ Real-time queue management
- ✅ Email notifications working
- ✅ AI-powered wait times
- ✅ QR code generation
- ✅ Secure authentication

### Live URLs:

- **Main Site**: https://nextturn-three.vercel.app/
- **Admin Panel**: https://nextturn-three.vercel.app/admin.html
- **Dashboard**: https://nextturn-three.vercel.app/dashboard.html
- **API Health**: https://nextturn-three.vercel.app/api/health

---

## 📞 Need Help?

If you encounter issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review Vercel logs: `vercel logs --follow`
3. Check Firebase Console for errors
4. Verify all environment variables are set correctly

---

## 🔄 Future Updates

To update your deployment:

```bash
# Make your changes
git add .
git commit -m "Update description"
git push

# Deploy to Vercel
vercel --prod
```

Or if using GitHub integration, just push to your repository and Vercel will auto-deploy!

---

**Happy Queue Managing! 🎟️**
