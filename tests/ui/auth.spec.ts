import { test, expect } from '@fixtures/index';
import { STORAGE_STATE } from '@config/auth';
import { buildUser } from '@data/factories/user.factory';

test.describe('Authentication', { tag: '@regression' }, () => {
  test('a new user can register through the UI', async ({ page, registerPage }) => {
    const user = buildUser();

    await registerPage.goto();
    await registerPage.register(user);

    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('a registered user can log in through the UI', async ({
    newUser,
    loginPage,
    accountPage,
  }) => {
    await loginPage.goto();
    await loginPage.login(newUser.email, newUser.password);

    await expect(accountPage.title).toHaveText('My account');
    await expect(accountPage.header.userMenu).toContainText(newUser.first_name);
  });

  test('login is rejected with a wrong password', async ({ newUser, loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login(newUser.email, 'Wrong-Password-1!');

    await expect(loginPage.loginError).toContainText('Invalid email or password');
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  // Uses its own user: signing out may revoke the token, which must never
  // happen to the shared saved session other tests are using in parallel.
  test('a logged-in user can sign out', async ({ newUser, loginPage, accountPage }) => {
    await loginPage.goto();
    await loginPage.login(newUser.email, newUser.password);
    await expect(accountPage.title).toHaveText('My account');

    await accountPage.header.signOut();

    await expect(accountPage.header.signInLink).toBeVisible();
  });

  test.describe('with a saved session', () => {
    test.use({ storageState: STORAGE_STATE });

    test('opens the account page without logging in again', async ({ accountPage, savedUser }) => {
      await accountPage.goto();

      await expect(accountPage.title).toHaveText('My account');
      await expect(accountPage.header.userMenu).toContainText(savedUser.first_name);
      await expect(accountPage.header.signInLink).toBeHidden();
    });
  });
});
