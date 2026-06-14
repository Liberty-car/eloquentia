import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // Variables d'environnement de test (le smoke test reste autonome, sans .env).
    env: {
      NODE_ENV: 'test',
      PORT: '4000',
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/eloquentia_test',
      JWT_SECRET: 'secret-de-test',
      CORS_ORIGIN: 'http://localhost:5173',
    },
  },
});
