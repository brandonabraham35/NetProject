const mediaManager = require('./MediaManager');
const playbackManager = require('./PlaybackManager');
const storageProvider = require('../storage/LocalStorageProvider');
const logger = require('../../../config/logger');

class StreamingService {
  async streamMedia(req, res, contentId) {
    try {
      const token = req.query.token;
      if (!token) return res.status(401).send('Unauthorized stream access');

      const userId = await playbackManager.validateToken(token, contentId);
      if (!userId) return res.status(403).send('Invalid or expired playback token');

      const media = await mediaManager.getMediaDetails(contentId);
      if (!media) return res.status(404).send('Media not found');

      const stat = await storageProvider.getMetadata(media.storagePath);
      const fileSize = stat.size;
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;

        const readStream = await storageProvider.getReadStream(media.storagePath, { start, end });

        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': media.mimeType || 'video/mp4',
        };

        res.writeHead(206, head);
        readStream.pipe(res);

        // Async log access bytes
        readStream.on('end', () => playbackManager.logAccess(userId, contentId, chunksize));
      } else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': media.mimeType || 'video/mp4',
        };

        res.writeHead(200, head);
        const readStream = await storageProvider.getReadStream(media.storagePath);
        readStream.pipe(res);

        readStream.on('end', () => playbackManager.logAccess(userId, contentId, fileSize));
      }
    } catch (error) {
      logger.error(`Streaming Service Error: ${error.message}`);
      if (!res.headersSent) res.status(500).send('Streaming error');
    }
  }
}

module.exports = new StreamingService();
