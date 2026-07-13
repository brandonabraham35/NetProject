const auth = require('../config/firebase');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No Firebase ID token provided' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
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
