const { sequelize } = require('./src/models');

async function test() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database or sync failed:', error);
    process.exit(1);
  }
}

test();
