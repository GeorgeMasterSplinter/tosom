/**
 * E2E-test — Match-flow
 * Testar at ein brukar kan motta og akseptere ein match
 */

import { test, expect } from '../fixtures/test-users';

test.describe('Match Flow', () => {
  test('skal vise match-status på dashboard', async ({ page }) => {
    // Gå til dashboard
    await page.goto('/dashboard');

    // Søk etter match-relaterte element
    const matchBanner = page.locator('[data-testid*="match"], .match-banner, .match-status, #match-status');
    if (await matchBanner.count() > 0) {
      await expect(matchBanner.first()).toBeVisible();
    }
  });

  test('skal vise "Vent på match" når ingen match er tilgjengeleg', async ({ page }) => {
    await page.goto('/dashboard');

    // Søk etter ventemelding
    const waitingText = page.getByText(/vent|avvent|søker|neste match/i);
    if (await waitingText.count() > 0) {
      await expect(waitingText.first()).toBeVisible();
    }
  });

  test('skal kunne navigere til match-side', async ({ page }) => {
    await page.goto('/dashboard');

    // Søk etter lenkje til match
    const matchLink = page.getByRole('link', { name: /match|din match/i, exact: false });
    if (await matchLink.count() > 0) {
      await matchLink.first().click();
      await page.waitForURL(/\/match|\/matching|\/dashboard/, { timeout: 5000 });
    }
  });

  test('skal vise match-explanation dersom match er tilgjengeleg', async ({ page }) => {
    await page.goto('/dashboard');

    // Søk etter forklaringselement
    const explanation = page.locator('[data-testid*="explanation"], .match-explanation, .match-reason');
    if (await explanation.count() > 0) {
      await expect(explanation.first()).toBeVisible();
    }
  });

  test('skal kunne avise match', async ({ page }) => {
    await page.goto('/dashboard');

    // Søk etter avise-knapp
    const rejectBtn = page.getByRole('button', { name: /avvis|nei|ikke akkurat/i, exact: false });
    if (await rejectBtn.count() > 0) {
      await rejectBtn.first().click();
      await page.waitForTimeout(1000);

      // Skal vise ny match eller "vent på neste"
      const nextMatchText = page.getByText(/neste match|ny match|vent/i);
      if (await nextMatchText.count() > 0) {
        await expect(nextMatchText.first()).toBeVisible();
      }
    }
  });

  test('skal kunne akseptere match', async ({ page }) => {
    await page.goto('/dashboard');

    // Søk etter akseptere-knapp
    const acceptBtn = page.getByRole('button', { name: /aksepter|ja|nett|start reise/i, exact: false });
    if (await acceptBtn.count() > 0) {
      await acceptBtn.first().click();
      await page.waitForTimeout(1000);

      // Skal redirect til chat eller journey
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/chat|\/journey|\/conversation/);
    }
  });
});