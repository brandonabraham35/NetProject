module.exports = {
  apps: [
    {
      name: 'netflix-backend',
      script: './backend/index.js',
      instances: 'max', // Leverage all CPUs for high availability
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
