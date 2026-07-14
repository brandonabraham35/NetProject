const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const stat = promisify(fs.stat);
const StorageProvider = require('./StorageProvider');

class LocalStorageProvider extends StorageProvider {
  constructor(baseDir = path.join(__dirname, '../../../../uploads')) {
    super();
    this.baseDir = baseDir;
    // Ensure base dir exists
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  _getFullPath(filePath) {
    // Basic sanitization against path traversal
    const safePath = path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, '');
    return path.join(this.baseDir, safePath);
  }

  async save(tempFilePath, destinationPath) {
    const fullPath = this._getFullPath(destinationPath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    await promisify(fs.copyFile)(tempFilePath, fullPath);
    // Optionally delete temp file after moving
    await promisify(fs.unlink)(tempFilePath).catch(() => {});
    return fullPath;
  }

  async getReadStream(filePath, options = {}) {
    const fullPath = this._getFullPath(filePath);
    return fs.createReadStream(fullPath, options);
  }

  async getMetadata(filePath) {
    const fullPath = this._getFullPath(filePath);
    const fileStat = await stat(fullPath);
    return {
      size: fileStat.size,
    };
  }

  async delete(filePath) {
    const fullPath = this._getFullPath(filePath);
    await promisify(fs.unlink)(fullPath);
  }
}

module.exports = new LocalStorageProvider();
