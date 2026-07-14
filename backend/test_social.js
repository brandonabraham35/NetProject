const { sequelize } = require('./src/models');

async function test() {
  try {
    await sequelize.sync();
    console.log('Social and Notification models synced successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Model sync failed:', error);
    process.exit(1);
  }
}
test();
