import { test, expect } from '@playwright/test';

test.describe('Home page', { tag: '@smoke' }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads with navigation and a product grid', async ({ page }) => {
    await expect(page).toHaveTitle(/Practice Software Testing - Toolshop/);
    await expect(page.getByTestId('nav-sign-in')).toBeVisible();

    const productNames = page.getByTestId('product-name');
    await expect(productNames.first()).toBeVisible();
    expect(await productNames.count()).toBeGreaterThan(0);
  });

  test('search returns only matching products', async ({ page }) => {
    const term = 'pliers';

    await page.getByTestId('search-query').fill(term);
    await page.getByTestId('search-submit').click();

    await expect(page.getByTestId('search-caption')).toContainText(term);
    const names = page.getByTestId('product-name');
    await expect(names.first()).toBeVisible();
    for (const name of await names.allTextContents()) {
      expect(name.toLowerCase()).toContain(term);
    }
  });
});
