import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';

const browserProjects = [
  ['chromium', 'Desktop Chrome'],
  ['firefox', 'Desktop Firefox'],
  ['webkit', 'Desktop Safari'],
  ['mobile-chrome', 'Pixel 7'],
] as const;

// Local: 2 workers (my laptop has little RAM). CI: retries, no .only, extra reporters.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: env.isCI,
  retries: env.isCI ? 2 : 0,
  workers: env.isCI ? '50%' : 2,
  timeout: 30_000,
  expect: {
    timeout: 7_000,
    toHaveScreenshot: { animations: 'disabled', caret: 'hide', maxDiffPixelRatio: 0.01 },
  },

  reporter: env.isCI
    ? [
        ['github'],
        ['html', { open: 'never' }],
        // Different name per CI job so the reports can be merged.
        ['blob', { fileName: `report-${process.env.BLOB_REPORT_NAME ?? 'local'}.zip` }],
      ]
    : [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: env.baseUrl,
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },

  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      timeout: 60_000,
      use: { baseURL: env.apiUrl },
    },
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      // Registers a user and saves the session. All browser tests need it, so retry if the API is slow.
      retries: 2,
      timeout: 90_000,
      use: { ...devices['Desktop Chrome'] },
    },
    ...browserProjects.map(([name, device]) => ({
      name,
      // Visual tests only on Chromium.
      testIgnore: name === 'chromium' ? /api\// : [/api\//, /visual\//],
      dependencies: ['setup'],
      use: { ...devices[device] },
    })),
  ],
});
