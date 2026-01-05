# Next Turn - Production Deployment Checklist

## ✅ Pre-Deployment Checklist

### Firebase
- [ ] Firebase project created: `nextturn-8217f`
- [ ] Realtime Database enabled
- [ ] Authentication enabled
- [ ] Database rules deployed
- [ ] Service account key generated

### Email Setup
- [ ] Gmail account available
- [ ] 2-Factor Authentication enabled
- [ ] App Password generated (16 characters)
- [ ] App Password saved securely

### Gemini AI
- [ ] Google AI Studio account created
- [ ] Gemini API key generated
- [ ] API key saved securely

### Code Ready
- [ ] All files in `/api` folder created
- [ ] `vercel.json` configured
- [ ] `.env.example` created
- [ ] Dependencies listed in `package.json`
- [ ] `.gitignore` updated

---

## 🚀 Deployment Steps

### 1. Install Dependencies
```bash
cd "/Users/jaimin/Downloads/Next turn"
npm install
```
- [ ] Dependencies installed successfully

### 2. Deploy to Vercel
```bash
vercel login
vercel --prod
```
- [ ] Logged into Vercel
- [ ] Project deployed
- [ ] Deployment URL received

### 3. Configure Environment Variables

Go to Vercel Dashboard → Project → Settings → Environment Variables

Add these 5 variables:

- [ ] `FIREBASE_SERVICE_ACCOUNT` (JSON string)
- [ ] `FIREBASE_DATABASE_URL` (https://nextturn-8217f-default-rtdb.firebaseio.com)
- [ ] `EMAIL_USER` (your Gmail)
- [ ] `EMAIL_APP_PASSWORD` (16-char app password)
- [ ] `GEMINI_API_KEY` (your Gemini key)

### 4. Redeploy
```bash
vercel --prod
```
- [ ] Redeployment completed

---

## ✅ Testing Checklist

### Backend Tests
- [ ] Health check: `https://nextturn-three.vercel.app/api/health`
- [ ] Returns: `{"status":"ok"}`

### Email Tests
```bash
curl -X POST https://nextturn-three.vercel.app/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"your-email@gmail.com"}'
```
- [ ] Email received
- [ ] Email properly formatted
- [ ] Links work correctly

### Full Flow Test
- [ ] Visit register-place.html
- [ ] Register a new place
- [ ] QR code generated
- [ ] QR code scanned/visited
- [ ] Join queue form works
- [ ] Confirmation email received
- [ ] Admin panel shows queue entry
- [ ] Call next person button works
- [ ] Notification email received

---

## 📊 Post-Deployment

### Monitoring
- [ ] Vercel logs accessible: `vercel logs --follow`
- [ ] Firebase Console monitoring active
- [ ] Email delivery rate checked

### Documentation
- [ ] Team has access to VERCEL_DEPLOYMENT.md
- [ ] API_DOCUMENTATION.md reviewed
- [ ] Environment variables documented securely

### Security
- [ ] Service account JSON not committed to Git
- [ ] Environment variables stored in Vercel only
- [ ] Firebase security rules active
- [ ] Database access restricted

---

## 🎯 Production Readiness

### Performance
- [ ] API response time < 2s
- [ ] Email delivery < 5s
- [ ] Page load time acceptable
- [ ] No errors in Vercel logs

### Functionality
- [ ] Queue join works
- [ ] Email notifications sent
- [ ] Admin panel functional
- [ ] QR codes working
- [ ] Priority system working
- [ ] AI wait time calculation working

### User Experience
- [ ] Mobile responsive
- [ ] Error messages clear
- [ ] Loading states present
- [ ] Success confirmations shown

---

## 📝 Notes

**Deployment Date:** _____________

**Deployed By:** _____________

**Vercel URL:** https://nextturn-three.vercel.app/

**Firebase Project:** nextturn-8217f

**Issues Found:**
- _____________
- _____________

**Resolved:**
- _____________
- _____________

---

## 🆘 Emergency Contacts

**Vercel Support:** https://vercel.com/support
**Firebase Support:** https://firebase.google.com/support
**Gmail App Passwords:** https://myaccount.google.com/apppasswords

---

**Status:** 
- [ ] Ready for Production
- [ ] Needs Attention
- [ ] Testing Phase

**Signed Off By:** _____________

**Date:** _____________
