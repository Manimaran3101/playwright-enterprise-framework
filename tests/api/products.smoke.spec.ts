import { test, expect } from '@playwright/test';

test.describe('Products API', { tag: '@smoke' }, () => {
  test('GET /products returns a paginated product list', async ({ request }) => {
    const response = await request.get('/products', { params: { page: 1 } });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body.current_page).toBe(1);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    for (const product of body.data) {
      expect(product).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          price: expect.any(Number),
        }),
      );
    }
  });

  test('GET /products/{id} returns 404 for an unknown id', async ({ request }) => {
    const response = await request.get('/products/does-not-exist');
    expect(response.status()).toBe(404);
  });
});
