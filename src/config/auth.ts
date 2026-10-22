import path from 'node:path';

const AUTH_DIR = path.join(__dirname, '..', '..', 'playwright', '.auth');

/** Browser storage (cookies + localStorage) of the logged-in setup user. */
export const STORAGE_STATE = path.join(AUTH_DIR, 'user.json');

/** Credentials of that same user, for tests that need to know who is logged in. */
export const USER_META = path.join(AUTH_DIR, 'user.meta.json');

/** localStorage key the Toolshop SPA reads the JWT from. */
export const TOKEN_KEY = 'auth-token';
