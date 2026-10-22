import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';

const browserProjects = [
  ['chromium', 'Desktop Chrome'],
  ['firefox', 'Desktop Firefox'],
  ['webkit', 'Desktop Safari'],
  ['mobile-chrome', 'Pixel 7'],
] as const;

/**
 * Locally: 2 workers to stay within a low-RAM laptop's limits.
 * CI: retries on, forbid .only, and machine-readable reporters.
 */
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
        // Unique name per CI job so shard reports can be merged without collisions.
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
    // Registers a user and saves its session once; browser projects depend on it.
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      // Everything depends on this step, so absorb a slow demo-API response.
      retries: 2,
      timeout: 90_000,
      use: { ...devices['Desktop Chrome'] },
    },
    ...browserProjects.map(([name, device]) => ({
      name,
      // Visual baselines are kept for Chromium only: one reference per screen is
      // enough to catch layout regressions without tripling snapshot maintenance.
      testIgnore: name === 'chromium' ? /api\// : [/api\//, /visual\//],
      dependencies: ['setup'],
      use: { ...devices[device] },
    })),
  ],
});
