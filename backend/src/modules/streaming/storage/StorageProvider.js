/**
 * Interface for Storage Providers
 */
class StorageProvider {
  /**
   * Save a stream or buffer to storage
   */
  async save(stream, destinationPath) { throw new Error('Not implemented'); }

  /**
   * Retrieve a read stream for a file
   */
  async getReadStream(filePath, options = {}) { throw new Error('Not implemented'); }

  /**
   * Get file metadata (size, mime, etc.)
   */
  async getMetadata(filePath) { throw new Error('Not implemented'); }

  /**
   * Delete a file
   */
  async delete(filePath) { throw new Error('Not implemented'); }
}

module.exports = StorageProvider;
