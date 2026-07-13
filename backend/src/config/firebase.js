const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

// Initialize Firebase Admin exactly once
const app = initializeApp({
  projectId: 'react-netflix-eb4f0',
});

// Export the shared Auth instance
const auth = getAuth(app);

module.exports = auth;
