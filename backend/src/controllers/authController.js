const { User } = require('../models');

const syncUser = async (req, res) => {
  try {
    // The authMiddleware already verifies the token and populates req.user
    const { firebaseUid, email } = req.user;

    let user = await User.findOne({ where: { firebaseUid } });

    if (!user) {
      user = await User.create({ firebaseUid, email });
    } else {
      // Optional: update email if it changed in Firebase
      if (user.email !== email) {
        user.email = email;
        await user.save();
      }
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  syncUser,
};
