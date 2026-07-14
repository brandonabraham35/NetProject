const contentService = require('../services/ContentService');
const recommendationService = require('../services/RecommendationService');
const logger = require('../../../config/logger');
const { ContentAnalytics, SearchHistory } = require('../../../models');
const { Op } = require('sequelize');

// Utility to fire and forget analytics
const logAnalytics = (userId, contentId, eventType) => {
  ContentAnalytics.create({
    userId: userId || null,
    contentId: contentId ? String(contentId) : null,
    provider: 'tmdb',
    eventType
  }).catch(e => logger.error(`Failed to log analytics: ${e.message}`));
};

exports.getTrending = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const data = await contentService.getTrending(page);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`Content Error: ${error.message}`);
    res.status(502).json({ error: 'Failed to fetch trending content from provider' }); // 502 Bad Gateway is better for upstream provider errors
  }
};

exports.getTrendingMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const data = await contentService.getTrendingMovies(page);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`Content Error: ${error.message}`);
    res.status(502).json({ error: 'Failed to fetch trending movies' });
  }
};

exports.getTrendingSeries = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const data = await contentService.getTrendingSeries(page);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`Content Error: ${error.message}`);
    res.status(502).json({ error: 'Failed to fetch trending series' });
  }
};

exports.getPopular = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const data = await contentService.getPopularMovies(page);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`Content Error: ${error.message}`);
    res.status(502).json({ error: 'Failed to fetch popular content' });
  }
};

exports.getPopularMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const data = await contentService.getPopularMovies(page);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`Content Error: ${error.message}`);
    res.status(502).json({ error: 'Failed to fetch popular movies' });
  }
};

exports.getPopularSeries = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const data = await contentService.getPopularSeries(page);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`Content Error: ${error.message}`);
    res.status(502).json({ error: 'Failed to fetch popular series' });
  }
};

exports.getMovie = async (req, res) => {
  try {
    const data = await contentService.getMovie(req.params.id);
    logAnalytics(req.user?.id, req.params.id, 'movie_opened');
    res.status(200).json(data);
  } catch (error) {
    logger.error(`Content Error: ${error.message}`);
    res.status(502).json({ error: 'Failed to fetch movie' });
  }
};

exports.getSeries = async (req, res) => {
  try {
    const data = await contentService.getSeries(req.params.id);
    logAnalytics(req.user?.id, req.params.id, 'series_opened');
    res.status(200).json(data);
  } catch (error) {
    logger.error(`Content Error: ${error.message}`);
    res.status(502).json({ error: 'Failed to fetch series' });
  }
};

exports.getSeason = async (req, res) => {
  try {
    const data = await contentService.getSeason(req.params.id, req.params.seasonId);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`Content Error: ${error.message}`);
    res.status(502).json({ error: 'Failed to fetch season' });
  }
};

exports.getEpisode = async (req, res) => {
  try {
    const data = await contentService.getEpisode(req.params.id, req.params.seasonId, req.params.episodeId);
    logAnalytics(req.user?.id, req.params.id, 'episode_opened');
    res.status(200).json(data);
  } catch (error) {
    logger.error(`Content Error: ${error.message}`);
    res.status(502).json({ error: 'Failed to fetch episode' });
  }
};

exports.search = async (req, res) => {
  try {
    const query = req.query.query || '';
    const page = parseInt(req.query.page, 10) || 1;
    const filters = {
      year: req.query.year,
      genres: req.query.genres,
      rating: req.query.rating
    };

    const data = await contentService.search(query, page, filters);
    logAnalytics(req.user?.id, null, 'search_clicks');

    if (query && req.user?.id) {
      // Async log to SearchHistory to avoid blocking response
      (async () => {
        try {
          const userId = req.user.id;
          const lastSearch = await SearchHistory.findOne({
            where: { userId },
            order: [['createdAt', 'DESC']]
          });

          if (!lastSearch || lastSearch.query !== query) {
            await SearchHistory.create({ userId, query });

            // Limit to max 50 searches per user
            const count = await SearchHistory.count({ where: { userId } });
            if (count > 50) {
              const oldest = await SearchHistory.findOne({ where: { userId }, order: [['createdAt', 'ASC']] });
              if (oldest) await oldest.destroy();
            }
          }
        } catch(e) {
          logger.error(`Search History Error: ${e.message}`);
        }
      })();
    }

    res.status(200).json(data);
  } catch (error) {
    logger.error(`Content Error: ${error.message}`);
    res.status(502).json({ error: 'Failed to search' });
  }
};

exports.getSearchSuggestions = async (req, res) => {
  try {
    const query = req.query.query || '';
    if (!query) return res.status(200).json({ results: [] });

    // For suggestions, just do a fast search and return top 5 titles
    const data = await contentService.search(query, 1);
    const suggestions = data.results?.slice(0, 5).map(i => i.title || i.name) || [];

    res.status(200).json({ suggestions });
  } catch (error) {
    logger.error(`Content Error: ${error.message}`);
    res.status(502).json({ error: 'Failed to fetch suggestions' });
  }
};

exports.getGenres = async (req, res) => {
  try {
    const data = await contentService.getGenres();
    res.status(200).json(data);
  } catch (error) {
    logger.error(`Content Error: ${error.message}`);
    res.status(502).json({ error: 'Failed to fetch genres' });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user?.id; // requires authMiddleware if protecting this route
    const data = await recommendationService.getPersonalizedRecommendations(userId);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`Content Error: ${error.message}`);
    res.status(502).json({ error: 'Failed to fetch recommendations' });
  }
};

exports.getMovieRecommendations = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const data = await contentService.getRecommendations(req.params.id, page);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`Content Error: ${error.message}`);
    res.status(502).json({ error: 'Failed to fetch movie recommendations' });
  }
};

exports.getVideos = async (req, res) => {
  try {
    const type = req.params.type; // 'movie' or 'series'
    const externalType = type === 'series' ? 'tv' : type;
    const data = await contentService.getVideos(externalType, req.params.id);
    logAnalytics(req.user?.id, req.params.id, 'trailer_plays');
    res.status(200).json(data);
  } catch (error) {
    logger.error(`Content Error: ${error.message}`);
    res.status(502).json({ error: 'Failed to fetch videos' });
  }
};

exports.getUpcoming = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const data = await contentService.getUpcoming(page);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`Content Error: ${error.message}`);
    res.status(502).json({ error: 'Failed to fetch upcoming' });
  }
};

exports.discover = async (req, res) => {
  try {
    const type = req.params.type; // 'movie' or 'tv'
    const data = await contentService.discover(type, req.query);
    logAnalytics(req.user?.id, null, 'category_browsing');
    res.status(200).json(data);
  } catch (error) {
    logger.error(`Content Error: ${error.message}`);
    res.status(502).json({ error: 'Failed to discover content' });
  }
};
