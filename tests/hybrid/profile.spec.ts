import { faker } from '@faker-js/faker';
import { test, expect } from '@fixtures/index';

// Hybrid tests: set up or check with the API, do the action in the UI.
test.describe('Profile (API ⇄ UI)', { tag: ['@hybrid', '@regression'] }, () => {
  test('data registered via API is shown in the UI profile', async ({
    newUser,
    loginViaApi,
    profilePage,
  }) => {
    await loginViaApi(newUser);
    await profilePage.goto();

    await expect(profilePage.firstName).toHaveValue(newUser.first_name);
    await expect(profilePage.lastName).toHaveValue(newUser.last_name);
    await expect(profilePage.email).toHaveValue(newUser.email);
    await expect(profilePage.phone).toHaveValue(newUser.phone);
    await expect(profilePage.city).toHaveValue(newUser.address.city);
    await expect(profilePage.postalCode).toHaveValue(newUser.address.postal_code);
  });

  test('a phone number changed in the UI is saved in the backend', async ({
    newUser,
    loginViaApi,
    profilePage,
    authApi,
  }) => {
    const token = await loginViaApi(newUser);
    const newPhone = faker.string.numeric(10);

    await profilePage.goto();
    await expect(profilePage.firstName).toHaveValue(newUser.first_name);
    await profilePage.updatePhone(newPhone);

    await expect
      .poll(async () => (await authApi.withToken(token).me()).phone, {
        message: 'GET /users/me should return the phone number saved in the UI',
      })
      .toBe(newPhone);
  });
});
