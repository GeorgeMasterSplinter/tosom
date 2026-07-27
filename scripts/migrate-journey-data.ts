// scripts/migrate-journey-data.ts
// Migrerer eksisterande JourneyProgress-data til ConversationJourney-modellen
import { PrismaClient, JourneyPhase } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Startar JourneyData-migrasjon...');

  // 1. Hent alle JourneyProgress-rader
  const journeys = await prisma.journeyProgress.findMany({
    include: { user: true },
  });

  if (journeys.length === 0) {
    console.log('✅ Ingen eksisterande JourneyProgress-data. Ingen mapping naudsynt.');
    return;
  }

  console.log(`📊 Funne ${journeys.length} JourneyProgress-rader som skal migrerast.`);

  for (const jp of journeys) {
    // Finn conversation knytt til denne brukaren
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { userAId: jp.userId },
          { userBId: jp.userId },
        ],
      },
    });

    for (const conv of conversations) {
      // Sjekk om ConversationJourney allereie eksisterer
      const existing = await prisma.conversationJourney.findUnique({
        where: { conversationId: conv.id },
      });

      if (existing) {
        console.log(`  ⏭️  Conversation ${conv.id} har allereie ConversationJourney — hoppar over`);
        continue;
      }

      // Map JourneyPhase → JourneyState
      const mapToState = (phase: JourneyPhase): 'NOT_STARTED' | 'IN_PROGRESS' => {
        if (phase === JourneyPhase.EARLY) return 'NOT_STARTED';
        return 'IN_PROGRESS';
      };

      await prisma.conversationJourney.create({
        data: {
          conversationId: conv.id,
          userAProgress: mapToState(jp.phase),
          userBProgress: mapToState(jp.phase),
          day: jp.day,
          completedDaysA: jp.completedDays,
          completedDaysB: jp.completedDays,
          phase: jp.phase,
          startedAt: jp.startedAt,
        },
      });

      console.log(`  ✓ Migrert conversation ${conv.id} (dag ${jp.day}, fase ${jp.phase})`);
    }
  }

  console.log('✅ JourneyData-migrasjon fullført!');
}

main()
  .catch((e) => {
    console.error('❌ Feil under migrasjon:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());