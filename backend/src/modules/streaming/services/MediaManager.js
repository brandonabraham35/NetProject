const { MediaFiles, MediaProcessingJobs } = require('../../../models');
const storageProvider = require('../storage/LocalStorageProvider');
const logger = require('../../../config/logger');

class MediaManager {
  async registerNewUpload(contentId, title, file) {
    try {
      const destinationPath = `media/${contentId}/${file.filename}`;
      await storageProvider.save(file.path, destinationPath);

      const media = await MediaFiles.create({
        contentId: String(contentId),
        title,
        originalFilename: file.originalname,
        storagePath: destinationPath,
        sizeBytes: file.size,
        mimeType: file.mimetype
      });

      // Queue background jobs for transcoding and thumbnail generation
      await MediaProcessingJobs.bulkCreate([
        { mediaFileId: media.id, type: 'thumbnail_generation', status: 'pending' },
        { mediaFileId: media.id, type: 'transcode', status: 'pending' }
      ]);

      return media;
    } catch (err) {
      logger.error(`MediaManager Registration Error: ${err.message}`);
      throw err;
    }
  }

  async getMediaDetails(contentId) {
    return MediaFiles.findOne({ where: { contentId: String(contentId) } });
  }
}

module.exports = new MediaManager();
