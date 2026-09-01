/**
 * E2E Test Fixtures — ToSom
 * Gir gjenbrukbare testbrukarar og helper-funksjonar
 */

import { test as base, expect } from '@playwright/test';
import type { Page, BrowserContext } from '@playwright/test';

export interface TestUser {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

export const TEST_USERS: Record<string, TestUser> = {
  'test-user-1': {
    id: 'dev-test-user-1',
    email: 'test1@tosom.no',
    name: 'Testbruker 1',
    role: 'USER',
  },
  'test-user-2': {
    id: 'dev-test-user-2',
    email: 'test2@tosom.no',
    name: 'Testbruker 2',
    role: 'USER',
  },
  'test-admin': {
    id: 'dev-admin-user-1',
    email: 'admin@tosom.no',
    name: 'Admin Test',
    role: 'ADMIN',
  },
};

export const test = base.extend<{
  loggedInUser: TestUser | null;
  devLogin: (userId: string) => Promise<void>;
  goToOnboarding: () => Promise<void>;
  goToDashboard: () => Promise<void>;
}>({
  loggedInUser: [null, { scope: 'test' }],

  devLogin: async ({ page }, use) => {
    await use(async (userId: string) => {
      const user = TEST_USERS[userId];
      if (!user) {
        throw new Error(`Ukjend testbrukar: ${userId}`);
      }

      // Gå til dev-login og velg bruker
      await page.goto('/dev-login');
      await page.getByRole('button', { name: new RegExp(user.name, 'i') }).click();

      // Vent på redirect
      await page.waitForURL(/\/dashboard|\/onboarding|\/journey/, { timeout: 10000 });

      // Lagre testbrukar
      (test as any).loggedInUser = user;
    });
  },

  goToOnboarding: async ({ page }, use) => {
    await use(async () => {
      await page.goto('/onboarding');
    });
  },

  goToDashboard: async ({ page }, use) => {
    await use(async () => {
      await page.goto('/dashboard');
    });
  },
});

export { expect };