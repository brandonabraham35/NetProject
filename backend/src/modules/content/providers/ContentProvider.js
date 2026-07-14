/**
 * ContentProvider Interface
 * All providers should implement these methods.
 */
class ContentProvider {
  async getTrending(page = 1) { throw new Error('Not implemented'); }
  async getTrendingMovies(page = 1) { throw new Error('Not implemented'); }
  async getTrendingSeries(page = 1) { throw new Error('Not implemented'); }
  async getPopularMovies(page = 1) { throw new Error('Not implemented'); }
  async getPopularSeries(page = 1) { throw new Error('Not implemented'); }
  async getMovie(id) { throw new Error('Not implemented'); }
  async getSeries(id) { throw new Error('Not implemented'); }
  async getSeason(id, season) { throw new Error('Not implemented'); }
  async getEpisode(id, season, episode) { throw new Error('Not implemented'); }
  async search(query, page = 1) { throw new Error('Not implemented'); }
  async getGenres() { throw new Error('Not implemented'); }
  async getRecommendations(id, page = 1) { throw new Error('Not implemented'); }
  async getVideos(type, id) { throw new Error('Not implemented'); }
  async getUpcoming(page = 1) { throw new Error('Not implemented'); }
  async discover(type, queryParams) { throw new Error('Not implemented'); }
}

module.exports = ContentProvider;
