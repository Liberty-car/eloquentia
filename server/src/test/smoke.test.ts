import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';

describe('smoke', () => {
  it('GET /api/v1/health renvoie 200 et un statut ok', async () => {
    const app = createApp();
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      data: { status: 'ok' },
    });
  });
});
