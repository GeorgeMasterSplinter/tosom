/**
 * ToSom — Matcherunde-watchdog (B5.6)
 *
 * Matcherunden kjører hver lørdag 02:00–04:00 (UTC) — vercel.json:
 * `0 2,3,4 * * 6`. Watchdoggen kjører daglig (på slutten av journey-cron,
 * 00:05 UTC) og avgjør om siste runde ble kjørt.
 *
 * Bakgrunn: gammel 26-timers terskel fyrte hver natt mandag–fredag
 * (ved ukentlig runde går 44–140 timer mellom runde og neste sjekk) —
 * falske alarme. En runde regnes nå som kjørt dersom det finnes en
 * `cron:matching`-logg i tilhørende lørdagsvindu (02:00–05:00 UTC).
 */

/** Rundens starttime (UTC) — første kjøring i cron `0 2,3,4 * * 6`. */
export const SAT_ROUND_START_HOUR = 2;
/** Vinduet slutter (UTC) — 04:00-kjøringen ferdig senest ~04:10 (maxDuration 60 s). */
export const SAT_ROUND_END_HOUR = 5;

/**
 * Mest nylige «lørdag 02:00 UTC» strikt før `now`.
 * UTC gjennom hele — DST har ingen innflytelse.
 */
export function lastSaturdayRoundStart(now: Date): Date {
  for (let i = 1; i <= 8; i++) {
    const candidate = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i, SAT_ROUND_START_HOUR, 0, 0),
    );
    if (candidate.getUTCDay() === 6) return candidate;
  }
  throw new Error('Fant ingen lørdag innenfor 8 døgn');
}

/** True hvis `d` ligger i lørdagsvinduet (lørdag 02:00–05:00 UTC). */
export function inMatchingRoundWindow(d: Date): boolean {
  return (
    d.getUTCDay() === 6 &&
    d.getUTCHours() >= SAT_ROUND_START_HOUR &&
    d.getUTCHours() < SAT_ROUND_END_HOUR
  );
}

/**
 * True hvis matcherunden regnes som uteble: ingen `cron:matching`-logg
 * ligger i vinduet fra og med det siste lørdag 02:00 UTC.
 *
 * Merk: manuell runde (/admin/tools) en ukedag teller IKKE som runden —
 * watchdoggen skal overvåke selve lørdagsrunden.
 */
export function matchingRoundMissed(now: Date, matchingLogs: Date[]): boolean {
  const expected = lastSaturdayRoundStart(now);
  return !matchingLogs.some(
    (log) => log.getTime() >= expected.getTime() && inMatchingRoundWindow(log),
  );
}
