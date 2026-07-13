const TMDBProvider = require('./TMDBProvider');

class ProviderRegistry {
  constructor() {
    this.providers = new Map();
    this.activeProvider = null;
    this.register('tmdb', new TMDBProvider());
    this.setActive('tmdb');
  }

  register(name, provider) {
    this.providers.set(name, provider);
  }

  setActive(name) {
    if (!this.providers.has(name)) {
      throw new Error(`Provider ${name} not found`);
    }
    this.activeProvider = this.providers.get(name);
  }

  getActive() {
    return this.activeProvider;
  }
}

// Export a singleton instance
module.exports = new ProviderRegistry();
