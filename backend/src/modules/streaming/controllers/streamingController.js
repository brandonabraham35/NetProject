const streamingService = require('../services/StreamingService');
const mediaManager = require('../services/MediaManager');
const playbackManager = require('../services/PlaybackManager');
const logger = require('../../../config/logger');

exports.stream = async (req, res) => {
  // Handles HTTP range requests for progressive streaming
  await streamingService.streamMedia(req, res, req.params.id);
};

exports.getPlaybackToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const contentId = req.params.id;

    // Check if we actually have media for this contentId
    const media = await mediaManager.getMediaDetails(contentId);
    if (!media) return res.status(404).json({ error: 'Internal media not available for this content' });

    const token = await playbackManager.authorizeSession(userId, contentId);
    res.status(200).json({ token, streamUrl: `/api/v1/stream/${contentId}?token=${token}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to authorize playback' });
  }
};

exports.uploadMedia = async (req, res) => {
  try {
    // Requires admin privileges in a real app, assuming auth middleware handles it
    const { contentId, title } = req.body;

    if (!req.file) return res.status(400).json({ error: 'No video file provided' });
    if (!contentId || !title) return res.status(400).json({ error: 'contentId and title are required' });

    const media = await mediaManager.registerNewUpload(contentId, title, req.file);
    res.status(201).json({ message: 'Media uploaded successfully', mediaId: media.id });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
};
