/**
 * TOSOM — Setup E2E journeys
 * Oppretter Conversation + JourneyProgress + MatchLock for E2E-testbrukere.
 */

import { prisma } from "@/lib/prisma"

async function main() {
  console.log('========================================')
  console.log('  TOSOM — SETUP E2E JOURNEYS')
  console.log('========================================\n')

  // Finn testA og testB
  const userA = await prisma.user.findUnique({ where: { email: 'testA@tosom.dev' } })
  const userB = await prisma.user.findUnique({ where: { email: 'testB@tosom.dev' } })

  if (!userA || !userB) {
    console.error('testA eller testB ikke funnet')
    process.exit(1)
  }

  // Finn matchen mellom A og B
  const match = await prisma.match.findFirst({
    where: {
      OR: [
        { userAId: userA.id, userBId: userB.id },
        { userAId: userB.id, userBId: userA.id },
      ],
      status: 'active',
    },
  })

  if (!match) {
    console.error('Ingen aktiv match funnet mellom testA og testB')
    process.exit(1)
  }
  console.log(`Match funnet: ${match.id} (score: ${match.score})`)

  // Opprett conversation
  const conv = await prisma.conversation.create({
    data: {
      userAId: userA.id,
      userBId: userB.id,
      matchId: match.id,
      imageShareAllowedAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Bilder låst i 14 dager
    },
  })
  console.log(`Conversation opprettet: ${conv.id}`)

  // Opprett journey progress for begge
  for (const user of [userA, userB]) {
    const existing = await prisma.journeyProgress.findUnique({ where: { userId: user.id } })
    if (!existing) {
      const journey = await prisma.journeyProgress.create({
        data: {
          userId: user.id,
          day: 1,
          phase: 'EARLY' as any,
          completedDays: 0,
          nextDayAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Lås neste dag i 24t
          startedAt: new Date(),
        },
      })
      console.log(`Journey opprettet for ${user.email}: day=${journey.day}, phase=${journey.phase}`)

      // Lag første milestone
      await prisma.journeyMilestone.create({
        data: {
          progressId: journey.id,
          day: 1,
          title: 'Dag 1 — Velkommen til reisa',
          summary: 'Reisa di har begynt. Dette er starten på 30 dager sammen med din match.',
        },
      })
    } else {
      console.log(`Journey finnes allerede for ${user.email}`)
    }
  }

  // Oppdater matches til "locked" (reisa er i gang)
  await prisma.match.update({
    where: { id: match.id },
    data: {
      lockedAt: new Date(),
    },
  })

  // --- SLUTTSTATUS ---
  const journeys = await prisma.journeyProgress.findMany({
    include: { user: { select: { email: true } } },
  })
  
  console.log('\n--- JOURNEYS ---')
  for (const j of journeys) {
    console.log(`  ${j.user.email}: dag=${j.day}, fase=${j.phase}, startedAt=${j.startedAt?.toISOString().split('T')[0]}`)
  }

  const convs = await prisma.conversation.findMany({
    include: { userA: { select: { email: true } }, userB: { select: { email: true } } },
  })
  
  console.log('\n--- CONVERSATIONS ---')
  for (const c of convs) {
    console.log(`  ${c.userA.email} <-> ${c.userB.email}: endedAt=${c.endedAt}, imageShared=${c.imageShared}`)
  }

  // Eksporter snapshot
  const fs = await import('fs')
  const report = {
    setupAt: new Date().toISOString(),
    conversationId: conv.id,
    matchId: match.id,
    journeys: journeys.map(j => ({ email: j.user.email, day: j.day, phase: j.phase })),
  }
  fs.writeFileSync('snapshots/e2e-journeys.json', JSON.stringify(report, null, 2))
  console.log('\n✓ Lagret: snapshots/e2e-journeys.json')
}

main().catch(e => {
  console.error('Kritisk feil:', e)
  process.exit(1)
})