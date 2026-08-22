/**
 * Tosom — Metrikker
 *
 * Skriver til to steder gjennom ett kall:
 *   1. Vercel Custom Metrics — grafer og Query Builder
 *   2. SystemLog — historikk, SQL, admin-panelet
 *
 * Regler:
 *   – Aldri kast. En metrikk skal ikke velte en forespørsel.
 *   – Aldri PII. Kun kategorier og tall i attributter.
 *   – Aldri vent. Kallene er void.
 */

import prisma from '@/lib/prisma';

/** Enheter vi måler i. */
export type MetricUnit = 'ms' | 'count' | 'days' | 'bytes' | 'percent' | 'points';

export interface MetricTags {
  [key: string]: string | number;
}

/** Vercel-kallet isoleres her. Slås av ved migrasjon. */
async function sendToVercel(
  name: string,
  value: number,
  tags: MetricTags,
): Promise<void> {
  try {
    const { metric } = await import('@vercel/functions');
    const attrs: Record<string, string> = {};
    for (const [k, v] of Object.entries(tags)) {
      attrs[k] = String(v);
    }
    metric(name, value, attrs);
  } catch {
    // Utenfor Vercel, eller pakken mangler. Stille.
  }
}

/** Skriver til SystemLog med fast struktur, slik at alt kan aggregeres. */
async function sendToDatabase(
  name: string,
  value: number,
  unit: MetricUnit,
  tags: MetricTags,
): Promise<void> {
  try {
    await prisma.systemLog.create({
      data: {
        level: 'INFO',
        module: 'metric',
        message: name,
        metadata: { metric: name, value, unit, ...tags },
      },
    });
  } catch {
    // Databasen skal aldri stoppe en forespørsel på grunn av en metrikk.
  }
}

/**
 * Registrer en måling.
 * Kalles uten await — den skal aldri forsinke svaret til brukeren.
 */
export function recordMetric(
  name: string,
  value: number,
  unit: MetricUnit = 'count',
  tags: MetricTags = {},
): void {
  void sendToVercel(name, value, tags);
  void sendToDatabase(name, value, unit, tags);
}

/** Registrer en hendelse som har skjedd én gang. */
export function recordEvent(name: string, tags: MetricTags = {}): void {
  recordMetric(name, 1, 'count', tags);
}

/**
 * Mål hvor lang tid noe tar.
 * Måler også når funksjonen kaster, med outcome: 'error'.
 */
export async function recordTiming<T>(
  name: string,
  fn: () => Promise<T>,
  tags: MetricTags = {},
): Promise<T> {
  const started = Date.now();
  try {
    const result = await fn();
    recordMetric(name, Date.now() - started, 'ms', { ...tags, outcome: 'ok' });
    return result;
  } catch (err) {
    recordMetric(name, Date.now() - started, 'ms', { ...tags, outcome: 'error' });
    throw err;
  }
}