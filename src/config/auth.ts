import path from 'node:path';

const AUTH_DIR = path.join(__dirname, '..', '..', 'playwright', '.auth');

/** Saved browser state (cookies + localStorage) of the setup user. */
export const STORAGE_STATE = path.join(AUTH_DIR, 'user.json');

/** Data of the same user, for tests that need to know who is logged in. */
export const USER_META = path.join(AUTH_DIR, 'user.meta.json');

/** localStorage key where the app keeps the JWT. */
export const TOKEN_KEY = 'auth-token';
