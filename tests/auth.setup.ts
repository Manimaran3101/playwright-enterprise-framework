import fs from 'node:fs';
import path from 'node:path';
import { test as setup, expect } from '@fixtures/index';
import { STORAGE_STATE, USER_META } from '@config/auth';
import { buildUser } from '@data/factories/user.factory';

/**
 * Runs once before the browser projects.
 *
 * Why not the shared demo account? Public demo users get locked by other people's
 * failed logins, which would make the whole suite flaky. Instead we register our own
 * user through the API, log in through the API, and inject the token — no slow UI login.
 */
setup('authenticate a fresh user', async ({ page, authApi, loginViaApi, accountPage }) => {
  const user = buildUser();
  await authApi.register(user);
  await loginViaApi(user);

  await accountPage.goto();
  await expect(accountPage.title).toHaveText('My account');
  await expect(accountPage.header.userMenu).toContainText(user.first_name);

  fs.mkdirSync(path.dirname(STORAGE_STATE), { recursive: true });
  await page.context().storageState({ path: STORAGE_STATE });
  fs.writeFileSync(USER_META, JSON.stringify(user, null, 2));
});
