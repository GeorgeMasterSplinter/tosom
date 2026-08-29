/**
 * E2E-test — Onboarding-flow (13-stegs versjon)
 * Tester at en ny bruker kan fullføre hele onboarding-flyten uten feil.
 *
 * R-1 (MASTERPLAN v3.0, 29.08): testene er skrevet mot faktiske komponenter
 * med data-testid — ingen CSS-klasser, ingen [name=...]-selektorer.
 * Valideringen i UI-et: CTA-en er deaktivert («Fyll ut alle påkrevde
 * felt») til stegets påkrevde felt er fylt — det er det testene måler.
 *
 * Isolasjon: E2E-brukeren deles mellom testene i en runde og nullstilles
 * bare per runde (seed-e2e-users). Derfor:
 *  1. Server-draften slettes før hver test (ellers restaureres steget).
 *  2. Fullførings-testen kjører sist (den setter onboardingComplete=true).
 */

import { test, expect, type Page } from '@playwright/test';
import { resetOnboardingUser } from '../onboarding-reset';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// =====================================================================
// Hjelpefunksjoner
// =====================================================================

const TOTAL_STEPS = 13;

/** Påtaler at vi er på «Steg N av 13» (og på den gitte tittelen). */
async function expectStep(page: Page, step: number, title?: string) {
  await expect(page.getByTestId('ob-step-indicator')).toHaveText(
    `Steg ${step} av ${TOTAL_STEPS}`,
  );
  if (title) {
    await expect(page.getByTestId('ob-step-title')).toHaveText(title);
  }
}

/** Klikker stegets CTA (ob-next) — forutsetter at den er aktiv. */
async function clickNext(page: Page) {
  const next = page.getByTestId('ob-next');
  await expect(next).toBeEnabled();
  await next.click();
}

/** Steg 1 (Grunnprofil): de påkrevde feltene. */
async function fillStep1(page: Page) {
  await page.getByTestId('ob-name').fill('Testbruker');
  await page.getByTestId('ob-age').fill('30');
  await page.getByTestId('ob-gender').getByRole('button', { name: /Mann/ }).click();
  await page.getByTestId('ob-seeking').getByRole('button', { name: /Kvinne/ }).click();
  await page.getByTestId('ob-city').fill('Oslo');
  await page.getByTestId('ob-postal').fill('0150');
}

/** Steg 2 (Personlighet & identitet): fire lengdefelt + én quirk. */
async function fillStep2(page: Page) {
  await page.getByTestId('ob-self-desc').fill('Jeg er en rolig og balansert person som verdsetter dype samtaler og ærlighet.');
  await page.getByTestId('ob-energy-giver').fill('Gode samtaler, natur og kreativt arbeid gir meg energi.');
  await page.getByTestId('ob-energy-drainer').fill('Store folkemengder, konflikt og uvissighet tar fra meg.');
  await page.getByTestId('ob-pressure-react').fill('Jeg trekker meg tilbake litt til jeg kjenner meg trygg igjen.');
  await page.getByTestId('ob-quirk').fill('Jeg må alltid ha orden på ting før jeg kan slappe av.');
}

/** Steg 3 (Livssituasjon): fire valg-gridene + to lengdefelt. */
async function fillStep3(page: Page) {
  await page.getByTestId('ob-work-type').getByRole('button', { name: /fulltid/i }).click();
  await page.getByTestId('ob-housing').getByRole('button', { name: /Leilighet/ }).click();
  await page.getByTestId('ob-household').getByRole('button', { name: /Jeg alene/ }).click();
  await page.getByTestId('ob-economy').getByRole('button', { name: /Stabil økonomi/ }).click();
  await page.getByTestId('ob-responsibilities').fill('Jeg har to barn som bor hos meg helga og hverdags.');
  await page.getByTestId('ob-daily-routine').fill('Jeg står opp tidlig, drikker kaffe i ro og går en tur før jobben.');
}

/** Steg 4 (Tilknytning & trygghet): fem lengdefelt. */
async function fillStep4(page: Page) {
  await page.getByTestId('ob-safety-need').fill('At noen lytter uten å dømme, og holder det de lover.');
  await page.getByTestId('ob-insecurity-trigger').fill('Når folk lover noe og holder ikke ordet, mister jeg tryggheten.');
  await page.getByTestId('ob-sadness-need').fill('En klem og at noen sier det skal bli bra.');
  await page.getByTestId('ob-stress-need').fill('At noen tar over ansvaret midlertidig, slik at jeg kan puste.');
  await page.getByTestId('ob-important-boundary').fill('Jeg trenger tid alene etter en tung dag.');
}
/** Steg 5 (Kjærlighetsspråk & nærhet): to gridene + tre lengdefelt. */
async function fillStep5(page: Page) {
  await page.getByTestId('ob-love-give').getByRole('button', { name: /Ord og ros/ }).click();
  await page.getByTestId('ob-love-receive').getByRole('button', { name: /Ord og ros/ }).click();
  await page.getByTestId('ob-closeness-builder').fill('Dype samtaler om noe som betyr mye, der begge er til stede.');
  await page.getByTestId('ob-distance-creator').fill('Når følelsene mine ikke blir tatt på alvor, trekker jeg meg unna.');
  await page.getByTestId('ob-small-thing').fill('At noen husker at jeg vil ha kaffe på morgenen uten at jeg ber om det.');
}

/** Steg 6 (Livsstil & verdier): ett lengdefelt (gridene er valfrie). */
async function fillStep6(page: Page) {
  await page.getByTestId('ob-good-everyday').fill('Frokost i ro, en tur ute, og en kveld med dype samtaler med noen jeg bryr meg om.');
}

/** Steg 7 (Relasjonsstil): to gridene. */
async function fillStep7(page: Page) {
  await page.getByTestId('ob-relationship-seeking').getByRole('button', { name: /Dating/ }).click();
  await page.getByTestId('ob-closeness-need').getByRole('button', { name: /Balansert/ }).click();
}

/** Steg 8 (Framtid & visjon): fem lengdefelt. */
async function fillStep8(page: Page) {
  await page.getByTestId('ob-future-vision').fill('Et rolig liv med dype relasjoner og et hjem der alle føler seg hjemme.');
  await page.getByTestId('ob-dream-goal').fill('Å bygge et eget hus i naturen sammen med noen jeg elsker.');
  await page.getByTestId('ob-build-together').fill('En hverdag der vi deler både moro og utfordringer uten å tape oss selv.');
  await page.getByTestId('ob-experience-alone').fill('Å reise alene til Japan for å lære om meg selv.');
  await page.getByTestId('ob-experience-together').fill('Å lage mat sammen kveld etter kveld og prate om dagen vi har hatt.');
}

// Steg 9 (Humor & personlighet): alle felt er valfrie — ingenting å fylle.

/** Steg 10 (Grenser & behov): to gridene + to lengdefelt. */
async function fillStep10(page: Page) {
  await page.getByTestId('ob-never-cross').getByRole('button', { name: /Respekt for meg som person/ }).click();
  await page.getByTestId('ob-understand-partner').getByRole('button', { name: /Jeg lytter aktivt/ }).click();
  await page.getByTestId('ob-limitations').fill('Jeg trenger aldri å bli møtt med høye stemmer eller skuldret skyld.');
  await page.getByTestId('ob-partner-must-understand').fill('At jeg trenger tid alene for å bearbeide følelser før jeg kan dele dem.');
}

/** Steg 11 (Moden nysgjerrighet): fem lengdefelt. */
async function fillStep11(page: Page) {
  await page.getByTestId('ob-intimacy-safety').fill('At noen trygger meg med ord før noe dypt skal skje.');
  await page.getByTestId('ob-comfortable-with').fill('Å dele sårbarhet uten å bli dømt eller kritisert bagefter.');
  await page.getByTestId('ob-personal-boundary').fill('Jeg trenger tydelige signaler om når ting blir for mye.');
  await page.getByTestId('ob-nearer-type').fill('Ro og stille samtaler om noe som betyr mye for begge.');
  await page.getByTestId('ob-needs-time').fill('Tid til å bearbeide følelsene mine alene før jeg deler dem.');
}

/**
 * Fra steg 1 (Grunnprofil) til «Steg N av 13» — fyller påkrevde felt
 * underveis. Støtter steg 2–4 (de fire stegene med påkrevde felt).
 */
async function advanceTo(page: Page, step: number) {
  if (step < 2 || step > 4) {
    throw new Error(`advanceTo støtter steg 2–4, ikke ${step}`);
  }
  const fillers = [fillStep1, fillStep2, fillStep3, fillStep4];
  for (let current = 1; current < step; current++) {
    await fillers[current - 1](page);
    await clickNext(page);
  }
  await expectStep(page, step);
}

// =====================================================================
// TESTER
// =====================================================================

test.describe('Onboarding Flow (13-stegs)', () => {
  // Server-draften deles av E2E-brukeren mellom testene i en runde, og
  // restaureres (inkludert steg) ved mount. Slettes før hver test slik at
  // alle testene starter på steg 1.
  test.beforeEach(async ({ page }) => {
    const res = await page.request.delete('/api/onboarding/draft');
    expect(res.ok()).toBe(true);
  });

  // Onboarding-brukeren deles mellom browser-prosjektene i en runde
  // (chromium og firefox kjører samme spec). Full-flow-testen fullfører
  // profilen — neste prosjekt må få en nøytral bruker, ellers pre-fyller
  // prefill-API-et profilen og validerings-testene måler feil tilstand.
  // Nullstilles her (kjører en gang pr. prosjekt).
  test.beforeAll(async () => {
    await resetOnboardingUser();
  });
  // -------------------------------------------------------------------------
  // Steg 1: Visning av onboarding
  // -------------------------------------------------------------------------

  test('skal vise onboarding med steg-indikator og steg-tittel', async ({ page }) => {
    await page.goto('/onboarding');
    await expectStep(page, 1, 'Grunnprofil');
  });

  // -------------------------------------------------------------------------
  // Steg 1 (Grunnprofil): påkrevde felt → videre
  // -------------------------------------------------------------------------

  test('skal fylle ut grunnprofil og gå videre', async ({ page }) => {
    await page.goto('/onboarding');
    await fillStep1(page);
    await clickNext(page);
    await expectStep(page, 2, 'Personlighet & identitet');
  });

  // -------------------------------------------------------------------------
  // Steg 2 (Personlighet): valideringsporten — CTA deaktivert
  // -------------------------------------------------------------------------

  test('skal blokkere framgang ved tom selfDesc (CTA deaktivert)', async ({ page }) => {
    await page.goto('/onboarding');
    await advanceTo(page, 2);

    // Med tomme felt er CTA-en deaktivert med påminnelsesteksten.
    // (Den røde feilboksen vises ikke — knappen er låst først.)
    const next = page.getByTestId('ob-next');
    await expect(next).toBeDisabled();
    await expect(next).toHaveText('Fyll ut alle påkrevde felt');

    // Fyller påkrevde felt → CTA-en blir aktiv med normalteksten.
    await fillStep2(page);
    await expect(next).toBeEnabled();
    await expect(next).toHaveText('Fortsett til neste steg');
  });

  test('skal gå videre fra steg 2 med gyldig selfDesc', async ({ page }) => {
    await page.goto('/onboarding');
    await advanceTo(page, 2);
    await fillStep2(page);
    await clickNext(page);
    await expectStep(page, 3, 'Livssituasjon');
  });

  // -------------------------------------------------------------------------
  // Steg 3 (Livssituasjon): validering
  // -------------------------------------------------------------------------

  test('skal gå videre fra steg 3 med gyldig responsibilities', async ({ page }) => {
    await page.goto('/onboarding');
    await advanceTo(page, 3);
    await fillStep3(page);
    await clickNext(page);
    await expectStep(page, 4, 'Tilknytning & trygghet');
  });

  // -------------------------------------------------------------------------
  // Back-navigasjon
  // -------------------------------------------------------------------------

  test('skal navigere tilbake med BackButton', async ({ page }) => {
    await page.goto('/onboarding');
    await advanceTo(page, 3);
    await fillStep3(page);
    await clickNext(page);
    await expectStep(page, 4, 'Tilknytning & trygghet');

    await page.getByTestId('ob-back').click();
    await expectStep(page, 3, 'Livssituasjon');
  });

  // -------------------------------------------------------------------------
  // Steg-indikator oppdatering
  // -------------------------------------------------------------------------

  test('skal oppdatere steg-indikatoren ved stegbytte', async ({ page }) => {
    await page.goto('/onboarding');
    await expectStep(page, 1);
    await fillStep1(page);
    await clickNext(page);
    await expectStep(page, 2);
  });
  // -------------------------------------------------------------------------
  // Autosave (localStorage)
  // -------------------------------------------------------------------------

  test('skal autosave inndata til localStorage', async ({ page }) => {
    await page.goto('/onboarding');

    const nameInput = page.locator('input[placeholder="Navn eller kallenavn"]');
    if (await nameInput.count() > 0) {
      await nameInput.fill('AutosaveTest');
    }

    // Vent deterministisk på autosave (debounce 400 ms) — polling i
    // staden for fast timeout (fast timeout flakka på firefox)
    await expect
      .poll(async () => {
        const raw = await page.evaluate(
          () => localStorage.getItem('tosom_onboarding_draft')
        );
        return raw
          ? (JSON.parse(raw) as { identityName?: string }).identityName
          : undefined;
      })
      .toBe('AutosaveTest');
  });

  // -------------------------------------------------------------------------
  // Draft-restaurering (refresh)
  // -------------------------------------------------------------------------

  test('skal restaurera draft etter side-opprettning', async ({ page }) => {
    await page.goto('/onboarding');

    const nameInput = page.locator('input[placeholder="Navn eller kallenavn"]');
    if (await nameInput.count() > 0) {
      await nameInput.fill('DraftTest123');
    }

    // Vent deterministisk på autosave
    await expect
      .poll(async () => {
        const raw = await page.evaluate(
          () => localStorage.getItem('tosom_onboarding_draft')
        );
        return raw
          ? (JSON.parse(raw) as { identityName?: string }).identityName
          : undefined;
      })
      .toBe('DraftTest123');

    // Oppfrisk side
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Sjekk at verdien er restaurert frå localStorage (polling:
    // restaureringa hentar asynkront etter mount)
    await expect.poll(() => nameInput.inputValue()).toBe('DraftTest123');
  });

  // -------------------------------------------------------------------------
  // Hele flyten: alle 13 steg → matching
  //
  // KJØRER SISTE: fullfører onboarding for den delte E2E-brukeren
  // (onboardingComplete=true, profil + kø). Seed-en nullstiller brukeren
  // før neste runde.
  // -------------------------------------------------------------------------

  test('skal fullføre hele 13-stegs onboarding-flyten', async ({ page }) => {
    // 13 steg + ~35 felt + to API-kall — gi margin på sakte maskiner.
    test.setTimeout(180_000);
    await page.goto('/onboarding');

    const fillers: Array<(p: Page) => Promise<void>> = [
      fillStep1, fillStep2, fillStep3, fillStep4,
      fillStep5, fillStep6, fillStep7, fillStep8,
      async () => {}, // Steg 9 (humor): alle felt er valfrie
      fillStep10, fillStep11,
    ];
    for (let step = 1; step <= 11; step++) {
      await expectStep(page, step);
      await fillers[step - 1](page);
      await clickNext(page);
    }

    // Steg 12 (Oppsummering): fortsett
    await expectStep(page, 12, 'Oppsummering');
    await clickNext(page);

    // Siste steg: «Start reisen» lagrer profilen og stiller brukeren i køen.
    await expectStep(page, 13, 'Start reisen');
    await expect(page.getByTestId('ob-next')).toHaveText('Start reisen');
    await page.getByTestId('ob-next').click();
    await expect(page).toHaveURL(/\/matching/, { timeout: 20_000 });
  });
});