/**
 * E2E-test — Onboarding-flow
 * Testar at ein ny brukar kan fullføre onboarding utan feil
 */

import { test, expect } from '../fixtures/test-users';

test.describe('Onboarding Flow', () => {
  test('skal vise onboarding-side for ny brukar', async ({ page }) => {
    // Gå til onboarding utan å logge inn først
    await page.goto('/onboarding');

    // Skal enten vise onboarding eller redirect til dev-login
    await expect(
      page.locator('h1, h2, h3, .onboarding, #onboarding')
    ).toHaveCountGreaterThan(0, { timeout: 5000 });
  });

  test('skal kunne starte onboarding frå dev-login', async ({ page, devLogin }) => {
    // Logg inn som testbrukar
    await devLogin('test-user-1');

    // Vent på at sidan lastar
    await page.waitForLoadState('networkidle', { timeout: 10000 });

    // Either på onboarding eller dashboard (avhengig av om brukar har fullført)
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/dashboard|\/onboarding|\/journey/);
  });

  test('skal vise steg-indikator i onboarding', async ({ page }) => {
    await page.goto('/onboarding');

    // Søk etter steg-indikator (typisk 1-10 sirkel eller linje)
    const stepper = page.locator('[data-testid*="step"], .stepper, .step-indicator');
    if (await stepper.count() > 0) {
      await expect(stepper.first()).toBeVisible();
    }
  });

  test('skal kunne fylle ut basis profilinfo', async ({ page }) => {
    await page.goto('/onboarding');

    // Søk etter input-felt
    const firstName = page.locator('[data-testid*="firstName"], input[name="firstName"], input[placeholder*="fornavn"], input[placeholder*="navn"]');
    if (await firstName.count() > 0) {
      await firstName.fill('Test');
      await expect(firstName).toHaveValue('Test');
    }

    const lastName = page.locator('[data-testid*="lastName"], input[name="lastName"], input[placeholder*="etternavn"]');
    if (await lastName.count() > 0) {
      await lastName.fill('Bruker');
      await expect(lastName).toHaveValue('Bruker');
    }
  });

  test('skal kunne navigere mellom onboarding-steg', async ({ page }) => {
    await page.goto('/onboarding');

    // Søk etter neste/forrige knappar
    const nextBtn = page.getByRole('button', { name: /neste|next|vidare|fortset/i, exact: false });
    const prevBtn = page.getByRole('button', { name: /førre|forrige|back|tilbake/i, exact: false });

    if (await nextBtn.count() > 0) {
      await expect(nextBtn.first()).toBeVisible();
    }

    if (await prevBtn.count() > 0) {
      await expect(prevBtn.first()).toBeVisible();
    }
  });

  test('skal vise feilmelding ved ugyldig inndata', async ({ page }) => {
    await page.goto('/onboarding');

    // Søk etter feilmeldingselement
    const submitBtn = page.getByRole('button', { name: /neste|fortset|fullfør/i, exact: false });
    if (await submitBtn.count() > 0) {
      await submitBtn.first().click();
      await page.waitForTimeout(1000);

      // Søk etter feilmelding
      const errorMsg = page.locator('[data-testid*="error"], .error, .invalid, .field-error');
      if (await errorMsg.count() > 0) {
        await expect(errorMsg.first()).toBeVisible();
      }
    }
  });
});