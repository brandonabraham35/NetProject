const ProviderManager = require('../src/modules/content/providers/ProviderManager');
const ContentProvider = require('../src/modules/content/providers/ContentProvider');

class MockProvider extends ContentProvider {
  async getTrending() { return { results: ['mock'] }; }
  async getTrendingFail() { throw new Error('Mock fail'); }
}

describe('ProviderManager', () => {
  let manager;

  beforeEach(() => {
    // Reset instance logic conceptually or create a new clean manager if it wasn't a singleton,
    // but since it's a singleton we will just register and override.
    manager = require('../src/modules/content/providers/ProviderManager');
    manager.register('mock1', new MockProvider());
    manager.setActive('mock1');
  });

  it('should execute operation successfully', async () => {
    const res = await manager.executeWithFallback('getTrending', []);
    expect(res.results[0]).toBe('mock');
  });

  it('should fallback and eventually throw if all fail', async () => {
    manager.register('mock_fail1', new MockProvider());
    manager.setActive('mock_fail1');

    await expect(manager.executeWithFallback('getTrendingFail', [])).rejects.toThrow();
  });

  it('should report health stats', () => {
    const stats = manager.getHealthStats();
    expect(stats['mock1']).toBeDefined();
    expect(stats['mock1'].status).toBeDefined();
  });
});
