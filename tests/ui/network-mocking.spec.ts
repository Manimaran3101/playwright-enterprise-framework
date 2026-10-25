import { test, expect } from '@fixtures/index';
import { MOCK_CATALOGUE, mockProductPage } from '@data/mocks/products';
import { apiRoute } from '@utils/routes';

// Mocked API responses for cases I can't get from the real backend: no data, errors, long values.
test.describe('Product listing with mocked API', { tag: ['@mocked', '@regression'] }, () => {
  test('shows a friendly message when there are no products', async ({ page, homePage }) => {
    await page.route(apiRoute('/products'), (route) =>
      route.fulfill({ json: mockProductPage([]) }),
    );

    await homePage.goto();

    await expect(page.getByTestId('no-results')).toHaveText('There are no products found.');
    await expect(homePage.products.cards).toHaveCount(0);
  });

  test('renders exactly the products the API returns', async ({ page, homePage }) => {
    await page.route(apiRoute('/products'), (route) =>
      route.fulfill({ json: mockProductPage(MOCK_CATALOGUE) }),
    );

    await homePage.goto();

    await expect(homePage.products.names).toHaveText(MOCK_CATALOGUE.map((p) => p.name));
    await expect(homePage.products.prices).toHaveText(
      MOCK_CATALOGUE.map((p) => `$${p.price.toFixed(2)}`),
    );
    await expect(page.getByTestId('out-of-stock')).toHaveCount(1);
  });

  test('handles extreme values from a modified real response', async ({ page, homePage }) => {
    const longName = 'Ultra Heavy Duty Professional Grade Adjustable Locking Pliers '
      .repeat(2)
      .trim();

    // Change only the first product in the real response.
    await page.route(apiRoute('/products'), async (route) => {
      const response = await route.fetch();
      const body = await response.json();
      body.data[0] = { ...body.data[0], name: longName, price: 99999.99 };
      await route.fulfill({ response, json: body });
    });

    await homePage.goto();

    await expect(homePage.products.names.first()).toHaveText(longName);
    await expect(homePage.products.prices.first()).toHaveText('$99999.99');
  });

  test('shows an error message when the products API fails', async ({ page, homePage }) => {
    test.info().annotations.push({
      type: 'known issue',
      description:
        'On HTTP 500 the grid silently renders empty: no error and no "no results" message.',
    });
    // Known bug, expected to fail until it is fixed.
    test.fail();

    await page.route(apiRoute('/products'), (route) =>
      route.fulfill({ status: 500, json: { message: 'Server Error' } }),
    );

    await homePage.goto();

    await expect(homePage.products.cards).toHaveCount(0);
    await expect(page.getByRole('alert')).toBeVisible({ timeout: 3_000 });
  });
});
