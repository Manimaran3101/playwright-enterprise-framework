import { mergeTests } from '@playwright/test';
import { test as a11yTest } from './a11y.fixture';
import { test as apiTest } from './api.fixture';
import { test as pagesTest } from './pages.fixture';

// Tests import test and expect from here. This combines the page, API and a11y fixtures.
export const test = mergeTests(pagesTest, apiTest, a11yTest);
export { expect } from './matchers';
