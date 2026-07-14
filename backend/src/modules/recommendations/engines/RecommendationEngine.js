const strategyManager = require('./StrategyManager');

class RecommendationEngine {
  /**
   * Generates highly personalized, deduplicated recommendations by aggregating outputs
   * from all registered strategies via the StrategyManager.
   */
  constructor() {
    const strategyManager = require('./StrategyManager');
    // Pre-register active strategies
    const TrendingStrategy = require('../strategies/TrendingStrategy');
    const FavoriteStrategy = require('../strategies/FavoriteStrategy');
    const SearchHistoryStrategy = require('../strategies/SearchHistoryStrategy');
    const ContinueWatchingStrategy = require('../strategies/ContinueWatchingStrategy');
    const GenreStrategy = require('../strategies/GenreStrategy');
    const RatingStrategy = require('../strategies/RatingStrategy');
    const PopularityStrategy = require('../strategies/PopularityStrategy');
    const SimilarityStrategy = require('../strategies/SimilarityStrategy');
    const RecentlyReleasedStrategy = require('../strategies/RecentlyReleasedStrategy');
    const CollaborativeFilteringStrategy = require('../strategies/CollaborativeFilteringStrategy');
    const ContentSimilarityStrategy = require('../strategies/ContentSimilarityStrategy');
    const ColdStartStrategy = require('../strategies/ColdStartStrategy');
    const SeasonalStrategy = require('../strategies/SeasonalStrategy');
    const TimeOfDayStrategy = require('../strategies/TimeOfDayStrategy');

    strategyManager.register(new TrendingStrategy());
    strategyManager.register(new FavoriteStrategy());
    strategyManager.register(new SearchHistoryStrategy());
    strategyManager.register(new ContinueWatchingStrategy());
    strategyManager.register(new GenreStrategy());
    strategyManager.register(new RatingStrategy());
    strategyManager.register(new PopularityStrategy());
    strategyManager.register(new SimilarityStrategy());
    strategyManager.register(new RecentlyReleasedStrategy());
    strategyManager.register(new CollaborativeFilteringStrategy());
    strategyManager.register(new ContentSimilarityStrategy());
    strategyManager.register(new ColdStartStrategy());
    strategyManager.register(new SeasonalStrategy());
    strategyManager.register(new TimeOfDayStrategy());
  }

  async generatePersonalizedRecommendations(userId, context = {}) {
    const strategyManager = require('./StrategyManager');
    // 1. Gather all strategy outputs
    const rawRecommendations = await strategyManager.executeAll(userId, context);

    // 2. Merge duplicates and aggregate scores
    const mergedMap = new Map();

    for (const rec of rawRecommendations) {
      if (!rec || !rec.content || !rec.content.id) continue;

      const id = rec.content.id;
      if (mergedMap.has(id)) {
        const existing = mergedMap.get(id);
        existing.finalScore += rec.weightedScore;
        existing.strategies.push(rec.strategy);
        // Keep highest confidence explanation or aggregate them
        if (rec.confidence > existing.maxConfidence) {
          existing.explanation = rec.explanation;
          existing.maxConfidence = rec.confidence;
        }
      } else {
        mergedMap.set(id, {
          content: rec.content,
          finalScore: rec.weightedScore,
          strategies: [rec.strategy],
          explanation: rec.explanation,
          maxConfidence: rec.confidence,
          metadata: rec.metadata
        });
      }
    }

    // 3. Convert map to array and sort by finalScore descending
    const finalRecommendations = Array.from(mergedMap.values())
      .sort((a, b) => b.finalScore - a.finalScore);

    return finalRecommendations;
  }
}

module.exports = new RecommendationEngine();
