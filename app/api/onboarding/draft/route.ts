/**
 * Tosom — API: Onboarding Draft Autosave (STEG 5.3 / B2.2)
 *
 * POST /api/onboarding/draft
 * Lagrer delvis onboarding-data på serveren slik at brukeren ikke mister
 * fremdrift ved bytte av enhet eller sletting av nettleser. Serveren er
 * sannhets-kilden; localStorage er kun hurtigbuffer.
 *
 * GET /api/onboarding/draft
 * Henter siste lagrede draft fra serveren.
 *
 * DELETE /api/onboarding/draft
 * Sletter draften (kald av onboarding-flowen når profilen er fullført).
 *
 * WP2 (2026-08-24): Draften bor nå i Profile.onboardingDraft ({ step, data })
 * — et eget felt. Tidligere delte den Profile.deepProfileData, samme kolonne
 * som /api/profile/setup skriver strukturert matching-data i, så draft og
 * profil trappet over hverandre (kritisk datatak: psychometrics,
 * wantsChildren m.m. ble slettet ved draft-autosave). Med eget felt kan de
 * aldri kollidere, og matching-motoren leser aldri halvdata.
 */

import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth/session';
import { pgCheck } from '@/lib/rate-limit-pg';

export const dynamic = 'force-dynamic';

// B-4: Rate-limit-tak per bruker (mønster fra A5).
const ONBOARDING_DRAFT_RATE_MAX = 120;
const ONBOARDING_DRAFT_RATE_WINDOW_SEC = 60;

/** Lagret form for onboardingDraft. */
interface DraftPayload {
  step: number;
  data: Record<string, unknown>;
}

async function requireUserId(): Promise<string | null> {
  const session = await getServerSession();
  return session?.user?.id ?? null;
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // B-4: Rate limiting per bruker (mønster fra A5, fail-open).
    const draftLimit = await pgCheck(
      `onboarding:draft:${userId}`,
      ONBOARDING_DRAFT_RATE_MAX,
      ONBOARDING_DRAFT_RATE_WINDOW_SEC
    );
    if (!draftLimit.ok) {
      return NextResponse.json(
        { error: 'Du lagrer for ofte. Vent et øyeblikk.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const rawStep = body?.step;
    const rawData = body?.data;

    // Defensivt: aksepter kun den kjente formen — autosave må ikke kunne
    // skrive søppel i draften (samme filosofi som Zod i setup-ruten).
    if (rawData == null || typeof rawData !== 'object' || Array.isArray(rawData)) {
      return NextResponse.json({ error: 'Ugyldig draft' }, { status: 400 });
    }
    const step =
      typeof rawStep === 'number' && Number.isFinite(rawStep)
        ? Math.max(0, Math.min(12, Math.floor(rawStep)))
        : 0;

    // STEG 13.2 (beholdt): Profile.age er NOT NULL — placeholder 0 for
    // brukere uten Profile-rad; /api/profile/setup skriver den sanne alderen.
    const ageNum = Math.max(0, Math.floor(Number((rawData as { age?: unknown }).age)) || 0);

    const draft: DraftPayload = { step, data: rawData as Record<string, unknown> };

    await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        age: ageNum,
        onboardingDraft: draft as unknown as Prisma.InputJsonValue,
      },
      update: {
        onboardingDraft: draft as unknown as Prisma.InputJsonValue,
      },
    });

    return NextResponse.json({ ok: true, step });
  } catch (err) {
    console.error('[onboarding/draft] save failed:', err);
    return NextResponse.json(
      { error: 'Kunne ikke lagre draft' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { onboardingDraft: true },
    });

    const draft = profile?.onboardingDraft as unknown as DraftPayload | null;
    if (!draft || typeof draft !== 'object' || draft.data == null) {
      return NextResponse.json({ data: null, step: null });
    }

    return NextResponse.json({
      data: draft.data,
      step: typeof draft.step === 'number' ? draft.step : null,
    });
  } catch (err) {
    console.error('[onboarding/draft] load failed:', err);
    return NextResponse.json(
      { error: 'Kunne ikke laste draft' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await requireUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Idempotent: ingen profil eller allerede tom draft → ok
    // Prisma.DbNull = database-NULL (ikke JSON-null) for Json?-felt
    await prisma.profile.updateMany({
      where: { userId },
      data: { onboardingDraft: Prisma.DbNull },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[onboarding/draft] delete failed:', err);
    return NextResponse.json(
      { error: 'Kunne ikke slette draft' },
      { status: 500 }
    );
  }
}
