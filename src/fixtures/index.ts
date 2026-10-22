import fs from 'node:fs';
import { test as base, expect, type APIRequestContext } from '@playwright/test';
import { env } from '@config/env';
import { USER_META } from '@config/auth';
import { AuthClient } from '@api/AuthClient';
import { CartClient } from '@api/CartClient';
import { ProductsClient } from '@api/ProductsClient';
import { buildUser } from '@data/factories/user.factory';
import type { UserData } from '@data/types';
import { AccountPage } from '@pages/AccountPage';
import { CartPage } from '@pages/CartPage';
import { HomePage } from '@pages/HomePage';
import { LoginPage } from '@pages/LoginPage';
import { ProductPage } from '@pages/ProductPage';
import { RegisterPage } from '@pages/RegisterPage';

interface Pages {
  homePage: HomePage;
  productPage: ProductPage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  accountPage: AccountPage;
  cartPage: CartPage;
}

interface Api {
  /** Request context pointed at the API host, independent of the project's baseURL. */
  apiRequest: APIRequestContext;
  authApi: AuthClient;
  productsApi: ProductsClient;
  cartApi: CartClient;
}

interface Data {
  /** A brand-new user registered through the API, isolated to this test. */
  newUser: UserData;
  /** The user whose session was saved by auth.setup.ts (use with STORAGE_STATE). */
  savedUser: UserData;
}

/**
 * Tests import `test` from here instead of '@playwright/test' and simply ask for
 * what they need: `async ({ homePage, productsApi, newUser }) => ...`.
 * Playwright builds only the fixtures a test actually uses.
 */
export const test = base.extend<Pages & Api & Data>({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  productPage: async ({ page }, use) => use(new ProductPage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  registerPage: async ({ page }, use) => use(new RegisterPage(page)),
  accountPage: async ({ page }, use) => use(new AccountPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),

  apiRequest: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({ baseURL: env.apiUrl });
    await use(context);
    await context.dispose();
  },
  authApi: async ({ apiRequest }, use) => use(new AuthClient(apiRequest)),
  productsApi: async ({ apiRequest }, use) => use(new ProductsClient(apiRequest)),
  cartApi: async ({ apiRequest }, use) => use(new CartClient(apiRequest)),

  newUser: async ({ authApi }, use) => {
    const user = buildUser();
    await authApi.register(user);
    await use(user);
  },
  // eslint-disable-next-line no-empty-pattern
  savedUser: async ({}, use) => {
    await use(JSON.parse(fs.readFileSync(USER_META, 'utf-8')) as UserData);
  },
});

export { expect };
