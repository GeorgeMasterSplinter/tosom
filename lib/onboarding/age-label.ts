/**
 * Tosom — Aldersspenn-format for onboarding (LANGUAGE & CLARITY ACT O1)
 *
 * Én kilde for hvordan det valgte aldersspennet (agePrefMin/agePrefMax)
 * vises for brukeren.
 *
 * REV 1.2 (produktbeslutning): agePrefMax = null betyr 99+ — INGEN øvre
 * aldersgrense (matchingen gjør da ingen maks-alder-sjekk). Det renderes
 * som «99+». Endelige verdier renderes alltid som faktisk tall: «21–40».
 */

/** Konverterer en rå verdi til et heltall 1–99 (annet → null). */
function toAgeInt(v: unknown): number | null {
  if (v === undefined || v === null) return null;
  const n = Number(String(v).trim());
  if (!Number.isFinite(n)) return null;
  return Math.trunc(n);
}

/**
 * Formaterer valgt aldersspenn til brukervendt tekst.
 * - Mangler min → nøytral «Ikke valgt» (aldri et falskt intervall).
 * - Eksplisitt null som maks = 99+ (åpen øvre grense) → «35–99+».
 * - Ellers faktisk tall: «21–40».
 */
export function formatAgePrefRange(min: unknown, max: unknown): string {
  const lo = toAgeInt(min);
  if (lo === null) return 'Ikke valgt';
  if (max === null) return `${lo}–99+`;
  const hi = toAgeInt(max);
  if (hi === null) return 'Ikke valgt';
  return `${lo}–${hi}`;
}
