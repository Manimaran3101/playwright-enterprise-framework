import { test, expect } from '@fixtures/index';

test.describe('Products API', { tag: '@smoke' }, () => {
  test('GET /products returns a paginated product list', async ({ productsApi }) => {
    const page = await productsApi.list({ page: 1 });

    expect(page.current_page).toBe(1);
    expect(page.data.length).toBeGreaterThan(0);
    for (const product of page.data) {
      expect(product).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          price: expect.any(Number),
        }),
      );
    }
  });

  test('GET /products/{id} returns the requested product', async ({ productsApi }) => {
    const [first] = (await productsApi.list()).data;

    const product = await productsApi.get(first.id);

    expect(product.id).toBe(first.id);
    expect(product.name).toBe(first.name);
  });

  test('GET /products/{id} returns 404 for an unknown id', async ({ productsApi }) => {
    const response = await productsApi.raw('get', '/products/does-not-exist');
    expect(response.status()).toBe(404);
  });
});
