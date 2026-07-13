const admin = require('firebase-admin');

// Ensure we only initialize once
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'react-netflix-eb4f0',
  });
}

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No Firebase ID token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      firebaseUid: decodedToken.uid,
      email: decodedToken.email,
    };
    next();
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    res.status(401).json({ error: 'Invalid Firebase ID token' });
  }
};

module.exports = authMiddleware;
