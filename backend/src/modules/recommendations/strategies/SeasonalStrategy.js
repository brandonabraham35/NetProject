const BaseStrategy = require('./BaseStrategy');

class SeasonalStrategy extends BaseStrategy {
  constructor() {
    super('SeasonalStrategy');
  }

  async execute(userId, context) {
    return []; // Mocked
  }
}
module.exports = SeasonalStrategy;
