import { test, expect } from '@playwright/test';

test("la page d'accueil répond", async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Eloquentia/);
});
