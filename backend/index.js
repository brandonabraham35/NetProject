const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

const { sequelize } = require('./src/models');
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/user');
const adminRoutes = require('./src/routes/admin');
const contentRoutes = require('./src/modules/content/routes/contentRoutes');
const socialRoutes = require('./src/routes/social');
const errorHandler = require('./src/middleware/errorHandler');
const syncManager = require('./src/modules/sync/SyncManager');
const { swaggerUi, swaggerDocs } = require('./src/docs/swagger');

// Environment Validation
if (!process.env.PORT && process.env.NODE_ENV !== 'test') {
  console.warn('PORT environment variable not set, defaulting to 5000');
}
// Checking a mock requirement for db credentials if applicable, though using default in database.js

const app = express();
const PORT = process.env.PORT || 5000;

// Request ID generation
app.use((req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Security and performance middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));

const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json());

const logger = require('./src/config/logger');
// Audit logging format injecting Request ID
morgan.token('id', (req) => req.id);
app.use(morgan(':id :remote-addr :method :url HTTP/:http-version :status :res[content-length] - :response-time ms', { stream: logger.stream }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});
app.use(limiter);

// Routes restructuring to match requested REST principles
// Health endpoint
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Liveness and Readiness checks
app.get('/health/live', (req, res) => res.status(200).json({ status: 'live' }));
app.get('/health/ready', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({ status: 'ready', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'not ready', database: 'disconnected' });
  }
});

// API Versioning
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes); // (Handles /api/v1/user/list/:type)
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/social', socialRoutes);

// OpenAPI Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Centralized error handling
app.use(errorHandler);

// Sync Database and start server
sequelize.sync().then(() => {
  syncManager.init(); // Initialize Background Synchronization
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
