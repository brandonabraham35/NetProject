const BaseStrategy = require('./BaseStrategy');

class ContentSimilarityStrategy extends BaseStrategy {
  constructor() {
    super('ContentSimilarityStrategy');
  }

  async execute(userId, context) {
    // Requires metadata NLP extraction
    return [];
  }
}
module.exports = ContentSimilarityStrategy;
