const { StrategyWeights } = require('../../../models');
const logger = require('../../../config/logger');

class StrategyManager {
  constructor() {
    this.strategies = new Map();
    this.weights = new Map();
  }

  register(strategy) {
    this.strategies.set(strategy.name, strategy);
    // Default weight
    this.weights.set(strategy.name, 1.0);
  }

  async loadWeightsFromDB() {
    try {
      const dbWeights = await StrategyWeights.findAll();
      for (const w of dbWeights) {
        if (this.strategies.has(w.strategyName)) {
          this.weights.set(w.strategyName, w.weight);
        }
      }
    } catch (err) {
      logger.error(`Error loading strategy weights: ${err.message}`);
    }
  }

  getWeight(strategyName) {
    return this.weights.get(strategyName) || 1.0;
  }

  async executeAll(userId, context = {}) {
    await this.loadWeightsFromDB();
    const promises = [];

    for (const [name, strategy] of this.strategies.entries()) {
      const weight = this.getWeight(name);
      if (weight <= 0) continue; // Skip disabled strategies

      promises.push(
        strategy.execute(userId, context)
          .then(results => {
            // Apply configured weight
            return results.map(r => ({
              ...r,
              weightedScore: r.score * weight
            }));
          })
          .catch(err => {
            logger.error(`Strategy ${name} failed: ${err.message}`);
            return [];
          })
      );
    }

    const nestedResults = await Promise.all(promises);
    return nestedResults.flat();
  }
}

module.exports = new StrategyManager();
