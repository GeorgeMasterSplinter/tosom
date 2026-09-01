/**
 * A13: Kartlegger dealbreaker-reason til rejectReasons-nøkkel.
 *
 * Ren funksjon — ingen sideeffekter, testbar uten DB.
 * Treffer ingen kjent form → 'preferanser' (fallback).
 *
 * F2: Flytta fra app/api/cron/matching/rejectReason.ts til lib/matching —
 * scoreRound-kjernen (lib) trengje funksjonen. Gamle importar verkar via
 * re-export fra den gamle staden.
 */

export function mapRejectReason(reason: string | undefined): string {
  if (!reason) return 'preferanser';
  if (reason.startsWith('Kjønnspreferanse')) return 'kjonn';
  if (reason.startsWith('Alderspreferanse')) return 'alder';
  if (reason.startsWith('Modenhets-gap')) return 'modenhetsgap';
  if (reason.startsWith('Inkompatibel livsrytme')) return 'livsrytme';
  if (reason.startsWith('Sikkerhetsnivå')) return 'sikkerhetsniva';
  if (reason.startsWith('Grense brutt')) return 'grenser';
  if (reason.startsWith('For langt bort')) return 'radius';
  // 'Dealbreaker:' og alt ukjent → preferanser
  return 'preferanser';
}
