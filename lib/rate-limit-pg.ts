/**
 * ToSom — Dag 12: Postgres-basert delt rate limiting
 *
 * Atomisk UPSERT via `INSERT ... ON CONFLICT ... RETURNING` så at
 * telleren deles mellom flere serverless-instanser.
 * Fail-open ved DB-feil (samme pattern som Redis-fail-open).
 */

import { prisma } from '@/lib/prisma'

/* ========================
   TYPES
   ======================== */

export interface RateLimitResult {
  ok: boolean
  remaining: number
}

/* ========================
   CORE
   ======================== */

/**
 * Atomisk rate-limit-teller i Postgres.
 *
 * - Ny nøkkel → INSERT med count=1, resetAt=now+windowSec.
 * - Eksisterende nøkkel innenfor vinduet → count+=1.
 * - Eksisterende nøkkel utløpt → nuller count til 1, sett nytt resetAt.
 *
 * Én SQL-statement = ingen race condition mellom instanser.
 */
export async function pgCheck(
  key: string,
  max: number,
  windowSec: number,
): Promise<RateLimitResult> {
  try {
    // Atomisk UPSERT med RETURNING.
    // CASE sjekker om vinduet har utløpt — da nuller count.
    const rows = await prisma.$queryRaw<Array<{ count: number }>>`
      INSERT INTO "RateLimitCounter" ("key", "count", "resetAt")
      VALUES (${key}, 1, now() + make_interval(secs => ${windowSec}))
      ON CONFLICT ("key") DO UPDATE
      SET
        "count"   = CASE
                       WHEN "RateLimitCounter"."resetAt" <= now() THEN 1
                       ELSE "RateLimitCounter"."count" + 1
                     END,
        "resetAt" = CASE
                       WHEN "RateLimitCounter"."resetAt" <= now()
                         THEN now() + make_interval(secs => ${windowSec})
                       ELSE "RateLimitCounter"."resetAt"
                     END
      RETURNING "count"
    `

    const count = rows[0]?.count ?? 1
    return { ok: count <= max, remaining: Math.max(0, max - count) }
  } catch (e) {
    // Fail-open — rate limiting skal aldri velte en request
    console.error('[rate-limit-pg] Postgres error:', e)
    return { ok: true, remaining: max }
  }
}

/* ========================
   CLEANUP
   ======================== */

/**
 * Fjerner utløpte tellere. Skal kjøres periodisk (f.eks. i cron).
 * Returnerer antall slettede rader.
 */
export async function cleanupStale(): Promise<number> {
  try {
    const result = await prisma.$executeRaw`
      DELETE FROM "RateLimitCounter"
      WHERE "resetAt" < now() - interval '1 hour'
    `
    return Number(result)
  } catch (e) {
    console.error('[rate-limit-pg] cleanupStale error:', e)
    return 0
  }
}
