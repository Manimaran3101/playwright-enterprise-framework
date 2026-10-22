import fs from 'node:fs';
import path from 'node:path';
import { test as setup, expect } from '@fixtures/index';
import { STORAGE_STATE, TOKEN_KEY, USER_META } from '@config/auth';
import { buildUser } from '@data/factories/user.factory';

/**
 * Runs once before the browser projects.
 *
 * Why not the shared demo account? Public demo users get locked by other people's
 * failed logins, which would make the whole suite flaky. Instead we register our own
 * user through the API, log in through the API, and inject the token — no slow UI login.
 */
setup('authenticate a fresh user', async ({ page, authApi, accountPage }) => {
  const user = buildUser();
  await authApi.register(user);
  const { access_token } = await authApi.login(user.email, user.password);

  await page.goto('/');
  await page.evaluate(
    ([key, token]) => localStorage.setItem(key, token),
    [TOKEN_KEY, access_token],
  );

  await accountPage.goto();
  await expect(accountPage.title).toHaveText('My account');
  await expect(accountPage.header.userMenu).toContainText(user.first_name);

  fs.mkdirSync(path.dirname(STORAGE_STATE), { recursive: true });
  await page.context().storageState({ path: STORAGE_STATE });
  fs.writeFileSync(USER_META, JSON.stringify(user, null, 2));
});
