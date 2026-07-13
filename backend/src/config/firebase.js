const admin = require('firebase-admin');

admin.initializeApp({
  projectId: 'react-netflix-eb4f0',
});

module.exports = admin;
