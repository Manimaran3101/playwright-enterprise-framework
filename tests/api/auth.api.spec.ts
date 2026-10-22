import { test, expect } from '@fixtures/index';
import { buildUser } from '@data/factories/user.factory';

test.describe('Users API', { tag: '@regression' }, () => {
  test('register → login → /users/me returns the same user', async ({ authApi }) => {
    const user = buildUser();

    const created = await authApi.register(user);
    expect(created.email).toBe(user.email);

    const token = await authApi.login(user.email, user.password);
    expect(token.access_token).toBeTruthy();
    expect(token.token_type.toLowerCase()).toBe('bearer');

    const me = await authApi.withToken(token.access_token).me();
    expect(me).toMatchObject({
      id: created.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    });
  });

  test('registering the same email twice is rejected', async ({ authApi, newUser }) => {
    const response = await authApi.raw('post', '/users/register', {
      data: buildUser({ email: newUser.email }),
    });

    expect(response.status()).toBe(409);
  });

  test('login with a wrong password returns 401', async ({ authApi, newUser }) => {
    const response = await authApi.raw('post', '/users/login', {
      data: { email: newUser.email, password: 'Wrong-Password-1!' },
    });

    expect(response.status()).toBe(401);
  });

  test('/users/me without a token returns 401', async ({ authApi }) => {
    const response = await authApi.raw('get', '/users/me');
    expect(response.status()).toBe(401);
  });
});
