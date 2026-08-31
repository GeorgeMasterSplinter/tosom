/**
 * ToSom — ENGANGS-rute: pålegger presence-migrasjonen på prod-DB (hotfix)
 *
 * Bakgrunn: CI-stegene «prisma migrate deploy» bruker en repo-env som
 * peker på en annen DB, så migrasjonen
 * 20260831175820_presence_last_seen_typing har aldri blitt pålagt prod.
 * Prisma-klienten fra deployen e550849 spør etter
 * User.lastSeenAt/typingUntil, og innlogging, dashboard og onboarding
 * feilet derfor i prod. Denne ruten pålegger migrasjonens eksakte SQL.
 *
 * Bruk (én gang):
 *   curl -X POST https://www.tosom.no/api/db/apply-presence-migration \
 *     -H "x-once-secret: <secret>"
 *
 * Idempotent: sjekker kolonnene før ALTER og skriver
 * _prisma_migrations-raden med den eksakte sjekksummen (fra dev-DB),
 * slik at senere `prisma migrate deploy` ikke kolliderer.
 *
 * Ligg bevisst UTENfor /api/admin (middleware krever der sesjon) —
 * sekret-headeren er den eneste beskyttelsen, og ruten slettes etter bruk.
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const ONCE_SECRET = "b5055383-bb9b-4d8d-a967-d9e2cf77e275-4ffbbb6c";
const MIGRATION_NAME = "20260831175820_presence_last_seen_typing";
const MIGRATION_CHECKSUM =
  "3b9dc1936f4fc6bd89b339b0effe6c16a9336531b7648ca62b35f8d591d5cb26";

export async function POST(req: NextRequest) {
  if (req.headers.get("x-once-secret") !== ONCE_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    // 1) Hvilke kolonner finnes?
    const cols = await prisma.$queryRawUnsafe<
      Array<{ column_name: string }>
    >(
      `SELECT column_name FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'User'
       AND column_name IN ('lastSeenAt', 'typingUntil')`
    );
    const existing = new Set(cols.map((c) => c.column_name));
    const missing: string[] = [];
    if (!existing.has("lastSeenAt")) missing.push('"lastSeenAt" TIMESTAMP(3)');
    if (!existing.has("typingUntil"))
      missing.push('"typingUntil" TIMESTAMP(3)');

    let altered = false;
    if (missing.length > 0) {
      // Eksakt samme SQL som
      // prisma/migrations/20260831175820_presence_last_seen_typing/migration.sql
      await prisma.$executeRawUnsafe(
        `ALTER TABLE "User" ADD COLUMN ${missing.join(", ADD COLUMN ")}`
      );
      altered = true;
    }

    // 2) Bokføring i _prisma_migrations (idempotent) — samme form som
    //    radene Prisma 5.22 skriver, inkludert deterministisk sjekksum.
    const rows = await prisma.$queryRawUnsafe<
      Array<{ migration_name: string }>
    >(
      `SELECT migration_name FROM _prisma_migrations WHERE migration_name = $1`,
      MIGRATION_NAME
    );
    let recorded = false;
    if (rows.length === 0) {
      const id = crypto.randomUUID();
      const now = new Date();
      await prisma.$executeRawUnsafe(
        `INSERT INTO _prisma_migrations
           (id, checksum, finished_at, migration_name, rolled_back_at, logs, started_at)
         VALUES ($1, $2, $3, $4, NULL, NULL, $5)`,
        id,
        MIGRATION_CHECKSUM,
        now,
        MIGRATION_NAME,
        now
      );
      recorded = true;
    }

    // 3) Tilstandsrapport
    const finalCols = await prisma.$queryRawUnsafe<
      Array<{ column_name: string }>
    >(
      `SELECT column_name FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'User'
       AND column_name IN ('lastSeenAt', 'typingUntil')`
    );
    const finalRows = await prisma.$queryRawUnsafe<
      Array<{ migration_name: string }>
    >(
      `SELECT migration_name FROM _prisma_migrations WHERE migration_name = $1`,
      MIGRATION_NAME
    );

    return NextResponse.json({
      ok: true,
      altered,
      recorded,
      columnsPresent: finalCols.map((c) => c.column_name),
      migrationRecorded: finalRows.length === 1,
    });
  } catch (e) {
    console.error("[apply-presence-migration] Feil:", e);
    return NextResponse.json(
      {
        error: "migration failed",
        detail: e instanceof Error ? e.message : String(e),
      },
      { status: 500 }
    );
  }
}