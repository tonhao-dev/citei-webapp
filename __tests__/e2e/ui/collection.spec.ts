import { test, expect } from '@playwright/test';

test.describe('/collection', () => {
  test('Visual regression test', async ({ page }) => {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    await expect(page).toHaveScreenshot('collection.png', {
      fullPage: true,
    });
  });
});
