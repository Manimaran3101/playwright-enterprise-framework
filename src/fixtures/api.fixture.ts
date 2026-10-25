import fs from 'node:fs';
import { test as base, type APIRequestContext } from '@playwright/test';
import { env } from '@config/env';
import { TOKEN_KEY, USER_META } from '@config/auth';
import { AuthClient } from '@api/AuthClient';
import { CartClient } from '@api/CartClient';
import { InvoicesClient } from '@api/InvoicesClient';
import { ProductsClient } from '@api/ProductsClient';
import { buildUser } from '@data/factories/user.factory';
import type { UserData } from '@data/types';

export interface ApiFixtures {
  /** Request context for the API URL (not the UI baseURL). */
  apiRequest: APIRequestContext;
  authApi: AuthClient;
  productsApi: ProductsClient;
  cartApi: CartClient;
  invoicesApi: InvoicesClient;
  /** New user registered with the API, only for this test. */
  newUser: UserData;
  /** The user saved by auth.setup.ts (use with STORAGE_STATE). */
  savedUser: UserData;
  /** Logs in with the API, puts the JWT in localStorage, returns the token. */
  loginViaApi: (user: UserData) => Promise<string>;
}

export const test = base.extend<ApiFixtures>({
  apiRequest: async ({ playwright }, use) => {
    // The demo API is sometimes slow (20s+), so API calls have their own timeout.
    const context = await playwright.request.newContext({
      baseURL: env.apiUrl,
      timeout: env.apiTimeout,
    });
    await use(context);
    await context.dispose();
  },
  authApi: async ({ apiRequest }, use) => use(new AuthClient(apiRequest)),
  productsApi: async ({ apiRequest }, use) => use(new ProductsClient(apiRequest)),
  cartApi: async ({ apiRequest }, use) => use(new CartClient(apiRequest)),
  invoicesApi: async ({ apiRequest }, use) => use(new InvoicesClient(apiRequest)),

  newUser: async ({ authApi }, use) => {
    const user = buildUser();
    await authApi.register(user);
    await use(user);
  },
  // eslint-disable-next-line no-empty-pattern
  savedUser: async ({}, use) => {
    await use(JSON.parse(fs.readFileSync(USER_META, 'utf-8')) as UserData);
  },

  loginViaApi: async ({ page, authApi }, use) => {
    await use(async (user) => {
      const { access_token } = await authApi.login(user.email, user.password);
      await page.goto('/');
      await page.evaluate(
        ([key, token]) => localStorage.setItem(key, token),
        [TOKEN_KEY, access_token],
      );
      return access_token;
    });
  },
});
