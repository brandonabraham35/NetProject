const axios = require('axios');
const ContentProvider = require('./ContentProvider');

class TMDBProvider extends ContentProvider {
  constructor() {
    super();
    this.apiKey = process.env.TMDB_API_KEY;
    if (!this.apiKey) {
      console.warn("WARNING: TMDB_API_KEY environment variable is not set.");
    }
    this.baseURL = 'https://api.themoviedb.org/3';

    this.client = axios.create({
      baseURL: this.baseURL,
      params: {
        api_key: this.apiKey,
        language: 'en-US'
      }
    });
  }

  async getTrending() {
    const res = await this.client.get('/trending/all/week');
    return res.data;
  }

  async getTrendingMovies() {
    const res = await this.client.get('/trending/movie/week');
    return res.data;
  }

  async getTrendingSeries() {
    const res = await this.client.get('/trending/tv/week');
    return res.data;
  }

  async getPopularMovies() {
    const res = await this.client.get('/movie/popular');
    return res.data;
  }

  async getPopularSeries() {
    const res = await this.client.get('/tv/popular');
    return res.data;
  }

  async getMovie(id) {
    const res = await this.client.get(`/movie/${id}`);
    return res.data;
  }

  async getSeries(id) {
    const res = await this.client.get(`/tv/${id}`);
    return res.data;
  }

  async getSeason(id, season) {
    const res = await this.client.get(`/tv/${id}/season/${season}`);
    return res.data;
  }

  async getEpisode(id, season, episode) {
    const res = await this.client.get(`/tv/${id}/season/${season}/episode/${episode}`);
    return res.data;
  }

  async search(query) {
    const res = await this.client.get('/search/multi', { params: { query } });
    return res.data;
  }

  async getGenres() {
    const res = await this.client.get('/genre/movie/list');
    return res.data;
  }

  async getRecommendations(id) {
    const res = await this.client.get(`/movie/${id}/recommendations`);
    return res.data;
  }

  async getVideos(type, id) {
    // type is 'movie' or 'tv'
    const res = await this.client.get(`/${type}/${id}/videos`);
    return res.data;
  }

  async getUpcoming() {
    const res = await this.client.get(`/movie/upcoming`);
    return res.data;
  }

  async discover(type, queryParams) {
    const res = await this.client.get(`/discover/${type}`, { params: queryParams });
    return res.data;
  }

}

module.exports = TMDBProvider;
