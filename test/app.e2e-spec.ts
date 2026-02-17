import request from 'supertest';
import express from 'express';

const app = express();

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

describe('App (e2e)', () => {
  it('/health (GET)', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});
