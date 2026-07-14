const BaseStrategy = require('./BaseStrategy');

class TimeOfDayStrategy extends BaseStrategy {
  constructor() {
    super('TimeOfDayStrategy');
  }

  async execute(userId, context) {
    return []; // Mocked
  }
}
module.exports = TimeOfDayStrategy;
