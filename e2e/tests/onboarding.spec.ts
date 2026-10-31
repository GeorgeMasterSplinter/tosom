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

/**
 * PL-08 (D-1): svarer på alle skalaspørsmålene steget krever.
 * Kun ScaleQuestion-gruppene har «Både og (3 av 5)» som nøytralt svar
 * (1–5) — Valgvikt-radioknappene («Må stemme» osv.) ignoreres.
 * Steg uten skalaspørsmål har ingen slike radios og påverkes ikke.
 *
 * Robust mot langsom re-rendering (firefox/Gecko): skalamatrisen kan ikke
 * være ferdig tegnet når antall hentes, så vi klikker på nytt til CTA-en er
 * aktiv. (Chromium/mobil bryter etter én omgang.)
 */
async function answerScales(page: Page) {
  const next = page.getByTestId('ob-next');
  for (let attempt = 0; attempt < 12; attempt++) {
    const radios = page.getByRole('radio', { name: 'Både og (3 av 5)' });
    const count = await radios.count();
    if (count === 0) break; // ingen skalaer på dette steget
    for (let i = 0; i < count; i++) {
      await radios.nth(i).click();
    }
    if (await next.isEnabled().catch(() => false)) break; // skalan er full
    await page.waitForTimeout(150); // gir firefox tid til å rendre ferdig
  }
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

/**
 * Steg 2 (Personlighet & identitet): energyGiver/energyDrainer/pressureReact
 * som valg-grid (LIVSSTIL-2026) + TOSOM_PERSONALITY-skala (PL-08).
 * O2 P1: selfDesc + quirk er fjernet (fritekst-sletting) — ingen lengdefelt.
 */
async function fillStep2(page: Page) {
  await page.getByTestId('ob-energy-giver').getByRole('button', { name: /Dype samtaler/ }).click();
  await page.getByTestId('ob-energy-drainer').getByRole('button', { name: /Store folkemengder/ }).click();
  await page.getByTestId('ob-pressure-react').getByRole('button', { name: /Trekker meg tilbake/ }).click();
  await answerScales(page);
}

/**
 * Steg 3 (Livssituasjon): O2 P1 fjernet de seks dagligdags-gridene
 * (workType/housingType/householdSize/economicStability/responsibilities/
 * dailyRoutine). Livsstil-2026-feltene er valgfrie — ingenting blokkerer
 * steget. Vi tester skjerm-valget (valgfritt).
 */
async function fillStep3(page: Page) {
  await page.getByTestId('ob-l2026-skjerm').getByRole('button', { name: /Moderat/ }).click();
}

/** Steg 4 (Tilknytning & trygghet): fire valg-gridene (LIVSSTIL-2026) + ATTACHMENT-skala (PL-08). */
async function fillStep4(page: Page) {
  await page.getByTestId('ob-safety-need').getByRole('button', { name: /Ærlighet/ }).click();
  await page.getByTestId('ob-insecurity-trigger').getByRole('button', { name: /Ubestemthet/ }).click();
  await page.getByTestId('ob-sadness-need').getByRole('button', { name: /Bare tilstedeværelse/ }).click();
  await page.getByTestId('ob-stress-need').getByRole('button', { name: /Rom til å roe meg/ }).click();
  await answerScales(page);
}
/** Steg 5 (Kjærlighetsspråk & nærhet): fire valg-gridene (giv/mottar, nærhet/avstand). */
async function fillStep5(page: Page) {
  await page.getByTestId('ob-love-give').getByRole('button', { name: /Ord og ros/ }).click();
  await page.getByTestId('ob-love-receive').getByRole('button', { name: /Ord og ros/ }).click();
  await page.getByTestId('ob-closeness-builder').getByRole('button', { name: /Dype samtaler/ }).click();
  await page.getByTestId('ob-distance-creator').getByRole('button', { name: /Stress og press/ }).click();
}

/**
 * Steg 6 (Livsstil & verdier): O2 P1 fjernet «goodEveryday» (fritekst).
 * Kosthold (maks 2) + aktivitet (maks 3) er valgfrie LIVSSTIL-2026-felt — vi
 * tester begge. PVQ10-skala er påkrevd (PL-08).
 */
async function fillStep6(page: Page) {
  await page.getByTestId('ob-l2026-kosthold').getByRole('button', { name: /Mest plantebasert/ }).click();
  await page.getByTestId('ob-l2026-aktivitet').getByRole('button', { name: /Gym og trening/ }).click();
  await answerScales(page);
}

/** Steg 7 (Relasjonsstil): to gridene. */
async function fillStep7(page: Page) {
  await page.getByTestId('ob-relationship-seeking').getByRole('button', { name: /Dating/ }).click();
  await page.getByTestId('ob-closeness-need').getByRole('button', { name: /Balansert/ }).click();
}

/** Steg 8 (Framtid & visjon): tre valg-gridene (LIVSSTIL-2026). */
async function fillStep8(page: Page) {
  await page.getByTestId('ob-future-vision').getByRole('button', { name: /Familie og hjem/ }).click();
  await page.getByTestId('ob-experience-alone').getByRole('button', { name: /Reiser/ }).click();
  await page.getByTestId('ob-experience-together').getByRole('button', { name: /Kos og fellesskap/ }).click();
}

// Steg 9 (Humor & personlighet): ingen tekstfelt — men COMMUNICATION-skala
// er påkrevd (PL-08). Svares med answerScales i fullflyt-testen.

/** Steg 10 (Grenser & behov): to gridene. */
async function fillStep10(page: Page) {
  await page.getByTestId('ob-never-cross').getByRole('button', { name: /Respekt for meg som person/ }).click();
  await page.getByTestId('ob-understand-partner').getByRole('button', { name: /Jeg lytter aktivt/ }).click();
}

/**
 * Steg 11 (Moden nysgjerrighet): O2 P1 fjernet alle fem moden-feltene
 * (intimacySafety/comfortableWith/boundary/nearerType/needsTime). Kun
 * ERQ6-skalaen blokkerer steget (PL-08).
 */
async function fillStep11(page: Page) {
  await answerScales(page);
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

  test('skal blokkere framgang ved ufullstendig steg 2 (CTA deaktivert)', async ({ page }) => {
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

  test('skal gå videre fra steg 2 (personlighet)', async ({ page }) => {
    await page.goto('/onboarding');
    await advanceTo(page, 2);
    await fillStep2(page);
    await clickNext(page);
    await expectStep(page, 3, 'Livssituasjon');
  });

  // -------------------------------------------------------------------------
  // Steg 3 (Livssituasjon): validering
  // -------------------------------------------------------------------------

  test('skal gå videre fra steg 3 (livssituasjon)', async ({ page }) => {
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
  // Steg 1 (Grunnprofil): aldersspenn med default 18–40 (A18) + 99+
  // (LANGUAGE & CLARITY ACT, REV 1.2)
  // 99+ = ingen øvre aldersgrense (lagres som null)
  // -------------------------------------------------------------------------

  test('skal tillate eget endelig aldersspenn (min/max) på steg 1', async ({ page }) => {
    await page.goto('/onboarding');
    await expectStep(page, 1, 'Grunnprofil');

    await page.getByTestId('ob-age-pref-min').fill('25');
    await page.getByTestId('ob-age-pref-max').fill('45');
    await expect(page.getByTestId('ob-age-pref-min')).toHaveValue('25');
    await expect(page.getByTestId('ob-age-pref-max')).toHaveValue('45');

    // 99+ er ikke valgt
    await expect(page.getByTestId('ob-age-pref-99')).toHaveAttribute('aria-pressed', 'false');
  });

  test('skal velge 99+ som maks alder på steg 1 (18–99+ med A18-default)', async ({ page }) => {
    await page.goto('/onboarding');
    await expectStep(page, 1, 'Grunnprofil');

    await page.getByTestId('ob-age-pref-99').click();
    await expect(page.getByTestId('ob-age-pref-99')).toHaveAttribute('aria-pressed', 'true');
    // Feltet vises tomt — 99+ er åpen øvre grense (null), ikke tallet 99.
    await expect(page.getByTestId('ob-age-pref-max')).toHaveValue('');
  });

  test('skal velge eget minimum + 99+ (35–99+)', async ({ page }) => {
    await page.goto('/onboarding');
    await expectStep(page, 1, 'Grunnprofil');

    await page.getByTestId('ob-age-pref-min').fill('35');
    await page.getByTestId('ob-age-pref-99').click();
    await expect(page.getByTestId('ob-age-pref-min')).toHaveValue('35');
    await expect(page.getByTestId('ob-age-pref-99')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('ob-age-pref-max')).toHaveValue('');
  });

  test('skal beholde 99+ etter autosave og reload (save/resume)', async ({ page }) => {
    // Isolasjon: fjern server-draft fra tidligere tests (delte E2E-bruker) —
    // ellers kan asynkron draft-restaurering race med chip-klikket.
    await page.request.delete('/api/onboarding/draft');
    await page.goto('/onboarding');
    await expectStep(page, 1, 'Grunnprofil');

    await page.getByTestId('ob-age-pref-99').click();
    await expect(page.getByTestId('ob-age-pref-99')).toHaveAttribute('aria-pressed', 'true');

    // Vent deterministisk på autosave: draft må inneholde eksplisitt null.
    await expect
      .poll(async () => {
        const raw = await page.evaluate(
          () => sessionStorage.getItem('tosom_onboarding_draft'),
        );
        if (!raw) return undefined;
        return (JSON.parse(raw) as { agePrefMax?: unknown })['agePrefMax'];
      })
      .toBe(null);

    // Oppfrisk siden — 99+ (null) må restaureres, ikke 99/40/blank.
    await page.reload();
    await expect.poll(
      async () => page.getByTestId('ob-age-pref-99').getAttribute('aria-pressed'),
    ).toBe('true');
  });
  // -------------------------------------------------------------------------
  // Autosave (sessionStorage siden PL-17)
  // -------------------------------------------------------------------------

  test('skal autosave inndata til sessionStorage', async ({ page }) => {
    await page.goto('/onboarding');

    const nameInput = page.locator('input[data-testid="ob-name"]');
    if (await nameInput.count() > 0) {
      await nameInput.fill('AutosaveTest');
    }

    // Vent deterministisk på autosave (debounce 400 ms) — polling i
    // staden for fast timeout (fast timeout flakka på firefox)
    await expect
      .poll(async () => {
        const raw = await page.evaluate(
          () => sessionStorage.getItem('tosom_onboarding_draft')
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

    const nameInput = page.locator('input[data-testid="ob-name"]');
    if (await nameInput.count() > 0) {
      await nameInput.fill('DraftTest123');
    }

    // Vent deterministisk på autosave
    await expect
      .poll(async () => {
        const raw = await page.evaluate(
          () => sessionStorage.getItem('tosom_onboarding_draft')
        );
        return raw
          ? (JSON.parse(raw) as { identityName?: string }).identityName
          : undefined;
      })
      .toBe('DraftTest123');

    // Oppfrisk side
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Sjekk at verdien er restaurert frå sessionStorage (polling:
    // restaureringa hentar asynkront etter mount)
    await expect.poll(() => nameInput.inputValue()).toBe('DraftTest123');
  });

  // -------------------------------------------------------------------------
  // A18 (29.10.2026): minimumsalder 21 → 18, default preferanse 18–40
  // Server-side under-18-kø-garde dekkes av __tests__/age18-conversion.test.ts
  // (A18-13/15) — en under-18-profil kan ikke opprettes via støttet flyt,
  // så den veien testes mot API-et, ikke E2E.
  // -------------------------------------------------------------------------

  test('A18: alder 17 blokkerer steg 1 (CTA av, hjelpetekst sier 18)', async ({ page }) => {
    await page.goto('/onboarding');
    await expectStep(page, 1, 'Grunnprofil');

    await page.getByTestId('ob-name').fill('Testbruker');
    await page.getByTestId('ob-age').fill('17');
    await page.getByTestId('ob-gender').getByRole('button', { name: /Mann/ }).click();
    await page.getByTestId('ob-seeking').getByRole('button', { name: /Kvinne/ }).click();
    await page.getByTestId('ob-city').fill('Oslo');
    await page.getByTestId('ob-postal').fill('0150');

    // Alder 17 er under minimumsalder → steget er ikke gyldig, CTA av.
    await expect(page.getByTestId('ob-next')).toHaveText('Fyll ut alle påkrevde felt');
    await expect(page.getByTestId('ob-next')).toBeDisabled();
    // Hjelpeteksten beskriver minimumsalderen som 18 — ingen stamme 21.
    await expect(page.getByText('Må være minst 18')).toBeVisible();
  });

  test('A18: alder 18 godtas (CTA på, kan gå til steg 2)', async ({ page }) => {
    await page.goto('/onboarding');
    await expectStep(page, 1, 'Grunnprofil');

    await fillStep1(page);
    await page.getByTestId('ob-age').fill('18');
    await expect(page.getByTestId('ob-next')).toHaveText('Fortsett til neste steg');
    await clickNext(page);
    await expect(page.getByTestId('ob-step-indicator')).toHaveText(`Steg 2 av ${TOTAL_STEPS}`);
  });

  test('A18: ny bruker får synlig, redigerbar default 18–40 (pre-fill)', async ({ page }) => {
    // Isolasjon: fjern server-draft (delte E2E-bruker) — default gjelder kun
    // når ingen lagret preferanse finnes (D3/D4).
    await page.request.delete('/api/onboarding/draft');
    await page.goto('/onboarding');
    await expectStep(page, 1, 'Grunnprofil');

    // Default er synlig i feltene (ikke skjult) — poll for async restaurering.
    await expect.poll(() => page.getByTestId('ob-age-pref-min').inputValue()).toBe('18');
    await expect(page.getByTestId('ob-age-pref-max')).toHaveValue('40');
    // Hjelpeteksten: foreslått utgangspunkt — aldri «anbefalt»/«best» (D3).
    await expect(page.getByText(/Vi har foreslått et/)).toBeVisible();
    // Brukeren kan endre det (pre-fill er ikke låst).
    await page.getByTestId('ob-age-pref-min').fill('21');
    await expect(page.getByTestId('ob-age-pref-min')).toHaveValue('21');
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
    // Isolasjon: fjern server-draft fra tidligere tests (delte E2E-bruker) —
    // ellers kan asynkron draft-restaurering overskrive 99+-valget (null).
    await page.request.delete('/api/onboarding/draft');
    await page.goto('/onboarding');

    const fillers: Array<(p: Page) => Promise<void>> = [
      // REV 1.2 + A18: fullflyten tester 18–99+ (default min 18 + åpen øvre
      // grense) — oppsummeringen må vise «18–99+» på steg 12.
      async (p: Page) => {
        await fillStep1(p);
        await p.getByTestId('ob-age-pref-99').click();
      },
      fillStep2, fillStep3, fillStep4,
      fillStep5, fillStep6, fillStep7, fillStep8,
      answerScales, // Steg 9 (humor): COMMUNICATION-skala (PL-08)
      fillStep10, fillStep11,
    ];
    for (let step = 1; step <= 11; step++) {
      await expectStep(page, step);
      await fillers[step - 1](page);
      await clickNext(page);
    }

    // Steg 12 (Oppsummering): aldersspennet er 18–99+ (REV 1.2 + A18)
    await expectStep(page, 12, 'Se over før du går videre');
    await expect(page.getByText('18–99+')).toBeVisible();
    await clickNext(page);

    // Siste steg: «Start reisen» lagrer profilen og stiller brukeren i køen.
    await expectStep(page, 13, 'Start reisen');
    await expect(page.getByTestId('ob-next')).toHaveText('Start reisen');
    await page.getByTestId('ob-next').click();
    await expect(page).toHaveURL(/\/matching/, { timeout: 20_000 });
  });
});