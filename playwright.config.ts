import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Playwright E2E-configurasjon for ToSom
 * Kjøring: npx playwright test
 */

const dashboardState = path.resolve(__dirname, 'e2e', '.auth', 'dashboard-user.json');
const onboardingState = path.resolve(__dirname, 'e2e', '.auth', 'onboarding-user.json');

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Én worker alltid: onboarding-testene deler én E2E-bruker (server-draft
  // + fullført profil), og full-flow-testen muterer den. To parallelle
  // workere (chromium + firefox onboarding) racea på brukeren — en
  // fire-and-forget draft-POST fra prosjekt A kan lande etter prosjekt B
  // sin beforeEach-sletting, og B restaurerer A sin tilstand. CI kjørte
  // alltid med 1 worker; lokalt (default = CPU/2) racea testene.
  // workers: 1 gir lokal kjøring = CI.
  workers: 1,
  reporter: process.env.CI ? 'github' : 'html',

  /* STEG 12.3: Global setup kjører BOTH dashboard + onboarding auth */
  globalSetup: './e2e/global-setup',

  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // ─── Dashboard / Journey / Chat / Match (med full onboarding) ───
    {
      name: 'chromium-dashboard',
      testIgnore: [/.*onboarding\.spec\.ts$/],
      use: { ...devices['Desktop Chrome'], storageState: dashboardState },
    },
    {
      name: 'firefox-dashboard',
      testIgnore: [/.*onboarding\.spec\.ts$/],
      use: { ...devices['Desktop Firefox'], storageState: dashboardState },
    },

    // ─── Onboarding (utan onboardingComplete) ───
    {
      name: 'chromium-onboarding',
      testMatch: [/.*onboarding\.spec\.ts$/],
      use: { ...devices['Desktop Chrome'], storageState: onboardingState },
    },
    {
      name: 'firefox-onboarding',
      testMatch: [/.*onboarding\.spec\.ts$/],
      use: { ...devices['Desktop Firefox'], storageState: onboardingState },
    },

    // ─── Mobile ───
    {
      name: 'Mobile Chrome',
      testIgnore: [/.*onboarding\.spec\.ts$/],
      use: { ...devices['Pixel 5'], storageState: dashboardState },
    },
    {
      name: 'Mobile Safari',
      testIgnore: [/.*onboarding\.spec\.ts$/],
      use: { ...devices['iPhone 12'], storageState: dashboardState },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
    env: { DEV_LOGIN_ENABLED: 'true' },
  },
});