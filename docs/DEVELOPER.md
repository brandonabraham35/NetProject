# Developer Guide

## Architecture
This project is built using React (Vite) and Node.js (Express) powered by PostgreSQL via Sequelize.
All streaming provider logic is abstracted behind the `ProviderManager`. See `ARCHITECTURE.md` and `PROVIDERS.md`.

## Scripts
- `npm start`: Starts Vite dev server.
- `npm run build`: Compiles for production.
- `cd backend && node index.js`: Starts the API server.
- `cd backend && npm test`: Runs Jest suite.
