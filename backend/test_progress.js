const { updateProgress } = require('./src/controllers/userController');

// Mock req and res objects
const req = {
  user: { firebaseUid: 'test_uid' },
  body: { movieId: '123', progress: 50.5 }
};

const res = {
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    console.log('Status:', this.statusCode, 'Data:', data);
  }
};

const { sequelize, User } = require('./src/models');

async function test() {
  await sequelize.sync();
  // Create a mock user
  await User.findOrCreate({ where: { firebaseUid: 'test_uid', email: 'test@example.com' } });

  console.log('Testing updateProgress...');
  await updateProgress(req, res);

  console.log('Done.');
}
test();
