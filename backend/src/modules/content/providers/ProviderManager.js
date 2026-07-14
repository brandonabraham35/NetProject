const TMDBProvider = require('./TMDBProvider');
const logger = require('../../../config/logger');

class ProviderManager {
  constructor() {
    this.providers = new Map();
    this.activeProvider = null;

    // Health tracking
    this.stats = new Map();

    this.register('tmdb', new TMDBProvider());
    this.setActive('tmdb');
  }

  register(name, provider) {
    this.providers.set(name, provider);
    this.stats.set(name, {
      status: 'Healthy',
      latency: 0,
      failures: 0,
      successes: 0,
      lastSync: null
    });
  }

  setActive(name) {
    if (!this.providers.has(name)) {
      throw new Error(`Provider ${name} not found`);
    }
    this.activeProvider = this.providers.get(name);
    this.activeProviderName = name;
  }

  getActive() {
    return this.activeProvider;
  }

  getHealthStats() {
    const output = {};
    for (const [key, value] of this.stats.entries()) {
      output[key] = value;
    }
    return output;
  }

  async executeWithFallback(operationName, args) {
    const providerNames = Array.from(this.providers.keys());
    // Start with active provider, then fallback to others if needed
    const primaryIndex = providerNames.indexOf(this.activeProviderName);
    if (primaryIndex > -1) {
      providerNames.splice(primaryIndex, 1);
      providerNames.unshift(this.activeProviderName);
    }

    let lastError = null;

    for (const name of providerNames) {
      const provider = this.providers.get(name);
      const stat = this.stats.get(name);
      const start = Date.now();

      try {
        const result = await provider[operationName](...args);

        // Update stats on success
        stat.successes++;
        stat.latency = (Date.now() - start);
        stat.status = 'Healthy';
        stat.lastSync = new Date();
        this.stats.set(name, stat);

        return result;
      } catch (err) {
        // Update stats on failure
        stat.failures++;
        stat.status = 'Failing';
        this.stats.set(name, stat);
        logger.warn(`Provider ${name} failed operation ${operationName}: ${err.message}`);
        lastError = err;
      }
    }

    throw new Error(`All providers failed for ${operationName}. Last error: ${lastError.message}`);
  }
}

// Export a singleton instance
module.exports = new ProviderManager();
