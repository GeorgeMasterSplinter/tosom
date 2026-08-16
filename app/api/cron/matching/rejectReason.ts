/**
 * A13: Kartlegger dealbreaker-reason til rejectReasons-nøkkel.
 *
 * Ren funksjon — ingen sideeffekter, testbar uten DB.
 * Treffer ingen kjent form → 'preferanser' (fallback).
 *
 * Brukes av route.ts og Sjekk-9-testen. Ikke en rute — kun et modul.
 */

export function mapRejectReason(reason: string | undefined): string {
  if (!reason) return 'preferanser';
  if (reason.startsWith('Modenhets-gap')) return 'modenhetsgap';
  if (reason.startsWith('Inkompatibel livsrytme')) return 'livsrytme';
  if (reason.startsWith('Sikkerhetsnivå')) return 'sikkerhetsniva';
  if (reason.startsWith('Grense brutt')) return 'grenser';
  if (reason.startsWith('For langt bort')) return 'radius';
  // 'Dealbreaker:' og alt ukjent → preferanser
  return 'preferanser';
}