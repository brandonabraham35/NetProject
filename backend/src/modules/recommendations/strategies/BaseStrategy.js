class BaseStrategy {
  constructor(name) {
    this.name = name;
  }

  /**
   * Execute the strategy.
   * @param {string} userId
   * @param {object} context - additional contextual data (e.g., current trending items to score)
   * @returns {Promise<Array>} Array of recommendation objects
   */
  async execute(userId, context) {
    throw new Error('Strategy must implement execute()');
  }

  /**
   * Build a standard recommendation object.
   */
  buildRecommendation(item, score, confidence, explanation, metadata = {}) {
    return {
      content: item,
      strategy: this.name,
      score,
      confidence,
      explanation,
      metadata
    };
  }
}

module.exports = BaseStrategy;
