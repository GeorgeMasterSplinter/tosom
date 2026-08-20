/**
 * Tosom — Indikatorbetydning
 *
 * Hver indikator får en forklaring og en handlingssetning.
 * Tersklene selv ligger i StatusBadge.tsx og gjenbrukes derfra.
 */

import type { Severity } from './StatusBadge';

export interface IndicatorMeaning {
  /** Hva indikatoren måler — vises som hjelpetekst */
  explains: string;
  /** Hva du skal gjøre, gitt severity. Null = ingen handling. */
  action: Record<Severity, string | null>;
}

export const INDICATOR_MEANING: Record<string, IndicatorMeaning> = {
  lastMatchRound: {
    explains: 'Tid siden forrige matcherunde. Runden går natt til lørdag.',
    action: {
      ok: null,
      warn: 'Runden nærmer seg å bli forsinket. Sjekk cron i Status.',
      critical: 'Runden har ikke kjørt. Sjekk cron, og kjør manuelt fra Verktøy.',
    },
  },
  queueSize: {
    explains: 'Antall personer som venter på match i neste runde.',
    action: {
      ok: null,
      warn: 'Få i kø. Runden gir færre matcher enn den kunne.',
      critical: 'Ingen i kø. Send flere invitasjoner.',
    },
  },
  roundDuration: {
    explains: 'Hvor lenge forrige matcherunde brukte på å fullføre.',
    action: {
      ok: null,
      warn: 'Runden bruker lengre tid enn normalt. Noter tallet.',
      critical: 'Runden er treg. Noter tallet — dette er data til tuning, ikke en hendelse.',
    },
  },
  openReports: {
    explains: 'Rapporter fra brukere som venter på behandling.',
    action: {
      ok: null,
      warn: 'Noen har meldt fra. Behandle i dag.',
      critical: 'Flere ubehandlede rapporter. Behandle nå.',
    },
  },
  errorsLast24h: {
    explains: 'Feil logget av systemet det siste døgnet.',
    action: {
      ok: null,
      warn: 'Flere feil enn vanlig. Se Systemlogg.',
      critical: 'Mange feil. Finn mønsteret i Systemlogg før du gjør noe annet.',
    },
  },
  freeQuota: {
    explains: 'Forbruk mot gratiskvoten på eksterne tjenester.',
    action: {
      ok: null,
      warn: 'Kvoten nærmer seg. Planlegg oppgradering.',
      critical: 'Kvoten er nesten brukt opp. Oppgrader før den treffer taket.',
    },
  },
  dbConnections: {
    explains: 'Andel av databaseforbindelser i bruk.',
    action: {
      ok: null,
      warn: 'Forbindelsene fylles opp. Følg med.',
      critical: 'Databasen går snart tom for forbindelser.',
    },
  },
  errorRate5xx: {
    explains: 'Serverfeil den siste timen.',
    action: {
      ok: null,
      warn: 'Enkelte serverfeil. Se Systemlogg.',
      critical: 'Vedvarende serverfeil. Undersøk umiddelbart.',
    },
  },
};

/** Handlingssetning for en indikator, eller null når alt er som det skal. */
export function actionFor(key: string, severity: Severity): string | null {
  return INDICATOR_MEANING[key]?.action[severity] ?? null;
}

/** Kort forklaring av hva indikatoren måler. */
export function explainFor(key: string): string {
  return INDICATOR_MEANING[key]?.explains ?? '';
}

/** Verste severity i en samling. Rød slår gul, gul slår grønn. */
export function worstSeverity(list: Severity[]): Severity {
  if (list.includes('critical')) return 'critical';
  if (list.includes('warn')) return 'warn';
  return 'ok';
}