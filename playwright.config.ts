import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Playwright E2E-configurasjon for ToSom
 * Kjøring: npx playwright test
 * 
 * Auth-setup: Loggar inn som test-brukar via /dev-login og deler session på tvers av browser.
 */

const storageStatePath = path.resolve(__dirname, 'e2e', '.auth', 'user.json');

export default defineConfig({
  testDir: './e2e',

  /* Full timeout for each test */
  timeout: 60_000,

  /* Expect timeout */
  expect: {
    timeout: 10_000,
  },

  /* Fail the build on CI if you accidentally left test.only in source */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use */
  reporter: process.env.CI ? 'github' : 'html',

  /* Global setup: run auth-login før alle test */
  globalSetup: './e2e/auth-setup.ts',

  /* Shared settings for all the projects */
  use: {
    /* Base URL */
    baseURL: 'http://127.0.0.1:3000',

    /* Use authenticated state from auth project */
    storageState: storageStatePath,

    /* Collect trace when retrying */
    trace: 'on-first-retry',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    /* Test against mobile viewports */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      DEV_LOGIN_ENABLED: 'true',
    },
  },
});
