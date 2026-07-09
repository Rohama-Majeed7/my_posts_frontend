import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://my-posts-frontend.vercel.app/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/My PostApp/);
});
