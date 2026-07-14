const axios = require('axios');
const ContentProvider = require('./ContentProvider');
const Normalizer = require('../utils/Normalizer');

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

  _wrapList(data) {
    if (!data) return data;
    return {
      ...data,
      results: Normalizer.normalizeList(data.results, 'tmdb')
    };
  }

  _wrapItem(data) {
    return Normalizer.normalizeItem(data, 'tmdb');
  }

  async getTrending(page = 1) {
    const res = await this.client.get('/trending/all/week', { params: { page } });
    return this._wrapList(res.data);
  }

  async getTrendingMovies(page = 1) {
    const res = await this.client.get('/trending/movie/week', { params: { page } });
    return this._wrapList(res.data);
  }

  async getTrendingSeries(page = 1) {
    const res = await this.client.get('/trending/tv/week', { params: { page } });
    return this._wrapList(res.data);
  }

  async getPopularMovies(page = 1) {
    const res = await this.client.get('/movie/popular', { params: { page } });
    return this._wrapList(res.data);
  }

  async getPopularSeries(page = 1) {
    const res = await this.client.get('/tv/popular', { params: { page } });
    return this._wrapList(res.data);
  }

  async getMovie(id) {
    const res = await this.client.get(`/movie/${id}`);
    return this._wrapItem(res.data);
  }

  async getSeries(id) {
    const res = await this.client.get(`/tv/${id}`);
    return this._wrapItem(res.data);
  }

  async getSeason(id, season) {
    const res = await this.client.get(`/tv/${id}/season/${season}`);
    return res.data; // Season payload differs significantly, leaving raw for now
  }

  async getEpisode(id, season, episode) {
    const res = await this.client.get(`/tv/${id}/season/${season}/episode/${episode}`);
    return res.data;
  }

  async search(query, page = 1, filters = {}) {
    // Basic fuzzy/typo tolerance can be handled by TMDB implicitly on standard searches.
    // If strict filters are passed (year, genres), we should use /discover instead of /search/multi.
    if (filters.year || filters.genres || filters.rating) {
      const params = {
        with_genres: filters.genres,
        primary_release_year: filters.year,
        'vote_average.gte': filters.rating,
        page
      };
      if (query) params.with_keywords = query; // A loose mapping, search is better for exact queries
      const res = await this.client.get('/discover/movie', { params });
      return this._wrapList(res.data);
    }

    const res = await this.client.get('/search/multi', { params: { query, page } });
    return this._wrapList(res.data);
  }

  async getGenres() {
    const res = await this.client.get('/genre/movie/list');
    return res.data; // Usually just { genres: [{ id, name }] }
  }

  async getRecommendations(id, page = 1) {
    const res = await this.client.get(`/movie/${id}/recommendations`, { params: { page } });
    return this._wrapList(res.data);
  }

  async getVideos(type, id) {
    const res = await this.client.get(`/${type}/${id}/videos`);
    return res.data; // Videos response usually has standard format { results: [] }
  }

  async getUpcoming(page = 1) {
    const res = await this.client.get(`/movie/upcoming`, { params: { page } });
    return this._wrapList(res.data);
  }

  async discover(type, queryParams) {
    const res = await this.client.get(`/discover/${type}`, { params: queryParams });
    return this._wrapList(res.data);
  }

}

module.exports = TMDBProvider;
