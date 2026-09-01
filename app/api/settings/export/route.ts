/**
 * Tosom — Data Export (STEG C5)
 *
 * GET /api/settings/export
 * GDPR art. 15 (tilgang) og art. 20 (dataportabilitet).
 *
 * Returnerer et menneskelesbart JSON-uttrekk (norske nøkkelord) med
 * brukarens personopplysningar: konto, profil (inkl. dypprofil),
 * preferansar, reiser, egne meldinger, varslar og egne rapportar.
 *
 * Kun brukarens eige data. Interne ID-ar (cuid) inkluderast aldri —
 * uttrekket skal være sjølvforklarande ved levering.
 * Rate-limitet via enkel teller.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

// Enkel rate-limiter (in-memory)
const exportRateLimit = new Map<string, number[]>();

function checkExportLimit(userId: string): boolean {
  const now = Date.now();
  const timestamps = exportRateLimit.get(userId) || [];
  const recent = timestamps.filter((t) => now - t < 300_000); // 5 minutter
  if (recent.length >= 1) return false; // Maks 1 export per 5 min
  recent.push(now);
  exportRateLimit.set(userId, recent);
  return true;
}

/* ═══════════════════════════════════════
   NORSKE ETIKETTER
   ═══════════════════════════════════════ */

const messageTypeLabels: Record<string, string> = {
  user: 'Tekstmelding',
  image: 'Bilde',
  system: 'Systemmelding',
  continue_choice: 'Valg',
};

const reportCategoryLabels: Record<string, string> = {
  HARASSMENT: 'Uønsket atferd',
  INAPPROPRIATE: 'Upassende innhold',
  SPAM: 'Spam',
  FAKE_PROFILE: 'Falsk profil',
  OTHER: 'Annet',
};

const reportStatusLabels: Record<string, string> = {
  OPEN: 'Mottatt',
  REVIEWED: 'Gjennomgått',
  ACTIONED: 'Iverksett',
  DISMISSED: 'Avvist',
};

const phaseLabels: Record<string, string> = {
  EARLY: 'Bryt isen',
  BUILDING_TRUST: 'Bygg tillit',
  DEEPER: 'Dypere samtaler',
  CHECKIN: 'Sjekk inn',
};

function iso(d: Date | string | null | undefined): string | null {
  if (!d) return null;
  return new Date(d).toISOString();
}

export async function GET(req: NextRequest) {
  try {
    // 1. Auth
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Uautorisert' }, { status: 401 });
    }

    const userId = session.user.id;

    // 2. Rate limiting
    if (!checkExportLimit(userId)) {
      return NextResponse.json(
        { error: 'For hyppig export. Vent 5 minutter.' },
        { status: 429 }
      );
    }

    // 3. Hent all persondata
    const [user, profile, messages, journeys, notifications, myReports] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          email: true,
          name: true,
          phone: true,
          phoneVerified: true,
          verified: true,
          createdAt: true,
          termsAcceptedAt: true,
        },
      }),
      prisma.profile.findUnique({ where: { userId } }),
      prisma.message.findMany({
        where: { senderId: userId },
        select: { content: true, type: true, createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.journeyProgress.findMany({
        where: { userId },
        include: { milestones: true },
      }),
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      prisma.report.findMany({
        where: { reporterId: userId },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    // 4. Bygg menneskelesbart uttrekk (norske nøkkelord, ingen interne ID-ar)
    const firstName = profile?.firstName || user?.name || user?.email?.split('@')[0] || 'bruker';
    const safeFileName = firstName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/å/g, 'a')
      .replace(/æ/g, 'ae')
      .replace(/ø/g, 'o')
      .replace(/[^a-z0-9-]/g, '-');

    const exportData = {
      Dokument: 'ToSom — uttrekk av personopplysninger',
      Grunnlag:
        'GDPR art. 15 (rett til innsyn) og art. 20 (dataportabilitet). Dette uttrekket inneholder alle personopplysninger ToSom behandler om deg.',
      Eksportert: new Date().toISOString(),

      Konto: {
        'Navn': user?.name || null,
        'E-post': user?.email,
        'Telefon': user?.phone || null,
        'Telefon bekreftet': user?.phoneVerified ?? false,
        'Identitet verifisert': user?.verified ?? false,
        'Medlem siden': iso(user?.createdAt),
        'Vilkår godkjent': iso(user?.termsAcceptedAt),
      },

      Profil: profile
        ? {
            'Fornavn': profile.firstName || null,
            'Etternavn': profile.lastName || null,
            'Alder': profile.age,
            'Kallenavn på ToSom': profile.identityName || null,
            'Om meg': profile.bio || null,
            'Interesser': profile.interests?.length ? profile.interests : null,
            'Postnummer': profile.postalCode || null,
            'Posisjon (utledet fra postnummer)':
              profile.latitude != null && profile.longitude != null
                ? { breddegrad: profile.latitude, lengdegrad: profile.longitude }
                : null,
            'Profilbilde (URL)': profile.photoUrl || null,
            'Relasjonsstil': profile.relationshipStyle || null,
            'Livssituasjon': profile.lifeSituation ?? null,
            'Livsstil': profile.lifestyle ?? null,
            'Personlighet': profile.personality ?? null,
            'Kommunikasjon': profile.communication ?? null,
            'Nærhet og intimitet': profile.intimacy ?? null,
            'Framtidsbilder': profile.futureVision ?? null,
            'Grenser': profile.boundaries ?? null,
            'Emosjonelle behov': profile.emotionalNeeds ?? null,
            'Sist oppdatert': iso(profile.updatedAt),
          }
        : null,

      Preferanser: profile?.preferences ?? null,

      Reiser: journeys.map((j) => ({
        'Fase': phaseLabels[j.phase] || j.phase,
        'Dag': j.day,
        'Startet': iso(j.startedAt),
        'Avsluttet': iso(j.endedAt),
        'Fullført': Boolean(j.completedAt),
        'Milepæler': j.milestones.map((ml) => ({
          'Dag': ml.day,
          'Tittel': ml.title,
          'Sammendrag': ml.summary,
        })),
      })),

      'Egne meldinger': messages.map((m) => ({
        'Tidspunkt': iso(m.createdAt),
        'Type': messageTypeLabels[m.type] || m.type,
        'Innhold': m.type === 'image' ? '[Bilede]' : m.content,
      })),

      Varsler: notifications.map((n) => ({
        'Tidspunkt': iso(n.createdAt),
        'Melding': n.message,
        'Lest': Boolean(n.readAt),
      })),

      'Egne rapporter': myReports.map((r) => ({
        'Tidspunkt': iso(r.createdAt),
        'Kategori': reportCategoryLabels[r.category] || r.category,
        'Beskrivelse': r.description || null,
        'Status': reportStatusLabels[r.status] || r.status,
      })),
    };

    // 5. Lever som JSON-fil (pretty-print, norsk filnavn)
    const json = JSON.stringify(exportData, null, 2);
    return new Response(json, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="tosom-personopplysninger-${safeFileName}.json"`,
      },
    });
  } catch (error) {
    console.error('[export] Feil:', error);
    return NextResponse.json({ error: 'Kunne ikke eksportere data' }, { status: 500 });
  }
}