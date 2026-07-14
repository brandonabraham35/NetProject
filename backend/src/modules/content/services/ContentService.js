const providerManager = require('../providers/ProviderManager');
const contentCache = require('../cache/ContentCache');
const logger = require('../../../config/logger');
const Normalizer = require('../utils/Normalizer');

class ContentService {

  _adaptResponseToUI(data) {
    // If it's a paginated list
    if (data && data.results) {
      return {
        ...data,
        results: Normalizer.adaptListToUI(data.results)
      };
    }
    // If it's a single item (has id but no results)
    if (data && data.id && !data.results) {
      return Normalizer.adaptToUI(data);
    }
    return data;
  }

  async _fetchWithCache(cacheKey, fetchFunction) {
    const cached = await contentCache.get(cacheKey);

    // If we have a valid cache, return it immediately
    if (cached && !cached.isExpired) {
      return cached.value;
    }

    try {
      let data = await fetchFunction();
      // Apply UI adapter here to ensure the frontend never breaks
      data = this._adaptResponseToUI(data);

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

  async getTrending(page = 1) {
    return this._fetchWithCache(`trending:all:${page}`, () => providerManager.executeWithFallback('getTrending', [page]));
  }

  async getTrendingMovies(page = 1) {
    return this._fetchWithCache(`trending:movies:${page}`, () => providerManager.executeWithFallback('getTrendingMovies', [page]));
  }

  async getTrendingSeries(page = 1) {
    return this._fetchWithCache(`trending:series:${page}`, () => providerManager.executeWithFallback('getTrendingSeries', [page]));
  }

  async getPopularMovies(page = 1) {
    return this._fetchWithCache(`popular:movies:${page}`, () => providerManager.executeWithFallback('getPopularMovies', [page]));
  }

  async getPopularSeries(page = 1) {
    return this._fetchWithCache(`popular:series:${page}`, () => providerManager.executeWithFallback('getPopularSeries', [page]));
  }

  async getMovie(id) {
    return this._fetchWithCache(`movie:${id}`, () => providerManager.executeWithFallback('getMovie', [id]));
  }

  async getSeries(id) {
    return this._fetchWithCache(`series:${id}`, () => providerManager.executeWithFallback('getSeries', [id]));
  }

  async getSeason(id, season) {
    return this._fetchWithCache(`series:${id}:season:${season}`, () => providerManager.executeWithFallback('getSeason', [id, season]));
  }

  async getEpisode(id, season, episode) {
    return this._fetchWithCache(`series:${id}:season:${season}:ep:${episode}`, () => providerManager.executeWithFallback('getEpisode', [id, season, episode]));
  }

  async search(query, page = 1) {
    return this._fetchWithCache(`search:${query}:${page}`, () => providerManager.executeWithFallback('search', [query, page]));
  }

  async getGenres() {
    return this._fetchWithCache('genres', () => providerManager.executeWithFallback('getGenres', []));
  }

  async getRecommendations(id, page = 1) {
    return this._fetchWithCache(`recommendations:${id}:${page}`, () => providerManager.executeWithFallback('getRecommendations', [id, page]));
  }

  async getVideos(type, id) {
    return this._fetchWithCache(`videos:${type}:${id}`, () => providerManager.executeWithFallback('getVideos', [type, id]));
  }

  async getUpcoming(page = 1) {
    return this._fetchWithCache(`upcoming:${page}`, () => providerManager.executeWithFallback('getUpcoming', [page]));
  }

  async discover(type, queryParams) {
    const cacheKey = `discover:${type}:${JSON.stringify(queryParams)}`;
    return this._fetchWithCache(cacheKey, () => providerManager.executeWithFallback('discover', [type, queryParams]));
  }

}

module.exports = new ContentService();
