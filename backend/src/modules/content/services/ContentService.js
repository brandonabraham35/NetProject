const providerRegistry = require('../providers/ProviderRegistry');
const contentCache = require('../cache/ContentCache');
const logger = require('../../../config/logger');

class ContentService {
  async _fetchWithCache(cacheKey, fetchFunction) {
    const cached = await contentCache.get(cacheKey);

    // If we have a valid cache, return it immediately
    if (cached && !cached.isExpired) {
      return cached.value;
    }

    try {
      const data = await fetchFunction();
      await contentCache.set(cacheKey, data);
      return data;
    } catch (err) {
      // Graceful fallback to stale cache if provider fails
      if (cached && cached.isExpired) {
        logger.warn(`Provider failed for ${cacheKey}, falling back to stale cache`);
        return cached.value;
      }
      throw err; // Nothing to fallback to
    }
  }

  async getTrending() {
    return this._fetchWithCache('trending:all', () => providerRegistry.getActive().getTrending());
  }

  async getTrendingMovies() {
    return this._fetchWithCache('trending:movies', () => providerRegistry.getActive().getTrendingMovies());
  }

  async getTrendingSeries() {
    return this._fetchWithCache('trending:series', () => providerRegistry.getActive().getTrendingSeries());
  }

  async getPopularMovies() {
    return this._fetchWithCache('popular:movies', () => providerRegistry.getActive().getPopularMovies());
  }

  async getPopularSeries() {
    return this._fetchWithCache('popular:series', () => providerRegistry.getActive().getPopularSeries());
  }

  async getMovie(id) {
    return this._fetchWithCache(`movie:${id}`, () => providerRegistry.getActive().getMovie(id));
  }

  async getSeries(id) {
    return this._fetchWithCache(`series:${id}`, () => providerRegistry.getActive().getSeries(id));
  }

  async getSeason(id, season) {
    return this._fetchWithCache(`series:${id}:season:${season}`, () => providerRegistry.getActive().getSeason(id, season));
  }

  async getEpisode(id, season, episode) {
    return this._fetchWithCache(`series:${id}:season:${season}:ep:${episode}`, () => providerRegistry.getActive().getEpisode(id, season, episode));
  }

  async search(query) {
    return this._fetchWithCache(`search:${query}`, () => providerRegistry.getActive().search(query));
  }

  async getGenres() {
    return this._fetchWithCache('genres', () => providerRegistry.getActive().getGenres());
  }

  async getRecommendations(id) {
    return this._fetchWithCache(`recommendations:${id}`, () => providerRegistry.getActive().getRecommendations(id));
  }

  async getVideos(type, id) {
    return this._fetchWithCache(`videos:${type}:${id}`, () => providerRegistry.getActive().getVideos(type, id));
  }

  async getUpcoming() {
    return this._fetchWithCache(`upcoming`, () => providerRegistry.getActive().getUpcoming());
  }

  async discover(type, queryParams) {
    const cacheKey = `discover:${type}:${JSON.stringify(queryParams)}`;
    return this._fetchWithCache(cacheKey, () => providerRegistry.getActive().discover(type, queryParams));
  }

}

module.exports = new ContentService();
