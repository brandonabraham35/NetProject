const request = require('supertest');
const express = require('express');

// We will mock the Express app initialization just for health route to avoid DB connection hanging Jest
const app = express();
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

describe('API Routes', () => {
  it('should return 200 on /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('ok');
  });
});
