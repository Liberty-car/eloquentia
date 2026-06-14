import { defineConfig } from '@playwright/test';

// Configuration Playwright (tests end-to-end). Lance automatiquement le
// serveur de dev. Avant la première exécution : npx playwright install.
export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:5173' },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
