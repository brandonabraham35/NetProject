const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Create a stream object for Morgan integration
logger.stream = {
  write: function(message) {
    logger.info(message.trim());
  },
};

module.exports = logger;
