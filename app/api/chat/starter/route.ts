/**
 * ToSom — AI Chatstarter API
 * 
 * Genererer startmeldingar basert på match-data.
 * Bruk: POST /api/chat/starter med { matchId }
 */

import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';

interface AiMessage {
  id: string;
  content: string;
  isSuggestion: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Ikke autentisert' }, { status: 401 });
    }

    const body = await req.json();
    const { matchId } = body;

    if (!matchId) {
      return NextResponse.json({ error: 'Manglar matchId' }, { status: 400 });
    }

    // Hent match med all nødvendig info
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        userA: {
          select: {
            id: true,
            profile: { select: { identityName: true, keywords: true, communication: true, values: true } },
          },
        },
        userB: {
          select: {
            id: true,
            profile: { select: { identityName: true, keywords: true, communication: true, values: true } },
          },
        },
      },
    });

    if (!match) {
      return NextResponse.json({ error: 'Fant ikkje match' }, { status: 404 });
    }

    // Finn deg og den andre
    const youId = session.user.id;
    const you = match.userA.id === youId ? match.userA : match.userB;
    const other = match.userA.id === youId ? match.userB : match.userA;

    if (!you?.profile || !other?.profile) {
      return NextResponse.json({ error: 'Manglar profilinfo' }, { status: 400 });
    }

    const youName = you.profile.identityName || 'Du';
    const otherName = other.profile.identityName || 'Din match';
    const strongArea = determineStrongArea(match);

    // Generer startmeldingar basert på sterke område
    const starters = generateStarterMessages(strongArea, you, other, youName, otherName);

    return NextResponse.json({ starters });
  } catch (error) {
    console.error('POST /api/chat/starter feil:', error);
    return NextResponse.json({ error: 'Kunne ikke generere startmelding' }, { status: 500 });
  }
}

function determineStrongArea(match: any): string {
  const scores = (match.explanation as any)?._scores || {};
  const n = (v: unknown) => (typeof v === 'number' ? v : 0);

  const pairs: [string, number][] = [
    ['verdier', n(scores.fremtid) || n(scores.livsstil) || 0],
    ['kommunikasjon', n(scores.kommunikasjon) || 0],
    ['trygghet', n(scores.tilknytning) || n(scores.kjaerlighet) || 0],
    ['fremtid', n(scores.fremtid) || 0],
    ['leik', n(scores.humor) || 0],
  ];
  pairs.sort((a, b) => b[1] - a[1]);
  return pairs[0][0];
}

function generateStarterMessages(
  strongArea: string,
  you: any,
  other: any,
  youName: string,
  otherName: string,
): AiMessage[] {
  const templates: Record<string, { question: string; context: string }[]> = {
    verdier: [
      {
        question: `Hei ${otherName}! 🌟`,
        context: `Eg las at vi begge set stor pris på ${you.profile.keywords?.slice(0, 2).join(' og ') || 'dype samtalar'}. Kva er eit verdi du ikkje kan leve utan?`,
      },
      {
        question: `Vet du hva som er mest viktig for deg?`,
        context: `Eg tenkjer på kva verdiar vi begge deler. Eg trur ${youName} og ${otherName} har mykje til felles på det feltet.`,
      },
    ],
    kommunikasjon: [
      {
        question: `Eg merka noe interessant om oss to!`,
        context: `Vi har veldig komplementære kommunikasjonsstilar. Eg er mer ${you.profile.communication?.style || 'reflekterande'}, medan du kanskje er meir ${other.profile.communication?.style || 'direkte'}?`,
      },
      {
        question: `Skal vi utforska hvordan vi snakkar together?`,
        context: `Eg les at vi begge verdset ${you.profile.keywords?.slice(0, 2).join(', ') || 'ekte samvær'}. Kva er din måte å vise at du bryr?`,
      },
    ],
    trygghet: [
      {
        question: `Eg trivst godt med tanken på deg`,
        context: `Vårt resonansmønster viser at vi begge verdset trygghet i relasjonar. Kva betyr trygheit for deg?`,
      },
      {
        question: `Kan eg fortelje deg noko fint eg oppdaga om oss?`,
        context: `Dere har begge ein sterk evne til å gi kjærlheit på ein måte som betyr mykje. Kva er din favorittmåte å visa omsorg?`,
      },
    ],
    fremtid: [
      {
        question: `Eg drømmer om liknande ting!`,
        context: `Eg såg at vi begge har eit sterkt ønske om ${you.profile.values?.futureVision?.topValue || 'nåværing'}. Kva er din største fremtidsdrøm?`,
      },
      {
        question: `Tenk om vi laga ein drøm saman?`,
        context: `Vi har begge sett oss mål om ${you.profile.values?.futureVision?.lifestyleGoal || 'å byggje noko meiningsfullt'}. Kva er ditt mål?`,
      },
    ],
    leik: [
      {
        question: `Eg må le! 😄`,
        context: `Vi har begge sans for humor og leik! Eg ser at vi begge set pris på ${you.profile.keywords?.slice(0, 2).join(' og ') || 'lettvinde'}. Kva får deg til å le?`,
      },
      {
        question: `Har du lyst å leita etter humor i kvardagen?`,
        context: `Eg trur vi to kan ha masse å leita av med kvarandre. Kva er den beste vitsen du veit?`,
      },
    ],
  };

  const areaTemplates = templates[strongArea] || templates['verdier'];

  return areaTemplates.map((t, i) => ({
    id: `starter-${i}`,
    content: `${t.question}\n\n${t.context}`,
    isSuggestion: true,
  }));
}