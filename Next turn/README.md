# 🎯 Next Turn - Smart Queue Management System

> A comprehensive digital queue management platform with AI-powered wait time estimation, priority queuing, and automated email notifications.

## ✨ Features

### 🎫 Core Features
- **Digital Queue Management** - Replace physical queues with digital tokens
- **Unique QR Codes per Location** - Each place gets a unique QR code for customers to scan
- **Priority Queue System** - Automatic priority for:
  - 👶 Children (under 12 years)
  - 👴 Elderly (over 60 years)
  - 🤰 Pregnant women
  - 👤 Normal queue
- **AI-Powered Wait Time Estimation** - Uses Google Gemini API to calculate dynamic wait times
- **Email Notifications** - Automated SMTP email notifications when customer's turn approaches
- **Real-time Updates** - Live queue status updates using Firebase Realtime Database
- **Multi-Place Management** - Manage multiple locations from one dashboard

### 📊 Analytics & Insights
- Real-time queue statistics
- Historical data tracking
- Peak hours analysis
- Category-wise breakdown
- Average service time calculation
- Performance metrics

### 🎨 Modern UI/UX
- Beautiful gradient designs
- Smooth animations
- Fully responsive (mobile, tablet, desktop)
- Dark mode sidebar
- Professional color schemes
- Intuitive navigation

## 🏗️ Architecture

### Frontend
- **HTML5/CSS3/JavaScript** - Modern, vanilla implementation
- **Firebase SDK** - Real-time database and authentication
- **QRCode.js** - QR code generation
- **Responsive Design** - Works on all devices

### Backend
- **Node.js/Express** - REST API server
- **Nodemailer** - Email notification service
- **Firebase Admin SDK** - Server-side database operations
- **Google Gemini AI** - Intelligent wait time calculation

### Database
- **Firebase Realtime Database** - NoSQL, real-time synchronization
- **Proper Security Rules** - Role-based access control

## 📁 Project Structure

```
Next turn/
├── index.html              # Landing page
├── login.html             # User login
├── signup.html            # User registration
├── dashboard.html         # Client dashboard
├── admin.html             # Admin queue management
├── register-place.html    # Register new location
├── join.html             # Join queue (scanned via QR)
├── track.html            # Track queue status
├── style.css             # Global styles
├── dashboard.css         # Dashboard styles
├── admin.css             # Admin panel styles
├── firebase-config.js    # Firebase configuration
├── database.rules.json   # Firebase security rules
├── server/               # Backend server
│   ├── server.js         # Main server file
│   ├── package.json      # Dependencies
│   ├── .env.example      # Environment variables template
│   └── README.md         # Server setup guide
└── Images/               # Assets and images
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Firebase account
- Gmail account (for SMTP)
- Google Gemini API key

### 1. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Realtime Database**
3. Enable **Email/Password Authentication**
4. Copy your Firebase config to `firebase-config.js`
5. Deploy database rules from `database.rules.json`

### 2. Backend Server Setup

```bash
cd server
npm install
```

Create `.env` file:
```env
# Gmail SMTP Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_APP_PASSWORD=your-16-digit-app-password

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# Google Gemini AI API
GEMINI_API_KEY=your-gemini-api-key

# Server Configuration
PORT=3000
NODE_ENV=development
```

#### Get Gmail App Password:
1. Enable 2-Step Verification on your Google Account
2. Go to Security → App passwords
3. Generate password for "Mail"
4. Copy the 16-digit password

#### Get Gemini API Key:
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Copy to `.env`

### 3. Start the Backend Server

```bash
npm start
# or for development
npm run dev
```

Server will run on `http://localhost:3000`

### 4. Start the Frontend

Use any local server:

**Option 1: Python**
```bash
python -m http.server 5500
```

**Option 2: VS Code Live Server**
- Install Live Server extension
- Right-click `index.html` → Open with Live Server

**Option 3: Node.js http-server**
```bash
npx http-server -p 5500
```

Open `http://localhost:5500` in your browser

## 📖 User Guide

### For Business Owners

#### Step 1: Register
1. Sign up at `/signup.html`
2. Login with your credentials

#### Step 2: Register Your Place
1. Click "Register New Place"
2. Fill in details:
   - Place name (e.g., "City Hospital")
   - Category (Hospital, Bank, Restaurant, etc.)
   - Address
   - Average service time
3. Generate unique QR code

#### Step 3: Display QR Code
1. Download the QR code
2. Print and display at your location
3. Customers scan to join queue

#### Step 4: Manage Queue
1. Open Admin Panel
2. See real-time queue status
3. Call next person
4. Mark as completed
5. View analytics

### For Customers

#### Step 1: Scan QR Code
- Scan the QR code displayed at the location

#### Step 2: Fill Details
- Enter name, email, phone
- Select priority category
- Join queue

#### Step 3: Track Status
- Receive email confirmation
- Track position in real-time
- Get notified when turn is near

## 🎛️ Admin Panel Features

### Overview Dashboard
- Total waiting customers
- Served today/total
- Average wait time
- Real-time metrics

### Queue Management
- Call next person
- View queue table
- Priority sorting
- Remove/edit entries
- Mark completed

### Analytics
- Daily statistics
- Category breakdown
- Time analysis
- Peak hours
- Performance trends

### Settings
- Configure service time
- Enable/disable priority queue
- Toggle notifications
- Activate/deactivate queue

## 🔔 Email Notifications

Customers receive emails for:

1. **Queue Joined** - Confirmation with token number and estimated wait time
2. **Turn Approaching** - When 2-3 people ahead
3. **Your Turn Now** - When it's their turn to proceed

All emails feature:
- Beautiful HTML templates
- Professional design
- Clear information
- Branded content

## 🤖 AI Features

### Gemini-Powered Wait Time Calculation

The system uses Google Gemini AI to calculate intelligent wait times based on:

- Current queue position
- Priority type
- Historical average service time
- Total people served today
- Peak hours data
- Time of day patterns

Fallback calculation available if AI is unavailable.

## 🔒 Security

### Firebase Security Rules
- **Places**: Read public, write only by owners
- **Queues**: Read public, write public (for joining)
- **Users**: Read/write only own data
- **Analytics**: Authenticated access only

### Authentication
- Email/password authentication
- Session management
- Protected routes
- Role-based access

## 📱 API Endpoints

### POST `/api/queue/join`
Join a queue
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
Calculate estimated wait time
```json
{
  "placeId": "place-id",
  "position": 5,
  "priorityType": "normal"
}
```

### POST `/api/queue/check-notifications`
Send notifications to users
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

## 🎨 Customization

### Colors
Edit CSS variables in `style.css`:
```css
:root {
  --blue-soft: #93c5fd;
  --blue-main: #3b82f6;
  --green-soft: #a7f3d0;
  --green-main: #34d399;
  /* ... */
}
```

### Email Templates
Edit in `server/server.js` → `generateEmailHTML()` function

### Categories
Add/edit in `register-place.html` → category dropdown

## 🐛 Troubleshooting

### Email not sending
- Check Gmail app password
- Verify 2FA is enabled
- Check spam folder

### Firebase connection issues
- Verify database URL
- Check security rules
- Ensure authentication is enabled

### QR codes not generating
- Check QRCode.js library load
- Verify internet connection
- Check console for errors

### Gemini API errors
- Verify API key
- Check quota limits
- System uses fallback calculation

## 🔄 Updates & Maintenance

### Database Backup
- Export from Firebase Console
- Regular automated backups recommended

### Clear Old Queue Data
```javascript
// Admin can clear completed queues periodically
db.ref(`queues/${placeId}`).once('value', snapshot => {
  const queue = snapshot.val();
  Object.keys(queue).forEach(key => {
    if (queue[key].status === 'completed' && 
        Date.now() - queue[key].completedAt > 86400000) { // 24 hours
      db.ref(`queues/${placeId}/${key}`).remove();
    }
  });
});
```

## 📊 Performance Optimization

- Real-time listeners only on active pages
- Cleanup listeners on page unload
- Indexed database queries
- Lazy loading for images
- Minified CSS/JS for production

## 🌟 Future Enhancements

- [ ] SMS notifications via Twilio
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Voice announcements
- [ ] Payment integration
- [ ] Appointment booking
- [ ] Feedback system
- [ ] Advanced analytics dashboard
- [ ] Export reports (PDF/Excel)
- [ ] Integration with ticketing systems

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@nextturn.com or create an issue on GitHub.

## 🙏 Acknowledgments

- Firebase for real-time database
- Google Gemini AI for intelligent calculations
- QRCode.js for QR generation
- Nodemailer for email service

---

**Made with ❤️ for better queue management**

*Last Updated: January 2026*
