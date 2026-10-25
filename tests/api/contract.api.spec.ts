import { test, expect } from '@fixtures/index';
import {
  ErrorSchema,
  InvoiceSchema,
  paginated,
  ProductSchema,
  TokenSchema,
  UserSchema,
} from '@data/schemas';
import type { APIResponse } from '@playwright/test';

const bodyOf = (response: APIResponse): Promise<unknown> => response.json();

// Contract tests: check the real API responses with the Zod schemas (raw responses, no typed clients).
test.describe('API contracts', { tag: ['@contract', '@regression'] }, () => {
  test('GET /products matches the paginated product contract', async ({ productsApi }) => {
    const response = await productsApi.raw('get', '/products');
    expect(response.status()).toBe(200);
    expect(await bodyOf(response)).toMatchSchema(paginated(ProductSchema));
  });

  test('GET /products/{id} matches the product contract', async ({ productsApi }) => {
    const { id } = await productsApi.firstPurchasable();
    const response = await productsApi.raw('get', `/products/${id}`);
    expect(await bodyOf(response)).toMatchSchema(ProductSchema);
  });

  test('GET /products/search matches the paginated product contract', async ({ productsApi }) => {
    test.info().annotations.push({
      type: 'known issue',
      description:
        'Search returns products without `category.slug`, unlike GET /products. ' +
        'Code that needs slug breaks on search results.',
    });
    test.fail();

    const response = await productsApi.raw('get', '/products/search', { params: { q: 'hammer' } });
    expect(await bodyOf(response)).toMatchSchema(paginated(ProductSchema));
  });

  test('POST /users/login matches the token contract', async ({ authApi, newUser }) => {
    const response = await authApi.raw('post', '/users/login', {
      data: { email: newUser.email, password: newUser.password },
    });
    expect(await bodyOf(response)).toMatchSchema(TokenSchema);
  });

  test('GET /users/me matches the user contract', async ({ authApi, newUser }) => {
    const { access_token } = await authApi.login(newUser.email, newUser.password);
    const response = await authApi.withToken(access_token).raw('get', '/users/me');
    expect(await bodyOf(response)).toMatchSchema(UserSchema);
  });

  test('GET /invoices matches the paginated invoice contract', async ({
    authApi,
    invoicesApi,
    newUser,
  }) => {
    const { access_token } = await authApi.login(newUser.email, newUser.password);
    const response = await invoicesApi.withToken(access_token).raw('get', '/invoices');
    expect(await bodyOf(response)).toMatchSchema(paginated(InvoiceSchema));
  });

  test('error responses carry a message', async ({ authApi }) => {
    const response = await authApi.raw('get', '/users/me');
    expect(response.status()).toBe(401);
    expect(await bodyOf(response)).toMatchSchema(ErrorSchema);
  });
});
