const StorageProvider = require('../src/modules/streaming/storage/StorageProvider');

describe('StorageProvider Interface', () => {
  it('should throw "Not implemented" for interface methods', async () => {
    const provider = new StorageProvider();
    await expect(provider.save(null, 'test')).rejects.toThrow('Not implemented');
  });
});
