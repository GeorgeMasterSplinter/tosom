/**
 * ToSom — Admin: Kjønn og ventekø 📊
 *
 * Samlet statistikk for kjønnfordeling og ventekø (til admin-panelets
 * Analytics-side). Kjønn lagres i Profile.lifeSituation.gender (Json) og
 * normaliseres med normalizeGender() — samme kilde som matchemotoren.
 *
 * Kun for admin (krever admin_token eller session med admin-role).
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/requireAuth';
import { normalizeGender } from '@/lib/matching/dealbreaker';

export const dynamic = 'force-dynamic';

type GenderBucket = 'man' | 'kvinne' | 'annen' | 'ukjent';

interface Row {
  createdAt: Date;
  journeyState: string;
  lastMatchAt: Date | null;
  gender: GenderBucket;
}

/** Teller antall per kjønn-bucket (pluss total). */
function tally(list: Row[]): { man: number; kvinne: number; annen: number; ukjent: number; total: number } {
  const t = { man: 0, kvinne: 0, annen: 0, ukjent: 0 };
  for (const r of list) t[r.gender] += 1;
  return { ...t, total: t.man + t.kvinne + t.annen + t.ukjent };
}

/** Normaliserer rå kjønn-verdi fra onboarding → bucket (mangler/ukjent → «ukjent»). */
function genderOf(lifeSituation: unknown): GenderBucket {
  const raw =
    lifeSituation && typeof lifeSituation === 'object'
      ? (lifeSituation as { gender?: unknown }).gender
      : null;
  return normalizeGender(raw) ?? 'ukjent';
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const users = await prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        createdAt: true,
        journeyState: true,
        lastMatchAt: true,
        profile: { select: { lifeSituation: true } },
      },
    });

    const rows: Row[] = users.map((u) => ({
      createdAt: u.createdAt,
      journeyState: u.journeyState,
      lastMatchAt: u.lastMatchAt,
      gender: genderOf(u.profile?.lifeSituation),
    }));

    // Total kjønnfordeling blant alle ikke-slettede brukere
    const registered = tally(rows);

    // Siste 12 rullende 7-dagers-vinduer — nye registreringer per kjønn
    const WEEKS = 12;
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const weekly: {
      weekStart: string;
      man: number;
      kvinne: number;
      annen: number;
      ukjent: number;
      total: number;
    }[] = [];
    for (let w = WEEKS - 1; w >= 0; w--) {
      const end = now - w * weekMs;
      const start = end - weekMs;
      const inWeek = rows.filter((r) => {
        const t = r.createdAt.getTime();
        return t >= start && t < end;
      });
      weekly.push({ weekStart: new Date(start).toISOString(), ...tally(inWeek) });
    }

    // Ventekø nå (journeyState = QUEUED), fordelt på kjønn
    const queueNow = tally(rows.filter((r) => r.journeyState === 'QUEUED'));

    // Sitter i ventekø uten match: i ventekø og aldri har fått match
    const queueNeverMatched = tally(
      rows.filter((r) => r.journeyState === 'QUEUED' && r.lastMatchAt === null)
    );

    // Fordeling per journeyState (full kontekst)
    const journeyStates: Record<string, number> = {
      IDLE: 0,
      QUEUED: 0,
      MATCHED: 0,
      ON_JOURNEY: 0,
      COMPLETED: 0,
    };
    for (const r of rows) journeyStates[r.journeyState] = (journeyStates[r.journeyState] ?? 0) + 1;

    return NextResponse.json({
      success: true,
      registered,
      weekly,
      queueNow,
      queueNeverMatched,
      journeyStates,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[AdminGenderQueue] Kunne ikke hente statistikk:', error);
    return NextResponse.json({ error: 'Kunne ikke hente statistikk' }, { status: 500 });
  }
}
