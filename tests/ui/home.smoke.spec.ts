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

  // Search also finds words in the description ("pliers" finds Bolt Cutters),
  // so I compare with the search API instead of checking the names.
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
