const RecommendationEngine = require('../src/modules/recommendations/engines/RecommendationEngine');
const strategyManager = require('../src/modules/recommendations/engines/StrategyManager');

describe('RecommendationEngine', () => {
  beforeEach(() => {
    // Clear strategies if possible or mock the executeAll method
    jest.spyOn(strategyManager, 'executeAll').mockImplementation(async () => {
      return [
        {
          content: { id: '1', title: 'Movie A' },
          strategy: 'TrendingStrategy',
          weightedScore: 80,
          confidence: 0.9,
          explanation: 'Trending',
          metadata: {}
        },
        {
          content: { id: '1', title: 'Movie A' },
          strategy: 'GenreStrategy',
          weightedScore: 50, // Should sum up to 130
          confidence: 0.5,
          explanation: 'Matches genre',
          metadata: {}
        },
        {
          content: { id: '2', title: 'Movie B' },
          strategy: 'GenreStrategy',
          weightedScore: 90,
          confidence: 0.8,
          explanation: 'Matches genre',
          metadata: {}
        }
      ];
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should generate personalized recommendations, merge duplicates, and sort by descending score', async () => {
    const results = await RecommendationEngine.generatePersonalizedRecommendations('user_123');

    expect(results).toHaveLength(2);

    // Movie A should be first (80 + 50 = 130) vs Movie B (90)
    expect(results[0].content.id).toBe('1');
    expect(results[0].finalScore).toBe(130);
    expect(results[0].strategies).toContain('TrendingStrategy');
    expect(results[0].strategies).toContain('GenreStrategy');

    // Max confidence from the two strategies should be retained
    expect(results[0].maxConfidence).toBe(0.9);

    expect(results[1].content.id).toBe('2');
    expect(results[1].finalScore).toBe(90);
  });
});
