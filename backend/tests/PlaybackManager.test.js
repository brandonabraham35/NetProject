const PlaybackManager = require('../src/modules/streaming/services/PlaybackManager');
const { PlaybackSessions } = require('../src/models');

jest.mock('../src/models', () => ({
  PlaybackSessions: {
    create: jest.fn(),
    findOne: jest.fn()
  }
}));

describe('PlaybackManager', () => {
  it('should create a session token', async () => {
    PlaybackSessions.create.mockResolvedValue({ token: 'mocked_token' });
    const token = await PlaybackManager.authorizeSession('user_123', 'content_456');
    expect(PlaybackSessions.create).toHaveBeenCalled();
    expect(token).toBeDefined();
  });
});
