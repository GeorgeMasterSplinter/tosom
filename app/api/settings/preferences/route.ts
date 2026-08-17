/**
 * Tosom — User Preferences Endpoint (STEG 8.5)
 *
 * POST/GET /api/settings/preferences
 * Persisterer notifikasjon/språk/tema-innstillinger i Profile.preferences (Json-felt).
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

/**
 * GET: Henter brukerens lagrede preferanser fra Profile.preferences JSON-feltet.
 */
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { preferences: true },
    });

    const prefs = (profile?.preferences as Record<string, unknown>) || {};

    return NextResponse.json({
      language: (prefs.language as string) || 'bokmal',
      theme: (prefs.theme as string) || 'mork',
      notifications: (prefs.notifications as boolean) ?? true,
    });
  } catch (error) {
    console.error('[preferences GET] Feil:', error);
    return NextResponse.json({ error: 'Kunne ikke hente preferanser' }, { status: 500 });
  }
}

/**
 * POST: Oppdaterer brukerens preferanser i Profile.preferences JSON-feltet.
 * Body: { language?: string, theme?: string, notifications?: boolean }
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));

    // Valider input
    const validLanguages = ['bokmal', 'nynorsk', 'english'];
    const validThemes = ['mork', 'premium', 'lys', 'gul'];

    const language = body.language && validLanguages.includes(body.language)
      ? body.language
      : undefined;

    const theme = body.theme && validThemes.includes(body.theme)
      ? body.theme
      : undefined;

    const notifications = typeof body.notifications === 'boolean'
      ? body.notifications
      : undefined;

    // Hent eksisterende preferences eller opprett tom objekt
    const existing = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { preferences: true },
    });

    const currentPrefs = (existing?.preferences as Record<string, unknown>) || {};

    const updatedPrefs: Record<string, unknown> = { ...currentPrefs };
    if (language !== undefined) updatedPrefs.language = language;
    if (theme !== undefined) updatedPrefs.theme = theme;
    if (notifications !== undefined) updatedPrefs.notifications = notifications;

    // Oppdater eller opprett profil med nye preferences
    // Bruk `as any` fordi Prisma sitt Json-typ-system er strengt mot Record<string, unknown>
    const prefsJson = updatedPrefs as any;

    await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: { preferences: prefsJson },
      create: {
        userId: session.user.id,
        preferences: prefsJson,
        age: 0,
      },
    });

    return NextResponse.json({
      success: true,
      language: updatedPrefs.language,
      theme: updatedPrefs.theme,
      notifications: updatedPrefs.notifications,
    });
  } catch (error) {
    console.error('[preferences POST] Feil:', error);
    return NextResponse.json({ error: 'Kunne ikke lagre preferanser' }, { status: 500 });
  }
}