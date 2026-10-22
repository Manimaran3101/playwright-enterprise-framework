import { test, expect } from '@fixtures/index';
import { MOCK_CATALOGUE, mockProductPage } from '@data/mocks/products';
import { apiRoute } from '@utils/routes';

/**
 * Visual regression. To keep screenshots deterministic:
 *  - product data is mocked, so database resets don't change the page
 *  - images and floating widgets are masked
 *  - animations and the caret are disabled (see expect.toHaveScreenshot in the config)
 *
 * Baselines are per OS/browser (e.g. `-chromium-win32.png`).
 * Update them with: npx playwright test tests/visual --update-snapshots
 */
test.describe('Visual regression', { tag: '@visual' }, () => {
  test('login form', async ({ page, loginPage }) => {
    await loginPage.goto();
    await expect(loginPage.submitButton).toBeVisible();

    await expect(page.getByTestId('login-form')).toHaveScreenshot('login-form.png');
  });

  test('product grid with mocked catalogue', async ({ page, homePage }) => {
    await page.route(apiRoute('/products'), (route) =>
      route.fulfill({ json: mockProductPage(MOCK_CATALOGUE) }),
    );
    await homePage.goto();
    await expect(homePage.products.names).toHaveText(MOCK_CATALOGUE.map((p) => p.name));

    await expect(homePage.products.cards.first().locator('..')).toHaveScreenshot(
      'product-grid.png',
      { mask: [homePage.products.cards.locator('img')] },
    );
  });
});
