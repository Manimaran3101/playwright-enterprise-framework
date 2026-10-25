import { defineConfig, devices } from '@playwright/test';
import baseConfig from './playwright.config';

// Only for recording the README GIF (npm run demo:record), not a test.
export default defineConfig({
  ...baseConfig,
  testDir: './scripts/demo',
  testMatch: /.*\.demo\.ts/,
  retries: 0,
  workers: 1,
  reporter: 'list',
  projects: [
    {
      name: 'demo',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
        launchOptions: { slowMo: 250 },
        video: 'off',
        trace: 'off',
      },
    },
  ],
});
