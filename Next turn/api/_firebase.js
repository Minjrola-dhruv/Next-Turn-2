/**
 * Firebase Admin SDK Initialization for Vercel Serverless
 * This module ensures Firebase Admin is initialized once and reused across function calls
 */

const admin = require('firebase-admin');

let firebaseApp;

function initializeFirebase() {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    // Initialize with environment variable containing service account JSON
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT || '{}'
    );

    if (!serviceAccount.project_id) {
      throw new Error('Invalid Firebase service account configuration');
    }

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });

    console.log('✅ Firebase Admin initialized successfully');
    return firebaseApp;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    throw error;
  }
}

function getDatabase() {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return admin.database();
}

function getAuth() {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return admin.auth();
}

module.exports = {
  initializeFirebase,
  getDatabase,
  getAuth,
  admin
};
