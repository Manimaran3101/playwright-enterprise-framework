import { test, expect } from '@fixtures/index';

test.describe('Home page', { tag: '@smoke' }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('loads with navigation and a product grid', async ({ page, homePage }) => {
    await expect(page).toHaveTitle(/Practice Software Testing - Toolshop/);
    await homePage.header.expand();
    await expect(homePage.header.signInLink).toBeVisible();
    await expect(homePage.products.names.first()).toBeVisible();
  });

  // Search also matches descriptions (e.g. "pliers" finds Bolt Cutters), so the
  // API search endpoint is the oracle rather than a naive "name contains term" check.
  test('search shows the same products the search API returns', async ({
    homePage,
    productsApi,
  }) => {
    const term = 'pliers';
    const expected = (await productsApi.search(term)).data.map((p) => p.name);

    await homePage.search(term);

    await expect(homePage.searchCaption).toContainText(term);
    await expect(homePage.products.names).toHaveText(expected);
  });
});
