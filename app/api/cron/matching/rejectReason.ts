/**
 * A13: Re-export for bakoverkompatibilitet.
 * Implementasjonen bur i lib/matching/rejectReason.ts (F2: scoreRound-kjernen
 * i lib trenger funksjonen). Ikke en rute — kun en modul.
 */

export { mapRejectReason } from '@/lib/matching/rejectReason';