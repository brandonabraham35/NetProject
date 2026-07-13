/**
 * ContentProvider Interface
 * All providers should implement these methods.
 */
class ContentProvider {
  async getTrending() { throw new Error('Not implemented'); }
  async getTrendingMovies() { throw new Error('Not implemented'); }
  async getTrendingSeries() { throw new Error('Not implemented'); }
  async getPopularMovies() { throw new Error('Not implemented'); }
  async getPopularSeries() { throw new Error('Not implemented'); }
  async getMovie(id) { throw new Error('Not implemented'); }
  async getSeries(id) { throw new Error('Not implemented'); }
  async getSeason(id, season) { throw new Error('Not implemented'); }
  async getEpisode(id, season, episode) { throw new Error('Not implemented'); }
  async search(query) { throw new Error('Not implemented'); }
  async getGenres() { throw new Error('Not implemented'); }
  async getRecommendations(id) { throw new Error('Not implemented'); }
  async getVideos(type, id) { throw new Error('Not implemented'); }
  async getUpcoming() { throw new Error('Not implemented'); }
  async discover(type, queryParams) { throw new Error('Not implemented'); }
}

module.exports = ContentProvider;
