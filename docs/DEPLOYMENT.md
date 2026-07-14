# Deployment Guide

## Docker Compose
The easiest way to run the application is via Docker Compose.
`docker-compose up --build`
This will spin up PostgreSQL (port 5432), the Node.js API (port 5000), and the Nginx Frontend (port 80).

## Environment Variables
Ensure the following are set in the environment or an `.env` file:
- `TMDB_API_KEY`: Provider API key.
- `FRONTEND_URL`: URL to lock down CORS.
- `PORT`: (Defaults to 5000).
- `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` for the DB instance.

## PM2 (Manual Deployment)
If deploying without Docker:
1. `npm run build`
2. `cd backend && npm install`
3. `pm2 start ../ecosystem.config.js`
