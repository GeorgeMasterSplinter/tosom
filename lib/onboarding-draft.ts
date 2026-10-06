/**
 * PL-17 (V-12) — Onboarding-utkast: felles nøkkel + rydding.
 *
 * Utkastet (profilsvar) holdes i sessionStorage (per fane) og forsvinner
 * når fanen stenges. Server-utkastet (WP2, POST/DELETE /api/onboarding/draft)
 * er hovedkilden; sessionStorage er bare hurtigbuffer innenfor økten.
 * clearOnboardingDraft() kjøres ved utlogging (innstillinger +
 * onboarding-layout) og sletter også gammelt localStorage-utkast.
 */

export const ONBOARDING_DRAFT_KEY = 'tosom_onboarding_draft';

/**
 * Tømmer det lokale utkastet — både sessionStorage (gjeldende) og
 * eventuelle gamle localStorage-verdier fra før PL-17.
 */
export function clearOnboardingDraft(): void {
  try {
    sessionStorage.removeItem(ONBOARDING_DRAFT_KEY);
  } catch { /* ignore */ }
  try {
    localStorage.removeItem(ONBOARDING_DRAFT_KEY);
  } catch { /* ignore */ }
}