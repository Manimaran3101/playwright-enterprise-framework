import { mergeTests } from '@playwright/test';
import { test as a11yTest } from './a11y.fixture';
import { test as apiTest } from './api.fixture';
import { test as pagesTest } from './pages.fixture';

/**
 * Tests import `test` from here instead of '@playwright/test' and simply ask for
 * what they need: `async ({ homePage, productsApi, newUser }) => ...`.
 * Each concern lives in its own fixture file; Playwright builds only what a test uses.
 */
export const test = mergeTests(pagesTest, apiTest, a11yTest);
export { expect } from './matchers';
